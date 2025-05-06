import {AppLayout} from "@/components/layout/app-layout";
import {ThemeProvider} from "@/components/theme-provider";
import {AppProvider} from "@/context/AppProvider";
import {SignedIn, SignedOut} from "@clerk/nextjs";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boilerplate - Your Title Here",
  description: "Your Description Here",
  icons: {
    icon: "/images/logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SignedOut>{children}</SignedOut>
            <SignedIn>
              <AppLayout>{children}</AppLayout>
            </SignedIn>
          </ThemeProvider>
        </body>
      </html>
    </AppProvider>
  );
}
