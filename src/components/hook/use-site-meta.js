import { useStaticQuery, graphql } from 'gatsby'

export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            paymentEndpoint
            paymentApiKey
            stripeKey
            siteUrl
            headline
            description
            image
            twitter
            name
            logo
          }
        }
      }
    `
  )
  return site.siteMetadata
}
