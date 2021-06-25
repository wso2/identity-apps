/* eslint-disable sort-keys */
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
import { composeValidators, fastSearch, getAvailableNameIDFormats, getAvailableProtocolBindingTypes, getDigestAlgorithmOptionsMapped, getSignatureAlgorithmOptionsMapped, hasLength, IDENTITY_PROVIDER_ENTITY_ID_LENGTH, isUrl, LOGOUT_URL_LENGTH, required, SERVICE_PROVIDER_ENTITY_ID_LENGTH, SSO_URL_LENGTH } from "../../utils/saml-idp-utils";

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
        ["data-testid"]: testId
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { t } = useTranslation();

    const initialFormValues = useMemo<SamlProperties>(() => {

        const [findPropVal] = fastSearch(authenticator);

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
        } as SamlProperties;

    }, []);

    const [formValues, setFormValues] = useState<SamlProperties>({} as SamlProperties);

    const [isSLORequestAccepted, setIsSLORequestAccepted] = useState<boolean>(false);
    const [includeProtocolBinding, setIncludeProtocolBinding] = useState<boolean>(false);
    const [isUserIdInClaims, setIsUserIdInClaims] = useState<boolean>(false);
    const [isLogoutEnabled, setIsLogoutEnabled] = useState<boolean>(false);

    // ISAuthnReqSigned, IsLogoutReqSigned these two fields states will be used by other
    // fields states. Basically, algorithms fields enable and disable states will be
    // determine by these two states. See SIDE_EFFECT_1
    const [isLogoutReqSigned, setIsLogoutReqSigned] = useState<boolean>(false);
    const [isAuthnReqSigned, setIsAuthnReqSigned] = useState<boolean>(false);

    // This isAlgorithmsEnabled state will control the enable and disable state of
    // algorithm dropdowns (Signature and Digest)
    const [isAlgorithmsEnabled, setIsAlgorithmsEnabled] = useState<boolean>(false);

    useEffect((/*SIDE_EFFECT_0*/) => {
        setIsSLORequestAccepted(initialFormValues.IsSLORequestAccepted);
        setIncludeProtocolBinding(initialFormValues.IncludeProtocolBinding);
        setIsUserIdInClaims(initialFormValues.IsUserIdInClaims);
        setIsLogoutEnabled(initialFormValues.IsLogoutEnabled);
        setIsLogoutReqSigned(initialFormValues.IsLogoutReqSigned);
        setIsAuthnReqSigned(initialFormValues.ISAuthnReqSigned);
        setFormValues({ ...initialFormValues });
    }, [initialFormValues]);

    useEffect((/*SIDE_EFFECT_1*/) => {
        const ifEitherOneOfThemIsChecked = isLogoutReqSigned || isAuthnReqSigned;
        setIsAlgorithmsEnabled(ifEitherOneOfThemIsChecked);
    }, [isLogoutReqSigned, isAuthnReqSigned]);

    const onFormSubmit = (values: { [key: string]: any }) => {
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

    const getAlgorithmsDropdownFieldValidators = () => {
        if (isLogoutReqSigned || isAuthnReqSigned) {
            return required;
        }
        return (/* No validations */) => void 0;
    };

    const i18nTargetKey = "console:develop.features.authenticationProvider.forms.authenticatorSettings.saml";
    return (
        <Form onSubmit={ onFormSubmit } uncontrolledForm={ true } initialValues={ initialFormValues }>

            <Field.Input
                required={ true }
                name="SPEntityId"
                value={ formValues?.SPEntityId }
                placeholder={ t(`${i18nTargetKey}.SPEntityId.placeholder`) }
                ariaLabel={ t(`${i18nTargetKey}.SPEntityId.ariaLabel`) }
                inputType="default"
                maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                label={ (
                    <FormInputLabel htmlFor="SPEntityId">
                        <Trans i18nKey={ `${i18nTargetKey}.SPEntityId.label` }>
                            Service provider <Code>entityID</Code>
                        </Trans>
                    </FormInputLabel>
                ) }
                validate={ composeValidators(
                    required,
                    hasLength(SERVICE_PROVIDER_ENTITY_ID_LENGTH)
                ) }
                hint={ (
                    <Trans i18nKey={ `${i18nTargetKey}.SPEntityId.hint` }>
                        Enter identity provider <Code>entityId</Code> value.
                    </Trans>
                ) }
            />

            <Field.Input
                required={ true }
                name="SSOUrl"
                value={ formValues?.SSOUrl }
                inputType="default"
                placeholder={ t(`${i18nTargetKey}.SSOUrl.placeholder`) }
                ariaLabel={ t(`${i18nTargetKey}.SSOUrl.ariaLabel`) }
                data-testid={ `${testId}-SSOUrl-field` }
                label={ (
                    <FormInputLabel htmlFor="SSOUrl">
                        <Trans i18nKey={ `${i18nTargetKey}.SSOUrl.label` }>
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
                    <Trans i18nKey={ `${i18nTargetKey}.SSOUrl.hint` }>
                        Enter identity provider&apos;s SAML2 Web Single Sign-On URL value.
                    </Trans>
                ) }
            />

            <Field.Input
                required={ true }
                name="IdPEntityId"
                value={ formValues?.IdPEntityId }
                inputType="default"
                placeholder={ t(`${i18nTargetKey}.IdPEntityId.placeholder`) }
                ariaLabel={ t(`${i18nTargetKey}.IdPEntityId.ariaLabel`) }
                data-testid={ `${testId}-IdPEntityId-field` }
                label={ (
                    <FormInputLabel htmlFor="IdPEntityId" disabled={ true }>
                        <Trans i18nKey={ `${i18nTargetKey}.IdPEntityId.label` }>
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
                    <Trans i18nKey={ `${i18nTargetKey}.IdPEntityId.hint` }>
                        Enter identity provider&apos;s entity identifier value.
                        This should be a valid <Code>URI</Code>/<Code>URL</Code>.
                    </Trans>
                ) }
            />

            <Field.Dropdown
                required={ true }
                name="NameIDType"
                value={ formValues?.NameIDType }
                placeholder={ t(`${i18nTargetKey}.NameIDType.placeholder`) }
                ariaLabel={ t(`${i18nTargetKey}.NameIDType.ariaLabel`) }
                data-testid={ `${testId}-NameIDType-field` }
                options={ getAvailableNameIDFormats() }
                label={ (
                    <FormInputLabel htmlFor="NameIDType">
                        <Trans i18nKey={ `${i18nTargetKey}.NameIDType.label` }>
                            Identity provider <Code>NameIDFormat</Code>
                        </Trans>
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ t(`${i18nTargetKey}.NameIDType.hint`) }
            />

            <Field.Dropdown
                required={ true }
                name="RequestMethod"
                value={ formValues?.RequestMethod }
                placeholder={ t(`${i18nTargetKey}.RequestMethod.placeholder`) }
                ariaLabel={ t(`${i18nTargetKey}.RequestMethod.ariaLabel`) }
                data-testid={ `${testId}-RequestMethod-field` }
                options={ getAvailableProtocolBindingTypes() }
                label={ (
                    <FormInputLabel htmlFor="RequestMethod">
                        { t(`${i18nTargetKey}.RequestMethod.label`) }
                    </FormInputLabel>
                ) }
                validate={ required }
                hint={ t(`${i18nTargetKey}.RequestMethod.hint`) }
            />

            <FormSection heading="Single Logout">
                <Grid>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            name="IsSLORequestAccepted"
                            value={ isSLORequestAccepted }
                            ariaLabel={ t(`${i18nTargetKey}.IsSLORequestAccepted.ariaLabel`) }
                            data-testid={ `${testId}-IsSLORequestAccepted-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsSLORequestAccepted">
                                    { t(`${i18nTargetKey}.IsSLORequestAccepted.label`) }
                                </FormInputLabel>
                            ) }
                            hint={
                                t(`${i18nTargetKey}.IsSLORequestAccepted.hint`, {
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
                            ariaLabel={ t(`${i18nTargetKey}.IsLogoutEnabled.ariaLabel`) }
                            data-testid={ `${testId}-IsLogoutEnabled-field` }
                            toggle
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    { t(`${i18nTargetKey}.IsLogoutEnabled.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${i18nTargetKey}.IsLogoutEnabled.hint`) }
                            listen={ (value: any) => setIsLogoutEnabled(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Input
                            name="LogoutReqUrl"
                            value={ formValues?.LogoutReqUrl }
                            inputType="url"
                            disabled={ !isLogoutEnabled }
                            placeholder={ t(`${i18nTargetKey}.LogoutReqUrl.placeholder`) }
                            ariaLabel={ t(`${i18nTargetKey}.LogoutReqUrl.ariaLabel`) }
                            data-testid={ `${testId}-LogoutReqUrl-field` }
                            label={ (
                                <FormInputLabel htmlFor="LogoutReqUrl">
                                    <Trans i18nKey={ `${i18nTargetKey}.LogoutReqUrl.label` }>
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
                                <Trans i18nKey={ `${i18nTargetKey}.LogoutReqUrl.hint` }>
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
                            toggle
                            required={ false }
                            disabled={ true }
                            name="IsAuthnRespSigned"
                            ariaLabel={ t(`${i18nTargetKey}.IsAuthnRespSigned.ariaLabel`) }
                            data-testid={ `${testId}-IsAuthnRespSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsAuthnRespSigned">
                                    { t(`${i18nTargetKey}.IsAuthnRespSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${i18nTargetKey}.IsAuthnRespSigned.hint`) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            required={ false }
                            name="IsLogoutReqSigned"
                            value={ isLogoutReqSigned }
                            ariaLabel={ t(`${i18nTargetKey}.IsLogoutReqSigned.ariaLabel`) }
                            data-testid={ `${testId}-IsLogoutReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsLogoutEnabled">
                                    { t(`${i18nTargetKey}.IsLogoutReqSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${i18nTargetKey}.IsLogoutReqSigned.hint`) }
                            listen={ (checked: any) => setIsLogoutReqSigned(Boolean(checked)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            required={ false }
                            name="ISAuthnReqSigned"
                            value={ isAuthnReqSigned }
                            ariaLabel={ t(`${i18nTargetKey}.ISAuthnReqSigned.ariaLabel`) }
                            data-testid={ `${testId}-ISAuthnReqSigned-field` }
                            label={ (
                                <FormInputLabel htmlFor="ISAuthnReqSigned">
                                    { t(`${i18nTargetKey}.ISAuthnReqSigned.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${i18nTargetKey}.ISAuthnReqSigned.hint`) }
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
                            placeholder={ t(`${i18nTargetKey}.SignatureAlgorithm.placeholder`) }
                            ariaLabel={ t(`${i18nTargetKey}.SignatureAlgorithm.ariaLabel`) }
                            data-testid={ `${testId}-SignatureAlgorithm-field` }
                            options={ getSignatureAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="SignatureAlgorithm">
                                    { t(`${i18nTargetKey}.SignatureAlgorithm.label`) }
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
                            placeholder={ t(`${i18nTargetKey}.DigestAlgorithm.placeholder`) }
                            ariaLabel={ t(`${i18nTargetKey}.DigestAlgorithm.ariaLabel`) }
                            data-testid={ `${testId}-DigestAlgorithm-field` }
                            options={ getDigestAlgorithmOptionsMapped(authenticator.meta) }
                            label={ (
                                <FormInputLabel htmlFor="DigestAlgorithm">
                                    { t(`${i18nTargetKey}.DigestAlgorithm.label`) }
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
                            toggle
                            required={ false }
                            name="IncludeProtocolBinding"
                            value={ includeProtocolBinding }
                            ariaLabel={ t(`${i18nTargetKey}.IncludeProtocolBinding.ariaLabel`) }
                            data-testid={ `${testId}-IncludeProtocolBinding-field` }
                            label={ (
                                <FormInputLabel htmlFor="IncludeProtocolBinding">
                                    { t(`${i18nTargetKey}.IncludeProtocolBinding.label`) }
                                </FormInputLabel>
                            ) }
                            hint={ t(`${i18nTargetKey}.IncludeProtocolBinding.hint`) }
                            listen={ (value: any) => setIncludeProtocolBinding(Boolean(value)) }
                        />
                    </SectionRow>
                    <SectionRow>
                        <Field.Checkbox
                            toggle
                            required={ false }
                            name="IsUserIdInClaims"
                            value={ isUserIdInClaims }
                            ariaLabel={ t(`${i18nTargetKey}.IsUserIdInClaims.ariaLabel`) }
                            data-testid={ `${testId}-IsUserIdInClaims-field` }
                            label={ (
                                <FormInputLabel htmlFor="IsUserIdInClaims">
                                    { isUserIdInClaims
                                        ? (
                                            <span>
                                                <Trans i18nKey={ `${i18nTargetKey}.IsUserIdInClaims.label.option1` }>
                                                    User identifier found among <Code>claims</Code>
                                                </Trans>
                                            </span>
                                        )
                                        : (
                                            <span>
                                                <Trans i18nKey={ `${i18nTargetKey}.IsUserIdInClaims.label.option2` }>
                                                    Use <Code>NameID</Code> as the user identifier
                                                </Trans>
                                            </span>
                                        )
                                    }
                                </FormInputLabel>
                            ) }
                            hint={ (
                                <Trans i18nKey={ `${i18nTargetKey}.IsUserIdInClaims.hint` }>
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
                            label={ t(`${i18nTargetKey}.commonAuthQueryParams.label`) }
                            ariaLabel={ t(`${i18nTargetKey}.commonAuthQueryParams.ariaLabel`) }
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
                data-testid={ `${testId}-submit-button` }
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
