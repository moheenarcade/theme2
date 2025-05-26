
import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'
import "../assets/style/index.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         <Header/>
      { children }
      <Footer/>
      </body>
    </html>
  );
}


