from typing import List

import asyncio
import websockets
import json
from collections import defaultdict
from random import randrange


clients = {}
client_ids = []  # type: List[str]
id_location = {}


def add_client(id, websocket):
    if id in clients:
        remove_client(id)
    clients[id] = websocket
    id_location[id] = len(client_ids)
    client_ids.append(id)


def remove_client(id):
    global client_ids

    del clients[id]
    if len(client_ids) <= 1:
        client_ids = []
        return

    at = id_location[id]
    del id_location[id]

    swap_index = len(client_ids) - 1
    client_ids[at], client_ids[swap_index] = client_ids[swap_index], client_ids[at]
    id_location[client_ids[at]] = at

    client_ids.pop()


async def connect_request(peer_2, received_message):
    peer_1 = None
    for i in range(10):
        peer_1 = client_ids[randrange(0, len(client_ids))]
        if peer_1 != peer_2:
            break
    if not peer_1 or peer_1 == peer_2:
        return
    message = {
        "type": "request",
        "signal": received_message["signal"],
        "destination": peer_2,
    }
    await clients[peer_1].send(json.dumps(message))


async def connect_response(peer_1, received_message):
    peer_2 = received_message["destination"]
    message = {
        "type": "response",
        "signal": received_message["signal"],
    }
    if peer_2 in clients:
        await clients[peer_2].send(json.dumps(message))


async def hello(websocket, path):
    try:
        id = await websocket.recv()
        add_client(id, websocket)
        print("Connected {}".format(id))
        while True:
            message = await websocket.recv()
            message = json.loads(message)
            message_type = message["type"]
            if message_type == "request":
                print("Connection request by {}".format(id))
                await connect_request(id, message)
            elif message_type == "response":
                print("Connection response by {}".format(id))
                await connect_response(id, message)
            else:
                print("Unrecognized message from {}".format(id))
    finally:
        remove_client(id)
        print("Disconnected {}".format(id))


start_server = websockets.serve(hello, "localhost", 4059)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
