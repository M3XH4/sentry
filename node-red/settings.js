module.exports = {
  uiPort: process.env.PORT || 1880,
  disableEditor: false,
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "sentry-secret",
};