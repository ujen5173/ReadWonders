"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const NewReadingModel = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Reading List</Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new reading list</DialogTitle>
          <DialogDescription>
            Create a new reading list to keep track of your favorite stories.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left">
              Reading list title
            </Label>
            <Input placeholder="My Reading List" className="col-span-3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left">
              Description <span className="text-xs">(Optional)</span>
            </Label>
            <Textarea
              placeholder="A short description of your reading list"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewReadingModel;
