/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { URLUtils } from "@wso2is/core/utils";
import {
    Field,
    FormValue,
    StrictRadioChild,
    Validation
} from "@wso2is/forms";
import { I18n } from "@wso2is/i18n";
import { CopyInputField, GenericIcon, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import { commonConfig } from "../../../../../extensions";
import {
    AuthenticatorSettingsFormModes,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

const AUTHORIZATION_REDIRECT_URL: string = "callbackUrl";

export const getConfidentialField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
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
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                value={ eachProp?.value }
                type="password"
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                validation={ (value: string, validation: Validation) => {
                    if (propertyMetadata?.maxLength && value.length > propertyMetadata.maxLength) {
                        validation.isValid = false;
                        validation.errorMessages.push(propertyMetadata.displayName + " cannot have more than " +
                            propertyMetadata.maxLength + " characters.");
                    }
                } }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getCheckboxField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                key={ propertyMetadata?.key }
                type="checkbox"
                required={ false }
                value={ (eachProp?.value == "true") ? [ eachProp?.key ] : [] }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                children={
                    [
                        {
                            label: propertyMetadata?.displayName,
                            value: eachProp ? eachProp.key : propertyMetadata?.key
                        }
                    ]
                }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getCheckboxFieldWithListener = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    listen: (key: string, values: Map<string, FormValue>) => void,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                key={ propertyMetadata?.key }
                type="checkbox"
                required={ propertyMetadata?.isMandatory }
                value={ eachProp?.value ? [ eachProp?.key ] : [] }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
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
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getRadioButtonField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                label={ propertyMetadata?.displayName }
                name={ propertyMetadata?.key }
                key={ propertyMetadata?.key }
                type="radio"
                required={ propertyMetadata?.isMandatory }
                default ={ propertyMetadata?.defaultValue }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                children={
                    propertyMetadata?.subProperties?.map(function(val): StrictRadioChild {
                        return {
                            label: val.displayName,
                            value: val.defaultValue
                        };
                    })
                }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getRadioButtonFieldWithListener = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    listen: (key: string, values: Map<string, FormValue>) => void,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                label={ propertyMetadata?.displayName }
                name={ propertyMetadata?.key }
                key={ propertyMetadata?.key }
                type="radio"
                required={ propertyMetadata?.isMandatory }
                value={ propertyMetadata?.defaultValue }
                default ={ propertyMetadata?.defaultValue }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                children={
                    propertyMetadata?.subProperties?.map(function(val): StrictRadioChild {
                        return {
                            label: val.displayName,
                            value: val.defaultValue
                        };
                    })
                }
                listen={ (values: Map<string, FormValue>) => {
                    listen(propertyMetadata?.key, values);
                } }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getTextField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                placeholder={ propertyMetadata?.defaultValue }
                type="text"
                value={ eachProp?.value }
                key={ eachProp?.key }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
                validation={ (value: string, validation: Validation) => {
                    if (propertyMetadata?.regex && !RegExp(propertyMetadata.regex).test(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(I18n.instance.t("console:manage.features.users.forms." +
                            "validation.formatError", {
                            field: propertyMetadata?.displayName
                        }));
                    }
                    if (propertyMetadata?.maxLength && value.length > propertyMetadata.maxLength) {
                        validation.isValid = false;
                        validation.errorMessages.push(propertyMetadata.displayName + " cannot have more than " +
                            propertyMetadata.maxLength + " characters.");
                    }
                } }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getURLField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms." +
                    "common.requiredErrorMessage") }
                placeholder={ propertyMetadata?.defaultValue }
                validation={ (value, validation) => {
                    if (!FormValidation.url(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                                "invalidURLErrorMessage"));
                    }
                    if (commonConfig?.blockLoopBackCalls && URLUtils.isLoopBackCall(value) &&
                        (
                            propertyMetadata?.key === "OAuth2AuthzEPUrl" ||
                            propertyMetadata?.key === "OAuth2TokenEPUrl" ||
                            propertyMetadata?.key === "UserInfoUrl"
                        ))
                    {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            I18n.instance.t("console:develop.features.idp.forms.common." +
                                "internetResolvableErrorMessage")
                        );
                    }
                } }
                type="text"
                value={ eachProp?.value }
                key={ propertyMetadata?.key }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getCopyInputField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <div className={ `field ${ propertyMetadata?.isMandatory ? "required" : "" }` }>
                <label>{ propertyMetadata?.displayName }</label>
            </div>
            <CopyInputField
                key={ propertyMetadata?.key }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
                value={ eachProp?.value }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getScopesField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {

    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                type="scopes"
                value={ eachProp?.value }
                key={ eachProp?.key }
                defaultValue={ propertyMetadata?.defaultValue }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
                validation={ (value: string, validation: Validation) => {
                    if (!FormValidation.scopes(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(I18n.instance.t("console:develop.features." +
                            "authenticationProvider.forms.common.invalidScopesErrorMessage"));
                    }
                    if (propertyMetadata?.maxLength && value.length > propertyMetadata.maxLength) {
                        validation.isValid = false;
                        validation.errorMessages.push(propertyMetadata.displayName + " cannot have more than " +
                            propertyMetadata.maxLength + " characters.");
                    }
                } }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getQueryParamsField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                validation={ (value, validation) => {
                    if (!FormValidation.url("https://www.sample.com?" + value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                                "invalidQueryParamErrorMessage"));
                    }
                } }
                type="queryParams"
                value={ eachProp?.value }
                key={ propertyMetadata?.key }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getTableField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <div className="field read-only">
                <div>
                    <div className="field">
                        <label>{ propertyMetadata?.displayName }</label>
                    </div>
                </div>
            </div>
            <Field
                hidden={ true }
                name={ propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider.forms.common." +
                    "requiredErrorMessage") }
                placeholder={ propertyMetadata?.defaultValue }
                type="text"
                value={ eachProp?.value }
                key={ eachProp?.key }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
                validation={ (value: string, validation: Validation) => {
                    if (propertyMetadata?.regex && !RegExp(propertyMetadata.regex).test(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(I18n.instance.t("console:manage.features.users.forms." +
                            "validation.formatError", {
                            field: propertyMetadata?.displayName
                        }));
                    }
                    if (propertyMetadata?.maxLength && value.length > propertyMetadata.maxLength) {
                        validation.isValid = false;
                        validation.errorMessages.push( propertyMetadata.displayName + " cannot have more than " +
                            propertyMetadata.maxLength + " characters.");
                    }
                } }
            />
            <Grid>
                { eachProp?.value.split(" ").map((scope,index) => (
                    <Grid.Row columns={ 3 } key={ index }>
                        <Grid.Column mobile={ 1 } tablet={ 1 } computer={ 1 }>
                            <GenericIcon
                                icon={ propertyMetadata.properties[scope].icon }
                                size="micro"
                                square
                                transparent
                                inline
                                className="left-icon"
                                verticalAlign="top"
                                spaced="left"
                            />
                        </Grid.Column>
                        <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }>
                            <div data-testid={ `${ testId }-authorize-label` } className="scope-name">
                                { scope }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 13 } tablet={ 13 } computer={ 13 }>
                            <div data-testid={ `${ testId }-authorize-label` } className="scope-name">
                                { propertyMetadata.properties[scope].description }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
                ) }
            </Grid>
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

