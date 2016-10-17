package main

type Hub struct {
	Clients []*Client
	Rooms   map[string]Room
}

func (h *Hub) AddClient(c *Client) bool {
	return addClient(c, h.Clients)
}

func (h *Hub) RemoveClient(c *Client) bool {
	// Remove client from rooms
	for _, room := range h.Rooms {
		room.RemoveClient(c)
	}
	return findAndRemoveClient(c, h.Clients)
}

type Room struct {
	Name    string
	Clients []*Client
}

func (r *Room) AddClient(c *Client) bool {
	return addClient(c, r.Clients)
}

func (r *Room) RemoveClient(c *Client) bool {
	return findAndRemoveClient(c, r.Clients)
}

func addClient(c *Client, list []*Client) bool {
	// Check if client is already in
	for _, curClient := range list {
		if curClient == c {
			return false
		}
	}
	// Client not in list, add
	list = append(list, c)
	return true
}

func findAndRemoveClient(c *Client, list []*Client) bool {
	// Find and remove client from list
	for i, curClient := range list {
		if curClient == c {
			cLen := len(list)
			list[i] = list[cLen-1]
			list[cLen-1] = nil
			list = list[:cLen-1]
			return true
		}
	}
	return false
}
