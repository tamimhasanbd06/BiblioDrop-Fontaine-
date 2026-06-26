import "./globals.css";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export const metadata = {
  title: "BiblioDrop",
  description: "Your Local Library, Delivered",
};

// বাংলা মন্তব্য: Google font network dependency বাদ রাখা হয়েছে যাতে offline/build environment-এ error না হয়।
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-slate-900"
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
