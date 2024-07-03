import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const DeleteDialog = ({
  title,
  description,
  onConfirm,
  trigger,
  style,
  variant,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  trigger: string;
  style: string;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "ghost-link"
    | "link";
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={style}>
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "secondary" })}>
            Cancel
          </DialogClose>
          <DialogClose>
            <Button onClick={onConfirm}>Continue</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
