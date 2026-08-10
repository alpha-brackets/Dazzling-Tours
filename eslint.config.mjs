// eslint-config-next 16 ships native flat configs, so they are spread in
// directly. The previous setup routed them through FlatCompat (the legacy
// .eslintrc shim), which crashes on this version with "Converting circular
// structure to JSON" while validating the legacy schema.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
