# gopher-server

![npm (tag)](https://img.shields.io/npm/v/gopher-server/latest?style=flat-square) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/gopher-server/0.2.1?style=flat-square) ![npm](https://img.shields.io/npm/dt/gopher-server?style=flat-square) ![NPM](https://img.shields.io/npm/l/gopher-server?style=flat-square)

A simple gopher server for Node-JS.

## Setup

1. Install using `npm install gopher-server`
2. Create the server

   ```javascript
   const path = require("path");
   const { GopherServer } = require("gopher-server");

   let server = new GopherServer(path.join(__dirname, "static"));
   ```

3. Start the server

   ```javascript
   server.listen(70);
   ```

## Creating Content

Content is created through the file system. Here is an example file layout.

```
static
- .gophermap
  content1
  dir1
  - .gophermap
    content2
```

When accessing a directory, the directory's `.gophermap` is sent. When the requested resource is a file, the file is sent.

Here is what a `.gophermap` file may look like.

```
iHello World	fake	(NULL)	0
0Content 1	/content1	localhost	70
```

Gopher maps can be confusing to make at first, so the [wikipedia page](<https://wikipedia.org/wiki/Gopher_(protocol)>) is a good resource. Keep in mind that `localhost` needs to be changed to your server's hostname. For example, `example.com`.

### Dynamic Routes

Dynamic routes are routes that do not base their content off of files. Take for example the dynamic route `/test/:id`. `:id` can be replaced by any value. This value can then be used to render and send content to the user.

```javascript
app.handle("/test/:id", (socket, params) => {
	socket.write(`${params.id}`, (err) => {
		socket.end();
	});
});
```

`socket` is the Node JS net socket of the current request, and `params` is an object containing the params of the route (the `:id`).

## Example

An full example setup can be found in `./test`.
