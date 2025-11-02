
import { Brand } from "@/component/auth/Brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(1200px_600px_at_50%_0%,#eaf4ff_0%,#fff_60%)]">
    
      <div className="absolute left-6 top-6">
        <Brand />
      </div>

     
      <div className="grid min-h-screen place-items-center px-4">
        {children}
      </div>
    </div>
  );
}
