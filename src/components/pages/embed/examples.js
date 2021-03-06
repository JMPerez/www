import {
  Box,
  ButtonSecondary,
  Caps,
  Card,
  ClearbitLogo,
  Container,
  Flex,
  ImagePlaceholder,
  CodeEditor,
  Input,
  Text
} from 'components/elements'

import { Header, DemoLinks, Microlink } from 'components/patterns'
import React, { useRef, useEffect, useState } from 'react'
import { borders, transition, colors, toPx } from 'theme'
import { debounceComponent, getDomain } from 'helpers'
import { Link as LinkIcon } from 'react-feather'
import { findIndex, take } from 'lodash'
import humanizeUrl from 'humanize-url'
import styled from 'styled-components'
import prependHttp from 'prepend-http'
import { navigate } from 'gatsby'
import mql from '@microlink/mql'
import isUrl from 'is-url-http'

const MAX_SUGGESTIONS = 5

const MAX_WIDTH_IFRAME = [380, 380, 500, 500].map(toPx)
const MAX_HEIGHT_IFRAME = [382 * (7 / 9), 382 * (7 / 9), 382, 382].map(toPx)

const MicrolinkDebounce = debounceComponent(Microlink)

const LogoWrap = styled(Box)`
  cursor: pointer;
  opacity: 0.5;
  transition: opacity ${transition.short};
  &:hover {
    opacity: 1;
  }
`

LogoWrap.defaultProps = {
  display: 'inline-block'
}

const IframeLoader = ({ lazyWidth, lazyHeight, ...props }) => {
  const inputEl = useRef(null)
  const [isLoading, setLoading] = useState(true)
  const setLoaded = () => setLoading(false)

  useEffect(() => {
    if (inputEl.current) {
      const iframe = inputEl.current.querySelector('iframe')
      if (iframe) {
        iframe.addEventListener('load', setLoaded)
        return () => iframe.removeEventListener('load', setLoaded)
      }
    }
  }, [])

  return (
    <>
      {isLoading ? (
        <ImagePlaceholder width={lazyWidth} height={lazyHeight} />
      ) : null}
      <Box style={{ display: isLoading && 'none' }} ref={inputEl} {...props} />
    </>
  )
}

const Examples = ({ demoLinks }) => (
  <Container
    py={[4, 5]}
    px={4}
    maxWidth='100%'
    bg='pinky'
    borderTop={`${borders[1]} ${colors.pinkest}`}
    borderBottom={`${borders[1]} ${colors.pinkest}`}
  >
    <Header
      pb={[3, 4]}
      title='Examples'
      caption='See real examples in action.'
    />
    <Box pt={[3, 4]}>
      <DemoLinks
        children={demoLinks}
        onClick={({ brand }) => navigate(`/embed/${brand.toLowerCase()}`)}
      />
    </Box>
  </Container>
)

const LiveDemo = ({ demoLinks, demoLink, onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('')
  const [data, setData] = useState(demoLink.data)
  const [view, setView] = useState('sdk')
  const domain = getDomain(inputValue)

  const suggestions = take(demoLinks, MAX_SUGGESTIONS).map(demoLink => ({
    value: humanizeUrl(demoLink.data.url)
  }))

  const fetchAndSetData = async url => {
    try {
      const { data } = await mql(url, { iframe: true })
      setData(data)
    } catch (err) {}
  }

  useEffect(() => {
    if (isLoading) return
    const value = prependHttp(inputValue)
    if (!isUrl(value)) return
    const index = findIndex(suggestions, ({ value }) => value === inputValue)
    if (index !== -1) return setData(demoLinks[index].data)
    else fetchAndSetData(value)
  }, [inputValue])

  const IconComponent =
    inputValue && domain ? (
      <ClearbitLogo size='16px' companyName={domain} />
    ) : (
      <LinkIcon color={colors.black50} size='16px' />
    )

  return (
    <>
      <Container py={[4, 5]} px={4}>
        <Header
          subtitle='Universal Embed'
          caption='Turn websites into rich media'
        />

        <Flex
          pt={2}
          pb={3}
          as='form'
          justifyContent='center'
          onSubmit={event => {
            event.preventDefault()
            const url = prependHttp(inputValue)
            onSubmit(isUrl(url) ? url : undefined)
          }}
        >
          <Input
            fontSize={2}
            iconComponent={IconComponent}
            id='embed-demo-url'
            placeholder='Enter a URL...'
            suggestions={suggestions}
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
            width='12rem'
          />

          <ButtonSecondary ml={2} loading={isLoading}>
            <Caps fontSize={1} children='Embed it' />
          </ButtonSecondary>
        </Flex>

        <Box textAlign='center'>
          <Box pb={3}>
            <Text fontSize={2}>into rich media</Text>
          </Box>

          <Flex
            flexDirection='column'
            mb={[4, 0]}
            maxWidth={MAX_WIDTH_IFRAME}
            mx='auto'
          >
            {view === 'sdk' ? (
              <Box>
                <MicrolinkDebounce
                  loading={isLoading}
                  size='large'
                  url={prependHttp(inputValue)}
                  setData={() => data}
                  media={['audio', 'video', 'image', 'logo']}
                />
                <Flex pt={3} alignItems='center' justifyContent='center'>
                  <CodeEditor maxWidth={MAX_WIDTH_IFRAME} language='bash'>
                    {`<Microlink size='large' url=${inputValue ||
                      demoLink.data
                        .url} media={['audio', 'video', 'image', 'logo']} />`}
                  </CodeEditor>
                </Flex>
              </Box>
            ) : data.iframe ? (
              <>
                <IframeLoader
                  lazyWidth={MAX_WIDTH_IFRAME}
                  lazyHeight={MAX_HEIGHT_IFRAME}
                  width={MAX_WIDTH_IFRAME}
                  dangerouslySetInnerHTML={{ __html: data.iframe }}
                />
                <Flex pt={3} alignItems='center' justifyContent='center'>
                  <CodeEditor maxWidth={MAX_WIDTH_IFRAME} language='bash'>
                    {demoLink.data.iframe}
                  </CodeEditor>
                </Flex>
              </>
            ) : (
              <Flex
                border={3}
                borderColor='black80'
                justifyContent='center'
                alignItems='center'
                width={MAX_WIDTH_IFRAME}
                height={MAX_HEIGHT_IFRAME}
              >
                <Text fontSize={2} color='black'>
                  not supported
                </Text>
              </Flex>
            )}
            <Flex justifyContent='flex-end'>
              <Card.Option
                children='sdk'
                value={view}
                onClick={() => setView('sdk')}
              />
              <Card.Option
                children='iframe'
                value={view}
                onClick={() => setView('iframe')}
              />
            </Flex>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default ({ demoLink, demoLinks, onSubmit, url, isLoading }) => (
  <>
    <LiveDemo
      demoLinks={demoLinks}
      demoLink={demoLink}
      onSubmit={onSubmit}
      url={url}
      isLoading={isLoading}
    />
    <Examples demoLinks={demoLinks} />
  </>
)
