import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import GithubIcon from '../icons/github.svg'
import TwitterIcon from '../icons/twitter.svg'
import InstagramIcon from '../icons/instagram.svg'
import About from './about.mdx'
import Repos from '../components/repos'

import './index.css'

const IconMap = {
  github: <GithubIcon className='inline w-4' />,
  twitter: <TwitterIcon className='inline w-4' />,
  instagram: <InstagramIcon className='inline w-4' />,
}

const IndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const social = data.site.siteMetadata.social
  const pinedRepos = data.githubData.data.viewer.pinnedItems.edges.map(
    (edge) => edge.node
  )
  const latestUpdatedRepos = data.githubData.data.viewer.repositories.nodes.reverse()

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title='Fraser Xu' />
      <div className='markdown mt-4'>
        <About />
      </div>
      <p></p>
      <div className='mt-4 pt-8'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Find me on:
        </h2>
        <ul className='ml-2'>
          {Object.keys(social).map((key) => {
            return (
              <li className='inline pr-2' key={key}>
                <a href={`https://${key}.com/${social[key]}`}>{IconMap[key]}</a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className='pt-8'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Open source works hot?:
        </h2>
        <Repos repos={pinedRepos} />
      </div>

      <div className='pt-8'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Latest hacks:
        </h2>
        <Repos repos={latestUpdatedRepos} />
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
        viewer {
          pinnedItems {
            edges {
              node {
                name
                pushedAt(fromNow: true)
                url
                homepageUrl
                description
                languages {
                  nodes {
                    name
                    color
                  }
                }
                stargazers {
                  totalCount
                }
              }
            }
          }
          repositories {
            nodes {
              name
              pushedAt(fromNow: true)
              url
              homepageUrl
              description
              languages {
                nodes {
                  name
                  color
                }
              }
              stargazers {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`
