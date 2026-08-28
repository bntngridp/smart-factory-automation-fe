import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forge | Enterprise Smart Factory Automation",
  description: "Real-time manufacturing operations, inventory control & analytics dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('forge_theme') || 'dark';
                  var contrast = localStorage.getItem('forge_high_contrast') === 'true';
                  var density = localStorage.getItem('forge_ui_density') || 'comfortable';
                  var accent = localStorage.getItem('forge_accent_color') || 'blue';
                  
                  var root = document.documentElement;
                  if (theme === 'light') {
                    root.classList.add('light-mode');
                    root.classList.remove('dark-mode');
                    root.style.backgroundColor = '#F8FAFC';
                    root.style.color = '#0F172A';
                  } else {
                    root.classList.add('dark-mode');
                    root.classList.remove('light-mode');
                    root.style.backgroundColor = '#0B0F17';
                    root.style.color = '#F8FAFC';
                  }
                  if (contrast) root.classList.add('high-contrast');
                  if (density === 'compact') root.classList.add('density-compact');
                  if (accent) root.classList.add('accent-' + accent);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
