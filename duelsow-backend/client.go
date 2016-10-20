package main

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type Client struct {
	conn *websocket.Conn

	SignedIn bool
	ClientId int
	Info     PlayerInfo
	Busy     bool
}

func handleClient(conn *websocket.Conn) {
	conn.WriteJSON(ServerMessage{
		OK:           true,
		ResponseType: SRTGreeting,
		Data: ServerGreetingData{
			Rooms: hub.RoomList(),
		},
	})

	client := Client{
		conn:     conn,
		SignedIn: false,
	}
	defer client.Cleanup()

	for {
		var message ClientMessage
		err := conn.ReadJSON(&message)
		if err != nil {
			if !websocket.IsCloseError(err) || !websocket.IsUnexpectedCloseError(err) {
				fmt.Println(err)
				conn.WriteJSON(ServerMessage{
					OK:           false,
					ResponseType: SRTFatalError,
					Error: &ServerError{
						ErrorType: SETReadError,
						Message:   fmt.Sprintf("Read message fail: %s", err.Error()),
					},
				})
			}
			return
		}

		client.HandleMessage(message)
	}
}

func (c *Client) HandleMessage(message ClientMessage) {
	switch message.ActionType {
	case CATStats:
		c.conn.WriteJSON(ServerMessage{
			OK:           true,
			ResponseType: SRTStats,
			ReplyTag:     &message.Tag,
			Data:         hub.Stats(),
		})
	case CATLogIn:
		name, nameok := message.Params["Name"]
		rank, rankok := message.Params["Rank"]
		if !nameok || !rankok {
			// Wrong format!
			c.conn.WriteJSON(ServerMessage{
				OK:           false,
				ResponseType: SRTCmdError,
				ReplyTag:     &message.Tag,
				Error: &ServerError{
					ErrorType: SETWrongFormat,
					Message:   "Login parameters are specified in the wrong format",
				},
			})
			return
		}

		// Set player info
		c.Info = PlayerInfo{
			Name: name,
			Rank: rank,
		}
		c.SignedIn = true
		c.Busy = false

		// Add player to hub
		hub.AddClient(c)

		// Send successful login
		c.conn.WriteJSON(ServerMessage{
			OK:           true,
			ResponseType: SRTSignedIn,
			ReplyTag:     &message.Tag,
			Data: ServerLoginData{
				Player: c.Info,
			},
		})
	default:
		c.conn.WriteJSON(ServerMessage{
			OK:           false,
			ResponseType: SRTCmdError,
			ReplyTag:     &message.Tag,
			Error: &ServerError{
				ErrorType: SETUnknownCmd,
				Message:   fmt.Sprintf("Command not recognized: %s", message.ActionType),
			},
		})
	}
}

func (c *Client) Cleanup() {
	// Remove client from hub before destroying it
	if c.SignedIn {
		hub.RemoveClient(c)
	}
}
