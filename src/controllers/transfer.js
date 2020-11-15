const { response } = require('../helpers')
const transferModel = require('../models/transfer')
const admin = require('firebase-admin')

module.exports = {
    getHistoryUser: async function(req, res) {
        try {
            const { id } = req.token
            let { order } = req.query
            const result = await transferModel.getHistoryUser(id, order)
            response(res, 200, result)
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
    getAllHistoryUser: async function(req, res) {
        try {
            const { id } = req.token
            const result = await transferModel.getAllHistoryUser(id)
            response(res, 200, result)       
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
    getHistoryToday: async function(req, res) {
        try {
            const { id } = req.token
            const result = await transferModel.getHistoryToday(id)
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    getHistoryByFilter: async function(req, res) {
        try {
            const { id } = req.token
            const { start, end } = req.query
            const result = await transferModel.getHistoryByFilter(start, end, id)
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    postTransfer: async function(req, res) {
        try {
            console.log(req.body, req.param)
            const pinBody = req.body.pin
            const { id, pin, name } = req.token
            if(pinBody == pin) {
                const { phone_receiver, device_token } = req.body
                const setData = req.body
                delete setData.pin
                delete setData.phone_receiver
                delete setData.device_token
                setData.id_sender = id
                const result = await transferModel.postTransfer(phone_receiver, setData)
                res.status(201).send({
                    message: 'Success created a transfer',
                    data: result
                })
                await admin.messaging().sendToDevice(device_token, {
                    notification: {
                        title: 'Transfer Success',
                        body: `Transfer from ${name} with amount ${setData.amount} is success`
                    }
                })
            } else {
                res.status(403).send({
                    message: 'Invalid PIN'
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    }
}