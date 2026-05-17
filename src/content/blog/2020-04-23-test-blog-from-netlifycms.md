---
title: Running Headless JavaScript Testing with Electron On Any CI Server
date: 2020-04-23T12:51:12.600Z
description: This post comes from the work I've been working on recently on
  [testing React code](https://github.com/fraserxu/react-testing-recipes).  One
  issue I got while writing actually unit test code is that some of the code
  depends on a browser based environment because they need to access to some
  browser only object or APIs.
---
### Background

This post comes from the work I've been working on recently on [testing React code](https://github.com/fraserxu/react-testing-recipes).

One issue I got while writing actually unit test code is that some of the code depends on a browser based environment because they need to access to some browser only object or APIs.

### The first solution

Most of the unit tests nowdays are running with Nodejs, so in order to emulate a browser environment, [jsdom](https://github.com/tmpvar/jsdom) showed up.

> A JavaScript implementation of the WHATWG DOM and HTML standards, for use with [Node.js](https://nodejs.org/).

Here's a handy snippet that you could use before your testing code to prepare a DOM environment:

```JavaScript
import jsdom from 'jsdom'

// This part inject document and window variable for the DOM mount test
export const prepareDOMEnv = (html = '<!doctype html><html><body></body></html>') => {
  if (typeof document !== 'undefined') {
    return
  }
  global.document = jsdom.jsdom(html)
  global.window = global.document.defaultView
  global.navigator = {
    userAgent: 'JSDOM'
  }
}
```

And in your test code, you could just import it and use it by calling the fucntion.

```JavaScript
import { prepareDOMEnv } from 'jsdomHelper'

prepareDOMEnv()
```

If your code depends on some DOM helper function like jQuery, you may also need to include the source code of jQuery into the prepared environment, you could do:

```JavaScript
import fs from 'fs'
import jsdom from 'jsdom'
import resolve from 'resolve'

const jQuery = fs.readFileSync(resolve.sync('jquery'), 'utf-8')

jsdom.env('<!doctype html><html><body></body></html>', {
  src: [jQuery]
}, (err, window) => {
  console.log('Voilà!', window.$('body'))
  // your actual test code here.
})
```

**Notes:** in the official jsdom github repo, they give an example of loading jQuery from the CDN which need an additional network request and can be unreliable and not work if without network. They also have an example loading jQuery source code with nodejs `fs` module but it's not clean as you have to tell the path to jQuery.

Everthing looks OK so far, but why do we bother to having a real browser environment?

The reason is that once things get compliated, your code may depend on more browser based API. Of course you could fix your code but what if you are using 3rd party moudles from **npm**, and one of them happen to depends on `XMLHttpRequest`, it's nearly impossible to "mock" everything, and to be honest, I feel uncomfortable to do this way as it's really tricky and kinda dirty.

### Let's run it in a browser

#### Why not Phantomjs

From the problem we saw above, it's pretty straight forward to think about to just run all the test in a real browser. If you search "headless browser testing" on Google, the first result will be PhantomJS.

I haven't used phantomjs a lot and I'm not familar with how it works, but I've been heard bad things about it, "lagging behind more and more from what actual web browser do today", "have 1500+ opened issues on Github", "unicode encode issue for different language".

The last concern is actually from my own experince and I mentioned it in my another blog post [PDF generation on the web](https://fraserxu.me/2015/08/20/pdf-generation-on-the-web/).

Last but not least, I'm not quite confident about how Phantomjs deal with Nodejs code. As my testing code is actually not **browser only** code, it needs to access to nodjes `fs` module as well.

### Let's talk about Electron

What is [Electron](http://electron.atom.io/)?

> Build cross platform desktop apps with web technologies. Formerly known as Atom Shell. Made with <3 by GitHub.

It will be another blog post to explain what is Electron and what it does, I have built [a](https://wiredcraft.com/blog/technology-behind-myanmar-elections/) few [projects](https://github.com/fraserxu/electron-pdf) with it and also have written a few [blog posts](https://fraserxu.me/2015/09/18/translation-workflow-in-Electron-application/) on it, the short version and what it really matters to me is **A Nodejs + Chromium Runtime**, **actively maintained by fine folks from Github** and **used by Atom editor, Slack etc**. And to conclude I'll quote from one of my favourite JavaScript developer [dominictarr](https://twitter.com/dominictarr)

> Electron is the best thing to happen to javascript this year.
> Now we get root access to the browser!

### Let's run our code in browser

Please read the [quick start guide](http://electron.atom.io/docs/v0.36.5/tutorial/quick-start/#quick-start) and make sure you know how to [write your first Electron App](http://electron.atom.io/docs/v0.36.5/tutorial/quick-start/#write-your-first-electron-app).

Since we are not building a real Electron app here but only want to run our JavaScript code in it, there's a project called [browser-run](https://github.com/juliangruber/browser-run).

You can install it with `npm install browser-run` and use it like this:

```
$ echo "console.log('Hey from ' + location); window.close()" | browser-run
Hey from http://localhost:53227/
```

#### Run test in Electron

And if you are writting your test with `tape`, you could even pipe your testing result to a test reporter like `faucet`

```
browserify -t babelify test.js | browser-run -p 2222 | faucet
```

There are also a tool specific designed for tape named [tape-run](https://github.com/juliangruber/tape-run)

> A tape test runner that runs your tests in a (headless) browser and returns 0/1 as exit code, so you can use it as your npm test script.

With it is even easier to run your test.

```
browserify -t babelify test.js | tape-run | faucet
```

**Tip:** There's also one module to run mocha test named [electron-mocha](https://github.com/jprichardson/electron-mocha).

#### Important notes

As the title indicate, this post is to running testing on **any CI server**. The reason is that most of the CI server are neither Mac or Windows, and there's [known issue](https://github.com/atom/electron/issues/228) to run Electron on Linux, you need a few setup to make it running on them.

Here's a few notes copied from the repo and thanks to [juliangruber](https://github.com/juliangruber) to include my section on running it on gnu/linux there.

To use the default electron browser on travis, add this to your travis.yml:

```
addons:
  apt:
    packages:
      - xvfb
install:
  - export DISPLAY=':99.0'
  - Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
  - npm install
```

[Source](https://github.com/rhysd/Shiba/blob/055a11a0a2b4f727577fe61371a88d8db9277de5/.travis.yml).

For gnu/linux installations without a graphical environment:

```bash
$ sudo apt-get install xvfb # or equivalent
$ export DISPLAY=':99.0'
$ Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
$ browser-run ...
```

There is also an example docker machine [here](https://github.com/fraserxu/docker-tape-run).

### Final step

Once we have all setups ready, our test will be much simpler without need to "hack" a browser like environment:

```JavaScript
import test from 'tape'
import React from 'react'
import jQuery from 'jquery'
import { render } from 'react-dom'

test('should have a proper testing environment', assert => {
  jQuery('body').append('<input>')
  const $searchInput = jQuery('input')

  assert.true($searchInput instanceof jQuery, '$searchInput is an instanceof jQuery')

  assert.end()
})
```

And you can put the test code in npm script and call it on your CI

```JavaScript
{
  // ...
  "scripts": {
    "test": "browserify -t babelify test.js | tape-run | faucet"
  }
   // ...
}
```

### Conclusion

Voilà! That's all we needed to running headless JavaScript test on any CI server. Of course your testing environment may different from mine but the idea is there.

As front-end development is changing rapidly recently with things like single page application, <del>isomorphic</del> universal app, also front-end tooling system like npm, brwoserify, babel, webpack, testing will become more complex. I hope these setups will make your life less suck and eaiser.

Last but not least, if you have any questions or better way for testing setups, let us know!