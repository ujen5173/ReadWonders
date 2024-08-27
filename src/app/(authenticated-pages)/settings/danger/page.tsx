"use client";

import DeleteDialog from "~/app/_components/dialogs/delete-dialog";

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

      <DeleteDialog
        title="Delete Account"
        description="This action is irreversible. All stories, comments, and followers will be permanently removed."
        onConfirm={() => {
          // Delete account
        }}
      />
    </div>
  );
};

export default DangerPage;
