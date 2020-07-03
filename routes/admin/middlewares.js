const { validationResult } = require('express-validator');

module.exports = {
	// dataCb, second argument, just for error handling on products.js
	handleErrors(templateFunc, dataCb) {
		return async (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				let data = {};
				if (dataCb) {
					data = await dataCb(req);
				}
				// merge data object with errors
				return res.send(templateFunc({ errors, ...data }));
			}

			next();
		};
	},
	requireAuth(req, res, next) {
		if (!req.session.userId) {
			return res.redirect('/signin');
		}

		next();
	},
};
