import React from "react";
import axios from "axios";
import Config from "./config";

import Player from "./Player.js";
import Room from "./Room.js";
import Graph from "./Graph.js";

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
      cooldown: 0
    };
  }

  componentDidMount() {
    this.start();
    // this.move();
  }

  //Receive all elements of the Rooms

  //Functions:
  // 1. Takes current object, return possible exits +
  // 2. Vertices = Given room: and direction: next room
  // 3. Get Room in the Direction

  //Save the information to a file or localstorage or api

  //make a room Class: in the state -> n: , S: , e: , w: ,
  //mapStatetoProps from World to Class ->

  // bfs =(starting_vertex) => {
  //   //checks the direction key in the vertices
  //   let stack = []
  //   let visited = Set()
  //   stack.push([starting_vertex])
  //   while(stack.length > 0){
  //     let path = stack.shift()
  //     let node = path[path.length - 1]
  //     if(!visited.has(node)){
  //       if('visited[roomID] = ??'){
  //         return path
  //       } else{
  //         visited.add(node)
  //         for(let connection = 0; i < Object.values(vertices[node]).length; i++){
  //           copy_path = [...path]
  //           copy_path.push(connection)
  //           stack.push(copy_path)
  //         }
  //       }
  //     }
  //   }

  //}

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
          exits: res.data.exits
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

  createMap = () => {
    const map = () => {
      let traversalPath = [];
      let reversedPath = [];
      let mapGraph = {};
      let oppositeDirection = { n: "s", s: "n", e: "w", w: "e" };
      let roomsDictionary = {};

      let player = new Player("Mario", this.state.currentRoom);

      console.log(
        "Player current room",
        player.state.current_room,
        "Player name",
        player.state.name,
        "Current room ID",
        player.state.current_room.id
      );

      mapGraph[player.state.current_room.id] = player.state.current_room;

      roomsDictionary[
        player.state.current_room.id
      ] = player.state.current_room.get_exits();

      if (roomsDictionary[player.state.current_room.id].length === 0) {
        roomsDictionary[
          player.state.current_room.id
        ] = player.state.current_room.init_exits();
      }

      if (!(player.state.current_room.id in Object.keys(roomsDictionary))) {

        roomsDictionary[player.state.current_room.id] = player.state.current_room.get_exits();

        console.log("getexits",roomsDictionary[player.state.current_room.id] = player.state.current_room.get_exits() )

        console.log("exits length", roomsDictionary[player.state.current_room.id].length);

        if (roomsDictionary[player.state.current_room.id].length === 0) {roomsDictionary[player.state.current_room.id] = player.state.current_room.init_exits();
        }

        mapGraph[player.state.current_room.id] = player.state.current_room;

        

        while (Object.keys(mapGraph[player.state.current_room.id]) === 0) {
          let reverseDirection = reversedPath.pop();

          traversalPath.push(reverseDirection);

          this.move(reverseDirection);
        }

        let exit_direction = roomsDictionary[player.state.current_room.id][0];

    

        traversalPath.push(exit_direction);

        reversedPath.push(oppositeDirection[exit_direction]);

        this.move(exit_direction);
      }

      console.log("mapGraph", mapGraph);
    };

    setInterval(map, 7000);
  };

  render() {
    return (
      <div>
        <div>
          <p>Room ID: {this.state.currentRoom.room_id}</p>
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
