import { HomeAbout } from "@/widgets/home-about";
import { HomeCredentials } from "@/widgets/home-credentials";
import { HomeHero } from "@/widgets/home-hero";
import { HomeServices } from "@/widgets/home-services";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeAbout />
      <HomeCredentials />
    </>
  );
}
