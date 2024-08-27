"use client";

import { generateHTML } from "@tiptap/core";
import { type JSONContent } from "novel";
import { contentFont } from "~/config/font";
import { editorExtensions } from "~/server/constants";

const ChapterContent = ({ content }: { content: JSONContent }) => {
  return (
    <div
      className={`${contentFont.className} w-full max-w-none space-y-4 whitespace-pre-line text-lg leading-relaxed text-foreground md:text-xl`}
      dangerouslySetInnerHTML={{
        __html: generateHTML(content, editorExtensions),
      }}
    ></div>
  );
};

export default ChapterContent;
