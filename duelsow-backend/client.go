package main

import (
	"fmt"

	"github.com/gorilla/websocket"
)

var greetingData = ServerGreetingData{
	APIVersion: APIVersionNumber,
}

func handleClient(conn *websocket.Conn) {
	conn.WriteJSON(ServerMessage{
		OK:           true,
		ResponseType: SRTGreeting,
		Data:         greetingData,
	})

	for {
		var message ClientMessage
		err := conn.ReadJSON(&message)
		if err != nil {
			if !websocket.IsCloseError(err) {
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

		switch message.ActionType {
		default:
			conn.WriteJSON(ServerMessage{
				OK:           false,
				ResponseType: SRTCmdError,
				Error: &ServerError{
					ErrorType: SETUnknownCmd,
					Message:   fmt.Sprintf("Command not recognized: %s", message.ActionType),
				},
			})
		}
	}
}
