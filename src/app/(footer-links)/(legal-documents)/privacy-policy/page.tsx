"use client";

import Content from "./content.mdx";

import "./style.css";

export default function TermsAndCondition() {
  return (
    <section className="w-full">
      <div className="content mx-auto w-full max-w-[1040px] px-4 pb-0 pt-8 md:pb-6 md:pt-12">
        <Content />
      </div>
    </section>
  );
}
