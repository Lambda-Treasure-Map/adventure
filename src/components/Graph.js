import React from 'react';

class Graph {
    constructor() {
        super();

        this.state = {
            rooms: {},
            visited_rooms: new Set()
        }

        let fs = require('Graph.txt');
        let data = '';
        let fsVisited = require('Visited.txt');
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
        fs.writeFile('Graph.txt', data, (err) => {
            if (err) throw err;
        })
    }

    load_graph() {
        fs.readFile('Graph.txt', (err, data) => { 
            if (err) throw err; 
        
            console.log(data.toString()); 
        })
    }

    save_visited() {
        fsVisited.writeFile('Visited.txt', visitedData, (err) => {
            if (err) throw err;
        })
    }

    load_visited() {
        fsVisisted.readFile('Graph.txt', (err, visitedData) => { 
            if (err) throw err; 
        
            console.log(data.toString()); 
        })
    }
}

export default Graph;