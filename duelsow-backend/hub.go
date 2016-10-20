package main

type Hub struct {
	Clients []*Client
	Rooms   map[string]Room
}

func NewHub() *Hub {
	return &Hub{
		Rooms: make(map[string]Room),
	}
}

func (h *Hub) AddClient(c *Client) bool {
	return addClient(c, &h.Clients)
}

func (h *Hub) RemoveClient(c *Client) bool {
	// Remove client from rooms
	for _, room := range h.Rooms {
		room.RemoveClient(c)
	}
	return findAndRemoveClient(c, &h.Clients)
}

func (h *Hub) Broadcast(msg ServerMessage) {
	broadcast(msg, &h.Clients)
}

func (h *Hub) RoomList() []string {
	var list []string
	for name, _ := range h.Rooms {
		list = append(list, name)
	}
	return list
}

func (h *Hub) Stats() ServerStatsData {
	var out ServerStatsData

	out.ClientsTotal = len(h.Clients)
	for _, client := range h.Clients {
		if !client.Busy {
			out.ClientsAvailable += 1
		}
	}

	return out
}

type Room struct {
	Name    string
	Clients []*Client
}

func (r *Room) AddClient(c *Client) bool {
	// Add client to room
	res := addClient(c, &r.Clients)

	// Broadcast join message
	r.Broadcast(ServerMessage{
		ResponseType:  SRTRoomJoin,
		MessageSource: &r.Name,
		Data: ServerRoomJoinData{
			ClientId: c.ClientId,
			Player:   c.Info,
		},
	})

	return res
}

func (r *Room) RemoveClient(c *Client) bool {
	// Broadcast leave message
	r.Broadcast(ServerMessage{
		ResponseType:  SRTRoomPart,
		MessageSource: &r.Name,
		Data: ServerRoomPartData{
			ClientId: c.ClientId,
		},
	})

	// Try to remove client from room
	return findAndRemoveClient(c, &r.Clients)
}

func (r *Room) Broadcast(msg ServerMessage) {
	broadcast(msg, &r.Clients)
}

// "Generic" functions follow, should not be used outside of this file

func addClient(c *Client, list *[]*Client) bool {
	if checkClient(c, list) {
		return false
	}
	// Client not in list, add
	*list = append(*list, c)
	return true
}

func findAndRemoveClient(c *Client, list *[]*Client) bool {
	// Find and remove client from list
	for i, curClient := range *list {
		if curClient == c {
			cLen := len(*list)
			(*list)[i] = (*list)[cLen-1]
			(*list)[cLen-1] = nil
			*list = (*list)[:cLen-1]
			return true
		}
	}
	return false
}

func checkClient(c *Client, list *[]*Client) bool {
	// Find if client is in list
	for _, curClient := range *list {
		if c == curClient {
			return true
		}
	}
	return false
}

func broadcast(msg ServerMessage, list *[]*Client) {
	for _, client := range *list {
		client.conn.WriteJSON(msg)
	}
}
