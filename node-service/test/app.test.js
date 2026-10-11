const test = require("node:test");
const assert = require("node:assert");
const app = require("../app");

test("GET /healthz returns ok", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/healthz`);
  const body = await res.json();
  server.close();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.status, "ok");
});
