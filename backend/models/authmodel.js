//fix schema
const db =require('../configs/db');
//login user by email
const findUserByEmail = async (email , callback) => {
    const sql ="SELECT * FROM employees WHERE email = ?"
    db.query(sql , [email] ,callback);
}
//register employee
const registerEmployee = async(employeeData , callback)=>{
    const sql = "INSERT INTO employees set ?"
    db.query(sql, employeeData,callback)
}
//หาroleอีกทีเพื่อreturn

const findroleByEmail = async (email,callback) => {
    const sql = "select r.role_id from employees e join roles r on e.role_id = r.role_id where e.email = ?"
    db.query(sql, [email],callback)
}

module.exports = {
    findUserByEmail,
    registerEmployee,
    findroleByEmail
}