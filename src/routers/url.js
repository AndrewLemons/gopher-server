const net = require("net");
const Router = require("./router");

const URL_REGEX = /^(URL:)(\w+?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

/**
 * Router for URL redirects.
 * @class
 */
class URLRouter extends Router {
	constructor() {
		super();
	}

	canHandle(request) {
		return URL_REGEX.test(request.path);
	}

	handle(request) {
		let redirectTo = request.path.replace("URL:", "");
		let content = redirectPage(redirectTo);
		request.send(content);
	}
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

module.exports = URLRouter;
