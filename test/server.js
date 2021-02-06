const { GopherServer } = require("../src/index");
const path = require("path");

// Create the server
const app = new GopherServer(path.join(__dirname, "./static"));

// Create a handler for all requests to "/test"
app.handle("/test", (socket) => {
	socket.write("This is a programmatically created test page!", (err) => {
		socket.end();
	});
});

// Create a handler for all requests to "/test/*"
app.handle("/test/:id", (socket, params) => {
	socket.write(
		`This is a programmatically created test page!\nYou requested page ${params.id}.`,
		(err) => {
			socket.end();
		}
	);
});

// Log all requests to the server
app.on("request", (route, ip) => {
	console.log(`${ip} requested ${route}`);
});

// Start the server on port 70
app.listen(70, () => {
	console.log("Listening at gopher://localhost:70/.");
});
