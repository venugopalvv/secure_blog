const express = require('express')
const router = express.Router()
const mysql = require('mysql');
const bcrypt = require('bcryptjs')
const sessions = require('express-session');
const MySQLStore = require('express-mysql-session')(sessions);


const connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'root',
	password : 'venu@1982',
	database : 'nodelogin'
});





router.post('/', async (req, res) => {
	const { fname,email_id,username, password: plainTextPassword } = req.body
	if (!email_id || typeof email_id !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}
	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 6) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}
	const password = await bcrypt.hash(plainTextPassword, 10)

	var sql = "INSERT INTO accounts (name, password, email)  VALUES (" + connection.escape(fname) + ",'" + password + "'," + connection.escape(email_id) + ")";
	connection.query(sql, async function(error, results, fields) {

		if (error) throw error;
		res.json({ status: 'ok', error: 'Invalid password' })
	}); 

})

module.exports = router;