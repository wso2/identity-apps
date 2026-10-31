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
 * A component within a published flow step. Components nest — a form block wraps its inputs.
 */
export interface PublishedFlowComponentInterface {
    config?: {
        identifier?: string;
        identifierType?: string;
        label?: string;
    };
    components?: PublishedFlowComponentInterface[];
}

/**
 * A single step of a published flow.
 */
interface PublishedFlowStepInterface {
    data?: {
        components?: PublishedFlowComponentInterface[];
    };
}

/**
 * Response shape for `GET /flow?flowType=...`.
 *
 * Narrowed to the fields the Organization branch reads. The authoritative model is
 * `RegistrationFlow` in admin.registration-flow-builder.v1, which is not a dependency here.
 */
export interface PublishedFlowInterface {
    steps?: PublishedFlowStepInterface[];
}
