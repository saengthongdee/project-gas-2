import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  UserCheck,
  LogOut,
  Truck,
  Receipt,
  Wrench,
  Flame,
  ClipboardList,
  ChevronDown,
  Bike,
  Bus,
  Lock
} from "lucide-react";

const menuSections = [
  {
    category: "ทั่วไป",
    collapsible: false,
    items: [
      { title: "Dashboard", path: "/", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    category: "จัดการคลังแก๊ส",
    collapsible: false,
    items: [
      { title: "จัดการสินค้า", path: "/product", icon: Package },
    ],
  },
  {
    category: "ออเดอร์",
    collapsible: false,
    items: [{ title: "ออเดอร์", path: "/order", icon: BarChart3 }],
  },
  {
    category: "การจัดส่ง",
    collapsible: false,
    items: [{ title: "รายการการจัดส่ง", path: "/delivery", icon: Truck }],
  },
  {
    category: "บิล / การค้างถัง",
    collapsible: true,
    items: [
      { title: "บิลรายการออเดอร์", path: "/bills/orders", icon: Receipt },
      { title: "บิลถังซ่อม", path: "/bills/maintenance", icon: Wrench },
      { title: "บิลถังบรรจุ", path: "/bills/filling", icon: Flame },
      { title: "รายการถังค้าง", path: "/bills/pending", icon: ClipboardList },
    ],
  },
  {
    category: "ลูกค้า / พนักงาน",
    collapsible: true,
    items: [
      { title: "ข้อมูลพนักงาน", path: "/employee", icon: UserCheck },
      { title: "ข้อมูลลูกค้า", path: "/customer", icon: Users },
    ],
  },
    {
    category: "ยานพาหนะ",
    collapsible: true,
    items: [
      { title: "รายการยานพาหนะ", path: "/vehicles", icon: Bike },
      { title: "รายการยานพาหนะ", path: "/vehiclebrand", icon: Bus },
    ],
  },
  {
  category: "ความปลอดภัย",
  collapsible: false,
  items: [
    { title: "จัดการรหัสผ่าน", path: "/security", icon: Lock },
  ],
}
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [openSections, setOpenSections] = useState(
    Object.fromEntries(
      menuSections.filter((s) => s.collapsible).map((s) => [s.category, true]),
    ),
  );

  const toggleSection = (category) => {
    setOpenSections((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (

    <aside className="w-64 bg-[#F5F8FB] text-slate-200 h-screen p-2 flex flex-col justify-between shadow-lg shrink-0 overflow-hidden">
      
      <div className="text-xl font-bold p-3 mb-3 border-b border-neutral-700 text-[#1A1A1A] flex items-center gap-2 shrink-0">
        <span>ระบบจัดการร้านแก๊ส</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 px-2 border border-neutral-200 rounded-md py-2">
        {menuSections.map((section) => {
          const isOpen = section.collapsible
            ? openSections[section.category]
            : true;

          return (
            <div key={section.category}>
              {section.collapsible ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.category)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#545454] uppercase tracking-wider hover:text-[#1A1A1A] transition-colors"
                >
                  <span>{section.category}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <h3 className="px-4 text-xs font-semibold text-[#545454] uppercase tracking-wider mb-2">
                  {section.category}
                </h3>
              )}

              <nav
                className={`space-y-1 overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-6 py-2.5 rounded-[5px] text-[13px] font-medium transition-all ${
                          isActive
                            ? "bg-neutral-200 text-[#1A1A1A]"
                            : "hover:bg-neutral-200 text-[#1A1A1A]"
                        }`
                      }
                    >
                      <IconComponent className="w-4 h-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* 📌 4. ปุ่มออกจากระบบ (ใส่ shrink-0 อยู่ล่างสุดเสมอ) */}
      <div className="pt-3 space-y-3 shrink-0 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-neutral-700 hover:bg-red-700 text-slate-200 hover:text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}