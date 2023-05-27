#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    chromeFlags: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--remote-debugging-port=9222',
        '--hide-scrollbars',
        '--disable-dev-shm-usage'
    ],
    forwardHeaders: true,
    logRequests: true,
    chromeLocation: '/usr/bin/google-chrome-stable'
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
// server.use(prerender.blockResources());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.use(prerender.cacheIO());
server.start();
