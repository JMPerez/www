---
title: 'Device Emulation'
--- 

If you provide a compatible device name descriptor, the descriptor device will be used for emulating the viewport before take the screenshot.

<MultiCodeEditor languages={{
  Shell: `microlink-api https://microlink.io&screenshot=ipad`,
  'Node.js': `const mql = require('@microlink/mql')
 
module.exports = async () => {
  const { status, data, response } = await mql(
    'https://microlink.io'. { 
      screenshot: 'iPad',
  })
  console.log(status, data)
}
  `
  }} 
/>

<Figcaption>It doesn't matter if you use uppercase or lowercase.</Figcaption>

The following devices names are supported:

- BlackBerry Z30
- BlackBerry Z30 landscape
- Blackberry PlayBook
- Blackberry PlayBook landscape
- Galaxy Note 3
- Galaxy Note 3 landscape
- Galaxy Note II
- Galaxy Note II landscape
- Galaxy S III
- Galaxy S III landscape
- Galaxy S5
- Galaxy S5 landscape
- Kindle Fire HDX
- Kindle Fire HDX landscape
- LG Optimus L70
- LG Optimus L70 landscape
- Macbook Pro 13
- Macbook Pro 15
- Microsoft Lumia 550
- Microsoft Lumia 950
- Microsoft Lumia 950 landscape
- Nexus 10
- Nexus 10 landscape
- Nexus 4
- Nexus 4 landscape
- Nexus 5
- Nexus 5 landscape
- Nexus 5X
- Nexus 5X landscape
- Nexus 6
- Nexus 6 landscape
- Nexus 6P
- Nexus 6P landscape
- Nexus 7
- Nexus 7 landscape
- Nokia Lumia 520
- Nokia Lumia 520 landscape
- Nokia N9
- Nokia N9 landscape
- Pixel 2
- Pixel 2 XL
- Pixel 2 XL landscape
- Pixel 2 landscape
- iMac 21.5
- iMac 27
- iPad
- iPad Mini
- iPad Mini landscape
- iPad Pro
- iPad Pro landscape
- iPad landscape
- iPhone 4
- iPhone 4 landscape
- iPhone 5
- iPhone 5 landscape
- iPhone 6
- iPhone 6 Plus
- iPhone 6 Plus landscape
- iPhone 6 landscape
- iPhone 7
- iPhone 7 Plus
- iPhone 7 Plus landscape
- iPhone 7 landscape
- iPhone 8
- iPhone 8 Plus
- iPhone 8 Plus landscape
- iPhone 8 landscape
- iPhone SE
- iPhone SE landscape
- iPhone X
- iPhone X landscape
