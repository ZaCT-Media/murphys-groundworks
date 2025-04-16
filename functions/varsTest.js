export async function onRequestGet(context) {
  const { env } = context;

  return new Response(`API_HOST is: ${env.API_HOST}`, {
    headers: { "Content-Type": "text/plain" },
  });
}
