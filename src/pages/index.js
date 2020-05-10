import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import GithubIcon from '../icons/github.svg'
import TwitterIcon from '../icons/twitter.svg'
import InstagramIcon from '../icons/instagram.svg'

import './index.css'

const IconMap = {
  github: <GithubIcon className='inline w-4' />,
  twitter: <TwitterIcon className='inline w-4' />,
  instagram: <InstagramIcon className='inline w-4' />,
}

const IndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const social = data.site.siteMetadata.social
  const pinedRepos = data.githubData.data.user.pinnedItems.edges.map(
    (edge) => edge.node
  )

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title='Fraser Xu' />
      <div className='mt-4 pt-4'>
        <h2>Find me on:</h2>
        <ul>
          {Object.keys(social).map((key) => {
            return (
              <li className='inline pr-2' key={key}>
                <a href={`https://${key}.com/${social[key]}`}>{IconMap[key]}</a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className='pt-4'>
        <h2>Open source work:</h2>
        <ul>
          {pinedRepos.map((repo) => {
            return (
              <li key={repo.name} className='pb-4'>
                <a
                  className='text-teal-500 hover:text-teal-700'
                  href={repo.url}
                >
                  {repo.name}
                </a>
                <p>{repo.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        social {
          twitter
          github
          instagram
        }
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
