/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
