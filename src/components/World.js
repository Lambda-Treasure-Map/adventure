import React from "react";
import axios from "axios";
import Config from "./config";

class World extends React.Component {
  constructor() {
    super();
    this.state = {
      roomID: "",
      title: "",
      description: ""
    };
  }

  componentDidMount() {
    this.start();
  }

  start = () => {
    const token = localStorage.getItem("token");
    axios({
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/",

      method: "GET",
      headers: {
        Authorization: `token ${Config.appId} `
      }
    })
      .then(res => {
        this.setState({
          roomID: res.data.room_id,
          title: res.data.title,
          description: res.data.description
        });
        console.log("res.data.room_id", res.data.room_id);
      })
      .catch(err => {
        console.log("errors", err.response);
      });
  };

  render() {
    return (
      <div>
        <p>Room ID: {this.state.roomID}</p>
        <p>Title: {this.state.title}</p>
        <p>Description: {this.state.description}</p>
      </div>
    );
  }
}

export default World;
