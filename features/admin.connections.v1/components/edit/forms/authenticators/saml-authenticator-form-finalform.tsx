/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1";
import { AppState } from "@wso2is/admin.core.v1/store";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1/configs/identity-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CheckboxFieldAdapter,
    DropdownChild,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    RadioGroupFieldAdapter,
    SelectFieldAdapter,
    TextFieldAdapter
} from "@wso2is/form/src";
import { Code, FormInputLabel, FormSection, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid, SemanticWIDTHS } from "semantic-ui-react";
import {
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormInitialValuesInterface
} from "../../../../models/authenticators";
import { FederatedAuthenticatorWithMetaInterface } from "../../../../models/connection";
import {
    DEFAULT_NAME_ID_FORMAT,
    DEFAULT_PROTOCOL_BINDING,
    IDENTITY_PROVIDER_AUTHENTICATION_REQUEST_PROVIDER_NAME_LENGTH,
    IDENTITY_PROVIDER_AUTHORIZED_REDIRECT_URL_LENGTH,
    IDENTITY_PROVIDER_ENTITY_ID_LENGTH,
    LOGOUT_URL_LENGTH,
    SERVICE_PROVIDER_ENTITY_ID_LENGTH,
    SSO_URL_LENGTH,
    fastSearch,
    getAvailableNameIDFormats,
    getAvailableProtocolBindingTypes,
    getDigestAlgorithmOptionsMapped,
    getSignatureAlgorithmOptionsMapped
} from "../../../../utils/saml-idp-utils";

/**
 * The i18n namespace entry key for this component's contents.
 * Optionally you can pass this key to {@link useTranslation}
 * to avoid concatenate strings.
 */
const I18N_TARGET_KEY: string = "authenticationProvider:forms.authenticatorSettings.saml";

/**
 * SamlSettingsForm Properties interface. The data-testid is added in
 * {@link SamlAuthenticatorSettingsForm.defaultProps}.
 */
interface SamlSettingsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    authenticator: FederatedAuthenticatorWithMetaInterface;
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    readOnly?: boolean;
    /**
     * Specifies if the form is submitted.
     */
    isSubmitting?: boolean;
}

export interface SamlPropertiesInterface {
    AuthRedirectUrl?: string;
    DigestAlgorithm?: string;
    IdPEntityId?: string;
    LogoutReqUrl?: string;
    NameIDType?: string;
    RequestMethod?: string;
    SPEntityId?: string;
    SSOUrl?: string;
    SignatureAlgorithm?: string;
    commonAuthQueryParams?: string;
    customAuthnContextClassRef?: string;
    ISAuthnReqSigned?: boolean;
    IncludeProtocolBinding?: boolean;
    IsAuthnRespSigned?: boolean;
    IsLogoutEnabled?: boolean;
    IsLogoutReqSigned?: boolean;
    IsSLORequestAccepted?: boolean;
    IsUserIdInClaims?: boolean;
    ArtifactResolveUrl?: string;
    ISArtifactBindingEnabled?: boolean;
    /**
     * https://github.com/wso2/product-is/issues/17004
     */
    ISArtifactResolveReqSigned?: boolean;
    ISArtifactResponseSigned?: boolean;
    isAssertionSigned?: boolean;
    attributeConsumingServiceIndex?: string;
    AuthnContextComparisonLevel?: string;
    IsAssertionEncrypted?: boolean;
    IncludeCert?: boolean;
    IncludeNameIDPolicy?: boolean;
    AuthnContextClassRef?: string;
    AuthnReqProviderName?: string;
}

