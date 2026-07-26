import Header from "@/components/Header";
import FarmerWizard from "@/components/FarmerWizard";

export default function FarmerPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-5xl px-6 pt-6 pb-24">
        <FarmerWizard />
      </section>
    </main>
  );
}
