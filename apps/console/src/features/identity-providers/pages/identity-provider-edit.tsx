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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    LabelWithPopup,
    PageLayout
} from "@wso2is/react-components";
import get from "lodash-es/get";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Label, Popup } from "semantic-ui-react";
import { AuthenticatorExtensionsConfigInterface, identityProviderConfig } from "../../../extensions/configs";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    FeatureConfigInterface,
    history
} from "../../core";
import { getIdentityProviderDetail, getLocalAuthenticator, getMultiFactorAuthenticatorDetails } from "../api";
import { EditIdentityProvider, EditMultiFactorAuthenticator } from "../components";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorMeta } from "../meta";
import {
    AuthenticatorInterface,
    IdentityProviderInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies,
    MultiFactorAuthenticatorInterface,
    SupportedQuickStartTemplateTypes
} from "../models";
import { IdentityProviderManagementUtils, IdentityProviderTemplateManagementUtils } from "../utils";

/**
 * Proptypes for the IDP edit page component.
 */
type IDPEditPagePropsInterface = TestableComponentInterface;

/**
 * Identity Provider Edit page.
 *
 * @param {IDPEditPagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const IdentityProviderEditPage: FunctionComponent<IDPEditPagePropsInterface> = (
    props: IDPEditPagePropsInterface & RouteComponentProps
): ReactElement => {

    const {
        location,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider.templates);

    const idpDescElement = useRef<HTMLDivElement>(null);

    const [
        identityProviderTemplate,
        setIdentityProviderTemplate
    ] = useState<IdentityProviderTemplateItemInterface>(undefined);
    const [
        connector,
        setConnector
    ] = useState<IdentityProviderInterface | MultiFactorAuthenticatorInterface | AuthenticatorInterface>(undefined);
    const [
        isConnectorDetailsFetchRequestLoading,
        setConnectorDetailFetchRequestLoading
    ] = useState<boolean>(undefined);
    const [ isExtensionsAvailable, setIsExtensionsAvailable ] = useState<boolean>(false);
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isDescTruncated, setIsDescTruncated ] = useState<boolean>(false);
    const isReadOnly = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.identityProviders, featureConfig?.identityProviders?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

    useEffect(() => {
        if (idpDescElement) {
            const nativeElement = idpDescElement.current;

            if (nativeElement && (nativeElement.offsetWidth < nativeElement.scrollWidth)) {
                setIsDescTruncated(true);
            }
        }
    }, [ idpDescElement, isConnectorDetailsFetchRequestLoading ]);
    
    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {

        if (!identityProviderConfig) {
            return;
        }

        const path: string[] = location.pathname.split("/");
        const id: string = path[ path.length - 1 ];

        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(identityProviderConfig
            .authenticators, id);

        if (authenticatorConfig?.isEnabled) {
            getMultiFactorAuthenticator(id, authenticatorConfig?.useAuthenticatorsAPI);

            return;
        }

        getIdentityProvider(id);
    }, [ identityProviderConfig ]);

    /**
     * Checks if the listing view defined in the config is the new connections view.
     */
    useEffect(() => {

        if (useNewConnectionsView !== undefined) {
            return;
        }

        setUseNewConnectionsView(identityProviderConfig.useNewConnectionsView);
    }, [ identityProviderConfig ]);

    /**
     *  Get IDP templates.
     */
    useEffect(() => {

        if (identityProviderTemplates !== undefined) {
            return;
        }

        setConnectorDetailFetchRequestLoading(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy
            ? config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE
            : IdentityProviderManagementConstants.
                DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY === IdentityProviderTemplateLoadingStrategies.REMOTE;

        IdentityProviderTemplateManagementUtils.getIdentityProviderTemplates(useAPI)
            .finally(() => {
                setConnectorDetailFetchRequestLoading(false);
            });
    }, [ identityProviderTemplates ]);

    /**
     * Load the template that the IDP is built on.
     */
    useEffect(() => {

        // Return if connector is not defined.
        if (!connector) {
            return;
        }

        // Return if connector is not an IdP.
        if (!IdentityProviderManagementUtils.isConnectorIdentityProvider(connector)) {
            return;
        }

        if (!(identityProviderTemplates
            && identityProviderTemplates instanceof Array
            && identityProviderTemplates.length > 0)) {

            return;
        }

        // TODO: Creating internal mapping to resolve the IDP template.
        // TODO: Should be removed once template id is supported from IDP REST API
        // Tracked Here - https://github.com/wso2/product-is/issues/11023
        const resolveTemplateId = (authenticatorId: string) => {

            if (authenticatorId) {
                if (authenticatorId === IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID) {
                    return IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK;
                } else if (authenticatorId === IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID) {
                    return IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE;
                } else if (authenticatorId === IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID) {
                    return IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.OIDC;
                } else if (authenticatorId === IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID) {
                    return IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.SAML;
                } else if (authenticatorId === IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID) {
                    return IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB;
                }
            }

            return "";
        };

        const template: IdentityProviderTemplateItemInterface = identityProviderTemplates
            .find((template: IdentityProviderTemplateItemInterface) => {
                return template.id === resolveTemplateId(
                    connector.federatedAuthenticators?.defaultAuthenticatorId);
            });

        setIdentityProviderTemplate(template);
    }, [ identityProviderTemplates, connector ]);

    /**
     * Retrieves idp details from the API.
     *
     * @param {string} id - IDP id.
     */
    const getIdentityProvider = (id: string): void => {
        setConnectorDetailFetchRequestLoading(true);

        getIdentityProviderDetail(id)
            .then((response) => {
                setConnector(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider." +
                            "notifications.getIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider." +
                            "notifications.getIDP.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider." +
                        "notifications.getIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider." +
                        "notifications.getIDP.genericError.message")
                }));
            })
            .finally(() => {
                setConnectorDetailFetchRequestLoading(false);
            });
    };

    /**
     * Retrieves the local authenticator details from the API.
     *
     * @param {string} id - Authenticator id.
     * @param {boolean} useAuthenticatorsAPI - Use the 
     */
    const getMultiFactorAuthenticator = (id: string, useAuthenticatorsAPI: boolean = true): void => {

        setConnectorDetailFetchRequestLoading(true);

        /**
         * Get authenticator details from either governance API or `authenticators` API.
         * @param {(id: string) => Promise<T>} cb - Callback.
         * @return {Promise<T>}
         */
        const getAuthenticatorDetails = <T extends unknown>(cb: (id: string) => Promise<T>) => {

            cb(id)
                .then((response: T) => {
                    setConnector(response);
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: t("console:develop.features.authenticationProvider." +
                                "notifications.getConnectionDetails.error.description",
                            { description: error.response.data.description }),
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.authenticationProvider." +
                                "notifications.getConnectionDetails.error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider." +
                            "notifications.getConnectionDetails.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider." +
                            "notifications.getConnectionDetails.genericError.message")
                    }));
                })
                .finally(() => {
                    setConnectorDetailFetchRequestLoading(false);
                });
        };

        if (useAuthenticatorsAPI) {
            getAuthenticatorDetails<AuthenticatorInterface>(getLocalAuthenticator);

            return;
        }

        getAuthenticatorDetails<MultiFactorAuthenticatorInterface>(getMultiFactorAuthenticatorDetails);
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Called when an idp is deleted.
     */
    const handleIdentityProviderDelete = (): void => {

        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Called when an idp updates.
     *
     * @param {string} id - IDP id.
     */
    const handleIdentityProviderUpdate = (id: string): void => {

        getIdentityProvider(id);
    };

    /**
     * Called when an Multi-factor authenticator updates.
     *
     * @param {string} id - Authenticator id.
     */
    const handleMultiFactorAuthenticatorUpdate = (id: string): void => {

        if (!identityProviderConfig) {
            return;
        }

        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(identityProviderConfig
            .authenticators, id);

        getMultiFactorAuthenticator(id, authenticatorConfig?.useAuthenticatorsAPI);
    };

    /**
     * Resolves the connector status label.
     *
     * @param {IdentityProviderInterface | MultiFactorAuthenticatorInterface} connector - Evaluating connector.
     *
     * @return {React.ReactElement}
     */
    const resolveStatusLabel = (connector: IdentityProviderInterface
        | MultiFactorAuthenticatorInterface): ReactElement => {

        // Return `null` if connector is not defined.
        if (!connector) {
            return null;
        }

        // Return `null` if connector is not an IdP.
        if (!IdentityProviderManagementUtils.isConnectorIdentityProvider(connector)) {
            return null;
        }

        if (connector?.isEnabled) {
            return (
                <LabelWithPopup
                    popupHeader={ t("console:develop.features.authenticationProvider.popups.appStatus.enabled.header") }
                    popupSubHeader={ t("console:develop.features.authenticationProvider.popups.appStatus." +
                        "enabled.content") }
                    labelColor="green"
                />
            );
        } else {
            return (
                <LabelWithPopup
                    popupHeader={ t("console:develop.features.authenticationProvider.popups.appStatus." +
                        "disabled.header") }
                    popupSubHeader={ t("console:develop.features.authenticationProvider.popups.appStatus." +
                        "disabled.content") }
                    labelColor="grey"
                />
            );
        }
    };

    /**
     * Resolves the connector image.
     *
     * @param {IdentityProviderInterface | MultiFactorAuthenticatorInterface} connector - Evaluating connector.
     *
     * @return {React.ReactElement}
     */
    const resolveConnectorImage = (connector: IdentityProviderInterface
        | MultiFactorAuthenticatorInterface): ReactElement => {

        if (!connector) {
            return (
                <AppAvatar
                    hoverable={ false }
                    isLoading={ true }
                    size="tiny"
                />
            );
        }

        if (IdentityProviderManagementUtils.isConnectorIdentityProvider(connector)) {
            if (connector.image) {
                return (
                    <AppAvatar
                        hoverable={ false }
                        name={ connector.name }
                        image={ connector.image }
                        size="tiny"
                    />
                );
            }

            return (
                <AnimatedAvatar
                    hoverable={ false }
                    name={ connector.name }
                    size="tiny"
                    floated="left"
                />
            );
        }

        return (
            <AppAvatar
                hoverable={ false }
                name={ connector.name }
                image={ AuthenticatorMeta.getAuthenticatorIcon(connector.id) }
                size="tiny"
            />
        );
    };

    /**
     * Resolves the connector name.
     *
     * @param {IdentityProviderInterface | MultiFactorAuthenticatorInterface} connector - Evaluating connector.
     *
     * @return {React.ReactElement}
     */
    const resolveConnectorName = (connector: IdentityProviderInterface
        | MultiFactorAuthenticatorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (IdentityProviderManagementUtils.isConnectorIdentityProvider(connector)) {

            return (
                <Fragment>
                    { connector.name }
                    {
                        (isConnectorDetailsFetchRequestLoading === false
                            && connector.name) && resolveStatusLabel(connector)
                    }
                </Fragment>
            );
        }

        return AuthenticatorMeta.getAuthenticatorDisplayName(connector.id)
            ?? (connector.friendlyName || connector.name);
    };

    /**
     * Resolves the connector description.
     *
     * @param {IdentityProviderInterface | MultiFactorAuthenticatorInterface} connector - Evaluating connector.
     *
     * @return {React.ReactElement}
     */
    const resolveConnectorDescription = (connector: IdentityProviderInterface
        | MultiFactorAuthenticatorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (IdentityProviderManagementUtils.isConnectorIdentityProvider(connector)) {

            return (
                <div className="with-label ellipsis" ref={ idpDescElement }>
                    {
                        identityProviderTemplate?.name &&
                        <Label size="small">{ identityProviderTemplate.name }</Label>
                    }
                    <Popup
                        disabled={ !isDescTruncated }
                        content={ connector?.description }
                        trigger={ (
                            <span>{ connector?.description }</span>
                        ) }
                    />
                </div>
            );
        }

        return (
            <div className="with-label ellipsis" ref={ idpDescElement }>
                {
                    connector?.description
                        ? (
                            <Popup
                                disabled={ !isDescTruncated }
                                content={ connector?.description }
                                trigger={ (
                                    <span>{ connector?.description }</span>
                                ) }
                            />
                        )
                        : AuthenticatorMeta.getAuthenticatorDescription(
                            connector.id
                        )
                }
            </div>
        );
    };

    return (
        <PageLayout
            isLoading={ isConnectorDetailsFetchRequestLoading || useNewConnectionsView === undefined }
            title={ resolveConnectorName(connector) }
            contentTopMargin={ true }
            description={ resolveConnectorDescription(connector) }
            image={ resolveConnectorImage(connector) }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: useNewConnectionsView
                    ? t("console:develop.pages.authenticationProviderTemplate.backButton")
                    : t("console:develop.pages.idpTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            {
                IdentityProviderManagementUtils.isConnectorIdentityProvider(connector)
                    ? (
                        <EditIdentityProvider
                            identityProvider={ connector }
                            isLoading={ isConnectorDetailsFetchRequestLoading }
                            onDelete={ handleIdentityProviderDelete }
                            onUpdate={ handleIdentityProviderUpdate }
                            isGoogle={
                                (identityProviderTemplate?.name === undefined)
                                    ? undefined
                                    : identityProviderTemplate.name === SupportedQuickStartTemplateTypes.GOOGLE
                            }
                            isSaml={
                                (connector?.federatedAuthenticators?.defaultAuthenticatorId === undefined)
                                    ? undefined
                                    : (connector.federatedAuthenticators.defaultAuthenticatorId
                                        === IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID)
                            }
                            isOidc={
                                (connector?.federatedAuthenticators?.defaultAuthenticatorId === undefined)
                                    ? undefined
                                    : (connector.federatedAuthenticators.defaultAuthenticatorId
                                        === IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID)
                            }
                            data-testid={ testId }
                            template={ identityProviderTemplate }
                            isTabExtensionsAvailable={ (isAvailable) => setIsExtensionsAvailable(isAvailable) }
                            type={ identityProviderTemplate?.id }
                            isReadOnly={ isReadOnly }
                        />
                    )
                    : (
                        <EditMultiFactorAuthenticator
                            authenticator={ connector }
                            isLoading={ isConnectorDetailsFetchRequestLoading }
                            onDelete={ handleIdentityProviderDelete }
                            onUpdate={ handleMultiFactorAuthenticatorUpdate }
                            isTabExtensionsAvailable={ (isAvailable) => setIsExtensionsAvailable(isAvailable) }
                            type={ connector?.id }
                            isReadOnly={ isReadOnly }
                        />
                    )
            }
        </PageLayout>
    );
};

/**
 * Default proptypes for the IDP edit page component.
 */
IdentityProviderEditPage.defaultProps = {
    "data-testid": "idp-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default IdentityProviderEditPage;
