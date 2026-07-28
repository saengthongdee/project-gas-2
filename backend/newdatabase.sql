show databases;

use defaultdb;
show tables;

-- =========================================================
-- 1. Vehicle Brands (ยี่ห้อยานพาหนะ)
-- =========================================================
CREATE TABLE vehicle_brands (
    brand_id        INT AUTO_INCREMENT PRIMARY KEY,
    brand_type      VARCHAR(100)   NOT NULL
) ENGINE=InnoDB;

-- =========================================================
-- 2. Vehicles (ยานพาหนะ)
-- =========================================================
CREATE TABLE vehicles (
    vehicle_id      INT AUTO_INCREMENT PRIMARY KEY,
    license_plate   VARCHAR(20)    NOT NULL,
    brand_id        INT,
    capacity_kg     INT,
    status          VARCHAR(50)    DEFAULT 'available',
    CONSTRAINT fk_vehicles_brand
        FOREIGN KEY (brand_id) REFERENCES vehicle_brands(brand_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;
-- =========================================================
-- 3.rolesประเภทพนักงาน
-- =========================================================
create table roles (
	role_id int auto_increment primary key,
        role_name varchar(100)
)ENGINE=InnoDB;

-- =========================================================
-- 4. Employees (พนักงาน)
-- =========================================================
CREATE TABLE employees (
    employee_id     INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)   NOT NULL,
    role_id        INT,
    phone           VARCHAR(20),
    vehicle_id      INT,
    email           varchar(100),
    password        varchar(100),
    CONSTRAINT fk_employees_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
       CONSTRAINT fk_employees_role
        FOREIGN KEY (role_id) REFERENCES roles (role_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 5. Customers (ลูกค้า)
-- =========================================================
CREATE TABLE customers (
    customer_id     INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)   NOT NULL,
    phone           VARCHAR(20),
    address         VARCHAR(255),
    customer_type   VARCHAR(50)    DEFAULT 'retail',
    credit_limit    DECIMAL(10,2)  DEFAULT 0
) ENGINE=InnoDB;

-- =========================================================
-- 6. Filling Plants (โรงบรรจุ)
-- =========================================================
CREATE TABLE filling_plants (
    plant_id        INT AUTO_INCREMENT PRIMARY KEY,
    plant_name      VARCHAR(150)   NOT NULL,
    phone           VARCHAR(20),
    address         VARCHAR(255),
    license_no      VARCHAR(100)
) ENGINE=InnoDB;

-- =========================================================
-- 7. Cylinder Types (ประเภทถัง)
-- =========================================================
CREATE TABLE cylinder_types (
    cylinder_type_id  INT AUTO_INCREMENT PRIMARY KEY,
    type_name         VARCHAR(100)   NOT NULL,
    size_kg           DECIMAL(6,2),
    sale_price        DECIMAL(10,2),
    stock_qty         INT            DEFAULT 0
) ENGINE=InnoDB;

-- =========================================================
-- 8. Products / Parts (สินค้า)
-- =========================================================
CREATE TABLE products (
    product_id      INT AUTO_INCREMENT PRIMARY KEY,
    product_name    VARCHAR(150)   NOT NULL,
    unit            VARCHAR(50),
    sale_price      DECIMAL(10,2),
    stock_qty       INT            DEFAULT 0,
    min_stock_qty   INT            DEFAULT 0
) ENGINE=InnoDB;

-- =========================================================
-- 9. Filling/Refill Orders (รายการสั่งบรรจุ)
-- =========================================================
CREATE TABLE filling_orders (
    filling_order_id   INT AUTO_INCREMENT PRIMARY KEY,
    plant_id           INT NOT NULL,
    cylinder_type_id    INT NOT NULL,
    order_date          DATE NOT NULL,
    return_date         DATE,
    qty_sent            INT NOT NULL,
    qty_returned        INT,
    unit_price          DECIMAL(10,2),
    status              VARCHAR(50)   DEFAULT 'pending',
    CONSTRAINT fk_fillingorders_plant
        FOREIGN KEY (plant_id) REFERENCES filling_plants(plant_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_fillingorders_cylindertype
        FOREIGN KEY (cylinder_type_id) REFERENCES cylinder_types(cylinder_type_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 10. Stock Withdrawal Records (รายการเบิกจ่าย)
-- =========================================================
CREATE TABLE withdrawal_records (
    withdrawal_id    INT AUTO_INCREMENT PRIMARY KEY,
    bill_id          INT,
    item_type        VARCHAR(50)    NOT NULL,   -- e.g. cylinder / product
    cylinder_type_id INT,
    product_id       INT,
    qty              INT            NOT NULL,
    unit_price       DECIMAL(10,2),
    empty_returned   INT            DEFAULT 0,
    CONSTRAINT fk_withdrawal_cylindertype
        FOREIGN KEY (cylinder_type_id) REFERENCES cylinder_types(cylinder_type_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_withdrawal_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 11. Maintenance / Repairs (ซ่อมบำรุง)
-- =========================================================
CREATE TABLE maintenance (
    maintenance_id    INT AUTO_INCREMENT PRIMARY KEY,
    cylinder_type_id  INT,
    employee_id       INT,
    received_date     DATE NOT NULL,
    completed_date    DATE,
    qty               INT            DEFAULT 1,
    issue_desc        VARCHAR(255),
    status            VARCHAR(50)    DEFAULT 'pending_inspection',
    cost              DECIMAL(10,2),
    notes             VARCHAR(255),
    CONSTRAINT fk_maintenance_cylindertype
        FOREIGN KEY (cylinder_type_id) REFERENCES cylinder_types(cylinder_type_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 12. Sales Bills (บิลขาย)
-- =========================================================
CREATE TABLE sales_bills (
    bill_id         INT AUTO_INCREMENT PRIMARY KEY,
    customer_id     INT NOT NULL,
    employee_id     INT NOT NULL,
    sale_date       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount    DECIMAL(10,2)  NOT NULL DEFAULT 0,
    payment_method  VARCHAR(50)    DEFAULT 'cash',
    payment_status  VARCHAR(50)    DEFAULT 'unpaid',
    CONSTRAINT fk_salesbills_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_salesbills_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 13. Deliveries (การจัดส่ง)
-- =========================================================
CREATE TABLE deliveries (
    delivery_id     INT AUTO_INCREMENT PRIMARY KEY,
    bill_id         INT NOT NULL,
    vehicle_id      INT,
    driver_id       INT,
    scheduled_at    DATETIME,
    delivered_at    DATETIME,
    status          VARCHAR(50)    DEFAULT 'pending',
    CONSTRAINT fk_deliveries_bill
        FOREIGN KEY (bill_id) REFERENCES sales_bills(bill_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_deliveries_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_deliveries_driver
        FOREIGN KEY (driver_id) REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 14. Payments (การชำระเงิน)
-- =========================================================
CREATE TABLE payments (
    payment_id      INT AUTO_INCREMENT PRIMARY KEY,
    bill_id         INT NOT NULL,
    amount          DECIMAL(10,2)  NOT NULL,
    payment_method  VARCHAR(50)    NOT NULL DEFAULT 'cash',
    payment_date    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    slip_image      VARCHAR(255),
    CONSTRAINT fk_payments_bill
        FOREIGN KEY (bill_id) REFERENCES sales_bills(bill_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;



-- =========================================================
-- Additional indexes on FK columns (performance)
-- =========================================================
CREATE INDEX idx_vehicles_brand
ON vehicles(brand_id);

CREATE INDEX idx_employees_role
ON employees(role_id);

CREATE INDEX idx_employees_vehicle
ON employees(vehicle_id);

CREATE INDEX idx_fillingorders_plant
ON filling_orders(plant_id);

CREATE INDEX idx_fillingorders_cylindertype
ON filling_orders(cylinder_type_id);

CREATE INDEX idx_withdrawal_cylindertype
ON withdrawal_records(cylinder_type_id);

CREATE INDEX idx_withdrawal_product
ON withdrawal_records(product_id);

CREATE INDEX idx_maintenance_cylindertype
ON maintenance(cylinder_type_id);

CREATE INDEX idx_maintenance_employee
ON maintenance(employee_id);

CREATE INDEX idx_salesbills_customer
ON sales_bills(customer_id);

CREATE INDEX idx_salesbills_employee
ON sales_bills(employee_id);

CREATE INDEX idx_deliveries_bill
ON deliveries(bill_id);

CREATE INDEX idx_deliveries_vehicle
ON deliveries(vehicle_id);

CREATE INDEX idx_deliveries_driver
ON deliveries(driver_id);

CREATE INDEX idx_payments_bill
ON payments(bill_id);
-- =========================================================
-- End of GasPro database schema
-- =========================================================

