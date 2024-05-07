import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octopus Q",
  description: "Assist Creating Documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-no-repeat min-h-dvh bg-white`} >

        {/* <Script id="chatbot">
          {
            `(function (w, d, s, o, f, js, fjs) {
            w['MyWidget'] = o; w[o] = w[o] || function () {(w[o].q = w[o].q || []).push(arguments)};
          js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
          js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
    }(window, document, 'script', 'mw', 'https://res.cloudinary.com/garhia/raw/upload/v1/heedbase/heedbase-widget.js'));
          mw('init', {botId: "08ca426357e14d67b33df4c4c506c502" });`
          }
        </Script> */}
        <Providers>
          <main>
            {children}
          </main>
        </Providers>

      </body>
    </html>
  );
}
