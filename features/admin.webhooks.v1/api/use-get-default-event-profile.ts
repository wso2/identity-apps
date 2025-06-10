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

import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import useGetEventProfileByName from "./use-get-event-profile-by-name";
import { WebhooksConstants } from "../constants/webhooks-constants";
import { EventProfileMetadataApiResponseInterface } from "../models/event-profile";

/**
 * Hook to get the WSO2 event profile metadata.
 * This is a convenience hook that fetches the default WSO2 event profile.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the WSO2 event profile data.
 */
const useGetDefaultEventProfile = (
    shouldFetch: boolean = true
): RequestResultInterface<EventProfileMetadataApiResponseInterface, RequestErrorInterface> => {
    return useGetEventProfileByName(WebhooksConstants.DEFAULT_EVENT_PROFILE.name, shouldFetch);
};

export default useGetDefaultEventProfile;
