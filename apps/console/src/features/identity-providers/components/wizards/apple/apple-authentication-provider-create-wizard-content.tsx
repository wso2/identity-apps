/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AppleAuthenticationProviderCreateWizardFormErrorValidationsInterface,
    AppleAuthenticationProviderCreateWizardFormValuesInterface
} from "./apple-authentication-provider-create-wizard";
import { getIdentityProviderList } from "../../../api";
import { IdentityProviderManagementConstants } from "../../../constants";
import { IdentityProviderListResponseInterface, IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

/**
 * Proptypes for the Apple Authentication Provider create wizard content.
 */
interface AppleAuthenticationProviderCreateWizardContentPropsInterface extends IdentifiableComponentInterface {

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
    onSubmit: (values: AppleAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

const FORM_ID: string = "apple-authenticator-wizard-form";

/**
 * Apple Authentication Provider create wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AppleAuthenticationProviderCreateWizardContent: FunctionComponent<
    AppleAuthenticationProviderCreateWizardContentPropsInterface
> = (
    props: AppleAuthenticationProviderCreateWizardContentPropsInterface
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

    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(undefined);

    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {

        getIDPlist();
    }, []);

    /**
     * Get Idp List.
     */
    const getIDPlist = (): void => {

        setIdPListRequestLoading(true);

        getIdentityProviderList(null, null, null)
            .then((response: IdentityProviderListResponseInterface) => {
                setIdPList(response);
            })
            .catch((error: any) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    /**
     * Check whether IDP name is already exist or not.
     *
     * @param value - IDP Name.
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value: string): string => {

        let nameExist: boolean = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.map((idp: Record<string, unknown>) => {
                if (idp?.name === value) {
                    nameExist = true;
                }
            });
        }
        if (nameExist) {
            return t("console:develop.features.authenticationProvider.forms.generalDetails.name." +
                "validations.duplicate");
        }
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: AppleAuthenticationProviderCreateWizardFormValuesInterface):
        AppleAuthenticationProviderCreateWizardFormErrorValidationsInterface => {

        const errors: AppleAuthenticationProviderCreateWizardFormErrorValidationsInterface = {
            clientId: undefined,
            keyId: undefined,
            name: undefined,
            privateKey: undefined,
            teamId: undefined
        };

        if (!values.name) {
            errors.name = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.clientId) {
            errors.clientId = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.teamId) {
            errors.teamId = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.keyId) {
            errors.keyId = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.privateKey) {
            errors.privateKey = t("console:develop.features.authenticationProvider.forms.common" +
                ".requiredErrorMessage");
        }

        return errors;
    };

    return (
        (isIdPListRequestLoading !== undefined && isIdPListRequestLoading === false) && (
            <Wizard
                id={ FORM_ID }
                initialValues={ { name: template?.idp?.name } }
                onSubmit={
                    (values: AppleAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                }
                triggerSubmit={ (submitFunction: () => void) => triggerSubmission(submitFunction) }
                triggerPrevious={ (previousFunction: () => void) => triggerPrevious(previousFunction) }
                changePage={ (step: number) => changePageNumber(step) }
                setTotalPage={ (step: number) => setTotalPage(step) }
                data-testid={ componentId }
            >
                <WizardPage validate={ validateForm }>
                    <Field.Input
                        ariaLabel="Apple IDP Name"
                        inputType="name"
                        name="name"
                        label={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.label") }
                        placeholder={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.placeholder") }
                        required={ true }
                        validation={ (value: string) => idpNameValidation(value) }
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
                        ariaLabel="Apple Client ID"
                        inputType="client_id"
                        name="clientId"
                        label={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.clientId.label")
                        }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.clientId.placeholder")
                        }
                        required={ true }
                        message={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.clientId.validations.required")
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
                        data-testid={ `${ componentId }-idp-client-id` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="Apple Team ID"
                        inputType="name"
                        name="teamId"
                        label={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.teamId.label")
                        }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.teamId.placeholder")
                        }
                        required={ true }
                        message={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.teamId.validations.required")
                        }
                        type="text"
                        autoComplete={ "" + Math.random() }
                        maxLength={
                            IdentityProviderManagementConstants
                                .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.TEAM_ID_MAX_LENGTH as number
                        }
                        minLength={
                            IdentityProviderManagementConstants
                                .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.TEAM_ID_MIN_LENGTH as number
                        }
                        data-testid={ `${ componentId }-idp-team-id` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="Apple Key ID"
                        inputType="name"
                        name="keyId"
                        label={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.keyId.label")
                        }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.keyId.placeholder")
                        }
                        required={ true }
                        message={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.keyId.validations.required")
                        }
                        type="text"
                        autoComplete={ "" + Math.random() }
                        maxLength={
                            IdentityProviderManagementConstants
                                .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.KEY_ID_MAX_LENGTH as number
                        }
                        minLength={
                            IdentityProviderManagementConstants
                                .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.KEY_ID_MIN_LENGTH as number
                        }
                        data-testid={ `${ componentId }-idp-key-id` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="Apple Private Key"
                        inputType="password"
                        name="privateKey"
                        label={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.privateKey.label")
                        }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.privateKey.placeholder")
                        }
                        required={ true }
                        message={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.apple.privateKey.validations.required")
                        }
                        type="password"
                        autoComplete={ "" + Math.random() }
                        maxLength={
                            IdentityProviderManagementConstants
                                .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                .PRIVATE_KEY_MAX_LENGTH as number
                        }
                        minLength={
                            IdentityProviderManagementConstants
                                .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                .PRIVATE_KEY_MIN_LENGTH as number
                        }
                        data-testid={ `${ componentId }-idp-private-key` }
                        width={ 13 }
                    />
                </WizardPage>
            </Wizard>
        )
    );
};

/**
 * Default props for the Apple Authentication Provider Create Wizard Page Component.
 */
AppleAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-componentid": "apple-idp-create-wizard-content"
};
