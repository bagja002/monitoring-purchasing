"use client"
import { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";



export default function Mainlayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen} />

         <div className="relative flex flex-1 flex-col lg:ml-70">
          <Header 
           sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}/>
     
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
