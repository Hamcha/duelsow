package main

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type Client struct {
	conn *websocket.Conn

	SignedIn  bool
	Info      PlayerInfo
	Available bool
}

var greetingData = ServerGreetingData{
	APIVersion: APIVersionNumber,
}

func handleClient(conn *websocket.Conn) {
	conn.WriteJSON(ServerMessage{
		OK:           true,
		ResponseType: SRTGreeting,
		Data:         greetingData,
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
	default:
		c.conn.WriteJSON(ServerMessage{
			OK:           false,
			ResponseType: SRTCmdError,
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
