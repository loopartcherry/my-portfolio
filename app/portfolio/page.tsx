import { Footer } from "@/components/sections/footer";
import { Cases } from "@/components/sections/cases";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background noise-overlay scanlines">
      <main className="pt-0">
        <Cases />
      </main>
      <Footer />
    </div>
  );
}
