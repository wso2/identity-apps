/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AuthenticatorProperty, FederatedAuthenticatorMetaPropertyInterface } from "../../../../models";
import { Field } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import React from "react";

export const getConfidentialField = (eachProp: AuthenticatorProperty,
                                     propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
    return (
        <Field
            showPassword="Show Secret"
            hidePassword="Hide Secret"
            label={ propertyMetadata?.displayName }
            name={ eachProp?.key }
            placeholder={ propertyMetadata?.description }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage={ "This is required" }
            type="password"
        />
    );
};

export const getCheckboxField = (eachProp: AuthenticatorProperty,
                                 propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
    return (
        <Field
            name={ eachProp?.key }
            label={ propertyMetadata?.displayName }
            type="checkbox"
            required={ propertyMetadata?.isMandatory }
            value={ eachProp?.value ? [eachProp?.key] : [] }
            requiredErrorMessage="This is required"
            children={
                [
                    {
                        label: propertyMetadata?.description,
                        value: eachProp?.key
                    }
                ]
            }
        />
    );
};

export const getTextField = (eachProp: AuthenticatorProperty,
                             propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
    return (
        <Field
            name={ eachProp?.key }
            label={ propertyMetadata?.displayName }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage="This is required"
            placeholder={ propertyMetadata?.description }
            type="text"
            value={ eachProp?.value }
            key={ eachProp?.key }
        />
    );
};

export const getURLField = (eachProp: AuthenticatorProperty,
                            propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
    return (
        <Field
            name={ eachProp?.key }
            label={ propertyMetadata?.displayName }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage="This is required"
            placeholder={ propertyMetadata?.description }
            validation={ (value, validation) => {
                if (!FormValidation.url(value)) {
                    validation.isValid = false;
                    validation.errorMessages.push("This is not a valid URL");
                }
            } }
            type="text"
            value={ eachProp?.value }
            key={ eachProp?.key }
        />
    );
};

export const getQueryParamsField = (eachProp: AuthenticatorProperty,
                            propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
    return (
        <Field
            name={ eachProp?.key }
            label={ propertyMetadata?.displayName }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage="This is required"
            validation={ (value, validation) => {
                if (!FormValidation.url("https://www.sample.com?" + value)) {
                    validation.isValid = false;
                    validation.errorMessages.push("These are not valid query parameters");
                }
            } }
            type="queryParams"
            value={ eachProp?.value }
            key={ eachProp?.key }
        />
    );
};
