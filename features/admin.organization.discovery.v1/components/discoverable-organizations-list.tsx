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

import { Show } from "@wso2is/access-control";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    LoadableComponentInterface
} from "@wso2is/core/models";
import {
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { AccessControlConstants } from "../../admin.access-control.v1/constants/access-control";
import {
    AppConstants,
    AppState,
    EventPublisher,
    UIConstants,
    history
} from "../../admin-core-v1";
import { getEmptyPlaceholderIllustrations } from "../../admin-core-v1/configs/ui";
import { OrganizationIcon } from "../configs/ui";
import { OrganizationDiscoveryConstants } from "../constants/organization-discovery-constants";
import {
    OrganizationDiscoveryInterface,
    OrganizationListWithDiscoveryInterface
} from "../models/organization-discovery";

/**
 * Props interface of {@link DiscoverableOrganizationsList}
 */
export interface DiscoverableOrganizationsListPropsInterface
    extends LoadableComponentInterface,
    IdentifiableComponentInterface {
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Organization list.
     */
    list: OrganizationListWithDiscoveryInterface;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Is the list rendered on a portal.
     */
    isRenderedOnPortal?: boolean;
}

/**
 * This component renders the discoverable organizations list.
 *
 * @param props - Props injected to the component.
 * @returns Discoverable organizations list component.
 */
const DiscoverableOrganizationsList: FunctionComponent<DiscoverableOrganizationsListPropsInterface> = (
    props: DiscoverableOrganizationsListPropsInterface
): ReactElement => {
    const {
        defaultListItemLimit,
        isLoading,
        list,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        isRenderedOnPortal,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.organizationDiscovery;
    });

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Redirects to the organizations edit page when the edit button is clicked.
     *
     * @param organizationId - Organization id.
     */
    const handleOrganizationEmailDomainEdit = (organizationId: string): void => {
        history.push({
            pathname: AppConstants.getPaths()
                .get("UPDATE_ORGANIZATION_DISCOVERY_DOMAINS")
                .replace(":id", organizationId)
        });
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (organization: OrganizationDiscoveryInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <GenericIcon
                                defaultIcon
                                relaxed="very"
                                size="micro"
                                shape="rounded"
                                spaced="right"
                                hoverable={ false }
                                icon={ OrganizationIcon }
                            />
                            <Header.Content>
                                { organization.organizationName }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("organizations:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("organizations:list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean =>
                    !isFeatureEnabled(
                        featureConfig,
                        OrganizationDiscoveryConstants.FEATURE_DICTIONARY.get( "ORGANIZATION_DISCOVERY_UPDATE")
                    ),
                icon: (): SemanticICONS => {

                    return !hasRequiredScopes(
                        featureConfig,
                        featureConfig?.scopes?.update,
                        allowedScopes
                    )
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, organization: OrganizationDiscoveryInterface): void =>
                    handleOrganizationEmailDomainEdit(organization.organizationId),
                popupText: (): string => {

                    return !hasRequiredScopes(
                        featureConfig,
                        featureConfig?.scopes?.update,
                        allowedScopes
                    )
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        if (searchQuery && (isEmpty(list) || list?.totalResults === 0)) {
            return (
                <EmptyPlaceholder
                    action={
                        (<LinkButton onClick={ onSearchQueryClear }>
                            { t("console:manage.placeholders.emptySearchResult.action") }
                        </LinkButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:manage.placeholders.emptySearchResult.subtitles.0", {
                            // searchQuery looks like "name co OrganizationName", so we only remove the filter string
                            // only to get the actual user entered query
                            query: searchQuery.split(" ").pop()
                        }),
                        t("console:manage.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        // When the search returns empty.
        if (isEmpty(list) || list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder mr-0" : "" }
                    action={
                        onEmptyListPlaceholderActionClick && (
                            <Show when={ AccessControlConstants.ORGANIZATION_DISCOVERY_WRITE }>
                                <PrimaryButton
                                    onClick={ () => {
                                        eventPublisher.publish(componentId + "-click-assign-email-domain-button");
                                        onEmptyListPlaceholderActionClick();
                                    } }
                                >
                                    <Icon name="add" />
                                    { t("organizationDiscovery:placeholders.emptyList.action") }
                                </PrimaryButton>
                            </Show>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [ t("organizationDiscovery:placeholders.emptyList.subtitles") ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <DataTable<OrganizationDiscoveryInterface>
            className="organizations-table"
            isLoading={ isLoading }
            loadingStateOptions={ {
                count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                imageType: "square"
            } }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ list?.organizations }
            onRowClick={ (e: SyntheticEvent, organization: OrganizationDiscoveryInterface): void => {
                handleOrganizationEmailDomainEdit(organization.organizationId);
            }
            }
            placeholders={ showPlaceholders() }
            selectable={ selection }
            showHeader={ false }
            transparent={ !isLoading && showPlaceholders() !== null }
            data-componentid={ componentId }
        />
    );
};

/**
 * Props interface of {@link DiscoverableOrganizationsList}
 */
DiscoverableOrganizationsList.defaultProps = {
    "data-componentid": "discoverable-organizations-list",
    selection: true,
    showListItemActions: true
};

export default DiscoverableOrganizationsList;