export default function SamlAuthenticatorSettingsFinalForm(props: SamlSettingsFormPropsInterface) {
    const {
        authenticator,
        onSubmit,
        readOnly,
        isSubmitting,
        ["data-componentid"]: componentId = "saml-authenticator-settings-form"
    } = props;

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const authorizedRedirectURL: string = config?.deployment?.customServerHost + "/commonauth";

    const initialFormValues: SamlPropertiesInterface = useMemo<SamlPropertiesInterface>(() => {
        const [ findPropVal, findMeta ] = fastSearch(authenticator);

        return {
            ArtifactResolveUrl: findPropVal<string>({ defaultValue: "", key: "ArtifactResolveUrl" }),
            AttributeConsumingServiceIndex: findPropVal<string>({
                defaultValue: "",
                key: "AttributeConsumingServiceIndex"
            }),
            AuthRedirectUrl: findPropVal<string>({ defaultValue: authorizedRedirectURL, key: "AuthRedirectUrl" }),
            AuthnContextClassRef: findPropVal<string>({ defaultValue: "", key: "AuthnContextClassRef" }),
            AuthnContextComparisonLevel: findPropVal<string>({ defaultValue: "", key: "AuthnContextComparisonLevel" }),
            AuthnReqProviderName: findPropVal<string>({ defaultValue: "", key: "AuthnReqProviderName" }),
            CustomAuthnContextClassRef: findPropVal<string>({ defaultValue: "", key: "CustomAuthnContextClassRef" }),
            DigestAlgorithm: findPropVal<string>({ defaultValue: "SHA256", key: "DigestAlgorithm" }),
            ForceAuthentication: findPropVal<string>({ defaultValue: "string", key: "ForceAuthentication" }),
            ISArtifactBindingEnabled: findPropVal<boolean>({ defaultValue: false, key: "ISArtifactBindingEnabled" }),
            /**
             * https://github.com/wso2/product-is/issues/17004
             */
            ISArtifactResolveReqSigned: findPropVal<boolean>({
                defaultValue: false,
                key: "ISArtifactResolveReqSigned"
            }),
            ISArtifactResponseSigned: findPropVal<boolean>({ defaultValue: false, key: "ISArtifactResponseSigned" }),
            ISAuthnReqSigned: findPropVal<boolean>({ defaultValue: false, key: "ISAuthnReqSigned" }),
            IdPEntityId: findPropVal<string>({ defaultValue: "", key: "IdPEntityId" }),
            IncludeAuthnContext: findPropVal<string>({ defaultValue: "string", key: "IncludeAuthnContext" }),
            IncludeCert: findPropVal<boolean>({ defaultValue: false, key: "IncludeCert" }),
            IncludeNameIDPolicy: findPropVal<boolean>({ defaultValue: false, key: "IncludeNameIDPolicy" }),
            IncludeProtocolBinding: findPropVal<boolean>({ defaultValue: false, key: "IncludeProtocolBinding" }),
            /**
             * `IsAuthnRespSigned` is by default set to true when creating the SAML IdP so,
             * always the value will be true. Keeping this here to indicate for the user and
             * to enable this if requirements gets changed.
             */
            IsAssertionEncrypted: findPropVal<boolean>({ defaultValue: false, key: "IsAssertionEncrypted" }),
            IsAuthnRespSigned: findPropVal<boolean>({ defaultValue: false, key: "IsAuthnRespSigned" }),
            IsLogoutEnabled: findPropVal<boolean>({ defaultValue: false, key: "IsLogoutEnabled" }),
            IsLogoutReqSigned: findPropVal<boolean>({ defaultValue: false, key: "IsLogoutReqSigned" }),
            IsSLORequestAccepted: findPropVal<boolean>({ defaultValue: false, key: "IsSLORequestAccepted" }),
            IsUserIdInClaims: findPropVal<boolean>({ defaultValue: false, key: "IsUserIdInClaims" }),
            LogoutReqUrl: findPropVal<string>({ defaultValue: "", key: "LogoutReqUrl" }),
            NameIDType: findPropVal<string>({
                defaultValue: findMeta({ key: "NameIDType" })?.defaultValue ?? DEFAULT_NAME_ID_FORMAT,
                key: "NameIDType"
            }),
            RequestMethod: findPropVal<string>({
                defaultValue: findMeta({ key: "RequestMethod" })?.defaultValue ?? DEFAULT_PROTOCOL_BINDING,
                key: "RequestMethod"
            }),
            ResponseAuthnContextClassRef: findPropVal<string>({
                defaultValue: "string",
                key: "ResponseAuthnContextClassRef"
            }),
            SPEntityId: findPropVal<string>({ defaultValue: "", key: "SPEntityId" }),
            SSOUrl: findPropVal<string>({ defaultValue: "", key: "SSOUrl" }),
            SignatureAlgorithm: findPropVal<string>({ defaultValue: "RSA with SHA256", key: "SignatureAlgorithm" }),
            commonAuthQueryParams: findPropVal<string>({ defaultValue: "", key: "commonAuthQueryParams" }),
            /**
             * https://github.com/wso2/product-is/issues/17004
             */
            isAssertionSigned: findPropVal<boolean>({ defaultValue: false, key: "isAssertionSigned" })
        } as SamlPropertiesInterface;
    }, []);

    const disabledFeatures: string[] = useSelector(
        (state: AppState) => state.config.ui.features?.identityProviders?.disabledFeatures
    );

    const getAlgorithmsDropdownFieldValidators = (): ((value: string) => string | undefined) => {
        // if (isLogoutReqSigned || isAuthnReqSigned) {
        //     return required;
        // }

        return (/* No validations */) => void 0;
    };

    const getIncludeAuthenticationContextOptions = (): {
        label: string;
        value: string;
    }[] => {
        return [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "As request", value: "as_request" }
        ];
    };

    const getForceAuthenticationOptions = (): {
        label: string;
        value: string;
    }[] => {
        return [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "As request", value: "no-authn" }
        ];
    };

    const getResponseAuthnContextClassRefOptions = (): {
        label: string;
        value: string;
    }[] => {
        return [
            { label: "Default", value: "default" },
            { label: "As response", value: "as_response" }
        ];
    };

    const getAvailableAuthContextComparisonLevelOptions = (): DropdownChild[] => {
        return [
            { key: 1, text: "Exact", value: "Exact" },
            { key: 2, text: "Minimum", value: "Minimum" },
            { key: 3, text: "Maximum", value: "Maximum" },
            { key: 4, text: "Better", value: "Better" }
        ];
    };

    const authenticationContextClassOptions: DropdownChild[] = [
        { key: 0, text: "Internet Protocol", value: "Internet Protocol" },
        { key: 1, text: "Internet Protocol Password", value: "Internet Protocol Password" },
        { key: 2, text: "Kerberos", value: "Kerberos" },
        { key: 3, text: "Mobile One Factor Unregistered", value: "Mobile One Factor Unregistered" },
        { key: 4, text: "Mobile Two Factor Unregistered", value: "Mobile Two Factor Unregistered" },
        { key: 5, text: "Mobile One Factor Contract", value: "Mobile One Factor Contract" },
        { key: 6, text: "Mobile Two Factor Contract", value: "Mobile Two Factor Contract" },
        { key: 7, text: "Password", value: "Password" },
        { key: 8, text: "Password Protected Transport", value: "Password Protected Transport (selected option)" },
        { key: 9, text: "Previous Session", value: "Previous Session" },
        { key: 10, text: "Public Key - X.509", value: "Public Key - X.509" },
        { key: 11, text: "Public Key - PGP", value: "Public Key - PGP" },
        { key: 12, text: "Public Key - SPKI", value: "Public Key - SPKI" },
        { key: 13, text: "Public Key - XML Digital Signature", value: "Public Key - XML Digital Signature" },
        { key: 14, text: "Smartcard", value: "Smartcard" },
        { key: 15, text: "Smartcard PKI", value: "Smartcard PKI" },
        { key: 16, text: "Software PKI", value: "Software PKI" },
        { key: 17, text: "Telephony", value: "Telephony" },
        { key: 18, text: "Telephony (Nomadic)", value: "Telephony (Nomadic)" },
        { key: 19, text: "Telephony (Personalized)", value: "Telephony (Personalized)" },
        { key: 20, text: "Telephony (Authenticated)", value: "Telephony (Authenticated)" },
        { key: 21, text: "Secure Remote Password", value: "Secure Remote Password" },
        {
            key: 22,
            text: "SSL/TLS Certificate-Based Client Authentication",
            value: "SSL/TLS Certificate-Based Client Authentication"
        },
        { key: 23, text: "Time Sync Token", value: "Time Sync Token" },
        { key: 24, text: "Unspecified", value: "Unspecified" },
        { key: 25, text: "Custom Authentication Context Class", value: "Custom Authentication Context Class" }
    ];

    return (
        <FinalForm
            onSubmit={ (values: any) => {
                onSubmit(values);
            } }
            initialValues={ initialFormValues }
            render={ ({ handleSubmit }: FormRenderProps) => (
                <form onSubmit={ handleSubmit }>
                    <SectionRow>
                        <FinalFormField
                            required={ true }
                            name="SPEntityId"
                            placeholder={ t(`${I18N_TARGET_KEY}.SPEntityId.placeholder`) }
                            ariaLabel={ t(`${I18N_TARGET_KEY}.SPEntityId.ariaLabel`) }
                            inputType="default"
                            maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                            minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                            component={ TextFieldAdapter }
                            label={
                                (<FormInputLabel htmlFor="SPEntityId">
                                    { t(`${I18N_TARGET_KEY}.SPEntityId.label`) }
                                </FormInputLabel>)
                            }
                            helperText={
                                (<Hint className="hint" compact>
                                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests
                                initiated from { config.ui.productName } to external Identity Provider (IdP). You need to
                                provide a unique value as the service provider <Code>entityId</Code>.
                                </Hint>)
                            }
                            readOnly={ readOnly }
                        />
                    </SectionRow>

                    <SectionRow>
                        <FinalFormField
                            required
                            name="SSOUrl"
                            placeholder={ t(`${I18N_TARGET_KEY}.SSOUrl.placeholder`) }
                            ariaLabel={ t(`${I18N_TARGET_KEY}.SSOUrl.ariaLabel`) }
                            data-testid={ `${componentId}-SSOUrl-field` }
                            label={ (
                                <FormInputLabel
                                    htmlFor="SSOUrl">
                                    { t(`${I18N_TARGET_KEY}.SSOUrl.label`) }
                                </FormInputLabel>
                            ) }
                            maxLength={ SSO_URL_LENGTH.max }
                            minLength={ SSO_URL_LENGTH.min }
                            component={ TextFieldAdapter }
                            helperText={
                                (<Hint className="hint" compact>
                                    { t(`${I18N_TARGET_KEY}.SSOUrl.hint`, {
                                        productName: config.ui.productName
                                    }) }
                                </Hint>)
                            }
                            readOnly={ readOnly }
                        />
                    </SectionRow>


                    <FinalFormField
                        name="AuthRedirectUrl"
                        inputType="copy_input"
                        placeholder={ t(`${I18N_TARGET_KEY}.AuthRedirectUrl.placeholder`) }
                        ariaLabel={ t(`${I18N_TARGET_KEY}.AuthRedirectUrl.ariaLabel`) }
                        data-testid={ `${componentId}-authorized-redirect-url` }
                        label={
                            (<FormInputLabel htmlFor="AuthRedirectUrl" disabled={ true }>
                                { t(`${I18N_TARGET_KEY}.AuthRedirectUrl.label`) }
                            </FormInputLabel>)
                        }
                        maxLength={ IDENTITY_PROVIDER_AUTHORIZED_REDIRECT_URL_LENGTH.max }
                        minLength={ IDENTITY_PROVIDER_AUTHORIZED_REDIRECT_URL_LENGTH.min }
                        helperText={
                            (<Hint className="hint" compact>
                                { t(`${I18N_TARGET_KEY}.AuthRedirectUrl.hint`, {
                                    productName: config.ui.productName
                                }) }
                            </Hint>)
                        }
                        component={ TextFieldAdapter }
                        readOnly={ readOnly }
                    />

                    <FinalFormField
                        required={ true }
                        name="IdPEntityId"
                        inputType="default"
                        placeholder={ t(`${I18N_TARGET_KEY}.IdPEntityId.placeholder`) }
                        ariaLabel={ t(`${I18N_TARGET_KEY}.IdPEntityId.ariaLabel`) }
                        data-testid={ `${componentId}-IdPEntityId-field` }
                        label={
                            (<FormInputLabel htmlFor="IdPEntityId" disabled={ true }>
                                { t(`${I18N_TARGET_KEY}.IdPEntityId.label`) }
                            </FormInputLabel>)
                        }
                        maxLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.max }
                        minLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.min }
                        component={ TextFieldAdapter }
                        helperText={
                            (<Hint className="hint" compact>
                                This is the <Code>&lt;saml2:Issuer&gt;</Code> value specified in the SAML responses
                                issued by the external IdP. Also, this needs to be a unique value to identify the
                                external IdP within your organization.
                            </Hint>)
                        }
                        readOnly={ readOnly }
                    />

                    <FinalFormField
                        required={ true }
                        name="NameIDType"
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        placeholder={ t(`${I18N_TARGET_KEY}.NameIDType.placeholder`) }
                        ariaLabel={ t(`${I18N_TARGET_KEY}.NameIDType.ariaLabel`) }
                        data-testid={ `${componentId}-NameIDType-field` }
                        options={ getAvailableNameIDFormats() }
                        component={ SelectFieldAdapter }
                        label={
                            (<FormInputLabel htmlFor="NameIDType">
                                { t(`${I18N_TARGET_KEY}.NameIDType.label`) }
                            </FormInputLabel>)
                        }
                        type="dropdown"
                        helperText={
                            (<Hint className="hint" compact>
                                { t(`${I18N_TARGET_KEY}.NameIDType.hint`, {
                                    productName: config.ui.productName
                                }) }
                            </Hint>)
                        }
                        readOnly={ readOnly }
                    />

                    <FinalFormField
                        required={ true }
                        name="RequestMethod"
                        placeholder={ t(`${I18N_TARGET_KEY}.RequestMethod.placeholder`) }
                        ariaLabel={ t(`${I18N_TARGET_KEY}.RequestMethod.ariaLabel`) }
                        data-testid={ `${componentId}-RequestMethod-field` }
                        options={ getAvailableProtocolBindingTypes() }
                        label={
                            (<FormInputLabel htmlFor="RequestMethod">
                                { t(`${I18N_TARGET_KEY}.RequestMethod.label`) }
                            </FormInputLabel>)
                        }
                        helperText={
                            (<Hint className="hint" compact>
                                { t(`${I18N_TARGET_KEY}.RequestMethod.hint`) }
                            </Hint>)
                        }
                        component={ SelectFieldAdapter }
                        readOnly={ readOnly }
                    />

                    <FormSection heading="Single Logout">
                        <Grid>
                            <SectionRow>
                                <FinalFormField
                                    name="IsSLORequestAccepted"
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.IsSLORequestAccepted.ariaLabel`) }
                                    data-testid={ `${componentId}-IsSLORequestAccepted-field` }
                                    label={
                                        (<FormInputLabel htmlFor="IsSLORequestAccepted">
                                            { t(`${I18N_TARGET_KEY}.IsSLORequestAccepted.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.IsSLORequestAccepted.hint`, {
                                                productName: config.ui.productName
                                            }) }
                                        </Hint>)
                                    }
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                            <SectionRow>
                                <FinalFormField
                                    required={ false }
                                    name="IsLogoutEnabled"
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.IsLogoutEnabled.ariaLabel`) }
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    data-testid={ `${componentId}-IsLogoutEnabled-field` }
                                    label={
                                        (<FormInputLabel htmlFor="IsLogoutEnabled">
                                            { t(`${I18N_TARGET_KEY}.IsLogoutEnabled.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.IsLogoutEnabled.hint`) }
                                        </Hint>)
                                    }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                            <SectionRow>
                                <FinalFormField
                                    name="LogoutReqUrl"
                                    inputType="url"
                                    component={ TextFieldAdapter }
                                    placeholder={ t(`${I18N_TARGET_KEY}.LogoutReqUrl.placeholder`) }
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.LogoutReqUrl.ariaLabel`) }
                                    data-testid={ `${componentId}-LogoutReqUrl-field` }
                                    label={
                                        (<FormInputLabel htmlFor="LogoutReqUrl">
                                            { t(`${I18N_TARGET_KEY}.LogoutReqUrl.label`) }
                                        </FormInputLabel>)
                                    }
                                    maxLength={ LOGOUT_URL_LENGTH.max }
                                    minLength={ LOGOUT_URL_LENGTH.min }
                                    helperText={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.LogoutReqUrl.hint`) }
                                        </Hint>)
                                    }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                        </Grid>
                        <Divider hidden />
                    </FormSection>

                    <FormSection heading="Request & Response Signing">
                        <Grid>
                            <SectionRow>
                                <FinalFormField
                                    required={ false }
                                    disabled={ false }
                                    name="IsAuthnRespSigned"
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.IsAuthnRespSigned.ariaLabel`) }
                                    data-testid={ `${componentId}-IsAuthnRespSigned-field` }
                                    label={
                                        (<FormInputLabel htmlFor="IsAuthnRespSigned">
                                            { t(`${I18N_TARGET_KEY}.IsAuthnRespSigned.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.IsAuthnRespSigned.hint`) }
                                        </Hint>)
                                    }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                            <SectionRow>
                                <FinalFormField
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    required={ false }
                                    name="IsLogoutReqSigned"
                                    // initialValue={ isLogoutReqSigned }
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.IsLogoutReqSigned.ariaLabel`) }
                                    data-testid={ `${componentId}-IsLogoutReqSigned-field` }
                                    label={
                                        (<FormInputLabel htmlFor="IsLogoutEnabled">
                                            { t(`${I18N_TARGET_KEY}.IsLogoutReqSigned.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.IsLogoutReqSigned.hint`, {
                                                productName: config.ui.productName
                                            }) }
                                        </Hint>)
                                    }
                                    // listen={ (checked: any) => setIsLogoutReqSigned(Boolean(checked)) }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                            <SectionRow>
                                <FinalFormField
                                    required={ false }
                                    name="ISAuthnReqSigned"
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.ISAuthnReqSigned.ariaLabel`) }
                                    data-testid={ `${componentId}-ISAuthnReqSigned-field` }
                                    label={
                                        (<FormInputLabel htmlFor="ISAuthnReqSigned">
                                            { t(`${I18N_TARGET_KEY}.ISAuthnReqSigned.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.ISAuthnReqSigned.hint`, {
                                                productName: config.ui.productName
                                            }) }
                                        </Hint>)
                                    }
                                    // listen={ (value: any) => setIsAuthnReqSigned(Boolean(value)) }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>

                            <FormSpy subscription={ { dirty: true, values: true } }>
                                { ({ values }: { values: SamlPropertiesInterface }) => {
                                    const isSignatureAlgorithmFieldEditable: boolean =
                                        values.IsLogoutReqSigned || values.ISAuthnReqSigned;

                                    return (
                                        <>
                                            <SectionRow>
                                                <FinalFormField
                                                    required={ isSignatureAlgorithmFieldEditable }
                                                    name="SignatureAlgorithm"
                                                    component={ SelectFieldAdapter }
                                                    disabled={ !isSignatureAlgorithmFieldEditable }
                                                    placeholder={
                                                        t(`${I18N_TARGET_KEY}.SignatureAlgorithm.placeholder`)
                                                    }
                                                    ariaLabel={ t(`${I18N_TARGET_KEY}.SignatureAlgorithm.ariaLabel`) }
                                                    data-testid={ `${componentId}-SignatureAlgorithm-field` }
                                                    options={ getSignatureAlgorithmOptionsMapped(authenticator.meta) }
                                                    label={
                                                        (<FormInputLabel htmlFor="SignatureAlgorithm">
                                                            { t(`${I18N_TARGET_KEY}.SignatureAlgorithm.label`) }
                                                        </FormInputLabel>)
                                                    }
                                                    validate={ getAlgorithmsDropdownFieldValidators() }
                                                    readOnly={ readOnly }
                                                />
                                            </SectionRow>

                                            <SectionRow>
                                                <FinalFormField
                                                    required={ isSignatureAlgorithmFieldEditable }
                                                    name="DigestAlgorithm"
                                                    type="select"
                                                    component={ SelectFieldAdapter }
                                                    disabled={ !isSignatureAlgorithmFieldEditable }
                                                    placeholder={ t(`${I18N_TARGET_KEY}.DigestAlgorithm.placeholder`) }
                                                    ariaLabel={ t(`${I18N_TARGET_KEY}.DigestAlgorithm.ariaLabel`) }
                                                    data-testid={ `${componentId}-DigestAlgorithm-field` }
                                                    options={ getDigestAlgorithmOptionsMapped(authenticator.meta) }
                                                    label={
                                                        (<FormInputLabel htmlFor="DigestAlgorithm">
                                                            { t(`${I18N_TARGET_KEY}.DigestAlgorithm.label`) }
                                                        </FormInputLabel>)
                                                    }
                                                    validate={ getAlgorithmsDropdownFieldValidators() }
                                                    readOnly={ readOnly }
                                                />
                                            </SectionRow>
                                        </>
                                    );
                                } }
                            </FormSpy>
                        </Grid>
                        <Divider hidden />
                    </FormSection>

                    <FormSection heading="Advanced">
                        <Grid>
                            <SectionRow>
                                <FinalFormField
                                    required={ false }
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    name="IncludeProtocolBinding"
                                    // initialValue={ includeProtocolBinding }
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.IncludeProtocolBinding.ariaLabel`) }
                                    data-testid={ `${componentId}-IncludeProtocolBinding-field` }
                                    label={
                                        (<FormInputLabel htmlFor="IncludeProtocolBinding">
                                            { t(`${I18N_TARGET_KEY}.IncludeProtocolBinding.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.IncludeProtocolBinding.hint`) }
                                        </Hint>)
                                    }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                            <SectionRow>
                                <FinalFormField
                                    required={ false }
                                    component={ CheckboxFieldAdapter }
                                    type="checkbox"
                                    name="IsUserIdInClaims"
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.IsUserIdInClaims.ariaLabel`) }
                                    data-testid={ `${componentId}-IsUserIdInClaims-field` }
                                    label={
                                        (<FormInputLabel htmlFor="IsUserIdInClaims">
                                            { t(`${I18N_TARGET_KEY}.IsUserIdInClaims.label`) }
                                        </FormInputLabel>)
                                    }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.IsUserIdInClaims.hint`) }
                                        </Hint>)
                                    }
                                    // listen={ (value: any) => setIsUserIdInClaims(Boolean(value)) }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>

                            { identityProviderConfig?.extendedSamlConfig?.enableAssertionSigningEnabled && (
                                <SectionRow>
                                    <FinalFormField
                                        required={ false }
                                        component={ CheckboxFieldAdapter }
                                        type="checkbox"
                                        name="isAssertionSigned"
                                        ariaLabel={ "Enable Assertion Signing" }
                                        data-testid={ `${componentId}-isAssertionSigned-field` }
                                        label={
                                            (<FormInputLabel htmlFor="isAssertionSigned">
                                                { t(`${I18N_TARGET_KEY}.isAssertionSigned.label`) }
                                            </FormInputLabel>)
                                        }
                                        hint={
                                            (<Hint className="hint" compact>
                                                { t(`${I18N_TARGET_KEY}.isAssertionSigned.hint`) }
                                            </Hint>)
                                        }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>
                            ) }
                            { identityProviderConfig?.extendedSamlConfig?.includePublicCertEnabled && (
                                <SectionRow>
                                    <FinalFormField
                                        required={ false }
                                        name="IncludeCert"
                                        component={ CheckboxFieldAdapter }
                                        type="checkbox"
                                        ariaLabel={ "Include public certificate" }
                                        data-testid={ `${componentId}-includeCert-field` }
                                        label={
                                            (<FormInputLabel htmlFor="includeCert">
                                                { t(`${I18N_TARGET_KEY}.includeCert.label`) }
                                            </FormInputLabel>)
                                        }
                                        hint={
                                            (<Hint className="hint" compact>
                                                { t(`${I18N_TARGET_KEY}.includeCert.hint`) }
                                            </Hint>)
                                        }
                                        // listen={ (value: any) => setIncludeCert(Boolean(value)) }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>
                            ) }
                            { identityProviderConfig?.extendedSamlConfig?.includeNameIDPolicyEnabled && (
                                <SectionRow>
                                    <FinalFormField
                                        required={ false }
                                        component={ CheckboxFieldAdapter }
                                        type="checkbox"
                                        name="IncludeNameIDPolicy"
                                        ariaLabel={ "Include Name ID Policy" }
                                        data-testid={ `${componentId}-includeNameIDPolicy-field` }
                                        label={
                                            (<FormInputLabel htmlFor="IncludeNameIDPolicy">
                                                { t(`${I18N_TARGET_KEY}.includeNameIDPolicy.label`) }
                                            </FormInputLabel>)
                                        }
                                        hint={
                                            (<Hint className="hint" compact>
                                                { t(`${I18N_TARGET_KEY}.includeNameIDPolicy.hint`) }
                                            </Hint>)
                                        }
                                        // listen={ (value: any) => setIncludeNameIDPolicy(Boolean(value)) }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>
                            ) }
                            { identityProviderConfig?.extendedSamlConfig?.isAssertionEncryptionEnabled && (
                                <SectionRow>
                                    <FinalFormField
                                        required={ false }
                                        name="IsAssertionEncrypted"
                                        component={ CheckboxFieldAdapter }
                                        type="checkbox"
                                        ariaLabel={ "Enable Assertion Encryption" }
                                        data-testid={ `${componentId}-isEnableAssertionEncryption-field` }
                                        label={
                                            (<FormInputLabel htmlFor="IsEnableAssertionEncryption">
                                                { t(`${I18N_TARGET_KEY}.isEnableAssertionEncryption.label`) }
                                            </FormInputLabel>)
                                        }
                                        hint={
                                            (<Hint className="hint" compact>
                                                { t(`${I18N_TARGET_KEY}.isEnableAssertionEncryption.hint`) }
                                            </Hint>)
                                        }
                                        // listen={ (value: any) => setIsEnableAssetionEncryption(Boolean(value)) }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>
                            ) }
                            { identityProviderConfig.extendedSamlConfig.includeAuthenticationContextEnabled && (
                                <SectionRow>
                                    { /* IncludeAuthnContext */ }
                                    <p>Include authentication context</p>
                                    <FinalFormField
                                        component={ RadioGroupFieldAdapter }
                                        name={ "IncludeAuthnContext" }
                                        options={ getIncludeAuthenticationContextOptions() }
                                        required={ false }
                                    />
                                </SectionRow>
                            ) }

                            { identityProviderConfig.extendedSamlConfig.forceAuthenticationEnabled && (
                                <SectionRow>
                                    { /* ForceAuthentication */ }
                                    <p>Force authentication</p>
                                    <FinalFormField
                                        component={ RadioGroupFieldAdapter }
                                        name={ "ForceAuthentication" }
                                        options={ getForceAuthenticationOptions() }
                                        required={ false }
                                    />
                                </SectionRow>
                            ) }

                            { identityProviderConfig.extendedSamlConfig.responseAuthenticationContextClassEnabled && (
                                <SectionRow>
                                    <p>Response Authentication Context Class</p>
                                    { /* ResponseAuthnContextClassRef */ }
                                    <FinalFormField
                                        component={ RadioGroupFieldAdapter }
                                        name={ "ResponseAuthnContextClassRef" }
                                        options={ getResponseAuthnContextClassRefOptions() }
                                        required={ false }
                                    />
                                </SectionRow>
                            ) }

                            { identityProviderConfig.extendedSamlConfig.authContextComparisonLevelEnabled && (
                                <SectionRow>
                                    <FinalFormField
                                        component={ SelectFieldAdapter }
                                        required={ false }
                                        name="AuthnContextComparisonLevel"
                                        // value={ formValues?.AuthnContextComparisonLevel }
                                        // defaultValue={ formValues?.AuthnContextComparisonLevel }
                                        placeholder={ t(`${I18N_TARGET_KEY}.authContextComparisonLevel.placeholder`) }
                                        ariaLabel={ t(`${I18N_TARGET_KEY}.authContextComparisonLevel.ariaLabel`) }
                                        data-testid={ `${componentId}-authContextComparisonLevel-field` }
                                        options={ getAvailableAuthContextComparisonLevelOptions() }
                                        label={
                                            (<FormInputLabel htmlFor="AuthnContextComparisonLevel">
                                                { t(`${I18N_TARGET_KEY}.authContextComparisonLevel.label`) }
                                            </FormInputLabel>)
                                        }
                                        helperText={
                                            (<Hint className="hint" compact>
                                                { t(`${I18N_TARGET_KEY}.authContextComparisonLevel.hint`) }
                                            </Hint>)
                                        }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>
                            ) }

                            { identityProviderConfig.extendedSamlConfig.attributeConsumingServiceIndexEnabled && (
                                <SectionRow>
                                    <FinalFormField
                                        name="AttributeConsumingServiceIndex"
                                        component={ TextFieldAdapter }
                                        inputType="default"
                                        placeholder={
                                            t(`${I18N_TARGET_KEY}.attributeConsumingServiceIndex.placeholder`)
                                        }
                                        ariaLabel={ t(`${I18N_TARGET_KEY}.attributeConsumingServiceIndex.ariaLabel`) }
                                        data-testid={ `${componentId}-attributeConsumingServiceIndex-field` }
                                        label={
                                            (<FormInputLabel htmlFor="AttributeConsumingServiceIndex">
                                                { t(`${I18N_TARGET_KEY}.attributeConsumingServiceIndex.label`) }
                                            </FormInputLabel>)
                                        }
                                        maxLength={ LOGOUT_URL_LENGTH.max }
                                        minLength={ LOGOUT_URL_LENGTH.min }
                                        helperText={
                                            (<Hint className="hint" compact>
                                                { t(`${I18N_TARGET_KEY}.attributeConsumingServiceIndex.hint`) }
                                            </Hint>)
                                        }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>
                            ) }

                            { !disabledFeatures?.includes("identityProviders.saml.authenticationContextClass") && (
                                <SectionRow>
                                    <Typography variant="body1">
                                        { t(`${I18N_TARGET_KEY}.authenticationContextClass.label`) }
                                    </Typography>
                                    <Autocomplete
                                        multiple
                                        className="forms-wrapped-autocomplete"
                                        disableCloseOnSelect
                                        size="small"
                                        options={ authenticationContextClassOptions }
                                        getOptionLabel={ (role: DropdownChild) => role?.text as string }
                                        renderInput={ (params: AutocompleteRenderInputParams) => {
                                            params.inputProps.className = "forms-wrapped-autocomplete-render-input";

                                            return (
                                                <TextField
                                                    { ...params }
                                                    size="small"
                                                    placeholder={ t(
                                                        `${I18N_TARGET_KEY}.authenticationContextClass.placeholder`
                                                    ) }
                                                />
                                            );
                                        } }
                                    />
                                </SectionRow>
                            ) }

                            { !disabledFeatures?.includes(
                                "identityProviders.saml.customAuthenticationContextClass"
                            ) && (
                                <SectionRow>
                                    <FinalFormField
                                        label={
                                            (<FormInputLabel htmlFor="CustomAuthnContextClassRef">
                                                { t(`${I18N_TARGET_KEY}.customAuthenticationContextClass.label`) }
                                            </FormInputLabel>)
                                        }
                                        component={ TextFieldAdapter }
                                        name="CustomAuthnContextClassRef"
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        inputType="default"
                                        placeholder={ t(
                                            `${I18N_TARGET_KEY}.customAuthenticationContextClass.placeholder`
                                        ) }
                                        ariaLabel={ t(`${I18N_TARGET_KEY}.customAuthenticationContextClass.ariaLabel`) }
                                        data-testid={ `${componentId}-customAuthenticationContextClass-field` }
                                    />
                                </SectionRow>
                            ) }
                            <SectionRow>
                                { /* <Field.QueryParams
                                    // value={ formValues?.commonAuthQueryParams }
                                    label={ t(`${ I18N_TARGET_KEY }.commonAuthQueryParams.label`) }
                                    ariaLabel={ t(`${ I18N_TARGET_KEY }.commonAuthQueryParams.ariaLabel`) }
                                    name="commonAuthQueryParams"
                                    readOnly={ readOnly }
                                /> */ }
                            </SectionRow>
                            <SectionRow>
                                <FinalFormField
                                    name="AuthnReqProviderName"
                                    inputType="default"
                                    component={ TextFieldAdapter }
                                    placeholder={ t(`${I18N_TARGET_KEY}.authnReqProviderName.placeholder`) }
                                    ariaLabel={ t(`${I18N_TARGET_KEY}.authnReqProviderName.ariaLabel`) }
                                    data-testid={ `${componentId}-authnReqProviderName-field` }
                                    label={
                                        (<FormInputLabel htmlFor="AuthnReqProviderName">
                                            { t(`${I18N_TARGET_KEY}.authnReqProviderName.label`) }
                                        </FormInputLabel>)
                                    }
                                    maxLength={ IDENTITY_PROVIDER_AUTHENTICATION_REQUEST_PROVIDER_NAME_LENGTH.max }
                                    minLength={ IDENTITY_PROVIDER_AUTHENTICATION_REQUEST_PROVIDER_NAME_LENGTH.min }
                                    helperText={
                                        (<Hint className="hint" compact>
                                            { t(`${I18N_TARGET_KEY}.authnReqProviderName.hint`) }
                                        </Hint>)
                                    }
                                    readOnly={ readOnly }
                                />
                            </SectionRow>
                        </Grid>
                        <Divider hidden />
                    </FormSection>

                    { identityProviderConfig.extendedSamlConfig.isArtifactBindingEnabled && (
                        <FormSection heading="Artifact Binding">
                            <Grid>
                                <SectionRow>
                                    <FinalFormField
                                        required={ false }
                                        component={ CheckboxFieldAdapter }
                                        type="checkbox"
                                        name="ISArtifactBindingEnabled"
                                        ariaLabel={ t(`${I18N_TARGET_KEY}.isArtifactBindingEnabled.label`) }
                                        data-testid={ `${componentId}-isArtifactBindingEnabled-field` }
                                        label={
                                            (<FormInputLabel htmlFor="isArtifactBindingEnabled">
                                                { t(`${I18N_TARGET_KEY}.isArtifactBindingEnabled.label`) }
                                            </FormInputLabel>)
                                        }
                                        readOnly={ readOnly }
                                    />
                                </SectionRow>

                                <FormSpy subscription={ { dirty: true, values: true } }>
                                    { ({ values }: { values: SamlPropertiesInterface }) => {
                                        return (
                                            <>
                                                <SectionRow>
                                                    <FinalFormField
                                                        name="ArtifactResolveUrl"
                                                        inputType="url"
                                                        component={ TextFieldAdapter }
                                                        placeholder={ t(
                                                            `${I18N_TARGET_KEY}.artifactResolveEndpointUrl.placeholder`
                                                        ) }
                                                        ariaLabel={ t(
                                                            `${I18N_TARGET_KEY}.artifactResolveEndpointUrl.ariaLabel`
                                                        ) }
                                                        data-testid={
                                                            `${componentId}-artifactResolveEndpointUrl-field`
                                                        }
                                                        label={
                                                            (<FormInputLabel htmlFor="artifactResolveEndpointUrl">
                                                                { t(
                                                                    I18N_TARGET_KEY +
                                                                    ".artifactResolveEndpointUrl.label"
                                                                ) }
                                                            </FormInputLabel>)
                                                        }
                                                        maxLength={ LOGOUT_URL_LENGTH.max }
                                                        minLength={ LOGOUT_URL_LENGTH.min }
                                                        readOnly={ readOnly }
                                                        disabled={ !values.ISArtifactBindingEnabled }
                                                    />
                                                </SectionRow>

                                                <SectionRow>
                                                    <FinalFormField
                                                        required={ false }
                                                        name="ISArtifactResolveReqSigned"
                                                        component={ CheckboxFieldAdapter }
                                                        type="checkbox"
                                                        ariaLabel={ "Enable Artifact resolve request signing" }
                                                        data-testid={
                                                            `${componentId}-isArtifactResolveReqSigned-field`
                                                        }
                                                        label={
                                                            (<FormInputLabel htmlFor="isArtifactResolveReqSigned">
                                                                { t(
                                                                    I18N_TARGET_KEY +
                                                                    ".isArtifactResolveReqSigned.label"
                                                                ) }
                                                            </FormInputLabel>)
                                                        }
                                                        readOnly={ readOnly }
                                                        disabled={ !values.ISArtifactBindingEnabled }
                                                    />
                                                </SectionRow>
                                                <SectionRow>
                                                    <FinalFormField
                                                        required={ false }
                                                        name="ISArtifactResponseSigned"
                                                        component={ CheckboxFieldAdapter }
                                                        type="checkbox"
                                                        ariaLabel={ "Enable artifact response signing" }
                                                        data-testid={ `${componentId}-isArtifactResponseSigned-field` }
                                                        label={
                                                            (<FormInputLabel htmlFor="isArtifactResponseSigned">
                                                                { t(
                                                                    I18N_TARGET_KEY +
                                                                    ".isArtifactResponseSigned.label"
                                                                ) }
                                                            </FormInputLabel>)
                                                        }
                                                        readOnly={ readOnly }
                                                        disabled={ !values.ISArtifactBindingEnabled }
                                                    />
                                                </SectionRow>
                                            </>
                                        );
                                    } }
                                </FormSpy>
                            </Grid>
                        </FormSection>
                    ) }

                    <Button
                        variant="contained"
                        className="update-button"
                        type="submit"
                        disabled={ isSubmitting }
                        loading={ isSubmitting }
                        data-componentid={ `${componentId}-update-button` }
                    >
                        { t("common:update") }
                    </Button>
                </form>
            ) }
        ></FinalForm>
    );
}

const SectionRow: FunctionComponent<PropsWithChildren<{ width?: SemanticWIDTHS }>> = ({
    width = 16,
    children
}: PropsWithChildren<{ width?: SemanticWIDTHS }>): ReactElement => {
    return (
        <Grid.Row columns={ 1 }>
            <Grid.Column width={ width }>{ children }</Grid.Column>
        </Grid.Row>
    );
};
