import { Fragment } from "react";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link && (/^https:\/\//.test(link[2]) || /^\/(?![\/\\])/.test(link[2])) && !link[2].includes("\\")) {
      return <a key={index} href={link[2]} className="text-orange-400 underline underline-offset-4 hover:text-orange-300">{link[1]}</a>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

// Supported Markdown: paragraphs, ## / ### headings, - lists, **bold**, links.
// React escapes text; raw HTML and executable MDX are never evaluated.
export default function Markdown({ body }: { body: string }) {
  return <div className="space-y-6 text-base leading-8 text-zinc-300 [overflow-wrap:anywhere]">{body.split(/\n\s*\n/).map((block, index) => {
    if (block.startsWith("### ")) return <h3 key={index} className="pt-3 text-xl font-semibold text-white">{inline(block.slice(4))}</h3>;
    if (block.startsWith("## ")) return <h2 key={index} className="pt-5 text-2xl font-bold leading-snug text-white">{inline(block.slice(3))}</h2>;
    if (block.split("\n").every(line => line.startsWith("- "))) return <ul key={index} className="list-disc space-y-2 pl-6 marker:text-orange-500">{block.split("\n").map((line, item) => <li key={item}>{inline(line.slice(2))}</li>)}</ul>;
    return <p key={index}>{inline(block.replace(/\n/g, " "))}</p>;
  })}</div>;
}

