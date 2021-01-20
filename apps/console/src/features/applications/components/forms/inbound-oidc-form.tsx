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

import { AlertInterface, AlertLevels, DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils, URLUtils } from "@wso2is/core/utils";
import { Field, Forms, FormValue, Validation } from "@wso2is/forms";
import { ConfirmationModal, CopyInputField, Heading, Hint, LinkButton, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Form, Grid, Label, Message } from "semantic-ui-react";
import { AppState } from "../../../core/store";
import { ApplicationManagementConstants } from "../../constants";
import {
    ApplicationTemplateListItemInterface,
    CertificateInterface,
    CertificateTypeInterface,
    emptyOIDCConfig,
    GrantTypeInterface,
    GrantTypeMetaDataInterface,
    MetadataPropertyInterface,
    OAuth2PKCEConfigurationInterface,
    OIDCDataInterface,
    OIDCMetadataInterface,
    State,
    SupportedAccessTokenBindingTypes
} from "../../models";
import { ApplicationManagementUtils } from "../../utils";
import { CertificateFormFieldModal } from "../modals";
import { ConfigReducerStateInterface } from "../../../core";

/**
 * Proptypes for the inbound OIDC form component.
 */
interface InboundOIDCFormPropsInterface extends TestableComponentInterface {
    /**
     * Current certificate configurations.
     */
    certificate: CertificateInterface;
    metadata?: OIDCMetadataInterface;
    initialValues?: OIDCDataInterface;
    onSubmit?: (values: any) => void;
    onApplicationRegenerate?: () => void;
    onApplicationRevoke?: () => void;
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
    /**
     * Application template.
     */
    template?: ApplicationTemplateListItemInterface;
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
        certificate,
        metadata,
        initialValues,
        onSubmit,
        onApplicationRegenerate,
        onApplicationRevoke,
        readOnly,
        allowedOriginList,
        tenantDomain,
        template,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state.config.ui.isClientSecretHashEnabled);
    const isHelpPanelVisible: boolean = useSelector((state: AppState) => state.helpPanel.visibility);

    const [ isEncryptionEnabled, setEncryptionEnable ] = useState(false);
    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [ showURLError, setShowURLError ] = useState(false);
    const [ showOriginError, setShowOriginError ] = useState(false);
    const [ showCallbackURLField, setShowCallbackURLField ] = useState<boolean>(undefined);
    const [ selectedGrantTypes, setSelectedGrantTypes ] = useState<string[]>(undefined);
    const [ isGrantChanged, setGrantChanged ] = useState<boolean>(false);
    const [ showRegenerateConfirmationModal, setShowRegenerateConfirmationModal ] = useState<boolean>(false);
    const [ showRevokeConfirmationModal, setShowRevokeConfirmationModal ] = useState<boolean>(false);
    const [ allowedOrigins, setAllowedOrigins ] = useState("");
    const [
        isTokenBindingTypeSelected,
        setIsTokenBindingTypeSelected
    ] = useState<boolean>(false);
    const [ callbackURLsErrorLabel, setCallbackURLsErrorLabel ] = useState<ReactElement>(null);
    const [ allowedOriginsErrorLabel, setAllowedOriginsErrorLabel ] = useState<ReactElement>(null);
    const [ isPEMSelected, setPEMSelected ] = useState<boolean>(false);
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ JWKSValue, setJWKSValue ] = useState<string>(undefined);

    const clientSecret = useRef<HTMLElement>();
    const grant = useRef<HTMLElement>();
    const url = useRef<HTMLDivElement>();
    const allowedOrigin = useRef<HTMLDivElement>();
    const supportPublicClients = useRef<HTMLElement>();
    const pkce = useRef<HTMLElement>();
    const bindingType = useRef<HTMLElement>();
    const type = useRef<HTMLElement>();
    const validateTokenBinding = useRef<HTMLElement>();
    const revokeAccessToken = useRef<HTMLElement>();
    const userAccessTokenExpiryInSeconds = useRef<HTMLElement>();
    const refreshToken = useRef<HTMLElement>();
    const expiryInSeconds = useRef<HTMLElement>();
    const audience = useRef<HTMLElement>();
    const encryption = useRef<HTMLElement>();
    const algorithm = useRef<HTMLElement>();
    const method = useRef<HTMLElement>();
    const idExpiryInSeconds = useRef<HTMLElement>();
    const backChannelLogoutUrl = useRef<HTMLElement>();
    const frontChannelLogoutUrl = useRef<HTMLElement>();
    const enableRequestObjectSignatureValidation = useRef<HTMLElement>();
    const scopeValidator = useRef<HTMLElement>();

    /**
     * We use this hook to maintain the toggle state of the PKCE checkbox in the
     * OIDC form.
     *
     * @description Purpose is to enable "Support 'Plain' PKCE Algorithm" checkbox
     *              field if and only if "Enabled" is checked. Otherwise the 'Plain'
     *              will be disabled and stay in the unchecked state.
     */
    const [ enablePKCE, setEnablePKCE ] = useState<boolean>(false);

    /**
     * The {@code PKCE_KEY}, {@code ENABLE_PKCE_CHECKBOX_VALUE and
     * {@code SUPPORT_PKCE_PLAIN_ALGORITHM_VALUE} values are sensitive.
     * If you inspect the relevant field you will see that those value should
     * be the same when we are passing it down to the component.
     */
    const PKCE_KEY = "PKCE";
    const ENABLE_PKCE_CHECKBOX_VALUE = "mandatory";
    const SUPPORT_PKCE_PLAIN_ALGORITHM_VALUE = "supportPlainTransformAlgorithm";

    /**
     * The listener handler for the enable PKCE toggle form field. This function
     * check if the "mandatory" value is present in the values array under "PKCE"
     * field and toggles the {@code enablePKCE} boolean on/off.
     *
     * @param tempForm {Map<string, FormValue>} a mutable map of form values
     */
    const pkceValuesChangeListener = (tempForm: Map<string, FormValue>): void => {
        /**
         * A predicate that checks whether the given value is
         * matching ENABLE_PKCE_CHECKBOX_VALUE
         * @param val {string} checkbox value
         */
        const withPredicate = (val: string): boolean => val === ENABLE_PKCE_CHECKBOX_VALUE;

        if (tempForm.has(PKCE_KEY)) {
            const value: string[] = tempForm.get(PKCE_KEY) as string[];
            if (value.find(withPredicate)) {
                setEnablePKCE(true);
            } else {
                /**
                 * If the "PKCE Enable" checkbox is unchecked then we can't
                 * let the "Support PKCE Plain" checkbox field be enabled or
                 * keep in checked state. So, this step what we do is simply
                 * just set the selected values array to an empty string array.
                 */
                tempForm.set(PKCE_KEY, [] as string[]);
                setEnablePKCE(false);
            }
        }
    };

    const PEM_CERTIFICATE_PREFIX: string = "-----BEGIN CERTIFICATE-----";
    const PEM_CERTIFICATE_POSTFIX: string = "-----END CERTIFICATE-----";

    /**
     * Check whether to show the callback url or not
     */
    useEffect(() => {
        if (selectedGrantTypes?.includes("authorization_code") || selectedGrantTypes?.includes("implicit")) {
            setShowCallbackURLField(true);
        } else {
            setShowCallbackURLField(false);
        }

    }, [ selectedGrantTypes, isGrantChanged ]);

    useEffect(() => {
        if (selectedGrantTypes !== undefined) {
            return;
        }

        if (initialValues?.grantTypes) {
            setSelectedGrantTypes(initialValues?.grantTypes);
        }

    }, [ initialValues ]);

    /**
     * Sets if a valid token binding type is selected.
     */
    useEffect(() => {
        // If access token object is empty, return.
        if (!initialValues?.accessToken || isEmpty(initialValues.accessToken)) {
            return;
        }

        // When bindingType is set to none, back-end doesn't send the `bindingType` attr. So default to `None`.
        if (!initialValues?.accessToken?.bindingType) {
            setIsTokenBindingTypeSelected(false);

            return;
        }

        // Show the validate options when the bindingType is set to a value other than `None`.
        if (initialValues?.accessToken?.bindingType !== SupportedAccessTokenBindingTypes?.NONE) {
            setIsTokenBindingTypeSelected(true);
        }
    }, [ initialValues?.accessToken ]);

    /**
     * Set initial PEM values.
     */
    useEffect(() => {
        if (CertificateTypeInterface.PEM === certificate?.type) {
            setPEMSelected(true);
            setPEMValue(certificate?.value ?? "");
        } else {
            setPEMSelected(false);
            setJWKSValue(certificate?.value ?? "")
        }
    }, [ certificate ]);

    /**
     * Handle grant type change.
     *
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleGrantTypeChange = (values: Map<string, FormValue>) => {
        const grants: string[] = values.get("grant") as string[];
        setSelectedGrantTypes(grants);
        setGrantChanged(!isGrantChanged);
    };

    const getMetadataHints = (element: string) => {
        switch (element.toLowerCase()) {
            case "none":
                return t("console:develop.features.applications.forms" +
                    ".inboundOIDC.sections.accessToken.fields.bindingType.valueDescriptions.none");
            case "cookie":
                return t("console:develop.features.applications.forms" +
                    ".inboundOIDC.sections.accessToken.fields.bindingType.valueDescriptions.cookie");
            case "sso-session":
                return t("console:develop.features.applications.forms.inboundOIDC.sections." +
                    "accessToken.fields.bindingType.valueDescriptions.sso_session", {
                    productName: config.ui.productName
                });
            case "default":
                return t("console:develop.features.applications.forms.inboundOIDC.sections" +
                    ".accessToken.fields.type.valueDescriptions.default");
            case "jwt":
                return t("console:develop.features.applications.forms.inboundOIDC.sections" +
                    ".accessToken.fields.type.valueDescriptions.jwt");
            default:
                return undefined;
        }
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
                    allowedList.push({
                        label: ele,
                        value: ele,
                        hint: { content: getMetadataHints(ele), header: ele.toUpperCase() }
                    });
                });
            } else {
                metadataProp.options.map((ele) => {
                    allowedList.push({ text: ele, value: ele });
                });
            }
        }
        if (isLabel) {
            // if the list related to a label then sort the values in
            // alphabetical order using a ascending comparator.
            return allowedList.sort((a, b) => {
                if (a.label < b.label) return -1;
                if (a.label > b.label) return 1;
                return 0;
            });
        } else {
            return allowedList;
        }
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
            metadataProp.options.map((grant: GrantTypeInterface) => {
                // Hides the grant types specified in the array.
                // TODO: Remove this once the specified grant types such as `account-switch` are handled properly.
                // See https://github.com/wso2/product-is/issues/8806.
                if (ApplicationManagementConstants.HIDDEN_GRANT_TYPES.includes(grant.name)) {
                    return;
                }

                // Remove un-allowed grant types.
                if (template
                    && template.id
                    && get(ApplicationManagementConstants.TEMPLATE_WISE_ALLOWED_GRANT_TYPES, template.id)
                    && !ApplicationManagementConstants.TEMPLATE_WISE_ALLOWED_GRANT_TYPES[ template.id ]
                        .includes(grant.name)) {

                        return;
                }

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
            selectedValues.push(ENABLE_PKCE_CHECKBOX_VALUE);
        }
        if (pckeConfig.supportPlainTransformAlgorithm) {
            selectedValues.push(SUPPORT_PKCE_PLAIN_ALGORITHM_VALUE);
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
        let inboundConfigFormValues: any = {
            accessToken: {
                applicationAccessTokenExpiryInSeconds: Number(metadata.defaultApplicationAccessTokenExpiryTime),
                bindingType: values.get("bindingType"),
                revokeTokensWhenIDPSessionTerminated: values.get("RevokeAccessToken")?.length > 0,
                type: values.get("type"),
                userAccessTokenExpiryInSeconds: Number(values.get("userAccessTokenExpiryInSeconds")),
                validateTokenBinding: values.get("ValidateTokenBinding")?.length > 0
            },
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

        // Add the `allowedOrigins` & `callbackURLs` only if the grant types
        // `authorization_code` and `implicit` are selected.
        if (showCallbackURLField) {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                allowedOrigins: ApplicationManagementUtils.resolveAllowedOrigins(origin ? origin : allowedOrigins),
                callbackURLs: [ ApplicationManagementUtils.buildCallBackUrlWithRegExp(url ? url : callBackUrls) ]
            };
        } else {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                allowedOrigins: [],
                callbackURLs: []
            };
        }

        // If the app is newly created do not add `clientId` & `clientSecret`.
        if (!initialValues?.clientId || !initialValues?.clientSecret) {
            return inboundConfigFormValues;
        }

        return {
            general: {
                advancedConfigurations: {
                    certificate: {
                        type: values.get("type"),
                        value: isPEMSelected ? values.get("certificateValue") : values.get("jwksValue")
                    }
                }
            },
            inbound: {
                ...inboundConfigFormValues,
                clientId: initialValues?.clientId,
                clientSecret: initialValues?.clientSecret
            }
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
     * Scrolls to the first field that throws an error.
     *
     * @param {string} field The name of the field.
     */
    const scrollToInValidField = (field: string): void => {
        const options: ScrollIntoViewOptions = {
            behavior: "smooth",
            block: "center"
        };

        switch (field) {
            case "clientSecret":
                clientSecret.current.scrollIntoView(options);
                break;
            case "grant":
                grant.current.scrollIntoView(options);
                break;
            case "url":
                url.current.scrollIntoView(options);
                break;
            case "allowedOrigin":
                allowedOrigin.current.scrollIntoView(options);
                break;
            case "supportPublicClients":
                supportPublicClients.current.scrollIntoView(options);
                break;
            case "pkce":
                pkce.current.scrollIntoView(options);
                break;
            case "bindingType":
                bindingType.current.scrollIntoView(options);
                break;
            case "type":
                type.current.scrollIntoView(options);
                break;
            case "validateTokenBinding":
                validateTokenBinding.current.scrollIntoView(options);
                break;
            case "revokeAccessToken":
                revokeAccessToken.current.scrollIntoView(options);
                break;
            case "userAccessTokenExpiryInSeconds":
                userAccessTokenExpiryInSeconds.current.scrollIntoView(options);
                break;
            case "refreshToken":
                refreshToken.current.scrollIntoView(options);
                break;
            case "expiryInSeconds":
                expiryInSeconds.current.scrollIntoView(options);
                break;
            case "audience":
                audience.current.scrollIntoView(options);
                break;
            case "encryption":
                encryption.current.scrollIntoView(options);
                break;
            case "algorithm":
                algorithm.current.scrollIntoView(options);
                break;
            case "method":
                method.current.scrollIntoView(options);
                break;
            case "idExpiryInSeconds":
                idExpiryInSeconds.current.scrollIntoView(options);
                break;
            case "backChannelLogoutUrl":
                backChannelLogoutUrl.current.scrollIntoView(options);
                break;
            case "frontChannelLogoutUrl":
                frontChannelLogoutUrl.current.scrollIntoView(options);
                break;
            case "enableRequestObjectSignatureValidation":
                enableRequestObjectSignatureValidation.current.scrollIntoView(options);
                break;
            case "scopeValidator":
                scopeValidator.current.scrollIntoView(options);
                break;
        }
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    /**
     * submitOrigin function.
     */
    let submitOrigin: (callback: (origin?: string) => void) => void;

    /**
     * Construct the details from the pem value.
     */
    const viewCertificate = () => {
        if (isPEMSelected && PEMValue) {
            const displayCertificate: DisplayCertificate = CertificateManagementUtils.displayCertificate(
                null, PEMValue);

            if (displayCertificate) {
                setCertificateDisplay(displayCertificate);
                setShowCertificateModal(true);
            } else {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:common.notifications.invalidPEMFile.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:common.notifications.invalidPEMFile.genericError.message")
                }));
            }
        }
    };

    // --

    const PEMSubField: () => ReactElement = (): ReactElement => {
      return (
          <React.Fragment>
              <Field
                  stacked={ true }
                  prefix={ PEM_CERTIFICATE_PREFIX }
                  postfix={ PEM_CERTIFICATE_POSTFIX }
                  disabled={ !isPEMSelected }
                  name="certificateValue"
                  label={
                      t("console:develop.features.applications.forms.advancedConfig" +
                          ".sections.certificate.fields.pemValue.label")
                  }
                  required={ false }
                  requiredErrorMessage={
                      t("console:develop.features.applications.forms.advancedConfig" +
                          ".sections.certificate.fields.pemValue.validations.empty")
                  }
                  placeholder={
                      "ggEPADCCAQoCggEBAMGPTyynn77hqcYnjWsMwOZDzdhVFY93s2OJntMbuKTHn39B\n" +
                      "...\n" +
                      "bml6YXRpb252YWxzaGEyZzIuY3JsMIGgBggrBgEFBQcBAQSBkzCBkDBNBggrBgEF"
                  }
                  type="textarea"
                  value={ PEMValue }
                  listen={ (values) => {
                      setPEMValue(
                          PEM_CERTIFICATE_PREFIX +
                          (values.get("certificateValue") as string).trim() +
                          PEM_CERTIFICATE_POSTFIX
                      );
                  } }
                  readOnly={ readOnly }
                  data-testid={ `${ testId }-certificate-textarea` }
              />
              < Hint>
                  { t("console:develop.features.applications.forms." +
                      "advancedConfig.sections.certificate.fields.pemValue.hint") }
              </Hint>
              <LinkButton
                  className="certificate-info-link-button"
                  onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      viewCertificate();
                  } }
                  disabled={ isEmpty(PEMValue) }
                  data-testid={ `${ testId }-certificate-info-button` }
              >
                  { t("console:develop.features.applications.forms." +
                      "advancedConfig.sections.certificate.fields.pemValue.actions.view") }
              </LinkButton>
          </React.Fragment>
      )
    };

    const JWKSSubField: () => ReactElement = (): ReactElement => {
        return (
            <Field
                name="jwksValue"
                disabled={ isPEMSelected }
                label={
                    t("console:develop.features.applications.forms.advancedConfig" +
                        ".sections.certificate.fields.jwksValue.label")
                }
                required={ false }
                requiredErrorMessage={
                    t("console:develop.features.applications.forms.advancedConfig" +
                        ".sections.certificate.fields.jwksValue.validations.empty")
                }
                placeholder={
                    t("console:develop.features.applications.forms.advancedConfig" +
                        ".sections.certificate.fields.jwksValue.placeholder") }
                type="text"
                validation={ (value: string, validation: Validation) => {
                    if (!FormValidation.url(value)) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            t(
                                "console:develop.features.applications.forms" +
                                ".advancedConfig.sections.certificate.fields.jwksValue" +
                                ".validations.invalid"
                            )
                        );
                    }
                } }
                listen={ (values) => {

                    console.log("value of JWKS is ", values.get("jwksValue"));
                    // setPEMValue(
                    //     PEM_CERTIFICATE_PREFIX +
                    //     (values.get("certificateValue") as string).trim() +
                    //     PEM_CERTIFICATE_POSTFIX
                    // );
                } }
                value={ JWKSValue }
                readOnly={ readOnly }
                data-testid={ `${ testId }-jwks-input` }
            />
        );
    }

    /**
     * Renders the list of main OIDC config fields.
     * @return {ReactElement}
     */
    const renderOIDCConfigFields = (): ReactElement => (
        <>
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Field
                        ref={ grant }
                        name="grant"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.fields.grant.label")
                        }
                        type="checkbox"
                        required={ true }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.fields.grant" +
                                ".validations.empty")
                        }
                        children={ getAllowedGranTypeList(metadata.allowedGrantTypes) }
                        value={ initialValues.grantTypes }
                        readOnly={ readOnly }
                        listen={ (values) => handleGrantTypeChange(values) }
                        data-testid={ `${ testId }-grant-type-checkbox-group` }
                    />
                    <Hint>
                        {
                            t("console:develop.features.applications.forms.inboundOIDC.fields.grant.hint")
                        }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Field
                        ref={ supportPublicClients }
                        name="supportPublicClients"
                        label=""
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.fields.public" +
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
                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                    ".fields.public.label"),
                                value: "supportPublicClients"
                            }
                        ] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-public-client-checkbox` }
                    />
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.fields.public.hint", {
                            productName: config.ui.productName
                        }) }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            {
                showCallbackURLField && (
                    <>
                        <div ref={ url }/>
                        <URLInput
                            isAllowEnabled={ false }
                            tenantDomain={ tenantDomain }
                            allowedOrigins={ allowedOriginList }
                            labelEnabled={ true }
                            urlState={ callBackUrls }
                            setURLState={ setCallBackUrls }
                            labelName={
                                t("console:develop.features.applications.forms.inboundOIDC.fields.callBackUrls.label")
                            }
                            required={ true }
                            value={
                                ApplicationManagementUtils.buildCallBackURLWithSeparator(
                                    initialValues.callbackURLs?.toString())
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.inboundOIDC.fields.callBackUrls" +
                                    ".placeholder")
                            }
                            validationErrorMsg={
                                t("console:develop.features.applications.forms.inboundOIDC.fields.callBackUrls" +
                                    ".validations.empty")
                            }
                            validation={ (value: string) => {
                                let label: ReactElement = null;

                                const isHttpUrl: boolean = URLUtils.isHttpUrl(value);

                                if (!URLUtils.isHttpsOrHttpUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.unrecognizedURL.description") }
                                        </Label>
                                    );
                                }

                                if (!URLUtils.isMobileDeepLink(value)) {
                                    return false;
                                }

                                setCallbackURLsErrorLabel(label);

                                return true;
                            } }
                            showError={ showURLError }
                            setShowError={ setShowURLError }
                            hint={
                                t("console:develop.features.applications." +
                                    "forms.inboundOIDC.fields.callBackUrls.hint", {
                                    productName: config.ui.productName
                                })
                            }
                            readOnly={ readOnly }
                            addURLTooltip={ t("common:addURL") }
                            duplicateURLErrorMessage={ t("common:duplicateURLError") }
                            data-testid={ `${ testId }-callback-url-input` }
                            getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                submitUrl = submitFunction;
                            } }
                            showPredictions={ false }
                            customLabel={ callbackURLsErrorLabel }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                                <div ref={ allowedOrigin }/>
                                <URLInput
                                    handleAddAllowedOrigin={ (url) => handleAllowOrigin(url) }
                                    urlState={ allowedOrigins }
                                    setURLState={ setAllowedOrigins }
                                    labelName={
                                        t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".fields.allowedOrigins.label")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".fields.allowedOrigins.placeholder")
                                    }
                                    value={ initialValues?.allowedOrigins?.toString() }
                                    validationErrorMsg={
                                        t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".fields.allowedOrigins.validations.empty")
                                    }
                                    validation={ (value: string) => {

                                        let label: ReactElement = null;

                                        if (!URLUtils.isHttpsOrHttpUrl(value)) {
                                            label = (
                                                <Label basic color="orange" className="mt-2">
                                                    { t("console:common.validations.unrecognizedURL.description") }
                                                </Label>
                                            );
                                        }

                                        if (!URLUtils.isMobileDeepLink(value)) {
                                            return false;
                                        }

                                        setAllowedOriginsErrorLabel(label);

                                        return true;
                                    } }
                                    computerWidth={ 10 }
                                    setShowError={ setShowOriginError }
                                    showError={ showOriginError }
                                    readOnly={ readOnly }
                                    addURLTooltip={ t("common:addURL") }
                                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                    data-testid={ `${ testId }-allowed-origin-url-input` }
                                    getSubmit={ (submitOriginFunction: (callback: (origin?: string) => void) => void
                                    ) => {
                                        submitOrigin = submitOriginFunction;
                                    } }
                                    showPredictions={ false }
                                    customLabel={ allowedOriginsErrorLabel }
                                />
                                <Hint>
                                    The HTTP origins that host your web application. You can define multiple web
                                    origins and wild cards are supported.
                                    <p className={"mt-0"}>E.g.,&nbsp;&nbsp;
                                        <code>https://myapp.io, https://localhost:9000, https://*.otherapp.io</code>
                                    </p>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }

            { /* Form Section: PKCE */ }
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Divider />
                    <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.pkce" +
                            ".heading") }
                    </Heading>
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.pkce.hint") }
                    </Hint>
                    <Field
                        ref={ pkce }
                        name={ PKCE_KEY }
                        label=""
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.pkce" +
                                ".fields.pkce.validations.empty")
                        }
                        type="checkbox"
                        value={ findPKCE(initialValues.pkce) }
                        listen={ pkceValuesChangeListener }
                        children={ [
                            {
                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                    ".sections.pkce.fields.pkce.children.mandatory.label"),
                                value: ENABLE_PKCE_CHECKBOX_VALUE
                            },
                            {
                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                    ".sections.pkce.fields.pkce.children.plainAlg.label"),
                                value: SUPPORT_PKCE_PLAIN_ALGORITHM_VALUE,
                                hint: {
                                    header: "PKCE 'Plain'",
                                    content: t("console:develop.features.applications.forms." +
                                        "inboundOIDC.sections.pkce.description", {
                                        productName: config.ui.productName
                                    })
                                },
                                disabled: !enablePKCE
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".accessToken.heading") }
                    </Heading>
                    <Field
                        ref={ type }
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
                        ref={ bindingType }
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.bindingType.label")
                        }
                        hint={ t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".accessToken.fields.bindingType.description", {
                            productName: config.ui.productName
                        }) }
                        name="bindingType"
                        default={
                            initialValues?.accessToken?.bindingType
                                ? initialValues.accessToken.bindingType
                                : metadata?.accessTokenBindingType?.defaultValue
                                    ?? SupportedAccessTokenBindingTypes.NONE
                        }
                        type="radio"
                        children={ getAllowedList(metadata.accessTokenBindingType, true) }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-access-token-type-radio-group` }
                        listen={ (values) => {
                            setIsTokenBindingTypeSelected(
                                values.get("bindingType") !== SupportedAccessTokenBindingTypes.NONE
                            );
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
                                    ref={ validateTokenBinding }
                                    name="ValidateTokenBinding"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage=""
                                    type="checkbox"
                                    value={
                                        initialValues.accessToken?.validateTokenBinding
                                            ? [ "validateTokenBinding" ]
                                            : []
                                    }
                                    children={ [
                                        {
                                            label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                ".sections.accessToken.fields.validateBinding.label"),
                                            value: "validateTokenBinding"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-access-token-validate-binding-checkbox` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                        ".accessToken.fields.validateBinding.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    ref={ revokeAccessToken }
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
                                            label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                ".sections.accessToken.fields.revokeToken.label"),
                                            value: "revokeAccessToken"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-access-token-revoke-token-checkbox` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
                        ref={ userAccessTokenExpiryInSeconds }
                        name="userAccessTokenExpiryInSeconds"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.label")
                        }
                        required={ true }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.validations.empty")
                        }
                        value={
                            initialValues.accessToken
                                ? initialValues.accessToken.userAccessTokenExpiryInSeconds.toString()
                                : metadata.defaultUserAccessTokenExpiryTime
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.placeholder")
                        }
                        type="number"
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-access-token-expiry-time-input` }
                    />
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".refreshToken.heading") }
                    </Heading>
                    <Divider hidden />
                    <Field
                        ref={ refreshToken }
                        name="RefreshToken"
                        label=""
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                    ".sections.refreshToken.fields.renew.label"),
                                value: "refreshToken"
                            }
                        ] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-renew-refresh-token-checkbox` }
                    />
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".refreshToken.fields.renew.hint") }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                    <Field
                        ref={ expiryInSeconds }
                        name="expiryInSeconds"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".refreshToken.fields.expiry.label")
                        }
                        required={ true }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".refreshToken.fields.expiry.validations.empty")
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".idToken.heading") }
                    </Heading>
                    <Divider hidden />
                    <Field
                        ref={ audience }
                        name="audience"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".idToken.fields.audience.label")
                        }
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.audience.validations.empty")
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.audience.placeholder")
                        }
                        value={ initialValues.idToken?.audience.toString() }
                        type="textarea"
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-audience-textarea` }
                    />
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                            ".fields.audience.hint") }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Field
                        ref={ encryption }
                        name="encryption"
                        label=""
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
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
                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                    ".sections.idToken.fields.encryption.label"),
                                value: "enableEncryption"
                            }
                        ] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-encryption-checkbox` }
                    />
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                            ".fields.encryption.hint") }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Field
                        ref={ algorithm }
                        name="algorithm"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.algorithm.label")
                        }
                        required={ isEncryptionEnabled }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.algorithm.validations.empty")
                        }
                        type="dropdown"
                        default={
                            initialValues.idToken
                                ? initialValues.idToken.encryption.algorithm
                                : metadata.idTokenEncryptionAlgorithm.defaultValue
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".idToken.fields.algorithm.placeholder")
                        }
                        children={ getAllowedList(metadata.idTokenEncryptionAlgorithm) }
                        disabled={ !isEncryptionEnabled }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-encryption-algorithm-dropdown` }
                    />
                    <Hint disabled={ !isEncryptionEnabled }>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                            ".fields.algorithm.hint") }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Field
                        ref={ method }
                        name="method"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".idToken.fields.method.label")
                        }
                        required={ isEncryptionEnabled }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.method.validations.empty")
                        }
                        type="dropdown"
                        default={
                            initialValues.idToken
                                ? initialValues.idToken.encryption.method
                                : metadata.idTokenEncryptionMethod.defaultValue
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.method.placeholder")
                        }
                        children={ getAllowedList(metadata.idTokenEncryptionMethod) }
                        disabled={ !isEncryptionEnabled }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-encryption-method-dropdown` }
                    />
                    <Hint disabled={ !isEncryptionEnabled }>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                            ".fields.method.hint") }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                    <Field
                        ref={ idExpiryInSeconds }
                        name="idExpiryInSeconds"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.expiry.label")
                        }
                        required={ true }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.expiry.validations.empty")
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
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
                        { t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">Logout URLs</Heading>
                    <Divider hidden />
                    <Field
                        ref={ backChannelLogoutUrl }
                        name="backChannelLogoutUrl"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".logoutURLs.fields.back.label")
                        }
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".logoutURLs.fields.back.validations.empty")
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".logoutURLs.fields.back.placeholder")
                        }
                        type="text"
                        validation={ (value: string, validation: Validation) => {
                            if (!FormValidation.url(value)) {
                                validation.isValid = false;
                                validation.errorMessages.push((
                                    t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                        ".logoutURLs.fields.back.validations.invalid")
                                ));
                            }
                        } }
                        value={ initialValues.logout?.backChannelLogoutUrl }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-back-channel-logout-url-input` }
                    />
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".logoutURLs.fields.back.hint", {
                            productName: config.ui.productName
                        }) }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Field
                        ref={ frontChannelLogoutUrl }
                        name="frontChannelLogoutUrl"
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".logoutURLs.fields.front.label")
                        }
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".logoutURLs.fields.front.validations.empty")
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".logoutURLs.fields.front.placeholder")
                        }
                        type="text"
                        validation={ (value: string, validation: Validation) => {
                            if (!FormValidation.url(value)) {
                                validation.isValid = false;
                                validation.errorMessages.push((
                                    t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
            { /*Request Object Signature*/ }
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Divider />
                    <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".requestObjectSignature.heading") }
                    </Heading>
                    <Hint>
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".requestObjectSignature.description", {
                            productName: config.ui.productName
                        }) }
                    </Hint>
                    <Divider hidden />
                    <Field
                        ref={ enableRequestObjectSignatureValidation }
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
                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                    ".sections.requestObjectSignature.fields.signatureValidation.label"),
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".scopeValidators.heading") }
                    </Heading>
                    <Divider hidden />
                    <Field
                        ref={ scopeValidator }
                        name="scopeValidator"
                        label=""
                        required={ false }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
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
            { /* Certificates */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Divider/>
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                    <Heading as="h5">
                        {
                            t("console:develop.features.applications.forms." +
                                "advancedConfig.sections.certificate.heading") }
                    </Heading>
                    <Hint>
                        { t("console:develop.features.applications.forms.advancedConfig.sections" +
                            ".certificate.hint", {
                            productName: config.ui.productName
                        }) }
                    </Hint>
                    <Field
                        label={
                            t("console:develop.features.applications.forms." +
                                "advancedConfig.sections.certificate.fields.type.label")
                        }
                        name="type"
                        default={ CertificateTypeInterface.JWKS }
                        listen={ (values) => {
                            console.log("VALUE SWITCHED", values);
                            const isPEMSelected = values.get("type") === "PEM";
                            setPEMSelected(isPEMSelected);
                        } }
                        type="radio"
                        value={ certificate?.type }
                        children={ [
                            {
                                label: t("console:develop.features.applications.forms." +
                                    "advancedConfig.sections.certificate.fields.type.children.jwks.label"),
                                value: CertificateTypeInterface.JWKS,
                                hint: {
                                    header: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.jwks.label"),
                                    content: t("console:develop.features.applications.forms.advancedConfig" +
                                        ".sections.certificate.fields.jwksValue.description")
                                },
                                child: !isPEMSelected ? JWKSSubField() : null,
                            },
                            {
                                label: t("console:develop.features.applications.forms." +
                                    "advancedConfig.sections.certificate.fields.type.children.pem.label"),
                                value: CertificateTypeInterface.PEM,
                                hint: {
                                    header: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.pem.label"),
                                    content: t("console:develop.features.applications.forms.advancedConfig" +
                                        ".sections.certificate.fields.pemValue.description")
                                },
                                child: isPEMSelected ? PEMSubField() : null,
                            }
                        ] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-certificate-type-radio-group` }
                    />
                </Grid.Column>
            </Grid.Row>
            {/*<Grid.Row columns={ 1 }>*/}
            {/*    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>*/}
            {/*        {*/}
            {/*            isPEMSelected*/}
            {/*                ?*/}
            {/*                (*/}
            {/*                    <>*/}
            {/*                        <Field*/}
            {/*                            stacked={ true }*/}
            {/*                            prefix={ PEM_CERTIFICATE_PREFIX }*/}
            {/*                            postfix={ PEM_CERTIFICATE_POSTFIX }*/}
            {/*                            name="certificateValue"*/}
            {/*                            label={*/}
            {/*                                t("console:develop.features.applications.forms.advancedConfig" +*/}
            {/*                                    ".sections.certificate.fields.pemValue.label")*/}
            {/*                            }*/}
            {/*                            required={ false }*/}
            {/*                            requiredErrorMessage={*/}
            {/*                                t("console:develop.features.applications.forms.advancedConfig" +*/}
            {/*                                    ".sections.certificate.fields.pemValue.validations.empty")*/}
            {/*                            }*/}
            {/*                            placeholder={*/}
            {/*                                "ggEPADCCAQoCggEBAMGPTyynn77hqcYnjWsMwOZDzdhVFY93s2OJntMbuKTHn39B\n" +*/}
            {/*                                "...\n" +*/}
            {/*                                "bml6YXRpb252YWxzaGEyZzIuY3JsMIGgBggrBgEFBQcBAQSBkzCBkDBNBggrBgEF"*/}
            {/*                            }*/}
            {/*                            type="textarea"*/}
            {/*                            value={*/}
            {/*                                (CertificateTypeInterface.PEM === certificate?.type)*/}
            {/*                                && certificate?.value*/}
            {/*                            }*/}
            {/*                            listen={*/}
            {/*                                (values) => {*/}
            {/*                                    setPEMValue(*/}
            {/*                                        PEM_CERTIFICATE_PREFIX +*/}
            {/*                                        (values.get("certificateValue") as string).trim() +*/}
            {/*                                        PEM_CERTIFICATE_POSTFIX*/}
            {/*                                    );*/}
            {/*                                    console.log('PEM',PEMValue)*/}
            {/*                                }*/}
            {/*                            }*/}
            {/*                            readOnly={ readOnly }*/}
            {/*                            data-testid={ `${ testId }-certificate-textarea` }*/}
            {/*                        />*/}
            {/*                        < Hint>*/}
            {/*                            {*/}
            {/*                                t("console:develop.features.applications.forms." +*/}
            {/*                                    "advancedConfig.sections.certificate.fields.pemValue.hint")*/}
            {/*                            }*/}
            {/*                        </Hint>*/}
            {/*                        <LinkButton*/}
            {/*                            className="certificate-info-link-button"*/}
            {/*                            onClick={ (e: MouseEvent<HTMLButtonElement>) => {*/}
            {/*                                e.preventDefault();*/}
            {/*                                viewCertificate();*/}
            {/*                            } }*/}
            {/*                            disabled={ isEmpty(PEMValue) }*/}
            {/*                            data-testid={ `${ testId }-certificate-info-button` }*/}
            {/*                        >*/}
            {/*                            {*/}
            {/*                                t("console:develop.features.applications.forms." +*/}
            {/*                                    "advancedConfig.sections.certificate.fields.pemValue.actions.view")*/}
            {/*                            }*/}
            {/*                        </LinkButton>*/}
            {/*                    </>*/}
            {/*                )*/}
            {/*                : (*/}
            {/*                    <>*/}
            {/*                        <Field*/}
            {/*                            name="jwksValue"*/}
            {/*                            label={*/}
            {/*                                t("console:develop.features.applications.forms.advancedConfig" +*/}
            {/*                                    ".sections.certificate.fields.jwksValue.label")*/}
            {/*                            }*/}
            {/*                            required={ false }*/}
            {/*                            requiredErrorMessage={*/}
            {/*                                t("console:develop.features.applications.forms.advancedConfig" +*/}
            {/*                                    ".sections.certificate.fields.jwksValue.validations.empty")*/}
            {/*                            }*/}
            {/*                            placeholder={*/}
            {/*                                t("console:develop.features.applications.forms.advancedConfig" +*/}
            {/*                                    ".sections.certificate.fields.jwksValue.placeholder") }*/}
            {/*                            type="text"*/}
            {/*                            validation={ (value: string, validation: Validation) => {*/}
            {/*                                if (!FormValidation.url(value)) {*/}
            {/*                                    validation.isValid = false;*/}
            {/*                                    validation.errorMessages.push(*/}
            {/*                                        t(*/}
            {/*                                            "console:develop.features.applications.forms" +*/}
            {/*                                            ".advancedConfig.sections.certificate.fields.jwksValue" +*/}
            {/*                                            ".validations.invalid"*/}
            {/*                                        )*/}
            {/*                                    );*/}
            {/*                                }*/}
            {/*                            } }*/}
            {/*                            value={*/}
            {/*                                (CertificateTypeInterface.JWKS === certificate?.type)*/}
            {/*                                && certificate?.value*/}
            {/*                            }*/}
            {/*                            readOnly={ readOnly }*/}
            {/*                            data-testid={ `${ testId }-jwks-input` }*/}
            {/*                        />*/}
            {/*                    </>*/}
            {/*                )*/}
            {/*        }*/}
            {/*    </Grid.Column>*/}
            {/*</Grid.Row>*/}
            {
                showCertificateModal && (
                    <CertificateFormFieldModal
                        open={ showCertificateModal }
                        certificate={ certificateDisplay }
                        onClose={ () => {
                            setShowCertificateModal(false);
                        } }
                    />
                )
            }
            {
                !readOnly && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
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
        </>
    );

    return (
        metadata ?
            (
                <Forms
                    onSubmit={ (values) => {
                        if (showCallbackURLField) {
                            submitUrl((url: string) => {
                                if (isEmpty(callBackUrls) && isEmpty(url)) {
                                    setShowURLError(true);
                                    scrollToInValidField("url");
                                } else {
                                    submitOrigin((origin) => {
                                        onSubmit(updateConfiguration(values, url, origin));
                                    });
                                }
                            });
                        } else {
                            onSubmit(updateConfiguration(values, undefined, undefined));
                        }
                    } }
                    onSubmitError={ (requiredFields: Map<string, boolean>, validFields: Map<string, Validation>) => {
                        const iterator = requiredFields.entries();
                        let result = iterator.next();

                        while (!result.done) {
                            if (!result.value[ 1 ] || !validFields.get(result.value[ 0 ]).isValid) {
                                scrollToInValidField(result.value[ 0 ]);
                                break;
                            } else {
                                result = iterator.next();
                            }
                        }
                    } }
                >
                    <Grid>
                        {
                            (initialValues?.state === State.REVOKED) && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                                        <Message warning visible>
                                            <Message.Header>
                                                {
                                                    t("console:develop.features.applications.forms.inboundOIDC." +
                                                        "messages.revokeDisclaimer.heading")
                                                }
                                            </Message.Header>
                                            <p>
                                                {
                                                    t("console:develop.features.applications.forms.inboundOIDC." +
                                                        "messages.revokeDisclaimer.content")
                                                }
                                            </p>
                                        </Message>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            initialValues.clientId && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                                        <Form.Field>
                                            <label>
                                                { t("console:develop.features.applications.forms.inboundOIDC.fields" +
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
                            (initialValues.clientSecret && (initialValues?.state !== State.REVOKED)) && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                                        <Form.Field>
                                            <label>
                                                {
                                                    t("console:develop.features.applications.forms.inboundOIDC.fields" +
                                                        ".clientSecret.label")
                                                }
                                            </label>
                                            {
                                                isClientSecretHashEnabled
                                                    ? (
                                                        <Message info visible>
                                                            {
                                                                t("console:develop.features.applications.forms." +
                                                                    "inboundOIDC.fields.clientSecret.hashedDisclaimer")
                                                            }
                                                        </Message>
                                                    )
                                                    : (
                                                        <CopyInputField
                                                            secret
                                                            value={ initialValues?.clientSecret }
                                                            hideSecretLabel={
                                                                t("console:develop.features.applications.forms." +
                                                                    "inboundOIDC.fields.clientSecret.hideSecret")
                                                            }
                                                            showSecretLabel={
                                                                t("console:develop.features.applications.forms." +
                                                                    "inboundOIDC.fields.clientSecret.showSecret")
                                                            }
                                                            data-testid={ `${ testId }-client-secret-readonly-input` }
                                                        />
                                                    )
                                            }
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            !readOnly && initialValues.clientSecret && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 8 }>
                                        <>
                                            <Button
                                                color={
                                                    (initialValues?.state === State.REVOKED)
                                                        ? "green"
                                                        : "red"
                                                }
                                                className="oidc-regenerate-button"
                                                onClick={ handleRegenerateButton }
                                                data-testid={ `${ testId }-oidc-regenerate-button` }
                                            >
                                                {
                                                    (initialValues?.state === State.REVOKED)
                                                        ? t("common:activate")
                                                        : t("common:regenerate")
                                                }
                                            </Button>
                                            {
                                                (initialValues?.state !== State.REVOKED) && (
                                                    <Button
                                                        color="red"
                                                        className="oidc-revoke-button"
                                                        onClick={ handleRevokeButton }
                                                        data-testid={ `${ testId }-oidc-revoke-button` }
                                                    >
                                                        { t("common:revoke") }
                                                    </Button>
                                                )
                                            }
                                        </>
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
                                                        "console:develop.features.applications.confirmations" +
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
                                        closeOnDimmerClick={ false }
                                    >
                                        <ConfirmationModal.Header
                                            data-testid={ `${ testId }-oidc-regenerate-confirmation-modal-header` }
                                        >
                                            { t("console:develop.features.applications.confirmations" +
                                                ".regenerateSecret.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            warning
                                            data-testid={ `${ testId }-oidc-regenerate-confirmation-modal-message` }
                                        >
                                            { t("console:develop.features.applications.confirmations" +
                                                ".regenerateSecret.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={ `${ testId }-oidc-regenerate-confirmation-modal-content` }
                                        >
                                            { t("console:develop.features.applications.confirmations" +
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
                                                        "console:develop.features.applications.confirmations" +
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
                                        closeOnDimmerClick={ false }
                                    >
                                        <ConfirmationModal.Header
                                            data-testid={ `${ testId }-oidc-revoke-confirmation-modal-header` }
                                        >
                                            { t("console:develop.features.applications.confirmations" +
                                                ".revokeApplication.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            warning
                                            data-testid={ `${ testId }-oidc-revoke-confirmation-modal-message` }
                                        >
                                            { t("console:develop.features.applications.confirmations" +
                                                ".revokeApplication.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={ `${ testId }-oidc-revoke-confirmation-modal-content` }
                                        >
                                            { t("console:develop.features.applications.confirmations" +
                                                ".revokeApplication.content") }
                                        </ConfirmationModal.Content>
                                    </ConfirmationModal>
                                </Grid.Row>
                            )
                        }
                        {
                            (initialValues?.clientId || initialValues?.clientSecret) && (
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ isHelpPanelVisible ? 16 : 10 }>
                                    <Divider />
                                </Grid.Column>
                            )
                        }
                        { (initialValues?.state !== State.REVOKED) && renderOIDCConfigFields() }
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
