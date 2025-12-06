import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex w-full flex-row justify-center items-center mx-auto">
      <div className="w-full hidden md:block relative h-screen">
        <Image
          src="/authImage.png"
          alt="Auth Image"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image
          src="/CanvaslySideBarLogo.png"
          alt="logo"
          width={200}
          height={150}
        />
        {children}
      </div>
    </div>
  );
}
