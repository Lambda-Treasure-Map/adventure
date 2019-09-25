import React from "react";
import axios from "axios";
import Config from "./config";

//set up the move function
//set up an algorithm using the move function to traverse the map
//while (running){ roomGraph = {roomID: [(Coordinates), {direction: nextRoomID}]}}

let mapGraph = {0: [(3, 5), {'n': 1, 's': 5, 'e': 3, 'w': 7}], 1: [(3, 6), {'s': 0, 'n': 2}], 2: [(3, 7), {'s': 1}], 3: [(4, 5), {'w': 0, 'e': 4}], 4: [(5, 5), {'w': 3}], 5: [(3, 4), {'n': 0, 's': 6}], 6: [(3, 3), {'n': 5, 'w': 11}], 7: [(2, 5), {'w': 8, 'e': 0}], 8: [(1, 5), {'e': 7}], 9: [(1, 4), {'n': 8, 's': 10}], 10: [(1, 3), {'n': 9, 'e': 11}], 11: [(2, 3), {'w': 10, 'e': 6}]}
let visited = []
class World extends React.Component {
  constructor() {
    super();
    this.state = { 
        currentRoom: {
            roomID: null,
            title: '',
            description: '',
            coordinates: (0, 0),
            exits: [],
            cooldown: "",
        },
    };
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
    let currentRoom = this.state.currentRoom;
    console.log(`createMap, ${JSON.stringify(currentRoom)}`)
    const opDir = {'n': 's', 's': 'n', 'e': 'w', 'w': 'e'};
    let traversalPath = [];
    let opPath = [];
    // While the Object is less than its length
    while (Object.keys(mapGraph).length <= 512) {
        console.log('in the while loop')
        // If the current room ID is not in the mapGraph
        // Then put it in mapGraph
        // Else: 
        if (visited.values() !== currentRoom.roomID) {
            mapGraph[currentRoom.roomID] = currentRoom.roomID
            console.log('in if 1')
            console.log('cooldown', currentRoom.cooldown)
            //If the exits are 0  !!!! REMEMBER: even dead ends have 1 exits
            //Then Go back by using the opDir
            //Else: nexte IF
            
            //For loop through exits array
            let exits = this.state.currentRoom.exits;
            let cd = this.state.currentRoom.cooldown;
            for(let i = 0; i < exits.length - 1; i++){
                console.log('in the for', exits)
                console.log('in the for', cd)
                if (this.state.currentRoom.exits.length === 1) {
                    // let reverse = opPath.pop();
                    // traversalPath.push(reverse);
                    // this.move(reverse)
                }
                console.log('didnt get in the if')
                console.log('in the for loop')
                    //If exits = n: go north, wait for cooldown
                    if(exits[i] === 'n'){
                        console.log('in the exits if', exits[i])
                        visited.push(currentRoom.roomID)
                        setTimeout(this.move('n'), cd * 5000)
                        console.log('does cd register here', cd)
                    }
                    else if(exits[i] === 's'){
                        console.log('in the exits if', exits[i])
                        visited.push(currentRoom.roomID)
                        setTimeout(this.move('s'), cd * 5000)
                        console.log('does cd register here', cd)
                    }
                    else if(exits[i] === 'e'){
                        console.log('in the exits if', exits[i])
                        visited.push(currentRoom.roomID)
                        setTimeout(this.move('e'), cd * 5000)
                        console.log('does cd register here', cd)
                    }
                    else {
                        console.log('in the exits if', exits[i])
                        visited.push(currentRoom.roomID)
                        setTimeout(this.move('w'), cd * 5000)
                        console.log('does cd register here', cd)
                    }
                
                
            }
            return
            
            //Where i left off: Follow the adv.py player.travel, check player.py for travel, check room.py for getRoomInDirection
            //Basically check the traversal and opposite direction algo
            // let move = exits.shift();

            // traversalPath.push(move);

            // opPath.push(opDir[move]);

            // this.move(move);
        }   
        visited.push(currentRoom.roomID)
        console.log(visited)
    }

    console.log(this.state.currentRoom.exits.length)
    return
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
          <p>Cooldown: {this.state.currentRoom.cooldown}</p>
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
