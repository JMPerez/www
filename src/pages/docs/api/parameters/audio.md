---
title: 'audio'
--- 

Type: `boolean`<br/>
Default: `false`

Enables audio source detection from the target URL.

<MultiCodeEditor languages={{
  Shell: `microlink-api {{DemoLinks.Spotify.url}}&audio`,
  'Node.js': `const mql = require('@microlink/mql')
 
module.exports = async () => {
  const { status, data, response } = await mql(
    '{{DemoLinks.Spotify.url}}', { 
      audio: true 
  })
  
 console.log(status, data)
}
  `
  }} 
/>

<Figcaption children="Some websites can be different output based on User Agent." />

The audio source URL detected will be in a browser-friendly format to be possible embedded it.

The audio detection introduce some human readable fields as part of the payload:

```json{26, 34}
{
  "data": {
    "title": "Format",
    "description": "Format, a song by _91nova on Spotify",
    "lang": "en",
    "author": "_91nova",
    "publisher": "Spotify",
    "image": {
      "url": "https://i.scdn.co/image/ab67616d0000b27351b9595d03c3a8fb3ffe9f1a",
      "type": "jpg",
      "size": 88064,
      "height": 640,
      "width": 640,
      "size_pretty": "88.1 kB"
    },
    "audio": {
      "url": "https://p.scdn.co/mp3-preview/f36438afe87418f2dc0b7497eb5e7e5fa89e6bf8?cid=162b7dc01f3a4a2ca32ed3cec83d1e02",
      "type": "mp3",
      "duration": 30.040816,
      "size": 362861,
      "duration_pretty": "30s",
      "size_pretty": "363 kB"
    },
    "url": "https://open.spotify.com/track/1W2919zs8SBCLTrOB1ftQT",
    "date": "2019-11-11T08:50:08.000Z",
    "logo": {
      "url": "https://open.scdn.co/static/images/favicon.png",
      "type": "png",
      "size": 11125,
      "height": 196,
      "width": 196,
      "size_pretty": "11.1 kB"
    }
  },
  "status": "success"
}
```
