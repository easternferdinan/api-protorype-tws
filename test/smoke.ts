const PORT = process.env.PORT ?? 3000;
const BASE = `http://localhost:${PORT}`;

// Smoke test the API endpoints.
// Returns exit code 0 if all tests pass, 1 if any fail.
async function main() {
  let passed = 0;
  let failed = 0;

  const test = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      passed++;
      console.log(`✓ ${name}`);
    } catch (e: unknown) {
      failed++;
      const message = e instanceof Error ? e.message : String(e);
      console.log(`✗ ${name}: ${message}`);
    }
  };

  await test("register rejects invalid email", async () => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad", password: "12345678" }),
    });
    const body = await res.json();
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    if (body.success === undefined) throw new Error("Expected success field");
  });

  await test("login rejects invalid email", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    const body = await res.json();
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    if (body.success === undefined) throw new Error("Expected success field");
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
