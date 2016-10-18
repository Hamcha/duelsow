package main

//
// Client requests struct/infos
//

type ClientActionType string

const (
	// Hub/Auth actions
	CATLogIn  ClientActionType = "login"
	CATLogOut ClientActionType = "logout"
	CATStats  ClientActionType = "stats"

	// Room actions
	CATRoomJoin ClientActionType = "room-join"
	CATRoomPart ClientActionType = "room-part"
)

type ClientMessage struct {
	Tag        string
	ActionType ClientActionType
	Params     interface{}
}

type PlayerInfo struct {
	Name string
	Rank string
}

type LoginParams struct {
	Player PlayerInfo
}

//
// Server response struct/infos
//

type ServerResponseType string

const (
	// Server messages
	SRTGreeting ServerResponseType = "greet"
	SRTRoomJoin ServerResponseType = "room-join"
	SRTRoomPart ServerResponseType = "room-part"
	SRTStats    ServerResponseType = "stats"

	// Errors
	SRTCmdError   ServerResponseType = "error-cmd"
	SRTFatalError ServerResponseType = "error-fatal"
)

type ServerErrorType string

const (
	SETReadError  ServerErrorType = "read error"
	SETUnknownCmd ServerErrorType = "command not recognized"
)

type ServerMessage struct {
	ResponseType  ServerResponseType
	OK            bool         `json:",omitempty"`
	ReplyTag      *string      `json:",omitempty"`
	MessageSource *string      `json:",omitempty"`
	Data          interface{}  `json:",omitempty"`
	Error         *ServerError `json:",omitempty"`
}

type ServerError struct {
	ErrorType ServerErrorType
	Message   string
}

type ServerGreetingData struct {
	Rooms []string
}

type ServerStatsData struct {
	ClientsTotal     int
	ClientsAvailable int
}

type ServerRoomJoinData struct {
	ClientId int
	Player   PlayerInfo
}

type ServerRoomPartData struct {
	ClientId int
}
