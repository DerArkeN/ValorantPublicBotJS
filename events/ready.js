const sql = require('../util/sql.js');
const functions = require('../util/functions.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.info(`Logged in as ${client.user.tag}!`);
		sql.createTables();
	}
};