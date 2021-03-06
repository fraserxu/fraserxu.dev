import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpeg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div className='flex mb-12 justify-center items-center'>
      <div className='flex justify-center items-center relative w-12 h-12 mr-3'>
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author.name}
          className=''
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      </div>

      <p className='text-lg'>
        Written by <span className='text-bold'>{author.name}</span>{' '}
        {author.summary}
        {` `}
        <a
          className='text-gray-900 border-b border-dotted border-gray-900 hover:text-gray-700'
          href={`https://twitter.com/${social.twitter}`}
        >
          You should follow him on Twitter
        </a>
      </p>
    </div>
  )
}

export default Bio
