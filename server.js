const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const multer = require('multer')

app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
}))

// ---------------------- Image Multer ----------------------
app.use(cors())
app.use(flash())
app.use('/upload', express.static(path.join(__dirname, 'upload')))

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("png") ||
        file.mimetype.includes("jpg") ||
        file.mimetype.includes("jpeg")) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 }
}).single('image'))


// ----------------------------------------------------------

// Use BodyParser for GET data from form body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const userRoute = require('./router/userRouter')
app.use('/api', userRoute)

const dbcon = "mongodb+srv://dionjamessmith:W2nXCB1pFcf9YpNx@cluster0.apg8y7z.mongodb.net/iOS-user-auth-api?retryWrites=true&w=majority"

const port = process.env.PORT || 5000

mongoose.connect(dbcon, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`DB & Server Connected, listening on http://localhost:${port}`)
        })
    }).catch(error => {
        console.log(error)
    })