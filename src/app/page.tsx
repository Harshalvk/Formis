import Header from "@/components/Header";
import LandingPage from "@/components/landing-page/LandingPage";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center z-10">
        <LandingPage />
      </main>
    </>
  );
}
