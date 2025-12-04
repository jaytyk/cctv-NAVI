export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    if (!target) {
      return new Response("Missing ?url=", { status: 400 });
    }
    // 안전장치: 허용할 도메인 제한(원하면 추가)
    const t = new URL(target);
    const allowed = new Set(["openapi.its.go.kr"]);
    if (!allowed.has(t.hostname)) {
      return new Response("Blocked host", { status: 403 });
    }

    const resp = await fetch(target, {
      headers: { "Accept": "application/json" }
    });

    const newHeaders = new Headers(resp.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type,Accept");

    return new Response(resp.body, { status: resp.status, headers: newHeaders });
  }
};
