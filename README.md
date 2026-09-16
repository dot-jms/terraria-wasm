# Hosting on a static site (including GitHub Pages)

The game requires `crossOriginIsolated` for pthread-enabled WebAssembly. A
traditional server must send these response headers:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

The production build also includes `public/coi-serviceworker.js`. The service
worker adds those headers to HTML navigations, which makes the build usable on
static hosts that do not support custom headers, including GitHub Pages. The
first visit installs the worker and reloads once; after that,
`window.crossOriginIsolated` should be `true`.

This is still subject to normal service-worker requirements: the site must be
HTTPS (GitHub Pages is), the worker must be served from the same origin, and
the browser must support service workers. If the app is embedded in an iframe,
the embedding page must also allow cross-origin isolation.

For hosts that support headers, keep using the existing `_headers` file rather
than relying on the service worker.

