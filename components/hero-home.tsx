import Image from "next/image";

export function HeroHome({
  srcImage,
  typography,
  subheading,
}: {
  srcImage: string;
  typography: string;
  subheading: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:w-full md:p-0 p-5 justify-center bg-background">
      <div className="md:w-1/2 flex md:items-center md:justify-center py-10 md:p-0 md:px-12">
        <div className="flex flex-col gap-4 md:gap-8 md:justify-center md:mx-auto">
          <p className="text-3xl lg:text-5xl lg:max-w-xl ">{typography}</p>
          <p className="text-xl lg:text-2xl text-[#818181]">{subheading}</p>
        </div>
      </div>
      <div className="relative w-full md:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[500px]">
        <Image
          src={srcImage}
          alt="hero page art"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover "
          priority
        />
      </div>
    </div>
  );
}
