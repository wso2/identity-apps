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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Wizard, WizardPage } from "@wso2is/form";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    ExpertModeAuthenticationProviderCreateWizardFormErrorValidationsInterface,
    ExpertModeAuthenticationProviderCreateWizardFormValuesInterface
} from "./expert-mode-authentication-provider-create-wizard";
import { useIdentityProviderList } from "../../../api";
import { IdentityProviderManagementConstants } from "../../../constants";
import { IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

/**
 * Prop-types for the Expert Mode Authentication Wizard From.
 */
interface ExpertModeAuthenticationProviderCreateWizardContentPropsInterface extends IdentifiableComponentInterface {
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
    onSubmit: (values: ExpertModeAuthenticationProviderCreateWizardFormValuesInterface) => void;
}

const FORM_ID: string = "expert-mode-authenticator-wizard-form";

/**
 * Expert Mode Authentication Provider Create Wizard content component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const ExpertModeAuthenticationProviderCreateWizardContent: FunctionComponent<
    ExpertModeAuthenticationProviderCreateWizardContentPropsInterface
    > = (
        props: ExpertModeAuthenticationProviderCreateWizardContentPropsInterface
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
         * @param value - IDP name.
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
        const validateForm = (values: ExpertModeAuthenticationProviderCreateWizardFormValuesInterface):
        ExpertModeAuthenticationProviderCreateWizardFormErrorValidationsInterface => {

            const errors: ExpertModeAuthenticationProviderCreateWizardFormErrorValidationsInterface = {
                name: undefined
            };

            if (!values.name) {
                errors.name = t("console:develop.features.authenticationProvider.forms.common" +
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
                    (values: ExpertModeAuthenticationProviderCreateWizardFormValuesInterface) => onSubmit(values)
                }
                triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                triggerPrevious={ (previousFunction) => triggerPrevious(previousFunction) }
                changePage={ (step: number) => changePageNumber(step) }
                setTotalPage={ (step: number) => setTotalPage(step) }
                data-componentid={ componentId }
            >
                <WizardPage validate={ validateForm }>
                    <Field.Input
                        ariaLabel="Expert Mode IDP Name"
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
                    <Field.Textarea
                        ariaLabel="Expert Mode IDP Description"
                        inputType="description"
                        name="description"
                        label={
                            t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.description.label")
                        }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.description.placeholder")
                        }
                        required={ false }
                        maxLength={
                            IdentityProviderManagementConstants
                                .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.IDP_DESCRIPTION_MAX_LENGTH as number
                        }
                        minLength={
                            IdentityProviderManagementConstants
                                .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.IDP_DESCRIPTION_MIN_LENGTH as number
                        }
                        data-componentid={ `${componentId}-idp-description` }
                        width={ 13 }
                    />
                </WizardPage>
            </Wizard>
        );
    };

/**
 * Default props for the Expert Mode Authentication Provider Create Wizard Page Component.
 */
ExpertModeAuthenticationProviderCreateWizardContent.defaultProps = {
    "data-componentid": "expert-mode-idp-create-wizard-content"
};
