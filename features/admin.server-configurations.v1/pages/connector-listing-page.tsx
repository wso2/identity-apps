/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface  } from "@wso2is/admin.core.v1/models/config";
import { AppState, store  } from "@wso2is/admin.core.v1/store";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1/configs/server-configuration";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Placeholder, Ref } from "semantic-ui-react";
import { getConnectorCategories, getConnectorCategory } from "../api";
import GovernanceConnectorCategoriesGrid from "../components/governance-connector-grid";
import { ServerConfigurationsConstants } from "../constants";
import {
    ConnectorOverrideConfig,
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface
} from "../models";
import { GovernanceConnectorUtils } from "../utils";

/**
 * Props for the Server Configurations page.
 */
type ConnectorListingPageInterface = TestableComponentInterface;

/**
 * `GovernanceConnectorInterface` type with `ref` attr.
 */
type GovernanceConnectorWithRef = GovernanceConnectorInterface & ReferableComponentInterface<HTMLDivElement>;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ConnectorListingPage: FunctionComponent<ConnectorListingPageInterface> = (
    props: ConnectorListingPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId = "governance-connectors-listing-page" } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<any> = useRef(null);

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isPasswordInputValidationEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isPasswordInputValidationEnabled);
    const { isSubOrganization } = useGetCurrentOrganizationType();

    const hasGovernanceConnectorReadPermission: boolean = useRequiredScopes(
        featureConfig?.governanceConnectors?.scopes?.read
    );
    const hasOrganizationDiscoveryReadPermission: boolean = useRequiredScopes(
        featureConfig?.organizationDiscovery?.scopes?.read
    );
    const hasResidentOutboundProvisioningFeaturePermission: boolean = useRequiredScopes(
        featureConfig?.residentOutboundProvisioning?.scopes?.feature
    );
    const hasInternalNotificationSendingReadPermission: boolean = useRequiredScopes(
        [
            ...featureConfig?.internalNotificationSending?.scopes?.feature ?? [],
            ...featureConfig?.internalNotificationSending?.scopes?.read ?? []
        ]
    );

    const predefinedCategories: any = useMemo(() => {
        const originalConnectors: Array<any> = GovernanceConnectorUtils.getCombinedPredefinedConnectorCategories();

        const refinedConnectorCategories: Array<any> = [];

        const isOrganizationDiscoveryEnabled: boolean = featureConfig?.organizationDiscovery?.enabled
            && hasOrganizationDiscoveryReadPermission;

        const isResidentOutboundProvisioningEnabled: boolean = featureConfig?.residentOutboundProvisioning?.enabled
            && hasResidentOutboundProvisioningFeaturePermission;

        const isConfiguringInternalNotificationSendingEnabled: boolean = featureConfig?.
            internalNotificationSending?.enabled
            && hasInternalNotificationSendingReadPermission;

        for (const category of originalConnectors) {
            if (!isOrganizationDiscoveryEnabled
                    && category.id === ServerConfigurationsConstants.ORGANIZATION_SETTINGS_CATEGORY_ID) {
                continue;
            }

            if (!isResidentOutboundProvisioningEnabled
                    && category.id === ServerConfigurationsConstants.PROVISIONING_SETTINGS_CATEGORY_ID) {
                continue;
            }

            if (!isConfiguringInternalNotificationSendingEnabled
                    && category.id === ServerConfigurationsConstants.NOTIFICATION_SETTINGS_CATEGORY_ID) {
                continue;
            }

            const filteredConnectors: Array<any> = category.connectors.
                filter((connector: any) => !serverConfigurationConfig.connectorsToHide.includes(connector.id));

            refinedConnectorCategories.push({ ...category, connectors: filteredConnectors });
        }

        return refinedConnectorCategories;
    }, [ featureConfig, UIConfig, allowedScopes ]);

    const [
        dynamicConnectorCategories,
        setDynamicConnectorCategories
    ] = useState<GovernanceConnectorCategoryInterface[]>([]);
    const [ connectors, setConnectors ] = useState<GovernanceConnectorCategoryInterface[]>([]);
    const [ selectedConnector, setSelectorConnector ] = useState<GovernanceConnectorWithRef>(null);
    const [ isConnectorCategoryLoading, setConnectorCategoryLoading ] = useState<boolean>(true);

    useEffect(() => {

        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (!hasGovernanceConnectorReadPermission) {

            return;
        }

        setConnectorCategoryLoading(true);
        getConnectorCategories()
            .then((response: GovernanceConnectorInterface[]) => {

                const connectorCategoryArray: GovernanceConnectorCategoryInterface[] = [];

                connectorCategoryArray.push(...response?.filter((category: GovernanceConnectorCategoryInterface) => {

                    if (category.id === ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID) {
                        return !isPasswordInputValidationEnabled;
                    }

                    return !serverConfigurationConfig.connectorCategoriesToHide.includes(category.id);
                }));

                setDynamicConnectorCategories(connectorCategoryArray);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    store.dispatch(addAlert({
                        description: I18n.instance.t("governanceConnectors:notifications." +
                        "getConnectorCategories.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("governanceConnectors:notifications." +
                        "getConfigurations.error.message")
                    }));
                } else {
                    // Generic error message
                    store.dispatch(addAlert({
                        description: I18n.instance.t("governanceConnectors:notifications." +
                        "getConfigurations.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("governanceConnectors:notifications." +
                        "getConfigurations.genericError.message")
                    }));
                }
            })
            .finally(() => {
                setConnectorCategoryLoading(false);
            });
    }, []);

    useEffect(() => {
        resolveDynamicCategories(dynamicConnectorCategories);
    }, [ dynamicConnectorCategories ]);

    /**
     * This will get the information from dynamic categories and will be combined with the existing categories
     *
     * @param categories - Dynamic categories to get information from
     */
    const resolveDynamicCategories = async (categories: GovernanceConnectorCategoryInterface[]): Promise<void> => {
        const dynamicConnectorCategoryArray: GovernanceConnectorCategoryInterface[] = [];

        if (categories?.length <= 0) {
            return;
        }

        for (const category of categories) {
            if (!serverConfigurationConfig.predefinedConnectorCategories.includes(category.id)) {
                const connectorCategory: GovernanceConnectorCategoryInterface | null =
                    await loadCategoryConnectors(category.id);

                // Filter out the SIFT connector from sub-organizations.
                if (isSubOrganization() && connectorCategory?.connectors.length > 0) {
                    connectorCategory.connectors =
                        connectorCategory?.connectors?.filter((connector: GovernanceConnectorInterface) =>
                            connector.id !== ServerConfigurationsConstants.SIFT_CONNECTOR_ID);
                }
                connectorCategory && dynamicConnectorCategoryArray.push(connectorCategory);
            }
        }

        setConnectors((connectors: GovernanceConnectorCategoryInterface[]) => [
            ...connectors,
            ...dynamicConnectorCategoryArray
        ]);
    };

    /**
     * This will get the information from a given category
     *
     * @param categoryId - ID of the category
     */
    const loadCategoryConnectors = (categoryId: string): Promise<GovernanceConnectorCategoryInterface | null> => {
        return getConnectorCategory(categoryId)
            .then((response: GovernanceConnectorCategoryInterface) => {
                let connectorList: GovernanceConnectorInterface[] = response?.connectors?.filter(
                    (connector: GovernanceConnectorInterface) =>
                        !serverConfigurationConfig.connectorsToHide.includes(connector.id));
                const connectorOverrides: ConnectorOverrideConfig[] = GovernanceConnectorUtils
                    .getConnectorPropertyOverrides();

                // If there are no connectors, skip the rest of the logic.
                if (!connectorList || connectorList.length < 1) {
                    return null;
                }

                connectorList?.map((connector: GovernanceConnectorWithRef) => {
                    connector.categoryId = categoryId;
                    connector.ref = React.createRef();
                    connector.header = connector.friendlyName;
                    connector.description = t("console:manage.features.governanceConnectors" +
                    ".genericDescription", { name: connector.friendlyName.toLowerCase() });
                    connector.isCustom =  true;
                    connector.testId = `${ connector.name }-card`;
                });

                connectorList = GovernanceConnectorUtils.overrideConnectorProperties(connectorList, connectorOverrides);

                // Group the connectors by category.
                const connectorCategory: GovernanceConnectorCategoryInterface = {
                    connectors: connectorList,
                    title: response.name
                };

                !selectedConnector && setSelectorConnector(connectorList[ 0 ] as GovernanceConnectorWithRef);

                return connectorCategory;
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }

                return null;
            });
    };

    /**
     * This function returns loading placeholders.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        const placeholders: ReactElement[] = [];
        const cardsPerRow: number[] = [ 1, 4, 2, 3 ];

        for (let rowIndex: number = 0; rowIndex < cardsPerRow.length; rowIndex++) {
            const cardsInRow: number = cardsPerRow[ rowIndex ];
            const cards: ReactElement[] = [];

            for (let columnIndex: number = 0; columnIndex < cardsInRow; columnIndex++) {
                cards.push(
                    <div
                        className="ui card fluid settings-card"
                        data-testid={ `${ testId }-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section placeholder">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                    <Placeholder.Paragraph>
                                        <Placeholder.Line />
                                        <Placeholder.Line />
                                    </Placeholder.Paragraph>
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                );
            }

            placeholders.push(
                <div key={ rowIndex } className="catergory-container">
                    <Typography className="mb-3" variant="h4">
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </Typography>
                    <div className="governance-connector-list-grid-wrapper">
                        <div className="governance-connector-list-grid">
                            { cards }
                        </div>
                    </div>
                </div>
            );
        }

        return <>{ placeholders }</>;
    };

    return (
        <PageLayout
            pageTitle= { t("console:common.sidePanel.loginAndRegistration.label") }
            title={ t("console:common.sidePanel.loginAndRegistration.label") }
            description={ t("console:common.sidePanel.loginAndRegistration.description") }
            data-testid={ `${ testId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                {
                    isConnectorCategoryLoading
                        ? renderLoadingPlaceholder()
                        : (
                            <GovernanceConnectorCategoriesGrid
                                connectorCategories={ predefinedCategories }
                                dynamicConnectors={ connectors }
                            />
                        )
                }
            </Ref>
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectorListingPage;
