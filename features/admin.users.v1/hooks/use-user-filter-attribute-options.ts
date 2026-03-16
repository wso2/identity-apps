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

import { ProfileSchemaInterface } from "@wso2is/core/models";
import { DropdownChild } from "@wso2is/forms";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { resolveUserSearchAttributes } from "../utils/user-management-utils";

/**
 * Hook that resolves the filter attribute options for user search dropdowns.
 *
 * @param profileSchemas - SCIM profile schemas.
 * @param includeSchemaAttributes - If `true`, appends profile-schema-derived attributes after the base options.
 *                                  Defaults to `true`.
 * @returns An array of {@link DropdownChild} filter attribute options.
 */
const useUserFilterAttributeOptions = (
    profileSchemas: ProfileSchemaInterface[],
    includeSchemaAttributes: boolean = true
): DropdownChild[] => {
    const { t } = useTranslation();

    const userSearchAttributes: DropdownChild[] = useMemo(
        (): DropdownChild[] => resolveUserSearchAttributes(profileSchemas),
        [ profileSchemas ]
    );

    return useMemo((): DropdownChild[] => {
        const options: DropdownChild[] = [
            {
                key: 0,
                text: t("users:advancedSearch.form.dropdown.filterAttributeOptions.username"),
                value: "userName"
            }
        ];

        if (includeSchemaAttributes) {
            options.push(
                {
                    key: "meta.created",
                    text: t("users:advancedSearch.form.dropdown.filterAttributeOptions.createdTime"),
                    value: "urn:ietf:params:scim:schemas:core:2.0:meta.created"
                },
                {
                    key: "meta.lastModified",
                    text: t("users:advancedSearch.form.dropdown.filterAttributeOptions.modifiedTime"),
                    value: "urn:ietf:params:scim:schemas:core:2.0:meta.lastModified"
                },
                {
                    key: "id",
                    text: t("users:advancedSearch.form.dropdown.filterAttributeOptions.userId"),
                    value: "urn:ietf:params:scim:schemas:core:2.0:id"
                }
            );

            const seen: Set<string> = new Set([
                ...options.map((option: DropdownChild) => option.value as string),
                // Exclude SCIM-format userName since plain "userName" is already included above.
                "urn:ietf:params:scim:schemas:core:2.0:User:userName"
            ]);

            return options.concat(
                userSearchAttributes.filter(
                    (option: DropdownChild) => !seen.has(option.value as string)
                )
            );
        }

        return options;
    }, [ t, userSearchAttributes, includeSchemaAttributes ]);
};

export default useUserFilterAttributeOptions;
