require('dotenv').config();
const mysql = require('mysql');

function getCon() {
    return con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
}

function open(con) {
    con.connect((err) => {
        if(err) throw err;
    });
}

function close(con) {
    con.end((err) => {
        if(err) throw err;
    });
}

function getPUUID(id) {
    var con = getCon();
    open(con);

    var sql = 'SELECT PUUID FROM Userdata WHERE ID = ?';
    con.query(sql, [id], function(err, result) {
        if(err) throw err;
        return callback(result);
    });

    close(con);
}

module.exports = {getPUUID}