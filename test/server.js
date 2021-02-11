const {
	GopherServer,
	StaticRouter,
	DynamicRouter,
	URLRouter,
} = require("../src/index");
const path = require("path");

// Create the server
const app = new GopherServer();

// Use a URL router
app.use(new URLRouter());

// Use a static router
app.use(new StaticRouter(path.join(__dirname, "./static")));

// Use a dynamic routers
app.use(
	new DynamicRouter("/test", (request, params) => {
		request.send(`
		This is a dynamic test page.
		To test more, make a request to /test/{anything}.
		`);
	})
);
app.use(
	new DynamicRouter("/test/:id", (request, params) => {
		request.send(`You sent an ID of ${params.id}.`);
	})
);

// Log all requests to the server
app.on("request", (request) => {
	console.log(`${request.socket.remoteAddress} requested ${request.path}`);
});

// Start the server on port 70
app.listen(70, () => {
	console.log("Listening at gopher://localhost:70/.");
});
