/*
 * GitHub Pages (and most static hosts) do not let us configure response
 * headers. This service worker adds the two headers required for
 * crossOriginIsolated after it takes control of the page.
 *
 * The first visit bootstraps the worker and reloads once. Every subsequent
 * navigation is served with the isolation headers, so SharedArrayBuffer and
 * pthread-enabled WebAssembly can be used without a server-side proxy.
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
	// COOP/COEP are document policies. Restricting this to navigations avoids
	// rewriting opaque cross-origin responses used by the app's network code.
	if (event.request.mode !== "navigate") return;

	event.respondWith(
		(async () => {
			const response = await fetch(event.request);
			const headers = new Headers(response.headers);
			headers.set("Cross-Origin-Opener-Policy", "same-origin");
			headers.set("Cross-Origin-Embedder-Policy", "require-corp");

			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers,
			});
		})(),
	);
});
