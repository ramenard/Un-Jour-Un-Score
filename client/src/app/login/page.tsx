import type React from "react";
import LoginForm from "@/components/LoginForm";

export default function Register() {
    return (
        <div className="nes-theme min-h-screen w-full flex justify-center">
            <div className="container w-1/4 my-28">
                <LoginForm />
            </div>
        </div>
    )
}