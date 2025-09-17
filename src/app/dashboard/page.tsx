import LoginForm from "@/component/page/auth/operator/login";
import DashboardPages from "@/component/page/dashboard";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Page",
};


export default function Dashboard(){
    return (
        <DashboardPages />
    )
}
