/**
 * Class for managing a request.
 * @class
 */
class Request {
	/**
	 * Create a new request.
	 * @param {net.Socket} socket Socket of the request.
	 * @param {string} path Path of the request.
	 */
	constructor(socket, path) {
		this.socket = socket;
		this.path = path;
	}

	/**
	 * Send response content and end the connection.
	 * @param {string} content Content to be sent.
	 */
	send(content) {
		this.socket.write(content, () => {
			this.socket.end();
		});
	}

	/**
	 * Send an error page as response.
	 * @param {object} options Error options.
	 */
	error(options) {
		if (!options) options = {};

		let content = `
		An error has occurred.
		======================
		Error: ${options.message || "Server"}
		======================
		NodeJS gopher-server"
		`;

		if (options.isMap) content += "\n.";
		if (options.log) options.log();

		this.send(content);
	}
}

module.exports = Request;
