const db = require('../config/mysql')

module.exports = {
    checkUser: function(setData) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email='${setData.email}'`, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    postRegister: function(setData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users SET ?', setData, (err, res) => {
                if(!err) {
                    resolve(res)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    resetPassword: function(email, password) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET ? WHERE email='${email}'`, {password: password}, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    checkDevice: function(email) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT device_token FROM users WHERE email='${email}'`, (err, res) => {
                if(!err) {
                    resolve(res)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    postDevice: function(token, email) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET ? WHERE email='${email}'`, { device_token: token }, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    }
}