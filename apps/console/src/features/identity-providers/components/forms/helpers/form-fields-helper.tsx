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

import {
    Field,
    FormValue,
    Validation
} from "@wso2is/forms";
import { I18n } from "@wso2is/i18n";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement } from "react";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

export const getConfidentialField = (eachProp: CommonPluggableComponentPropertyInterface,
                                     propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                                     disable: boolean,
                                     testId?: string): ReactElement => {
    return (
        <>
            <Field
                showPassword="Show Secret"
                hidePassword="Hide Secret"
                label={ propertyMetadata?.displayName }
                name={ propertyMetadata?.key }
                placeholder={ propertyMetadata?.defaultValue }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                value={ eachProp?.value }
                type="password"
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

export const getCheckboxField = (eachProp: CommonPluggableComponentPropertyInterface,
                                 propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                                 disable: boolean,
                                 testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                key={ propertyMetadata?.key }
                type="checkbox"
                required={ false }
                value={ (eachProp?.value == "true") ? [eachProp?.key] : [] }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                children={
                    [
                        {
                            label: propertyMetadata?.displayName,
                            value: eachProp ? eachProp.key : propertyMetadata?.key
                        }
                    ]
                }
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

export const getCheckboxFieldWithListener = (eachProp: CommonPluggableComponentPropertyInterface,
                                             propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                                             listen: (key: string, values: Map<string, FormValue>) => void,
                                             disable: boolean,
                                             testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                key={ propertyMetadata?.key }
                type="checkbox"
                required={ propertyMetadata?.isMandatory }
                value={ eachProp?.value ? [eachProp?.key] : [] }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                children={
                    [
                        {
                            label: propertyMetadata?.displayName,
                            value: eachProp ? eachProp.key : propertyMetadata?.key
                        }
                    ]
                }
                listen={ (values: Map<string, FormValue>) => {
                    listen(propertyMetadata.key, values);
                } }
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

export const getTextField = (eachProp: CommonPluggableComponentPropertyInterface,
                             propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                             disable: boolean,
                             testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                placeholder={ propertyMetadata?.defaultValue }
                type="text"
                value={ eachProp?.value }
                key={ eachProp?.key }
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
                validation={ (value: string, validation: Validation) => {
                    if (propertyMetadata?.regex && !RegExp(propertyMetadata.regex).test(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(I18n.instance.t("console:manage.features.users.forms." +
                            "validation.formatError", {
                            field: propertyMetadata?.displayName
                        }));
                    }
                } }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

export const getURLField = (eachProp: CommonPluggableComponentPropertyInterface,
                            propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                            disable: boolean,
                            testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                placeholder={ propertyMetadata?.defaultValue }
                validation={ (value, validation) => {
                    if (!FormValidation.url(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            I18n.instance.t("console:develop.features.idp.forms.common.invalidURLErrorMessage"));
                    }
                } }
                type="text"
                value={ eachProp?.value }
                key={ propertyMetadata?.key }
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

export const getQueryParamsField = (eachProp: CommonPluggableComponentPropertyInterface,
                                    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                                    disable: boolean,
                                    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                validation={ (value, validation) => {
                    if (!FormValidation.url("https://www.sample.com?" + value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            I18n.instance.t("console:develop.features.idp.forms.common.invalidQueryParamErrorMessage"));
                    }
                } }
                type="queryParams"
                value={ eachProp?.value }
                key={ propertyMetadata?.key }
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

export const getDropDownField = (eachProp: CommonPluggableComponentPropertyInterface,
                                 propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                                 disable: boolean,
                                 testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ eachProp?.key || propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.idp.forms.common." + 
                    "requiredErrorMessage") }
                type="dropdown"
                value={ eachProp?.value || propertyMetadata?.key }
                key={ eachProp?.key || propertyMetadata?.key }
                children={ getDropDownChildren(eachProp?.key, propertyMetadata?.options) }
                disabled={ disable }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ disable }>{ propertyMetadata?.description }</Hint>
            )}
        </>
    );
};

const getDropDownChildren = (key: string, options: string[]) => {
    return options.map((option) => {
        return ({
            key: key,
            text: option,
            value: option
        });
    });
};

/**
 * Each field type.
 */
export enum FieldType {
    CHECKBOX = "CheckBox",
    TEXT = "Text",
    CONFIDENTIAL = "Confidential",
    URL = "URL",
    QUERY_PARAMS = "QueryParameters",
    DROP_DOWN = "DropDown"
}

/**
 * commonly used constants.
 */
export enum CommonConstants {
    BOOLEAN = "BOOLEAN",
    FIELD_COMPONENT_KEYWORD_URL = "URL",
    FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER = "QUERYPARAM"
}

/**
 * Get interpreted field type for given property metada.
 *
 * @param propertyMetadata Property metadata of type {@link CommonPluggableComponentMetaPropertyInterface}.
 */
export const getFieldType = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): FieldType => {

    if (propertyMetadata?.type?.toUpperCase() === CommonConstants.BOOLEAN) {
        return FieldType.CHECKBOX;
    } else if (propertyMetadata?.isConfidential) {
        return FieldType.CONFIDENTIAL;
    } else if (propertyMetadata?.key.toUpperCase().includes(CommonConstants.FIELD_COMPONENT_KEYWORD_URL)) {
        // todo Need proper backend support to identity URL fields.
        return FieldType.URL;
    } else if (propertyMetadata?.key.toUpperCase().includes(
        CommonConstants.FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER)) {
        // todo Need proper backend support to identity Query parameter fields.
        return FieldType.QUERY_PARAMS;
    } else if (propertyMetadata?.options?.length > 0) {
        return FieldType.DROP_DOWN;
    }
    return FieldType.TEXT;
};

/**
 * Get corresponding {@link Field} component for the provided property.
 *
 * @param property Property of type {@link CommonPluggableComponentPropertyInterface}.
 * @param propertyMetadata Property metadata of type.
 * @param disable Disables the form field.
 * @param testId Test ID for the form field.
 * @param listen Listener method for the on change events of a checkbox field
 * @return Corresponding property field.
 */
export const getPropertyField = (property: CommonPluggableComponentPropertyInterface,
                                 propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
                                 disable?: boolean,
                                 listen?: (key: string, values: Map<string, FormValue>) => void,
                                 testId?: string):
    ReactElement => {

    switch (getFieldType(propertyMetadata)) {
        case FieldType.CHECKBOX : {
            if (listen) {
                return getCheckboxFieldWithListener(property, propertyMetadata, listen, disable, testId);
            }
            return getCheckboxField(property, propertyMetadata, disable, testId);
        }
        case FieldType.CONFIDENTIAL : {
            return getConfidentialField(property, propertyMetadata, disable, testId);
        }
        case FieldType.URL : {
            return getURLField(property, propertyMetadata, disable, testId);
        }
        case FieldType.QUERY_PARAMS : {
            return getQueryParamsField(property, propertyMetadata, disable, testId);
        }
        case FieldType.DROP_DOWN : {
            return getDropDownField(property, propertyMetadata, disable, testId);
        }
        default: {
            return getTextField(property, propertyMetadata, disable, testId);
        }
    }
};
