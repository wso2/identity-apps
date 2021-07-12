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
import { Field, Form } from "@wso2is/form";
import { Code, FormInputLabel, FormSection } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, SemanticWIDTHS } from "semantic-ui-react";
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

const I18N_TARTGET_KEY = "console:develop.features.authenticationProvider.forms.authenticatorSettings.saml";

/**
 * SamlSettingsForm Properties interface. The data-testid is added in
 * {@link SamlAuthenticatorSettingsForm.defaultProps}.
 */
interface SamlSettingsFormPropsInterface extends TestableComponentInterface {
    authenticator: FederatedAuthenticatorWithMetaInterface;
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
}

export interface SamlPropertiesInterface {
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

/**
 * SAML Authenticator settings form.
 *
 * @param props
 * @constructor
 */
export const SamlAuthenticatorSettingsForm: FunctionComponent<SamlSettingsFormPropsInterface> = (
    props: SamlSettingsFormPropsInterface
): ReactElement => {

    const {
        authenticator,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { t } = useTranslation();

    const [ formValues, setFormValues ] = useState<SamlPropertiesInterface>({} as SamlPropertiesInterface);

    const [ isSLORequestAccepted, setIsSLORequestAccepted ] = useState<boolean>(false);
    const [ includeProtocolBinding, setIncludeProtocolBinding ] = useState<boolean>(false);
    const [ isUserIdInClaims, setIsUserIdInClaims ] = useState<boolean>(false);
    const [ isLogoutEnabled, setIsLogoutEnabled ] = useState<boolean>(false);

    // ISAuthnReqSigned, IsLogoutReqSigned these two fields states will be used by other
    // fields states. Basically, algorithms fields enable and disable states will be
    // determine by these two states.
    const [ isLogoutReqSigned, setIsLogoutReqSigned ] = useState<boolean>(false);
    const [ isAuthnReqSigned, setIsAuthnReqSigned ] = useState<boolean>(false);

    // This isAlgorithmsEnabled state will control the enable and disable state of
    // algorithm dropdowns (Signature and Digest)
    const [ isAlgorithmsEnabled, setIsAlgorithmsEnabled ] = useState<boolean>(false);

    const initialFormValues = useMemo<SamlPropertiesInterface>(() => {

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
            IncludeProtocolBinding: findPropVal<boolean>({ defaultValue: false, key: "IncludeProtocolBinding" }),
            ISAuthnReqSigned: findPropVal<boolean>({ defaultValue: false, key: "ISAuthnReqSigned" }),
            // `IsAuthnRespSigned` is by default set to true when creating the SAML IdP so,
            // always the value will be true. Keeping this here to indicate for the user and
            // to enable this if requirements gets changed.
            IsAuthnRespSigned: findPropVal<boolean>({ defaultValue: true, key: "IsAuthnRespSigned" }),
            IsLogoutEnabled: findPropVal<boolean>({ defaultValue: false, key: "IsLogoutEnabled" }),
            IsLogoutReqSigned: findPropVal<boolean>({ defaultValue: false, key: "IsLogoutReqSigned" }),
            IsSLORequestAccepted: findPropVal<boolean>({ defaultValue: true, key: "IsSLORequestAccepted" }),
            IsUserIdInClaims: findPropVal<boolean>({ defaultValue: true, key: "IsUserIdInClaims" })
        } as SamlPropertiesInterface;

    }, []);

    useEffect(() => {
        setIsSLORequestAccepted(initialFormValues.IsSLORequestAccepted);
        setIncludeProtocolBinding(initialFormValues.IncludeProtocolBinding);
        setIsUserIdInClaims(initialFormValues.IsUserIdInClaims);
        setIsLogoutEnabled(initialFormValues.IsLogoutEnabled);
        setIsLogoutReqSigned(initialFormValues.IsLogoutReqSigned);
        setIsAuthnReqSigned(initialFormValues.ISAuthnReqSigned);
        setFormValues({ ...initialFormValues });
    }, [ initialFormValues ]);

    useEffect(() => {
        const ifEitherOneOfThemIsChecked = isLogoutReqSigned || isAuthnReqSigned;
        setIsAlgorithmsEnabled(ifEitherOneOfThemIsChecked);
    }, [ isLogoutReqSigned, isAuthnReqSigned ]);

    const onFormSubmit = (values: { [ key: string ]: any }): void => {
        const manualOverride = {
            "IncludeProtocolBinding": includeProtocolBinding,
            "ISAuthnReqSigned": isAuthnReqSigned,
            "IsLogoutEnabled": isLogoutEnabled,
            "IsLogoutReqSigned": isLogoutReqSigned,
            "IsSLORequestAccepted": isSLORequestAccepted,
            "IsUserIdInClaims": isUserIdInClaims
        };
        const manualOverrideKeys = new Set<string>(Object.keys(manualOverride));
        const authn = ({
            ...authenticator.data,
            properties: [
                ...Object.keys(values)
                    .filter((key) => !manualOverrideKeys.has(key))
                    .map((key) => ({ key, value: values[key] })),
                ...Object.keys(manualOverride)
                    .map((key) => ({ key, value: manualOverride[key] })) as any
            ]
        });
        // FIXME: IsSLORequestAccepted is not updating from the API. Even though
        //        we send the value to false or true.
        onSubmit(authn);
    };

    const getAlgorithmsDropdownFieldValidators = (): (value: string) => string | undefined => {
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
                placeholder={ t(`${ I18N_TARTGET_KEY }.SPEntityId.placeholder`) }
                ariaLabel={ t(`${ I18N_TARTGET_KEY }.SPEntityId.ariaLabel`) }
                inputType="default"
                maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                label={ (
                    <FormInputLabel htmlFor="SPEntityId">
                        <Trans i18nKey={ `${ I18N_TARTGET_KEY }.SPEntityId.label` }>
                            Service provider <Code>entityID</Code>
                        </Trans>
                    </FormInputLabel>
                ) }
                validate={ composeValidators(
                    required,
                    hasLength(SERVICE_PROVIDER_ENTITY_ID_LENGTH)
                ) }
                hint={ (
                    <Trans i18nKey={ `${ I18N_TARTGET_KEY }.SPEntityId.hint` }>
                        Enter identity provider <Code>entityId</Code> value.
                    </Trans>
                ) }
            />

            <Field.Input
                required={ true }
                name="SSOUrl"
                value={ formValues?.SSOUrl }
                inputType="default"
                placeholder={ t(`${ I18N_TARTGET_KEY }.SSOUrl.placeholder`) }
                ariaLabel={ t(`${ I18N_TARTGET_KEY }.SSOUrl.ariaLabel`) }
                data-testid={ `${ testId }-SSOUrl-field` }
                label={ (
                    <FormInputLabel htmlFor="SSOUrl">
                        <Trans i18nKey={ `${ I18N_TARTGET_KEY }.SSOUrl.label` }>
                            Single Sign-On <Code>URL</Code>
                        </Trans>
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
                    <Trans i18nKey={ `${ I18N_TARTGET_KEY }.SSOUrl.hint` }>
                        Enter identity provider&apos;s SAML2 Web Single Sign-On URL value.
                    </Trans>
                ) }
            />

            <Field.Input
                required={ true }
                name="IdPEntityId"
                value={ formValues?.IdPEntityId }
                inputType="default"
                placeholder={ t(`${ I18N_TARTGET_KEY }.IdPEntityId.placeholder`) }
                ariaLabel={ t(`${ I18N_TARTGET_KEY }.IdPEntityId.ariaLabel`) }
                data-testid={ `${ testId }-IdPEntityId-field` }
                label={ (
                    <FormInputLabel htmlFor="IdPEntityId" disabled={ true }>
                        <Trans i18nKey={ `${ I18N_TARTGET_KEY }.IdPEntityId.label` }>
                            Identity provider <Code>entityID</Code>
                        </Trans>
                    </FormInputLabel>
                ) }
                maxLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.max }
                minLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.min }
                validate={ composeValidators(
                    required,
                    hasLength(IDENTITY_PROVIDER_ENTITY_ID_LENGTH)
                ) }
                hint={ (
                    <Trans i18nKey={ `${ I18N_TARTGET_KEY }.IdPEntityId.hint` }>
                        Enter identity provider&apos;s entity identifier value.
                        This should be a valid <Code>URI</Code>/<Code>URL</Code>.
                    </Trans>
                ) }
            />

