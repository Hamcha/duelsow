package main

import (
	"fmt"
	"strings"

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
		c.sendMsg(message, ServerMessage{
			ResponseType: SRTStats,
			Data:         hub.Stats(),
		})
	case CATLogIn:
		name, nameok := message.Params["Name"]
		rank, rankok := message.Params["Rank"]
		if !nameok || !rankok {
			// Wrong format!
			c.sendError(message, ServerError{
				ErrorType: SETWrongFormat,
				Message:   "Login parameters are specified in the wrong format",
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
		c.sendMsg(message, ServerMessage{
			ResponseType: SRTSignedIn,
			Data: ServerLoginData{
				Player: c.Info,
			},
		})
	case CATRoomJoin:
		roomname := strings.ToLower(message.Params["Name"])
		if len(roomname) < 1 {
			c.sendError(message, ServerError{
				ErrorType: SETWrongFormat,
				Message:   fmt.Sprintf("Room name is missing or empty"),
			})
		}
		room := hub.GetRoom(roomname)
		result := room.AddClient(c)
		if result {
			c.sendMsg(message, ServerMessage{
				ResponseType: SRTRoomJoined,
				Data: ServerRoomJoinedData{
					RoomName: roomname,
					Players:  room.PlayerList(),
				},
			})
		} else {
			c.sendError(message, ServerError{
				ErrorType: SETAlreadyInRoom,
				Message:   fmt.Sprintf("You are already inside '%s'", roomname),
			})
		}
	case CATRoomPart:
		roomname := strings.ToLower(message.Params["Name"])
		if len(roomname) < 1 {
			c.sendError(message, ServerError{
				ErrorType: SETWrongFormat,
				Message:   fmt.Sprintf("Room name is missing or empty"),
			})
		}
		room := hub.GetRoom(roomname)
		result := room.RemoveClient(c)
		if result {
			c.sendMsg(message, ServerMessage{
				ResponseType: SRTRoomParted,
				Data: ServerRoomPartedData{
					RoomName: roomname,
				},
			})
		} else {
			c.sendError(message, ServerError{
				ErrorType: SETNotInRoom,
				Message:   fmt.Sprintf("You are not in '%s'", roomname),
			})
		}
	default:
		c.sendError(message, ServerError{
			ErrorType: SETUnknownCmd,
			Message:   fmt.Sprintf("Command not recognized: %s", message.ActionType),
		})
	}
}

func (c *Client) Cleanup() {
	// Remove client from hub before destroying it
	if c.SignedIn {
		hub.RemoveClient(c)
	}
}

func (c *Client) sendMsg(cm ClientMessage, msg ServerMessage) error {
	msg.OK = true
	msg.ReplyTag = &cm.Tag
	return c.conn.WriteJSON(msg)
}

func (c *Client) sendError(cm ClientMessage, err ServerError) error {
	return c.conn.WriteJSON(ServerMessage{
		OK:           false,
		ResponseType: SRTCmdError,
		ReplyTag:     &cm.Tag,
		Error:        &err,
	})
}
