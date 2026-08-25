const db=require('../configs/db')

const findAllEmployee =async(callback)=>{
    const sql =
        `
        select e.employee_id , e.name , e.phone , e.email , r.role_name, e.status , v.license_plate , vb.brand_type from employees e 
	        left join roles r 
		        on e.role_id = r.role_id
			        left join vehicles v
				        on e.vehicle_id = v.vehicle_id
					        left join vehicle_brands vb
						        on vb.brand_id = v.brand_id;
        `

    db.query(sql,callback);
}

const createEmployee = async(employeedata,callback)=>{
    const sql ="INSERT INTO employees set ?"
    db.query(sql,employeedata,callback);
}

const updateEmployee =async(employeedata,employee_id,callback)=>{
    const sql="UPDATE employees set ? where employee_id= ?"
    db.query(sql,[employeedata,employee_id],callback);
}

const deleteEmployee =async(employee_id,callback)=>{
    const sql="DELETE FROM employees where employee_id = ?"
    db.query(sql,[employee_id],callback);
}

const ChangPassword = async(employee_id , newPassword , callback) => {

    const sql = "update employees set password = ? where employee_id = ?";

    db.query(sql , [newPassword , employee_id] , callback)
}
const findEmployeeStatus = (employee_id , callback) => {

    const sql = "select status from employees where employee_id = ?"

    db.query(sql , employee_id , callback)
}
const findOneEmployee_name = (vehicle_id , callback) => {

    const sql = `select name from employees where vehicle_id = ?`

    db.query(sql , vehicle_id , callback)
}

module.exports={
    findAllEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    ChangPassword,
    findEmployeeStatus,
    findOneEmployee_name
}