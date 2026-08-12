var envModule = require("./config/env");
var cognodb = require("./config/cognodb");
var app = require("./app");

var env = envModule.env;

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function connectWithRetry(maxAttempts) {
  if (maxAttempts === undefined) maxAttempts = 6;

  cognodb.initDriver(env.COGNODB_URI, env.COGNODB_USERNAME, env.COGNODB_PASSWORD);

  for (var attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await cognodb.verifyConnectivity();
      return;
    } catch (err) {
      console.error(
        "⚠️  [Server] CognoDB attempt " + attempt + "/" + maxAttempts + " failed:",
        err.message
      );
      if (attempt < maxAttempts) {
        await sleep(5000);
      } else {
        cognodb.setDatabaseConnected(false);
        console.error("⚠️  [Server] Running in degraded mode — database unreachable");
      }
    }
  }
}

async function bootstrap() {
  console.log("🔌 [Server] Connecting to CognoDB:", env.COGNODB_URI);
  console.log("   Platform:", env.IS_RENDER ? "Render" : "local");

  await connectWithRetry();

  app.listen(env.PORT, function () {
    console.log("🚀 [Server] HireGraph API running on port " + env.PORT);
    console.log("   Database:", cognodb.isDatabaseConnected() ? "connected" : "disconnected");
    console.log("   CORS:", env.ALLOWED_ORIGINS.join(", "));
  });
}

bootstrap().catch(function (err) {
  console.error("💥 [Server] Fatal startup error:", err);
  process.exit(1);
});
