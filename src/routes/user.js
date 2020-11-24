const router = require('express').Router()
const userController = require('../controllers/user')
const { authentication } = require('../middlewares/auth')
const upload = require('../middlewares/multer')

router
    .get('/search', authentication, userController.searchAll)
    .get('/search/receiver', authentication, userController.searchOneById)
    .get('/search/query', authentication, userController.searchByName)
    .get('/login', authentication, userController.getUserLogin)
    .post('/pin', authentication, userController.checkPin)
    .post('/upload', upload, authentication, userController.editPhoto)
    .patch('/', upload, authentication, userController.editUser)
    .patch('/device', authentication, userController.deleteDevice)
    
module.exports = router