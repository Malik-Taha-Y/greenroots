import Header from "@/components/Header";
import PlantWizard from "@/components/PlantWizard";

export default function PlantPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-5xl px-6 pt-6 pb-24">
        <PlantWizard />
      </section>
    </main>
  );
}
