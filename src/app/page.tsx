import FormGenerator from "@/components/FormGenerator";
import FormList from "@/components/forms/FormList";
import Header from "@/components/Header";
import { db } from "@/db";

export default async function Home() {
  const forms = await db.query.forms.findMany();
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center">
        <h1 className="text-3xl font-bold flex h-screen items-center justify-center">
          Landing Page Soon...
        </h1>
      </main>
    </>
  );
}
