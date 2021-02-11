const net = require("net");
const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const Request = require("./request");

// Import routers for export
const StaticRouter = require("./routers/static");
const DynamicRouter = require("./routers/dynamic");
const URLRouter = require("./routers/url");
const Router = require("./routers/router");

/**
 * A server for handling gopher requests.
 * @class
 */
class GopherServer extends EventEmitter {
	/**
	 * Create a new gopher server.
	 * @param {string} staticDir Full path of the static directory for the server's content.
	 */
	constructor(staticDir) {
		super();

		this.server = net.createServer();

		/**
		 * Routers being used by the server.
		 * @type {[Router]}
		 */
		this.routers = [];

		// Handle connections
		this.server.on("connection", (socket) => {
			// Handle requests
			socket.once("data", (data) => {
				// Create the request object
				let requestPath = data.toString().trim();
				if (requestPath === "") requestPath = "/";
				let request = new Request(socket, requestPath);

				// Emit request event
				this.emit("request", request);

				// Determine the correct router
				let validRouters = this.routers.filter((router) => {
					return router.canHandle(request);
				});

				// Ensure a router has been found
				if (validRouters.length === 0) return request.error();

				// Run the router's handler
				validRouters[0].handle(request);
			});
		});
	}

	/**
	 * Add a router for managing a route.
	 * @param {Router} router Router to use.
	 */
	use(router) {
		this.routers.push(router);
	}

	/**
	 * Start the server listening on a certain port.
	 * @param {number} port Port to listen on.
	 * @param {function} callback Callback for when the server has been started.
	 */
	listen(port, callback) {
		this.server.listen(port, callback);
	}
}

module.exports = {
	GopherServer,
	StaticRouter,
	DynamicRouter,
	URLRouter,
	Router,
};
