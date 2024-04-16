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
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    HyprAuthenticationProviderCreateWizardFormValuesInterface
} from "./hypr-authentication-provider-create-wizard";
import { getIdentityProviderList } from "../../../api";
import { IdentityProviderManagementConstants } from "../../../constants";
import { IdentityProviderListResponseInterface, IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

/**
 * Proptypes for the HyprAuthenticationWizardFrom.
 */
interface HyprAuthenticationProviderCreateWizardContentPropsInterface extends IdentifiableComponentInterface {
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
    onSubmit: (values: HyprAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

const FORM_ID: string = "hypr-authenticator-wizard-form";

/**
 * Hypr Authentication Provider Create Wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const HyprAuthenticationProviderCreateWizardContent: FunctionComponent<
    HyprAuthenticationProviderCreateWizardContentPropsInterface
> = (
    props: HyprAuthenticationProviderCreateWizardContentPropsInterface
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
            .catch((error: AxiosError) => {
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
    const idpNameValidation = (value: string): string => {

        let nameExist: boolean = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.map((idp: IdentityProviderTemplateInterface) => {
                if (idp?.name === value) {
                    nameExist = true;
                }
            });
        }
        if (nameExist) {
            return t("authenticationProvider:forms.generalDetails.name." +
                "validations.duplicate");
        }
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: HyprAuthenticationProviderCreateWizardFormValuesInterface):
        HyprAuthenticationProviderCreateWizardFormValuesInterface => {

        const errors: HyprAuthenticationProviderCreateWizardFormValuesInterface = {
            apiToken: undefined,
            appId: undefined,
            baseUrl: undefined,
            name: undefined
        };

        if (!values.name) {
            errors.name = t("authenticationProvider:forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.appId) {
            errors.appId = t("authenticationProvider:forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.apiToken) {
            errors.apiToken = t("authenticationProvider:forms.common" +
                ".requiredErrorMessage");
        }
        if (!values.baseUrl) {
            errors.baseUrl = t("authenticationProvider:forms.common" +
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
                        (values: HyprAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                    }
                    triggerSubmit={ (submitFunction: () => void) => triggerSubmission(submitFunction) }
                    triggerPrevious={ (previousFunction: () => void) => triggerPrevious(previousFunction) }
                    changePage={ (step: number) => changePageNumber(step) }
                    setTotalPage={ (step: number) => setTotalPage(step) }
                    data-testid={ componentId }
                >
                    <WizardPage validate={ validateForm }>
                        <Field.Input
                            ariaLabel="HYPR IDP Name"
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
                            data-testid={ `${ componentId }-idp-name` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="HYPR App ID"
                            inputType="client_id"
                            name="appId"
                            label={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.appId.label")
                            }
                            placeholder={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.appId.placeholder")
                            }
                            required={ true }
                            message={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.appId.validations.required")
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
                            data-testid={ `${ componentId }-idp-app-id` }
                            width={ 13 }
                        />
                        <Field.Input
                            ariaLabel="HYPR Base URL"
                            inputType="url"
                            name="baseUrl"
                            label={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.baseUrl.label")
                            }
                            placeholder={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.baseUrl.placeholder")
                            }
                            required={ true }
                            message={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.baseUrl.validations.required")
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
                        <Field.Input
                            ariaLabel="HYPR API Token"
                            inputType="password"
                            className="addon-field-wrapper"
                            name="apiToken"
                            label={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.apiToken.label")
                            }
                            placeholder={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.apiToken.placeholder")
                            }
                            required={ true }
                            message={
                                t("authenticationProvider:forms" +
                                    ".authenticatorSettings.hypr.apiToken.validations.required")
                            }
                            type="password"
                            hidePassword={ t("common:hide") }
                            showPassword={ t("common:show") }
                            maxLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MAX_LENGTH as number
                            }
                            minLength={
                                IdentityProviderManagementConstants
                                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MIN_LENGTH as number
                            }
                            data-testid={ `${ componentId }-idp-api-token` }
                            width={ 13 }
                        />
                    </WizardPage>
                </Wizard>
            )
            : null
    );
};

/**
 * Default props for the hypr Authentication Provider Create Wizard Page Component.
 */
HyprAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-componentid": "hypr-idp-create-wizard-page"
};
