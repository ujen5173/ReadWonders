import { SquareLock01Icon, UserGroupIcon } from "hugeicons-react";

const CommunityOverviewSection = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-16">
        <h1 className="mb-8 text-center text-5xl font-bold">
          Your Holistic Companion for <br /> Storytelling Growth
        </h1>

        <p className="mb-12 text-center text-lg text-foreground">
          Nurture your creative journey with our integrated platform of <br />{" "}
          writing tools, community engagement, and personal development
          features.
        </p>

        <div className="">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex-1 rounded-2xl border border-slate-200 bg-[#f7f7f8] p-6 shadow-sm">
                <div className="mb-4">
                  <UserGroupIcon className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">
                  Connect with the Community
                </h3>
                <p className="text-lg text-foreground">
                  Connect with writers in lively forums and writing groups.{" "}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[#f7f7f8] p-6 shadow-sm">
                <div className="mb-4">
                  <SquareLock01Icon className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Private and secure</h3>
                <p className="text-lg text-foreground">
                  Your data is encrypted in transit and at rest to protect your
                  privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityOverviewSection;
