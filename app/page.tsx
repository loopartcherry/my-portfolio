import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Methodology } from "@/components/sections/methodology";
import { Cases } from "@/components/sections/cases";
import { Articles } from "@/components/sections/articles";
import { Products } from "@/components/sections/products";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background noise-overlay scanlines">
      <Header />
      <main>
        <Hero />
        <Trust />
        <Methodology />
        <Cases />
        <Articles />
        <Products />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
