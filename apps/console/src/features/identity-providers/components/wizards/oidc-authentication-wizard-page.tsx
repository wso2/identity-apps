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
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { IdentityProviderTemplateInterface } from "../../models";

const CLIENT_ID_MAX_LENGTH: number = 100;
const CLIENT_SECRET_MAX_LENGTH: number = 100;
const URL_MAX_LENGTH: number = 2048;

/**
 * Proptypes for the OidcAuthenticationWizardFrom.
 */
 interface OidcAuthenticationWizardFromPropsInterface extends TestableComponentInterface {
    triggerSubmission: any;
    triggerPrevious: any;
    changePageNumber: (number) => void;
    template: IdentityProviderTemplateInterface;
    setTotalPage: (number) => void;
    onSubmit: (values)=> void;
}

const FORM_ID: string = "oidc-authenticator-wizard-form";

/**
 * OIDC Authenticator wizard form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const OidcAuthenticationWizardFrom = (props: OidcAuthenticationWizardFromPropsInterface): ReactElement => {

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

    /**
     * Check client id regex validation
     */
    const clientIdRegexValidation= (value) => {
        const regex = new RegExp(".*");

        if (!regex.test(value)) {
            return "Please enter a valid input.";
        }
    };

    return (
        <>
            <Wizard
                id={ FORM_ID }
                initialValues={ { name: template?.idp?.name } }
                onSubmit={ (values)=>onSubmit(values) }
                triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                triggerPrevious= { (previousFunction) => triggerPrevious(previousFunction) }
                changePage= { (step:number)=> changePageNumber(step) }
                setTotalPage= { (step:number)=> setTotalPage(step) }
                data-testid={ testId }
            >
                <WizardPage
                    // TODO: Need to refactor once wizard can handle validation properly.
                    validate={ (values): any => {

                        const errors: any = {};

                        if (!values.name) {
                            errors.name = "This is a required field.";
                        }
                        if (!values.clientId) {
                            errors.clientId = "This is a required field.";
                        }
                        if (!values.clientSecret) {
                            errors.clientSecret = "This is a required field.";
                        }
                        if (!values.authorizationEndpointUrl) {
                            errors.authorizationEndpointUrl = "This is a required field.";
                        }
                        if (!values.tokenEndpointUrl) {
                            errors.tokenEndpointUrl = "This is a required field.";
                        }

                        return errors;
                    } }
                >
                    <Field.Input
                        ariaLabel= "name"
                        inputType= "name"
                        name="name"
                        label={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.label") }
                        required={ true }
                        maxLength={ 50 }
                        minLength={ 3 }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-name` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel= "clientId"
                        inputType= "identifier"
                        name="clientId"
                        label={ "Client ID" }
                        required={ true }
                        autoComplete={ "" + Math.random() }
                        maxLength={ CLIENT_ID_MAX_LENGTH }
                        minLength={ 3 }
                        validation ={ (value)=>clientIdRegexValidation(value) }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-client-id` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel= "clientSecret"
                        inputType="password"
                        className="addon-field-wrapper"
                        name="clientSecret"
                        label={ "Client secret" }
                        required={ true }
                        hidePassword={ t("common:hide") }
                        showPassword={ t("common:show") }
                        autoComplete={ "" + Math.random() }
                        maxLength={ CLIENT_SECRET_MAX_LENGTH }
                        minLength={ 3 }
                        type="password"
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-client-secret` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel= "authorizationEndpointUrl"
                        inputType="url"
                        name="authorizationEndpointUrl"
                        label={ "Authorization endpoint URL" }
                        required={ true }
                        placeholder={ "https://ENTERPRISE_DOMAIN/authorize" }
                        autoComplete={ "" + Math.random() }
                        maxLength={ URL_MAX_LENGTH }
                        minLength={ 3 }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-authorization-endpoint-url` }
                        width={ 13 }
                    />
                    <Field.Input
                        ariaLabel= "tokenEndpointUrl"
                        inputType="url"
                        name="tokenEndpointUrl"
                        label={ "Token endpoint URL" }
                        required={ true }
                        placeholder={ "https://ENTERPRISE_DOMAIN/token" }
                        autoComplete={ "" + Math.random() }
                        maxLength={ URL_MAX_LENGTH }
                        minLength={ 3 }
                        // TODO: checkon key press usecase
                        // onKeyDown={ keyPressed }
                        data-testid={ `${ testId }-idp-token-endpoint-url` }
                        width={ 13 }
                    />
                </WizardPage>
            </Wizard>
        </>
    );
};

/**
 * Default props for the oidc creation wizard.
 */
OidcAuthenticationWizardFrom.defaultProps = {
    "data-testid": "idp-edit-idp-create-wizard"
};
