const net = require("net");
const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");

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

		this.handlers = {};

		// Handle connections
		this.server.on("connection", (socket) => {
			// Handle requests
			socket.once("data", (request) => {
				// Parse the request route
				let route = request.toString().trim();
				if (route === "") route = "/";

				// Emit request event
				this.emit("request", route, socket.remoteAddress);

				// Check to see if a handler matches
				// TODO!: Someone please fix this crappy mess!
				for (const handlerRoute in this.handlers) {
					// Get params for the route and create the regex
					let params = [...handlerRoute.matchAll(/:[^./:]*/g)];
					let routeRegex = getRouteRegex(handlerRoute, params);

					// Determine if the route applies to the handler
					if (routeRegex.test(route)) {
						let parsedRoute = handlerRoute;
						let parsedParams = {};

						// Get values of all params
						while (/:[^./:]*/.test(parsedRoute)) {
							// Get remaining params
							let currentParams = [...parsedRoute.matchAll(/:[^./:]*/g)];

							// Get param value range
							let paramStart = currentParams[0].index;
							let paramEnd = route.indexOf("/", paramStart);
							if (paramEnd <= 0) paramEnd = route.length;

							// Get the param
							let paramValue = route.slice(paramStart, paramEnd);
							parsedParams[
								params[Object.keys(parsedParams).length][0].replace(":", "")
							] = paramValue;
							parsedRoute = parsedRoute.replace(currentParams[0], paramValue);
						}

						// Call the handler
						this.handlers[handlerRoute](socket, parsedParams);
						return;
					}
				}

				if (this.handlers[route]) {
					this.handlers[route](socket);
					return;
				}

				// Handle an HTTP redirect
				if (route.startsWith("URL:")) {
					socket.write(redirectPage(route.replace("URL:", "")), (err) => {
						socket.end();
					});
					return;
				}

				// Ensure that the route is valid
				if (!/^(\/\w*)*\/?\w*\.?\w*$/.test(route)) {
					socket.write("An error occurred.", (err) => {
						socket.end();
					});
					return;
				}

				let requestPath = path.join(staticDir, route);

				// Get stat
				fs.stat(requestPath, (err, stats) => {
					// Handle errors
					if (err) {
						socket.write("An error occurred.", (err) => {
							socket.end();
						});
						return;
					}

					// Determine type
					let isMap = false;
					if (stats.isDirectory()) {
						requestPath = path.join(requestPath, ".gophermap");
						isMap = true;
					}

					// Get content
					fs.readFile(requestPath, { encoding: "utf8" }, (err, content) => {
						// Handle errors
						if (err) {
							content = "iAn error occurred.\tfake\t(NULL)\t0";
						}

						// Append a full stop on maps
						if (isMap) content += "\n.";

						// Send content
						socket.write(content, (err) => {
							socket.end();
						});
					});
				});
			});
		});
	}

	/**
	 * Create a function to programmatically handle a route.
	 * @param {string} route Route for the handler to apply to.
	 * @param {function(net.Socket, object)} handler Handler function.
	 */
	handle(route, handler) {
		this.handlers[route] = handler;
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

/**
 * Generate a route regex.
 * @param {string} route Route to create a regex from.
 * @param {array} params An array of parameters container in the route.
 */
function getRouteRegex(route, params) {
	let regexString = route;
	params.forEach((param) => {
		regexString = regexString.replace(param[0], "[^./:]");
	});
	regexString = regexString.replaceAll("/", "\\/");
	regexString = `^${regexString}$`;
	return RegExp(regexString);
}

/**
 * Return HTML for a redirect page.
 * @param {string} url URL to redirect to.
 */
function redirectPage(url) {
	return `
		<html>
			<body>
				<p>Redirecting to ${url} in 5 seconds...</p>
				<p>or <a href="${url}">Click Here</a></p>
				<script>
					setTimeout(() => {
						window.location.replace(${url});
					}, 5000)
				</script>
			<body>
		</html>
	`;
}

module.exports = {
	GopherServer,
};
