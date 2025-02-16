import 'github-markdown-css'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  atomOneDark,
  githubGist,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import remarkGfm from 'remark-gfm'

import { useThemeAtomValue } from '~/hooks/common'

interface MarkdownProps {
  content: string
  className?: string
}

export const Markdown: React.FC<MarkdownProps> = ({
  content,
  className = '',
}) => {
  const theme = useThemeAtomValue()
  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),

          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : ''
            const code = String(children).replace(/\n$/, '')

            return !inline ? (
              <SyntaxHighlighter
                style={theme === 'dark' ? atomOneDark : githubGist}
                language={lang}
                PreTag="div"
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
