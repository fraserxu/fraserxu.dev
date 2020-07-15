module.exports = {
  siteMetadata: {
    title: `Fraser Xu`,
    author: {
      name: `Fraser Xu`,
      summary: `who lives and works in Melbourne.`,
    },
    description: `Blog.`,
    siteUrl: `https://fraserxu.dev/`,
    social: {
      twitter: `fraserxu`,
      github: 'fraserxu',
      instagram: 'fraserxu',
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-164586538-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Fraser Xu' Personal Website`,
        short_name: `fraserxu`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/profile-pic.jpeg`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-netlify-cms`,
    {
      resolve: `gatsby-source-github-api`,
      options: {
        token: process.env.GITHUB_TOKEN,
        graphQLQuery: `
          query ($userFirst: Int = 0) {
            viewer {
              pinnedItems(first: $userFirst) {
                edges {
                  node {
                    ... on Repository {
                      name
                      description
                      url
                      homepageUrl
                      pushedAt
                      languages(first: 1) {
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
              repositories(isFork: false, orderBy: {field: PUSHED_AT, direction: ASC}, last: 5, affiliations: OWNER) {
                nodes {
                  name
                  description
                  url
                  homepageUrl
                  pushedAt
                  languages(first: 1) {
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
        `,
        variables: {
          userFirst: 4,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /icons\/.*\.svg/,
        },
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-mdx`,
  ],
}
