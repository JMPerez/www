import React from 'react'
import Microlink from '@microlink/react'
import { template } from 'helpers'

export default ({ url, ...props }) => {
  if (url) url = template(url)
  return <Microlink url={url} style={{ margin: 'auto' }} {...props} />
}
