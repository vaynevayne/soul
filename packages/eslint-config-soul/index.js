module.exports = {
  extends: ["next", "turbo", "prettier", "plugin:react-hooks/recommended"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
}
