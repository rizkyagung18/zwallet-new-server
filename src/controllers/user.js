const bcrypt = require('bcrypt')
const userModels = require('../models/user')
const { checkUser } = require('../models/auth')
const { updateHistoryReceiver, updateHistorySender} = require('../models/transfer')
const { response } = require('../helpers')
const aws = require('aws-sdk')
const { deleteDevice } = require('../models/user')

module.exports = {
    searchAll: async function(req, res) {
        try {
            const { id } = req.token
            const result = await userModels.searchAll(id)
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message})
        }
    },
    searchOneById: async function(req, res) {
        try {
            const { phone } = req.query
            const { id } = req.token
            const result = await userModels.searchOneById(phone, id)
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    searchByName: async function(req, res) {
        try {
            const { q } = req.query
            const { id } = req.token
            const result = await userModels.searchByName(id, q)
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    getAllUser: async function(req, res) {
        try {
            const result = await userModels.getAllUser()
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    getUserLogin: async function(req, res) {
        try {
            const { id, name } = req.token
            const result = await userModels.getUserLogin(id)
            let firstName;
            let lastName;
            if(result[0].name.split(' ').length > 1) {
                const separateName = result[0].name.split(' ')
                const [first, ...last] = separateName
                firstName = first
                lastName = last.join(' ')
            } else {
                firstName = result[0].name
                lastName = ' '
            }
            result[0].firstName = firstName
            result[0].lastName = lastName
            response(res, 200, result)
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    editUser: async function(req, res) {
        try {
            const { id } = req.token
            const setData = req.body
            console.log(req.body)
            console.log(req.file)

            if(req.file) {
                setData.photo = req.file.filename
                await updateHistorySender({photo_sender: req.file.filename}, id)
                await updateHistoryReceiver({ photo: req.file.filename}, id)
            }

            if(req.body.name) {
                await updateHistorySender({sender: req.body.name}, id)
                await updateHistoryReceiver({receiver: req.body.name}, id)
            }

            if(setData.currPassword && setData.password) {
                const result = await checkUser(req.token)
                const check = bcrypt.compareSync(setData.currPassword, result[0].password)
                if(check) {
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(setData.password, salt)
                    setData.password = hash
                    delete setData.currPassword
                } else {
                    res.status(403).send({
                        message: `Invalid Password`
                    })
                }
            }

            const result = await userModels.editUser(id, setData)
            if(result.affectedRows) {
                const result = await userModels.getUserLogin(req.token.id)
                res.status(201).send({
                    message: `${Object.keys(req.file || req.body)} successfully edited`,
                    data: result
                })
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: `${Object.keys(req.file || req.body)} failed to edit`
            })
        }
    },
    editPhoto: async function(req, res) {
        console.log(req.body)
        const { id } = req.token
        const setData = req.body
        console.log(req.file)
        if(req.file) {
            setData.photo = req.file.filename
            await updateHistorySender({photo_sender: req.file.filename}, id)
            await updateHistoryReceiver({ photo: req.file.filename}, id)
        }

        const result = await userModels.editUser(id, setData)
        res.status(201).send({
            data: result
        })
    },
    checkPin: async function(req, res) {
        try {
            const { pin } = req.body
            if(pin.length !== 6) {
                return res.send('PIN must be full filled')
            }
            const result = await checkUser(req.token)
            if(result[0].pin == pin) {
                res.send('OK')
            } else {
                res.send('Invalid PIN')
            }
        } catch (error) {
            res.send(error.message)
        }
    },
    deleteDevice: async function(req, res) {
        try {
            const { id } = req.token
            await deleteDevice(id)
        } catch (error) {
            
        }
    }
}