export const getDropDownField = (eachProp: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    testId?: string): ReactElement => {
    return (
        <>
            <Field
                name={ eachProp?.key || propertyMetadata?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ I18n.instance.t("console:develop.features.authenticationProvider." +
                    "forms.common.requiredErrorMessage") }
                type="dropdown"
                value={ eachProp?.value || propertyMetadata?.key }
                key={ eachProp?.key || propertyMetadata?.key }
                children={ getDropDownChildren(eachProp?.key, propertyMetadata?.options) }
                disabled={ propertyMetadata?.isDisabled }
                readOnly={ propertyMetadata?.readOnly }
                data-testid={ `${ testId }-${ propertyMetadata?.key }` }
            />
            { propertyMetadata?.description && (
                <Hint disabled={ propertyMetadata?.isDisabled }>{ propertyMetadata?.description }</Hint>
            ) }
        </>
    );
};

const getDropDownChildren = (key: string, options: string[]) => {
    return options.map((option) => {
        return ({
            key: key,
            text: key === "RequestMethod" ? mapSAMLProtocolBindingToProperDisplayNames(option) : option,
            value: option
        });
    });
};

const mapSAMLProtocolBindingToProperDisplayNames = (value: string): string => {
    switch (value) {
        case "redirect":
            return "HTTP Redirect";
        case "post":
            return "HTTP Post";
        case "as_request":
            return "As Per Request";
        default:
            return value;
    }
};

/**
 * Each field type.
 */
