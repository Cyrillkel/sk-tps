import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const layers = ["_app", "_pages", "widgets", "features", "entities", "shared"];
const publicApiPattern = {
  regex: "^@/(?:_pages|widgets|features|entities)/[^/]+/",
  message: "Импортируйте слайс через его публичный index.ts.",
};

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [publicApiPattern] }],
    },
  },
  ...layers.map((layer, index) => {
    const includesCurrentLayer = layer !== "_app" && layer !== "shared";
    const restrictedLayers = layers.slice(0, index + Number(includesCurrentLayer));

    return {
      files: [`src/${layer}/**/*.{ts,tsx}`],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              publicApiPattern,
              ...(restrictedLayers.length
                ? [{
                    regex: `^@/(?:${restrictedLayers.join("|")})(?:/|$)`,
                    message: "FSD: импортируйте только нижние слои; внутри слайса используйте относительные пути.",
                  }]
                : []),
            ],
          },
        ],
      },
    };
  }),
  globalIgnores([".next/**", "out/**", "next-env.d.ts", ".pnpm-store/**"]),
]);
