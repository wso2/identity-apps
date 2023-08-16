/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
import { IdentityProviderTemplateInterface } from "../../../../../features/identity-providers/models";

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
        const idpNameValidation = (value): string => {

            let nameExist: boolean = false;

            if (idpList?.count > 0) {
                idpList?.identityProviders.map((idp) => {
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
                errors.name = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
            }
            if (!values.clientId) {
                errors.clientId = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
            }
            if (!values.clientSecret) {
                errors.clientSecret = t("console:develop.features.authenticationProvider.forms.common" +
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
                triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                triggerPrevious={ (previousFunction) => triggerPrevious(previousFunction) }
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
                            t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.label")
                        }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.placeholder")
                        }
                        required={ true }
                        validation={ (value) => idpNameValidation(value) }
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
