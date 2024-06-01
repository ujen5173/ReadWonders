"use client";

import { useRouter } from "next/navigation";
import Login from "~/components/sections/login";
import { Dialog, DialogContent } from "~/components/ui/dialog";

const LoginModal = () => {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back();
      }}
    >
      <DialogContent className="bg-white">
        <Login />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
