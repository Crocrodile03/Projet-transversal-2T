import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes/index'
// import mongoose from './db.js' // Uncomment when ready to connect to MongoDB

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use('/api', routes)

// Uncomment when ready to connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name')
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`)
//     })
//   })
//   .catch(error => {
//     console.error('Unable to connect to MongoDB:', error)
//   })

// For now, start server without DB connection
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
