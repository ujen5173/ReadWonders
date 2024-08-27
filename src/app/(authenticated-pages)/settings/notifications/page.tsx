import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { constructMetadata } from "~/config/site";

export async function generateMetadata() {
  return constructMetadata({
    title: "Notifications - ReadWonders",
    description: "Manage your notifications here",
  });
}

const NotifictionPage = () => {
  return (
    <div className="rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className={`scroll-m-20 text-3xl font-bold tracking-tight`}>
          Notifications
        </h1>
        <p className="text-base text-foreground">
          Manage your notifications here
        </p>
      </div>

      <div className="">
        <form className="">
          <div className="mb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="follow" />
              <label
                htmlFor="follow"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Users you follow uploads a story
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="updates" />
              <label
                htmlFor="updates"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Updates (Important announcements from ReadWonders)
              </label>
            </div>
          </div>

          <Button>Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default NotifictionPage;
