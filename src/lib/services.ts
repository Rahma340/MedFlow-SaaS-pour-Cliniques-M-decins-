// src/lib/services.ts
export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = "/api/services";

export async function getServices(clinicId: string): Promise<Service[]> {
  const res = await fetch(`${BASE_URL}?clinicId=${clinicId}`);
  if (!res.ok) throw new Error("Erreur de chargement des services");
  return res.json();
}

export async function createService(data: {
  name: string;
  duration: number;
  price: number;
  clinicId: string;
}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur de création du service");
  return res.json();
}

export async function updateService(data: {
  id: string;
  name: string;
  duration: number;
  price: number;
}) {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur de modification du service");
  return res.json();
}

export async function deleteService(id: string) {
  const res = await fetch(BASE_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Erreur de suppression du service");
  return res.json();
}
