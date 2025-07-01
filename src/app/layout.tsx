import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import AuthSessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management System",
  description: "A military-EEEEgrade project management system.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthSessionProvider session={session}>
            <Navbar />
            {children}
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
