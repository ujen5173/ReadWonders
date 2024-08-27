import { useRef } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const EditReadingList = ({
  details,
  title,
  onConfirm,
}: {
  details: { title: string; description: string | null };
  title: string;
  onConfirm: (title: string, description: string | null) => void;
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full justify-start rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          variant="ghost"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Edit &apos;{title}&apos; reading list.
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left">
              Reading list title
            </Label>
            <Input
              defaultValue={details.title}
              ref={titleRef}
              placeholder="My Reading List"
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left">
              Description <span className="text-xs">(Optional)</span>
            </Label>
            <Textarea
              ref={descriptionRef}
              defaultValue={details.description ?? ""}
              placeholder="A short description of your reading list"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              onClick={() =>
                void onConfirm(
                  titleRef.current?.value ?? "Untitled Reading List",
                  descriptionRef.current?.value ?? null,
                )
              }
              variant="default"
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReadingList;
