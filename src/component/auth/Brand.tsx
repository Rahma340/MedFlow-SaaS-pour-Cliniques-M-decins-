import { Stethoscope } from "lucide-react";

export function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
        <Stethoscope className="h-4 w-4 text-sky-600" />
      </div>
      <span className="font-semibold text-sky-700">MedFlow</span>
    </div>
  );
}
