import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navbar />
        <div className=" flex flex-col w-full ">{children}</div>
        <Footer />
      </div>
    </main>
  );
}
