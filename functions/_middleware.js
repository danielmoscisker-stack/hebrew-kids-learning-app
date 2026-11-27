// Redirect default *.pages.dev hostnames to the canonical custom domain (kids.moscisker.info)
// so users and search engines only ever use one public URL.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname.endsWith('.pages.dev')) {
    url.hostname = 'kids.moscisker.info';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
