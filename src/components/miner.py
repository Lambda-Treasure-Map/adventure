import hashlib
import requests
import sys
from uuid import uuid4
from timeit import default_timer as timer


def proof_of_work(last_p):
    pass


def valid_p(last_h, proof):
    pass


x = 1
if x == 1:
    if len(sys.argv) > 1:
        node = sys.argv[1]
    else:
        node = "https://lambda-treasure-hunt.herokuapp.com/api/bc"

    coins = 0

    id = ""

    r = requests.get(url=node + "/last_proof/")
    data = r.json()

    new_proof = proof_of_work(data.get('proof'))
    post_data = {"proof": new_proof, "id": id}

    r = requests.post(url=node + "/mine/")
    data = r.json()
