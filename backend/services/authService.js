//
const  bcrypt =require('bcryptjs');//hashpassword
const jwt = require('jsonwebtoken');

const authModel = require('../models/authmodel')

const ApiError = require('../utils/ApiError')

const login =async (email,password )=>{
    return new Promise((success ,fail) =>{
        authModel.findUserByEmail(email,async (err, results) => {

            if(err) {return fail(err)}

            if(results.lenght === 0){
                return fail(new ApiError(401,'User not found'))
            }
            const user =results[0];

            if(user.password === undefined || user.password === null) {
                return fail(new ApiError(400, "กรุณาติดต่อเจ้าของร้าน"))
            }

            if(!user) {
                return fail(new ApiError(401,'User not found'))
            }
            const isMatch =await bcrypt.compare(password , user.password);

            if(!isMatch){
                return fail(new ApiError(401,'Invalid password'))

            }
            const token =jwt.sign(
                {id: user.empolyee_id},
                process.env.JWT_SECRET,
                {expiresIn: '7d'}
            )
            authModel.findroleByEmail(email, async (err ,results)=>{
                if(err){return fail(err)}

                const roleValue= results[0]?.role_id || null;
                success({
                success: true,
                message: "Login successfull",
                token: token,
                role_ID: roleValue
            })

            })
        })
    })
}
//register employee
const registerEmployee = async (employeeData) => {
    employeeData.password =await bcrypt.hash(employeeData.password,10)

    return new Promise((success , fail) => {
            authModel.findUserByEmail(employeeData.email, async (err,result)=>{
                if(err){return fail(err)}
                const exits = result[0]
                
                if(exits){
                    return fail(new ApiError(409,"Email exits"))
                }

            //ส่งข้อมูลไป
                authModel.registerEmployee(employeeData , async (err, result)=>{
                if(err){return fail(err)}

                success({
                    success:true,
                    message:"Employee register successfully",
                    employeeId:result.insertId
                })
            })
        })
    })
}

module.exports={
    login,
    registerEmployee
}