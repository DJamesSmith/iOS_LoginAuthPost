const express = require('express')
const router = express.Router()

const userController = require('../controller/UserController')
const auth = require('../middleware/auth')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/createPost', auth, userController.createPost)

// router.get('/test', auth, userController.test)

module.exports = router