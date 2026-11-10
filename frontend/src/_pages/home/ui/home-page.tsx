import { HomeAbout } from "@/widgets/home-about";
import { HomeAdvantages } from "@/widgets/home-advantages";
import { HomeClients } from "@/widgets/home-clients";
import { HomeCooperation } from "@/widgets/home-cooperation";
import { HomeCredentials } from "@/widgets/home-credentials";
import { HomeFeedback } from "@/widgets/home-feedback";
import { HomeGeography } from "@/widgets/home-geography";
import { HomeHero } from "@/widgets/home-hero";
import { HomeLetters } from "@/widgets/home-letters";
import { HomeProcess } from "@/widgets/home-process";
import { HomeProjects } from "@/widgets/home-projects";
import { HomeReviews } from "@/widgets/home-reviews";
import { HomeServices } from "@/widgets/home-services";
import { pageMetadata } from "@/shared/lib";

export const metadata = pageMetadata({ title: "Монтаж и обслуживание инженерных систем", description: "Инженерные и технологические системы предприятий: монтаж, ремонт, реконструкция и обслуживание в Калужской, Тульской и Московской областях. Техпромстрой.", path: "/", image: "/images/hero.webp" });

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeProjects />
      <HomeAbout />
      <HomeCredentials />
      <HomeCooperation />
      <HomeProcess />
      <HomeGeography />
      <HomeFeedback />
      <HomeAdvantages />
      <HomeLetters />
      <HomeClients />
      <HomeReviews />
    </>
  );
}
