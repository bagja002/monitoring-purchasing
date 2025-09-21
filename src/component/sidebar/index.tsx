"use client";

import {
  Home,
  User,
  Settings,
  LogOut,
  LucideIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClickOutside from "../utils/ClickOutside";
import React from "react";

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  type?: "default" | "danger";
  children?: MenuItem[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setOpenMenu(prev => (prev === id ? null : id)); // Accordion style
  };

  const mainMenuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
    {
      id: "kegiatan-main",
      label: "Kegiatan Pengadaan",
      icon: User,
      children: [
        {
          id: "perencanaan",
          label: "Perencanaan",
          href: "/kegiatan-pengadaan/perencanaan",
        },
        {
          id: "pelaksanaan",
          label: "Pelaksanaan",
          href: "/kegiatan-pengadaan/pelaksanaan",
        },
      ],
    },
    //{ id: "pengaturan", label: "Pengaturan", href: "/pengaturan", icon: Settings },
  ];

  const bottomMenuItems: MenuItem[] = [
    { id: "logout", label: "Logout", href: "/", icon: LogOut, type: "danger" },
  ];

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon;
    const isDanger = item.type === "danger";
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenu === item.id;

    const isActive =
      item.href === pathname ||
      (hasChildren && item.children!.some(child => child.href === pathname));

    return (
      <div key={item.id}>
        {item.href ? (
          <Link
            href={item.href}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isDanger
                ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                : isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            style={{ marginLeft: level * 16 }}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon
                  size={20}
                  className={isActive ? "text-blue-700" : "text-gray-500"}
                />
              )}
              <span>{item.label}</span>
            </div>
          </Link>
        ) : (
          <button
            onClick={() => toggleMenu(item.id)}
            aria-expanded={isOpen}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            style={{ marginLeft: level * 16 }}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon
                  size={20}
                  className={isActive ? "text-blue-700" : "text-gray-500"}
                />
              )}
              <span>{item.label}</span>
            </div>
            {hasChildren &&
              (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>
        )}

        {/* Sub-menu animasi */}
        {hasChildren && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-auto bg-white border-r border-gray-200 duration-300 ease-linear lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800">E-Purchasing</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded hover:bg-gray-100"
          >
            <svg
              className="fill-gray-600 hover:fill-gray-800 transition-colors"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6 space-y-1">
          {mainMenuItems.map(item => renderMenuItem(item))}
          <div className="my-6 border-t border-gray-200"></div>
          {bottomMenuItems.map(item => renderMenuItem(item))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 text-xs text-center text-gray-400">
          © 2024 EProc
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
