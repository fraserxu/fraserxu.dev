import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/bio'
import Layout from '../components/layout'
import SEO from '../components/seo'

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1 className='text-3xl'>{post.frontmatter.title}</h1>
          <p className='mt-2 mb-8 text-gray-700 uppercase'>
            {post.frontmatter.date}
          </p>
        </header>
        <section
          className='markdown'
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr className='my-8' />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul className='flex flex-wrap content-between p-0 list-none'>
          <li>
            {previous && (
              <Link
                className='text-gray-900 border-b border-dotted border-gray-900 hover:text-gray-700'
                to={previous.fields.slug}
                rel='prev'
              >
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link
                className='text-gray-900 border-b border-dotted border-gray-900 hover:text-gray-700'
                to={next.fields.slug}
                rel='next'
              >
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
