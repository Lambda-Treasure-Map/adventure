
traversalPath = [] 


room_dict = {} 
reversePath = [] 
opposite_direction = {'n':'s', 's':'n', 'e':'w', 'w':'e'}


room_dict[player.currentRoom.id] = player.currentRoom.getExits()
#Hint hint
#Compare room traverse through all the rooms
while len(room_dict) < len(roomGraph) -1:
#Check if room is visited and if current room is in the path
    if player.currentRoom.id not in room_dict:
        # print(f'current room: {player.currentRoom.id} ')
        room_dict[player.currentRoom.id] = player.currentRoom.getExits()
        # print(player.currentRoom.getExits())
        # print(f'direction that can move {room_dict[player.currentRoom.id]}')
        last_direction = reversePath[-1] #Remove path that has been explored
        room_dict[player.currentRoom.id].remove(last_direction) #Remove direction from last explored
    
    #If every direction is explored
    while len(room_dict[player.currentRoom.id]) == 0:
        reverseDirection = reversePath.pop()
        traversalPath.append(reverseDirection)
        player.travel(reverseDirection)
        
    # print(f'current room: {player.currentRoom}')

    #If there is a room that has not been visited
    move_direction = room_dict[player.currentRoom.id].pop(0)
    #print(f'move direction: {move_direction}')
    traversalPath.append(move_direction)
    reversePath.append(opposite_direction[move_direction])
    player.travel(move_direction)