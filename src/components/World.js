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
        title: "",
        description: "",
        coordinates: (0, 0),
        exits: [],
        cooldown: 15
      }
    };
    this.move = this.move.bind(this);
  }

  componentDidMount() {
    this.start();
    // this.move();
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
            exits: res.data.exits,
            cooldown: res.data.cooldown
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
        Authorization: `token ${Config.appId}`
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
            exits: res.data.exits,
            cooldown: res.data.cooldown
          }
        });
      })
      .catch(err => {
        console.log("errors in move", err.response);
      });
  };

  createMap = () => {
    const map = () => {
      let currentRoom = this.state.currentRoom;
      console.log(`createMap, ${JSON.stringify(currentRoom)}`);
      const opDir = { n: "s", s: "n", e: "w", w: "e" };
      let mapGraph = {};
      let traversalPath = [];
      let opPath = [];

      if (mapGraph[currentRoom.roomID] !== currentRoom.roomID) {
        mapGraph[currentRoom.roomID] = currentRoom;
        console.log("opb4", opPath);
        opPath.splice(opPath[opPath.length - 1]);
        console.log("opafter", opPath);

        while (this.state.currentRoom.exits.length === 0) {
          let reverse = opPath.pop();
          traversalPath.push(reverse);
          this.move(reverse);
        }

        let exits = this.state.currentRoom.exits;
        console.log("exitsb4", exits);

        console.log("exitsafter", exits);

        let move = exits.shift();

        traversalPath.push(move);

        opPath.push(opDir[move]);

        console.log("move dir", move);
        console.log("cooldown", this.state.currentRoom.cooldown);
        console.log("roomID", this.state.currentRoom.roomID);
        this.move(move);
        console.log("move ran");
      }

      console.log(mapGraph);
    };
    setInterval(map, 16000);
  };

  render() {
    return (
      <div>
        <div>
          <p>Room ID: {this.state.currentRoom.roomID}</p>
          <p>Title: {this.state.currentRoom.title}</p>
          <p>Description: {this.state.currentRoom.description}</p>
          <p>Coordinates: {this.state.currentRoom.coordinates}</p>
          <p>Possible Exits: {this.state.currentRoom.exits}</p>
          <p>cooldown: {this.state.currentRoom.cooldown}</p>
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
          <button onClick={() => this.createMap()}>CREATE MAP</button>
        </div>
      </div>
    );
  }
}

export default World;
