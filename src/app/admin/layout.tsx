import Navbar from "@/components/Navbar/Navbar";
import GenericSidebar from "@/components/sidebar/GenericSidebar";
import adminRoutes from "@/utils/routes/admin";
import React from "react";

export default function AdminLayout({children}:{children: React.ReactNode}){
    return(
        <div className="w-screen h-screen flex justify-between bg-[#005DE915] p-3 overflow-hidden">
            <div className="w-[23%] h-[99%] bg-white rounded-2xl">
                <GenericSidebar routes={adminRoutes}/>
            </div>
            <div className="w-[75%] h-[99%] bg-transparent">
                <Navbar/>
                <div className="h-[95%] overflow-y-auto pt-8">
                    {children}
                </div>
            </div>
        </div>
    )
}