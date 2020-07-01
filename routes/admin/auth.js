const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPasswordForUser,
} = require('./validators');

const router = express.Router(); // Similar to 'app' -> changing all routes in the doc

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	[requireEmail, requirePassword, requirePasswordConfirmation], // express-validator here
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;
		// Create a user in our user repo to represent this person
		const user = await usersRepo.create({ email, password });

		// Store the id of that user inside the user cookie
		req.session.userId = user.id; // Added by the cookie session! userId could be anything (it's an object)

		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null; // "Forget all the info inside the cookie"
	res.send('You are logged out');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post(
	'/signin',
	[requireEmailExists, requireValidPasswordForUser],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;

		res.redirect('/admin/products');
	}
);

module.exports = router;
