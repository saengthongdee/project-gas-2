import React from "react";

export default function EmployeeFormFields({ formData, handleChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          ชื่อ-นามสกุล <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="เช่น นายสมชาย สายซิ่ง"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          เบอร์โทรศัพท์ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="phone"
          required
          placeholder="เช่น 086-222-3333"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          อีเมล <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="เช่น somchai@gas.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          ตำแหน่ง / บทบาท <span className="text-red-500">*</span>
        </label>
        <select
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] bg-white"
        >
          <option value="1">ผู้จัดการร้าน</option>
          <option value="2">แอดมินรับโทรศัพท์</option>
          <option value="3">คนขับรถส่งแก๊ส</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          สถานะการใช้งาน <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] bg-white"
        >
          <option value="active">ใช้งานปกติ</option>
          <option value="inactive">ระงับการใช้งาน</option>
        </select>
      </div>
    </>
  );
}