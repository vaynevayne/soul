module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-soul`
  extends: ["soul"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
