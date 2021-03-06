import { Image as ImageIcon, Link as LinkIcon } from 'react-feather'
import {
  Flex,
  Input,
  Text,
  Box,
  ButtonSecondary,
  Container,
  Caps,
  Image,
  ClearbitLogo
} from 'components/elements'

import {
  debounceComponent,
  aspectRatio,
  getDomain,
  screenshotUrl
} from 'helpers'
import { useTransition, animated, config } from 'react-spring'
import React, { useEffect, useState } from 'react'
import { Header, DemoLinks } from 'components/patterns'
import { Safari, HourGlass } from 'components/icons'
import { borders, transition, colors } from 'theme'
import demoLinks from '@microlink/demo-links'
import prependHttp from 'prepend-http'
import humanizeUrl from 'humanize-url'
import styled from 'styled-components'
import { pickBy, noop } from 'lodash'
import { navigate } from 'gatsby'
import isUrl from 'is-url-http'
import isColor from 'is-color'

import ms from 'ms'

const DEMO_LINKS = [
  { theme: 'dark', keyword: 'Netflix' },
  { theme: 'dark', keyword: 'Apple' },
  { theme: 'light', keyword: 'Change' },
  { theme: 'light', keyword: 'MDN' },
  { theme: 'light', keyword: 'TheVerge' },
  { theme: 'dark', keyword: 'Time' },
  { theme: 'light', keyword: 'TechCrunch' }
].map(item => {
  return {
    ...item,
    humanizedUrl: humanizeUrl(demoLinks[item.keyword].url),
    cdnUrl: `https://cdn.microlink.io/website/browser/${
      item.theme
    }/${item.keyword.toLowerCase()}.png`
  }
})

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

const INTERVAL = 3500

const bgStyle = `
position: absolute;
top: 0px;
left: 0px;
will-change: opacity;
`

const AnimatedImage = animated(Image)

const ImageDebounce = debounceComponent(Image)

const DemoSlider = ({ children: slides }) => {
  const [height, setHeight] = useState(null)
  const [index, setIndex] = useState(0)

  const transitions = useTransition(slides[index], item => item.keyword, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses
  })

  const handleResize = () => {
    const el = document.querySelector('#animated-image-container img')
    if (el) setHeight(el.clientHeight)
  }

  const onLoad = () => {
    const el = document.querySelector('#animated-image-container img')
    if (el) setHeight(el.clientHeight)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  useEffect(
    () =>
      /* eslint-disable no-void */
      void setInterval(
        () => setIndex(state => (state + 1) % slides.length),
        INTERVAL
      ),
    /* eslint-enable no-void */ []
  )

  return (
    <Flex
      id='animated-image-container'
      mt={height ? [2, 1, 1, 1] : 4}
      style={{ position: 'relative' }}
      height={height ? `${height}px` : aspectRatio.heights}
      width={aspectRatio.widths}
    >
      {transitions.map(({ item, props, key }) => (
        <AnimatedImage
          key={key}
          src={item.cdnUrl}
          style={props}
          css={bgStyle}
          lazyHeight={aspectRatio.heights}
          lazyWidth={aspectRatio.widths}
          onLoad={key === 0 ? onLoad : noop}
        />
      ))}
    </Flex>
  )
}

