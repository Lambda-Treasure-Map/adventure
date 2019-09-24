import React from "react";
import axios from "axios";
import Config from "./config";

//set up the move function
//set up an algorithm using the move function to traverse the map
//while (running){ roomGraph = {roomID: [(Coordinates), {direction: nextRoomID}]}}

class World extends React.Component {
  constructor() {
    super();
    this.state = { 
        currentRoom: {
            roomID: null,
            title: '',
            description: '',
            coordinates: (0, 0),
            exits: []
        },
        mapGraph: {}
    };
  }

  componentDidMount() {
    this.start();
    // this.move();
    this.createMap();
  }

  start = () => {
    // const token = localStorage.getItem("token");
    axios({
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/",

      method: "GET",
      headers: {
        Authorization: `Token ${Config.appId}`
      }
    })
      .then(res => {
        this.setState({
            currentRoom: {
                roomID: res.data.room_id,
                title: res.data.title,
                description: res.data.description,
                coordinates: res.data.coordinates,
                exits: res.data.exits
              }
        });
        console.log("res.data.room_id", res.data.room_id);
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
        Authorization: `Token ${Config.appId}`
      },
      data: {
        direction: direction
      }
    })
      .then(res => {
        console.log("moving data", res.data);
        this.setState({
            currentRoom: {
                roomID: res.data.room_id,
                title: res.data.title,
                description: res.data.description,
                coordinates: res.data.coordinates,
                exits: res.data.exits
              }
        });
      })
      .catch(err => {
        console.log("errors in move", err.response);
      });
  };

createMap = () => {
    let currentRoom = this.state.currentRoom;
    const opDir = {'n': 's', 's': 'n', 'e': 'w', 'w': 'e'};
    let traversalPath = [];
    let opPath = [];

    while (Object.keys(this.state.mapGraph).length < 500) {
        if (!currentRoom.room_id in this.state.mapGraph) {
            this.setState = {
                mapGraph: {
                    ...this.state.mapGraph,
                    currentRoom
                }
            }

            if (this.state.currentRoom.exits.length === 0) {
                let reverse = opPath.pop();
                traversalPath.push(reverse);
                this.move(reverse)
            }

            let exits = this.state.currentRoom.exits;

            let move = exits.shift();

            traversalPath.push(move);

            opPath.push(opDir[move]);

            this.move(move);
        }   
    }

    console.log(this.state.mapGraph)
}

  render() {
    return (
      <div>
        <div>
          <p>Room ID: {this.state.currentRoom.roomID}</p>
          <p>Title: {this.state.currentRoom.title}</p>
          <p>Description: {this.state.currentRoom.description}</p>
          <p>Coordinates: {this.state.currentRoom.coordinates}</p>
          <p>Possible Exits: {this.state.currentRoom.exits}</p>
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
        </div>
      </div>
    );
  }
}

export default World;
