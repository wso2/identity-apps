/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppState, ConfigReducerStateInterface } from "@wso2is/admin.core.v1";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1";
import { IdentityProviderManagementConstants } from "@wso2is/admin.identity-providers.v1/constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AuthenticatorManagementConstants } from "../../../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../../../constants/connection-constants";
import {
    ConnectionInterface,
    ConnectionListResponseInterface,
    FederatedAuthenticatorListItemInterface,
    GeneralDetailsFormValuesInterface,
    StrictConnectionInterface
} from "../../../models/connection";
import { IdpCertificates } from "../settings";

/**
 * Proptypes for the identity provider general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP?: ConnectionInterface;
    /**
     * Mark identity provider as primary.
     */
    isPrimary?: boolean;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate?: (id: string) => void;
    /**
     * Externally trigger form submission.
     */
    triggerSubmit?: boolean;
    /**
     * Optimize for the creation wizard.
     */
    enableWizardMode?: boolean;
    /**
     * List of available Idps.
     */
    idpList?: ConnectionListResponseInterface;
    /**
     * Why? to hide or show the IdP logo edit input field.
     * Introduced this for SAML and OIDC enterprise protocols.
     * By default the icon/logo for this is readonly from
     * extensions.
     */
    hideIdPLogoEditField?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Explicitly specifies whether the currently displaying
     * IdP is a SAML provider or not.
     */
    isSaml?: boolean;
    /**
     * Explicitly specifies whether the currently displaying
     * IdP is a OIDC provider or not.
     */
    isOidc?: boolean;
    /**
     * Type of the template.
     */
    templateType?: string;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

const IDP_NAME_MAX_LENGTH: number = 50;

const FORM_ID: string = "idp-general-details-form";

