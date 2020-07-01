const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Middlewares
app.use(
	cookieSession({
		keys: ['g9hrvubd193fneo1sksn1n484ms'], // Encrypting cookie info, random string we typed
	})
);
app.use(authRouter); // Extract different route handlers inside different files (from auth.js)
app.use(productsRouter);

app.listen(3000, () => {
	console.log('Listening...');
});