export enum FieldType {
    CHECKBOX = "CheckBox",
    TEXT = "Text",
    TABLE = "Table",
    CONFIDENTIAL = "Confidential",
    URL = "URL",
    SCOPES = "SCOPES",
    QUERY_PARAMS = "QueryParameters",
    DROP_DOWN = "DropDown",
    RADIO = "Radio",
    COPY_INPUT = "CopyInput"
}

/**
 * commonly used constants.
 */
export enum CommonConstants {
    BOOLEAN = "BOOLEAN",
    FIELD_COMPONENT_KEYWORD_URL = "URL",
    FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER = "QUERYPARAM",
    FIELD_COMPONENT_SCOPES = "Scopes",
    QUERY_PARAMETERS_KEY = "commonAuthQueryParams",
    SCOPE_KEY = "scopes",
    RADIO = "RADIO"
}

/**
 * Get interpreted field type for given property metada.
 *
 * @param propertyMetadata - Property metadata of type {@link CommonPluggableComponentMetaPropertyInterface}.
 */
export const getFieldType = (
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    mode: AuthenticatorSettingsFormModes
): FieldType => {
    if (propertyMetadata?.type?.toUpperCase() === CommonConstants.BOOLEAN) {
        return FieldType.CHECKBOX;
    } else if (propertyMetadata?.isConfidential) {
        return FieldType.CONFIDENTIAL;
    } else if (propertyMetadata?.key === CommonConstants.SCOPE_KEY) {
        return FieldType.TABLE;
    }  else if (propertyMetadata?.key === CommonConstants.FIELD_COMPONENT_SCOPES) {
        return FieldType.SCOPES;
    } else if (propertyMetadata?.key.toUpperCase().includes(CommonConstants.FIELD_COMPONENT_KEYWORD_URL)) {
        if (propertyMetadata?.key === AUTHORIZATION_REDIRECT_URL && mode !== AuthenticatorSettingsFormModes.CREATE) {
            return  FieldType.COPY_INPUT;
        } else {
            // TODO: Need proper backend support to identity URL fields-https://github.com/wso2/product-is/issues/12501.
            return FieldType.URL;
        }
    } else if (propertyMetadata?.key.toUpperCase().includes(
        CommonConstants.FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER)) {
        // todo Need proper backend support to identity Query parameter fields.
        return FieldType.QUERY_PARAMS;
    } else if (propertyMetadata?.options?.length > 0) {
        return FieldType.DROP_DOWN;
    } else if (propertyMetadata.type?.toUpperCase() === CommonConstants.RADIO) {
        return FieldType.RADIO;
    }

    return FieldType.TEXT;
};

/**
 * Get corresponding {@link Field} component for the provided property.
 *
 * @param property - Property of type {@link CommonPluggableComponentPropertyInterface}.
 * @param propertyMetadata - Property metadata of type.
 * @param testId - Test ID for the form field.
 * @param listen - Listener method for the on change events of a checkbox field
 * @returns Corresponding property field.
 */
export const getPropertyField = (
    property: CommonPluggableComponentPropertyInterface,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    mode: AuthenticatorSettingsFormModes,
    listen?: (key: string, values: Map<string, FormValue>) => void,
    testId?: string
): ReactElement => {

    switch (getFieldType(propertyMetadata, mode)) {
        case FieldType.CHECKBOX : {
            if (listen) {
                return getCheckboxFieldWithListener(property, propertyMetadata, listen, testId);
            }

            return getCheckboxField(property, propertyMetadata, testId);
        }
        case FieldType.RADIO : {
            if (listen) {
                return getRadioButtonFieldWithListener(property, propertyMetadata, listen, testId);
            }

            return getRadioButtonField(property, propertyMetadata, testId);
        }
        case FieldType.CONFIDENTIAL : {
            return getConfidentialField(property, propertyMetadata, testId);
        }
        case FieldType.URL : {
            return getURLField(property, propertyMetadata, testId);
        }
        case FieldType.COPY_INPUT : {
            return getCopyInputField(property, propertyMetadata, testId);
        }
        case FieldType.SCOPES : {
            return getScopesField(property, propertyMetadata, testId);
        }
        case FieldType.QUERY_PARAMS : {
            return getQueryParamsField(property, propertyMetadata, testId);
        }
        case FieldType.DROP_DOWN : {
            return getDropDownField(property, propertyMetadata, testId);
        }
        case FieldType.TABLE:{
            return getTableField(property, propertyMetadata, testId);
        }
        default: {
            return getTextField(property, propertyMetadata, testId);
        }
    }
};
