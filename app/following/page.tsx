import FollowSuggestions from "@/components/follow-suggestions";
import { HeroHome } from "@/components/hero-home";
import FollowingView from "@/sections/FollowingView";

export default function Following() {
  return (
    <div className="flex-1 flex flex-col gap-10 md:gap-20 w-full pb-10 bg-[#f5f5f5] pt-14 md:pt-24">
      <HeroHome
        srcImage="/hero-page-art3.png"
        typography="Connect. Share. Inspire."
        subheading="A new way to build real connections online."
      />
      <main className="flex-1 flex justify-between gap-4 mx-auto w-full max-w-7xl md:px-4">
        <div className="w-full max-w-5xl">
          <FollowingView />
        </div>

        <div className="items-start justify-center hidden md:flex w-full max-w-sm">
          <div className="sticky top-32 flex flex-col w-full items-center gap-4">
            <FollowSuggestions />
          </div>
        </div>
      </main>
    </div>
  );
}
