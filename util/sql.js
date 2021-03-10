require('dotenv').config();
const mysql = require('mysql');

function getCon() {
	return mysql.createConnection({
		host: process.env.HOST,
		user: process.env.USER,
		password: process.env.PASSWORD,
		database: process.env.DATABASE
	});
}

function open(con) {
	con.connect((error) => {
		if(error) throw error;
	});
}

function close(con) {
	con.end((error) => {
		if(error) throw error;
	});
}

exports.createTables = function() {
	let con = getCon();
	open(con);
	console.log('[MySQL connected]');

	new Promise(() => {
		con.query('CREATE TABLE IF NOT EXISTS Test (ID VARCHAR(100), PUUID VARCHAR(100), Name VARCHAR(100), Tag VARCHAR(100), Role VARCHAR(100))', (error) => {
			if(error) throw error;
		});
		con.commit();
		close(con);
	});
};

exports.insertUserdata = function(id, valPUUID, valName, valTag, rank) {
	let con = getCon();
	open(con);
    
	new Promise((resolve) => {
		if(!this.userExistsByID(id)) {
			if(!this.userExistsByPUUID(valPUUID)) {
				con.query('INSERT INTO Userdata (ID, PUUID, Name, Tag, Role) VALUES (?, ?, ?, ?, ?)', (id, valPUUID, valName, valTag, rank.name), (error) => {
					if(error) throw error;
				});
				con.commit();
				close(con);
				return resolve(0);
			}else{
				close(con);
				return resolve(1);
			}
		}else {
			close(con);
			return resolve(2);
		}
	});
};

exports.updateRank = function(id, rank) {
	let con = getCon();
	open(con);
    
	new Promise(() => {
		if(this.userExistsByID(id)) {
			con.query('UPDATE Userdata SET Role = ? WHERE ID = ?', [rank.name, id], (error) => {
				if(error) throw error;
			});
			con.commit();
		}
		close(con);
	});
};

exports.updateName = function(id, name) {
	let con = getCon();
	open(con);
    
	new Promise(() => {
		if(this.userExistsByID(id)) {
			con.query('UPDATE Userdata SET Name = ? WHERE ID = ?', [name, id], (error) => {
				if(error) throw error;
			});
			con.commit();
		}
		close(con);
	});
};

exports.updateTag = function(id, tag) {
	let con = getCon();
	open(con);
    
	new Promise(() => {
		if(this.userExistsByID(id)) {
			con.query('UPDATE Userdata SET Tag = ? WHERE ID = ?', [tag, id], (error) => {
				if(error) throw error;
			});
			con.commit();
		}
		close(con);
	});
};

exports.getPUUIDByID = function(id) {
	let con = getCon();
	open(con);

	return new Promise((resolve, reject) => {
		let sql = 'SELECT PUUID FROM Userdata WHERE ID = ?';
		con.query(sql, [id], (error, results) => {
			if(error) return reject(error);
			close(con);
			return resolve(results[0].PUUID);
		});
	});
};

exports.getNameByID = function(id) {
	let con = getCon();
	open(con);

	return new Promise((resolve, reject) => {
		let sql = 'SELECT Name FROM Userdata WHERE ID = ?';
		con.query(sql, [id], (error, results) => {
			if(error) return reject(error);
			close(con);
			return resolve(results[0].Name);
		});
	});
};

exports.getTagByID = function(id) {
	let con = getCon();
	open(con);

	return new Promise((resolve, reject) => {
		let sql = 'SELECT Tag FROM Userdata WHERE ID = ?';
		con.query(sql, [id], (error, results) => {
			if(error) return reject(error);
			close(con);
			return resolve(results[0].Tag);
		});
	});
};

exports.getRankByID = function(id) {
	let con = getCon();
	open(con);

	return new Promise((resolve, reject) => {
		let sql = 'SELECT Rank FROM Userdata WHERE ID = ?';
		con.query(sql, [id], (error, results) => {
			if(error) return reject(error);
			close(con);
			return resolve(results[0].Rank);
		});
	});
};

exports.deleteUserByID = function(id) {
	let con = getCon();
	open(con);

	new Promise(() => {
		con.query('DELETE FROM Userdata WHERE ID = ?', [id], (error) => {
			if(error) throw error;
		});
		con.commit();
		close(con);
	});
};

exports.deleteUserByPUUID = function(puuid) {
	let con = getCon();
	open(con);

	new Promise(() => {
		con.query('DELETE FROM Userdata WHERE PUUID = ?', [puuid], (error) => {
			if(error) throw error;
		});
		con.commit();
		close(con);
	});
};

exports.userExistsByID = function(id) {
	let con = getCon();
	open(con);

	return new Promise((resolve, reject) => {
		let sql = 'SELECT COUNT(*) AS rs FROM Userdata WHERE ID = ?';
		con.query(sql, [id], (error, results) => {
			if(error) return reject(error);
			close(con);
			let rs = results[0].rs;
			if(rs == 0) {
				return resolve(false);
			}else if(rs == 1) {
				return resolve(true);
			}
		});
	});
};

exports.userExistsByPUUID = function(puuid) {
	let con = getCon();
	open(con);

	return new Promise((resolve, reject) => {
		let sql = 'SELECT COUNT(*) AS rs FROM Userdata WHERE PUUID = ?';
		con.query(sql, [puuid], (error, results) => {
			if(error) return reject(error);
			close(con);
			let rs = results[0].rs;
			if(rs == 0) {
				return resolve(false);
			}else if(rs == 1) {
				return resolve(true);
			}
		});
	});
};