require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = require('./configs/db');

const notfound = require('./middlewares/notfound');
const errorHandler = require('./middlewares/errorHandler');

app.get('/', (req, res) => {
  res.status(200).send('Backend is running!');
});

const authRouter = require('./routers/authRouter');
const customerRouter = require('./routers/customerRouter');
const orderRouter = require('./routers/orderRouter');
const employeeRouter = require('./routers/employeeRouter');
const productRouter = require('./routers/productRouter');
const vehicleRouter = require('./routers/vehicleRouter');
const vehiclebrandRouter = require('./routers/vehiclebrandRouter');
const cylinderdepositRouter = require('./routers/cylinderdepositRouter');
const order_itemRouter = require('./routers/order_itemRoute');
const fillingorderRouter = require('./routers/fillingorderRouter');
const maintenenceRouter = require('./routers/maintenenceRouter');
const historyOrderRouter = require('./routers/historyOrderRouter');
const dashboardRouter = require('./routers/dashboardRouter');

app.use('/api/auth', authRouter);
app.use('/api/customer', customerRouter);
app.use('/api/order', orderRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/product', productRouter);
app.use('/api/vehicle', vehicleRouter);
app.use('/api/vehiclebrand', vehiclebrandRouter);
app.use('/api/cylinderdeposit', cylinderdepositRouter);
app.use('/api/order_item', order_itemRouter);
app.use('/api/fillingorder', fillingorderRouter);
app.use('/api/maintenence', maintenenceRouter);
app.use('/api/historyOrder', historyOrderRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notfound);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_employee_room', (data) => {
    if (data?.employee_id) {
      socket.join(`employee_${data.employee_id}`);
    }
  });
});

const port = process.env.PORT || 5000;

server.listen(port);

process.on('unhandledRejection', (err, promise) => {
  server.close(() => process.exit(1));
});