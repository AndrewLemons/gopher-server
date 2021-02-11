const net = require("net");
const Router = require("./router");
const Request = require("../request");

/**
 * Router for dynamic routes.
 * @class
 */
class DynamicRouter extends Router {
	/**
	 * Create a new dynamic router.
	 * @param {string} pattern Pattern of the path to handle.
	 * @param {function(Request, object)} callback Callback to handle a request;
	 */
	constructor(pattern, callback) {
		super();
		this.key = createKey(pattern);
		this.callback = callback;
	}

	canHandle(request) {
		return this.key.test(request.path);
	}

	handle(request) {
		// Match the path to the key and ensure they align
		let matchedPath = this.key.exec(request.path);
		if (!matchedPath) return;

		// Get the params and call the callback
		let params = matchedPath.groups;
		this.callback(request, params);
	}
}

/**
 * Create a RegExp that will return all params when checked against a matching path.
 * @param {string} pattern Pattern (path) to generate the key for.
 * @returns {RegExp} Key for the given path.
 */
function createKey(pattern) {
	// Find all params
	const params = [...pattern.matchAll(/:\w+/g)].map((param) => {
		return param[0];
	});

	// Do not allow duplicate key names
	if (new Set(params).size !== params.length)
		throw new Error("Path params must have custom names.");

	// Create the RegExp
	let result = pattern;
	params.forEach((param) => {
		let cleanName = param.replace(":", "");
		result = result.replace(param, `(?<${cleanName}>\\w+)`);
	});
	result = `^${result}$`;

	return RegExp(result);
}

module.exports = DynamicRouter;