            <Field.Dropdown
                required={ true }
                name="NameIDType"
                value={ formValues?.NameIDType }
                placeholder={ t(`${ I18N_TARTGET_KEY }.NameIDType.placeholder`) }
                ariaLabel={ t(`${ I18N_TARTGET_KEY }.NameIDType.ariaLabel`) }
                data-testid={ `${ testId }-NameIDType-field` }
                options={ getAvailableNameIDFormats() }
                label={ (
                    <FormInputLabel htmlFor="NameIDType">
                        <Trans i18nKey={ `${ I18N_TARTGET_KEY }.NameIDType.label` }>
                            Identity provider <Code>NameIDFormat</Code>
                        </Trans>
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ t(`${ I18N_TARTGET_KEY }.NameIDType.hint`) }
            />

            <Field.Dropdown
                required={ true }
                name="RequestMethod"
                value={ formValues?.RequestMethod }
                placeholder={ t(`${ I18N_TARTGET_KEY }.RequestMethod.placeholder`) }
                ariaLabel={ t(`${ I18N_TARTGET_KEY }.RequestMethod.ariaLabel`) }
                data-testid={ `${ testId }-RequestMethod-field` }
                options={ getAvailableProtocolBindingTypes() }
                label={ (
                    <FormInputLabel htmlFor="RequestMethod">
                        { t(`${ I18N_TARTGET_KEY }.RequestMethod.label`) }
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ t(`${ I18N_TARTGET_KEY }.RequestMethod.hint`) }
            />

            <FormSection heading="Single Logout">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            name="IsSLORequestAccepted"
                            value={ isSLORequestAccepted }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.IsSLORequestAccepted.ariaLabel`) }
                            data-testid={ `${ testId }-IsSLORequestAccepted-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsSLORequestAccepted">
                                    { t(`${ I18N_TARTGET_KEY }.IsSLORequestAccepted.label`) }
                                </FormInputLabel>
                            ) }
                            hint={
                                t(`${ I18N_TARTGET_KEY }.IsSLORequestAccepted.hint`, {
                                    productName: config.ui.productName
                                })
                            }
                            listen={ (value: any) => setIsSLORequestAccepted(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsLogoutEnabled"
                            value={ isLogoutEnabled }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.IsLogoutEnabled.ariaLabel`) }
                            data-testid={ `${ testId }-IsLogoutEnabled-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    { t(`${ I18N_TARTGET_KEY }.IsLogoutEnabled.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARTGET_KEY }.IsLogoutEnabled.hint`) }
                            listen={ (value: any) => setIsLogoutEnabled(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Input
                            name="LogoutReqUrl"
                            value={ formValues?.LogoutReqUrl }
                            inputType="url"
                            disabled={ !isLogoutEnabled }
                            placeholder={ t(`${ I18N_TARTGET_KEY }.LogoutReqUrl.placeholder`) }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.LogoutReqUrl.ariaLabel`) }
                            data-testid={ `${ testId }-LogoutReqUrl-field` }
                            label={ (
                                <FormInputLabel htmlFor="LogoutReqUrl">
                                    <Trans i18nKey={ `${ I18N_TARTGET_KEY }.LogoutReqUrl.label` }>
                                        IdP logout <Code>URL</Code>
                                    </Trans>
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
                                <Trans i18nKey={ `${ I18N_TARTGET_KEY }.LogoutReqUrl.hint` }>
                                    Enter the identity provider&apos;s logout URL value if it is different from the SSO
                                    URL (<Code>{ formValues.SSOUrl ?? "https://ENTERPRISE_IDP/samlsso" }</Code>)
                                </Trans>
                            ) }
                        />
                    </SectionRow>
                </Grid>
            </FormSection>

            <FormSection heading="Request & Response Signing">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            disabled={ true }
                            name="IsAuthnRespSigned"
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.IsAuthnRespSigned.ariaLabel`) }
                            data-testid={ `${ testId }-IsAuthnRespSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsAuthnRespSigned">
                                    { t(`${ I18N_TARTGET_KEY }.IsAuthnRespSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARTGET_KEY }.IsAuthnRespSigned.hint`) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsLogoutReqSigned"
                            value={ isLogoutReqSigned }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.IsLogoutReqSigned.ariaLabel`) }
                            data-testid={ `${ testId }-IsLogoutReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    { t(`${ I18N_TARTGET_KEY }.IsLogoutReqSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARTGET_KEY }.IsLogoutReqSigned.hint`) }
                            listen={ (checked: any) => setIsLogoutReqSigned(Boolean(checked)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="ISAuthnReqSigned"
                            value={ isAuthnReqSigned }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.ISAuthnReqSigned.ariaLabel`) }
                            data-testid={ `${ testId }-ISAuthnReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="ISAuthnReqSigned">
                                    { t(`${ I18N_TARTGET_KEY }.ISAuthnReqSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARTGET_KEY }.ISAuthnReqSigned.hint`) }
                            listen={ (value: any) => setIsAuthnReqSigned(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Dropdown
                            value={ formValues?.SignatureAlgorithm }
                            required={ isAlgorithmsEnabled }
                            name="SignatureAlgorithm"
                            type="select"
                            disabled={ !isAlgorithmsEnabled }
                            placeholder={ t(`${ I18N_TARTGET_KEY }.SignatureAlgorithm.placeholder`) }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.SignatureAlgorithm.ariaLabel`) }
                            data-testid={ `${ testId }-SignatureAlgorithm-field` }
                            options={ getSignatureAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="SignatureAlgorithm">
                                    { t(`${ I18N_TARTGET_KEY }.SignatureAlgorithm.label`) }
                                </FormInputLabel>
                            ) }
                            validate={ getAlgorithmsDropdownFieldValidators() }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Dropdown
                            required={ isAlgorithmsEnabled }
                            name="DigestAlgorithm"
                            value={ formValues?.DigestAlgorithm }
                            type="select"
                            disabled={ !isAlgorithmsEnabled }
                            placeholder={ t(`${ I18N_TARTGET_KEY }.DigestAlgorithm.placeholder`) }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.DigestAlgorithm.ariaLabel`) }
                            data-testid={ `${ testId }-DigestAlgorithm-field` }
                            options={ getDigestAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="DigestAlgorithm">
                                    { t(`${ I18N_TARTGET_KEY }.DigestAlgorithm.label`) }
                                </FormInputLabel>
                            ) }
                            validate={ getAlgorithmsDropdownFieldValidators() }
                        />
                    </SectionRow>
                </Grid>
            </FormSection>

            <FormSection heading="Advanced">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IncludeProtocolBinding"
                            value={ includeProtocolBinding }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.IncludeProtocolBinding.ariaLabel`) }
                            data-testid={ `${ testId }-IncludeProtocolBinding-field` }
                            label={ (
                                <FormInputLabel htmlFor="IncludeProtocolBinding">
                                    { t(`${ I18N_TARTGET_KEY }.IncludeProtocolBinding.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${ I18N_TARTGET_KEY }.IncludeProtocolBinding.hint`) }
                            listen={ (value: any) => setIncludeProtocolBinding(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            required={ false }
                            name="IsUserIdInClaims"
                            value={ isUserIdInClaims }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.IsUserIdInClaims.ariaLabel`) }
                            data-testid={ `${ testId }-IsUserIdInClaims-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsUserIdInClaims">
                                    { isUserIdInClaims
                                        ? (
                                            <span>
                                                <Trans
                                                    i18nKey={ `${ I18N_TARTGET_KEY }.IsUserIdInClaims.label.option1` }>
                                                    User identifier found among <Code>claims</Code>
                                                </Trans>
                                            </span>
                                        )
                                        : (
                                            <span>
                                                <Trans
                                                    i18nKey={ `${ I18N_TARTGET_KEY }.IsUserIdInClaims.label.option2` }>
                                                    Use <Code>NameID</Code> as the user identifier
                                                </Trans>
                                            </span>
                                        )
                                    }
                                </FormInputLabel>
                            ) }
                            hint={ (
                                <Trans i18nKey={ `${ I18N_TARTGET_KEY }.IsUserIdInClaims.hint` }>
                                    If you need to specify an attribute from the SAML assertion as the User Identifier,
                                    you can uncheck this option and configure the <Code>subject</Code> from
                                    the Attributes section.
                                </Trans>
                            ) }
                            listen={ (value: any) => setIsUserIdInClaims(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.QueryParams
                            value={ formValues?.commonAuthQueryParams }
                            label={ t(`${ I18N_TARTGET_KEY }.commonAuthQueryParams.label`) }
                            ariaLabel={ t(`${ I18N_TARTGET_KEY }.commonAuthQueryParams.ariaLabel`) }
                            name="commonAuthQueryParams"
                        />
                    </SectionRow>
                </Grid>
            </FormSection>

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
