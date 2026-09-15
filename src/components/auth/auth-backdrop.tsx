"use client";

import { Aurora } from "@/components/react-bits/aurora";
import { useTheme } from "@/components/layout/theme-provider";

const DARK = ["#00e676", "#126e51", "#ffdf1b"];
const LIGHT = ["#0e5c44", "#00c853", "#e6c200"];

export function AuthBackdrop() {
  const { theme } = useTheme();
  const light = theme === "light";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${light ? "bg-[#eef6f1]" : "bg-[#07110c]"}`} />
      <div className="absolute inset-[-12%] scale-110">
        <Aurora
          colorStops={light ? LIGHT : DARK}
          amplitude={1.85}
          blend={0.82}
          speed={1.05}
          lightMode={light}
        />
      </div>
      <div
        className={
          light
            ? "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(238,246,241,0.35)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(7,17,12,0.28)_100%)]"
        }
      />
    </div>
  );
}
