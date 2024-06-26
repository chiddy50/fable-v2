import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./css/layout.css";
import "./css/loader.css";
import { MainContext } from "@/context/MainContext";
import FullPageLoader from "@/components/Helpers/full-page-loader";
import NavbarComponent from "@/components/navbar-component";
import CustomContext from "@/context/CustomContext";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
        <link rel="icon" href="/images/fable_black.png" sizes="any" />
      </head>

      <body className={montserrat.className}>
        <CustomContext>        
          <div className="h-screen w-screen flex flex-col">
          <NavbarComponent />
            {children}
          </div>

        </CustomContext>
        <FullPageLoader />
      </body>
    </html>
  );
}
