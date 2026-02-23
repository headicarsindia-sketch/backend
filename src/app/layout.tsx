import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ressummit Admin Panel",
  description: "Admin dashboard for Ressummit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-100">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-gray-100
          text-gray-900
        `}
      >
        <div className="flex min-h-screen text-gray-900">
          {/* ================= Sidebar ================= */}
          <aside className="w-64 bg-white shadow-md hidden md:block text-gray-900">
            <div className="p-6 border-b font-bold text-lg text-black">
              RESSummit 2047
            </div>

            <nav className="p-4 space-y-3 text-black">
              <a
                href="/register"
                className="block px-3 py-2 rounded hover:bg-gray-100 text-black"
              >
                Registration
              </a>

              <a
                href="/"
                className="block px-3 py-2 rounded hover:bg-gray-100 text-black"
              >
                Awards Nominations
              </a>

              <a
                href="/abstract"
                className="block px-3 py-2 rounded hover:bg-gray-100 text-black"
              >
               Abstracts Submission </a>
               {/* <a href="/submit_abstract"
                  className="block px-3 py-2 rounded hover:bg-gray-100 text-black">
                    submit_abstract
                  </a> */}

            </nav>
          </aside>

          {/* ================= Main Content ================= */}
          <div className="flex-1 flex flex-col text-gray-900">
            {/* Header */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center text-black">
              <h1 className="text-xl font-semibold text-black">
                RESSummit Admin Panel
              </h1>

              <div className="text-sm text-gray-600">
                Admin Block
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6 overflow-y-auto text-gray-900">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
