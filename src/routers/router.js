const net = require("net");
const Request = require("../request");

/**
 * Base class for routing requests.
 * @class
 */
class Router {
	constructor() {}

	/**
	 * Determine if a request can be handled by this router.
	 * @param {Request} request Object containing request information.
	 */
	canHandle(request) {
		console.error(new Error("Undefined handler."));
		return false;
	}

	/**
	 * Handle a request.
	 * @param {Request} request Object containing request information.
	 */
	handle(request) {
		request.error();
	}
}

module.exports = Router;
