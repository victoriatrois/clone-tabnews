const { spawn, spawnSync } = require("node:child_process");

function test() {
  let cleanedUp = false;

  const testProcess = spawn(
    'npm run services:up && npm run services:wait:database && npm run migrations:up && concurrently --names next,jest --hide next --kill-others --success command-jest "next dev" "jest --runInBand --verbose"',
    { stdio: "inherit", shell: true },
  );

  function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    console.log("\nStopping services...");
    spawnSync("npm run services:stop", { stdio: "inherit", shell: true });
  }

  testProcess.once("close", (code) => {
    console.log("close");
    cleanup();
    process.exit(typeof code === "number" ? code : 0);
  });

  process.once("SIGINT", () => {
    cleanup();
    process.exit(1);
  });

  process.once("SIGTERM", () => {
    cleanup();
    process.exit(1);
  });
}

test();
