import { terser } from "rollup-plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import flow from "rollup-plugin-flow";
import globals from "rollup-plugin-node-globals";
import resolve from "rollup-plugin-node-resolve";

import pkg from "./package.json";

export default [
  // CommonJS
  {
    input: "src/index.js",
    output: {
      file: "lib/introversion.js",
      format: "cjs",
      exports: "named"
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [flow({ pretty: true }), resolve()]
  },

  // ES
  {
    input: "src/index.js",
    output: {
      file: "es/introversion.js",
      format: "es"
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [flow({ pretty: true })]
  },

  // ES for Browsers
  {
    input: "src/index.js",
    output: {
      file: "es/introversion.mjs",
      format: "es"
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      flow({ pretty: true }),
      resolve(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },

  // UMD Development
  {
    input: "src/index.js",
    output: {
      file: "dist/introversion.js",
      format: "umd",
      name: "Introversion",
      exports: "named",
      indent: false
    },
    plugins: [
      flow({ pretty: true }),
      resolve(),
      commonjs(),
      globals(),
      builtins()
    ]
  },

  // UMD Production
  {
    input: "src/index.js",
    output: {
      file: "dist/introversion.min.js",
      format: "umd",
      name: "Introversion",
      exports: "named",
      indent: false
    },
    plugins: [
      flow({ pretty: true }),
      resolve(),
      commonjs(),
      globals(),
      builtins(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
