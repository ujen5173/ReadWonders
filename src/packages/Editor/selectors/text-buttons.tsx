import {
  LeftToRightBlockQuoteIcon,
  RightToLeftBlockQuoteIcon,
  TextAlignCenterIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "hugeicons-react";
import { EditorBubbleItem, useEditor } from "novel";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { SelectorItem } from "./node-selector";

export const TextButtons = () => {
  const { editor } = useEditor();

  if (!editor) return null;
  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (e) => e?.isActive("bold") ?? false,
      command: (e) => e?.chain().focus().toggleBold().run(),
      icon: (className?: string) => <TextBoldIcon className={className} />,
    },
    {
      name: "italic",
      isActive: (e) => e?.isActive("italic") ?? false,
      command: (e) => e?.chain().focus().toggleItalic().run(),
      icon: (className?: string) => <TextItalicIcon className={className} />,
    },
    {
      name: "underline",
      isActive: (e) => e?.isActive("underline") ?? false,
      command: (e) => e?.chain().focus().toggleUnderline().run(),
      icon: (className?: string) => <TextUnderlineIcon className={className} />,
    },
    {
      name: "left",
      isActive: (e) => e?.isActive("underline") ?? false,
      command: (e) => e?.chain().focus().setTextAlign("left").run(),
      icon: (className?: string) => (
        <LeftToRightBlockQuoteIcon className={className} />
      ),
    },
    {
      name: "center",
      isActive: (e) => e?.isActive("underline") ?? false,
      command: (e) => e?.chain().focus().setTextAlign("center").run(),
      icon: (className?: string) => (
        <TextAlignCenterIcon className={className} />
      ),
    },
    {
      name: "right",
      isActive: (e) => e?.isActive("underline") ?? false,
      command: (e) => e?.chain().focus().setTextAlign("right").run(),
      icon: (className?: string) => (
        <RightToLeftBlockQuoteIcon className={className} />
      ),
    },
  ];

  return (
    <div className="flex bg-white">
      {items.map((item) => (
        <EditorBubbleItem
          key={item.name}
          onSelect={(e) => {
            item.command(e);
          }}
        >
          <Button
            type="button"
            size="sm"
            className="rounded-none bg-white hover:bg-slate-300"
            variant="ghost"
          >
            {item.icon(
              cn("h-4 w-4", {
                "text-blue-500": item.isActive(editor),
              }),
            )}
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
