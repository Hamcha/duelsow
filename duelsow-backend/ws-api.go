package main

//
// Client requests struct/infos
//

type ClientActionType string

const (
	// Hub/Auth actions
	CATLogIn ClientActionType = "auth:login"
	CATStats ClientActionType = "general:stats"

	// Room actions
	CATRoomJoin ClientActionType = "room:join"
	CATRoomPart ClientActionType = "room:part"
)

type ClientMessage struct {
	Tag        string
	ActionType ClientActionType
	Params     map[string]string
}

type PlayerInfo struct {
	Name string
	Rank string
}

//
// Server response struct/infos
//

type ServerResponseType string

const (
	// Server messages
	SRTGreeting ServerResponseType = "greet"

	SRTSignedIn ServerResponseType = "login:ok"

	SRTRoomJoin ServerResponseType = "room:join"
	SRTRoomPart ServerResponseType = "room:part"

	SRTRoomJoined ServerResponseType = "room:joined"
	SRTRoomParted ServerResponseType = "room:parted"

	SRTStats ServerResponseType = "stats"

	// Errors
	SRTCmdError   ServerResponseType = "error:cmd"
	SRTFatalError ServerResponseType = "error:fatal"
)

type ServerErrorType string

const (
	SETReadError     ServerErrorType = "read error"
	SETUnknownCmd    ServerErrorType = "command not recognized"
	SETWrongFormat   ServerErrorType = "wrong param format"
	SETAlreadyInRoom ServerErrorType = "already inside room"
	SETNotInRoom     ServerErrorType = "not in room"
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

type ServerLoginData struct {
	Player PlayerInfo
}

type ServerRoomJoinData struct {
	RoomName string
	ClientId int
	Player   PlayerInfo
}

type ServerRoomPartData struct {
	RoomName string
	ClientId int
}

type ServerRoomJoinedData struct {
	RoomName string
	Players  map[int]PlayerInfo
}

type ServerRoomPartedData struct {
	RoomName string
}

type ServerStatsData struct {
	ClientsTotal     int
	ClientsAvailable int
}
