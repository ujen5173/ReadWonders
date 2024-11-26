import { type ReactNode } from "react";
import Navigation from "./_components/navigation";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="w-full">
      <div className="mx-auto my-10 w-full max-w-[1440px] rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h1 className="mb-8 scroll-m-20 text-3xl font-bold tracking-tight">
            Settings
          </h1>

          <div className="flex items-center gap-4">
            <Navigation />
          </div>
        </div>

        {children}
      </div>
    </section>
  );
};

export default SettingsLayout;
