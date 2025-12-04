// "use client";

//import { DeployButton } from "@/components/deploy-button";
//import { EnvVarWarning } from "@/components/env-var-warning";
//import { AuthButton } from "@/components/auth-button";
import DiscoverArtists from "@/components/discover-artists";
//import FollowSuggestions from "@/components/follow-suggestions";
import { HeroHome } from "@/components/hero-home";

//import PopularTrends from "@/components/popular-trends";
//import { ThemeSwitcher } from "@/components/theme-switcher";
//import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
//import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
//import { hasEnvVars } from "@/lib/utils";
//import FollowingView from "@/sections/FollowingView";

//import Link from "next/link";
//import SearchBar from "@/components/SearchBar";
//import { useSidebar } from "@/components/ui/sidebar";

export default function Artists() {
  //const { toggleSidebar } = useSidebar();

  return (
    <div className="flex-1 flex flex-col gap-10 md:gap-20 w-full pb-10 bg-[#f5f5f5] pt-14 md:pt-24">
      <HeroHome
        srcImage="/hero-page-art2.png"
        typography="Discover Artists"
        subheading="Discovering artists and finding new and compelling creative work."
      />
      <main className="flex-1 flex justify-between gap-4 mx-auto w-full md:px-4 max-w-7xl">
        <DiscoverArtists />
      </main>
    </div>
  );
}
