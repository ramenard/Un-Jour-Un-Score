import "./globals.css"
import type { Metadata } from "next"
import { Inter, Press_Start_2P } from "next/font/google"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import type React from "react"

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${pressStart2P.variable}`}>
                <Navbar/>
                <main>{children}</main>
                <Footer/>
                <div className="nes-theme">
                    <button type="button" className="nes-btn is-primary">Primary</button>
                </div>
            </body>
        </html>
    )
}