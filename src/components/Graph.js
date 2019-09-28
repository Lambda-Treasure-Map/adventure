import React from 'react';
// import
class Graph {
    constructor() {
        this.state = {
            rooms: {},
            visited_rooms: new Set()
        }

        let fs = require('./Graph.txt');
        let data = '';
        let fsVisited = require('./Visited.txt');
        let visitedData = '';
    }

    add_room(room) {
        this.state.rooms[room] = new Set();
    }

    visited_room(room_id) {
        if (this.state.visited_rooms.includes(room_id)) {
            return true;
        } else {
            return false;
        }
    }

    visit_room(room_id) {
        if (this.visited_room()) {
            return
        } else {
            this.state.visited_rooms.push(room_id);
        }
    }

    save_graph() {
        this.fs.writeFile('Graph.txt', this.data, (err) => {
            if (err) throw err;
        })
    }

    load_graph() {
        this.fs.readFile('Graph.txt', (err, data) => { 
            if (err) throw err; 
        
            console.log(data.toString()); 
        })
    }

    save_visited() {
        this.fsVisited.writeFile('Visited.txt', this.visitedData, (err) => {
            if (err) throw err;
        })
    }

    load_visited() {
        this.fsVisisted.readFile('Graph.txt', (err, visitedData) => { 
            if (err) throw err; 
        
            console.log(this.data.toString()); 
        })
    }
}

export default Graph;