import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}
