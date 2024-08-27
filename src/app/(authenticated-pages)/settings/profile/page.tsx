import { notFound } from "next/navigation";
import { constructMetadata } from "~/config/site";
import { api } from "~/trpc/server";
import UserFormDetails from "../_components/user-form-details";

export async function generateMetadata() {
  return constructMetadata({
    title: "Profile Settings - ReadWonders",
    description: "Edit your profile data and settings",
  });
}

const ProfileSettings = async () => {
  const userDetails = await api.auth.me();

  if (!userDetails) return notFound();

  return (
    <div className="rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
          Profile settings
        </h1>
        <p className="text-base text-foreground">
          Edit your profile data and settings.
        </p>
      </div>

      <UserFormDetails details={userDetails} />
    </div>
  );
};

export default ProfileSettings;
