import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import styled, { css } from 'styled-components'
import { trim, get, identity, range } from 'lodash'
import { prettier, getLines } from 'helpers'
import { Box } from 'components/elements'
import React, { useState } from 'react'
import CodeCopy from 'react-codecopy'
import { colors, fonts } from 'theme'

const generateHighlighLines = linesRange => {
  if (!linesRange) return

  const [start, end] = linesRange
  const collection = end ? range(start, end + 1) : [start]

  return collection.map((line, index) => {
    const isLast = index + 1 === collection.length
    return `code > span:nth-child(${line})${!isLast ? ',' : ''}`
  })
}

const highlighLinesStyle = highlightLines => css`
  ${generateHighlighLines(highlightLines)} {
    display: block;
    background: #464957;
  }
`

export const COLORS = {
  PINK: colors.pink5,
  VIOLET: colors.grape4,
  WHITE: colors.white80,
  GRAY: colors.gray6,
  ORANGE: colors.orange4,
  YELLOW: colors.yellow2,
  RED: colors.red7,
  BACKGROUND: 'rgb(40, 42, 54)'
}

const codeTheme = {
  textShadow: '0 1px rgba(0, 0, 0, 0.3)',
  fontFamily: fonts.mono,
  direction: 'ltr',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  lineHeight: '1.5',
  MozTabSize: '2',
  OTabSize: '2',
  tabSize: '2',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  msHyphens: 'none',
  hyphens: 'none'
}

const langTheme = {
  markdown: {
    'code[class*="language-"]': {
      ...codeTheme,
      color: COLORS.WHITE
    }
  },
  html: {
    'code[class*="language-"]': {
      ...codeTheme,
      color: COLORS.WHITE
    },
    doctype: { color: COLORS.GRAY },
    token: { color: COLORS.ORANGE }
  },
  bash: {
    'code[class*="language-"]': {
      ...codeTheme,
      color: COLORS.YELLOW
    },
    function: { color: COLORS.YELLOW },
    token: { color: COLORS.YELLOW },
    operator: { color: COLORS.YELLOW },
    keyword: { color: COLORS.YELLOW },
    variable: { color: COLORS.YELLOW },
    comment: { color: COLORS.YELLOW },
    number: { color: COLORS.YELLOW }
  },
  json: {
    'code[class*="language-"]': {
      ...codeTheme,
      color: COLORS.YELLOW
    },
    function: { color: COLORS.YELLOW },
    token: { color: COLORS.YELLOW },
    operator: { color: COLORS.YELLOW },
    keyword: { color: COLORS.YELLOW },
    property: { color: COLORS.PINK },
    number: { color: COLORS.VIOLET }
  }
}

const baseTheme = {
  'code[class*="language-"]': {
    ...codeTheme,
    color: COLORS.PINK
  },
  'pre[class*="language-"]': {
    ...codeTheme,
    padding: '0 8px',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
    background: COLORS.BACKGROUND
  },
  ':not(pre) > code[class*="language-"]': {
    background: COLORS.BACKGROUND,
    padding: '.1em',
    borderRadius: '.3em'
  },
  'attr-name': { color: COLORS.ORANGE },
  comment: { color: 'rgba(101, 107, 128, 0.8)' },
  string: { color: COLORS.YELLOW },
  url: { color: COLORS.YELLOW },
  variable: { color: 'rgb(214, 222, 235)' },
  number: { color: COLORS.ORANGE },
  builtin: { color: COLORS.VIOLET },
  char: { color: COLORS.VIOLET },
  constant: { color: COLORS.VIOLET },
  'attr-value': { color: COLORS.YELLOW },
  punctuation: { color: COLORS.GRAY },
  selector: { color: COLORS.VIOLET, fontStyle: "'italic'" },
  doctype: { color: COLORS.VIOLET, fontStyle: "'italic'" },
  class_name: { color: 'rgb(255, 203, 139)' },
  function: { color: COLORS.PINK },
  tag: { color: COLORS.PINK },
  operator: { color: COLORS.PINK },
  keyword: { color: COLORS.VIOLET },
  boolean: { color: COLORS.RED },
  property: { color: 'rgb(128, 203, 196)' },
  namespace: { color: 'rgb(178, 204, 214)' }
}

const CustomSyntaxHighlighter = styled(SyntaxHighlighter)`
  padding: 0;
  margin: 0;
  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`

const TerminalWindow = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1);
`

const TerminalHeader = styled.header`
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  display: flex;
  height: 36px;
  background: ${COLORS.BACKGROUND};
  align-items: center;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1;
`

const TerminalButton = styled.div`
  border-radius: 50px;
  width: 12px;
  height: 12px;
  margin: 0 0.2rem;
  background ${({ color }) => color};
`

const TerminalTitle = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  margin-left: -3rem;
  color: #999;
  font-size: 12px;
`

const TerminalText = styled.section`
  overflow-x: auto;
  font-family: ${fonts.mono};
  font-size: 13px;
  font-weight: normal;
  line-height: 20px;
  padding-bottom: 9.5px;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  background: ${COLORS.BACKGROUND};
  color: #fff;
  display: flex;
  align-items: center;

  > div {
    width: 100%;
  }
`

const TerminalTextWrapper = styled.div`
  word-break: break-all;
`

const DefaultActionComponent = ({ toCopy, isHover, theme }) => (
  <CodeCopy interactive={isHover} theme={theme} text={toCopy} />
)

function Terminal ({
  title,
  children,
  theme,
  interactive,
  toCopy,
  ActionComponent,
  ...props
}) {
  const [isHover, setHover] = useState(interactive)
  const onMouseOut = () => setHover(false)
  const onMouseOver = () => setHover(true)
  const ChildComponent = ActionComponent || DefaultActionComponent

  return (
    <TerminalWindow
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      {...props}
    >
      <TerminalHeader>
        <TerminalButton color='#FF5F56' />
        <TerminalButton color='#FFBD2E' />
        <TerminalButton color='#27C93F' />
        <TerminalTitle>{title}</TerminalTitle>
        <ChildComponent isHover={isHover} theme={theme} toCopy={toCopy} />
      </TerminalHeader>
      <TerminalText>{children}</TerminalText>
    </TerminalWindow>
  )
}

Terminal.defaultProps = {
  interactive: false,
  theme: 'dark'
}

function CodeEditor (props) {
  const {
    ActionComponent,
    showLineNumbers,
    interactive,
    children,
    ...restProps
  } = props
  const className = props.className
    ? props.className + (props.metastring || '')
    : ''
  const highlightLines = getLines(className)

  const language = (() => {
    if (props.language) return props.language
    const languageFromClassName = className.split('-')[1]
    if (languageFromClassName) return languageFromClassName.split('{')[0]
    return 'javascript'
  })()

  const pretty = props.prettier ? get(prettier, language, identity) : identity
  const text = trim(pretty(children))
  const theme = { ...baseTheme, ...langTheme[language] }
  const css = highlightLines && highlighLinesStyle(highlightLines)

  return (
    <Terminal
      interactive={interactive}
      toCopy={text}
      ActionComponent={ActionComponent}
      {...restProps}
    >
      <TerminalTextWrapper dark>
        <CustomSyntaxHighlighter
          lineNumberStyle={{ color: '#6272A4' }}
          showLineNumbers={showLineNumbers}
          language={language}
          style={theme}
          wrapLines
          children={text}
          css={css}
        />
      </TerminalTextWrapper>
    </Terminal>
  )
}

// this is necessary for markdown
CodeEditor.displayName = 'CodeEditor'

CodeEditor.defaultProps = {
  prettier: true,
  showLineNumbers: false
}

export default CodeEditor
