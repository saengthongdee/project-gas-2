const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError =require('../utils/ApiError');

exports.findAlldashboard = asyncHandler(async (req , res , next) => {

    const result = await dashboardService.findAlldashboard()

    res.status(200).json(result)
})

exports.findDashboard2 = asyncHandler(async (req , res , next) => {

    const { year, month } = req.body;

    if (!year || !month) {
        throw new ApiError(400, 'Please provide both year and month in the request body');
    }

    const result = await dashboardService.findDashboard2(Number(year), Number(month));

    res.status(200).json(result);
})