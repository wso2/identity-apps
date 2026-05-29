/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { ActionTypes } from "./actions";
import { Element } from "./elements";

interface Page {
    id: string;
    nodes: string[];
}

interface Flow {
    pages: Page[];
}

interface ExecutorInfo {
    name: string;
    meta: Record<string, unknown>;
}

interface ActionInfo {
    type: ActionTypes;
    executors: ExecutorInfo[]
}

interface Action {
    id: string;
    action: ActionInfo;
    next: string[];
}

interface Node {
    id: string;
    elements: string[];
    actions: Action[];
    data: Record<string, unknown>;
}

interface Block {
    id: string;
    elements: string[];
}

export interface Payload {
    flow: Flow;
    nodes: Node[];
    blocks: Block[];
    elements: Element[];
}
