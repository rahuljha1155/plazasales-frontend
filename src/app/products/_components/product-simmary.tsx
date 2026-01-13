"use client";
import { decodeHtml } from "./specifications";
import DOMPurify from "dompurify";


export default function Summary({ summary }: { summary: string }) {
  if (!summary) {
    return null;
  }
  return (
    <section className="relative  text-xl overflow-hidden ">
      <h2 className="leading-none text-[22px] font-medium will-change-transform sm:text-3xl   font-overusedGrotesk mb-4 text-primary ">Product Summary</h2>
      <div
        className="editor text-base!"
        dangerouslySetInnerHTML={{
          __html: (() => {
            let html = decodeHtml(summary || '');
            html = html
              .replace(/^<pre><code[^>]*>/, '')
              .replace(/<\/code><\/pre>$/, '');

            return DOMPurify.sanitize(html);
          })()
        }}
      />
    </section>
  );
}
