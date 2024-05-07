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
const styles = require("rollup-plugin-styles");
const svg = require("rollup-plugin-svg");

module.exports = [
    {
        cache: false,
        input: [
            "./index.ts",
            "./admin.api-resources.v2/public-api.ts",
            "./admin.application-roles.v1/public-api.ts",
            "./admin.applications.v1/public-api.ts",
            "./admin.authentication.v1/public-api.ts",
            "./admin.authorization.v1/public-api.ts",
            "./admin.branding.v1/public-api.ts",
            "./admin.certificates.v1/public-api.ts",
            "./admin.claims.v1/public-api.ts",
            "./admin.connections.v1/public-api.ts",
            "./admin.console-settings.v1/public-api.ts",
            "./admin.core.v1/public-api.ts",
            "./admin.email-and-sms.v1/public-api.ts",
            "./admin.email-management.v1/public-api.ts",
            "./admin.email-providers.v1/public-api.ts",
            "./admin.email-templates.v1/public-api.ts",
            "./admin.extensions.v1/public-api.ts",
            "./admin.groups.v1/public-api.ts",
            "./admin.identity-providers.v1/public-api.ts",
            "./admin.identity-verification-providers.v1/public-api.ts",
            "./admin.layouts.v1/public-api.ts",
            "./admin.oidc-scopes.v1/public-api.ts",
            "./admin.org-insights.v1/public-api.ts",
            "./admin.organization-discovery.v1/public-api.ts",
            "./admin.organizations.v1/public-api.ts",
            "./admin.parent-roles.v1/public-api.ts",
            "./admin.private-key-jwt.v1/public-api.ts",
            "./admin.provisioning.v1/public-api.ts",
            "./admin.remote-repository-configuration.v1/public-api.ts",
            "./admin.roles.v2/public-api.ts",
            "./admin.saml2-configuration.v1/public-api.ts",
            "./admin.secrets.v1/public-api.ts",
            "./admin.session-management.v1/public-api.ts",
            "./admin.sms-providers.v1/public-api.ts",
            "./admin.tenants.v1/public-api.ts",
            "./admin.users.v1/public-api.ts",
            "./admin.userstores.v1/public-api.ts",
            "./admin.validation.v1/public-api.ts",
            "./admin.views.v1/public-api.ts",
            "./admin.workflow-approvals.v1/public-api.ts",
            "./admin.wsfed-configuration.v1/public-api.ts"
        ],
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
            scss(),
            svg(),
            svgr(),
            json(),
            image(),
            nodePolyfills(),
            commonjs(),
            typescript({
                tsconfig: "./tsconfig.json"
            }),
            dynamicImportVars(),
            styles({ mode: "inject" })
        ]
    },
    {
        cache: false,
        external: [ /\.(sass|scss|css)$/ ],
        input: "dist/esm/types/index.d.ts",
        output: [ { file: "dist/index.d.ts", format: "esm" } ],
        plugins: [ dts.default() ]
    }
];
