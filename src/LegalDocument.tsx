import { Fragment, type ReactNode } from "react";

type LegalBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; ordered: boolean; items: string[] };

function parseMarkdown(markdown: string): LegalBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: LegalBlock[] = [];
  let paragraph: string[] = [];
  let list: Extract<LegalBlock, { type: "list" }> | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", lines: paragraph });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    const bullet = /^-\s+(.+)$/.exec(line);
    const numbered = /^\d+\.\s+(.+)$/.exec(line);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
    } else if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { type: "list", ordered, items: [] };
      }
      list.items.push((bullet || numbered)![1]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const pattern = /(\*\*.+?\*\*|\*[^*]+\*|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{renderInline(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{renderInline(part.slice(1, -1))}</em>;
    }
    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) {
      return <a key={index} href={`mailto:${part}`}>{part}</a>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function Paragraph({ lines }: { lines: string[] }) {
  return (
    <p>
      {lines.map((line, index) => {
        const hardBreak = line.endsWith("  ");
        const content = hardBreak ? line.slice(0, -2) : line;
        return (
          <Fragment key={index}>
            {index > 0 && !lines[index - 1].endsWith("  ") ? " " : null}
            {renderInline(content)}
            {hardBreak ? <br /> : null}
          </Fragment>
        );
      })}
    </p>
  );
}

export function LegalDocument({ markdown }: { markdown: string }) {
  const blocks = parseMarkdown(markdown);

  return (
    <>
      {blocks.slice(1).map((block, index) => {
        if (block.type === "paragraph") return <Paragraph key={index} lines={block.lines} />;
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return <List key={index}>{block.items.map((item) => <li key={item}>{renderInline(item)}</li>)}</List>;
        }
        if (block.level === 1) return <h2 className="legal-part" key={index}>{renderInline(block.text)}</h2>;
        if (block.level === 2) return <h2 key={index}>{renderInline(block.text)}</h2>;
        return <h3 key={index}>{renderInline(block.text)}</h3>;
      })}
    </>
  );
}
