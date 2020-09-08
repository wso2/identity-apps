/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Field, Forms, Validation } from "@wso2is/forms";
import { ConfirmationModal, CopyInputField, Heading, Hint, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Divider, Form, Grid } from "semantic-ui-react";
import {
    GrantTypeMetaDataInterface,
    MetadataPropertyInterface,
    OAuth2PKCEConfigurationInterface,
    OIDCDataInterface,
    OIDCMetadataInterface,
    State,
    emptyOIDCConfig
} from "../../models";

/**
 * Proptypes for the inbound OIDC form component.
 */
interface InboundOIDCFormPropsInterface extends TestableComponentInterface {
    metadata: OIDCMetadataInterface;
    initialValues: OIDCDataInterface;
    onSubmit: (values: any) => void;
    onApplicationRegenerate: () => void;
    onApplicationRevoke: () => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * CORS allowed origin list for the tenant.
     */
    allowedOriginList?: string[];
    /**
     * Tenant domain
     */
    tenantDomain?: string;
}

/**
 * Inbound OIDC protocol configurations form.
 *
 * @param {InboundOIDCFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundOIDCForm: FunctionComponent<InboundOIDCFormPropsInterface> = (
    props: InboundOIDCFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        onApplicationRegenerate,
        onApplicationRevoke,
        readOnly,
        allowedOriginList,
        tenantDomain,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isEncryptionEnabled, setEncryptionEnable ] = useState(false);
    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [ showURLError, setShowURLError ] = useState(false);
    const [ showOriginError, setShowOriginError ] = useState(false);
    const [ showRegenerateConfirmationModal, setShowRegenerateConfirmationModal ] = useState<boolean>(false);
    const [ showRevokeConfirmationModal, setShowRevokeConfirmationModal ] = useState<boolean>(false);
    const [ allowedOrigins, setAllowedOrigins ] = useState("");
    const [
        isTokenBindingTypeSelected,
        setIsTokenBindingTypeSelected
    ] = useState<boolean>(false);

    /**
     * Sets if a valid token binding type is selected.
     */
    useEffect(() => {
        if (initialValues.accessToken.bindingType !== "None") {
            setIsTokenBindingTypeSelected(true);
        }
    }, [ initialValues?.accessToken?.bindingType ]);

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param {string} urls - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackUrlWithRegExp = (urls: string): string => {
        let callbackURL = urls.replace(/['"]+/g, "");
        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL.split(",").join("|") + ")";
        }
        return callbackURL;
    };

    /**
     * Separate out multiple origins in the passed string.
     *
     * @param {string} origins - Allowed origins
     * @return Resolved allowed origins.
     */
    const resolveAllowedOrigins = (origins: string): string[] => {
        if (origins.split(",").length > 1) {
            return origins.split(",");
        }
        return [ origins ];
    };

    /**
     * Remove regexp from incoming data and show the callbackUrls.
     *
     * @param {string} url - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackURLWithSeparator = (url: string): string => {
        if (url.includes("regexp=(")) {
            url = url.replace("regexp=(", "");
            url = url.replace(")", "");
            url = url.split("|").join(",");
        }
        return url;
    };

    /**
     * Creates options for Radio & dropdown using MetadataPropertyInterface options.
     *
     * @param {MetadataPropertyInterface} metadataProp - Metadata.
     * @param {boolean} isLabel - Flag to determine if label.
     * @return {any[]}
     */
    const getAllowedList = (metadataProp: MetadataPropertyInterface, isLabel?: boolean): any[] => {
        const allowedList = [];
        if (metadataProp) {
            if (isLabel) {
                metadataProp.options.map((ele) => {
                    allowedList.push({ label: ele, value: ele });
                });
            } else {
                metadataProp.options.map((ele) => {
                    allowedList.push({ text: ele, value: ele });
                });
            }
        }
        return allowedList;
    };

    /**
     * Creates options for Radio GrantTypeMetaDataInterface options.
     *
     * @param {GrantTypeMetaDataInterface} metadataProp - Metadata.
     *
     * @return {any[]}
     */
    const getAllowedGranTypeList = (metadataProp: GrantTypeMetaDataInterface): any[] => {
        const allowedList = [];
        if (metadataProp) {
            metadataProp.options.map((grant) => {
                allowedList.push({ label: grant.displayName, value: grant.name });
            });

        }

        return allowedList;
    };

    /**
     * Checks the PKCE options.
     *
     * @param {OAuth2PKCEConfigurationInterface} pckeConfig - PKCE config.
     * @return {string[]}
     */
    const findPKCE = (pckeConfig: OAuth2PKCEConfigurationInterface): string[] => {
        const selectedValues = [];
        if (pckeConfig.mandatory) {
            selectedValues.push("mandatory");
        }
        if (pckeConfig.supportPlainTransformAlgorithm) {
            selectedValues.push("supportPlainTransformAlgorithm");
        }
        return selectedValues;
    };

    /**
     * Show Regenerate confirmation.
     *
     * @param event Button click event.
     */
    const handleRegenerateButton = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowRegenerateConfirmationModal(true);
    };

    /**
     * Show Revoke confirmation.
     *
     * @param event Button click event.
     */
    const handleRevokeButton = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowRevokeConfirmationModal(true);
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @param {string} url - Callback URLs.
     * @param {string} origin - Allowed origins.
     *
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any, url?: string, origin?: string): any => {
        const formValues = {
            accessToken: {
                applicationAccessTokenExpiryInSeconds: Number(metadata.defaultApplicationAccessTokenExpiryTime),
                bindingType: values.get("bindingType"),
                revokeTokensWhenIDPSessionTerminated: values.get("RevokeAccessToken")?.length > 0,
                // TODO: Enable this when the rest API is improved.
                // tokenBindingValidation: values.get("ValidateBinding")?.length > 0,
                type: values.get("type"),
                userAccessTokenExpiryInSeconds: Number(values.get("userAccessTokenExpiryInSeconds"))
            },
            allowedOrigins: resolveAllowedOrigins(origin ? origin : allowedOrigins),
            callbackURLs: [ buildCallBackUrlWithRegExp(url ? url : callBackUrls) ],
            grantTypes: values.get("grant"),
            idToken: {
                audience: [ values.get("audience") ],
                encryption: {
                    algorithm: isEncryptionEnabled ?
                        values.get("algorithm") : metadata.idTokenEncryptionAlgorithm.defaultValue,
                    enabled: values.get("encryption").includes("enableEncryption"),
                    method: isEncryptionEnabled ?
                        values.get("method") : metadata.idTokenEncryptionMethod.defaultValue
                },
                expiryInSeconds: Number(values.get("idExpiryInSeconds"))
            },
            logout: {
                backChannelLogoutUrl: values.get("backChannelLogoutUrl"),
                frontChannelLogoutUrl: values.get("frontChannelLogoutUrl")
            },
            pkce: {
                mandatory: values.get("PKCE").includes("mandatory"),
                supportPlainTransformAlgorithm: !!values.get("PKCE").includes("supportPlainTransformAlgorithm")
            },
            publicClient: values.get("supportPublicClients").length > 0,
            refreshToken: {
                expiryInSeconds: parseInt(values.get("expiryInSeconds"), 10),
                renewRefreshToken: values.get("RefreshToken").length > 0
            },
            scopeValidators: values.get("scopeValidator"),
            validateRequestObjectSignature: values.get("enableRequestObjectSignatureValidation").length > 0
        };

        // If the app is newly created do not add `clientId` & `clientSecret`.
        if (!initialValues?.clientId || !values.get("clientSecret")) {
            return formValues;
        }

        return {
            ...formValues,
            clientId: initialValues?.clientId,
            clientSecret: values.get("clientSecret")
        };
    };

    useEffect(
        () => {
            if (initialValues?.idToken?.encryption) {
                setEncryptionEnable(initialValues.idToken.encryption?.enabled);
            }
        }, [ initialValues ]
    );

    /**
     * The following function handles allowing CORS for a new origin.
     *
     * @param {string} url - Allowed origin
     */
    const handleAllowOrigin = (url: string): void => {
        const allowedURLs = initialValues?.allowedOrigins;
        allowedURLs.push(url);
        setAllowedOrigins(allowedURLs?.toString());
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    /**
     * submitOrigin function.
     */
    let submitOrigin: (callback: (origin?: string) => void) => void;

    return (
        metadata ?
            (
                <Forms
                    onSubmit={ (values) => {
                        submitUrl((url: string) => {
                            if (isEmpty(callBackUrls) && isEmpty(url)) {
                                setShowURLError(true);
                            } else {
                                submitOrigin((origin) => {
                                    // TODO: Remove the empty check when the backend is fixed.
                                    if (isEmpty(allowedOrigins) && isEmpty(origin)) {
                                        setShowOriginError(true);
                                    } else {
                                        onSubmit(updateConfiguration(values, url, origin));
                                    }
                                });
                            }
                        });
                    } }
                >
                    <Grid>
                        {
                            initialValues.clientId && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Form.Field>
                                            <label>
                                                { t("devPortal:components.applications.forms.inboundOIDC.fields" +
                                                    ".clientID.label") }
                                            </label>
                                            <CopyInputField
                                                value={ initialValues?.clientId }
                                                data-testid={ `${ testId }-client-id-readonly-input` }
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            initialValues.clientSecret && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Field
                                            name="clientSecret"
                                            label={
                                                t("devPortal:components.applications.forms.inboundOIDC.fields" +
                                                    ".clientSecret.label")
                                            }
                                            hidePassword={
                                                t("devPortal:components.applications.forms.inboundOIDC.fields" +
                                                    ".clientSecret.hideSecret")
                                            }
                                            showPassword={
                                                t("devPortal:components.applications.forms.inboundOIDC.fields" +
                                                    ".clientSecret.showSecret")
                                            }
                                            required={ false }
                                            requiredErrorMessage={
                                                t("devPortal:components.applications.forms.inboundOIDC.fields" +
                                                    ".clientSecret.validations.empty")
                                            }
                                            placeholder={
                                                t("devPortal:components.applications.forms.inboundOIDC.fields" +
                                                    ".clientSecret.placeholder")
                                            }
                                            type="password"
                                            value={ initialValues.clientSecret }
                                            data-testid={ `${ testId }-client-secret-readonly-input` }
                                            readOnly
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            initialValues.clientSecret && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        {
                                            !readOnly && (
                                                <>
                                                    <Button
                                                        color="red"
                                                        className="oidc-regenerate-button"
                                                        onClick={ handleRegenerateButton }
                                                        data-testid={ `${ testId }-oidc-regenerate-button` }
                                                    >
                                                        { t("common:regenerate") }
                                                    </Button>
                                                    <Button
                                                        color="red"
                                                        className="oidc-revoke-button"
                                                        onClick={ handleRevokeButton }
                                                        disabled={ (initialValues?.state === State.REVOKED) }
                                                        data-testid={ `${ testId }-oidc-revoke-button` }
                                                    >
                                                        { t("common:revoke") }
                                                    </Button>
                                                </>

                                            )
                                        }
                                    </Grid.Column>
                                    <ConfirmationModal
                                        onClose={ (): void => setShowRegenerateConfirmationModal(false) }
                                        type="warning"
                                        open={ showRegenerateConfirmationModal }
                                        assertion={ initialValues?.clientId }
                                        assertionHint={ (
                                            <p>
                                                <Trans
                                                    i18nKey={
                                                        "devPortal:components.applications.confirmations" +
                                                        ".regenerateSecret.assertionHint"
                                                    }
                                                    tOptions={ { id: initialValues?.clientId } }
                                                >
                                                    Please type <strong>{ initialValues?.clientId }</strong> to confirm.
                                                </Trans>
                                            </p>
                                        ) }
                                        assertionType="input"
                                        primaryAction={ t("common:confirm") }
                                        secondaryAction={ t("common:cancel") }
                                        onSecondaryActionClick={ (): void =>
                                            setShowRegenerateConfirmationModal(false)
                                        }
                                        onPrimaryActionClick={ (): void => {
                                            onApplicationRegenerate();
                                            setShowRegenerateConfirmationModal(false);
                                        } }
                                        data-testid={ `${ testId }-oidc-regenerate-confirmation-modal` }
                                    >
                                        <ConfirmationModal.Header
                                            data-testid={ `${ testId }-oidc-regenerate-confirmation-modal-header` }
                                        >
                                            { t("devPortal:components.applications.confirmations" +
                                                ".regenerateSecret.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            warning
                                            data-testid={ `${ testId }-oidc-regenerate-confirmation-modal-message` }
                                        >
                                            { t("devPortal:components.applications.confirmations" +
                                                ".regenerateSecret.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={ `${ testId }-oidc-regenerate-confirmation-modal-content` }
                                        >
                                            { t("devPortal:components.applications.confirmations" +
                                                ".regenerateSecret.content") }
                                        </ConfirmationModal.Content>
                                    </ConfirmationModal>
                                    <ConfirmationModal
                                        onClose={ (): void => setShowRevokeConfirmationModal(false) }
                                        type="warning"
                                        open={ showRevokeConfirmationModal }
                                        assertion={ initialValues?.clientId }
                                        assertionHint={ (
                                            <p>
                                                <Trans
                                                    i18nKey={
                                                        "devPortal:components.applications.confirmations" +
                                                        ".revokeApplication.assertionHint"
                                                    }
                                                    tOptions={ { id: initialValues?.clientId } }
                                                >
                                                    Please type <strong>{ initialValues?.clientId }</strong> to confirm.
                                                </Trans>
                                            </p>
                                        ) }
                                        assertionType="input"
                                        primaryAction={ t("common:confirm") }
                                        secondaryAction={ t("common:cancel") }
                                        onSecondaryActionClick={ (): void => setShowRevokeConfirmationModal(false) }
                                        onPrimaryActionClick={ (): void => {
                                            onApplicationRevoke();
                                            setShowRevokeConfirmationModal(false);
                                        } }
                                        data-testid={ `${ testId }-oidc-revoke-confirmation-modal` }
                                    >
                                        <ConfirmationModal.Header
                                            data-testid={ `${ testId }-oidc-revoke-confirmation-modal-header` }
                                        >
                                            { t("devPortal:components.applications.confirmations" +
                                                ".revokeApplication.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            warning
                                            data-testid={ `${ testId }-oidc-revoke-confirmation-modal-message` }
                                        >
                                            { t("devPortal:components.applications.confirmations" +
                                                ".revokeApplication.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={ `${ testId }-oidc-revoke-confirmation-modal-content` }
                                        >
                                            { t("devPortal:components.applications.confirmations" +
                                                ".revokeApplication.content") }
                                        </ConfirmationModal.Content>
                                    </ConfirmationModal>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="grant"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.grant.label")
                                    }
                                    type="checkbox"
                                    required={ true }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.grant" +
                                            ".validations.empty")
                                    }
                                    children={ getAllowedGranTypeList(metadata.allowedGrantTypes) }
                                    value={ initialValues.grantTypes }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-grant-type-checkbox-group` }
                                />
                                <Hint>This will determine how the application communicates with the token service</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInput
                            isAllowEnabled={ false }
                            tenantDomain={ tenantDomain }
                            allowedOrigins={ allowedOriginList }
                            labelEnabled={ true }
                            urlState={ callBackUrls }
                            setURLState={ setCallBackUrls }
                            labelName={
                                t("devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls.label")
                            }
                            required={ true }
                            value={ buildCallBackURLWithSeparator(initialValues.callbackURLs?.toString()) }
                            placeholder={
                                t("devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls" +
                                    ".placeholder")
                            }
                            validationErrorMsg={
                                t("devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls" +
                                    ".validations.empty")
                            }
                            validation={ (value: string) => {
                                return FormValidation.url(value);
                            } }
                            showError={ showURLError }
                            setShowError={ setShowURLError }
                            hint={
                                t("devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls.hint")
                            }
                            readOnly={ readOnly }
                            addURLTooltip={ t("common:addURL") }
                            duplicateURLErrorMessage={ t("common:duplicateURLError") }
                            data-testid={ `${ testId }-callback-url-input` }
                            getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                submitUrl = submitFunction;
                            } }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <URLInput
                                    handleAddAllowedOrigin={ (url) => handleAllowOrigin(url) }
                                    urlState={ allowedOrigins }
                                    setURLState={ setAllowedOrigins }
                                    labelName={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.allowedOrigins" +
                                            ".label")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.allowedOrigins" +
                                            ".placeholder")
                                    }
                                    value={ initialValues?.allowedOrigins?.toString() }
                                    validationErrorMsg={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.allowedOrigins" +
                                            ".validations.empty")
                                    }
                                    validation={ (value: string) => {
                                        return FormValidation.url(value);
                                    } }
                                    computerWidth={ 10 }
                                    setShowError={ setShowOriginError }
                                    showError={ showOriginError }
                                    hint={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.allowedOrigins" +
                                            ".hint")
                                    }
                                    addURLTooltip={ t("common:addURL") }
                                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                    data-testid={ `${ testId }-allowed-origin-url-input` }
                                    getSubmit={ (submitOriginFunction: (callback: (origin?: string) => void) => void
                                    ) => {
                                        submitOrigin = submitOriginFunction;
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="supportPublicClients"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.fields.public" +
                                            ".validations.empty")
                                    }
                                    type="checkbox"
                                    value={
                                        initialValues.publicClient
                                            ? [ "supportPublicClients" ]
                                            : []
                                    }
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                ".fields.public.label"),
                                            value: "supportPublicClients"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-public-client-checkbox` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.fields.public.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        { /* PKCE */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.pkce" +
                                        ".heading") }
                                </Heading>
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.pkce" +
                                        ".hint") }
                                </Hint>
                                <Divider hidden />
                                <Field
                                    name="PKCE"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.pkce" +
                                            ".fields.pkce.validations.empty")
                                    }
                                    type="checkbox"
                                    value={ findPKCE(initialValues.pkce) }
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                ".sections.pkce.fields.pkce.children.mandatory.label"),
                                            value: "mandatory"
                                        },
                                        {
                                            label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                ".sections.pkce.fields.pkce.children.plainAlg.label"),
                                            value: "supportPlainTransformAlgorithm"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-pkce-checkbox-group` }
                                />
                            </Grid.Column>
                        </Grid.Row>

                        { /* Access Token */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".accessToken.heading") }
                                </Heading>
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.accessToken" +
                                        ".hint") }
                                </Hint>
                                <Divider hidden />
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.type.label")
                                    }
                                    name="type"
                                    default={
                                        initialValues.accessToken
                                            ? initialValues.accessToken.type
                                            : metadata.accessTokenType.defaultValue
                                    }
                                    type="radio"
                                    children={ getAllowedList(metadata.accessTokenType, true) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-access-token-type-radio-group` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.bindingType.label")
                                    }
                                    name="bindingType"
                                    default={
                                        initialValues
                                            ? initialValues.accessToken.bindingType
                                            : metadata.accessTokenBindingType.defaultValue
                                    }
                                    type="radio"
                                    children={ getAllowedList(metadata.accessTokenBindingType, true) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-access-token-type-radio-group` }
                                    listen={ (values) => {
                                        setIsTokenBindingTypeSelected(values.get("bindingType") !== "None")
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        {
                            isTokenBindingTypeSelected && (
                                <>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                            <Field
                                                name="ValidateBinding"
                                                label=""
                                                required={ false }
                                                requiredErrorMessage=""
                                                type="checkbox"
                                                value={
                                                    initialValues.accessToken?.tokenBindingValidation
                                                        ? [ "validateBinding" ]
                                                        : []
                                                }
                                                children={ [
                                                    {
                                                        label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                            ".sections.accessToken.fields.validateBinding.label"),
                                                        value: "validateBinding"
                                                    }
                                                ] }
                                                readOnly={ readOnly }
                                                data-testid={ `${ testId }-access-token-validate-binding-checkbox` }
                                            />
                                            <Hint>
                                                { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                                    ".accessToken.fields.validateBinding.hint") }
                                            </Hint>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                            <Field
                                                name="RevokeAccessToken"
                                                label=""
                                                required={ false }
                                                requiredErrorMessage=""
                                                type="checkbox"
                                                value={
                                                    initialValues.accessToken?.revokeTokensWhenIDPSessionTerminated
                                                        ? [ "revokeAccessToken" ]
                                                        : []
                                                }
                                                children={ [
                                                    {
                                                        label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                            ".sections.accessToken.fields.revokeToken.label"),
                                                        value: "revokeAccessToken"
                                                    }
                                                ] }
                                                readOnly={ readOnly }
                                                data-testid={ `${ testId }-access-token-revoke-token-checkbox` }
                                            />
                                            <Hint>
                                                { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                                    ".accessToken.fields.revokeToken.hint") }
                                            </Hint>
                                        </Grid.Column>
                                    </Grid.Row>
                                </>
                            )
                        }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    name="userAccessTokenExpiryInSeconds"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.expiry.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.expiry.validations.empty")
                                    }
                                    value={
                                        initialValues.accessToken
                                            ? initialValues.accessToken.userAccessTokenExpiryInSeconds.toString()
                                            : metadata.defaultUserAccessTokenExpiryTime
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.expiry.placeholder")
                                    }
                                    type="number"
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-access-token-expiry-time-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".accessToken.fields.expiry.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        {/* TODO  Enable this option in future*/ }
                        {/*<Grid.Row columns={ 1 }>*/ }
                        {/*    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>*/ }
                        {/*        <Field*/ }
                        {/*            name="applicationAccessTokenExpiryInSeconds"*/ }
                        {/*            label="Application access token expiry time"*/ }
                        {/*            required={ true }*/ }
                        {/*            requiredErrorMessage="Please fill the application access token expiry time"*/ }
                        {/*            value={ initialValues.accessToken ?*/ }
                        {/*                initialValues.accessToken.
                        applicationAccessTokenExpiryInSeconds.toString() :*/ }
                        {/*                metadata.defaultApplicationAccessTokenExpiryTime }*/ }
                        {/*            placeholder="Enter the application access token expiry time "*/ }
                        {/*            type="number"*/ }
                        {/*        />*/ }
                        {/*        <Hint>Configure the application access token expiry time (in seconds).</Hint>*/ }
                        {/*    </Grid.Column>*/ }
                        {/*</Grid.Row>*/ }

                        { /* Refresh Token */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".refreshToken.heading") }
                                </Heading>
                                <Divider hidden />
                                <Field
                                    name="RefreshToken"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".refreshToken.fields.renew.validations.empty")
                                    }
                                    type="checkbox"
                                    value={
                                        initialValues.refreshToken?.renewRefreshToken
                                            ? [ "refreshToken" ]
                                            : []
                                    }
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                ".sections.refreshToken.fields.renew.label"),
                                            value: "refreshToken"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-renew-refresh-token-checkbox` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".refreshToken.fields.renew.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    name="expiryInSeconds"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".refreshToken.fields.expiry.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".refreshToken.fields.expiry.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".refreshToken.fields.expiry.placeholder")
                                    }
                                    value={ initialValues.refreshToken
                                        ? initialValues.refreshToken.expiryInSeconds.toString()
                                        : metadata.defaultRefreshTokenExpiryTime }
                                    type="number"
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-refresh-token-expiry-time-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".refreshToken.fields.expiry.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        { /* ID Token */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".idToken.heading") }
                                </Heading>
                                <Divider hidden />
                                <Field
                                    name="audience"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".idToken.fields.audience.label")
                                    }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.audience.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.audience.placeholder")
                                    }
                                    value={ initialValues.idToken?.audience.toString() }
                                    type="textarea"
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-audience-textarea` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                        ".fields.audience.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="encryption"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.encryption.validations.empty")
                                    }
                                    type="checkbox"
                                    listen={
                                        (values) => {
                                            setEncryptionEnable(
                                                !!values.get("encryption").includes("enableEncryption")
                                            );
                                        }
                                    }
                                    value={
                                        initialValues.idToken?.encryption.enabled
                                            ? [ "enableEncryption" ]
                                            : []
                                    }
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                ".sections.idToken.fields.encryption.label"),
                                            value: "enableEncryption"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-encryption-checkbox` }
                                />
                                <Hint>Enable ID token encryption.</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="algorithm"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.algorithm.label")
                                    }
                                    required={ isEncryptionEnabled }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.algorithm.validations.empty")
                                    }
                                    type="dropdown"
                                    default={
                                        initialValues.idToken
                                            ? initialValues.idToken.encryption.algorithm
                                            : metadata.idTokenEncryptionAlgorithm.defaultValue
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".idToken.fields.algorithm.placeholder")
                                    }
                                    children={ getAllowedList(metadata.idTokenEncryptionAlgorithm) }
                                    disabled={ !isEncryptionEnabled }
                                    data-testid={ `${ testId }-encryption-algorithm-dropdown` }
                                />
                                <Hint disabled={ !isEncryptionEnabled }>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                        ".fields.algorithm.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="method"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".idToken.fields.method.label")
                                    }
                                    required={ isEncryptionEnabled }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.method.validations.empty")
                                    }
                                    type="dropdown"
                                    default={
                                        initialValues.idToken
                                            ? initialValues.idToken.encryption.method
                                            : metadata.idTokenEncryptionMethod.defaultValue
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.method.placeholder")
                                    }
                                    children={ getAllowedList(metadata.idTokenEncryptionMethod) }
                                    disabled={ !isEncryptionEnabled }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-encryption-method-dropdown` }
                                />
                                <Hint disabled={ !isEncryptionEnabled }>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                        ".fields.method.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    name="idExpiryInSeconds"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.expiry.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.expiry.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.expiry.placeholder")
                                    }
                                    value={
                                        initialValues.idToken
                                            ? initialValues.idToken.expiryInSeconds.toString()
                                            : metadata.defaultIdTokenExpiryTime
                                    }
                                    type="number"
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-id-token-expiry-time-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections.idToken" +
                                        ".fields.expiry.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        { /* Logout */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Logout URLs</Heading>
                                <Divider hidden />
                                <Field
                                    name="backChannelLogoutUrl"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".logoutURLs.fields.back.label")
                                    }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".logoutURLs.fields.back.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".logoutURLs.fields.back.placeholder")
                                    }
                                    type="text"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push((
                                                t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                                    ".logoutURLs.fields.back.validations.invalid")
                                            ))
                                        }
                                    } }
                                    value={ initialValues.logout?.backChannelLogoutUrl }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-back-channel-logout-url-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="frontChannelLogoutUrl"
                                    label={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".logoutURLs.fields.front.label")
                                    }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".logoutURLs.fields.front.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".logoutURLs.fields.front.placeholder")
                                    }
                                    type="text"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push((
                                                t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                                    ".logoutURLs.fields.front.validations.invalid")
                                            ));
                                        }
                                    } }
                                    value={ initialValues.logout?.frontChannelLogoutUrl }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-front-channel-logout-url-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="enableRequestObjectSignatureValidation"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={
                                        initialValues.validateRequestObjectSignature
                                            ? [ "EnableRequestObjectSignatureValidation" ]
                                            : []
                                    }
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundOIDC" +
                                                ".sections.logoutURLs.fields.signatureValidation.label"),
                                            value: "EnableRequestObjectSignatureValidation"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-request-object-signature-validation-checkbox` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        { /* Scope Validators */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                        ".scopeValidators.heading") }
                                </Heading>
                                <Divider hidden />
                                <Field
                                    name="scopeValidator"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundOIDC.sections" +
                                            ".scopeValidators.fields.validator.validations.empty")
                                    }
                                    type="checkbox"
                                    value={ initialValues.scopeValidators }
                                    children={ getAllowedList(metadata.scopeValidators, true) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-scope-validator-checkbox` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        {
                            !readOnly && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Button
                                            primary
                                            type="submit"
                                            size="small"
                                            className="form-button"
                                            data-testid={ `${ testId }-submit-button` }
                                        >
                                            { t("common:update") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                    </Grid>
                </Forms>
            )
            : null
    );
};

/**
 * Default props for the Inbound OIDC form component.
 */
InboundOIDCForm.defaultProps = {
    "data-testid": "inbound-oidc-form",
    initialValues: emptyOIDCConfig
};
