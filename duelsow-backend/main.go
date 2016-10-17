package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	Subprotocols:    []string{CurrentAPIVersion},
	CheckOrigin: func(r *http.Request) bool {
		// No constraints on origin for now
		return true
	},
}

var hub Hub

func main() {
	bind := flag.String("bind", ":7331", "Address:port to bind to")
	flag.Parse()

	http.HandleFunc("/", startWS)
	http.ListenAndServe(*bind, nil)
}

func startWS(rw http.ResponseWriter, req *http.Request) {
	conn, err := upgrader.Upgrade(rw, req, nil)
	if err != nil {
		log.Println(err)
		http.Error(rw, "Could not upgrade to websocket: "+err.Error(), 500)
		return
	}
	conn.Subprotocol()

	handleClient(conn)
}
