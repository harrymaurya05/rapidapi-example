const mysql = require("mysql");
var conn = mysql.createConnection ({
    host : "45.84.205.0",
    user : "u701705067_1place2all",
    password : "Hari21121om",
    database : "u701705067_1place2all",
    port: 3306,
    multipleStatements : true
});

//Connection error, try again in 2 seconds
conn.connect (function (err) {
    if (err) {
        //console.log ('error when connecting to db:', err);
        //setTimeout (handleError, 2000);
    } else {
        console.log("Connected");
    }
});

conn.on ('error', function (err) {
    //console.log ('db error', err);
    //If the connection is disconnected, automatically reconnect
    if(err.code === 'ECONNRESET'){
        handleError ();
        console.log("reconnect due to ECONNRESET")
    }
    else if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleError ();
        console.log("reconnect due to PROTOCOL_CONNECTION_LOST")
    }
    else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        handleError ();
        console.log("reconnect due to PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR");
        
    }else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_QUIT') {
        handleError ();
        console.log("reconnect due to PROTOCOL_ENQUEUE_AFTER_QUIT")
    }  
    else {
        throw err;
    }
});
function handleError(){
    conn = mysql.createConnection ({
        host : "45.84.205.0",
        user : "u701705067_1place2all",
        password : "Hari21121om",
        database : "u701705067_1place2all",
        port: 3306,
        multipleStatements : true
    });
}

module.exports = conn;