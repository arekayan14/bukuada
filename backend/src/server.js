const express      = require('express')
const cors         = require('cors')
const userRoutes   = require('./routes/user')
const bukuRoutes   = require('./routes/buku')
const pinjamRoutes = require('./routes/peminjaman')

const app  = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.use('/api/user',       userRoutes)
app.use('/api/buku',       bukuRoutes)
app.use('/api/peminjaman', pinjamRoutes)

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})
