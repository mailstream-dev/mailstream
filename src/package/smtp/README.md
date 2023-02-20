# @mailstream/smtp

## A barebones, lightweight SMTP library

# Installation

Installation is managed by [npm](https://npmjs.com). Package should be relatively stable soon so we don't recommend manually building the code from the repo, but that is an option

```bash
npm install @mailstream/smtp

```

# Basic Usage

## QuickStart:

## Default Options

```javascript
import { SMTPServer } from "@mailstream/smtp";

new SMTPServer((e) => console.log(e)).listen(() => {
	console.log(`Listening`);
});
```

## Extended Options / TLS

_See **Type Definitions** section for more_

```javascript
import fs from "fs";
import path from "path";

import { SMTPServer } from "@mailstream/smtp";

const options = {
  key: fs.readFileSync(
    path.resolve(__dirname, "../server-key.pem")
  ),
  cert: fs.readFileSync(
    path.resolve(__dirname, "../server-cert.pem")
  ),
  ca: fs.readFileSync(
    path.resolve(__dirname, "../server-csr.pem")
  ),
  ip: "0.0.0.0",
  port: 587,
  plugins: [...];
};

new SMTPServer(console.log, options).listen(() => {
  console.log(`Listening on ${options.port}`);
});

```

# Plugins

Plugins should follow a specific RFC. The plugin name is dictated by the RFC and will be exposed to the client via the EHLO command. Response codes should match RFC, whereas response messages are human-readable and ignored by the client.

## Basic Plugin

And Example plugin, from an imaginary RFC which is named TESTING and implements TEST and FAIL commands

### TestPlugin.js

```javascript
import { SMTPPlugin } from "@mailstream/smtp";

const PLUGIN_NAME = "TESTING";
const PLUGIN_COMMANDS = [
	{
		name: "TEST",
		action: (req, res) => {
			res.send(200, "TEST is working!", req.encoding);
		},
	},
	{
		name: "FAIL",
		action: (req, res) => {
			res.send(500, "FAIL command reported error", req.encoding);
		},
	},
];

export default new SMTPPlugin(PLUGIN_NAME, PLUGIN_COMMANDS);
```

### main.js

```javascript
import { SMTPServer } from "@mailstream/smtp";

import TestPlugin from "./TestPlugin";

const options = {
  port: 25,
  plugins: [TestPlugin];
};

new SMTPServer(console.log, options).listen(() => {
  console.log(`Listening on ${options.port}`);
});
```

## Advanced Plugin

And Example plugin, from an imaginary RFC which is named TESTING and implements TEST and FAIL commands

### TestPlugin.js

```javascript
import { SMTPPlugin, SMTPCommand } from "@mailstream/smtp";

const PLUGIN_NAME = "TESTING";

const PLUGIN_TEST_COMMAND = class extends SMTPCommand {
	constructor() {
		super("TEST");
	}

	//just an example, the default is already false
	override shouldEmit = false;

	override validState(req) {
		return Boolean(req.remoteHostname);
	}

	command(req, res) {
		res.send(200, "TEST is working!", req.encoding);
	}
}

const PLUGIN_COMMANDS = [
	{
		name: "TEST",
		action: new PLUGIN_TEST_COMMAND(),
	},
	{
		name: "FAIL",
		action: (req, res) => {
			res.send(500, "FAIL command reported error", req.encoding);
		},
	},
];

export default new SMTPPlugin(PLUGIN_NAME, PLUGIN_COMMANDS);
```

### main.js

```javascript
import { SMTPServer } from "@mailstream/smtp";

import TestPlugin from "./TestPlugin";

const options = {
  port: 25,
  plugins: [TestPlugin];
};

new SMTPServer(console.log, options).listen(() => {
  console.log(`Listening on ${options.port}`);
});
```

# Type Definitions

### Basic Types

```typescript

```
