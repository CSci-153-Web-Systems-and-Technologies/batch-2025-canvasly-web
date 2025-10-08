//import Image from "next/image";
import "@/app/globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center justify-center">
      <div>CANVASLY</div>
      <div>{children}</div>
    </main>
  );
}
