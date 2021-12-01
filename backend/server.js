import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import colors from 'colors'
import connectDB from './config/db.js'
import prodcutRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import axios from 'axios'
dotenv.config()
connectDB()

const app = express()
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// get payment status id
app.get('/status', (req, res) => {
  axios.get('https://www.thenewstep.cn/pay/logs/log.txt').then((response) => {
    res.json({ status: response.data })
  })
})

// get paypal client id
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
})

app.use('/api/products', prodcutRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

//upload folder as static folder
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('server started...')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8888

app.listen(
  PORT,
  console.log(
    `server under ${process.env.NODE_ENV} start at ${PORT}`.yellow.bold
  )
)
