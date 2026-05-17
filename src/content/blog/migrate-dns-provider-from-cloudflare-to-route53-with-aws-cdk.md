---
title: Migrate DNS provider from Cloudflare to AWS Route 53 with AWS CDK
date: 2020-10-7T11:23:09.287Z
description: Migrate DNS provider from Cloudflare to AWS Route 53 with AWS CDK
---

My old domain `fraserxu.me` will be expire in a week, I decided to not renew it in favour of using my new domain `fraserxu.dev`.

Other than hosting my old blog on the root domain name which I will be stop using, I also have serval subdomains for my side projects such as [hotdog.fraserxu.me](https://hotdog.fraserxu.me) that I want to keep. The goal is to migrate it to [hotdog.fraserxu.dev](https://hotdog.fraserxu.dev).

### Existing setup

The source code for [hotdog.fraserxu.dev](https://hotdog.fraserxu.dev) is on [Github](https://github.com/fraserxu/hotdog), deployed and hosted on Netlify as a static sites.

Netlify supports custom domains, new domains can be added through the `Custom domains` settings.

![Netlify custom domains](https://user-images.githubusercontent.com/1183541/95274540-d3b3fb00-0891-11eb-90bb-c16a008772cf.png)

The old domain is using Cloudflare as the DNS provider, I just need to create a new `CNAME` record `hotdog` with `contents` point to the netlify url `angry-heisenberg-6deadb.netlify.com` from the Cloudflare web console.

![Cloudflare CNAME](https://user-images.githubusercontent.com/1183541/95274533-cf87dd80-0891-11eb-9fa7-ab6f0be8448c.png)

### New setup

My new domain `fraserxu.dev` is using AWS Route 53 as the DNS provider. I can do the same thing by just creating a new `CNAME` record from AWS web console. But for learning purpose, I decide to try AWS CDK using the `@aws-cdk/aws-route53` module. I created a private repo on Github called `infrastructure` and plan to use it for this and other AWS resources I might be using in the future.

To start, use the `cdk init` command to create the app using `TypeScript`

```
cdk init app --language typescript
```

The `init` command created an empty stack in `lib/infrastucture-stack.ts`

```TypeScript
export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    // resources here
  }
}
```

For my case, I need the `@aws-cdk/aws-route53` package from the AWS Construct Library.

```
npm install @aws-cdk/aws-route53
```

I'm already using Route 53 to manage my domain, so I can just import it from existing Hosted Zone. [There's a few different way to import existing Zone](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-route53-readme.html#imports).

If I don't know the ID of the Hosted Zone, I can use the `HostedZone.fromLookup`:

```TypeScript
const zone = route53.HostedZone.fromLookup(this, "Zone", {
  domainName: "fraserxu.dev",
})
```

Alternatively, I can use the `fromHostedZoneId` if I know the `hostedZoneId`

```TypeScript
const zone = HostedZone.fromHostedZoneId(this, 'Zone', {
  hostedZoneId: 'my-hosted-zone-id',
});
```

Once it's imported, then we can add a new `CNAME` record using the `route53.CnameRecord` API

```TypeScript
new route53.CnameRecord(this, "Hotdog", {
  zone,
  recordName: "hotdog",
  domainName: "angry-heisenberg-6deadb.netlify.app",
})
```

That's it! Here's the full example:

```TypeScript
import * as cdk from "@aws-cdk/core"
import * as route53 from "@aws-cdk/aws-route53"

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: "fraserxu.dev",
    })

    new route53.CnameRecord(this, "Hotdog", {
      zone,
      recordName: "hotdog",
      domainName: "angry-heisenberg-6deadb.netlify.app",
    })
  }
}
```

This can be then be deployed with the `cdk deploy` command.
