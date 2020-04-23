import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title='About Me' />
      <h1>Find me on:</h1>
      <ul>
        <li>
          <a href='https://twitter.com/fraserxu'>Twitter</a>
        </li>
        <li>
          <a href='https://github.com/fraserxu'>Github</a>
        </li>
        <li>
          <a href='https://fraserxu.dev'>Blog</a>
        </li>
      </ul>
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