const SearchBox = ({ onSubmit, url, isLoading }) => {
  const [inputBg, setInputBg] = useState('')
  const [inputUrl, setInputUrl] = useState(url || '')
  const [inputWaitFor, setInputWaitFor] = useState('')
  const [inputOverlay, setInputOverlay] = useState('')
  const domain = getDomain(inputUrl)

  const urlIconComponent =
    inputUrl && domain ? (
      <ClearbitLogo companyName={domain} size='16px' />
    ) : (
      <LinkIcon color={colors.black50} size='16px' />
    )

  const backgroundIconComponent = isColor(inputBg) ? (
    <Box
      border={1}
      borderColor='black10'
      borderRadius={1}
      width='14px'
      height='14px'
      style={{ top: '-2px', position: 'relative', background: inputBg }}
    />
  ) : (
    <ImageIcon color={colors.black50} size='16px' />
  )

  const getValues = () => {
    const preprendUrl = prependHttp(inputUrl)

    return pickBy({
      url: isUrl(preprendUrl) ? preprendUrl : undefined,
      waitFor: ms(inputWaitFor || '0'),
      browser: inputOverlay,
      background: inputBg
    })
  }

  const previewUrl = (() => {
    const { url, ...opts } = getValues()
    return url ? screenshotUrl(url, opts) : undefined
  })()

  const handleSubmit = event => {
    event.preventDefault()
    const { url, ...opts } = getValues()
    return onSubmit(url, opts)
  }

  return (
    <Container py={[4, 5]} px={4}>
      <Header
        subtitle='Take a screenshot of any website'
        caption='Turn websites into a snapshot'
      />

      <Flex
        pt={2}
        pb={3}
        as='form'
        maxWidth={aspectRatio.widths}
        mx='auto'
        justifyContent='center'
        onSubmit={handleSubmit}
        flexDirection={['column', 'row', 'row', 'row']}
      >
        <Box ml={2} mb={[3, 0, 0, 0]}>
          <Input
            fontSize={2}
            iconComponent={urlIconComponent}
            id='screenshot-demo-url'
            mr='6px'
            placeholder='Visit URL'
            suggestions={DEMO_LINKS.map(({ humanizedUrl }) => ({
              value: humanizedUrl
            }))}
            type='text'
            value={inputUrl}
            onChange={event => setInputUrl(event.target.value)}
            width={['100%', '100px']}
          />
        </Box>

        <Box ml={2} mb={[3, 0, 0, 0]}>
          <Input
            placeholder='Wait for'
            id='screenshot-demo-waitfor'
            type='text'
            fontSize={2}
            width={['100%', '74px']}
            mr='6px'
            value={inputWaitFor}
            onChange={event => setInputWaitFor(event.target.value)}
            iconComponent={<HourGlass color={colors.black50} width='11px' />}
            suggestions={[{ value: '0s' }, { value: '1.5s' }, { value: '3s' }]}
          />
        </Box>

        <Box ml={2} mb={[3, 0, 0, 0]}>
          <Input
            placeholder='Overlay'
            id='screenshot-demo-overlay'
            type='text'
            fontSize={2}
            width={['100%', '73px']}
            mr='6px'
            value={inputOverlay}
            onChange={event => setInputOverlay(event.target.value)}
            iconComponent={<Safari color={colors.black50} width='16px' />}
            suggestions={[
              { value: 'none' },
              { value: 'dark' },
              { value: 'light' }
            ]}
          />
        </Box>

        <Box ml={2} mb={[3, 0, 0, 0]}>
          <Input
            placeholder='Background'
            id='screenshot-demo-background'
            type='text'
            fontSize={2}
            width={['100%', '105px']}
            mr='6px'
            value={inputBg}
            onChange={event => setInputBg(event.target.value)}
            iconComponent={backgroundIconComponent}
            suggestions={[
              { value: '#c1c1c1' },
              {
                value:
                  'linear-gradient(225deg, #FF057C 0%, #8D0B93 50%, #321575 100%)'
              },
              {
                value: 'https://source.unsplash.com/random/1920x1080'
              }
            ]}
          />
        </Box>

        <ButtonSecondary ml={2} loading={isLoading}>
          <Caps fontSize={1} children='Take it' />
        </ButtonSecondary>
      </Flex>

      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Box mb='-12px'>
          <Text fontSize={2}>into a snapshot</Text>
        </Box>
        {previewUrl ? (
          <ImageDebounce
            mt={4}
            width={aspectRatio.widths}
            lazyHeight={aspectRatio.heights}
            lazyWidth={aspectRatio.widths}
            src={previewUrl}
          />
        ) : (
          <DemoSlider children={DEMO_LINKS} />
        )}
      </Flex>
    </Container>
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
        onClick={({ brand }) => navigate(`/screenshot/${brand.toLowerCase()}`)}
      />
    </Box>
  </Container>
)

export default ({
  demoLinks,
  url,
  refUrl,
  refWaitFor,
  refOverlay,
  refBackground,
  isLoading,
  onSubmit
}) => (
  <>
    <SearchBox
      onSubmit={onSubmit}
      url={url}
      refUrl={refUrl}
      refWaitFor={refWaitFor}
      refOverlay={refOverlay}
      refBackground={refBackground}
      isLoading={isLoading}
    />
    <Examples demoLinks={demoLinks} />
  </>
)
