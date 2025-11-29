import Navbar from "@/components/navbar";

export default function PurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navbar />
        <div className="w-full text-base mt-24 p-10">
          <p className="text-3xl lg:text-5xl lg:max-w-xl ">Pending Purchases</p>
        </div>
        {children}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
