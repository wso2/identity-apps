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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppState, ConfigReducerStateInterface } from "@wso2is/admin.core.v1";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1";
import { TestableComponentInterface } from "@wso2is/core/models";
import { DropdownChild, Field, Form } from "@wso2is/form";
import { Code, FormInputLabel, FormSection } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid, SemanticWIDTHS } from "semantic-ui-react";
import {
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormInitialValuesInterface
} from "../../../../models/authenticators";
import {
    FederatedAuthenticatorInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../../../models/connection";
import {
    DEFAULT_NAME_ID_FORMAT,
    DEFAULT_PROTOCOL_BINDING,
    IDENTITY_PROVIDER_AUTHORIZED_REDIRECT_URL_LENGTH,
    IDENTITY_PROVIDER_ENTITY_ID_LENGTH,
    LOGOUT_URL_LENGTH,
    SERVICE_PROVIDER_ENTITY_ID_LENGTH,
    SSO_URL_LENGTH,
    composeValidators,
    fastSearch,
    getAvailableNameIDFormats,
    getAvailableProtocolBindingTypes,
    getDigestAlgorithmOptionsMapped,
    getSignatureAlgorithmOptionsMapped,
    hasLength,
    isUrl,
    required
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
interface SamlSettingsFormPropsInterface extends TestableComponentInterface {
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
    ISArtifactBindingEnabled?: boolean,

    /**
     * https://github.com/wso2/product-is/issues/17004
     */
    ISArtifactResolveReqSigned?: string,
    ISArtifactResponseSigned?: string,
    isAssertionSigned?: boolean,
    attributeConsumingServiceIndex?: string;
    AuthnContextComparisonLevel?: string;
    IsAssertionEncrypted?: boolean;
    AuthnContextClassRef?: string;
}

const FORM_ID: string = "saml-authenticator-form";

/**
 * SAML Authenticator settings form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const SamlAuthenticatorSettingsForm: FunctionComponent<SamlSettingsFormPropsInterface> = (
    props: SamlSettingsFormPropsInterface
): ReactElement => {

    const {
        authenticator,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const disabledFeatures: string[] = useSelector((state: AppState) =>
        state.config.ui.features?.identityProviders?.disabledFeatures);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { t } = useTranslation();

    const [ formValues, setFormValues ] = useState<SamlPropertiesInterface>({} as SamlPropertiesInterface);

    const [ isSLORequestAccepted, setIsSLORequestAccepted ] = useState<boolean>(false);
    const [ includeProtocolBinding, setIncludeProtocolBinding ] = useState<boolean>(false);
    const [ isUserIdInClaims, setIsUserIdInClaims ] = useState<boolean>(false);
    const [ isLogoutEnabled, setIsLogoutEnabled ] = useState<boolean>(false);

    const [ includeCert, setIncludeCert ] = useState<boolean>(false);
    const [ includeNameIDPolicy, setIncludeNameIDPolicy ] = useState<boolean>(false);
    const [ isEnableAssetionEncryption, setIsEnableAssetionEncryption ] = useState<boolean>(false);
    const [ isArtifactBindingEnabled, setIsArtifactBindingEnabled ] = useState<boolean>(false);
    const [ selectedAuthnContextClasses, setSelectedAuthnContextClasses ] = useState<DropdownChild[]>([]);

    const getIncludeAuthenticationContextOptions = (): DropdownChild[] => {
        return [
            { key: 1, text: "Yes", value: "yes" },
            { key: 2, text: "No", value: "no" },
            { key: 3, text: "As request", value: "as_request" }
        ];
    };

    const getForceAuthenticationOptions = (): DropdownChild[] => {
        return [
            { key: 1, text: "Yes", value: "yes" },
            { key: 2, text: "No", value: "no" },
            { key: 3, text: "As request", value: "no-authn" }
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

    const getResponseAuthnContextClassRefOptions = (): DropdownChild[] => {
        return [

            { key: 1, text: "Default", value: "default" },
            { key: 2, text: "As response", value: "as_response" }
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
        { key: 22, text: "SSL/TLS Certificate-Based Client Authentication",
            value: "SSL/TLS Certificate-Based Client Authentication" },
        { key: 23, text: "Time Sync Token", value: "Time Sync Token" },
        { key: 24, text: "Unspecified", value: "Unspecified" },
        { key: 25, text: "Custom Authentication Context Class", value: "Custom Authentication Context Class" }
    ];

    const authorizedRedirectURL: string = config?.deployment?.customServerHost + "/commonauth";

    /**
     * ISAuthnReqSigned, IsLogoutReqSigned these two fields states will be used by other
     * fields states. Basically, algorithms fields enable and disable states will be
     * determine by these two states.
     */
    const [ isLogoutReqSigned, setIsLogoutReqSigned ] = useState<boolean>(false);
    const [ isAuthnReqSigned, setIsAuthnReqSigned ] = useState<boolean>(false);

    /**
     * This isAlgorithmsEnabled state will control the enable and disable state of
     * algorithm dropdowns (Signature and Digest)
     */
    const [ isAlgorithmsEnabled, setIsAlgorithmsEnabled ] = useState<boolean>(false);

    const initialFormValues: SamlPropertiesInterface = useMemo<SamlPropertiesInterface>(() => {

        const [ findPropVal, findMeta ] = fastSearch(authenticator);

        return {
            ArtifactResolveUrl: findPropVal<string>({ defaultValue: "", key: "ArtifactResolveUrl" }),
            AuthRedirectUrl: findPropVal<string>({ defaultValue: authorizedRedirectURL, key: "AuthRedirectUrl" }),
            AuthnContextClassRef: findPropVal<string>({ defaultValue: "", key: "AuthnContextClassRef" }),
            AuthnContextComparisonLevel: findPropVal<string>({ defaultValue: "", key: "AuthnContextComparisonLevel" }),
            DigestAlgorithm: findPropVal<string>({ defaultValue: "SHA256", key: "DigestAlgorithm" }),
            ISArtifactBindingEnabled:  findPropVal<boolean>({ defaultValue: false, key: "ISArtifactBindingEnabled" }),
            /**
             * https://github.com/wso2/product-is/issues/17004
             */
            ISArtifactResolveReqSigned: findPropVal<string>({
                defaultValue: "string",
                key: "ISArtifactResolveReqSigned" }
            ),
            ISArtifactResponseSigned: findPropVal<string>({ defaultValue: "string", key: "ISArtifactResponseSigned" }),
            ISAuthnReqSigned: findPropVal<boolean>({ defaultValue: false, key: "ISAuthnReqSigned" }),
            IdPEntityId: findPropVal<string>({ defaultValue: "", key: "IdPEntityId" }),
            IncludeProtocolBinding: findPropVal<boolean>({ defaultValue: false, key: "IncludeProtocolBinding" }),
            IsAssertionEncrypted: findPropVal<boolean>({ defaultValue: false, key: "IsAssertionEncrypted" }),
            /**
             * `IsAuthnRespSigned` is by default set to true when creating the SAML IdP so,
             * always the value will be true. Keeping this here to indicate for the user and
             * to enable this if requirements gets changed.
             */
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
            SPEntityId: findPropVal<string>({ defaultValue: "", key: "SPEntityId" }),
            SSOUrl: findPropVal<string>({ defaultValue: "", key: "SSOUrl" }),
            SignatureAlgorithm: findPropVal<string>({ defaultValue: "RSA with SHA256", key: "SignatureAlgorithm" }),
            commonAuthQueryParams: findPropVal<string>({ defaultValue: "", key: "commonAuthQueryParams" }),
            customAuthnContextClassRef: findPropVal<string>({ defaultValue: "", key: "CustomAuthnContextClassRef" }),
            /**
             * https://github.com/wso2/product-is/issues/17004
             */
            isAssertionSigned: findPropVal<boolean>({ defaultValue: false, key: "isAssertionSigned" })

        } as SamlPropertiesInterface;

    }, []);

    useEffect(() => {
        setIsSLORequestAccepted(initialFormValues.IsSLORequestAccepted);
        setIncludeProtocolBinding(initialFormValues.IncludeProtocolBinding);
        setIsUserIdInClaims(initialFormValues.IsUserIdInClaims);
        setIsLogoutEnabled(initialFormValues.IsLogoutEnabled);
        setIsLogoutReqSigned(initialFormValues.IsLogoutReqSigned);
        setIsAuthnReqSigned(initialFormValues.ISAuthnReqSigned);

        setIsArtifactBindingEnabled(initialFormValues.ISArtifactBindingEnabled);
        setFormValues({ ...initialFormValues });
        setIsEnableAssetionEncryption(initialFormValues.IsAssertionEncrypted);

        const initiallySelectedAuthnContextClasses: DropdownChild[] = initialFormValues.AuthnContextClassRef?.split(",")
            .map(
                (contextClass: string) =>
                    authenticationContextClassOptions.find(
                        (classOption: DropdownChild) => classOption.value === contextClass
                    )
            );

        // Filtering falsy values before updating the state, as `.find` returns undefined when a match is not found.
        setSelectedAuthnContextClasses(initiallySelectedAuthnContextClasses?.filter(Boolean));
    }, [ initialFormValues ]);

    useEffect(() => {
        const ifEitherOneOfThemIsChecked: boolean = isLogoutReqSigned || isAuthnReqSigned;

        setIsAlgorithmsEnabled(ifEitherOneOfThemIsChecked);
    }, [ isLogoutReqSigned, isAuthnReqSigned ]);

    const onFormSubmit = (values: { [ key: string ]: any }): void => {
        const manualOverride: { [key: string]: boolean | string | string[] } = {
            "AuthnContextClassRef": selectedAuthnContextClasses?.map(
                (authnContextClass: DropdownChild) => authnContextClass.value
            ).join(","),
            "ISAuthnReqSigned": isAuthnReqSigned,
            "IncludeProtocolBinding": includeProtocolBinding,
            "IsLogoutEnabled": isLogoutEnabled,
            "IsLogoutReqSigned": isLogoutReqSigned,
            "IsSLORequestAccepted": isSLORequestAccepted,
            "IsUserIdInClaims": isUserIdInClaims
        };

        const manualOverrideKeys: Set<string> = new Set<string>(Object.keys(manualOverride));
        const authn: FederatedAuthenticatorInterface = ({
            ...authenticator.data,
            properties: [
                ...Object.keys(values)
                    .filter((key: string) => !manualOverrideKeys.has(key))
                    .map((key: string) => ({ key, value: values[key] })),
                ...Object.keys(manualOverride)
                    .map((key: string) => ({ key, value: manualOverride[key] })) as any
            ]
        });

        onSubmit(authn);
    };

    const getAlgorithmsDropdownFieldValidators = (): (value: string) => string | undefined => {
        if (isLogoutReqSigned || isAuthnReqSigned) {
            return required;
        }

        return (/* No validations */) => void 0;
    };

    return (
        <Form
            id={ FORM_ID }
            onSubmit={ onFormSubmit }
            uncontrolledForm={ true }
            initialValues={ formValues }
        >
            <Field.Input
                required={ true }
                name="SPEntityId"
                value={ formValues?.SPEntityId }
                placeholder={ t(`${ I18N_TARGET_KEY }.SPEntityId.placeholder`) }
                ariaLabel={ t(`${ I18N_TARGET_KEY }.SPEntityId.ariaLabel`) }
                inputType="default"
                maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                label={ (
                    <FormInputLabel htmlFor="SPEntityId">
                        { t(`${ I18N_TARGET_KEY }.SPEntityId.label`) }
                    </FormInputLabel>
                ) }
                validate={ composeValidators(
                    required,
                    hasLength(SERVICE_PROVIDER_ENTITY_ID_LENGTH)
                ) }
                hint={ (
                    <>
                        This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in
                        the SAML requests initiated from { config.ui.productName } to external
                        Identity Provider (IdP). You need to provide a unique value
                        as the service provider <Code>entityId</Code>.
                    </>
                ) }
                readOnly={ readOnly }
            />

            <Field.Input
                required={ true }
                name="SSOUrl"
                value={ formValues?.SSOUrl }
                inputType="default"
                placeholder={ t(`${ I18N_TARGET_KEY }.SSOUrl.placeholder`) }
                ariaLabel={ t(`${ I18N_TARGET_KEY }.SSOUrl.ariaLabel`) }
                data-testid={ `${ testId }-SSOUrl-field` }
                label={ (
                    <FormInputLabel htmlFor="SSOUrl">
                        { t(`${ I18N_TARGET_KEY }.SSOUrl.label`) }
                    </FormInputLabel>
                ) }
                maxLength={ SSO_URL_LENGTH.max }
                minLength={ SSO_URL_LENGTH.min }
                validate={ composeValidators(
                    required,
                    isUrl,
                    hasLength(SSO_URL_LENGTH)
                ) }
                hint={ t(`${ I18N_TARGET_KEY }.SSOUrl.hint`, {
                    productName: config.ui.productName
                }) }
                readOnly={ readOnly }
            />

            <Field.Input
                name="AuthRedirectUrl"
                value={ formValues?.AuthRedirectUrl }
                inputType="copy_input"
                placeholder={ t(`${ I18N_TARGET_KEY }.AuthRedirectUrl.placeholder`) }
                ariaLabel={ t(`${ I18N_TARGET_KEY }.AuthRedirectUrl.ariaLabel`) }
                data-testid={ `${ testId }-authorized-redirect-url` }
                label={ (
                    <FormInputLabel htmlFor="AuthRedirectUrl" disabled={ true }>
                        { t(`${ I18N_TARGET_KEY }.AuthRedirectUrl.label`) }
                    </FormInputLabel>
                ) }
                maxLength={ IDENTITY_PROVIDER_AUTHORIZED_REDIRECT_URL_LENGTH.max }
                minLength={ IDENTITY_PROVIDER_AUTHORIZED_REDIRECT_URL_LENGTH.min }
                hint={ t(`${ I18N_TARGET_KEY }.AuthRedirectUrl.hint`, {
                    productName: config.ui.productName
                }) }
                readOnly={ readOnly }
            />

            <Field.Input
                required={ true }
                name="IdPEntityId"
                value={ formValues?.IdPEntityId }
                inputType="default"
                placeholder={ t(`${ I18N_TARGET_KEY }.IdPEntityId.placeholder`) }
                ariaLabel={ t(`${ I18N_TARGET_KEY }.IdPEntityId.ariaLabel`) }
                data-testid={ `${ testId }-IdPEntityId-field` }
                label={ (
                    <FormInputLabel htmlFor="IdPEntityId" disabled={ true }>
                        { t(`${ I18N_TARGET_KEY }.IdPEntityId.label`) }
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
                        This is the <Code>&lt;saml2:Issuer&gt;</Code> value specified in
                        the SAML responses issued by the external IdP. Also, this needs to
                        be a unique value to identify the external IdP within your
                        organization.
                    </>
                ) }
                readOnly={ readOnly }
            />

            <Field.Dropdown
                required={ true }
                name="NameIDType"
                value={ formValues?.NameIDType }
                defaultValue={ formValues?.NameIDType }
                placeholder={ t(`${ I18N_TARGET_KEY }.NameIDType.placeholder`) }
                ariaLabel={ t(`${ I18N_TARGET_KEY }.NameIDType.ariaLabel`) }
                data-testid={ `${ testId }-NameIDType-field` }
                options={ getAvailableNameIDFormats() }
                label={ (
                    <FormInputLabel htmlFor="NameIDType">
                        { t(`${ I18N_TARGET_KEY }.NameIDType.label`) }
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ t(`${ I18N_TARGET_KEY }.NameIDType.hint`, {
                    productName: config.ui.productName
                }) }
                readOnly={ readOnly }
            />

            <Field.Dropdown
                required={ true }
                name="RequestMethod"
                value={ formValues?.RequestMethod }
                defaultValue={ formValues?.RequestMethod }
                placeholder={ t(`${ I18N_TARGET_KEY }.RequestMethod.placeholder`) }
                ariaLabel={ t(`${ I18N_TARGET_KEY }.RequestMethod.ariaLabel`) }
                data-testid={ `${ testId }-RequestMethod-field` }
                options={ getAvailableProtocolBindingTypes() }
                label={ (
                    <FormInputLabel htmlFor="RequestMethod">
                        { t(`${ I18N_TARGET_KEY }.RequestMethod.label`) }
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ t(`${ I18N_TARGET_KEY }.RequestMethod.hint`) }
                readOnly={ readOnly }
            />

            <div/>

            <FormSection heading="Single Logout">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            name="IsSLORequestAccepted"
                            initialValue={ isSLORequestAccepted }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.IsSLORequestAccepted.ariaLabel`) }
                            data-testid={ `${ testId }-IsSLORequestAccepted-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsSLORequestAccepted">
                                    { t(`${ I18N_TARGET_KEY }.IsSLORequestAccepted.label`) }
                                </FormInputLabel>
                            ) }
                            hint={
                                t(`${ I18N_TARGET_KEY }.IsSLORequestAccepted.hint`, {
                                    productName: config.ui.productName
                                })
                            }
                            listen={ (value: any) => setIsSLORequestAccepted(Boolean(value)) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsLogoutEnabled"
                            initialValue={ isLogoutEnabled }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.IsLogoutEnabled.ariaLabel`) }
                            data-testid={ `${ testId }-IsLogoutEnabled-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    { t(`${ I18N_TARGET_KEY }.IsLogoutEnabled.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARGET_KEY }.IsLogoutEnabled.hint`) }
                            listen={ (value: any) => setIsLogoutEnabled(Boolean(value)) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Input
                            name="LogoutReqUrl"
                            value={ formValues?.LogoutReqUrl }
                            inputType="url"
                            disabled={ !isLogoutEnabled }
                            placeholder={ t(`${ I18N_TARGET_KEY }.LogoutReqUrl.placeholder`) }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.LogoutReqUrl.ariaLabel`) }
                            data-testid={ `${ testId }-LogoutReqUrl-field` }
                            label={ (
                                <FormInputLabel htmlFor="LogoutReqUrl">
                                    { t(`${ I18N_TARGET_KEY }.LogoutReqUrl.label`) }
                                </FormInputLabel>
                            ) }
                            maxLength={ LOGOUT_URL_LENGTH.max }
                            minLength={ LOGOUT_URL_LENGTH.min }
                            hint={ t(`${ I18N_TARGET_KEY }.LogoutReqUrl.hint`) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                </Grid>
                <Divider hidden/>
            </FormSection>

            <FormSection heading="Request & Response Signing">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            disabled={ false }
                            name="IsAuthnRespSigned"
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.IsAuthnRespSigned.ariaLabel`) }
                            data-testid={ `${ testId }-IsAuthnRespSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsAuthnRespSigned">
                                    { t(`${ I18N_TARGET_KEY }.IsAuthnRespSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARGET_KEY }.IsAuthnRespSigned.hint`) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsLogoutReqSigned"
                            initialValue={ isLogoutReqSigned }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.IsLogoutReqSigned.ariaLabel`) }
                            data-testid={ `${ testId }-IsLogoutReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    { t(`${ I18N_TARGET_KEY }.IsLogoutReqSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARGET_KEY }.IsLogoutReqSigned.hint`, {
                                productName: config.ui.productName
                            }) }
                            listen={ (checked: any) => setIsLogoutReqSigned(Boolean(checked)) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="ISAuthnReqSigned"
                            initialValue={ isAuthnReqSigned }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.ISAuthnReqSigned.ariaLabel`) }
                            data-testid={ `${ testId }-ISAuthnReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="ISAuthnReqSigned">
                                    { t(`${ I18N_TARGET_KEY }.ISAuthnReqSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARGET_KEY }.ISAuthnReqSigned.hint`, {
                                productName: config.ui.productName
                            }) }
                            listen={ (value: any) => setIsAuthnReqSigned(Boolean(value)) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Dropdown
                            value={ formValues?.SignatureAlgorithm }
                            required={ isAlgorithmsEnabled }
                            name="SignatureAlgorithm"
                            type="select"
                            disabled={ !isAlgorithmsEnabled }
                            placeholder={ t(`${ I18N_TARGET_KEY }.SignatureAlgorithm.placeholder`) }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.SignatureAlgorithm.ariaLabel`) }
                            data-testid={ `${ testId }-SignatureAlgorithm-field` }
                            options={ getSignatureAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="SignatureAlgorithm">
                                    { t(`${ I18N_TARGET_KEY }.SignatureAlgorithm.label`) }
                                </FormInputLabel>
                            ) }
                            validate={ getAlgorithmsDropdownFieldValidators() }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Dropdown
                            required={ isAlgorithmsEnabled }
                            name="DigestAlgorithm"
                            value={ formValues?.DigestAlgorithm }
                            type="select"
                            disabled={ !isAlgorithmsEnabled }
                            placeholder={ t(`${ I18N_TARGET_KEY }.DigestAlgorithm.placeholder`) }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.DigestAlgorithm.ariaLabel`) }
                            data-testid={ `${ testId }-DigestAlgorithm-field` }
                            options={ getDigestAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="DigestAlgorithm">
                                    { t(`${ I18N_TARGET_KEY }.DigestAlgorithm.label`) }
                                </FormInputLabel>
                            ) }
                            validate={ getAlgorithmsDropdownFieldValidators() }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                </Grid>
                <Divider hidden/>
            </FormSection>

            <FormSection heading="Advanced">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IncludeProtocolBinding"
                            initialValue={ includeProtocolBinding }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.IncludeProtocolBinding.ariaLabel`) }
                            data-testid={ `${ testId }-IncludeProtocolBinding-field` }
                            label={ (
                                <FormInputLabel htmlFor="IncludeProtocolBinding">
                                    { t(`${ I18N_TARGET_KEY }.IncludeProtocolBinding.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARGET_KEY }.IncludeProtocolBinding.hint`) }
                            listen={ (value: any) => setIncludeProtocolBinding(Boolean(value)) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsUserIdInClaims"
                            initialValue={ isUserIdInClaims }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.IsUserIdInClaims.ariaLabel`) }
                            data-testid={ `${ testId }-IsUserIdInClaims-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsUserIdInClaims">
                                    { t(`${ I18N_TARGET_KEY }.IsUserIdInClaims.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARGET_KEY }.IsUserIdInClaims.hint`) }
                            listen={ (value: any) => setIsUserIdInClaims(Boolean(value)) }
                            readOnly={ readOnly }
                        />
                    </SectionRow>

                    { identityProviderConfig?.extendedSamlConfig?.enableAssertionSigningEnabled && (
                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="isAssertionSigned"
                                defaultValue={ Boolean(initialFormValues.isAssertionSigned) }
                                ariaLabel={ "Enable Assertion Signing" }
                                data-testid={ `${ testId }-isAssertionSigned-field` }
                                label={ (
                                    <FormInputLabel htmlFor="isAssertionSigned">
                                        { t(`${ I18N_TARGET_KEY }.isAssertionSigned.label`) }
                                    </FormInputLabel>
                                ) }
                                hint={ t(`${ I18N_TARGET_KEY }.isAssertionSigned.hint`) }
                                readOnly={ readOnly }
                            />
                        </SectionRow>
                    ) }
                    { identityProviderConfig?.extendedSamlConfig?.includePublicCertEnabled && (
                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="IncludeCert"
                                initialValue={ includeCert }
                                ariaLabel={ "Include public certificate" }
                                data-testid={ `${ testId }-includeCert-field` }
                                label={ (
                                    <FormInputLabel htmlFor="includeCert">
                                        { t(`${ I18N_TARGET_KEY }.includeCert.label`) }
                                    </FormInputLabel>
                                ) }
                                hint={ t(`${ I18N_TARGET_KEY }.includeCert.hint`) }
                                listen={ (value: any) => setIncludeCert(Boolean(value)) }
                                readOnly={ readOnly }
                            />
                        </SectionRow>
                    ) }
                    { identityProviderConfig?.extendedSamlConfig?.includeNameIDPolicyEnabled && (
                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="IncludeNameIDPolicy"
                                initialValue={ includeNameIDPolicy }
                                ariaLabel={ "Include Name ID Policy" }
                                data-testid={ `${ testId }-includeNameIDPolicy-field` }
                                label={ (
                                    <FormInputLabel htmlFor="IncludeNameIDPolicy">
                                        { t(`${ I18N_TARGET_KEY }.includeNameIDPolicy.label`) }
                                    </FormInputLabel>
                                ) }
                                hint={ t(`${ I18N_TARGET_KEY }.includeNameIDPolicy.hint`) }
                                listen={ (value: any) => setIncludeNameIDPolicy(Boolean(value)) }
                                readOnly={ readOnly }
                            />
                        </SectionRow>
                    ) }
                    { identityProviderConfig?.extendedSamlConfig?.isAssertionEncryptionEnabled && (
                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="IsAssertionEncrypted"
                                initialValue={ isEnableAssetionEncryption }
                                ariaLabel={ "Enable Assertion Encryption" }
                                data-testid={ `${ testId }-isEnableAssertionEncryption-field` }
                                label={ (
                                    <FormInputLabel htmlFor="IsEnableAssertionEncryption">
                                        { t(`${ I18N_TARGET_KEY }.isEnableAssertionEncryption.label`) }
                                    </FormInputLabel>
                                ) }
                                hint={ t(`${ I18N_TARGET_KEY }.isEnableAssertionEncryption.hint`) }
                                listen={ (value: any) => setIsEnableAssetionEncryption(Boolean(value)) }
                                readOnly={ readOnly }
                            />
                        </SectionRow>
                    ) }
                    { identityProviderConfig.extendedSamlConfig.includeAuthenticationContextEnabled && (
                        <SectionRow>
                            { /* IncludeAuthnContext */ }
                            <p>Include authentication context</p>
                            { getIncludeAuthenticationContextOptions().map((option: DropdownChild,index: number) => (
                                <Field.Radio
                                    key={ index }
                                    ariaLabel={ `${option.value} layout swatch` }
                                    name={ "IncludeAuthnContext" }
                                    label={
                                        option.text
                                    }
                                    required={ false }
                                    value={ option.value }
                                />
                            )) }
                        </SectionRow>
                    ) }

                    { identityProviderConfig.extendedSamlConfig.forceAuthenticationEnabled && (
                        <SectionRow>
                            { /* ForceAuthentication */ }
                            <p>Force authentication</p>
                            { getForceAuthenticationOptions().map((option: DropdownChild,index: number) => (
                                <Field.Radio
                                    key={ index }
                                    ariaLabel={ `${option.value} layout swatch` }
                                    name={ "ForceAuthentication" }
                                    label={ option.text }
                                    required={ false }
                                    value={ option.value }
                                />
                            )) }
                        </SectionRow>
                    ) }

                    { identityProviderConfig.extendedSamlConfig.responseAuthenticationContextClassEnabled && (
                        <SectionRow>
                            <p>Response Authentication Context Class</p>
                            { /* ResponseAuthnContextClassRef */ }
                            { getResponseAuthnContextClassRefOptions().map((option: DropdownChild, index: number) => (
                                <Field.Radio
                                    key={ index }
                                    ariaLabel={ `${option.value} layout swatch` }
                                    name={ "ResponseAuthnContextClassRef" }
                                    label={
                                        option.text
                                    }
                                    required={ false }
                                    value={ option.value }
                                />
                            )) }
                        </SectionRow>
                    ) }

                    { identityProviderConfig.extendedSamlConfig.authContextComparisonLevelEnabled && (
                        <SectionRow>
                            <Field.Dropdown
                                required={ false }
                                name="AuthnContextComparisonLevel"
                                defaultValue={ initialFormValues?.AuthnContextComparisonLevel }
                                placeholder={ t(`${ I18N_TARGET_KEY }.authContextComparisonLevel.placeholder`) }
                                ariaLabel={ t(`${ I18N_TARGET_KEY }.authContextComparisonLevel.ariaLabel`) }
                                data-testid={ `${ testId }-authContextComparisonLevel-field` }
                                options={ getAvailableAuthContextComparisonLevelOptions() }
                                label={ (
                                    <FormInputLabel htmlFor="AuthnContextComparisonLevel">
                                        { t(`${ I18N_TARGET_KEY }.authContextComparisonLevel.label`) }
                                    </FormInputLabel>
                                ) }
                                hint={ t(`${ I18N_TARGET_KEY }.authContextComparisonLevel.hint`) }
                                readOnly={ readOnly }
                            />
                        </SectionRow>
                    ) }

                    { identityProviderConfig.extendedSamlConfig.attributeConsumingServiceIndexEnabled && (
                        <SectionRow>
                            <Field.Input
                                name="AttributeConsumingServiceIndex"
                                value={ formValues?.attributeConsumingServiceIndex }
                                inputType="default"
                                placeholder={ t(`${ I18N_TARGET_KEY }.attributeConsumingServiceIndex.placeholder`) }
                                ariaLabel={ t(`${ I18N_TARGET_KEY }.attributeConsumingServiceIndex.ariaLabel`) }
                                data-testid={ `${ testId }-attributeConsumingServiceIndex-field` }
                                label={ (
                                    <FormInputLabel htmlFor="AttributeConsumingServiceIndex">
                                        { t(`${ I18N_TARGET_KEY }.attributeConsumingServiceIndex.label`) }
                                    </FormInputLabel>
                                ) }
                                maxLength={ LOGOUT_URL_LENGTH.max }
                                minLength={ LOGOUT_URL_LENGTH.min }
                                hint={ t(`${ I18N_TARGET_KEY }.attributeConsumingServiceIndex.hint`) }
                                readOnly={ readOnly }
                            />
                        </SectionRow>
                    ) }

                    { !disabledFeatures?.includes("identityProviders.saml.authenticationContextClass") && (
                        <SectionRow>
                            <Typography variant="body1">
                                { t(`${ I18N_TARGET_KEY }.authenticationContextClass.label`) }
                            </Typography>
                            <Autocomplete
                                multiple
                                className="forms-wrapped-autocomplete"
                                disableCloseOnSelect
                                size="small"
                                options={ authenticationContextClassOptions }
                                value={ selectedAuthnContextClasses }
                                onChange={ (_event: React.SyntheticEvent, classes: DropdownChild[]) => {
                                    setSelectedAuthnContextClasses(classes);
                                } }
                                getOptionLabel={ (role: DropdownChild) => role?.text as string }
                                renderInput={ (params: AutocompleteRenderInputParams) => {
                                    params.inputProps.className = "forms-wrapped-autocomplete-render-input";

                                    return (
                                        <TextField
                                            { ...params }
                                            size="small"
                                            placeholder={
                                                t(`${ I18N_TARGET_KEY }.authenticationContextClass.placeholder`) }
                                        />
                                    );
                                } }
                            />
                        </SectionRow>
                    ) }

                    { !disabledFeatures?.includes("identityProviders.saml.customAuthenticationContextClass") && (
                        <SectionRow>
                            <Field.Input
                                label={ (
                                    <FormInputLabel htmlFor="CustomAuthnContextClassRef">
                                        { t(`${ I18N_TARGET_KEY }.customAuthenticationContextClass.label`) }
                                    </FormInputLabel>
                                ) }
                                name="CustomAuthnContextClassRef"
                                maxLength={ 100 }
                                minLength={ 0 }
                                value={ initialFormValues.customAuthnContextClassRef }
                                inputType="default"
                                placeholder={ t(`${ I18N_TARGET_KEY }.customAuthenticationContextClass.placeholder`) }
                                ariaLabel={ t(`${ I18N_TARGET_KEY }.customAuthenticationContextClass.ariaLabel`) }
                                data-testid={ `${ testId }-customAuthenticationContextClass-field` }
                            />
                        </SectionRow>
                    ) }
                    <SectionRow>
                        <Field.QueryParams
                            value={ formValues?.commonAuthQueryParams }
                            label={ t(`${ I18N_TARGET_KEY }.commonAuthQueryParams.label`) }
                            ariaLabel={ t(`${ I18N_TARGET_KEY }.commonAuthQueryParams.ariaLabel`) }
                            name="commonAuthQueryParams"
                            readOnly={ readOnly }
                        />
                    </SectionRow>
                </Grid>
                <Divider hidden/>
            </FormSection>

            { identityProviderConfig.extendedSamlConfig.isArtifactBindingEnabled && (
                <FormSection heading="Artifact Binding">
                    <Grid>
                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="ISArtifactBindingEnabled"
                                initialValue={ initialFormValues.ISArtifactBindingEnabled }
                                ariaLabel={ t(`${ I18N_TARGET_KEY }.isArtifactBindingEnabled.label`) }
                                data-testid={ `${ testId }-isArtifactBindingEnabled-field` }
                                label={ (
                                    <FormInputLabel htmlFor="isArtifactBindingEnabled">
                                        { t(`${ I18N_TARGET_KEY }.isArtifactBindingEnabled.label`) }
                                    </FormInputLabel>
                                ) }
                                readOnly={ readOnly }
                                listen={ (value: boolean) => setIsArtifactBindingEnabled(value) }
                            />
                        </SectionRow>

                        <SectionRow>
                            <Field.Input
                                name="ArtifactResolveUrl"
                                value={ formValues?.ArtifactResolveUrl }
                                inputType="url"
                                placeholder={ t(`${ I18N_TARGET_KEY }.artifactResolveEndpointUrl.placeholder`) }
                                ariaLabel={ t(`${ I18N_TARGET_KEY }.artifactResolveEndpointUrl.ariaLabel`) }
                                data-testid={ `${ testId }-artifactResolveEndpointUrl-field` }
                                label={ (
                                    <FormInputLabel htmlFor="artifactResolveEndpointUrl">
                                        { t(`${ I18N_TARGET_KEY }.artifactResolveEndpointUrl.label`) }
                                    </FormInputLabel>
                                ) }
                                maxLength={ LOGOUT_URL_LENGTH.max }
                                minLength={ LOGOUT_URL_LENGTH.min }
                                readOnly={ readOnly }
                                disabled={ !isArtifactBindingEnabled }
                            />
                        </SectionRow>

                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="ISArtifactResolveReqSigned"
                                defaultValue={ initialFormValues.ISArtifactResolveReqSigned === "true" }
                                ariaLabel={ "Enable Artifact resolve request signing" }
                                data-testid={ `${ testId }-isArtifactResolveReqSigned-field` }
                                label={ (
                                    <FormInputLabel htmlFor="isArtifactResolveReqSigned">
                                        { t(`${ I18N_TARGET_KEY }.isArtifactResolveReqSigned.label`) }
                                    </FormInputLabel>
                                ) }
                                readOnly={ readOnly }
                                disabled={ !isArtifactBindingEnabled }
                            />
                        </SectionRow>
                        <SectionRow>
                            <Field.Checkbox
                                required={ false }
                                name="ISArtifactResponseSigned"
                                defaultValue={ initialFormValues.ISArtifactResponseSigned === "true" }
                                ariaLabel={ "Enable artifact response signing" }
                                data-testid={ `${ testId }-isArtifactResponseSigned-field` }
                                label={ (
                                    <FormInputLabel htmlFor="isArtifactResponseSigned">
                                        { t(`${ I18N_TARGET_KEY }.isArtifactResponseSigned.label`) }
                                    </FormInputLabel>
                                ) }
                                readOnly={ readOnly }
                                disabled={ !isArtifactBindingEnabled }
                            />
                        </SectionRow>
                    </Grid>
                </FormSection>
            ) }

            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="SAML authenticator update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ readOnly }
            />

        </Form>
    );

};

/**
 * Default properties for {@link SamlAuthenticatorSettingsForm}
 */
SamlAuthenticatorSettingsForm.defaultProps = {
    "data-testid": "saml-authenticator-settings-form"
};

const SectionRow: FunctionComponent<PropsWithChildren<{ width?: SemanticWIDTHS }>> = (
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
