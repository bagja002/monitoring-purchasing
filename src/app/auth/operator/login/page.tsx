import LoginForm from "@/component/page/auth/operator/login";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login Operator",
  description: "Login Operator",
};


export default function OperatorLogin(){
    return (
        <LoginForm />
    )
}
