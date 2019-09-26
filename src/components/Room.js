import World from './World';

//Purpose of Room is to isolate each Room's properties
// Fill in Connecting Rooms


class Room {
    constructor(){
        this.state({
            id: null,
            x: null,
            y: null,
            title: "", 
            description: "",
            elevation: "", 
            n_to: null,
            s_to: null,
            e_to: null,
            w_to: null,
            terrain: ""
        })
    }

    get_exits(){
        let exits = [];
        if(this.n_to !== null){
            exits.push('n')
        } 
        if(this.s_to !== null){
            exits.push('s')
        } 
        if(this.e_to !== null){
            exits.push('e')
        } 
        if(this.w_to !== null){
            exits.push('w')
        }
        return exits
    }

    connect_rooms(direction, connectingRoom) {
        if(direction === 'n'){
            this.n_to = connectingRoom
            connectingRoom.s_to = this
        } else if(direction === 's'){
            this.s_to = connectingRoom
            connectingRoom.n_to = this
        } else if(direction === 'e'){
            this.e_to = connectingRoom
            connectingRoom.s_to = this
        } else if(direction === 'w'){
            this.w_to = connectingRoom
            connectingRoom.e_to = this
        } else{
            console.log('Invalid room connection')
            return null
        }
    }

    get_room_in_direction(direction) {
        if (direction === 'n') {
            return this.state.n_to;
        } else if (direction === 's') {
            return this.state.s_to;
        } else if (direction === 'e') {
            return this.state.e_to;
        } else if (direction === 'w') {
            return this.state.w_to;
        }
    }
    print_room_direction() {
        return 'This is my room'
    }
}

export default Room;