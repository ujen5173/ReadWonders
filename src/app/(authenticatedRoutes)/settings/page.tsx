import { api } from "~/trpc/server";
import UserFormDetails from "./_components/user-form-details";

const Settings = async () => {
  const userDetails = await api.auth.me.query();

  if (!userDetails) return null;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] border-b border-border px-4 py-6">
        <div className="mb-6">
          <h1 className={`scroll-m-20 text-3xl font-bold tracking-tight`}>
            Profile settings
          </h1>
          <p className="text-base text-foreground">
            Edit your profile data and settings.
          </p>
        </div>

        <UserFormDetails details={userDetails} />
      </div>
    </section>
  );
};

export default Settings;
