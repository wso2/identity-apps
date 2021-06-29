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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    LabelWithPopup,
    PageLayout
} from "@wso2is/react-components";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    PortalDocumentationStructureInterface,
    history, setHelpPanelDocsContentURL
} from "../../core";
import { getIdentityProviderDetail } from "../api";
import { EditIdentityProvider } from "../components";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies,
    SupportedQuickStartTemplateTypes,
    emptyIdentityProvider
} from "../models";
import { IdentityProviderTemplateManagementUtils } from "../utils";

/**
 * Proptypes for the IDP edit page component.
 */
type IDPEditPagePropsInterface = TestableComponentInterface

/**
 * Identity Provider Edit page.
 *
 * @param {IDPEditPagePropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const IdentityProviderEditPage: FunctionComponent<IDPEditPagePropsInterface> = (
    props: IDPEditPagePropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state?.identityProvider?.templates);
    const [ identityProviderTemplate, setIdentityProviderTemplate ]
        = useState<IdentityProviderTemplateItemInterface>(undefined);
    const [ identityProvider, setIdentityProvider ] = useState<IdentityProviderInterface>(emptyIdentityProvider);
    const [ isIdentityProviderRequestLoading, setIdentityProviderRequestLoading ] = useState<boolean>(undefined);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number>(0);
    const [ isExtensionsAvailable, setIsExtensionsAvailable ] = useState<boolean>(false);

    /**
     * Triggered when the IDP state search param in the URL changes.
     */
    useEffect(() => {
        if (!urlSearchParams.get(IdentityProviderManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY)) {
            if (isExtensionsAvailable) {
                setDefaultActiveIndex(1);
            }
            return;
        }

    }, [ urlSearchParams.get(IdentityProviderManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY),
        isExtensionsAvailable ]);

    /**
     *  Get IDP templates.
     */
    useEffect(() => {
        if (identityProviderTemplates !== undefined) {
            return;
        }

        setIdentityProviderRequestLoading(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy ?
            config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE :
            IdentityProviderManagementConstants.
                DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY === IdentityProviderTemplateLoadingStrategies.REMOTE;
        IdentityProviderTemplateManagementUtils.getIdentityProviderTemplates(useAPI)
            .finally(() => {
                setIdentityProviderRequestLoading(false);
            });
    }, [ identityProviderTemplates ]);

    /**
     * Load the template that the IDP is built on.
     */
    useEffect(() => {

        if (!identityProvider
            || !(identityProviderTemplates
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
                    identityProvider.federatedAuthenticators?.defaultAuthenticatorId);
            });

        setIdentityProviderTemplate(template);
    }, [ identityProviderTemplates, identityProvider ]);

    /**
     * Retrieves idp details from the API.
     *
     * @param {string} id - IDP id.
     */
    const getIdentityProvider = (id: string): void => {
        setIdentityProviderRequestLoading(true);

        getIdentityProviderDetail(id)
            .then((response) => {
                setIdentityProvider(response);
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
                setIdentityProviderRequestLoading(false);
            });
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
     * Use effect for the initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getIdentityProvider(id);
    }, []);

    /**
     * Resolves the authentication provider status label.
     *
     * @return {ReactElement}
     */
    const resolveStatusLabel = (): ReactElement => {

        if (!identityProvider) {
            return null;
        }

        if (identityProvider?.isEnabled) {
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

    return (
        <PageLayout
            isLoading={ isIdentityProviderRequestLoading }
            title={ (
                <>
                    { identityProvider.name }
                    { isIdentityProviderRequestLoading === false && identityProvider.name &&  resolveStatusLabel() }
                </>
            ) }
            contentTopMargin={ true }
            description={ (
                <div className="with-label ellipsis">
                    {
                        identityProviderTemplate?.name &&
                        <Label size="small">{ identityProviderTemplate.name }</Label>
                    }
                    { identityProvider.description }
                </div>
            ) }
            image={
                identityProvider.image
                    ? (
                        <AppAvatar
                            name={ identityProvider.name }
                            image={ identityProvider.image }
                            size="tiny"
                        />
                    )
                    : (
                        <AnimatedAvatar
                            name={ identityProvider.name }
                            size="tiny"
                            floated="left"
                        />
                    )
            }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.authenticationProviderTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <EditIdentityProvider
                identityProvider={ identityProvider }
                isLoading={ isIdentityProviderRequestLoading }
                onDelete={ handleIdentityProviderDelete }
                onUpdate={ handleIdentityProviderUpdate }
                isGoogle={
                    (identityProviderTemplate?.name === undefined)
                        ? undefined
                        : identityProviderTemplate.name === SupportedQuickStartTemplateTypes.GOOGLE
                }
                isSaml={
                    (identityProvider?.federatedAuthenticators?.defaultAuthenticatorId === undefined)
                        ? undefined
                        :(identityProvider.federatedAuthenticators.defaultAuthenticatorId
                            === IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID)
                }
                isOidc={
                    (identityProvider?.federatedAuthenticators?.defaultAuthenticatorId === undefined)
                        ? undefined
                        :(identityProvider.federatedAuthenticators.defaultAuthenticatorId
                        === IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID)
                }
                data-testid={ testId }
                template={ identityProviderTemplate }
                defaultActiveIndex={ defaultActiveIndex }
                isTabExtensionsAvailable={ (isAvailable) => setIsExtensionsAvailable(isAvailable) }
                type={ identityProviderTemplate?.id }
            />
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
