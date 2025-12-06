// "use client";

//import { DeployButton } from "@/components/deploy-button";
//import { EnvVarWarning } from "@/components/env-var-warning";
//import { AuthButton } from "@/components/auth-button";
import FollowSuggestions from "@/components/follow-suggestions";
import Footer from "@/components/footer";
import { HeroHome } from "@/components/hero-home";
import Navbar from "@/components/navbar";
import PopularTrends from "@/components/popular-trends";
//import { ThemeSwitcher } from "@/components/theme-switcher";
//import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
//import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
//import { hasEnvVars } from "@/lib/utils";
import HomeView from "@/sections/HomeView";

//import Link from "next/link";
//import SearchBar from "@/components/SearchBar";
//import { useSidebar } from "@/components/ui/sidebar";

export default function Home() {
  //const { toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navbar />
        <div className="flex-1 flex flex-col gap-10 md:gap-20 w-full bg-[#f5f5f5] pt-14 md:pt-24">
          <HeroHome
            srcImage="/hero-page-art.png"
            typography="Discover Latest Art"
            subheading="From latest illustrations, discover artworks."
          />
          <main className="flex-1 flex justify-between gap-4 mx-auto w-full max-w-7xl md:px-4">
            <div className="w-full max-w-5xl">
              <HomeView />
            </div>

            <div className="items-start justify-center hidden md:flex w-full max-w-sm">
              <div className="sticky top-28 flex flex-col w-full items-center gap-4">
                <PopularTrends />
                <FollowSuggestions />
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
