// "use client";

//import { DeployButton } from "@/components/deploy-button";
//import { EnvVarWarning } from "@/components/env-var-warning";
//import { AuthButton } from "@/components/auth-button";
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
        <div className="flex-1 flex flex-col gap-10 md:gap-20 w-full bg-[#f5f5f5]">
          <HeroHome />
          <main className="flex-1 flex justify-between gap-4 mx-auto w-full max-w-7xl md:px-4">
            <div className="w-full max-w-5xl">
              <HomeView />
            </div>

            <div className="items-start justify-center hidden md:flex w-full max-w-sm">
              <div className="sticky top-4 flex flex-col w-full items-center gap-4">
                <PopularTrends />
                <span>Follow Suggestionss</span>
              </div>
            </div>
          </main>
        </div>
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
