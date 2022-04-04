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
import { URLUtils } from "@wso2is/core/utils";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import {
    Code,
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    GenericIcon,
    Heading,
    Hint,
    Text,
    URLInput
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import get from "lodash-es/get";
import intersection from "lodash-es/intersection";
import isEmpty from "lodash-es/isEmpty";
import union from "lodash-es/union";
import React, { Fragment, FunctionComponent, MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Container, Divider, Form, Grid, Label, List, Message } from "semantic-ui-react";
import { applicationConfig } from "../../../../extensions";
import { AppState, ConfigReducerStateInterface } from "../../../core";
import { getGeneralIcons } from "../../configs";
import { ApplicationManagementConstants } from "../../constants";
import CustomApplicationTemplate
    from "../../data/application-templates/templates/custom-application/custom-application.json";
import OIDCWebApplicationTemplate
    from "../../data/application-templates/templates/oidc-web-application/oidc-web-application.json";
import SinglePageApplicationTemplate
    from "../../data/application-templates/templates/single-page-application/single-page-application.json";
import {
    ApplicationInterface,
    ApplicationTemplateIdTypes,
    ApplicationTemplateListItemInterface,
    CertificateInterface,
    CertificateTypeInterface,
    GrantTypeInterface,
    GrantTypeMetaDataInterface,
    MetadataPropertyInterface,
    OAuth2PKCEConfigurationInterface,
    OIDCDataInterface,
    OIDCMetadataInterface,
    State,
    SupportedAccessTokenBindingTypes,
    SupportedAuthProtocolTypes
} from "../../models";
import { ApplicationManagementUtils } from "../../utils";
import { ApplicationCertificateWrapper } from "../settings/certificate";

/**
 * Proptypes for the inbound OIDC form component.
 */
interface InboundOIDCFormPropsInterface extends TestableComponentInterface {
    onUpdate: (id: string) => void;
    application: ApplicationInterface;
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
    /**
     * Handles loading UI.
     */
    isLoading?: boolean;
    setIsLoading?: (isLoading: boolean) => void;
}

/**
 * Interface for grant icons.
 */
interface GrantIconInterface {
    label: string | ReactElement;
    value: string;
    hint?: any;
    disabled?: boolean;
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
        onUpdate,
        application,
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
        isLoading,
        setIsLoading,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state.config.ui.isClientSecretHashEnabled);

    const [ isEncryptionEnabled, setEncryptionEnable ] = useState(false);
    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [ audienceUrls, setAudienceUrls ] = useState("");
    const [ showURLError, setShowURLError ] = useState(false);
    const [ showAudienceError, setShowAudienceError ] = useState(false);
    const [ showOriginError, setShowOriginError ] = useState(false);
    const [ showPKCEField, setPKCEField ] = useState<boolean>(undefined);
    const [ showCallbackURLField, setShowCallbackURLField ] = useState<boolean>(undefined);
    const [ hideRefreshTokenGrantType, setHideRefreshTokenGrantType ] = useState<boolean>(false);
    const [ selectedGrantTypes, setSelectedGrantTypes ] = useState<string[]>(undefined);
    const [ isGrantChanged, setGrantChanged ] = useState<boolean>(false);
    const [ showRegenerateConfirmationModal, setShowRegenerateConfirmationModal ] = useState<boolean>(false);
    const [ showRevokeConfirmationModal, setShowRevokeConfirmationModal ] = useState<boolean>(false);
    const [ showReactiveConfirmationModal, setShowReactiveConfirmationModal ] = useState<boolean>(false);
    const [ showLowExpiryTimesConfirmationModal, setShowLowExpiryTimesConfirmationModal ] = useState<boolean>(false);
    const [ lowExpiryTimesConfirmationModal, setLowExpiryTimesConfirmationModal ] = useState<ReactElement>(null);
    const [ allowedOrigins, setAllowedOrigins ] = useState("");
    const [
        isTokenBindingTypeSelected,
        setIsTokenBindingTypeSelected
    ] = useState<boolean>(false);
    const [ callbackURLsErrorLabel, setCallbackURLsErrorLabel ] = useState<ReactElement>(null);
    const [ allowedOriginsErrorLabel, setAllowedOriginsErrorLabel ] = useState<ReactElement>(null);
    const [ , setPEMSelected ] = useState<boolean>(false);
    const [ , setPEMValue ] = useState<string>(undefined);
    const [
        isRefreshTokenWithoutAllowedGrantType,
        setRefreshTokenWithoutAlllowdGrantType
    ] = useState<boolean>(false);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

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
    const applicationAccessTokenExpiryInSeconds = useRef<HTMLElement>();
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
    const [ isSPAApplication, setSPAApplication ] = useState<boolean>(false);
    const [ isOIDCWebApplication, setOIDCWebApplication ] = useState<boolean>(false);

    const [ finalCertValue, setFinalCertValue ] = useState<string>(undefined);
    const [ selectedCertType, setSelectedCertType ] = useState<CertificateTypeInterface>(CertificateTypeInterface.NONE);
    const [ isCertAvailableForEncrypt, setCertAvailableForEncrypt ] = useState(false);

    const [ triggerCertSubmit, setTriggerCertSubmit ] = useTrigger();

    /**
     * Reset the encryption field initial values if its
     * disabled by the user.
     */
    const resolveInitialIDTokenEncryptionValues = (): void => {
        if (initialValues?.idToken?.encryption?.enabled === false) {
            initialValues.idToken.encryption = {
                algorithm: "",
                enabled: false,
                method: ""
            };
        }
    };

    resolveInitialIDTokenEncryptionValues();

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

    /**
     * Check whether the application is a Single Page Application
     */
    useEffect(() => {
        if (!template?.id || !SinglePageApplicationTemplate?.id) {
            setIsLoading(false);

            return;
        }

        if (template.id == SinglePageApplicationTemplate.id) {
            setSPAApplication(true);
        }
        setIsLoading(false);
    }, [ template ]);

    /**
     * Check whether the application is an OIDC Web Application
     */
    useEffect(() => {
        if (!template?.id || !OIDCWebApplicationTemplate?.id) {
            return;
        }

        if (template.id == OIDCWebApplicationTemplate.id) {
            setOIDCWebApplication(true);
        }
    }, [ template ]);

    /**
     * Check whether to show the callback url or not
     */
    useEffect(() => {
        if (selectedGrantTypes?.includes("authorization_code") || selectedGrantTypes?.includes("implicit")) {
            setShowCallbackURLField(true);
        } else {
            setShowCallbackURLField(false);
        }

        const selectedRefreshTokenAllowedGrantTypes: string[] = intersection(ApplicationManagementConstants.
            IS_REFRESH_TOKEN_GRANT_TYPE_ALLOWED, selectedGrantTypes);

        if (!selectedRefreshTokenAllowedGrantTypes.length && selectedGrantTypes?.includes("refresh_token")) {
            setRefreshTokenWithoutAlllowdGrantType(true);
        } else {
            setRefreshTokenWithoutAlllowdGrantType(false);
        }

    }, [ selectedGrantTypes, isGrantChanged ]);

    /**
     * Check whether to show PKCE or not
     */
    useEffect(() => {
        setPKCEField(false);
        if (selectedGrantTypes?.includes(ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT)) {
            setPKCEField(true);
        }

    }, [ selectedGrantTypes, isGrantChanged ]);

    /**
     * Check whether to enable refresh token grant type or not.
     */
    useEffect(() => {
        setHideRefreshTokenGrantType(false);
        if (isHideRefreshTokenGrantType(selectedGrantTypes)) {
            setHideRefreshTokenGrantType(true);
        }
    }, [ selectedGrantTypes, isGrantChanged ]);

    const isHideRefreshTokenGrantType = (selectedGrantTypes): boolean => {
        if (selectedGrantTypes?.length === 0 || (selectedGrantTypes?.includes("implicit")
            && selectedGrantTypes?.length === 1)) {
            return true;
        }
        if (selectedGrantTypes?.includes("implicit") && selectedGrantTypes?.includes("refresh_token")
            && selectedGrantTypes?.length === 2) {
            return true;
        }

        return selectedGrantTypes?.includes(("refresh_token")) && selectedGrantTypes?.length === 1;

    };

    useEffect(() => {
        if (selectedGrantTypes !== undefined) {
            return;
        }

        if (initialValues?.grantTypes) {
            setSelectedGrantTypes([ ...initialValues?.grantTypes ]);
        }

        if (initialValues?.allowedOrigins) {
            setAllowedOrigins(initialValues?.allowedOrigins.toString());
        }

    }, [ initialValues ]);

    /**
     * Set the certificate type.
     */
    useEffect(() => {
        if (certificate?.type){
            setSelectedCertType(certificate?.type);
        }

    },[ certificate ]);

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
            if (certificate?.value) {
                setPEMValue(certificate.value);
            }
        }
    }, [ certificate ]);

    /**
     * Set certificate available for encryption or not.
     */
    useEffect(()=> {
        if (isEmpty(finalCertValue) || selectedCertType === CertificateTypeInterface.NONE) {
            setCertAvailableForEncrypt(false);
        } else {
            setCertAvailableForEncrypt(true);
        }
    },[ finalCertValue, selectedCertType ]);

    /**
     * Handle grant type change.
     *
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleGrantTypeChange = (values: Map<string, FormValue>) => {
        let grants: string[] = values.get("grant") as string[];

        if (isHideRefreshTokenGrantType(selectedGrantTypes)) {
            grants = grants.filter(grant => grant != "refresh_token");
        }
        setSelectedGrantTypes(grants);
        setGrantChanged(!isGrantChanged);
    };

    const getMetadataHints = (element: string) => {
        switch (element.toLowerCase()) {
            case "none":
                return t("console:develop.features.applications.forms" +
                    ".inboundOIDC.sections.accessToken.fields.bindingType.valueDescriptions.none", {
                    productName: config.ui.productName
                });
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
     * Moderates the metadata labels.
     *
     * @param {string} label - Raw label.
     * @return {string}
     */
    const moderateMetadataLabels = (label: string): string => {

        switch (label.toLowerCase()) {
            case "sso-session":
                return t("console:develop.features.applications.forms.inboundOIDC.sections" +
                    ".accessToken.fields.bindingType.children.ssoBinding.label");
            default:
                return label;
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
                        hint: {
                            content: getMetadataHints(ele)
                        },
                        label: moderateMetadataLabels(ele),
                        value: ele
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
     * Creates options for Radio using MetadataPropertyInterface options.
     *
     * @param {MetadataPropertyInterface} metadataProp - Metadata.
     * @param {boolean} isBinding - Indicate whether binding is true or false.
     * @return {any[]}
     */
    const getAllowedListForAccessToken = (metadataProp: MetadataPropertyInterface, isBinding?: boolean): any[] => {
        const allowedList = [];

        if (metadataProp) {
            metadataProp.options.map((ele) => {
                if ((ele === "Default") && !isBinding) {
                    allowedList.push({
                        hint: {
                            content: getMetadataHints(ele)
                        },
                        label: "Opaque",
                        value: ele
                    });
                // Cookie binding was hidden from the UI for SPAs & Traditional OIDC with
                // https://github.com/wso2/identity-apps/pull/2254
                } else if ((isSPAApplication || isOIDCWebApplication) && isBinding && ele === "cookie") {
                    return false;
                } else {
                    allowedList.push({
                        hint: {
                            content: getMetadataHints(ele)
                        },
                        label: moderateMetadataLabels(ele),
                        value: ele
                    });
                }
            });
        }

        return allowedList.sort((a, b) => {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;

            return 0;
        });
    };

    /**
     * Modifies the grant type label. For `implicit`, `password` and `client credentials` fields,
     * a warning icon is concatenated with the label.
     *
     * @param value {string} checkbox key {@link TEMPLATE_WISE_ALLOWED_GRANT_TYPES}
     * @param label {string} mapping label for value
     */
    const modifyGrantTypeLabels = (value: string, label: string) => {
        if (value === ApplicationManagementConstants.IMPLICIT_GRANT ||
            value === ApplicationManagementConstants.PASSWORD ||
            value === ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT
        ) {
            return (
                <>
                    <label>
                        { label }
                        <GenericIcon
                            icon={ getGeneralIcons().warning }
                            defaultIcon
                            colored
                            transparent
                            spaced="left"
                            floated="right"
                        />
                    </label>
                </>
            );
        }

        return label;
    };

    /**
     * Generates a string description/hint for the target {@code value} checkbox.
     * {@see TEMPLATE_WISE_ALLOWED_GRANT_TYPES} for different types.
     *
     * @param value {string}
     */
    const getGrantTypeHintDescription = (value: string): string => {
        switch (value) {
            case ApplicationManagementConstants.IMPLICIT_GRANT:
                return t("console:develop.features.applications.forms.inboundOIDC.fields.grant.children." +
                    "implicit.hint") + " " + "Asgardeo SDKs adhere to security best practices, and do not " +
                    "implement the implicit grant.";
            case ApplicationManagementConstants.PASSWORD:
                return t("console:develop.features.applications.forms.inboundOIDC.fields.grant.children." +
                    "password.hint") + " " + "Asgardeo SDKs adhere to security best practices, and do not " +
                    "implement the password grant.";
            case ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT:
                return t("console:develop.features.applications.forms.inboundOIDC.fields.grant.children." +
                        "client_credential.hint");
            case ApplicationManagementConstants.REFRESH_TOKEN_GRANT:
                return "Refresh token grant type should only be selected along with the Code grant type.";
            default:
                return null;
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
            metadataProp.options.map(({ name, displayName }: GrantTypeInterface) => {
                // Hides the grant types specified in the array.
                // TODO: Remove this once the specified grant types such as `account-switch` are handled properly.
                // See https://github.com/wso2/product-is/issues/8806.
                if (ApplicationManagementConstants.HIDDEN_GRANT_TYPES.includes(name)) {
                    return;
                }

                // Remove un-allowed grant types.
                if (template
                    && template.id
                    && get(ApplicationManagementConstants.TEMPLATE_WISE_ALLOWED_GRANT_TYPES, template.id)
                    && !ApplicationManagementConstants.TEMPLATE_WISE_ALLOWED_GRANT_TYPES[ template.id ]
                        .includes(name)) {

                    return;
                }

                /**
                 * Create the checkbox children object. {@code hint} is marked
                 * as optional because not all children have hint/description
                 * popups. {@see modules > forms > CheckboxChild}
                 */
                const grant: GrantIconInterface = {
                    label: modifyGrantTypeLabels(name, displayName),
                    value: name
                };

                /**
                 * Attach hint/description to this specific checkbox value.
                 * If there's no description provided in {@link getGrantTypeHintDescription}
                 * then we will not attach any hint popups.
                 */
                const description = getGrantTypeHintDescription(name);

                if (description) {
                    grant.hint = {
                        content: description
                    };
                }
                if (hideRefreshTokenGrantType && grant.value === "refresh_token") {
                    grant.disabled = true;
                }

                allowedList.push(grant);

            });
        }

        /**
         * Rearranging the allowed list according to the correct order.
         * Below algorithm assumes that the template's arrange order map
         * keys length is equals to allowedList.
         *
         * Below invariants must be satisfied to complete the operation: -
         *      - `template` AND `template.id` IS truthy
         *      - `arrangement` HAS `template.id`
         *      - `length(arrangement.length)` == `length(allowedList)`
         *
         * If all the above invariants are satisfied then we can safely
         * attach a `index` property to every entry of the `allowedList`
         * and sort the array to ascending order to rearrange the list
         * in-place.
         */
        if (template && template.id) {
            const arrangement: Map<string, number> = ApplicationManagementConstants
                .TEMPLATE_WISE_ALLOWED_GRANT_TYPE_ARRANGE_ORDER[ template.id ];

            if (arrangement && arrangement.size === allowedList.length) {
                for (const grant of allowedList) {
                    const index = arrangement.get(grant.value);

                    grant[ "index" ] = index ?? Infinity;
                }
                allowedList.sort(({ index: a }, { index: b }) => a - b);
            }
        }

        // Remove disabled grant types from the sorted list.
        if (applicationConfig.inboundOIDCForm.disabledGrantTypes &&
            applicationConfig.inboundOIDCForm.disabledGrantTypes.length > 0) {
            const filteredGrantList = allowedList.filter(function( item ) {
                return (!applicationConfig.inboundOIDCForm.disabledGrantTypes.includes(item.value));
            });

            return filteredGrantList;
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
     * Show Reactivate confirmation.
     *
     * @param event Button click event.
     */
    const handleReactivateButton = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowReactiveConfirmationModal(true);
    };

    /**
     * Find the status of revokeTokensWhenIDPSessionTerminated using form values for SPA
     *
     * @param values Form values
     */
    const getRevokeStateForSPA = (values: any): boolean => {
        return values.get("RevokeAccessToken") ? values.get("RevokeAccessToken")?.length > 0 :
            values.get("bindingType") !== SupportedAccessTokenBindingTypes.NONE;
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
                applicationAccessTokenExpiryInSeconds: values.get("applicationAccessTokenExpiryInSeconds")
                    ? Number(values.get("applicationAccessTokenExpiryInSeconds"))
                    : Number(metadata.defaultApplicationAccessTokenExpiryTime),
                bindingType: values.get("bindingType"),
                revokeTokensWhenIDPSessionTerminated: values.get("RevokeAccessToken")?.length > 0,
                type: values.get("type"),
                userAccessTokenExpiryInSeconds: Number(values.get("userAccessTokenExpiryInSeconds")),
                validateTokenBinding: values.get("ValidateTokenBinding")?.length > 0
            },
            grantTypes: values.get("grant"),
            idToken: {
                audience: audienceUrls !== "" ? audienceUrls.split(",") : [],
                encryption: {
                    algorithm: isEncryptionEnabled && isCertAvailableForEncrypt ?
                        values.get("algorithm") : metadata.idTokenEncryptionAlgorithm.defaultValue,
                    enabled: isCertAvailableForEncrypt && values.get("encryption")?.includes("enableEncryption"),
                    method: isEncryptionEnabled && isCertAvailableForEncrypt ?
                        values.get("method") : metadata.idTokenEncryptionMethod.defaultValue
                },
                expiryInSeconds: Number(values.get("idExpiryInSeconds"))
            },
            logout: {
                backChannelLogoutUrl: values.get("backChannelLogoutUrl"),
                frontChannelLogoutUrl: values.get("frontChannelLogoutUrl")
            },
            publicClient: values.get("supportPublicClients")?.length > 0,
            refreshToken: {
                expiryInSeconds: values.get("expiryInSeconds")
                    ? parseInt(values.get("expiryInSeconds"), 10)
                    : Number(metadata.defaultRefreshTokenExpiryTime),
                renewRefreshToken: values.get("RefreshToken")?.length > 0
            },
            scopeValidators: values.get("scopeValidator"),
            validateRequestObjectSignature: values.get("enableRequestObjectSignatureValidation")?.length > 0
        };

        !applicationConfig.inboundOIDCForm.showFrontChannelLogout
            && delete inboundConfigFormValues.logout.frontChannelLogoutUrl;
        !applicationConfig.inboundOIDCForm.showScopeValidators
            && delete inboundConfigFormValues.scopeValidators;
        !applicationConfig.inboundOIDCForm.showIdTokenEncryption
        && delete inboundConfigFormValues.idToken.encryption;
        !applicationConfig.inboundOIDCForm.showBackChannelLogout
        && delete inboundConfigFormValues.logout.backChannelLogoutUrl;
        !applicationConfig.inboundOIDCForm.showRequestObjectSignatureValidation
        && delete inboundConfigFormValues.validateRequestObjectSignature;

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

        // Add the `PKCE` only if the grant type
        // `authorization_code` is selected.
        if (showPKCEField) {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                pkce: {
                    mandatory: values.get("PKCE").includes("mandatory"),
                    supportPlainTransformAlgorithm: !!values.get("PKCE").includes("supportPlainTransformAlgorithm")
                }
            };
        } else {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                pkce: {
                    mandatory: false,
                    supportPlainTransformAlgorithm: false
                }
            };
        }

        // If the app is not a newly created, add `clientId` & `clientSecret`.
        if (initialValues?.clientId && initialValues?.clientSecret) {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                clientId: initialValues?.clientId,
                clientSecret: initialValues?.clientSecret
            };
        }

        const finalConfiguration: any = {
            general: {
                advancedConfigurations: {
                    certificate: {
                        type: (selectedCertType !== CertificateTypeInterface.NONE)
                            ? selectedCertType
                            : certificate?.type,
                        value: (selectedCertType !== CertificateTypeInterface.NONE) ? finalCertValue: ""
                    }
                }
            },
            inbound: {
                ...inboundConfigFormValues
            }
        };

        !applicationConfig.inboundOIDCForm.showCertificates
        && delete finalConfiguration.general.advancedConfigurations.certificate;

        return finalConfiguration;
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
    const updateConfigurationForSPA = (values: any, url?: string, origin?: string): any => {
        let inboundConfigFormValues: any = {
            accessToken: {
                applicationAccessTokenExpiryInSeconds: Number(metadata.defaultApplicationAccessTokenExpiryTime),
                bindingType: values.get("bindingType"),
                revokeTokensWhenIDPSessionTerminated: getRevokeStateForSPA(values),
                type: values.get("type"),
                userAccessTokenExpiryInSeconds: Number(values.get("userAccessTokenExpiryInSeconds"))
            },
            grantTypes: values.get("grant"),
            idToken: {
                audience: audienceUrls !== "" ? audienceUrls.split(",") : [],
                expiryInSeconds: Number(values.get("idExpiryInSeconds"))
            },
            publicClient: true,
            refreshToken: {
                expiryInSeconds: values.get("expiryInSeconds")
                    ? parseInt(values.get("expiryInSeconds"), 10)
                    : Number(metadata.defaultRefreshTokenExpiryTime),
                renewRefreshToken: values.get("RefreshToken")?.length > 0
            }
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

        // Add the `PKCE` only if the grant type
        // `authorization_code` is selected.
        if (showPKCEField) {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                pkce: {
                    mandatory: values.get("PKCE").includes("mandatory"),
                    supportPlainTransformAlgorithm: !!values.get("PKCE").includes("supportPlainTransformAlgorithm")
                }
            };
        } else {
            inboundConfigFormValues = {
                ...inboundConfigFormValues,
                pkce: {
                    mandatory: false,
                    supportPlainTransformAlgorithm: false
                }
            };
        }

        // If the app is newly created do not add `clientId` & `clientSecret`.
        if (!initialValues?.clientId || !initialValues?.clientSecret) {
            return inboundConfigFormValues;
        }

        return {
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
        let allowedURLs = allowedOrigins;

        if (allowedURLs !== "") {
            allowedURLs = allowedURLs + "," + url;
        }
        else {
            allowedURLs = url;
        }
        setAllowedOrigins(allowedURLs);
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
     * Check if a given expiry time is valid
     * @param value expiry time as a string
     */
    const isValidExpiryTime = (value: string) => {
        const numberValue = Math.floor(Number(value.toString()));

        return (numberValue !== Infinity && String(numberValue) === value && numberValue > 0);
    };

    /**
     * Renders the list of main OIDC config fields.
     * @return {ReactElement}
     */
    const renderOIDCConfigFields = (): ReactElement => (
        <>
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                        value={ selectedGrantTypes ?? initialValues?.grantTypes }
                        readOnly={ readOnly }
                        enableReinitialize={ true }
                        listen={ (values) => handleGrantTypeChange(values) }
                        data-testid={ `${ testId }-grant-type-checkbox-group` }
                    />
                    {
                        isRefreshTokenWithoutAllowedGrantType && (
                            <Label basic color="orange" className="mt-2" >
                                { t("console:develop.features.applications.forms.inboundOIDC.fields.grant" +
                                    ".validation.refreshToken") }
                            </Label>
                        )
                    }
                    <Hint>
                        {
                            t("console:develop.features.applications.forms.inboundOIDC.fields.grant.hint")
                        }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            {
                !isSPAApplication && selectedGrantTypes?.includes("authorization_code") &&
                (
                    <>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                                        initialValues?.publicClient
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
                                        productName: config.ui?.productName
                                    }) }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }
            {
                showCallbackURLField && (
                    <>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } className="field">
                                <div ref={ url } />
                                <URLInput
                                    isAllowEnabled={ isSPAApplication }
                                    handleAddAllowedOrigin={ (url: string) => handleAllowOrigin(url) }
                                    handleRemoveAllowedOrigin={ () => { return; } }
                                    tenantDomain={ tenantDomain }
                                    allowedOrigins={ union(allowedOriginList, allowedOrigins.split(",")) }
                                    labelEnabled={ true }
                                    urlState={ callBackUrls }
                                    setURLState={ setCallBackUrls }
                                    labelName={
                                        t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                            "callBackUrls.label")
                                    }
                                    required={ true }
                                    value={
                                        initialValues?.callbackURLs?.toString()
                                            ? ApplicationManagementUtils.buildCallBackURLWithSeparator(
                                                initialValues.callbackURLs.toString())
                                            : ""
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                            "callBackUrls.placeholder")
                                    }
                                    validationErrorMsg={
                                        CustomApplicationTemplate?.id !== template?.id
                                            ? t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                            "callBackUrls.validations.invalid")
                                            : t("console:develop.features.applications.forms.inboundOIDC.messages." +
                                                "customInvalidMessage")
                                    }
                                    emptyErrorMessage={
                                        t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                            "callBackUrls.validations.empty")
                                    }
                                    validation={ (value: string) => {
                                        if (CustomApplicationTemplate?.id !== template?.id
                                            && !(URLUtils.isURLValid(value, true) &&
                                                (URLUtils.isHttpUrl(value) ||
                                                    URLUtils.isHttpsUrl(value)))) {

                                            return false;
                                        }

                                        if (!URLUtils.isMobileDeepLink(value)) {
                                            return false;
                                        }

                                        setCallbackURLsErrorLabel(null);

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
                                    productName={ config.ui.productName }
                                    isCustom={ CustomApplicationTemplate?.id === template?.id }
                                    popupHeaderPositive={ t("console:develop.features.URLInput.withLabel."
                                        + "positive.header") }
                                    popupHeaderNegative={ t("console:develop.features.URLInput.withLabel."
                                        + "negative.header") }
                                    popupContentPositive={ t("console:develop.features.URLInput.withLabel."
                                        + "positive.content", { productName: config.ui.productName }) }
                                    popupContentNegative={ t("console:develop.features.URLInput.withLabel."
                                        + "negative.content", { productName: config.ui.productName }) }
                                    popupDetailedContentPositive={ t("console:develop.features.URLInput."
                                        + "withLabel.positive.detailedContent.0") }
                                    popupDetailedContentNegative={ t("console:develop.features.URLInput."
                                        + "withLabel.negative.detailedContent.0") }
                                    insecureURLDescription={ t("console:common.validations.inSecureURL.description") }
                                    showLessContent={ t("common:showLess") }
                                    showMoreContent={ t("common:showMore") }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } className="field">
                                <div ref={ allowedOrigin } />
                                <URLInput
                                    handleAddAllowedOrigin={ (url) => handleAllowOrigin(url) }
                                    urlState={ allowedOrigins }
                                    setURLState={ setAllowedOrigins }
                                    onlyOrigin={ true }
                                    labelName={
                                        t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".fields.allowedOrigins.label")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".fields.allowedOrigins.placeholder")
                                    }
                                    value={ allowedOrigins }
                                    validationErrorMsg={
                                        t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".fields.allowedOrigins.validations.empty")
                                    }
                                    validation={ (value: string) => {

                                        if (!(((URLUtils.isHttpsUrl(value) || URLUtils.isHttpUrl(value))) &&
                                            URLUtils.isAValidOriginUrl(value))) {

                                            return false;
                                        }

                                        if (!URLUtils.isMobileDeepLink(value)) {
                                            return false;
                                        }

                                        setAllowedOriginsErrorLabel(null);

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
                                    popupHeaderPositive={ t("console:develop.features.URLInput.withLabel."
                                        + "positive.header") }
                                    popupHeaderNegative={ t("console:develop.features.URLInput.withLabel."
                                        + "negative.header") }
                                    popupContentPositive={ t("console:develop.features.URLInput.withLabel."
                                        + "positive.content", { productName: config.ui.productName }) }
                                    popupContentNegative={ t("console:develop.features.URLInput.withLabel."
                                        + "negative.content", { productName: config.ui.productName }) }
                                    popupDetailedContentPositive={ t("console:develop.features.URLInput."
                                        + "withLabel.positive.detailedContent.0") }
                                    popupDetailedContentNegative={ t("console:develop.features.URLInput."
                                        + "withLabel.negative.detailedContent.0") }
                                    insecureURLDescription={ t("console:common.validations.inSecureURL.description") }
                                    showLessContent={ t("common:showLess") }
                                    showMoreContent={ t("common:showMore") }
                                />
                                <Hint>
                                    The HTTP origins that host your web application. You can define multiple web
                                    origins by adding them separately.
                                    <p className={ "mt-0" }>(E.g.,&nbsp;&nbsp;
                                        <Code>https://myapp.io, https://localhost:3000</Code>)
                                    </p>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }

            { /* Form Section: PKCE */ }
            {
                showPKCEField && (
                    <>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">
                                    { t("console:develop.features.applications.forms.inboundOIDC.sections.pkce" +
                                        ".heading") }
                                </Heading>
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
                                    value={ initialValues?.pkce && findPKCE(initialValues.pkce) }
                                    listen={ pkceValuesChangeListener }
                                    children={ !isSPAApplication
                                        ? [
                                            {
                                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                    ".sections.pkce.fields.pkce.children.mandatory.label"),
                                                value: ENABLE_PKCE_CHECKBOX_VALUE
                                            },
                                            {
                                                disabled: !enablePKCE,
                                                hint: {
                                                    content: t("console:develop.features.applications.forms." +
                                                        "inboundOIDC.sections.pkce.description", {
                                                        productName: config.ui.productName
                                                    }),
                                                    header: "PKCE 'Plain'"
                                                },
                                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                    ".sections.pkce.fields.pkce.children.plainAlg.label"),
                                                value: SUPPORT_PKCE_PLAIN_ALGORITHM_VALUE
                                            }
                                        ] : [
                                            {
                                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                    ".sections.pkce.fields.pkce.children.mandatory.label"),
                                                value: ENABLE_PKCE_CHECKBOX_VALUE
                                            }
                                        ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-pkce-checkbox-group` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundOIDC.sections.pkce.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }

            { /* Access Token */ }
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Divider />
                    <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Heading as="h4">
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
                            initialValues?.accessToken
                                ? initialValues.accessToken.type
                                : metadata.accessTokenType.defaultValue
                        }
                        type="radio"
                        children={ getAllowedListForAccessToken(metadata.accessTokenType, false) }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-access-token-type-radio-group` }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Field
                        ref={ bindingType }
                        label={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.bindingType.label")
                        }
                        name="bindingType"
                        default={
                            initialValues?.accessToken?.bindingType
                                ? initialValues.accessToken.bindingType
                                : metadata?.accessTokenBindingType?.defaultValue
                                ?? SupportedAccessTokenBindingTypes.NONE
                        }
                        type="radio"
                        children={ getAllowedListForAccessToken(metadata.accessTokenBindingType, true) }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-access-token-type-radio-group` }
                        listen={ (values) => {
                            setIsTokenBindingTypeSelected(
                                values.get("bindingType") !== SupportedAccessTokenBindingTypes.NONE
                            );
                        } }
                    />
                    <Hint>
                        <Trans
                            values={ { productName: config.ui.productName } }
                            i18nKey={
                                "console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.bindingType.description"
                            }
                        >
                            Select type <Code withBackground>SSO-session</Code> to allow productName to bind the
                            <Code withBackground>access_token</Code>
                            and the
                            <Code withBackground>refresh_token</Code>
                            to the login session and issue a new token per session. When the application
                            session ends, the tokens will also be revoked.
                        </Trans>
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            {
                (!isSPAApplication) && isTokenBindingTypeSelected && (
                    <>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    ref={ validateTokenBinding }
                                    name="ValidateTokenBinding"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage=""
                                    type="checkbox"
                                    value={
                                        initialValues?.accessToken?.validateTokenBinding
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
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.validateBinding.hint"
                                        }
                                    >
                                        Validate the binding attributes at the token validation. The client needs to
                                        present the <Code withBackground>access_token</Code> + cookie for successful
                                        authorization.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    ref={ revokeAccessToken }
                                    name="RevokeAccessToken"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage=""
                                    type="checkbox"
                                    value={
                                        initialValues?.accessToken?.revokeTokensWhenIDPSessionTerminated
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Field
                        ref={ userAccessTokenExpiryInSeconds }
                        name="userAccessTokenExpiryInSeconds"
                        label={ !isSPAApplication
                            ? t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.label") :
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.labelForSPA")
                        }
                        required={ true }
                        requiredErrorMessage={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.validations.empty")
                        }
                        validation={ async (value: FormValue, validation: Validation) => {
                            if (!isValidExpiryTime(value.toString())) {
                                validation.isValid = false;
                                validation.errorMessages.push(
                                    t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                        ".accessToken.fields.expiry.validations.invalid")
                                );
                            }
                        } }
                        value={
                            initialValues?.accessToken
                                ? initialValues.accessToken.userAccessTokenExpiryInSeconds.toString()
                                : metadata.defaultUserAccessTokenExpiryTime
                        }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.placeholder")
                        }
                        type="number"
                        readOnly={ readOnly }
                        min={ 1 }
                        data-testid={ `${ testId }-access-token-expiry-time-input` }
                    />
                    <Hint>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".accessToken.fields.expiry.hint"
                            }
                        >
                            Specify the validity period of the
                            <Code withBackground>access_token</Code>
                            in seconds.
                        </Trans>
                    </Hint>
                </Grid.Column>
            </Grid.Row>

            { /* Application AccessToken Expiry*/ }
            { selectedGrantTypes?.includes("client_credentials") &&
                (
                    <>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    name="applicationAccessTokenExpiryInSeconds"
                                    ref={ applicationAccessTokenExpiryInSeconds }
                                    label={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.applicationTokenExpiry.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.applicationTokenExpiry.validations.empty")
                                    }
                                    value={ initialValues.accessToken ?
                                        initialValues.accessToken.applicationAccessTokenExpiryInSeconds.toString() :
                                        metadata.defaultApplicationAccessTokenExpiryTime }
                                    validation={ async (value: FormValue, validation: Validation) => {
                                        if (!isValidExpiryTime(value.toString())) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                                    ".accessToken.fields.applicationTokenExpiry.validations.invalid")
                                            );
                                        }
                                    } }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".accessToken.fields.applicationTokenExpiry.placeholder")
                                    }
                                    type="number"
                                    min={ 1 }
                                    readOnly={ readOnly }
                                />
                                <Hint>Specify the validity period of the
                                    <Code withBackground>application_access_token</Code>
                                    in seconds.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }

            { /* Refresh Token */ }
            { selectedGrantTypes?.includes("refresh_token") &&
                (
                    <>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">
                                    { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                        ".refreshToken.heading") }
                                </Heading>
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
                                        initialValues?.refreshToken?.renewRefreshToken
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
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".refreshToken.fields.renew.hint"
                                        }
                                    >
                                        Select to issue a new <Code withBackground>refresh_token</Code>
                                        each time a <Code withBackground>refresh_token</Code> is
                                        exchanged. The existing token will be invalidated.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                                    validation={ async (value: FormValue, validation: Validation) => {
                                        if (!isValidExpiryTime(value.toString())) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                                    ".refreshToken.fields.expiry.validations.invalid")
                                            );
                                        }
                                    } }
                                    value={ initialValues?.refreshToken
                                        ? initialValues.refreshToken.expiryInSeconds.toString()
                                        : metadata.defaultRefreshTokenExpiryTime }
                                    type="number"
                                    readOnly={ readOnly }
                                    min={ 1 }
                                    data-testid={ `${ testId }-refresh-token-expiry-time-input` }
                                />
                                <Hint>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".refreshToken.fields.expiry.hint"
                                        }
                                    >
                                        Specify the validity period of the <Code withBackground>refresh_token</Code>
                                        in seconds.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }

            { /* ID Token */ }
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Divider />
                    <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } className="field">
                    <Heading as="h4">
                        { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                            ".idToken.heading") }
                    </Heading>
                    <URLInput
                        isAllowEnabled={ false }
                        tenantDomain={ tenantDomain }
                        onlyOrigin={ false }
                        labelEnabled={ false }
                        urlState={ audienceUrls }
                        setURLState={ setAudienceUrls }
                        labelName={
                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".idToken.fields.audience.label")
                        }
                        required={ false }
                        value={
                            initialValues?.idToken?.audience.toString()
                                ? ApplicationManagementUtils.buildCallBackURLWithSeparator(
                                    initialValues?.idToken?.audience.toString())
                                : ""
                        }
                        validation={ (value: string) => !value?.includes(",") }
                        placeholder={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.audience.placeholder")
                        }
                        validationErrorMsg={
                            t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.audience.validations.invalid")
                        }
                        showError={ showAudienceError }
                        setShowError={ setShowAudienceError }
                        hint={ (
                            <Trans
                                i18nKey={
                                    "console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                    ".fields.audience.hint"
                                }
                            >
                                Specify the recipient(s) that this <Code withBackground>id_token</Code> is intended
                                for. By default, the client ID of this application is added as an audience.
                            </Trans>
                        ) }
                        readOnly={ readOnly }
                        addURLTooltip={ t("common:addURL") }
                        duplicateURLErrorMessage={ t("common:duplicateURLError") }
                        getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                            submitUrl = submitFunction;
                        } }
                        showPredictions={ false }
                        skipInternalValidation={ true }
                        popupHeaderPositive={ t("console:develop.features.URLInput.withLabel."
                            + "positive.header") }
                        popupHeaderNegative={ t("console:develop.features.URLInput.withLabel."
                            + "negative.header") }
                        popupContentPositive={ t("console:develop.features.URLInput.withLabel."
                            + "positive.content", { productName: config.ui.productName }) }
                        popupContentNegative={ t("console:develop.features.URLInput.withLabel."
                            + "negative.content", { productName: config.ui.productName }) }
                        popupDetailedContentPositive={ t("console:develop.features.URLInput."
                            + "withLabel.positive.detailedContent.0") }
                        popupDetailedContentNegative={ t("console:develop.features.URLInput."
                            + "withLabel.negative.detailedContent.0") }
                        insecureURLDescription={ t("console:common.validations.inSecureURL.description") }
                        showLessContent={ t("common:showLess") }
                        showMoreContent={ t("common:showMore") }
                    />
                </Grid.Column>
            </Grid.Row>
            {
                applicationConfig.inboundOIDCForm.showIdTokenEncryption &&
                    ApplicationTemplateIdTypes.SPA !== template?.templateId &&
                (
                    <>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    ref={ encryption }
                                    name="encryption"
                                    label=""
                                    required={ false }
                                    disabled={ !isCertAvailableForEncrypt }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.encryption.validations.empty")
                                    }
                                    type="checkbox"
                                    listen={ (values: Map<string, FormValue>): void => {
                                        const encryptionEnabled = values.get("encryption").includes("enableEncryption");

                                        if (!encryptionEnabled) {
                                            resolveInitialIDTokenEncryptionValues();
                                            values.set("algorithm", "");
                                            values.set("method", "");
                                        }
                                        setEncryptionEnable(encryptionEnabled);
                                    } }
                                    value={
                                        initialValues?.idToken?.encryption.enabled
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
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.encryption.hint"
                                        }
                                    >
                                        Select to encrypt the <Code withBackground>id_token</Code>  when issuing the
                                        token using the public key of your application. To use encryption,
                                        configure the JWKS endpoint or the certificate of your application in the
                                        Certificate section below.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    ref={ algorithm }
                                    name="algorithm"
                                    label={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.algorithm.label")
                                    }
                                    required={ isEncryptionEnabled && isCertAvailableForEncrypt }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.algorithm.validations.empty")
                                    }
                                    type="dropdown"
                                    disabled={ !isEncryptionEnabled || !isCertAvailableForEncrypt }
                                    default={
                                        isEncryptionEnabled && isCertAvailableForEncrypt ? (initialValues?.idToken
                                            ? initialValues.idToken.encryption.algorithm
                                            : metadata.idTokenEncryptionAlgorithm.defaultValue) : ""
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".idToken.fields.algorithm.placeholder")
                                    }
                                    children={ getAllowedList(metadata.idTokenEncryptionAlgorithm) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-encryption-algorithm-dropdown` }
                                />
                                <Hint disabled={ !isEncryptionEnabled || !isCertAvailableForEncrypt }>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.algorithm.hint"
                                        }
                                    >
                                        The dropdown contains the supported <Code withBackground>id_token</Code>
                                        encryption algorithms.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    ref={ method }
                                    name="method"
                                    disabled={ !isEncryptionEnabled || !isCertAvailableForEncrypt }
                                    label={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".idToken.fields.method.label")
                                    }
                                    required={ isEncryptionEnabled && isCertAvailableForEncrypt }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.method.validations.empty")
                                    }
                                    type="dropdown"
                                    default={
                                        isEncryptionEnabled && isCertAvailableForEncrypt ? (initialValues?.idToken
                                            ? initialValues.idToken.encryption.method
                                            : metadata.idTokenEncryptionMethod.defaultValue) : ""
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.method.placeholder")
                                    }
                                    children={ getAllowedList(metadata.idTokenEncryptionMethod) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-encryption-method-dropdown` }
                                />
                                <Hint disabled={ !isEncryptionEnabled || !isCertAvailableForEncrypt }>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                            ".fields.method.hint"
                                        }
                                    >
                                        The dropdown contains the supported <Code withBackground>id_token</Code>
                                        encryption methods.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                        validation={ async (value: FormValue, validation: Validation) => {
                            if (!isValidExpiryTime(value.toString())) {
                                validation.isValid = false;
                                validation.errorMessages.push(
                                    t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                        ".idToken.fields.expiry.validations.invalid")
                                );
                            }
                        } }
                        value={
                            initialValues?.idToken
                                ? initialValues.idToken.expiryInSeconds.toString()
                                : metadata.defaultIdTokenExpiryTime
                        }
                        type="number"
                        readOnly={ readOnly }
                        min={ 1 }
                        data-testid={ `${ testId }-id-token-expiry-time-input` }
                    />
                    <Hint>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.forms.inboundOIDC.sections.idToken" +
                                ".fields.expiry.hint"
                            }
                        >
                            Specify the validity period of the <Code withBackground>id_token</Code> in seconds.
                        </Trans>
                    </Hint>
                </Grid.Column>
            </Grid.Row>

            { /* Logout */ }
            {
                (!isSPAApplication && applicationConfig.inboundOIDCForm.showBackChannelLogout) &&
                (
                    <>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">Logout URLs</Heading>
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
                                    value={ initialValues?.logout?.backChannelLogoutUrl }
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
                    </>
                )
            }
            { applicationConfig.inboundOIDCForm.showFrontChannelLogout && (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                            value={ initialValues?.logout?.frontChannelLogoutUrl }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-front-channel-logout-url-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
            ) }
            { /*Request Object Signature*/ }
            {
                (!isSPAApplication && applicationConfig.inboundOIDCForm.showRequestObjectSignatureValidation) &&
                (
                    <>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">
                                    { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                        ".requestObjectSignature.heading") }
                                </Heading>
                                <Field
                                    ref={ enableRequestObjectSignatureValidation }
                                    name="enableRequestObjectSignatureValidation"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={
                                        initialValues?.validateRequestObjectSignature
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
                                <Hint>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.forms.inboundOIDC.sections" +
                                            ".requestObjectSignature.description"
                                        }
                                        tOptions={ { productName: config.ui.productName } }
                                    >
                                        WSO2 Identity Server supports receiving an OIDC authentication request as
                                        a request object that is passed in a single, self-contained request
                                        parameter. Enable signature validation to accept only signed
                                        <Code>request</Code> objects in the authorization request.
                                    </Trans>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                )
            }
            { /* Scope Validators */ }
            { applicationConfig.inboundOIDCForm.showScopeValidators && (
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Divider />
                        <Divider hidden />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">
                            { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                ".scopeValidators.heading") }
                        </Heading>
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
                            value={ initialValues?.scopeValidators }
                            children={ getAllowedList(metadata.scopeValidators, true) }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-scope-validator-checkbox` }
                        />
                    </Grid.Column>
                </Grid.Row>
            ) }
            { /* Certificate Section */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <ApplicationCertificateWrapper
                        protocol={ SupportedAuthProtocolTypes.OIDC }
                        deleteAllowed={ !(initialValues.idToken?.encryption?.enabled) }
                        reasonInsideTooltipWhyDeleteIsNotAllowed={ (
                            <Fragment>
                                <Trans
                                    i18nKey={ "console:develop.features.applications.forms" +
                                    ".inboundOIDC.sections.certificates.disabledPopup" }
                                >
                                    This certificate is used to encrypt the <Code>id_token</Code>. First, you need
                                    to disable <Code>id_token</Code> encryption to proceed.
                                </Trans>
                            </Fragment>
                        ) }
                        onUpdate={ onUpdate }
                        application={ application }
                        updateCertFinalValue={ setFinalCertValue }
                        updateCertType={ setSelectedCertType }
                        certificate={ certificate }
                        readOnly={ readOnly }
                        hidden={ isSPAApplication || !(applicationConfig.inboundOIDCForm.showCertificates) }
                        isRequired={ true }
                        triggerSubmit={ triggerCertSubmit }
                    />
                </Grid.Column>
            </Grid.Row>
            {
                !readOnly && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Button
                                primary
                                type="submit"
                                size="small"
                                className="form-button"
                                loading={ isLoading }
                                disabled={ isLoading }
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

    /**
     * Renders the application secret regenerate confirmation modal.
     * @return {ReactElement}
     */
    const renderRegenerateConfirmationModal = (): ReactElement => (
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
    );

    /**
     * Renders the application revoke confirmation modal.
     * @return {ReactElement}
     */
    const renderRevokeConfirmationModal = (): ReactElement => (
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
                {
                    isSPAApplication
                        ? (
                            t("console:develop.features.applications.confirmations" +
                                ".revokeApplication.content"))
                        : null
                }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Renders the application reactivate confirmation modal.
     * @return {ReactElement}
     */
    const renderReactivateConfirmationModal = (): ReactElement => {
        return (
            <ConfirmationModal
                onClose={ (): void => setShowReactiveConfirmationModal(false) }
                type="warning"
                open={ showReactiveConfirmationModal }
                assertion={ initialValues?.clientId }
                assertionHint={
                    isSPAApplication
                        ? (
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.applications.confirmations" +
                                    ".reactivateSPA.assertionHint"
                                    }
                                    tOptions={ { id: initialValues?.clientId } }
                                >
                                Please type <strong>{ initialValues?.clientId }</strong> to confirm.
                                </Trans>
                            </p>
                        ) : (
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.applications.confirmations" +
                                    ".reactivateOIDC.assertionHint"
                                    }
                                    tOptions={ { id: initialValues?.clientId } }
                                >
                                Please type <strong>{ initialValues?.clientId }</strong> to confirm.
                                </Trans>
                            </p>
                        )
                }
                assertionType="input"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void =>
                    setShowReactiveConfirmationModal(false)
                }
                onPrimaryActionClick={ (): void => {
                    onApplicationRegenerate();
                    setShowReactiveConfirmationModal(false);
                } }
                data-testid={ `${ testId }-oidc-reactivate-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-oidc-reactivate-confirmation-modal-header` }
                >
                    {
                        !isSPAApplication
                            ? (
                                t("console:develop.features.applications.confirmations" +
                                ".reactivateSPA.header"))
                            : (
                                t("console:develop.features.applications.confirmations" +
                                ".reactivateOIDC.header"))
                    }
                </ConfirmationModal.Header>
                {
                    isSPAApplication
                        ? (
                            <ConfirmationModal.Message
                                attached
                                warning
                                data-testid={ `${ testId }-oidc-reactivate-confirmation-modal-message` }
                            >
                                { t("console:develop.features.applications.confirmations" +
                                ".reactivateSPA.message") }
                            </ConfirmationModal.Message>
                        ) : null
                }
                <ConfirmationModal.Content
                    data-testid={ `${ testId }-oidc-reactivate-confirmation-modal-content` }
                >
                    {
                        isSPAApplication
                            ? (
                                t("console:develop.features.applications.confirmations" +
                                ".reactivateSPA.content"))
                            : (
                                t("console:develop.features.applications.confirmations" +
                                ".reactivateOIDC.content"))
                    }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Validates if a confirmation modal to warn users regarding low expiration times.
     *
     * @param {Map<string, FormValue>} values - Form values.
     * @param {string} url - URL.
     * @param {string} origin - Origin.
     * @return {boolean}
     */
    const isExpiryTimesTooLow = (values: Map<string, FormValue>, url?: string, origin?: string): boolean => {

        const isUserAccessTokenExpiryInSecondsTooLow: boolean = parseInt(
            values.get("userAccessTokenExpiryInSeconds") as string, 10) < 60;
        const isExpiryInSecondsTooLow: boolean = parseInt(values.get("expiryInSeconds") as string, 10) < 60;
        const isIdExpiryInSecondsTooLow: boolean = parseInt(values.get("idExpiryInSeconds") as string, 10) < 60;

        if (isUserAccessTokenExpiryInSecondsTooLow || isExpiryInSecondsTooLow || isIdExpiryInSecondsTooLow) {
            setShowLowExpiryTimesConfirmationModal(true);
            setLowExpiryTimesConfirmationModal(
                <ConfirmationModal
                    onClose={ (): void => setShowLowExpiryTimesConfirmationModal(false) }
                    type="warning"
                    open={ true }
                    skipAssertion={ true }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowLowExpiryTimesConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        if (!isSPAApplication) {
                            onSubmit(updateConfiguration(values, url, origin));
                        } else {
                            onSubmit(updateConfigurationForSPA(values, url, origin));
                        }
                        setShowLowExpiryTimesConfirmationModal(false);
                    } }
                    data-testid={ `${ testId }-low-expiry-times-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-testid={ `${ testId }-low-expiry-times-confirmation-modal-header` }
                    >
                        { t("console:develop.features.applications.confirmations" +
                            ".lowOIDCExpiryTimes.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-testid={ `${ testId }-low-expiry-times-confirmation-modal-message` }
                    >
                        { t("console:develop.features.applications.confirmations" +
                            ".lowOIDCExpiryTimes.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-testid={ `${ testId }-low-expiry-times-confirmation-modal-content` }
                    >
                        <Text>
                            { t("console:develop.features.applications.confirmations.lowOIDCExpiryTimes.content") }
                        </Text>
                        <List bulleted>
                            {
                                isUserAccessTokenExpiryInSecondsTooLow && (
                                    <List.Item>
                                        { t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".sections.accessToken.fields.expiry.label") }
                                    </List.Item>
                                )
                            }
                            {
                                isExpiryInSecondsTooLow && (
                                    <List.Item>
                                        { t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".sections.refreshToken.fields.expiry.label") }
                                    </List.Item>
                                )
                            }
                            {
                                isIdExpiryInSecondsTooLow && (
                                    <List.Item>
                                        { t("console:develop.features.applications.forms.inboundOIDC" +
                                            ".sections.idToken.fields.expiry.label") }
                                    </List.Item>
                                )
                            }
                        </List>
                        <Text>
                            { t("console:develop.features.applications.confirmations.lowOIDCExpiryTimes." +
                                "assertionHint") }
                        </Text>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            );

            return true;
        }

        setShowLowExpiryTimesConfirmationModal(false);
        setLowExpiryTimesConfirmationModal(null);

        return false;
    };

    /**
     * Handle form submit.
     * @param {Map<string, >} values - Form values.
     */
    const handleFormSubmit = (values: Map<string, FormValue>): void => {

        let isExpiryTimesTooLowModalShown: boolean = false;

        setTriggerCertSubmit();
        if (!isSPAApplication && (applicationConfig.inboundOIDCForm.showCertificates)  &&
            selectedCertType !== CertificateTypeInterface.NONE && isEmpty(finalCertValue)) {
            return;
        }

        if (showCallbackURLField) {
            submitUrl((url: string) => {
                if (isEmpty(callBackUrls) && isEmpty(url)) {
                    setShowURLError(true);
                    scrollToInValidField("url");
                } else {
                    submitOrigin((origin) => {

                        isExpiryTimesTooLowModalShown = isExpiryTimesTooLow(values, url, origin);

                        if (!isExpiryTimesTooLowModalShown) {
                            if (!isSPAApplication) {
                                onSubmit(updateConfiguration(values, url, origin));
                            } else {
                                onSubmit(updateConfigurationForSPA(values, url, origin));
                            }
                        }
                    });
                }
            });

            return;
        }

        isExpiryTimesTooLowModalShown = isExpiryTimesTooLow(values, undefined, undefined);

        if (!isExpiryTimesTooLowModalShown) {
            if (!isSPAApplication) {
                onSubmit(updateConfiguration(values, undefined, undefined));
            } else {
                onSubmit(updateConfiguration(values, undefined, undefined));
            }
        }
        setIsLoading(false);
    };

    return (
        !isLoading && metadata ?
            (
                <Forms
                    onSubmit={ handleFormSubmit }
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
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                            initialValues?.clientId && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Form.Field>
                                            <label>
                                                { t("console:develop.features.applications.forms.inboundOIDC.fields" +
                                                    ".clientID.label") }
                                            </label>
                                            <div className="display-flex">
                                                <CopyInputField
                                                    value={ initialValues?.clientId }
                                                    data-testid={ `${ testId }-client-id-readonly-input` }
                                                />
                                                {
                                                    /**
                                                     * TODO - Application revoke is disabled until proper
                                                     * backend support for application disabling is provided
                                                     * Issue - https://github.com/wso2/product-is/issues/11453
                                                     * Comment - #issuecomment-954842169
                                                     */
                                                }
                                            </div>
                                        </Form.Field>
                                        {
                                            (
                                                applicationConfig.inboundOIDCForm.showNativeClientSecretMessage && (
                                                    initialValues?.state !== State.REVOKED
                                                ) && isSPAApplication
                                            )
                                                ? (
                                                    <Message info={ true }>
                                                        <Trans
                                                            i18nKey={
                                                                "console:develop.features.applications." +
                                                                "forms.inboundOIDC.fields.clientSecret.message"
                                                            }
                                                            values={ { productName: config.ui.productName } }
                                                        >
                                                            productName does not issue a&nbsp;
                                                            <Code withBackground>client_secret</Code> to native
                                                            applications or web browser-based applications for 
                                                            the purpose of client authentication.
                                                        </Trans>
                                                    </Message>
                                                )
                                                : null
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            (initialValues?.clientSecret && (initialValues?.state !== State.REVOKED) &&
                                (!isSPAApplication)) && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                                                        <div className="display-flex">
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
                                                                data-testid={
                                                                    `${ testId }-client-secret-readonly-input`
                                                                }
                                                            />
                                                            {
                                                                !readOnly && (
                                                                    <Button
                                                                        color="red"
                                                                        className="oidc-action-button"
                                                                        onClick={ handleRegenerateButton }
                                                                        data-testid={
                                                                            `${ testId }-oidc-regenerate-button`
                                                                        }
                                                                    >
                                                                        { t("common:regenerate") }
                                                                    </Button>
                                                                )
                                                            }
                                                        </div>
                                                    )
                                            }
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            !readOnly && initialValues?.clientSecret && (initialValues?.state === State.REVOKED) && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Button
                                            color="green"
                                            className="oidc-action-button ml-0"
                                            onClick={ handleReactivateButton }
                                            data-testid={ `${ testId }-oidc-regenerate-button` }
                                        >
                                            { t("common:activate") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            ((initialValues?.clientId || initialValues?.clientSecret)
                                && (initialValues?.state !== State.REVOKED)) && (
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Divider />
                                </Grid.Column>
                            )
                        }
                        { (initialValues?.state !== State.REVOKED) && renderOIDCConfigFields() }
                    </Grid>
                    { showRegenerateConfirmationModal && renderRegenerateConfirmationModal() }
                    { showRevokeConfirmationModal && renderRevokeConfirmationModal() }
                    { showReactiveConfirmationModal && renderReactivateConfirmationModal() }
                    { showLowExpiryTimesConfirmationModal && lowExpiryTimesConfirmationModal }
                </Forms>
            ) :
            (
                <Container>
                    <ContentLoader inline="centered" active/>
                </Container>
            )
    );
};

/**
 * Default props for the Inbound OIDC form component.
 */
InboundOIDCForm.defaultProps = {
    "data-testid": "inbound-oidc-form",
    initialValues: {
        accessToken: undefined,
        allowedOrigins: [],
        callbackURLs: [],
        clientId: "",
        clientSecret: "",
        grantTypes: [],
        idToken: undefined,
        logout: undefined,
        pkce: {
            mandatory: false,
            supportPlainTransformAlgorithm: false
        },
        publicClient: false,
        refreshToken: undefined,
        scopeValidators: [],
        state: undefined,
        validateRequestObjectSignature: undefined
    }
};
