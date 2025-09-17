import AdminLogin from "@/component/page/auth/admin/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Login Admin",
};

export default function (){
    return (
      <AdminLogin />
    )
}
