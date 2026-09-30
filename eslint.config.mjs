import { fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// Next's lint plugins still use APIs removed in ESLint 10. Keep their rules active.
const eslintConfig = fixupConfigRules([...nextVitals, ...nextTypescript]);

export default eslintConfig;
