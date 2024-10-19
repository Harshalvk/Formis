import FormGenerator from "@/components/FormGenerator";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <FormGenerator />
      </main>
    </>
  );
}
