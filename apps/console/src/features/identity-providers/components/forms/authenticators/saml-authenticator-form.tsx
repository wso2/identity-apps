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
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState, ConfigReducerStateInterface } from "../../../../core";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../../models";
import {
    composeValidators,
    fastSearch,
    getAvailableNameIDFormats,
    getAvailableProtocolBindingTypes,
    getDigestAlgorithmOptionsMapped,
    getSignatureAlgorithmOptionsMapped,
    hasLength,
    IDENTITY_PROVIDER_ENTITY_ID_LENGTH,
    isUrl,
    LOGOUT_URL_LENGTH,
    required,
    SERVICE_PROVIDER_ENTITY_ID_LENGTH,
    SSO_URL_LENGTH
} from "../../utils/saml-idp-utils";
import { Field, Form } from "@wso2is/form";
import { Code, FormInputLabel, FormSection } from "@wso2is/react-components";
import { Grid, SemanticWIDTHS } from "semantic-ui-react";

/**
 * SamlSettingsForm Properties interface. The data-testid is added in
 * {@link SamlAuthenticatorSettingsForm.defaultProps}.
 */
interface SamlSettingsFormProps extends TestableComponentInterface {
    authenticator: FederatedAuthenticatorWithMetaInterface;
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
}

export interface SamlProperties {
    DigestAlgorithm?: string;
    IdPEntityId?: string;
    LogoutReqUrl?: string;
    NameIDType?: string;
    RequestMethod?: string;
    SPEntityId?: string;
    SSOUrl?: string;
    SignatureAlgorithm?: string;
    commonAuthQueryParams?: string;
    ISAuthnReqSigned?: boolean;
    IncludeProtocolBinding?: boolean;
    IsAuthnRespSigned?: boolean;
    IsLogoutEnabled?: boolean;
    IsLogoutReqSigned?: boolean;
    IsSLORequestAccepted?: boolean;
    IsUserIdInClaims?: boolean;
}

