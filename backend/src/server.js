var envModule = require("./config/env");
var cognodb = require("./config/cognodb");
var app = require("./app");

var env = envModule.env;

async function bootstrap() {
  try {
    cognodb.initDriver(env.COGNODB_URI, env.COGNODB_USERNAME, env.COGNODB_PASSWORD);
    await cognodb.verifyConnectivity();
  } catch (err) {
    console.error("⚠️  [Server] Database unreachable at startup — running in degraded mode");
    console.error("   Reason:", err.message);
    cognodb.setDatabaseConnected(false);
  }

  app.listen(env.PORT, function () {
    console.log("🚀 [Server] HireGraph API running on port " + env.PORT);
    console.log("   Environment: " + env.NODE_ENV);
    console.log("   CORS origins: " + env.ALLOWED_ORIGINS.join(", "));
  });
}

bootstrap().catch(function (err) {
  console.error("💥 [Server] Fatal startup error:", err);
  process.exit(1);
});
