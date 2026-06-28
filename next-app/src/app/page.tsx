import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { StackedWorks } from "@/components/home/StackedWorks";
import { Timeline } from "@/components/home/Timeline";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StackedWorks />
        <Timeline />
      </main>
      <Footer />
    </>
  );
}
