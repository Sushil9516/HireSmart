var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_env = require("./config/env");
var import_cognodb = require("./config/cognodb");
var import_app = __toESM(require("./app"));
async function bootstrap() {
  try {
    (0, import_cognodb.initDriver)(import_env.env.COGNODB_URI, import_env.env.COGNODB_USERNAME, import_env.env.COGNODB_PASSWORD);
    await (0, import_cognodb.verifyConnectivity)();
  } catch (err) {
    console.error("\u26A0\uFE0F  [Server] Database unreachable at startup \u2014 running in degraded mode");
    console.error("   Reason:", err.message);
    (0, import_cognodb.setDatabaseConnected)(false);
  }
  import_app.default.listen(import_env.env.PORT, () => {
    console.log(`\u{1F680} [Server] HireGraph API running on http://localhost:${import_env.env.PORT}`);
    console.log(`   Environment: ${import_env.env.NODE_ENV}`);
    console.log(`   Client URL:  ${import_env.env.CLIENT_URL}`);
  });
}
bootstrap().catch((err) => {
  console.error("\u{1F4A5} [Server] Fatal startup error:", err);
  process.exit(1);
});
