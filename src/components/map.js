createMap = () => {
  const map = () => {
    let currentRoom = this.state.currentRoom;
    console.log(`createMap, ${JSON.stringify(currentRoom)}`);
    const opDir = { n: "s", s: "n", e: "w", w: "e" };
    let traversalPath = [];
    let opPath = [];

    if (mapGraph[currentRoom.roomID] !== currentRoom.roomID) {
      mapGraph[currentRoom.roomID] = currentRoom;

      let exits = this.state.currentRoom.exits;

      const exit = exits => {
        let move = exits[Math.floor(Math.random() * exits.length - 1)];

        if (this.state.currentRoom.exits.length === 0) {
          let reverse = opPath.pop();
          console.log("reversed", reverse);
          traversalPath.push(reverse);
          this.move(reverse);
        }

        traversalPath.push(move);

        opPath.push(opDir[move]);

        console.log("move dir", move);
        console.log("cooldown", this.state.currentRoom.cooldown);
        console.log("roomID", this.state.currentRoom.roomID);
        this.move(move);
        console.log("move ran");
      };
      exit(exits);
    }

    console.log(mapGraph);
  };
  setInterval(map, 16000);
};
