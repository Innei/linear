import 'github-markdown-css'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  atomOneDark,
  githubGist,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { useIsDark } from '~/hooks/common'

interface MarkdownProps {
  content: string
  className?: string
}

const CodeBlockContext = React.createContext<boolean>(false)

export const Markdown: React.FC<MarkdownProps> = ({
  content,
  className = '',
}) => {
  const theme = useIsDark() ? 'dark' : 'light'

  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),

          pre: ({ node, className, children, ...props }: any) => {
            return (
              <CodeBlockContext value={true}>
                <pre className={className} {...props}>
                  {children}
                </pre>
              </CodeBlockContext>
            )
          },
          code: ({ node, className, children, ...props }: any) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const isCodeBlock = React.use(CodeBlockContext)
            if (!isCodeBlock)
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : ''
            const code = String(children).replace(/\n$/, '')

            return (
              <SyntaxHighlighter
                style={theme === 'dark' ? atomOneDark : githubGist}
                language={lang}
                PreTag="div"
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
