/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

declare function index(msgItemIgnored: any, ...args: any[]): void;
export = index;
declare namespace index {
    const debug: any;
    function disable(): any;
    function enable(): any;
    const error: any;
    function get(namespace: any): any;
    function getAllInitializedLevels(): any;
    function getAllInitializedNamespaces(): any;
    const info: any;
    const isEnabled: boolean;
    function isLevelInitialized(level: any): any;
    function isNamespaceInitialized(namespace: any): any;
    const level: string;
    const levelIndex: number;
    // Circular reference from index
    const levelRoot: any;
    const namespace: any;
    const namespaceTokens: any;
    const notice: any;
    const warn: any;
    const warning: any;
}
