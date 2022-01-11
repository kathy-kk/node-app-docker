const express = require('express')
const mongoose = require('mongoose')
const { MONGO_IP, MONGO_PORT, MONGO_PASSWORD, MONGO_USER, REDIS_HOST, REDIS_PORT, SESSION_SECRET } = require('./config/config')

const postRouter = require('./routes/postRoute')
const userRouter = require('./routes/userRoute')

const protect = require('./middleware/authMiddleware')

const redis = require('redis')
const cors = require('cors')
const session = require('express-session')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
})

redisClient.on('error', console.log)


const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = ()=> mongoose.connect(mongoURL)
.then(() => console.log('successfully connect to db'))
.catch((e) =>{ 
  console.log('error:', e)
  setTimeout(connectWithRetry, 3000) 
})

connectWithRetry()

const port = process.env.PORT || 3000

app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60000
    }
}))
app.use(express.json())

app.get('/api', (req, res) => {
    console.log('Yeah, it ran')
    res.send('<h2> Hi There!</h2>')
})
app.use('/api/v1/posts', protect  ,postRouter)
app.use('/api/v1/users', userRouter)

app.listen(port, () => console.log(`listening on prot ${port}`))