const orderService =require('../services/orderService')
const fs = require('fs');
const path = require('path');
const asyncHandler =require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')


exports.createOrders = asyncHandler(async(req,res,next)=>{
    const orderData =req.body

    Object.keys(orderData).forEach(key =>{
        if(orderData[key] === undefined || orderData[key] === null){
            delete orderData[key]
        }
    })
    const result =await orderService.createOrder(orderData)
    res.status(201).json(result)
})
exports.findAllOrders=asyncHandler(async(req,res,next)=>{
    const results = await orderService.getAllOrder()
    res.status(200).json(results)
})
exports.findOrderbyStatus = asyncHandler(async(req,res,next)=>{
    const results = await orderService.findOrderbyStatus()
    res.status(200).json(results)
})
exports.deleteOrders = asyncHandler(async (req , res , next) => {

    const id = req.params.id
    
    if(!id) { return new ApiError(400,"Missing required field: id") }

    const result = await orderService.deleteOrder(id)
    res.status(200).json(result)
})

exports.updateOrderVehicle = asyncHandler(async (req, res, next) => {

  const { order_ids, vehicle_id } = req.body;

  if (!order_ids || !vehicle_id || !Array.isArray(order_ids) || order_ids.length === 0) {
    return next(new ApiError(400, "Missing or invalid required fields: order_ids (array) or vehicle_id"));
  }

  const result = await orderService.updateOrderVehicle(order_ids, vehicle_id);
  res.status(200).json(result);
});

exports.findOrdertodayByVehicle = asyncHandler(async(req , res , next) => {

    const id = req.params.id

    if(!id) {return next(new ApiError(400 , "vehicle_id is not requried"))}

    const results = await orderService.findOrdertodayByVehicle(id)
    res.status(200).json(results)
})
exports.findOneOrder = asyncHandler(async (req , res , next ) => {

    const id = req.params.id

    if(!id) { return next(new ApiError(400 , "order_id is requried"))}

    const result = await orderService.findOneOrder(id)
    res.status(200).json(result)
})
exports.uploadImage = asyncHandler(async (req, res, next) => {
    const { order_id } = req.params;
    const { imageBase64 } = req.body;

    if (!order_id || !imageBase64) {
        return next(new ApiError(400, "order_id and imageBase64 are required"));
    }

    // 1. ตัด Data URL header ออก (เช่น "data:image/jpeg;base64,") ถ้ามี
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // 2. กำหนดชื่อไฟล์และโฟลเดอร์ปลายทาง
    const filename = `proof-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const uploadDir = path.join(__dirname, '../uploads'); // ปรับ Path ตามโครงสร้างโปรเจกต์

    // 3. เช็กและสร้างโฟลเดอร์ uploads อัตโนมัติถ้ายังไม่มี
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    // 4. บันทึกไฟล์ลงโฟลเดอร์จริงบน Server
    fs.writeFileSync(filePath, buffer);

    // 5. สร้าง Path สำหรับบันทึกลง Database
    const imagePath = `/uploads/${filename}`;
    const result = await orderService.uploadImage(order_id, imagePath);

    const io = req.app.get('io')
    
    if(io) {
        io.emit('order_status_update' , {
            order_id: Number(order_id),
            status : 'delivered',
        })
    }

    res.status(200).json(result);
});