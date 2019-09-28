import React from "react";
import axios from "axios";
import Config from "./config";
import SHA256 from 'crypto-js/sha256';

import Room from "./Room.js";


//set up the move function
//set up an algorithm using the move function to traverse the map
//while (running){ roomGraph = {roomID: [(Coordinates), {direction: nextRoomID}]}}

class World extends React.Component {
  constructor() {
    super();
    this.state = {
      currentRoom: {
        room_id: 0,
        title: "",
        description: "",
        elevation: "",
        terrain: ""
      },
      exits: [],
      prevRoom: null,
      cooldown: 0,
      itemsInRoom: [],
      inventory: [],
      name: '',
      gold: 0,
      proof: 0,
      difficulty: 0,
      minedCoins: 0
    };
  }

  componentDidMount() {
    this.start();
  }

  start = () => {
    // const token = localStorage.getItem("token");
    axios({
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/",

      method: "GET",
      headers: {
        Authorization: `Token ${Config.appId}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log("INITIAL RES LOG", res.data);
        this.setState({
          currentRoom: new Room(res.data),
          cooldown: res.data.cooldown,
          exits: res.data.exits,
          itemsInRoom: res.data.items
        });
        console.log("res.data.room_id", this.state.currentRoom);
        console.log("res.data.exits", res.data.exits);
      })
      .catch(err => {
        console.log("errors", err.response);
        console.log("process", Config.appId);
      });
  };

  move = direction => {
    // const token = localStorage.getItem("token");
    axios({
      url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
      method: "POST",
      headers: {
        Authorization: `token ${Config.appId}`,
        "Content-Type": "application/json"
      },
      data: {
        direction: direction
      }
    })
      .then(res => {
        console.log("moving data", res.data);
        console.log("current room ID: ", this.state);
        if (!this.state.currentRoom.get_room_in_direction(direction)) {
          console.log(this.state.currentRoom.get_room_in_direction());
          console.log(
            "GET ROOMS condition",
            this.state.currentRoom.get_room_in_direction(direction)
          );
          console.log("CREATING NEW ROOM");
          console.log(res.data.room_id, this.state.currentRoom.id);
          this.setState({
            currentRoom: new Room(res.data),
            prevRoom: this.state.currentRoom,
            cooldown: res.data.cooldown
          });
          console.log("Previous Room: ", this.state.prevRoom);
          this.state.prevRoom.connect_rooms(direction, this.state.currentRoom);
        } else {
          this.setState({
            currentRoom: this.state.currentRoom.get_room_in_direction(
              direction
            ),
            prevRoom: this.state.currentRoom,
            cooldown: res.data.cooldown
          });
        }
      })
      .catch(err => {
        console.log("errors in move", err);
      });
  };

  pickUpItems = () => {
    axios({
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/take/',
      method: "POST",
      headers: {
        Authorization: `token ${Config.appId}`,
        "Content-Type": "application/json"
      },
      data: {
        'name': this.state.itemsInRoom[0]
      }
    })
    .then(res => {
      console.log('RESPONSE ITEMS', res.data.items)
      // this.setState({
      //   inventory: res.data.items
      // })
    })
    .catch(err => {
      console.log("errors", err.response);
    });
  }

  sellItems = () => {
    axios({
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/',
      method: "POST",
      headers: {
        Authorization: `token ${Config.appId}`,
        "Content-Type": "application/json"
      },
      data: {
        name: this.state.inventory[0],
        confirm: 'yes'
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log("errors", err.response);
    });
  }

  seeInventory =() => {
    axios({
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/',
      method: 'POST', 
      headers: {
        Authorization: `token ${Config.appId}`,
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      this.setState({
        inventory: res.data.inventory,
        gold: res.data.gold,
        name: res.data.name
      })
    })
    .catch(err => {
      console.log("errors", err.response);
    });
  }

  changeName = () => {
    axios({
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/change_name/',
      method: 'POST',
      headers: {
        Authorization: `token ${Config.appId}`,
        "Content-Type": "application/json"
      },
      data: {
        name: 'Mario',
        confirm: 'aye'
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log("errors", err.response);
    });
  }

  // Miner

  proofOfWork = lastProof => {
    let proof = this.state.proof;

    do {
      proof += Math.floor(Math.random(1, 21) * 5);
      console.log(`Proof found: ${proof}`);
    } while (this.validProof(lastProof, proof) === false);

    return proof;
  };

  validProof = (lastProof, proof) => {
    let guess = encodeURI(`${lastProof}${proof}`);
    let guess_hash = `${SHA256(guess)}`;
    let leadingZeros = guess_hash;

    return (
      guess_hash.substring(0, this.state.difficulty) ===
      `${leadingZeros.padStart(this.state.difficulty + 1, "0")}`
    );
  };

  getProof = () => {
    axios
      .get("https://lambda-treasure-hunt.herokuapp.com/api/bc/last_proof/", {
        headers: {
          Authorization: `Token ${Config.appId}`
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          proof: res.data.proof,
          difficulty: res.data.difficulty
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  mineCoin = () => {
    let lastProof = this.state.proof;
    let newProof = this.proofOfWork(lastProof);

    axios
      .post(
        "https://lambda-treasure-hunt.herokuapp.com/api/bc/mine/",
        {
          proof: newProof
        },
        {
          headers: {
            Authorization: `Token ${Config.appId}`
          }
        }
      )
      .then(res => {
        console.log("Successfully Mined a coin!", res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  render() {
    return (
      <div>
        <div>
          <p>Room ID: {this.state.currentRoom.id}</p>
          <p>Title: {this.state.currentRoom.title}</p>
          <p>Description: {this.state.currentRoom.description}</p>
          <p>Coordinates: {this.state.currentRoom.coordinates}</p>
          <p>Possible Exits: {this.state.currentRoom.exits}</p>
          <p>cooldown: {this.state.cooldown}</p>
          <p>Available Items: {this.state.itemsInRoom}</p>
          <p>inventory: {this.state.inventory}</p>
          <p>Gold: {this.state.gold}</p>
          <p>Player name: {this.state.name}</p>
        </div>
        <div>
          <button
            type='button'
            className='btn north'
            onClick={() => this.move("n")}
          >
            North
          </button>
          <button
            type='button'
            className='btn south'
            onClick={() => this.move("s")}
          >
            South
          </button>
          <button
            type='button'
            className='btn east'
            onClick={() => this.move("e")}
          >
            East
          </button>
          <button
            type='button'
            className='btn west'
            onClick={() => this.move("w")}
          >
            West
          </button>
          <button onClick={() => this.pickUpItems()}>Pick up item</button>
          <button onClick={() => this.seeInventory()}>See inventory</button>
          <button onClick={() => this.sellItems()}>Sell items</button>
          <button onClick={() => this.changeName()}>Change Name!</button>
          <button onClick={() => this.mineCoin()}>MINE!!</button>
        </div>
      </div>
    );
  }
}

export default World;
