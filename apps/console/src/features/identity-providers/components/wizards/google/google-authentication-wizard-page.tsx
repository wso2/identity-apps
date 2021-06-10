/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Wizard, WizardPage } from "@wso2is/form";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIdentityProviderList } from "../../../api";
import { IdentityProviderListResponseInterface, IdentityProviderTemplateInterface } from "../../../models";
import { handleGetIDPListCallError } from "../../utils";

const IDP_NAME_MAX_LENGTH: number = 50;
const CLIENT_ID_MAX_LENGTH: number = 100;
const CLIENT_SECRET_MAX_LENGTH: number = 100;

/**
 * Proptypes for the GoogleAuthenticationWizardFrom.
 */
interface GoogleAuthenticationWizardFromPropsInterface extends TestableComponentInterface {
    triggerSubmission: any;
    triggerPrevious: any;
    changePageNumber: (number) => void;
    template: IdentityProviderTemplateInterface;
    setTotalPage: (number) => void;
    onSubmit: (values) => void;
}

export const GoogleAuthenticationWizardFrom = (props: GoogleAuthenticationWizardFromPropsInterface): ReactElement => {

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
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(false);

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
    const getIDPlist = () => {
        setIdPListRequestLoading(true);
        getIdentityProviderList(null, null, null)
            .then((response) => {
                setIdPList(response);
            }).catch((error) => {
            handleGetIDPListCallError(error);
        }).finally(() => {
            setIdPListRequestLoading(false);
        });
    };

    /**
     * Check whether IDP name is already exist or not.
     * @param value IDP name
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value) => {
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
        <>
            { !isIdPListRequestLoading &&
            <Wizard
                initialValues={ { name: template?.idp?.name } }
                onSubmit={ (values) => onSubmit(values) }
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
                            errors.name = t("console:develop.features.authenticationProvider.forms." +
                                "generalDetails.name.validations.required");
                        }
                        if (!values.clientId) {
                            errors.clientId = t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.google.clientId.validations.required");
                        }
                        if (!values.clientSecret) {
                            errors.clientSecret = t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.google.clientSecret.validations.required");
                        }

                        return errors;
                    } }
                >
                    <Field.Input
                        ariaLabel="name"
                        inputType="name"
                        name="name"
                        label={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.label") }
                        placeholder={
                            t("console:develop.features.authenticationProvider.forms." +
                                "generalDetails.name.placeholder")
                        }
                        required={ true }
                        maxLength={ IDP_NAME_MAX_LENGTH }
                        validation={ (value) => idpNameValidation(value) }
                        minLength={ 3 }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-name` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="clientId"
                        inputType="resourceName"
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
                        message={ t("console:develop.features.authenticationProvider." +
                            "forms.common.requiredErrorMessage") }
                        type="text"
                        autoComplete={ "" + Math.random() }
                        maxLength={ CLIENT_ID_MAX_LENGTH }
                        minLength={ 3 }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-client-id` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel="clientSecret"
                        inputType="password"
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
                        message={ t("console:develop.features.authenticationProvider." +
                            "forms.common.requiredErrorMessage") }
                        type="password"
                        hidePassword={ t("common:hide") }
                        showPassword={ t("common:show") }
                        autoComplete={ "" + Math.random() }
                        maxLength={ CLIENT_SECRET_MAX_LENGTH }
                        minLength={ 3 }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-client-secret` }
                        width={ 13 }
                    />
                </WizardPage>
            </Wizard>
            }
        </>
    );
};

/**
 * Default props for the google creation wizard.
 */
GoogleAuthenticationWizardFrom.defaultProps = {
    "data-testid": "idp-edit-idp-create-wizard"
};
