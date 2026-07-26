import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Initializer from "@/components/Initializer";

export const metadata: Metadata = {
  title: "GymEase - Gym Tanpa Ribet Setelah Kerja",
  description: "Kami menyediakan pakaian olahraga, handuk, locker, dan laundry sehingga Anda hanya perlu datang dan berolahraga. Temukan gym mitra terbaik di Jakarta.",
  keywords: ["gym", "fitness", "rental sportswear", "sewa baju olahraga", "laundry", "scbd", "megakuningan", "loker gym"],
  authors: [{ name: "GymEase Team" }],
  openGraph: {
    title: "GymEase - Gym Tanpa Ribet Setelah Kerja",
    description: "Sewa pakaian olahraga, handuk, locker, dan dapatkan laundry service. Tinggal datang dan berolahraga.",
    type: "website",
    locale: "id_ID"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-[#030303]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Initializer />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
