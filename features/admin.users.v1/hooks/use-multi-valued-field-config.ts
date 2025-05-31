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

import { ProfileConstants } from "@wso2is/core/constants";
import { ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import { useMemo } from "react";
import {
    EMAIL_ADDRESSES_ATTRIBUTE,
    EMAIL_ATTRIBUTE,
    MOBILE_ATTRIBUTE,
    MOBILE_NUMBERS_ATTRIBUTE,
    VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
    VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
} from "../constants/user-management-constants";
import { getVerificationPendingAttributeValue } from "../utils/user-management-utils";

export const useMultiValuedFieldConfig = (
    user: ProfileInfoInterface,
    schema: ProfileSchemaInterface,
    profileInfo: Map<string, string>,
    primaryValues: Record<string, string>,
    profileSchema: ProfileSchemaInterface[],
    multiValuedAttributeValues: Record<string, string[]>,
    configSettings: Record<string, any>
) => {
    return useMemo(() => {
        let attributeValueList: string[] = multiValuedAttributeValues[schema.name] ?? [];
        let verifiedAttributeValueList: string[] = [];
        let primaryAttributeValue: string = primaryValues[schema.name];
        let fetchedPrimaryAttributeValue: string | undefined = profileInfo?.get(schema.name);
        let verificationEnabled: boolean = false;
        let verificationPendingValue: string = "";
        let primaryAttributeSchema: ProfileSchemaInterface | undefined =
            profileSchema.find((s: ProfileSchemaInterface) => s.name === schema.name);
        let maxAllowedLimit: number = ProfileConstants.MAX_MULTI_VALUES_ALLOWED;

        const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
        const resolvedMultiValueAttributeRequiredValue: boolean
            = schema?.profiles?.console?.required ?? schema.required;
        const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;
        const resolvedPrimarySchemaRequiredValue: boolean
            = primaryAttributeSchema?.profiles?.console?.required ?? primaryAttributeSchema?.required;
        const resolvedRequiredValue: boolean = (resolvedMultiValueAttributeRequiredValue
            || resolvedPrimarySchemaRequiredValue);
        const showAttributes: boolean = isEmpty(schema.canonicalValues) && attributeValueList.length >= 1;

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            attributeValueList = multiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE] ?? [];
            verifiedAttributeValueList =
                profileInfo?.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = primaryValues[EMAIL_ATTRIBUTE];
            fetchedPrimaryAttributeValue = profileInfo?.get(EMAIL_ATTRIBUTE);
            verificationEnabled = configSettings?.isEmailVerificationEnabled === "true";
            primaryAttributeSchema = profileSchema.find((s: ProfileSchemaInterface) => s.name === EMAIL_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED;
            verificationPendingValue = getVerificationPendingAttributeValue(EMAIL_ADDRESSES_ATTRIBUTE, user);
        }

        if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            attributeValueList = multiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE] ?? [];
            verifiedAttributeValueList =
                profileInfo?.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = primaryValues[MOBILE_ATTRIBUTE];
            fetchedPrimaryAttributeValue = profileInfo?.get(MOBILE_ATTRIBUTE);
            verificationEnabled = configSettings?.isMobileVerificationEnabled === "true";
            primaryAttributeSchema = profileSchema.find((s: ProfileSchemaInterface) => s.name === MOBILE_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_MOBILE_NUMBERS_ALLOWED;
            verificationPendingValue = getVerificationPendingAttributeValue(MOBILE_NUMBERS_ATTRIBUTE, user);
        }

        return {
            fetchedPrimaryAttributeValue,
            maxAllowedLimit,
            primaryAttributeSchema,
            primaryAttributeValue,
            resolvedMutabilityValue,
            resolvedPrimarySchemaRequiredValue,
            resolvedRequiredValue,
            sharedProfileValueResolvingMethod,
            showAttributes,
            verificationEnabled,
            verificationPendingValue,
            verifiedAttributeValueList
        };
    }, [
        user,
        schema,
        profileInfo,
        primaryValues,
        profileSchema,
        multiValuedAttributeValues,
        configSettings
    ]);
};
