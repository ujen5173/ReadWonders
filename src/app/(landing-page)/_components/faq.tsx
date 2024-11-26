import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const FAQs = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-16">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible className="mx-auto w-8/12">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">
              How do I publish content on ReadWonders?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              Publishing your creative works on Readwonders is easy. You can
              stories directly within the website. For detailed instructions on
              how to publish your work, please visit the following link.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg">
              How can I increase my reads and followers on ReadWonders?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              Regularly release new chapters or poems and write captivating
              blogs. Engaging content is essential for attracting readers.
              Follow other writers and read their work. Meaningful interactions
              can lead to mutual support and increased visibility. Announce your
              stories, seek advice, and actively engage with readers and fellow
              authors through comments. Building relationships is the key to
              success on ReadWonders. Share your ReadWonders profile on your
              social media accounts (for example, Instagram, Twitter, and
              TikTok).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg">
              Do I retain ownership of my story once I publish it on
              ReadWonders?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              You maintain full ownership of all the rights to the original
              content you create and share on ReadWonders. However, you should
              only publish content for which you hold the copyrights. Posting
              someone else&apos;s content on ReadWonders does not grant you
              ownership of that material.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg">
              How does monetization work?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              If you have a readership, you can sell your original stories,
              books, and poetry on ReadWonders. You have the freedom to set the
              price for your content. ReadWonders pays authors royalties based
              on the number and volume of sales. Learn more about monetization
              conditions, payments, and fees at the following link. Pay
              attention that you can only monetize original works for which you
              hold the rights. Ensure that you have the necessary copyrights to
              avoid any legal issues.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg">
              Do I retain ownership of my story once I publish it on
              ReadWonders?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              You maintain full ownership of all the rights to the original
              content you create and share on ReadWonders. However, you should
              only publish content for which you hold the copyrights. Posting
              someone else&apos;s content on ReadWonders does not grant you
              ownership of that material.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg">
              How does ReadWonders protect my work?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              Your creative work receives automatic protection under Copyright
              Law as soon you put it into a fixed format, such as writing it
              down. At ReadWonders, we take copyright infringement seriously and
              remove any content that violates copyright laws. ReadWonders
              employs measures to deter text copying, and we do not permit users
              to download text and other files directly from the ReadWonders
              platform. While we take steps to protect your content, it&apos;s
              important to note that we cannot guarantee protection against all
              forms of copying, including potential copying from other
              platforms. If you would like to report copyright infringement,
              please visit the following link.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border-0" value="item-7">
            <AccordionTrigger className="text-lg">
              How can I get in touch with ReadWonders?
            </AccordionTrigger>
            <AccordionContent className="text-base">
              You can contact our support team by clicking the following link.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQs;
