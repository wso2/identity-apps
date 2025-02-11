/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const commonjs = require("@rollup/plugin-commonjs");
const dynamicImportVars = require("@rollup/plugin-dynamic-import-vars");
const image = require("@rollup/plugin-image");
const json = require("@rollup/plugin-json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");
const svgr = require("@svgr/rollup");
const dts = require("rollup-plugin-dts");
const nodePolyfills = require("rollup-plugin-polyfill-node");
const scss = require("rollup-plugin-scss");
const svg = require("rollup-plugin-svg");

const onwarn = (warning, warn) => {
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
        return;
    }
    warn(warning);
};

module.exports = [
    {
        cache: false,
        external: [ "react", "react-dom", /^@wso2is\// ],
        input: [
            "./public-api.ts"
        ],
        onwarn,
        output: [
            {
                dir: "dist/esm",
                format: "esm",
                preserveModules: true,
                preserveModulesRoot: "."
            }
        ],
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: "./tsconfig.json"
            }),
            scss(),
            svg(),
            svgr(),
            json(),
            image(),
            nodePolyfills(),
            commonjs(),
            dynamicImportVars()
        ]
    },
    {
        cache: false,
        input: "dist/esm/types/public-api.d.ts",
        output: [ { file: "dist/esm/index.d.ts", format: "esm" } ],
        plugins: [ dts.default() ]
    }
];
