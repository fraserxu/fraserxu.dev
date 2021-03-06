---
title: Running scheduled build for Gatsby site on Netlify
date: 2020-04-26T07:53:09.287Z
description: How to run scheduled build for Gatsby site on Netlify
---

For a static Gatsby site deployed to Netlify, by default the content only gets updated when we push code to `master` branch. But what if we have "semi-dynamic" data that needs to be updated periodically?

[In my previous post](https://fraserxu.dev/loading-github-data-into-gatsby-sites/), I added the `gatsby-source-github-api` plugin to fetch my 4 pined repoes from Github. If I change the pined item from Github, it won't get updated on my website.

So a cron job that runs on schedule to fetch the update can be helpful here.

Netlify has the [build hooks](https://docs.netlify.com/configure-builds/build-hooks/) feature where a build can be triggered by sending a `POST` request to a given URL.

```sh
$ curl -X POST -d '{}' https://api.netlify.com/build_hooks/XXXXXXXXXXXXXXX
```

#### Using Github Actions

We can use [Github Actions's scheduled events](https://help.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events-schedule) to run the `curl` command from above with a `cron` expression.

> Automate, customize, and execute your software development workflows right in your repository with GitHub Actions. You can discover, create, and share actions to perform any job you'd like, including CI/CD, and combine actions in a completely customized workflow.

Create a `.github/workfolws/main.yml` in the repo.

```yml
name: Trigger Netlify Build
on:
  schedule:
    # Run at 0815 daily
    - cron: '15 8 * * *'
jobs:
  build:
    name: Request Netlify Webhook
    runs-on: ubuntu-latest
    steps:
      - name: Curl request
        shell: bash
        env:
          NETLIFY_DEPLOY_HOOK: ${{ secrets.NetlifyDeployHook }}
        run: curl -X POST -d {} "$NETLIFY_DEPLOY_HOOK"
```

Note that we are reading the Netlify deploy hook url from `secrets` to avoid expose it to the public. The doc for how to manage secrets from Github [can be found here](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

One thing I noticed that is when adding a secret, the secret name can not have `_` in it otherwise it will not work.
