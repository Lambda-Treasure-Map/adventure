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
      roomID: "",
      title: "",
      description: "",
      coordinates: (0, 0),
      exits: []
    };
  }

  componentDidMount() {
    this.start();
    this.move();
  }

  start = () => {
    const token = localStorage.getItem("token");
    axios({
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/",

      method: "GET",
      headers: {
        Authorization: `Token ${Config.appId}`
      }
    })
      .then(res => {
        this.setState({
          roomID: res.data.room_id,
          title: res.data.title,
          description: res.data.description,
          coordinates: res.data.coordinates,
          exits: res.data.exits
        });
        console.log("res.data.room_id", res.data.room_id);
      })
      .catch(err => {
        console.log("errors", err.response);
        console.log("process", Config.appId);
      });
  };

  move = direction => {
    const token = localStorage.getItem("token");
    axios({
      url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
      method: "POST",
      headers: {
        Authorization: `Token 074e3de039fb3f4bb005ccb7865facb83718aed2`
      },
      data: {
        direction: direction
      }
    })
      .then(res => {
        console.log("moving data", res.data);
        this.setState({
          roomID: res.data.room_id,
          title: res.data.title,
          description: res.data.description,
          coordinates: res.data.coordinates,
          exits: res.data.exits
        });
      })
      .catch(err => {
        console.log("errors in move", err.response);
      });
  };

  render() {
    return (
      <div>
        <div>
          <p>Room ID: {this.state.roomID}</p>
          <p>Title: {this.state.title}</p>
          <p>Description: {this.state.description}</p>
          <p>Coordinates: {this.state.coordinates}</p>
          <p>Possible Exits: {this.state.exits}</p>
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
