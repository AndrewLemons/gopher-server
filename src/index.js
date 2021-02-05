const net = require("net");
const fs = require("fs");
const path = require("path");

class GopherServer {
	constructor(staticDir) {
		this.server = net.createServer();

		// Handle connections
		this.server.on("connection", (socket) => {
			// Handle requests
			socket.once("data", (request) => {
				// Parse the request route
				let route = request.toString().trim();
				if (route === "") route = "/";
				let requestPath = path.join(staticDir, route);

				// Prevent stupid stuff
				if (route.includes(".")) {
					socket.write("An error occurred.", (err) => {
						socket.end();
					});
					return;
				}

				// Handle an HTTP redirect
				if (route.startsWith("URL:")) {
					socket.write(redirectPage(route.replace("URL:", "")), (err) => {
						socket.end();
					});
					return;
				}

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

	listen(port, callback) {
		this.server.listen(port, callback);
	}
}

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
