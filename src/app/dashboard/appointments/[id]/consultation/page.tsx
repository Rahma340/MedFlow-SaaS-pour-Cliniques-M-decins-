import { prisma } from "@/lib/prisma";
import ConsultationForm from "./ConsultationForm";

export default async function ConsultationPage({ params }: any) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      service: true,
      staff: {
        include: { user: true }
      }
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Consultation — {appointment?.patient.firstName} {appointment?.patient.lastName}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <p><strong>Service :</strong> {appointment?.service.name}</p>
        <p><strong>Date :</strong> {new Date(appointment?.date).toLocaleString()}</p>
        <p><strong>Médecin :</strong> {appointment?.staff?.user?.firstName}</p>
      </div>

      <ConsultationForm appointmentId={appointment?.id} doctorId={appointment?.staffId} />
    </div>
  );
}
