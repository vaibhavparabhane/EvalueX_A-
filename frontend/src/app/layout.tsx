import "../index.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/common/toaster";
import { Toaster as Sonner } from "@/components/common/sonner";

export const metadata = {
  title: "EvalueX - AI Smart Grading Platform",
  description: "Automated examination grading with AI-powered OCR, rubrics, and feedback compilation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
}
