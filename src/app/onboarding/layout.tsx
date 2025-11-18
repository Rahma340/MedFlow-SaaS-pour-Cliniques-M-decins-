export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex items-center justify-center">
      {children}
    </div>
  );
}
