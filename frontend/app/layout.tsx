import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Apex Fit AI | نظام التدريب والتغذية الذكي للأبطال والكباتن",
  description: "المنصة الرياضية المتقدمة لكمال الأجسام والفتنس. مساعدك ومساعد كوتشك الرياضي لحساب الماكروز، وجداول التمارين، والزيادة التدريجية في الأوزان بدقة علمية.",
  icons: {
    icon: '/images/apex_brand_logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#141619',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            },
            success: {
              iconTheme: {
                primary: '#3B82F6',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
