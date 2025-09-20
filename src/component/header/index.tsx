"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  id_admin: string;
  id_unit_kerja: string;
  name: string;
  role: string;
  type: string;
}

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  dataUsers?: string;
  Foto?: string;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    try {
      // Get token from cookie
      const token = getCookie('XSX01');
      
      if (typeof token === "string" && token) {
        // Decode token
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Set user data
        setUserName(decoded.name);
        setUserRole(decoded.type);
        
        console.log("Decoded token:", decoded);
      } else {
        console.log("No token found or token is not a string");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setUserName("Guest");
      setUserRole("");
    }
  }, []);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-end px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

       

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* User Info */}
            <li className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {userName || "Loading..."}
                </p>
                {userRole && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userRole}
                  </p>
                )}
              </div>
              
              {/* Avatar placeholder */}
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            </li>

            {/* <DarkModeSwitcher /> */}
          </ul>

          {/* <DropdownUser foto={props?.Foto} /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;