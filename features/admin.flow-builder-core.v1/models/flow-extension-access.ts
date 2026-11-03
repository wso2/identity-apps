/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * An entry of a flow extension's access config. A runtime value or request header entry names the flow type it
 * applies to, as each flow defines its own.
 */
export interface FlowExtensionContextPathInterface {
    path: string;
    encrypted?: boolean;
    flowType?: string;
}

/**
 * What a flow extension may read (`expose`) and write (`modify`).
 */
export interface FlowExtensionAccessConfigInterface {
    expose?: FlowExtensionContextPathInterface[];
    modify?: FlowExtensionContextPathInterface[];
}

/**
 * The parts of a flow extension the flow builder uses.
 */
export interface FlowExtensionInterface {
    id: string;
    name: string;
    accessConfig?: FlowExtensionAccessConfigInterface;
}
