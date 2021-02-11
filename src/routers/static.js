const fs = require("fs");
const path = require("path");
const net = require("net");
const Router = require("./router");

const PATH_REGEX = /^(\/\w*)*\/?\w*\.?\w*$/;

/**
 * Router for static files.
 * @class
 */
class StaticRouter extends Router {
	/**
	 * Create a new static router.
	 * @param {string} dir Full path of the static directory to be served.
	 * @param {object} options Options for the static router.
	 */
	constructor(dir, options) {
		super();
		this.dir = dir;
	}

	canHandle(request) {
		// Ensure that the path is not bad
		if (!PATH_REGEX.test(request.route)) return false;

		// Check the path for existence
		try {
			let requestPath = path.join(this.dir, request.path);
			let stats = fs.statSync(requestPath);
			return !!stats; //"!!" turns the object into a boolean
		} catch (err) {
			return false;
		}
	}

	handle(request) {
		// Ensure that the path is not bad
		if (!PATH_REGEX.test(request.route)) return false;

		// Get stat
		let requestPath = path.join(this.dir, request.path);
		fs.stat(requestPath, (err, stats) => {
			// Handle errors
			if (err) {
				return request.error({});
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
					return request.error({ isMap, log: console.log });
				}

				// Append a full stop on maps
				if (isMap) content += "\n.";

				// Send content
				return request.send(content);
			});
		});
	}
}

module.exports = StaticRouter;
