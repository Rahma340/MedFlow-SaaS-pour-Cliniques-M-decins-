// src/app/(auth)/setup/page.tsx
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return <div className="p-6 text-center text-red-600">Token invalide.</div>;
  }

  const user = await prisma.user.findFirst({
    where: { setupToken: token },
  });

  if (!user) {
    return <div className="p-6 text-center text-red-600">
      Lien expiré ou déjà utilisé.
    </div>;
  }

  async function handleSubmit(formData: FormData) {
    "use server";

    const password = formData.get("password") as string;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        setupToken: null,
        status: "ACTIVE",
      },
    });

    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form action={handleSubmit} className="bg-white p-6 rounded shadow w-96 space-y-4">
        <h1 className="text-lg font-semibold text-center">
          Créer votre mot de passe
        </h1>

        <input
          type="password"
          name="password"
          required
          placeholder="Nouveau mot de passe"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
