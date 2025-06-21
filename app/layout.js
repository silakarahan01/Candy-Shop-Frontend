import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"
import AuthProvider from "@/providers/AuthProvider"
import Link from "next/link";
import "./globals.css";
import Header from './components/Header/Header'
import Footer from './components/footer/Footer'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], 
});

 

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider session={session}>
          <main> 
          <Header/>
          
          {children}
        
          <Footer />
          </main>
        </AuthProvider>
        <div style={{position:"absolute",right:"0",top:"50%"}}> <Link href="/products"> <img  style={{width:"250px",height:"500px"}}  src="reklam.jpg"/></Link></div>  
      </body>
    </html>
  );
}
