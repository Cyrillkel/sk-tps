import { HomeAbout } from "@/widgets/home-about";
import { HomeCooperation } from "@/widgets/home-cooperation";
import { HomeCredentials } from "@/widgets/home-credentials";
import { HomeHero } from "@/widgets/home-hero";
import { HomeProcess } from "@/widgets/home-process";
import { HomeServices } from "@/widgets/home-services";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeAbout />
      <HomeCooperation />
      <HomeProcess />
      <HomeCredentials />
    </>
  );
}
