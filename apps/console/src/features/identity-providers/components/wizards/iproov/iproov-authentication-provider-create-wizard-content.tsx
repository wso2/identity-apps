/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Field, Wizard, WizardPage } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IproovAuthenticationProviderCreateWizardFormValuesInterface } from "./iproov-authentication-provider-create-wizard";
import { useIdentityProviderList } from "../../../api";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { IdentityProviderManagementConstants } from "../../../constants";
import { IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

/**
 * Proptypes for the IproovAuthenticationWizardFrom.
 */
interface IproovAuthenticationProviderCreateWizardContentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Trigger form submit.
     * @param submitFunctionCallback - Callback.
     */
    triggerSubmission: (submitFunctionCallback: () => void) => void;
    /**
     * Trigger previous page.
     * @param previousFunctionCb - Callback.
     */
    triggerPrevious: (previousFunctionCb: () => void) => void;
    /**
     * Callback to change the wizard page,
     * @param pageNo - Page Number.
     */
    changePageNumber: (pageNo: number) => void;
    /**
     * IDP template.
     */
    template: IdentityProviderTemplateInterface;
    /**
     * Total wizard page count.
     * @param pageCount - Page number.
     */
    setTotalPage: (pageCount: number) => void;
    /**
     * Callback to be triggered for form submit.
     * @param values - Form values.
     */
    onSubmit: (values: IproovAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

const FORM_ID: string = "iproov-authenticator-wizard-form";

/**
 * Iproov Authentication Provider Create Wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const IproovAuthenticationProviderCreateWizardContent: FunctionComponent<
    IproovAuthenticationProviderCreateWizardContentPropsInterface
> = (
    props: IproovAuthenticationProviderCreateWizardContentPropsInterface
): ReactElement => {

    const {
        triggerSubmission,
        triggerPrevious,
        changePageNumber,
        template,
        setTotalPage,
        onSubmit,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ isIdPListRequestLoading ] = useState<boolean>(undefined);

    const {
        data: idpList,
        isLoading: isIdPListFetchRequestLoading,
        error: idpListFetchRequestError
    } = useIdentityProviderList();

    /**
     * Handles the IdP list fetch request error.
     */
    useEffect(() => {
        if (!idpListFetchRequestError) {
            return;
        }

        handleGetIDPListCallError(idpListFetchRequestError);
    }, [ idpListFetchRequestError ]);

    /**
     * Check whether IDP name is already exist or not.
     *
     * @param value - IDP name.
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value: string): string => {

        let nameExist: boolean = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.some((idp: IdentityProviderTemplateInterface) => {
                if (idp?.name === value) {
                    nameExist = true;
                }
            });
        }
        if (nameExist) {
            return t("console:develop.features." +
                "authenticationProvider.forms.generalDetails.name." +
                "validations.duplicate");
        }
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: IproovAuthenticationProviderCreateWizardFormValuesInterface):
        IproovAuthenticationProviderCreateWizardFormValuesInterface => {

        const errors: IproovAuthenticationProviderCreateWizardFormValuesInterface = {
            apiKey: undefined,
            apiSecret: undefined,
            baseUrl: undefined,
            enableProgressiveEnrollment: undefined,
            oauthPassword: undefined,
            oauthUsername: undefined,
            name: undefined
        };

        if (!values.name) {
            errors.name = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.apiSecret) {
            errors.apiSecret = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.apiKey) {
            errors.apiKey = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.enableProgressiveEnrollment) {
            errors.enableProgressiveEnrollment = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.oauthUsername) {
            errors.oauthUsername = t("console:develop.features.authenticationProvider.forms.common" +
                        ".requiredErrorMessage");
        }
        if (!values.oauthPassword) {
            errors.oauthPassword = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.baseUrl) {
            errors.baseUrl = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }

        return errors;
    };

    return (
        (isIdPListRequestLoading !== undefined && isIdPListRequestLoading === false)
            ? (
                <Wizard
                    id={ FORM_ID }
                    initialValues={ { name: template?.idp?.name } }
                    onSubmit={
                        (values: IproovAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                    }
                    triggerSubmit={ (submitFunction: () => void) => triggerSubmission(submitFunction) }
                    triggerPrevious={ (previousFunction: () => void) => triggerPrevious(previousFunction) }
                    changePage={ (step: number) => changePageNumber(step) }
                    setTotalPage={ (step: number) => setTotalPage(step) }
                    data-testid={ componentId }
                >
                    <WizardPage validate={ validateForm }>
                        <Field.Input
                            ariaLabel="Iproov IDP Name"
                            inputType="name"
                            name="name"
                            label={
                                t("console:develop.features.authenticationProvider.forms." +
                                    "generalDetails.name.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms." +
                                    "generalDetails.name.placeholder")
                            }
                            required={ true }
                            validation={ (value: any) => idpNameValidation(value) }
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.IDP_NAME_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.IDP_NAME_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-name` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Iproov API Key"
                            inputType="client_id"
                            name="apiKey"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.apiKey.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.apiKey.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.apiKey.validations.required")
                            }
                            type="text"
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-api-key` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Iproov API secret"
                            inputType="password"
                            name="apiSecret"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.apiSecret.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.apiSecret.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.apiSecret.validations.required")
                            }
                            type="text"
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-api-secret` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Iproov Oauth Username"
                            inputType="client_id"
                            name="oauthUsername"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.oauthUsername.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.oauthUsername.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.oauthUsername.validations.required")
                            }
                            type="text"
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-oauth-username` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Iproov Oauth Password"
                            inputType="password"
                            name="oauthPassword"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.oauthPassword.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.oauthPassword.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.oauthPassword.validations.required")
                            }
                            type="text"
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-oauth-password` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Iproov Base URL"
                            inputType="url"
                            name="baseUrl"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.baseUrl.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.baseUrl.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.iproov.baseUrl.validations.required")
                            }
                            type="text"
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-base-url` }
                            width={ 13 }
                        />
                    </WizardPage>
                </Wizard>
            )
            : null
    );
};

/**
 * Default props for the iproov Authentication Provider Create Wizard Page Component.
 */
IproovAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-componentid": "iproov-idp-create-wizard-page"
};
