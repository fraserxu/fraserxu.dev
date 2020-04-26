import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const pinedRepos = data.githubData.data.user.pinnedItems.edges.map(
    (edge) => edge.node
  )

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title='Fraser Xu' />
      <h2>Find me on:</h2>
      <ul>
        <li>
          <a href='https://github.com/fraserxu'>Github</a>
        </li>
        <li>
          <a href='https://twitter.com/fraserxu'>Twitter</a>
        </li>
        <li>
          <a href='https://www.instagram.com/fraserxu/'>Instagram</a>
        </li>
        <li>
          <a href='/blog'>Blog</a>
        </li>
      </ul>

      <h2>Open source work:</h2>
      <ul>
        {pinedRepos.map((repo) => {
          return (
            <li key={repo.name}>
              <a href={repo.url}>{repo.name}</a>
              <p>{repo.description}</p>
            </li>
          )
        })}
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
    githubData {
      data {
        user {
          pinnedItems {
            edges {
              node {
                name
                url
                description
              }
            }
          }
        }
      }
    }
  }
`