export const SamlAuthenticatorSettingsForm: FunctionComponent<SamlSettingsFormProps> = (
    props: SamlSettingsFormProps
): ReactElement => {

    const {
        authenticator,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { t } = useTranslation();

    const initialFormValues = useMemo<SamlProperties>(() => {

        const [ findPropVal ] = fastSearch(authenticator);

        return {
            DigestAlgorithm: findPropVal<string>({ defaultValue: "SHA1", key: "DigestAlgorithm" }),
            IdPEntityId: findPropVal<string>({ defaultValue: "", key: "IdPEntityId" }),
            NameIDType: findPropVal<string>({ defaultValue: "", key: "NameIDType" }),
            RequestMethod: findPropVal<string>({ defaultValue: "", key: "RequestMethod" }),
            SPEntityId: findPropVal<string>({ defaultValue: "", key: "SPEntityId" }),
            SSOUrl: findPropVal<string>({ defaultValue: "", key: "SSOUrl" }),
            SignatureAlgorithm: findPropVal<string>({ defaultValue: "RSA with SHA1", key: "SignatureAlgorithm" }),
            commonAuthQueryParams: findPropVal<string>({ defaultValue: "", key: "commonAuthQueryParams" }),
            LogoutReqUrl: findPropVal<string>({ defaultValue: "", key: "LogoutReqUrl" }),
            ISAuthnReqSigned: findPropVal<boolean>({ defaultValue: false, key: "ISAuthnReqSigned" }),
            IncludeProtocolBinding: findPropVal<boolean>({ defaultValue: false, key: "IncludeProtocolBinding" }),
            IsAuthnRespSigned: findPropVal<boolean>({ defaultValue: false, key: "IsAuthnRespSigned" }),
            IsLogoutEnabled: findPropVal<boolean>({ defaultValue: false, key: "IsLogoutEnabled" }),
            IsLogoutReqSigned: findPropVal<boolean>({ defaultValue: false, key: "IsLogoutReqSigned" }),
            IsSLORequestAccepted: findPropVal<boolean>({ defaultValue: true, key: "IsSLORequestAccepted" }),
            IsUserIdInClaims: findPropVal<boolean>({ defaultValue: true, key: "IsUserIdInClaims" })
        } as SamlProperties;

    }, []);

    const [ formValues, setFormValues ] = useState<SamlProperties>({});

    const [ isAuthnReqSigned, setIsAuthnReqSigned ] = useState<boolean>(false);
    const [ includeProtocolBinding, setIncludeProtocolBinding ] = useState<boolean>(false);
    const [ isAuthnRespSigned, setIsAuthnRespSigned ] = useState<boolean>(false);
    const [ isLogoutEnabled, setIsLogoutEnabled ] = useState<boolean>(false);
    const [ isLogoutReqSigned, setIsLogoutReqSigned ] = useState<boolean>(false);
    const [ isSLORequestAccepted, setIsSLORequestAccepted ] = useState<boolean>(false);
    const [ isUserIdInClaims, setIsUserIdInClaims ] = useState<boolean>(true);

    // form field enable or disable triggers.
    const [ isAlgorithmsEnabled, setIsAlgorithmsEnabled ] = useState<boolean>(false);

    useEffect(() => {
        setIsAuthnReqSigned(initialFormValues.ISAuthnReqSigned);
        setIncludeProtocolBinding(initialFormValues.IncludeProtocolBinding);
        setIsAuthnRespSigned(initialFormValues.IsAuthnRespSigned);
        setIsLogoutEnabled(initialFormValues.IsLogoutEnabled);
        setIsLogoutReqSigned(initialFormValues.IsLogoutReqSigned);
        setIsSLORequestAccepted(initialFormValues.IsSLORequestAccepted);
        setIsUserIdInClaims(initialFormValues.IsUserIdInClaims);
        setFormValues({ ...initialFormValues });
    }, [ initialFormValues ]);

    useEffect(() => {
        const ifEitherOneOfThemIsChecked = isLogoutReqSigned || isAuthnReqSigned;
        setIsAlgorithmsEnabled(ifEitherOneOfThemIsChecked);
    }, [ isLogoutReqSigned, isAuthnReqSigned ])

    const onFormSubmit = (values: { [ key: string ]: any }) => {

        const controlledFields = new Set([
            "ISAuthnReqSigned",
            "IncludeProtocolBinding",
            "IsAuthnRespSigned",
            "IsLogoutEnabled",
            "IsLogoutReqSigned",
            "IsSLORequestAccepted",
            "IsUserIdInClaims",
        ]);

        const authn = ({
            ...authenticator.data,
            properties: [
                ...Object.keys(values)
                    //.filter((key) => !controlledFields.has(key))
                    .map((key) => ({ key, value: values[ key ] })),
                /*...Object.entries({
                    ISAuthnReqSigned: isAuthnReqSigned,
                    IncludeProtocolBinding: includeProtocolBinding,
                    IsAuthnRespSigned: isAuthnRespSigned,
                    IsLogoutEnabled: isLogoutEnabled,
                    IsLogoutReqSigned: isLogoutReqSigned,
                    IsSLORequestAccepted: isSLORequestAccepted,
                    IsUserIdInClaims: isUserIdInClaims,
                }).map(([ key, value ]) => ({ key, value })) as any*/
            ],
        });

        onSubmit(authn);

    };

    const getAlgorithmsDropdownFieldValidators = () => {
        if (isLogoutReqSigned || isAuthnReqSigned) {
            return required;
        }
        return (/* No validations */) => void 0;
    };

    return (
        <Form onSubmit={ onFormSubmit } uncontrolledForm={ true } initialValues={ initialFormValues }>

            <Field.Input
                required={ true }
                name="SPEntityId"
                value={ formValues?.SPEntityId }
                placeholder={ "Enter service provider entity ID" }
                ariaLabel={ "Service provider entity ID" }
                inputType="default"
                maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                label={ (
                    <FormInputLabel htmlFor="SPEntityId">
                        Service provider <Code>entityID</Code>
                    </FormInputLabel>
                ) }
                validate={ composeValidators(
                    required,
                    hasLength(SERVICE_PROVIDER_ENTITY_ID_LENGTH)
                ) }
                hint={ (
                    <>Enter identity provider&apos;s SAML2 Web SSO URL value.</>
                ) }
            />

            <Field.Input
                required={ true }
                name="SSOUrl"
                value={ formValues?.SSOUrl }
                inputType="default"
                placeholder={ "https://ENTERPRISE_IDP/samlsso" }
                ariaLabel={ "Single Sign-On URL" }
                data-testid={ `${ testId }-SSOUrl-field` }
                label={ (
                    <FormInputLabel htmlFor="SSOUrl">
                        Single Sign-On <Code>URL</Code>
                    </FormInputLabel>
                ) }
                maxLength={ SSO_URL_LENGTH.max }
                minLength={ SSO_URL_LENGTH.min }
                validate={ composeValidators(
                    required,
                    isUrl,
                    hasLength(SSO_URL_LENGTH)
                ) }
                hint={ (
                    <>Enter identity provider&apos;s SAML2 Web Single Sign-On URL value.</>
                ) }
            />

            <Field.Input
                required={ true }
                name="IdPEntityId"
                value={ formValues?.IdPEntityId }
                inputType="default"
                placeholder={ "Enter identity provider entity ID" }
                ariaLabel={ "Identity provider entity ID" }
                data-testid={ `${ testId }-IdPEntityId-field` }
                label={ (
                    <FormInputLabel htmlFor="IdPEntityId" disabled={ true }>
                        Identity provider <Code>entityID</Code>
                    </FormInputLabel>
                ) }
                maxLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.max }
                minLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.min }
                validate={ composeValidators(
                    required,
                    hasLength(IDENTITY_PROVIDER_ENTITY_ID_LENGTH)
                ) }
                hint={ (
                    <>
                        Enter identity provider&apos;s entity identifier value.
                        This should be a valid <Code>URI</Code>/<Code>URL</Code>.
                    </>
                ) }
            />

            <Field.Dropdown
                required={ true }
                name="NameIDType"
                value={ formValues?.NameIDType }
                placeholder={ "Select identity provider NameIDFormat" }
                ariaLabel={ "Choose NameIDFormat for SAML 2.0 assertion" }
                data-testid={ `${ testId }-NameIDType-field` }
                options={ getAvailableNameIDFormats() }
                label={ (
                    <FormInputLabel htmlFor="NameIDType">
                        Identity provider <Code>NameIDFormat</Code>
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={
                    "Specify the name identifier formats supported by the identity " +
                    "provider. Name identifiers are a way for providers to communicate " +
                    "with each other regarding a user."
                }
            />

            <Field.Dropdown
                required={ true }
                name="RequestMethod"
                value={ formValues?.RequestMethod }
                placeholder={ "Select HTTP protocol binding" }
                ariaLabel={ "HTTP protocol for SAML 2.0 bindings" }
                data-testid={ `${ testId }-RequestMethod-field` }
                options={ getAvailableProtocolBindingTypes() }
                label={ (
                    <FormInputLabel htmlFor="RequestMethod">
                        HTTP protocol binding
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ "Choose the HTTP binding or decide from incoming request." }
            />

            <FormSection heading="Single Logout">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            name="IsSLORequestAccepted"
                            ariaLabel={ "Specify whether logout is enabled for IdP" }
                            data-testid={ `${ testId }-IsSLORequestAccepted-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsSLORequestAccepted">
                                    Accept identity provider logout request
                                </FormInputLabel>
                            ) }
                            hint={ `Specify whether single logout request from the identity 
                                    provider must be accepted by ${ config.ui.productName }`
                            }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsLogoutEnabled"
                            ariaLabel={ "Specify whether logout is enabled for IdP" }
                            data-testid={ `${ testId }-IsLogoutEnabled-field` }
                            toggle
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    Identity provider logout enabled
                                </FormInputLabel>
                            ) }
                            hint={ (
                                <>
                                    Specify whether logout is supported by the external
                                    identity provider.
                                </>
                            ) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Input
                            name="LogoutReqUrl"
                            value={ formValues?.LogoutReqUrl }
                            inputType="url"
                            disabled={ !isLogoutEnabled }
                            placeholder={ "Enter logout URL" }
                            ariaLabel={ "Specify SAML 2.0 IdP Logout URL" }
                            data-testid={ `${ testId }-LogoutReqUrl-field` }
                            label={ (
                                <FormInputLabel htmlFor="LogoutReqUrl">
                                    IdP logout <Code>URL</Code>
                                </FormInputLabel>
                            ) }
                            maxLength={ LOGOUT_URL_LENGTH.max }
                            minLength={ LOGOUT_URL_LENGTH.min }
                            validate={ (value) => {
                                return (formValues?.IsLogoutEnabled && value)
                                    ? composeValidators(
                                        isUrl,
                                        hasLength(LOGOUT_URL_LENGTH)
                                    )(value)
                                    : undefined;
                            } }
                            hint={ (
                                <>
                                    Enter the identity provider&apos;s logout URL value if it is different from the SSO
                                    URL (<Code>{ formValues.SSOUrl ?? "https://ENTERPRISE_IDP/samlsso" }</Code>)
                                </>
                            ) }
                        />
                    </SectionRow>
                </Grid>
            </FormSection>

            <FormSection heading="Request & Response Signing">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            required={ false }
                            name="IsAuthnRespSigned"
                            ariaLabel={ "Authentication response must be signed always?" }
                            data-testid={ `${ testId }-IsAuthnRespSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsAuthnRespSigned">
                                    Strictly verify authentication response signature
                                </FormInputLabel>
                            ) }
                            hint={ (
                                <>
                                    Specifies if SAML2 authentication response from the external
                                    identity provider must be signed or not.
                                </>
                            ) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            required={ false }
                            name="IsLogoutReqSigned"
                            ariaLabel={ "Specify whether logout is enabled for IdP" }
                            data-testid={ `${ testId }-IsLogoutReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    Enable logout request signing
                                </FormInputLabel>
                            ) }
                            hint={ (
                                <>
                                    Specify whether SAML logout request to the external identity
                                    provider must be signed or not.
                                </>
                            ) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            required={ false }
                            name="ISAuthnReqSigned"
                            ariaLabel={ "Is authentication request signed?" }
                            data-testid={ `${ testId }-ISAuthnReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="ISAuthnReqSigned">
                                    Enable authentication request signing
                                </FormInputLabel>
                            ) }
                            hint={ (
                                <>
                                    Specify whether the SAML authentication request to the external
                                    identity provider must be signed or not.
                                </>
                            ) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Dropdown
                            required={ isAlgorithmsEnabled }
                            name="SignatureAlgorithm"
                            type="select"
                            disabled={ !isAlgorithmsEnabled }
                            placeholder={ "Select signature algorithm." }
                            ariaLabel={ "Select the signature algorithm for request signing." }
                            data-testid={ `${ testId }-SignatureAlgorithm-field` }
                            options={ getSignatureAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="SignatureAlgorithm">
                                    Signature algorithm
                                </FormInputLabel>
                            ) }
                            validate={ getAlgorithmsDropdownFieldValidators() }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Dropdown
                            required={ isAlgorithmsEnabled }
                            name="DigestAlgorithm"
                            type="select"
                            disabled={ !isAlgorithmsEnabled }
                            placeholder={ "Select digest algorithm" }
                            ariaLabel={ "Select the digest algorithm for description." }
                            data-testid={ `${ testId }-DigestAlgorithm-field` }
                            options={ getDigestAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="DigestAlgorithm">
                                    Select digest algorithm
                                </FormInputLabel>
                            ) }
                            validate={ getAlgorithmsDropdownFieldValidators() }
                        />
                    </SectionRow>
                </Grid>
            </FormSection>

            <FormSection heading="Advanced">
                <Field.Checkbox
                    toggle
                    required={ false }
                    name="IncludeProtocolBinding"
                    ariaLabel={ "Include protocol binding in the request" }
                    data-testid={ `${ testId }-IncludeProtocolBinding-field` }
                    label={ (
                        <FormInputLabel htmlFor="IncludeProtocolBinding">
                            Include protocol binding in the request
                        </FormInputLabel>
                    ) }
                    hint={ (
                        <>
                            Specifies whether the transport mechanism should be included in the SAML
                            request assertion.
                        </>
                    ) }
                />
                <Field.Checkbox
                    required={ false }
                    name="IsUserIdInClaims"
                    ariaLabel={ "Use Name ID as the user identifier." }
                    data-testid={ `${ testId }-IsUserIdInClaims-field` }
                    toggle
                    label={ (
                        <FormInputLabel htmlFor="IsUserIdInClaims">
                            { isUserIdInClaims
                                ? (<span>User identifier found among <Code>claims</Code></span>)
                                : (<span>Use <Code>NameID</Code> as the user identifier</span>)
                            }
                        </FormInputLabel>
                    ) }
                    hint={ (
                        <>
                            If you need to specify an attribute from the SAML assertion as the User Identifier,
                            you can uncheck this option and configure the <Code>subject</Code> from
                            the Attributes section.
                        </>
                    ) }
                />
            </FormSection>

            <p>TODO: re-implement query params logic into form module.</p>

            <Field.Button
                size="small"
                buttonType="primary_btn"
                ariaLabel="SAML authenticator update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ false }
                label={ t("common:update") }
            />

        </Form>
    );

};

SamlAuthenticatorSettingsForm.defaultProps = {
    "data-testid": "saml-authenticator-settings-form"
};

const SectionRow: FunctionComponent<{ width?: SemanticWIDTHS }> = (
    { width = 16, children }: PropsWithChildren<{ width?: SemanticWIDTHS }>
): ReactElement => {
    return (
        <Grid.Row columns={ 1 }>
            <Grid.Column width={ width }>
                { children }
            </Grid.Column>
        </Grid.Row>
    );
};
