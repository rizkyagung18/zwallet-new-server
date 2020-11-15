const db = require('../config/mysql')

module.exports = {
    getHistoryUser: function(id, order) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT amount, receiver, photo, sender, photo_sender, date FROM transfer WHERE id_sender=${id} OR id_receiver=${id} ORDER BY ${order}(date) DESC`, (err, res) => {
                if(!err) {
                    db.query(`SELECT amount, name FROM transaction WHERE id_user=${id} ORDER BY createdAt DESC`, (error, result) => {
                        if(!error) {    
                            const newData = [
                                ...result,
                                ...res
                            ]
                            resolve(newData)
                        } else {
                            reject(new Error(error))
                        }
                    }) 
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    getAllHistoryUser: function(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT amount, receiver, photo, sender, photo_sender, date FROM transfer WHERE id_sender=${id} OR id_receiver=${id} ORDER BY DATE(date) DESC`, (err, res) => {
                if(!err) {
                    db.query(`SELECT amount, name, createdAt FROM transaction WHERE id_user=${id} ORDER BY createdAt DESC`, (error, result) => {
                        if(!error) {    
                            const newData = [
                                ...result,
                                ...res
                            ]
                            resolve(newData)
                        } else {
                            reject(new Error(error))
                        }
                    })
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    getHistoryToday: function(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT amount, receiver, photo, sender, photo_sender, date FROM transfer WHERE DATE(date) = CURDATE() AND id_receiver=${id} OR DATE(date) = CURDATE() AND id_sender=${id}`, (err, res) => {
                if(!err) {
                    db.query(`SELECT amount, name FROM transaction WHERE id_user=${id} AND DATE(createdAt) = CURDATE()`, (error, result) => {
                        if(!error) {    
                            const newData = [
                                ...result,
                                ...res
                            ]
                            resolve(newData)
                        } else {
                            reject(new Error(error))
                        }
                    }) 
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    getHistoryByFilter: function(start, end, id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT amount, receiver, photo, sender, photo_sender, date FROM transfer WHERE DATE(date) BETWEEN '${start} AND ${end}' AND id_receiver=${id} OR DATE(date) BETWEEN '${start}' AND '${end}' AND id_sender=${id}`, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    updateHistorySender: function(data, id) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE transfer SET ? WHERE id_sender=${id}`, data, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    updateHistoryReceiver: function(data, id) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE transfer SET ? WHERE id_receiver=${id}`, data, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    postTransfer: function(phone, setData) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id AS id_receiver, name AS receiver, photo FROM users WHERE phone=${phone}`, (err, result) => {
                if(!err) {
                    const newData = {
                        ...setData,
                        ...result[0]
                    }
                    db.query(`INSERT INTO transfer SET ?`, newData, (err, result) => {
                        if(!err) {
                           resolve(result)
                        } else {
                            reject(new Error(err))
                        }
                    })
                }
            })
        })
    }
}