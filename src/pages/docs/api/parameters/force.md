---
title: 'force'
--- 

Type: `boolean`<br/>
Default: `false`

Invalidates the cache response associated with the query parameter and generates a fresh copy.

<MultiCodeEditor languages={{
  Shell: `microlink-api {{DemoLinks.ProductHunt.url}}&force`,
  'Node.js': `const mql = require('@microlink/mql')
 
module.exports = async () => {
  const { status, data, response } = await mql(
    '{{DemoLinks.ProductHunt.url}}', { 
      force: true
  })
  
 console.log(status, data)
}
  `
  }} 
/>

By default the API will be [cache](/docs/api/basics/cache) consecutive API calls.

Providing it, you are forcing to invalidate the current state of the cache for the response and generate a new one.

When `force` is enabled, `x-cache-status` always cause a **MISS**.

<MultiCodeEditor languages={{
  Shell: `curl -I -s -X GET https://api.microlink.io?url=https://www.reddit.com&force | grep -i "x-cache-status"`,
  'Node.js': `const mql = require('@microlink/mql')
 
module.exports = async () => {
  const { status, data, response } = await mql('https://www.reddit.com', { force: true })
  
  console.log(response.headers.['x-cache-status' ) // => 'MISS'
}
  `
  }} 
/>
