/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { store } from "@wso2is/admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import { SMSTemplateConstants } from "../constants/sms-template-constants";
import { SMSTemplate } from "../models/sms-templates";

/**
 * Hook to get the SMS template for a given template type.
 *
 * @param templateType - Template type.
 * @param locale - Locale of the template.
 * @param setIsSystemTemplate - Function to set system template.
 *
 * @returns SMS template.
 */
const useGetSmsTemplate = <Data = SMSTemplate, Error = RequestErrorInterface>(
    templateType: string,
    locale: string = SMSTemplateConstants.DEAFULT_LOCALE,
    fetchSystemTemplate: boolean = false,
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
            `/template-types/${templateType}/org-templates/${smsLocale}`
    };

    if (fetchSystemTemplate) {
        requestConfig.url =
            store.getState().config.endpoints.smsTemplates +
            `/template-types/${templateType}/system-templates/${SMSTemplateConstants.DEAFULT_LOCALE_FORMATTED}`;
    }

    const { data, error, isValidating, isLoading, mutate } = useRequest<Data, Error>(
        shouldFetch && templateType ? requestConfig : null
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetSmsTemplate;
