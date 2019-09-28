import React from "react";
import axios from "axios";
import Config from "./config";
import Player from './Player.js';
import Room from './Room.js';
//set up the move function
//set up an algorithm using the move function to traverse the map
//while (running){ roomGraph = {roomID: [(Coordinates), {direction: nextRoomID}]}}
let oppositeDirection = {'n':'s', 's':'n', 'e':'w', 'w':'e'};
let mapGraph = {};

class World extends React.Component {
  constructor() {
    super();
    this.state = {
      currentRoom: {
            room_id: 0,
            title: '', 
            description: '',
            elevation: '',
            terrain: '',
      },
      exits: [],
      prevRoom: null,
      cooldown: 0
    }


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
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          currentRoom: new Room(res.data),
          cooldown: res.data.cooldown,
          exits: res.data.exits
        });
        console.log("res.data.room_id", this.state.currentRoom);
        console.log('res.data.exits', res.data.exits)
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
        'Content-Type': 'application/json'
      },
      data: {
        direction: direction
      }
    })
      .then(res => {
        console.log("Move Res", res.data);
        //1. This move Function now connects the prevroom to the next room 
        if (!this.state.currentRoom.get_room_in_direction(direction)) {
          console.log('Creating New Room')
          console.log(res.data.room_id, this.state.currentRoom)
          this.setState({
            currentRoom: new Room(res.data),
            prevRoom: this.state.currentRoom,
            cooldown: res.data.cooldown,
            exits: res.data.exits
          });
          console.log('Previous Room Before Connecting: ', this.state.prevRoom)
          this.state.prevRoom.connect_rooms(direction, this.state.currentRoom);
          console.log('Current Room Connected', this.state.currentRoom)
          console.log('Prev Room connected', this.state.prevRoom)
        } else {
          this.setState({
            currentRoom: this.state.currentRoom.get_room_in_direction(direction),
            prevRoom: this.state.currentRoom,
            cooldown: res.data.cooldown
          })
          console.log('in the else', this.state.currentRoom)
        }
      })
      .catch(err => {
        console.log("errors in move", err);
      });
  };
  

  // Traversal Function to Create Map
  // 1. if direction is available and not in mapGraphs room id 
  // 2.   if this.state.currentRoom.n_to/s_to/etc... !== Visited.includes():
  // 3.       then move
  
  createMap = () => {
    // const map = () => {
    let traversalPath = [];
    let reversedPath = [];
    let roomsDictionary = {}
    let id = this.state.currentRoom.id
    let cd = this.state.currentRoom.cooldown
    let exits = this.state.exits
    //Add empty array, and fill with directions used
    mapGraph[this.state.currentRoom.id] = []
    console.log('this returns exits array', exits)
    console.log('this returns false', mapGraph[this.state.currentRoom.id])
    console.log('exits length', exits.length)
    //If i use the exits.shift('n')
    if(exits.shift() === 'n' && !mapGraph[this.state.currentRoom.id].includes('n')){
      //If the Direction allows it 
      //  I will push the direction to my room ID array
      //  if exits.length === map[id].length:
      setTimeout(function(){this.move('n')}.bind(this), cd*5000)
      mapGraph[this.state.currentRoom.id].push('n')
      console.log('moved west and PUSHED', mapGraph[this.state.currentRoom.id].includes('n'))
      console.log('checking if exits lost n', exits)
    }
    if(exits.shift() === 's' && !mapGraph[this.state.currentRoom.id].includes('s')){
      //If the Direction allows it 
      //  I will push the direction to my room ID array
      //  if exits.length === map[id].length:
      //    push room to Visited Array ( in the move function set an if for if current roomid is in visited array, travel back)
      setTimeout(function(){this.move('s')}.bind(this), cd*5000)
      mapGraph[this.state.currentRoom.id].push('s')
      console.log('moved west and PUSHED', mapGraph[this.state.currentRoom.id].includes('s'))
      console.log('checking if exits lost s', exits)
    }
    if(exits.shift() === 'e' && !mapGraph[this.state.currentRoom.id].includes('e')){
      //If the Direction allows it 
      //  I will push the direction to my room ID array
      //  if exits.length === map[id].length:
      //    push room to Visited Array ( in the move function set an if for if current roomid is in visited array, travel back)
      setTimeout(function(){this.move('e')}.bind(this), cd*5000)
      mapGraph[this.state.currentRoom.id].push('e')
      console.log('moved west and PUSHED', mapGraph[this.state.currentRoom.id].includes('e'))
      console.log('checking if exits lost e', exits)
    }
    if(exits.shift() === 'w' && !mapGraph[this.state.currentRoom.id].includes('w')){
      //If the Direction allows it 
      //  I will push the direction to my room ID array
      //  if exits.length === map[id].length:
      //    push room to Visited Array ( in the move function set an if for if current roomid is in visited array, travel back)
      setTimeout(function(){this.move('w')}.bind(this), cd*5000)
      mapGraph[this.state.currentRoom.id].push('w')
      console.log('moved west and PUSHED', mapGraph[this.state.currentRoom.id].includes('w'))
      console.log('checking if exits lost w', exits)
    } 

    // let player = new Player('Mario', this.state.currentRoom)
    // console.log('Player current room', player.state.current_room.id, 'Player name', player.state.name)
    
    // mapGraph[player.state.current_room.id] = this.state.currentRoom.exits;
    // console.log('currentroom exits', this.state.currentRoom.exits)  
    // console.log('MAPGRAPH KEY', mapGraph[player.state.current_room.id])
    // let currentRoom = this.state.currentRoom;
    //     mapGraph[currentRoom.roomID] = currentRoom;
      //   if (!(player.state.current_room.id in Object.keys(roomsDictionary))) {
      //     roomsDictionary[player.state.current_room.id] = player.state.current_room.get_exits();
      //     mapGraph[player.state.current_room.id] = player.state.current_room;
      //     console.log('MAPGRAPH KEY in IF', roomsDictionary[player.state.current_room.id])
      //     // let prevRoom = reversedPath.pop();
          
      //     roomsDictionary[player.state.current_room.id].splice(0);
      //     while (Object.keys(mapGraph[player.state.current_room.id]) === 0) {
      //       let reverseDirection = reversedPath.pop();
      //       traversalPath.push(reverseDirection);
      //       this.move(reverseDirection)
      //     }
  
      //     let exit_direction = roomsDictionary[Object.keys(roomsDictionary[player.state.current_room.id])[0]];
      //     console.log('EXIT DIRECTION', exit_direction)
      //     traversalPath.push(exit_direction);
      //     reversedPath.push(oppositeDirection[exit_direction])
      //     this.move(exit_direction)
      //   }
      // console.log('mapGraph', mapGraph);
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