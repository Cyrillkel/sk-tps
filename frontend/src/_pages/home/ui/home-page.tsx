import { HomeAbout } from "@/widgets/home-about";
import { HomeAdvantages } from "@/widgets/home-advantages";
import { HomeCooperation } from "@/widgets/home-cooperation";
import { HomeCredentials } from "@/widgets/home-credentials";
import { HomeFeedback } from "@/widgets/home-feedback";
import { HomeHero } from "@/widgets/home-hero";
import { HomeLetters } from "@/widgets/home-letters";
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
      <HomeFeedback />
      <HomeAdvantages />
      <HomeLetters />
      <HomeCredentials />
    </>
  );
}
