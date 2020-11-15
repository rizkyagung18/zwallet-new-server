const authModels = require('../models/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { response } = require('../helpers/')

module.exports = {
    postLogin: async function(req, res) {
        try {
            const setData = req.body
            const result = await authModels.checkUser(setData)
            if(!result[0]) {
                res.status(401).send({
                    message: 'Email Not Found'
                })
            }
            let check = true
            if(result[0].role != 6) {
                const check_device = await authModels.checkDevice(setData.email)
                if(setData.device_token !== check_device[0].device_token && check_device[0].device_token !== '') {
                    res.status(403).send({
                        message: 'Your account already login. Please logout from your old device if you want login here'
                    })
                } else if(check_device[0].device_token === '') {
                    await authModels.postDevice(setData.device_token, setData.email)
                }
                check = bcrypt.compareSync(setData.password, result[0].password)
            }
            if(check) {
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
                
                const { id, email, name, balance, photo, phone, verified, role, pin, device_token} = result[0]
                const token = jwt.sign({
                    id,
                    name,
                    firstName,
                    lastName,
                    email,
                    balance,
                    photo,
                    phone,
                    verified,
                    role,
                    pin,
                    device_token
                }, process.env.SECRET_KEY)
                let roles = 'user'
                if(role == 6) {
                    roles = 'admin'
                }
                response(res, 200, { 
                    message: 'Auth Success', 
                    token,
                    roles
                })
            } else {
                res.status(401).send({
                    message: 'Invalid Password'
                })
            }
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    postRegister: async function(req, res) {
        try {
            const errors = validationResult(req).array()
            if(!errors.length) {
                const setData = req.body
                const checkUser = await authModels.checkUser(setData)
                if(checkUser[0]) {
                    return response(res, 403, {message: 'Email already exist'})
                }
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(req.body.password, salt)
                const newData = {
                    ...setData,
                    password: hash
                }
                const result = await authModels.postRegister(newData)
                response(res, 200, { data: result, message: 'Register Success' })
            } else {
                response(res, 403, { message: errors })
            }
        } catch (error) {
            response(res, 500, { message: 'Register Failed'})
        }
    },
    
    forgotPassword: async function(req, res) {
        try {
            let setData = req.body
            const check = await authModels.checkUser(setData)
            if(check.length) {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(setData.password, salt)
                setData.password = hash
                const reset = await authModels.resetPassword(setData.email, setData.password)
                response(res, 200, reset)
            } else {
                response(res, 403, { message: 'Email Not Found' })
            }
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    },
    emailCheck: async function(req, res) {
        try {
            const setData = req.body
            const check = await authModels.checkUser(setData)
            console.log(check[0])
            if(check.length) {
                response(res, 200, { message: 'Email already exist'})
            } else {
                response(res, 200, { message: 'Email Not Found'})
            }
        } catch (error) {
            response(res, 500, { message: error.message })
        }
    }
}