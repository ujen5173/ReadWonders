import { Button } from "~/components/ui/button";

const DangerPage = () => {
  return (
    <div className="rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className={`scroll-m-20 text-3xl font-bold tracking-tight`}>
          Danger Zone
        </h1>
        <p className="text-base text-foreground">
          This is where you can delete your account. This action is irreversible
          and will delete all your data.
        </p>
      </div>

      <Button variant="destructive">Delete Account</Button>
    </div>
  );
};

export default DangerPage;
