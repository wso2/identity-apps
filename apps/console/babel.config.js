/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Temporarily duplicate the babel.config.js from identity-apps/apps/console here.
 * TODO : We need to create an extension model for this instead of maintaining a copy if babel.config.js
 * from identity apps console here.
 *
 * Tracked with issue : {@link https://github.com/wso2-enterprise/asgardeo-product/issues/7207}
 */
module.exports = {
    env: {
        test: {
            plugins: [ "@babel/plugin-transform-modules-commonjs" ]
        }
    },
    plugins: [
        "@babel/plugin-proposal-class-properties",
        [
            "babel-plugin-rename-jsx-attribute",
            {
                "attributes": {
                    "data-suppress": "data-hj-suppress"
                }
            }
        ]
    ],
    presets: [
        [
            "@babel/preset-env",
            {
                corejs: {
                    proposals: true,
                    version: "3.6"
                },
                useBuiltIns: "entry"
            }
        ],
        "@babel/preset-typescript",
        "@babel/react"
    ]
};
