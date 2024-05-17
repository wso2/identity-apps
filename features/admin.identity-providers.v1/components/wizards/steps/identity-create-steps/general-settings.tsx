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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { SelectionCard } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { store } from "@wso2is/admin.core.v1";
import { getIdentityProviderList } from "../../../../api";
import { getIdPIcons, getIdPTemplateDocsIcons } from "../../../../configs/ui";
import {
    FederatedAuthenticatorInterface,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderTemplateInterface
} from "../../../../models";
import { handleGetIDPListCallError } from "../../../utils";

/**
 * Proptypes for the general settings wizard form component.
 */
interface GeneralSettingsWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: IdentityProviderInterface;
    triggerSubmit: boolean;
    onSubmit: (values: IdentityProviderInterface) => void;
    template: IdentityProviderTemplateInterface;
}

/**
 * General settings wizard form component.
 *
 * @param props - Props injected to the component.
 * @returns General settings wizard form component.
 */
export const GeneralSettings: FunctionComponent<GeneralSettingsWizardFormPropsInterface> = (
    props: GeneralSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        template,
        [ "data-testid" ]: testId
    } = props;

    const [ selectedProtocol, setSelectedProtocol ] = useState<string>("oidc");

    const { t } = useTranslation();

    const resolveSelectedTemplateFields = (): ReactElement => {

        if (selectedProtocol === undefined) {
            return null;
        } else if (selectedProtocol === "oidc") {
            return (
                <>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="ClientId"
                                label={ "Client ID" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common." +
                                    "requiredErrorMessage") }
                                type="text"
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="ClientSecret"
                                label={ "Client secret" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:forms.common." +
                                    "requiredErrorMessage") }
                                type="password"
                                hidePassword={ t("common:hide") }
                                showPassword={ t("common:show") }
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="OAuth2AuthzEPUrl"
                                label={ "Authorization Endpoint URL" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common." +
                                    "requiredErrorMessage") }
                                type="text"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("authenticationProvider:forms.common." +
                                                "invalidURLErrorMessage"));
                                    }
                                } }
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="OAuth2TokenEPUrl"
                                label={ "Token Endpoint URL" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common.requiredErrorMessage") }
                                type="text"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("authenticationProvider:forms.common." +
                                                "invalidURLErrorMessage"));
                                    }
                                } }
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else {
            return (
                <>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="SPEntityId"
                                label={ "Service provider entity ID" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common." +
                                    "requiredErrorMessage") }
                                type="text"
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="NameIDType"
                                label={ "NameID format" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common." +
                                    "requiredErrorMessage") }
                                type="text"
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="IdPEntityId"
                                label={ "Authentication entity ID" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common." +
                                    "requiredErrorMessage") }
                                type="text"
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="SSOUrl"
                                label={ "SSO URL" }
                                required={ true }
                                requiredErrorMessage={ t("authenticationProvider:" +
                                    "forms.common." +
                                    "requiredErrorMessage") }
                                type="text"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("authenticationProvider:forms.common." +
                                                "invalidURLErrorMessage"));
                                    }
                                } }
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        }
    };

    const getFederatedAuthenticator = (values: Map<string, FormValue>): FederatedAuthenticatorInterface => {

        const authenticator: FederatedAuthenticatorInterface = {};

        authenticator.authenticatorId = selectedProtocol === "oidc" ?
            "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I" : "U0FNTFNTT0F1dGhlbnRpY2F0b3I";
        authenticator.properties = [];
        values.forEach((value: FormValue, key: string) => {
            if (key !== "name") {
                authenticator.properties.push({
                    "key": key,
                    "value": value as string
                });
            }
        });

        return authenticator;
    };

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>): void => {
                const idp: IdentityProviderInterface = template.idp;

                idp.name = values.get("name").toString();
                idp.federatedAuthenticators.authenticators = [];
                idp.federatedAuthenticators.authenticators.push(getFederatedAuthenticator(values));
                idp.federatedAuthenticators.defaultAuthenticatorId = idp.federatedAuthenticators
                    .authenticators[ 0 ].authenticatorId;
                // TODO Need to make this dynamic
                idp.image = store.getState().config.deployment.clientOrigin +
                    "/console/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
                onSubmit(idp);
            } }
            submitState={ triggerSubmit }
            data-testid={ testId }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Field
                            name="name"
                            label={ t("authenticationProvider:forms." +
                                "generalDetails.name.label") }
                            required={ true }
                            requiredErrorMessage={ t("authenticationProvider:" +
                                "forms.generalDetails." +
                                "name.validations.empty") }
                            placeholder={ t("authenticationProvider:forms." +
                                "generalDetails.name.placeholder") }
                            type="text"
                            validation={ async (value: string, validation: Validation) => {
                                try {
                                    const idpList: IdentityProviderListResponseInterface = 
                                        await getIdentityProviderList(null, null, "name eq " + value.toString());

                                    if (idpList?.totalResults === 0) {
                                        validation.isValid = true;
                                    } else {
                                        validation.isValid = false;
                                        validation.errorMessages.push(t("authenticationProvider:forms." +
                                            "generalDetails.name.validations.duplicate"));
                                    }
                                } catch (error) {
                                    handleGetIDPListCallError(error);
                                }
                            } }
                            value={ initialValues?.name }
                            data-testid={ `${ testId }-idp-name` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pt-0">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <div className="sub-template-selection">
                            <div>Protocols</div>
                            <SelectionCard
                                inline
                                image={ getIdPTemplateDocsIcons().openidconnect }
                                size="x120"
                                className="sub-template-selection-card"
                                header={ "OIDC" }
                                selected={ selectedProtocol === "oidc" }
                                onClick={ () => {
                                    setSelectedProtocol("oidc");
                                } }
                                imageSize="mini"
                                contentTopBorder={ false }
                                showTooltips={ true }
                                data-testid={ `${ testId }-oidc-card` }
                            />
                            <SelectionCard
                                inline
                                image={ getIdPIcons().saml }
                                size="x120"
                                className="sub-template-selection-card"
                                header={ "SAML" }
                                selected={ selectedProtocol === "saml" }
                                onClick={ () => {
                                    setSelectedProtocol("saml");
                                } }
                                imageSize="mini"
                                contentTopBorder={ false }
                                showTooltips={ true }
                                data-testid={ `${ testId }-saml-card` }
                            />

                        </div>
                    </Grid.Column>
                </Grid.Row>
                { resolveSelectedTemplateFields() }
            </Grid>
        </Forms>
    );
};
