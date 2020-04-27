import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import GithubIcon from '../icons/github.svg'
import TwitterIcon from '../icons/twitter.svg'
import InstagramIcon from '../icons/instagram.svg'

import Styles from './index.module.css'

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
          <a href='https://github.com/fraserxu'>
            <span className={Styles.iconContainer}>
              <GithubIcon className={Styles.icon} />
            </span>
            Github
          </a>
        </li>
        <li>
          <a href='https://twitter.com/fraserxu'>
            <span className={Styles.iconContainer}>
              <TwitterIcon className={Styles.icon} />
            </span>
            Twitter
          </a>
        </li>
        <li>
          <a href='https://www.instagram.com/fraserxu/'>
            <span className={Styles.iconContainer}>
              <InstagramIcon className={Styles.icon} />
            </span>
            Instagram
          </a>
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
