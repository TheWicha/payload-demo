import { defaultColors } from '@payloadcms/richtext-lexical';
import Image from 'next/image';
import React, { Fragment } from 'react';

import classes from './index.module.scss';

type LexicalNode = {
  [key: string]: unknown;
  type: string;
  children?: LexicalNode[];
  text?: string;
  tag?: string;
  listType?: string;
  format?: string | number;
  style?: string;
  url?: string;
  fields?: { url?: string; newTab?: boolean };
};

const colorCssMap: Record<string, React.CSSProperties> = {};
const allColors = { ...defaultColors.text, ...defaultColors.background };
for (const [key, value] of Object.entries(allColors)) {
  const css: React.CSSProperties = {};
  for (const [prop, val] of Object.entries(value.css)) {
    const camelProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    (css as Record<string, string>)[camelProp] = val;
  }
  colorCssMap[key] = css;
}

function renderText(node: LexicalNode, i: number): React.ReactNode {
  let text: React.ReactNode = node.text || '';

  const format = typeof node.format === 'number' ? node.format : 0;

  if (format & 1) text = <strong key={`b${i}`}>{text}</strong>;
  if (format & 2) text = <em key={`i${i}`}>{text}</em>;
  if (format & 4) text = <s key={`s${i}`}>{text}</s>;
  if (format & 8) text = <u key={`u${i}`}>{text}</u>;
  if (format & 16) text = <code key={`c${i}`}>{text}</code>;
  if (format & 32) text = <sub key={`sub${i}`}>{text}</sub>;
  if (format & 64) text = <sup key={`sup${i}`}>{text}</sup>;
  const stateObj = node.$ as Record<string, string> | undefined
  const colorState = stateObj?.color
  if (colorState && colorCssMap[colorState]) {
    text = (
      <span key={`color${i}`} style={colorCssMap[colorState]}>
        {text}
      </span>
    )
  }

  if (node.style) {
    const style: React.CSSProperties = {};
    const colorMatch = node.style.match(/(?:^|;\s*)color:\s*([^;]+)/);
    const bgMatch = node.style.match(/background-color:\s*([^;]+)/);
    if (colorMatch) style.color = colorMatch[1].trim();
    if (bgMatch) style.backgroundColor = bgMatch[1].trim();
    if (Object.keys(style).length > 0) {
      text = (
        <span key={`style${i}`} style={style}>
          {text}
        </span>
      );
    }
  }

  return <Fragment key={i}>{text}</Fragment>;
}

function renderNodes(nodes?: LexicalNode[]): React.ReactNode[] {
  if (!nodes) return [];

  return nodes.map((node, i) => {
    if (node.type === 'text') {
      return renderText(node, i);
    }

    if (node.type === 'linebreak') {
      return <br key={i} />;
    }

    const children = renderNodes(node.children);

    switch (node.type) {
      case 'heading': {
        const HeadingTag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return <HeadingTag key={i}>{children}</HeadingTag>;
      }

      case 'paragraph':
        return <p key={i}>{children}</p>;

      case 'list':
        if (node.listType === 'bullet') return <ul key={i}>{children}</ul>;
        if (node.listType === 'number') return <ol key={i}>{children}</ol>;
        return <ul key={i}>{children}</ul>;

      case 'listitem':
        return <li key={i}>{children}</li>;

      case 'link':
      case 'autolink':
        const url = node.fields?.url || (node.url as string) || '#';
        const newTab = node.fields?.newTab;
        return (
          <a
            key={i}
            href={url}
            {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {children}
          </a>
        );

      case 'quote':
        return <blockquote key={i}>{children}</blockquote>;

      case 'horizontalrule':
        return <hr key={i} />;

      case 'table':
        return (
          <table key={i}>
            <tbody>{children}</tbody>
          </table>
        );

      case 'tablerow':
        return <tr key={i}>{children}</tr>;

      case 'tablecell': {
        const isHeader = node.headerState != null && (node.headerState as number) > 0;
        const CellTag = isHeader ? 'th' : 'td';
        const colSpan = (node.colSpan as number) || 1;
        const rowSpan = (node.rowSpan as number) || 1;
        return (
          <CellTag key={i} colSpan={colSpan} rowSpan={rowSpan}>
            {children}
          </CellTag>
        );
      }

      case 'upload': {
        const value = node.value as { url?: string; alt?: string; width?: number; height?: number } | undefined;
        if (value?.url) {
          return (
            <Image
              key={i}
              src={value.url}
              alt={value.alt || ''}
              width={value.width || 800}
              height={value.height || 600}
            />
          );
        }
        return null;
      }

      default:
        if (children.length > 0) return <div key={i}>{children}</div>;
        return null;
    }
  });
}

type Props = {
  className?: string;
  content: { root?: LexicalNode } | null | undefined;
};

const LexicalRenderer: React.FC<Props> = ({ className, content }) => {
  if (!content?.root?.children) return null;

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {renderNodes(content.root.children)}
    </div>
  );
};

export default LexicalRenderer;
