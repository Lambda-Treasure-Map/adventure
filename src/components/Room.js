import World from "./World";

//Purpose of Room is to isolate each Room's properties
// Fill in Connecting Rooms

class Room {
  constructor(room) {
    this.id = room.room_id;
    this.x = null;
    this.y = null;
    this.title = room.title;
    this.description = room.description;
    this.elevation = room.elevation;
    this.n_to = null;
    this.s_to = null;
    this.e_to = null;
    this.w_to = null;
    this.terrain = room.terrain;
    this.exits = room.exits;
  }

  init_exits() {
    let exits = [];
    if (this.n_to === null && this.exits.includes("n")) {
      exits.push("n");
    }
    if (this.s_to === null && this.exits.includes("s")) {
      exits.push("s");
    }
    if (this.w_to === null && this.exits.includes("w")) {
      exits.push("w");
    }
    if (this.e_to === null && this.exits.includes("e")) {
      exits.push("e");
    }
    return exits;
  }
  get_exits() {
    let exits = [];
    if (this.n_to !== null) {
      exits.push("n");
    }
    if (this.s_to !== null) {
      exits.push("s");
    }
    if (this.e_to !== null) {
      exits.push("e");
    }
    if (this.w_to !== null) {
      exits.push("w");
    }
    return exits;
  }

  connect_rooms(direction, connectingRoom) {
    if (direction === "n") {
      this.n_to = connectingRoom;
      connectingRoom.s_to = this;
    } else if (direction === "s") {
      this.s_to = connectingRoom;
      connectingRoom.n_to = this;
    } else if (direction === "e") {
      this.e_to = connectingRoom;
      connectingRoom.s_to = this;
    } else if (direction === "w") {
      this.w_to = connectingRoom;
      connectingRoom.e_to = this;
    } else {
      console.log("Invalid room connection");
      return null;
    }
  }

  get_room_in_direction(direction) {
    if (direction === "n") {
      return this.n_to;
    } else if (direction === "s") {
      return this.s_to;
    } else if (direction === "e") {
      return this.e_to;
    } else if (direction === "w") {
      return this.w_to;
    }
  }
  print_room_direction() {
    return "This is my room";
  }
}

export default Room;
