require('dotenv').config();
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors())
app.use(express.json())

const db = require('./configs/db')

const notfound = require('./middlewares/notfound')
const errorHandler = require('./middlewares/errorHandler')


//routes 
const authRouter =require('./routers/authRouter')
const customerRouter =require('./routers/customerRouter')
const orderRouter =require('./routers/orderRouter')
const employeeRouter=require('./routers/employeeRouter')
const productRouter=require('./routers/productRouter')
const vehicleRouter=require('./routers/vehicleRouter')
const vehiclebrandRouter=require('./routers/vehiclebrandRouter')
const cylinderdepositRouter=require('./routers/cylinderdepositRouter')
const order_itemRouter =require('./routers/order_itemRoute')
const fillingorderRouter =require('./routers/fillingorderRouter')
const maintenenceRouter =require('./routers/maintenenceRouter')

//กำหนดชื่อ api
app.use('/api/auth',authRouter)
app.use('/api/customer',customerRouter)
app.use('/api/order',orderRouter)
app.use('/api/employee',employeeRouter)
app.use('/api/product',productRouter)
app.use('/api/vehicle',vehicleRouter)
app.use('/api/vehiclebrand',vehiclebrandRouter)
app.use('/api/cylinderdeposit',cylinderdepositRouter)
app.use('/api/order_item',order_itemRouter)
app.use('/api/fillingorder',fillingorderRouter)
app.use('/api/maintenence',maintenenceRouter)

app.use(notfound)
app.use(errorHandler)

const port = process.env.port || 5000

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

process.on(`unhandledRejecttion` ,(err,promise) =>{
    console.log(`Logged Error: ${err}`)
    server.close(() => process.exit(1))
})

