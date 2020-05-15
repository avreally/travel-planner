// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
if (process.env.NODE_ENV !== 'test') {
	const port = 8000;
	const server = app.listen(port, listening);

	function listening() {
		console.log(`server is running on localhost:${port}`);
	}
}

function getRoot(req, res) {
	res.sendFile('dist/index.html');
}
app.get('/', getRoot);

module.exports = {
	getRoot
};
