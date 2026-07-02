import "./globals.css";

export const metadata = {
  title: "Daniel's Portfolio",
  description: "Daniel Augustian Girsang - Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
