const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	// 'extends' uses all methods from repository.js
	async create(attrs) {
		// attrs === { email: '', password: '' }
		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();
		const record = {
			...attrs, // replace the password from attrs with this password below
			password: `${buf.toString('hex')}.${salt}`,
		};
		records.push(record);

		// Write the updated 'records' array back to this.filename
		await this.writeAll(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		// saved -> pass saved in our database -> 'hashed.salt'
		// supplied -> pass supplied by our user trying to sign in
		const [hashed, salt] = saved.split('.'); // Destructuring!
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64); // Buffer: returns an array with raw data

		return hashed === hashedSuppliedBuf.toString('hex');
	}
}

module.exports = new UsersRepository('users.json');
