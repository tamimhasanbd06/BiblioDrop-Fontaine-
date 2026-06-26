import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// বাংলা মন্তব্য: ESLint configuration project build stable রাখে এবং React 19 compiler-এর অতিরিক্ত strict warning relax করে।
const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // বাংলা মন্তব্য: Data fetching useEffect এই project-এ intentional, তাই compiler warning disable করা হয়েছে।
      "react-hooks/set-state-in-effect": "off",
      // বাংলা মন্তব্য: Existing design কিছু জায়গায় normal img ব্যবহার করে, তাই warning disable করা হয়েছে।
      "@next/next/no-img-element": "off",
      // বাংলা মন্তব্য: Data reload helper dependency warning এই project-এ false positive, তাই warning off রাখা হয়েছে।
      "react-hooks/exhaustive-deps": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
