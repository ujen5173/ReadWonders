"use client";

import { Link04Icon } from "hugeicons-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

const CopyLink = ({ slug }: { slug: string }) => {
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(
          `${window.location.origin}/story/${slug}`,
        );
        toast({
          title: "Link copied!",
        });
      }}
      className="w-full"
      variant="secondary"
    >
      <Link04Icon className="size-4" />
      Copy Link
    </Button>
  );
};

export default CopyLink;
