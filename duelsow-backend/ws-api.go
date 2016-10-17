package main

import "fmt"

//
// DS-API Metadata
//

const APIVersionNumber = 1

var CurrentAPIVersion = fmt.Sprintf("dsapi-%d", APIVersionNumber)

//
// Client requests struct/infos
//

type ClientActionType string

const (
	CATLogIn  ClientActionType = "login"
	CATLogOut ClientActionType = "logout"
)

type ClientMessage struct {
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
	SRTGreeting   ServerResponseType = "greet"
	SRTCmdError   ServerResponseType = "error-cmd"
	SRTFatalError ServerResponseType = "error-fatal"
)

type ServerErrorType string

const (
	SETReadError  ServerErrorType = "read error"
	SETUnknownCmd ServerErrorType = "command not recognized"
)

type ServerMessage struct {
	OK           bool
	ResponseType ServerResponseType
	Data         interface{}
	Error        *ServerError
}

type ServerError struct {
	ErrorType ServerErrorType
	Message   string
}

type ServerGreetingData struct {
	APIVersion int
}
