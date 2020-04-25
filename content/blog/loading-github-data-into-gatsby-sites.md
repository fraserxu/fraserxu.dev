---
title: Loading Github data into Gatsby sites
date: 2020-04-25T06:42:57.982Z
description: How to load Github data into a Gatsby site
---
I want to load some of my open source projects data and show them on my new personal website. This blog post shows how I did it. 

I searched Github plugin on Gatsby plugin site and found the most popular one [gatsby-source-github-api](https://www.gatsbyjs.org/packages/gatsby-source-github-api/).

### Install the plugin 

```sh

$ npm i gatsby-source-github-api

```

### Add config to `gatsby-config.js`

I want to query the top 4 pinedItems for myself. First step is to define the `author` name and number of items to query `userFirst` in the `options.variables`.

Next is to query the pined repos querying the `name`, `url`, `description`.

```js
{
  resolve: `gatsby-source-github-api`,
  options: {
    token: process.env.GITHUB_TOKEN,
    graphQLQuery: `
      query ($author: String = "", $userFirst: Int = 0) {
        user(login: $author) {
          pinnedItems(first: $userFirst) {
            edges {
              node {
                ... on Repository {
                  id
                  name
                  url
                  description
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      author: 'fraserxu',
      userFirst: 4,
    },
  },
},
```

Follow GitHub’s guide [how to generate a token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

Note that here we are reading the `GITHUB_TOKEN` from `process.env`. For development, we can pass it from the develop command with `GITHUB_TOKEN=xxx gatsby develop`. For production, this can be usually setup with any secrets management tool. In my case, I'm using `netlify` to manage my site and I can just set this in the `Environment variables` tab from project deploy setting page.

### Query data in page

After adding the plugin and config, we will be able to query the data from page level component.

```js
export const pageQuery = graphql`
  query {
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
```

And then rendering the data with 

```jsx
const pinedRepos = data.githubData.data.user.pinnedItems.edges.map(
  (edge) => edge.node
)

return (
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
)
```

![screenshot]()
