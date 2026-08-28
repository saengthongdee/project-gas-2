const fillingOrderService = require('../services/fillingorderService')
const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')

exports.findAllFillingOrder = asyncHandler(async (req, res, next) => {
    const result = await fillingOrderService.findALlFillingOrder();
    res.status(200).json(result);
})

exports.createFillingOrder = asyncHandler(async (req, res, next) => {
    const { order_date, imageBase64 } = req.body;

    if (!order_date) {
        return next(new ApiError(400, "order_date is required"));
    }

    let imagePath = null;

    if (imageBase64) {
        // 1. ตัด Data URL header ออก
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // 2. กำหนดชื่อไฟล์และแยกโฟลเดอร์เฉพาะสำหรับบิลเติมแก๊ส (uploads/fillings)
        const filename = `filling-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
        const uploadDir = path.join(__dirname, '../uploads/fillings'); 

        // 3. ตรวจสอบและสร้างโฟลเดอร์แยกอัตโนมัติหากยังไม่มี
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);

        // 4. บันทึกไฟล์ลงโฟลเดอร์แยก
        fs.writeFileSync(filePath, buffer);

        // 5. บันทึก Path ลง Database ให้ชี้ไปที่โฟลเดอร์ใหม่
        imagePath = `uploads/fillings/${filename}`;
    }

    const fillingData = {
        order_date,
        imageUrl: imagePath
    };

    const result = await fillingOrderService.createFillingOrder(fillingData);
    res.status(201).json(result);
})

exports.deleteFillingOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ApiError(400, "id not found"));
    }

    const result = await fillingOrderService.deletefillingOrder(id);
    res.status(200).json(result);
})