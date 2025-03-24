import "./globals.css"
import type { Metadata } from "next"
import { Inter, Press_Start_2P } from "next/font/google"
import Header from "../components/Header"
import Footer from "../components/Footer"
import type React from "react"
import {getSession} from "@/lib/session";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const pressStart2P = Press_Start_2P({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-nes",
});

export const metadata: Metadata = {
    title: "Un jour, un score",
    description: "Challenge yourself daily with our unique scoring game!",
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {

    const session = await getSession()

    return (
        <html lang="en">
            <body className={`${inter.variable} ${pressStart2P.variable}`}>
                <Header userStatus={{isAuth: session.isAuth, userRole : session.user.role}}/>
                <main>{children}</main>
                <Footer/>
            </body>
        </html>
    )
}