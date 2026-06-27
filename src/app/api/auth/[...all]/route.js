export const runtime = "nodejs";
export const dynamic = "force-dynamic";


async function getHandlers() {
  const [{ auth }, { toNextJsHandler }] = await Promise.all([
    import("@/lib/auth"),
    import("better-auth/next-js"),
  ]);
  return toNextJsHandler(auth);
}

export async function GET(request) {
  const handlers = await getHandlers();
  return handlers.GET(request);
}

export async function POST(request) {
  const handlers = await getHandlers();
  return handlers.POST(request);
}
