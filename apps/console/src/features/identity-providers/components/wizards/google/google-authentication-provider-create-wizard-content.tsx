/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Wizard, WizardPage } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIdentityProviderList } from "../../../api";
import { IdentityProviderManagementConstants } from "../../../constants";
import { IdentityProviderListResponseInterface, IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

/**
 * Proptypes for the GoogleAuthenticationWizardFrom.
 */
interface GitHubAuthenticationProviderCreateWizardContentPropsInterface extends TestableComponentInterface {
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
    onSubmit: (values: GoogleAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

/**
 * Proptypes for the Google Authentication Wizard Form values.
 */
export interface GoogleAuthenticationProviderCreateWizardFormValuesInterface {
    /**
     * GitHub Authenticator Client Secret.
     */
    clientSecret: string;
    /**
     * Callback URL.
     */
    callbackUrl: string;
    /**
     * GitHub Authenticator Client ID.
     */
    clientId: string;
    /**
     * GitHub Authenticator name.
     */
    name: string;
}

const FORM_ID: string = "google-authenticator-wizard-form";

/**
 * GitHub Authentication Provider Create Wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GoogleAuthenticationProviderCreateWizardContent: FunctionComponent<
    GitHubAuthenticationProviderCreateWizardContentPropsInterface
> = (
    props: GitHubAuthenticationProviderCreateWizardContentPropsInterface
): ReactElement => {

    const {
        triggerSubmission,
        triggerPrevious,
        changePageNumber,
        template,
        setTotalPage,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(undefined);

    const { t } = useTranslation();

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
            .then((response) => {
                setIdPList(response);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    /**
     * Check whether IDP name is already exist or not.
     *
     * @param value - IDP name - IDP Name.
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value: string): string => {

        let nameExist = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.map((idp) => {
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

    return (
        (isIdPListRequestLoading !== undefined && isIdPListRequestLoading === false)
            ? (
                <Wizard
                    id={ FORM_ID }
                    initialValues={ { name: template?.idp?.name } }
                    onSubmit={
                        (values: GoogleAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                    }
                    triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                    triggerPrevious={ (previousFunction) => triggerPrevious(previousFunction) }
                    changePage={ (step: number) => changePageNumber(step) }
                    setTotalPage={ (step: number) => setTotalPage(step) }
                    data-testid={ testId }
                >
                    <WizardPage
                        validate={ (values): any => {
                            const errors: any = {};

                            if (!values.name) {
                                errors.name = t("console:develop.features.authenticationProvider.forms.common" +
                                    ".requiredErrorMessage");
                            }
                            if (!values.clientId) {
                                errors.clientId = t("console:develop.features.authenticationProvider.forms.common" +
                                    ".requiredErrorMessage");
                            }
                            if (!values.clientSecret) {
                                errors.clientSecret = t("console:develop.features.authenticationProvider.forms" +
                                    ".common.requiredErrorMessage");
                            }

                            return errors;
                        } }
                    >
                        <Field.Input
                            ariaLabel="Google IDP Name"
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
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.IDP_NAME_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.IDP_NAME_MIN_LENGTH as number
                            }
                            validation={ (value: string) => idpNameValidation(value) }
                            data-testid={ `${ testId }-idp-name` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Google Client ID"
                            inputType="client_id"
                            name="clientId"
                            label={
                                t("console:develop.features.authenticationProvider.templates.google" +
                                    ".wizardHelp.clientId.heading")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.google.clientId.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider." +
                                    "forms.common.requiredErrorMessage")
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
                            data-testid={ `${ testId }-idp-client-id` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Google Client Secret"
                            inputType="password"
                            className="addon-field-wrapper"
                            name="clientSecret"
                            label={
                                t("console:develop.features.authenticationProvider.templates.google" +
                                    ".wizardHelp.clientSecret.heading")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.google.clientSecret.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider." +
                                    "forms.common.requiredErrorMessage")
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
                            data-testid={ `${ testId }-idp-client-secret` }
                            width={ 13 }
                        />
                    </WizardPage>
                </Wizard>
            )
            : null
    );
};

/**
 * Default props for the google creation wizard.
 */
GoogleAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-testid": "idp-edit-idp-create-wizard"
};
