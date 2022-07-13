/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { DataNode } from "rc-tree/lib/interface";

/**
 * Interface extending DataNode to capture tree node 
 * data for permission tree.
 */
export interface TreeNode extends DataNode {
    fullPath?: string;
    name?: string;
}

/**
 * Interface to capture backend permission structure
 */
export interface PermissionObject {
    displayName: string;
    resourcePath: string;
}
