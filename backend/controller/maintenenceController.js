const maintenenceService = require('../services/maintenenceService')
const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')

exports.findAllMaintenance = asyncHandler(async (req, res, next) => {
    const result = await maintenenceService.findAllMaintenance();
    res.status(200).json(result);
})

exports.createMaintenance = asyncHandler(async (req, res, next) => {
    const { received_date, imageBase64 } = req.body;

    if (!received_date) {
        return next(new ApiError(400, "received_date is required"));
    }

    let imagePath = null;

    if (imageBase64) {

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // 2. กำหนดชื่อไฟล์และโฟลเดอร์สำหรับเก็บรูปซ่อมบำรุง (uploads/maintenance)
        const filename = `maintenance-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
        const uploadDir = path.join(__dirname, '../uploads/maintenance'); 

        // 3. ตรวจสอบและสร้างโฟลเดอร์อัตโนมัติหากยังไม่มี
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);

        // 4. บันทึกไฟล์ลงในโฟลเดอร์
        fs.writeFileSync(filePath, buffer);

        // 5. กำหนด Path ที่จะบันทึกลง Database
        imagePath = `uploads/maintenance/${filename}`;
    }

    const maintenanceData = {
        received_date,
        imageUrl: imagePath
    };

    const result = await maintenenceService.createMaintenance(maintenanceData);
    res.status(201).json(result);
})

exports.deleteMaintenance = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ApiError(400, "id not found"));
    }

    const result = await maintenenceService.deleteMaintenance(id);
    res.status(200).json(result);
})