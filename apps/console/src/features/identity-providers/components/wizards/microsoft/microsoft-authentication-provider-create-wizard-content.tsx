/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {
    MicrosoftAuthenticationProviderCreateWizardFormErrorValidationsInterface,
    MicrosoftAuthenticationProviderCreateWizardFormValuesInterface
} from "./microsoft-authentication-provider-create-wizard";
import { getIdentityProviderList } from "../../../api";
import { IdentityProviderManagementConstants } from "../../../constants";
import { IdentityProviderListResponseInterface, IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

/**
 * Proptypes for the GoogleAuthenticationWizardFrom.
 */
interface MicrosoftAuthenticationProviderCreateWizardContentPropsInterface extends TestableComponentInterface {
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
    onSubmit: (values: MicrosoftAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

const FORM_ID: string = "microsoft-authenticator-wizard-form";

/**
 * Microsoft Authentication Provider Create Wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const MicrosoftAuthenticationProviderCreateWizardContent: FunctionComponent<
    MicrosoftAuthenticationProviderCreateWizardContentPropsInterface
> = (
    props: MicrosoftAuthenticationProviderCreateWizardContentPropsInterface
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
     * @param value - IDP name.
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value): string => {

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

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: MicrosoftAuthenticationProviderCreateWizardFormValuesInterface):
        MicrosoftAuthenticationProviderCreateWizardFormErrorValidationsInterface => {

        const errors: MicrosoftAuthenticationProviderCreateWizardFormErrorValidationsInterface = {
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

    return (
        (isIdPListRequestLoading !== undefined && isIdPListRequestLoading === false)
            ? (
                <Wizard
                    id={ FORM_ID }
                    initialValues={ { name: template?.idp?.name } }
                    onSubmit={
                        (values: MicrosoftAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                    }
                    triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                    triggerPrevious={ (previousFunction) => triggerPrevious(previousFunction) }
                    changePage={ (step: number) => changePageNumber(step) }
                    setTotalPage={ (step: number) => setTotalPage(step) }
                    data-testid={ testId }
                >
                    <WizardPage validate={ validateForm }>
                        <Field.Input
                            ariaLabel="Microsoft IDP Name"
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
                            data-testid={ `${ testId }-idp-name` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="Microsoft Client ID"
                            inputType="client_id"
                            name="clientId"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.microsoft.clientId.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.microsoft.clientId.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.microsoft.clientId.validations.required")
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
                            ariaLabel="Microsoft Client Secret"
                            inputType="password"
                            className="addon-field-wrapper"
                            name="clientSecret"
                            label={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.microsoft.clientSecret.label")
                            }
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.microsoft.clientSecret.placeholder")
                            }
                            required={ true }
                            message={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.microsoft.clientSecret.validations.required")
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
 * Default props for the Microsoft Authentication Provider Create Wizard Page Component.
 */
MicrosoftAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-testid": "microsoft-idp-create-wizard-page"
};
