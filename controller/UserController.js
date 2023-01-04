const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/config')
const User = require('../model/User')
const Post = require('../model/Post')


// Check password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10)
        return passwordHash
    } catch (error) {
        // res.status(400).send(error.message)
        console.log(error)
    }
}

// Create token
const createToken = async id => {
    try {
        const token = await jwt.sign({ _id: id }, config.secret_jwt, { expiresIn: "1h" })
        return token
    } catch (error) {
        // res.status(400).send(error.message)
        console.log(error)
    }
}

exports.register = async (req, res) => {
    try {
        const setpassword = await securePassword(req.body.password)

        const userModel = new User({
            name: req.body.name,
            email: req.body.email,
            password: setpassword
        })
        const userData = await User.collection.findOne({ email: req.body.email })
        if (userData) {
            res.status(404).send({ success: false, msg: "This email already exist" })
        } else {
            const user_data = await userModel.save()
            const tokendata = await createToken(user_data._id)
            res.status(200).send({ success: true, data: user_data, "token": tokendata })
            // res.status(200).send({ success: true, data: user_data })
        }
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error.message)
    }
}

// Login
exports.login = async (req, res) => {
    try {
        // GET user input
        const { email, password } = req.body

        // Validate user input
        if (!(email && password)) {
            return res.status(400).json({ status: false, message: "All inputs required." })
        }
        // Validate if user exists in Database
        const user = await User.findOne({ email })

        if (user && (await bcryptjs.compare(password, user.password))) {
            // Create token
            const tokendata = await createToken(user._id)
            return res.status(200).json({ "user": user, "token": tokendata })
            // res.status(200).json({ "user": user })
        }
        return res.status(400).json("Invalid Credentials")
    } catch (err) {
        console.log(err)
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const image = req.file

        const PostDetails = await new Post({
            title: req.body.title,
            description: req.body.description,
            image: image && image.path ? image.path : 'upload/no-image.jpg'
            // user_id: req.body.user_id
        })

        const data = await PostDetails.save()
        res.status(200).json({ status: true, msg: "Data succesfully saved", result: data })
    } catch (error) {
        res.status(400).send({ success: false, msg: "Data unsaved." })
    }
}

// Authenticate User
// exports.test = async (req, res) => {
//     return res.status(201).json({ success: true, msg: `Verified as Authenticated User` })
// }