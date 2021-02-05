const { GopherServer } = require("../src/index");
const path = require("path");

const app = new GopherServer(path.join(__dirname, "./static"));

app.listen(70, () => {
	console.log("Listening at gopher://localhost:70/.");
});
