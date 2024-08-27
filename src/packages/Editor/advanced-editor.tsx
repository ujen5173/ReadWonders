"use client";

import { type Prisma } from "@prisma/client";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  useEditor,
  type EditorInstance,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "~/components/ui/separator";
import "~/styles/prosemirror.css";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const extensions = [...defaultExtensions, slashCommand];

const CustomEditor = ({
  defaultContent = {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
  },
  handleEditorUpdate,
}: {
  defaultContent?: JSONContent | Prisma.JsonObject | null;
  handleEditorUpdate: (content: JSONContent) => void;
}) => {
  const { editor } = useEditor();

  const [open, setOpen] = useState(false);

  const [content] = useState<JSONContent | Prisma.JsonObject | null>(
    defaultContent,
  );

  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async (e: EditorInstance) => {
    handleEditorUpdate(e.getJSON());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    setCharsCount(e.storage.characterCount.words());
    setSaveStatus("Saved");
  }, 1500);

  if (!content) return null;

  return (
    <div className="relative w-full pt-10">
      <div className="absolute right-5 top-5 z-10 mb-5 flex gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
        <div
          className={
            charsCount
              ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground"
              : "hidden"
          }
        >
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          extensions={extensions}
          initialContent={content}
          className="relative min-h-[500px] w-full text-lg sm:rounded-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg h-full min-h-96 dark:prose-invert prose-headings:font-title focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor: e }: { editor: EditorInstance }) => {
            void debouncedUpdates(e);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-border bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command && item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: open ? "bottom-start" : "top",
              onHidden: () => {
                setOpen(false);
                editor?.chain()?.unsetHighlight().run();
              },
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-border bg-background shadow-xl"
          >
            {!open && (
              <>
                <Separator orientation="vertical" />
                <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                <Separator orientation="vertical" />
                <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                <Separator orientation="vertical" />
                <TextButtons />
              </>
            )}
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default CustomEditor;
