package main

import (
	"flag"
	"net/http"
)

func main() {
	bind := flag.String("bind", ":7331", "Address:port to bind to")
	flag.Parse()

	http.ListenAndServe(*bind, nil)
}
