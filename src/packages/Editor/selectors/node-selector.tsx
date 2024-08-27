import { EditorBubbleItem, useEditor } from "novel";

import { Popover } from "@radix-ui/react-popover";
import {
  ArrowDown01Icon,
  QuoteDownIcon,
  TextAlignLeft01Icon,
  Tick01Icon,
} from "hugeicons-react";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { PopoverContent, PopoverTrigger } from "~/components/ui/popover";

export type SelectorItem = {
  name: string;
  icon: (className?: string) => ReactNode;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

const items: SelectorItem[] = [
  {
    name: "Text",
    icon: () => <TextAlignLeft01Icon />,
    command: (editor) => editor?.chain().focus().clearNodes().run(),
    isActive: (editor) =>
      (editor?.isActive("paragraph") &&
        !editor?.isActive("bulletList") &&
        !editor?.isActive("orderedList")) ??
      false,
  },
  {
    name: "Quote",
    icon: () => <QuoteDownIcon />,
    command: (editor) =>
      editor?.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor?.isActive("blockquote") ?? false,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 rounded-none border-none bg-white hover:bg-slate-300 focus:ring-0"
      >
        <Button size="sm" variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ArrowDown01Icon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item) => (
          <EditorBubbleItem
            key={item.name}
            onSelect={(e) => {
              item.command(e);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">{item.icon()}</div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && (
              <Tick01Icon className="h-4 w-4" />
            )}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
