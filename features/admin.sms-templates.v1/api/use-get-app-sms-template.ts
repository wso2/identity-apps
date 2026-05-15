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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { SMSTemplateConstants } from "../constants/sms-template-constants";
import { SMSTemplate } from "../models/sms-templates";

/**
 * Hook to get the app-specific SMS template for a given template type and application.
 *
 * @param templateType - Template type.
 * @param appId - Application ID.
 * @param locale - Locale of the template.
 * @param shouldFetch - Should fetch the data.
 *
 * @returns App-specific SMS template.
 */
const useGetAppSmsTemplate = <Data = SMSTemplate, Error = RequestErrorInterface>(
    templateType: string,
    appId: string,
    locale: string = SMSTemplateConstants.DEAFULT_LOCALE,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const smsLocale: string = locale.replace("-", "_");

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url:
            store.getState().config.endpoints.smsTemplates +
            `/template-types/${templateType}/app-templates/${appId}/${smsLocale}`
    };

    const { data, error, isValidating, isLoading, mutate } = useRequest<Data, Error>(
        shouldFetch && templateType && appId ? requestConfig : null
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetAppSmsTemplate;
