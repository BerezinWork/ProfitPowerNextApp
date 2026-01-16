import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
    subsets: ["latin", "cyrillic"],
    variable: "--font-manrope",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: "%s | Profit Power",
        default: "Profit Power",
    },
    description: "Finance App",
    icons: "/short-logo.svg"
};

export default function RootLayout(
    {
        children
    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={manrope.variable}>
                {children}
            </body>
        </html>
    );
}