import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: "Bixx Sportsbook",
  description: "Live and pre-match sports betting across Kenyan and world football.",
};

const bootScript = `try{var t=localStorage.getItem("bixx.theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){document.documentElement.setAttribute("data-theme","dark")}
if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(regs){regs.forEach(function(reg){reg.unregister()})})}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
