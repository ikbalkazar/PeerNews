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


def connect_request(peer_2, received_message):
    peer_1 = client_ids[randrange(0, len(client_ids))]
    message = {
        "type": "request",
        "signal": received_message["signal"],
        "destination": peer_2,
    }
    clients[peer_1].send(json.dumps(message))


def connect_response(peer_1, received_message):
    peer_2 = received_message["destination"]
    message = {
        "type": "response",
        "signal": received_message["signal"],
    }
    if peer_2 in clients:
        clients[peer_2].send(json.dumps(message))


async def hello(websocket, path):
    try:
        id = await websocket.recv()
        add_client(id, websocket)
        while True:
            message = await websocket.recv()
            message = json.loads(message)
            message_type = message["type"]
            if message_type == "request":
                print("Connection request by {}".format(id))
                connect_request(id, message)
            elif message_type == "response":
                print("Connection response by {}".format(id))
                connect_response(id, message)
            else:
                print("Unrecognized message from {}".format(id))
    finally:
        remove_client(id)


start_server = websockets.serve(hello, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
