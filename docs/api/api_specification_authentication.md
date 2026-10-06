# API Summary - Authentication

---

### 1. Login
* **Endpoint:** `POST /api/auth/login`
* **รับ (Request Body):**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
* **คืนค่า (Response 200):**
  ```json
  {
    "success": true,
    "message": "Login successfull",
    "token": "string",
    "role_ID": 1,
    "employee_name": "string",
    "vehicle_id": 1,
    "status": "string",
    "employee_id": 1
  }
  ```

---

### 2. Register Employee
* **Endpoint:** `POST /api/auth/register`
* **รับ (Request Body):**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role_id": 1,
    "phone": "string"
  }
  ```
* **คืนค่า (Response 201):**
  ```json
  {
    "success": true,
    "message": "Employee register successfully",
    "employeeId": 1
  }
  ```
