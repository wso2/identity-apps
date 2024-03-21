/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Wizard, WizardPage } from "@wso2is/form";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    SIWEAuthenticationProviderCreateWizardFormErrorValidationsInterface,
    SIWEAuthenticationProviderCreateWizardFormValuesInterface
} from "./swe-authentication-provider-create-wizard";
import { useIdentityProviderList } from "../../../../../features/identity-providers/api";
import { handleGetIDPListCallError } from "../../../../../features/identity-providers/components/utils";
import { IdentityProviderManagementConstants } from "../../../../../features/identity-providers/constants";
import {
    IdentityProviderTemplateInterface,
    StrictIdentityProviderInterface
} from "../../../../../features/identity-providers/models";

/**
 * Prop-types for the SIWE Authentication Wizard From.
 */
interface SIWEAuthenticationProviderCreateWizardContentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Trigger form submit.
     * @param submitFunctionCb - Callback.
     */
    triggerSubmission: (submitFunctionCb: () => void) => void;
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
    onSubmit: (values: SIWEAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

const FORM_ID: string = "siwe-authenticator-create-wizard-form";

/**
 * SIWE Authentication Provider Create Wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const SIWEAuthenticationProviderCreateWizardContent: FunctionComponent<
    SIWEAuthenticationProviderCreateWizardContentPropsInterface
    > = (
        props: SIWEAuthenticationProviderCreateWizardContentPropsInterface
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

        const {
            data: idpList,
            isLoading: isIdPListFetchRequestLoading,
            error: idpListFetchRequestError
        } = useIdentityProviderList(null, null, null);

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
         * @param value - IDP name - IDP Name.
         * @returns error msg if name is already taken.
         */
        const idpNameValidation = (value: any): string => {

            let nameExist: boolean = false;

            if (idpList?.count > 0) {
                idpList?.identityProviders.map((idp: StrictIdentityProviderInterface) => {
                    if (idp?.name === value) {
                        nameExist = true;

                    }
                });
            }

            if (!nameExist) {
                return null;
            }

            return t(
                "console:develop.features." +
                "authenticationProvider.forms.generalDetails.name." +
                "validations.duplicate"
            );
        };

        /**
         * Validates the Form.
         *
         * @param values - Form Values.
         * @returns Form validation.
         */
        const validateForm = (values: SIWEAuthenticationProviderCreateWizardFormValuesInterface):
        SIWEAuthenticationProviderCreateWizardFormErrorValidationsInterface => {

            const errors: SIWEAuthenticationProviderCreateWizardFormErrorValidationsInterface = {
                clientId: undefined,
                clientSecret: undefined,
                name: undefined
            };

            if (!values.name) {
                errors.name = t("authenticationProvider:forms.common" +
                ".requiredErrorMessage");
            }
            if (!values.clientId) {
                errors.clientId = t("authenticationProvider:forms.common" +
                ".requiredErrorMessage");
            }
            if (!values.clientSecret) {
                errors.clientSecret = t("authenticationProvider:forms.common" +
                ".requiredErrorMessage");
            }

            return errors;
        };

        if (isIdPListFetchRequestLoading) {
            return <ContentLoader dimmer={ false } />;
        }

        return (
            <Wizard
                id={ FORM_ID }
                initialValues={ {
                    name: template?.idp?.name
                } }
                onSubmit={
                    (values: SIWEAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                }
                triggerSubmit={ (submitFunction: any) => triggerSubmission(submitFunction) }
                triggerPrevious={ (previousFunction: any) => triggerPrevious(previousFunction) }
                changePage={ (step: number) => changePageNumber(step) }
                setTotalPage={ (step: number) => setTotalPage(step) }
                data-componentid={ componentId }
            >
                <WizardPage validate={ validateForm }>
                    <Field.Input
                        ariaLabel="SIWE IDP Name"
                        inputType="name"
                        name="name"
                        label={
                            t("authenticationProvider:forms." +
                            "generalDetails.name.label")
                        }
                        placeholder={
                            t("authenticationProvider:forms." +
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
                        data-componentid={ `${ componentId }-idp-name` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="SIWE Client ID"
                        inputType="client_id"
                        name="clientId"
                        label={
                            t("extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientId.label")
                        }
                        placeholder={
                            t("extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientId.placeholder")
                        }
                        required={ true }
                        message={
                            t("extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientId.validations.required")
                        }
                        type="text"
                        autoComplete={ "" + Math.random() }
                        maxLength={
                            IdentityProviderManagementConstants
                                .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MAX_LENGTH as number
                        }
                        minLength={
                            IdentityProviderManagementConstants
                                .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                        }
                        data-componentid={ `${ componentId }-idp-client-id` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="SIWE Client Secret"
                        inputType="password"
                        className="addon-field-wrapper"
                        name="clientSecret"
                        label={
                            t("extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientSecret.label")
                        }
                        placeholder={
                            t("extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientSecret.placeholder")
                        }
                        required={ true }
                        message={
                            t("extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientSecret.validations.required")
                        }
                        type="password"
                        hidePassword={ t("common:hide") }
                        showPassword={ t("common:show") }
                        autoComplete={ "" + Math.random() }
                        maxLength={
                            IdentityProviderManagementConstants
                                .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MAX_LENGTH as number
                        }
                        minLength={
                            IdentityProviderManagementConstants
                                .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MIN_LENGTH as number
                        }
                        data-componentid={ `${ componentId }-idp-client-secret` }
                        width={ 13 }
                    />
                </WizardPage>
            </Wizard>
        );
    };

/**
 * Default props for the SIWE Authentication Provider Create Wizard Page Component.
 */
SIWEAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-componentid": "swe-idp-create-wizard-content"
};
