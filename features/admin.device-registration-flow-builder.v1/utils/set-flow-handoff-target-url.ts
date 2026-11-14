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

import { store } from "@wso2is/admin.core.v1/store";
import FlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/flow-constants";
import { ExecutionTypes, Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";

/**
 * Points the flow handoff steps that have no target URL to the accounts portal page of the organization. The server
 * has no default target for the device registration flow, so a handoff without one has nowhere to go.
 *
 * @param steps - Steps of a template.
 * @returns The steps, with the target URL set on the flow handoff steps.
 */
const setFlowHandoffTargetUrl = (steps: Step[]): Step[] => {
    const targetUrl: string = store.getState().config.endpoints.deviceRegistrationPortal;

    return (steps ?? []).map((step: Step) => {
        if (step?.data?.action?.executor?.name !== ExecutionTypes.FlowHandoff
            || step.data.action.executor.meta?.[ FlowConstants.FLOW_HANDOFF_TARGET_URL_META_KEY ]) {
            return step;
        }

        return {
            ...step,
            data: {
                ...step.data,
                action: {
                    ...step.data.action,
                    executor: {
                        ...step.data.action.executor,
                        meta: {
                            ...step.data.action.executor.meta,
                            [ FlowConstants.FLOW_HANDOFF_TARGET_URL_META_KEY ]: targetUrl
                        }
                    }
                }
            }
        };
    });
};

export default setFlowHandoffTargetUrl;
