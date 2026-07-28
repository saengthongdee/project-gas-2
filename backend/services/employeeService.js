const employeeModel =require('../models/employeeModel');
const ApiError =require('../utils/ApiError');

const findAllEmployee =async()=>{
    return new Promise ((success,fail)=>{
        employeeModel.findAllEmployee((error,results)=>{
            if(error){return fail(error)}
            success({
                success: true,
                message:"Employees retrived Successfully",
                data:results
            })
        })
    })
}

const createEmployee =async(employeedata)=>{
    return new Promise((success,fail)=>{
        employeeModel.createEmployee(employeedata,(error,results)=>{
            if(error){return fail(error)}
            
            success({
                success:true,
                message:"Employee created Successfully",
                data:results
            })
        })
    })
}

const updateEmployee =async(employeedata,employee_id)=>{
    return new Promise((success,fail)=>{
        employeeModel.updateEmployee(employeedata,employee_id,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Employee updated Successfully",
                data:results
            })
        })
    })
}

const deleteEmployee = async(employee_id)=>{
    return new Promise((success,fail)=>{
        employeeModel.deleteEmployee(employee_id,async(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Employee deleted Successfully"
            })
        })
    })
}
module.exports={
    findAllEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
}