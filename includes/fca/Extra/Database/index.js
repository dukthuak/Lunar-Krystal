/* eslint-disable no-self-assign */
/* eslint-disable linebreak-style */
const get = require('lodash/get');
const set = require('lodash/set');
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs-extra');
const request = require('request');
const deasync = require('deasync');

if (!fs.existsSync(process.cwd() + '/Horizon_Database')) {
    fs.mkdirSync(process.cwd() + '/Horizon_Database');
    fs.writeFileSync(process.cwd() + '/Horizon_Database/A_README.md', 'This folder is used by ChernobyL(NANI =)) ) to store data. Do not delete this folder or any of the files in it.', 'utf8');
}

// Create a simple in-memory database for now to avoid sqlite3 issues
var db = {
    data: new Map(),
    init: function() {
        // Initialize with empty data
        this.data = new Map();
    },
    get: function(key) {
        return this.data.get(key);
    },
    set: function(key, value) {
        this.data.set(key, value);
    },
    delete: function(key) {
        this.data.delete(key);
    },
    all: function() {
        const result = [];
        for (let [key, value] of this.data) {
            result.push({ ID: key, data: value });
        }
        return result;
    }
};

db.init();

function Lset(key, value) {
    if (!key)
        throw new TypeError("No key specified.");
    db.set(key, value);
    return value;
}

function Lget(key) {
    if (!key)
        throw new TypeError("No key specified.");
    return db.get(key) || null;
}

function Lhas(key) {
    if (!key)
        throw new TypeError("No key specified.");
    return db.data.has(key);
}

function Lremove(key) {
    if (!key)
        throw new TypeError("No key specified.");
    return db.delete(key);
}

function LremoveMultiple(key) {
    if (!key)
        throw new TypeError("No key specified.");
    try {
        for (let i of key) {
            db.delete(i);
        }
        return true;
    } 
    catch (err) {
        return false;
    }
}

function Llist() {
    return db.all();
}

function Replit_Set(key, value) {
    try {
        var done = false;
        
        request({
            url: process.env.REPLIT_DB_URL,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },  
            body: `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
        
        }, function (error, response, body) {
            done = true;
        });

        deasync.loopWhile(function(){
            return !done;
        });

        return;
        
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_Get(key) {
    try {
        var done = false;
        var response = null;
    
        request(process.env.REPLIT_DB_URL + "/" + key, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                response = body;
            }
            done = true;
        });
    
        deasync.loopWhile(function(){
            return !done;
        });
    
        return JSON.parse(response);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_Has(key) {
    try {
        var done = false;
        var response = null;

        request(process.env.REPLIT_DB_URL + "/" + key, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                response = body;
            }
            done = true;
        });

        deasync.loopWhile(function(){
            return !done;
        });

        return response != null;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_Remove(key) {
    try {
        var done = false;
        request.delete(process.env.REPLIT_DB_URL + "/" + key , function (error, response, body) {
            done = true;
        });

        deasync.loopWhile(function(){
            return !done;
        });

        return;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_RemoveMultiple(keys) {
    try {
        for (const key of keys) {
            request.delete(process.env.REPLIT_DB_URL + "/" + key , function (error, response, body) {});
        }
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_List() {
    var done = false;
    var response = null;

    request(process.env.REPLIT_DB_URL + "?encode=true" + `&prefix=${encodeURIComponent("")}`, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            response = body;
        }
        done = true;

    });

    deasync.loopWhile(function(){
        return !done;
    });

    if (response.length === 0) {
        return [];
    }
    return response.split("\n").map(decodeURIComponent);
}

module.exports = function ChernobyL(Local) {
    if (Local && process.env["REPL_ID"]) {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    } else if (!Local && process.env["REPL_ID"]) {
        return {
            set: Replit_Set,
            get: Replit_Get,
            has: Replit_Has,
            delete: Replit_Remove,
            deleteMultiple: Replit_RemoveMultiple,
            list: Replit_List
        };
    }
    else if (Local && !process.env["REPL_ID"]) {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    }
    else if (!Local && !process.env["REPL_ID"]) {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    }
    else {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    }
};