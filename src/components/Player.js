import React from 'react';

class Player {
    constructor() {
        super();
        this.state = {
            new_name: name,
            current_room: null,


            name: null,
            encumbrance: 0,
            strength: 0,
            speed: 0,
            gold: 0,
            inventory = []
        }
    }



    travel(id, direction, showRooms){
        nextRoom = this.state.current_room.get_room_in_direction(direction)
        if (nextRoom !== null) {
            this.state.current_room = nextRoom
            if (showRooms) {
                nextRoom.print_room_direction(this)
            } else {
                console.log('Invalid Direction')
            }
        }
    }

    get_opposite_direction(direction){
        const directions = { n: "s", s: "n", e: "w", w: "e" };
        return directions[direction]
    }

    bfs (starting_vertex) {
        //checks the direction key in the vertices
        let stack = []
        let visited = Set()
        stack.push([starting_vertex])
        while(stack.length > 0){
          let path = stack.shift()
          let node = path[path.length - 1]
          if(!visited.has(node)){ 
              // Ask Lukas about this 
            if(visited_room(room_id)){
              return path
            } else {
              visited.add(node)
              for(let connection = 0; i < Object.values(vertices[node]).length; i++){
                copy_path = [...path]
                copy_path.push(connection)
                stack.push(copy_path)
              }
            }
          }
        }
      }

    //   bfs_to_destination

    


}

export default Player;