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

import { AppState } from "@wso2is/admin.core.v1/store";
import get from "lodash-es/get";
import set from "lodash-es/set";
import { useSelector } from "react-redux";

/**
 * Hook to replace placeholders of dependent properties.
 *
 * @returns The function to handle dependent properties.
 */
const useDependentProperty = (): {
    dependentProperty: (
        templateValue: string,
        formValues:Record<string, unknown>,
        fieldName: string,
        placeholder: string
    ) => void
} => {
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const clientOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.clientOrigin);
    const serverOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.idpConfigs?.serverOrigin);
    const appBaseNameWithoutTenant: string = useSelector((state: AppState) =>
        state?.config?.deployment?.appBaseNameWithoutTenant);

    /**
     * Resolve the value corresponding to the given placeholder.
     *
     * @param placeholder - Value placeholder.
     * @returns the corresponding value of the placeholder.
     */
    const getPlaceholderValues = (placeholder: string): string => {
        switch(placeholder) {
            case "tenantDomain":
                return tenantDomain;
            case "clientOrigin":
                return clientOrigin;
            case "serverOrigin":
                return serverOrigin;
            case "appBaseNameWithoutTenant":
                return appBaseNameWithoutTenant;
            default:
                return "";
        }
    };

    /**
     * Replace placeholders of dependent properties.
     *
     * @param templateValue - Value defined in the template.
     * @param formValues - Object containing initial values for the form.
     * @param fieldName - Path of the field value within the object.
     * @param placeholder - Placeholder that needs to be replaced.
     */
    const dependentProperty = async (
        templateValue: string,
        formValues:Record<string, unknown>,
        fieldName: string,
        placeholder: string
    ): Promise<void> => {
        const currentValue: any = get(formValues, fieldName);
        let placeholderValue: any = get(formValues, placeholder);

        if (!placeholderValue || typeof placeholderValue !== "string") {
            placeholderValue = getPlaceholderValues(placeholder);
        }

        if (placeholder) {
            if (currentValue && typeof currentValue === "string" && currentValue.includes(`\${${placeholder}}`)) {
                set(formValues, fieldName, currentValue?.replace(`\${${placeholder}}`, placeholderValue));
            } else if (templateValue && typeof templateValue === "string") {
                set(formValues, fieldName, templateValue?.replace(`\${${placeholder}}`, placeholderValue));
            }
        }
    };

    return { dependentProperty };
};

export default useDependentProperty;
