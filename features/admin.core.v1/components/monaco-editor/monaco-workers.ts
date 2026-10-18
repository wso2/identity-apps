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
 * Constructors of the web workers bundled for the Monaco editor.
 */
export interface MonacoWorkerFactoriesInterface<T = Worker> {
    editor: new () => T;
    json: new () => T;
    typescript: new () => T;
}

/**
 * Creates the bundled web worker that serves a Monaco worker label.
 *
 * @param label - Worker label Monaco asks for, e.g. `json`, `typescript` or `editorWorkerService`.
 * @param factories - Bundled worker constructors.
 * @returns A new worker for the label.
 */
export const resolveMonacoWorker = <T = Worker>(label: string, factories: MonacoWorkerFactoriesInterface<T>): T => {
    switch (label) {
        case "json":
            return new factories.json();
        case "javascript":
        case "typescript":
            return new factories.typescript();
        default:
            return new factories.editor();
    }
};