/**
 * Form to edit general details of the identity provider.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    props: GeneralDetailsFormPopsInterface): ReactElement => {

    const {
        onSubmit,
        onUpdate,
        editingIDP,
        idpList,
        hideIdPLogoEditField,
        isReadOnly,
        isSaml,
        templateType,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const certificateOptionsForTemplate: {
        PEM: boolean;
        JWKS: boolean;
    } = useMemo(() => {
        return identityProviderConfig.editIdentityProvider.getCertificateOptionsForTemplate(editingIDP?.templateId);
    }, []);

    // const [ modifiedName, setModifiedName ] = useState<string>(name);

    const { t } = useTranslation();
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Check whether IDP name is already exist or not.
     * @param value - IDP name
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value: string): string => {
        if (!FormValidation.isValidResourceName(value)) {
            return t("authenticationProvider:" +
                "templates.enterprise.validation.name");
        }
        let nameExist: boolean = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.map((idp: StrictConnectionInterface) => {
                if (idp?.name === value && editingIDP.name !== value) {
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
     * Validate issuer value.
     *
     * @param value - Issuer value
     * @returns error msg if issuer is not valid.
     */
    const issuerValidation = (value: string): string => {
        if (!FormValidation.resourceName(value)) {
            return t("authenticationProvider:" +
                "templates.trustedTokenIssuer.forms.issuer.validation.notValid", { issuer: value });
        }
    };

    /**
     * Validate alias value.
     *
     * @param value - Alias value
     * @returns error msg if alias is not valid.
     */
    const aliasValidation = (value: string): string => {
        if (!FormValidation.resourceName(value)) {
            return t("authenticationProvider:" +
            "templates.trustedTokenIssuer.forms.alias.validation.notValid", { alias: value });
        }
    };

    // Temporarily comment out Idp name valiation logic per name.
    // /**
    //  * Called when name field is modified.
    //  */
    // useEffect(() => {
    //     if (!enableWizardMode) {
    //         return;
    //     }
    //     setIsNameValid(false);
    //     validateIdpName(modifiedName);
    // }, [ modifiedName ]);

    // /**
    //  * Retrieves the list of identity providers.
    //  */
    // const validateIdpName = (idpName: string) => {
    //     getIdentityProviderList(null, null, "name eq " + idpName)
    //         .then((response) => {
    //             setIsNameValid(response?.totalResults === 0);
    //         })
    //         .catch((error) => {
    //             handleGetIDPListCallError(error);
    //         });
    // };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: GeneralDetailsFormValuesInterface): void => {
        onSubmit({
            alias: values.alias?.toString(),
            description: values.description?.toString(),
            idpIssuerName: values.idpIssuerName?.toString(),
            image: values.image?.toString(),
            isPrimary: !!values.isPrimary,
            name: values.name?.toString()
        });
    };

    /**
     * Checks if the certificates section should be shown.
     *
     * @returns Should show/hide certificates.
     */
    const shouldShowCertificates = (): boolean => {

        let showCertificate: boolean = identityProviderConfig.generalDetailsForm.showCertificate;

        if ((certificateOptionsForTemplate !== undefined
            && !certificateOptionsForTemplate.JWKS
            && !certificateOptionsForTemplate.PEM)
            || isIDPOrganizationSSO() || isIDPIproov()) {
            showCertificate = false;
        }

        return showCertificate;
    };

    /**
     * Checks if the current IDP is organization SSO.
     */
    const isIDPOrganizationSSO = (): boolean => {
        return !!editingIDP?.federatedAuthenticators?.authenticators.find(
            (authenticator: FederatedAuthenticatorListItemInterface) => {
                return authenticator?.name === AuthenticatorManagementConstants.ORGANIZATION_SSO_AUTHENTICATOR_NAME;
            }
        );
    };

    /**
     * Checks if the current IDP is iProov.
     */
    const isIDPIproov = (): boolean => {
        return !!editingIDP?.federatedAuthenticators?.authenticators.find(
            (authenticator: FederatedAuthenticatorListItemInterface) => {
                return authenticator?.name === AuthenticatorManagementConstants.IPROOV_AUTHENTICATOR_NAME;
            }
        );
    };

    return (
        <React.Fragment>
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ false }
                    onSubmit={ (values: GeneralDetailsFormValuesInterface): void => {
                        updateConfigurations(values);
                    } }
                    data-testid={ testId }
                >
                    <Field.Input
                        ariaLabel="name"
                        inputType="resource_name"
                        name="name"
                        label={ t("authenticationProvider:forms." +
                            "generalDetails.name.label") }
                        required
                        message={ t("authenticationProvider:" +
                            "forms.generalDetails.name.validations.empty") }
                        placeholder={ editingIDP.name }
                        validation={ (value: string) => idpNameValidation(value) }
                        value={ editingIDP.name }
                        maxLength={ IDP_NAME_MAX_LENGTH }
                        minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                        data-testid={ `${ testId }-idp-name` }
                        hint={ t("authenticationProvider:forms." +
                            "generalDetails.name.hint") }
                        readOnly={ isReadOnly }
                    />
                    {
                        (identityProviderConfig?.editIdentityProvider?.showIssuerSettings ||
                            templateType === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                            || templateType === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE)
                            && !isIDPOrganizationSSO() && !isIDPIproov()
                            && (
                                <Field.Input
                                    ariaLabel="idpIssuerName"
                                    inputType="resource_name"
                                    name="idpIssuerName"
                                    label={ t("authenticationProvider:forms." +
                                        "generalDetails.issuer.label") }
                                    hint={ t("authenticationProvider:forms." +
                                        "generalDetails.issuer.hint") }
                                    required={
                                        templateType === IdentityProviderManagementConstants
                                            .IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                                    }
                                    placeholder={
                                        editingIDP?.idpIssuerName ??
                                            t("authenticationProvider:forms.generalDetails." +
                                            "issuer.placeholder")
                                    }
                                    validation={ (value: string) => issuerValidation(value) }
                                    value={ editingIDP.idpIssuerName }
                                    maxLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.max }
                                    minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                                    data-testid={ `${ testId }-issuer` }
                                    readOnly={ isReadOnly }
                                />
                            )
                    }
                    {
                        (identityProviderConfig?.editIdentityProvider?.showIssuerSettings ||
                            templateType === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER)
                            && !isIDPOrganizationSSO() && !isIDPIproov()
                            && (
                                <Field.Input
                                    ariaLabel="alias"
                                    inputType="resource_name"
                                    name="alias"
                                    label={ t("authenticationProvider:forms." +
                                        "generalDetails.alias.label") }
                                    required={ false }
                                    message={ t("authenticationProvider:" +
                                        "forms.generalDetails.name.validations.empty") }
                                    placeholder={ t("authenticationProvider:forms." +
                                        "generalDetails.alias.placeholder") }
                                    hint={ t("authenticationProvider:forms." +
                                        "generalDetails.alias.hint", { productName: config.ui.productName }) }
                                    validation={ (value: string) => aliasValidation(value) }
                                    value={ editingIDP.alias }
                                    maxLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.max }
                                    minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                                    data-testid={ `${ testId }-alias` }
                                    readOnly={ isReadOnly }
                                />
                            )
                    }
                    <Field.Textarea
                        name="description"
                        ariaLabel="description"
                        label={ t("authenticationProvider:forms." +
                            "generalDetails.description.label") }
                        required={ false }
                        placeholder={ t("authenticationProvider:forms." +
                            "generalDetails.description.placeholder") }
                        value={ editingIDP.description }
                        data-testid={ `${ testId }-idp-description` }
                        maxLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.max }
                        minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                        hint={ t("authenticationProvider:forms." +
                            "generalDetails.description.hint") }
                        readOnly={ isReadOnly }
                    />
                    { !hideIdPLogoEditField && (
                        <Field.Input
                            name="image"
                            ariaLabel="image"
                            inputType="url"
                            label={ t("authenticationProvider:" +
                                "forms.generalDetails.image.label") }
                            required={ false }
                            placeholder={ t("authenticationProvider:" +
                                "forms.generalDetails.image." +
                                "placeholder") }
                            value={ editingIDP.image }
                            data-testid={ `${ testId }-idp-image` }
                            maxLength={
                                ConnectionManagementConstants
                                    .GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MAX_LENGTH as number
                            }
                            minLength={
                                ConnectionManagementConstants
                                    .GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MIN_LENGTH as number
                            }
                            hint={ t("authenticationProvider:forms." +
                                "generalDetails.image.hint") }
                            readOnly={ isReadOnly }
                        />
                    ) }
                    { !isReadOnly && (
                        <Field.Button
                            form={ FORM_ID }
                            ariaLabel="Update General Details"
                            size="small"
                            buttonType="primary_btn"
                            label={ t("common:update") }
                            name="submit"
                            disabled={ isSubmitting }
                            loading={ isSubmitting }
                        />
                    ) }
                </Form>
            </EmphasizedSegment>
            { shouldShowCertificates() && (
                <React.Fragment>
                    <Divider hidden/>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">Certificates</Heading>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <IdpCertificates
                        isJWKSEnabled={
                            certificateOptionsForTemplate !== undefined
                                ? certificateOptionsForTemplate.JWKS
                                : !isSaml
                        }
                        templateType={ templateType }
                        isReadOnly={ isReadOnly }
                        editingIDP={ editingIDP }
                        onUpdate={ onUpdate }
                        isPEMEnabled={
                            certificateOptionsForTemplate !== undefined
                                ? certificateOptionsForTemplate.PEM
                                : true
                        }
                    />
                </React.Fragment>
            ) }
        </React.Fragment>
    );
};

GeneralDetailsForm.defaultProps = {
    "data-testid": "idp-edit-general-settings-form",
    enableWizardMode: false,
    hideIdPLogoEditField: false,
    triggerSubmit: false
};
