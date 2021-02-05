# gopher-server

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

## Example

An full example setup can be found in `./test`.
