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
import { UIConstants } from "@wso2is/admin.core.v1";
import {
    useApplicationRoleInvitedUserGroups, useDescendantsOfSubOrg
} from "@wso2is/admin.extensions.v1/components/application/api";
import {
    ApplicationRoleGroupInterface, DescendantDataInterface
} from "@wso2is/admin.extensions.v1/components/application/models";
import { CONSUMER_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { resolveUserstore } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    Popup,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ChangeEvent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Header, Icon, Input } from "semantic-ui-react";

interface ApplicationRoleGroupsProps extends IdentifiableComponentInterface {
    appId: string;
    roleId: string;
}

/**
 * Application role groups component.
 */
const ApplicationRoleInvitedUserGroups = (props: ApplicationRoleGroupsProps): ReactElement => {
    const {
        appId,
        roleId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ processedGroupsList, setProcessedGroupsList ] = useState<ApplicationRoleGroupInterface[]>([]);
    const [ initialGroupsList, setInitialGroupsList ] = useState<ApplicationRoleGroupInterface[]>([]);

    const {
        data: originalApplicationRoleGroupData,
        isLoading: isApplicationRoleGroupDataFetchRequestLoading,
        error: applicationRoleGroupDataFetchRequestError
    } = useApplicationRoleInvitedUserGroups(appId, roleId);

    const {
        data: originalDescendantData,
        isLoading: isDescendantDataFetchRequestLoading,
        error: descendantDataFetchRequestError
    } = useDescendantsOfSubOrg();

    useEffect(() => {
        if (originalApplicationRoleGroupData instanceof IdentityAppsApiException
                || applicationRoleGroupDataFetchRequestError) {
            handleAlerts({
                description: t(
                    "extensions:console.applicationRoles.roleGroups.fetchGroups.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:console.applicationRoles.roleGroups.fetchGroups.error.message"
                )
            });
        }
    }, [ originalApplicationRoleGroupData ]);

    useEffect(() => {
        if (originalDescendantData instanceof IdentityAppsApiException
                || descendantDataFetchRequestError) {
            handleAlerts({
                description: t(
                    "extensions:console.applicationRoles.roleGroups.fetchGroups.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:console.applicationRoles.roleGroups.fetchGroups.error.message"
                )
            });
        }
    }, [ originalDescendantData ]);

    useEffect(() => {
        if (originalApplicationRoleGroupData?.groups?.length > 0 && originalDescendantData?.length > 0) {
            mapOrganizationsToRoleGroupData();
        }
    }, [ originalApplicationRoleGroupData, originalDescendantData ]);

    /**
     * This will map the organization name to the group data.
     */
    const mapOrganizationsToRoleGroupData = () => {
        const groups: ApplicationRoleGroupInterface[] = originalApplicationRoleGroupData.groups;
        const descendants: DescendantDataInterface[] = originalDescendantData;

        const filteredGroups: ApplicationRoleGroupInterface[] = groups.filter(
            (group: ApplicationRoleGroupInterface) => {
                const descendant: DescendantDataInterface = descendants.find((descendant: DescendantDataInterface) => {
                    return descendant.id === group.organization;
                });

                if (descendant) {
                    group.orgName = descendant.name;

                    return group;
                }
            });

        setInitialGroupsList(filteredGroups);
        setProcessedGroupsList(filteredGroups);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Handles the change event of the search query input.
     * Return results that matches the search query.
     */
    const searchGroups = (query: string) => {
        setSearchQuery(query);

        if (query === "") {
            setProcessedGroupsList(initialGroupsList);

            return;
        }

        const filteredGroupsList: ApplicationRoleGroupInterface[] =
        initialGroupsList.filter((group: ApplicationRoleGroupInterface) => {
            return group.name.toLowerCase().includes(query.toLowerCase());
        });

        setProcessedGroupsList(filteredGroupsList);
    };

    const onSearchQueryClear = (): void => {
        setSearchQuery("");
        setProcessedGroupsList(initialGroupsList);
    };

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && processedGroupsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ componentId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (processedGroupsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-search-empty-placeholder` }
                    title={ t("extensions:console.applicationRoles.roleGroups.placeholder.title") }
                    subtitle={ [
                        t("extensions:console.applicationRoles.roleGroups.placeholder.subTitle.0")
                    ] }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (group: ApplicationRoleGroupInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ componentId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ group?.name?.split("/")[1] }
                                    size="mini"
                                    data-testid={ `${ componentId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ componentId }-item-image` }
                        />
                        <Header.Content>
                            <div className="mt-1">{ group?.name?.split("/")[1] } </div>
                        </Header.Content>
                    </Header>
                ),
                title: t("console:manage.features.groups.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "organizationName",
                id: "organizationName",
                key: "organizationName",
                render: (group: ApplicationRoleGroupInterface): ReactNode => {
                    const orgName: string = group?.orgName;

                    if (orgName === "super") {
                        return "Asgardeo";
                    }

                    return orgName;
                },
                title: "Organization"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "type",
                id: "type",
                key: "type",
                render: (group: ApplicationRoleGroupInterface): ReactNode => {
                    const grpName: string = resolveUserstore(group.name);

                    if (grpName === CONSUMER_USERSTORE) {
                        return CONSUMER_USERSTORE;
                    }

                    return grpName.toUpperCase();
                },
                title: (
                    <>
                        { t("console:manage.features.groups.list.columns.source") }
                        <Popup
                            trigger={ (
                                <div className="inline" >
                                    <Icon disabled name="info circle" className="link pointing pl-1" />
                                </div>
                            ) }
                            content="Where group is managed."
                            position="top center"
                            size="mini"
                            hideOnScroll
                            inverted
                        />
                    </>
                )
            }
        ];
    };

    return (
        !(isApplicationRoleGroupDataFetchRequestLoading && isDescendantDataFetchRequestLoading)
            ? (
                <>
                    <Grid>
                        {
                            (searchQuery || processedGroupsList?.length !== 0) && (
                                <Grid.Row columns={ 1 } className="pb-0">
                                    <Grid.Column width={ 6 }>
                                        <Input
                                            data-componentid={ `${ componentId }-groups-list-search-input` }
                                            icon={ <Icon name="search" /> }
                                            iconPosition="left"
                                            onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                                                searchGroups(e.target.value) }
                                            value={ searchQuery }
                                            placeholder={ t("extensions:console.applicationRoles.roleGroups." +
                                                "searchGroup") }
                                            floated="left"
                                            fluid
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <DataTable<ApplicationRoleGroupInterface[]>
                                    loadingStateOptions={ {
                                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                        imageType: "square"
                                    } }
                                    columns={ resolveTableColumns() }
                                    data={ processedGroupsList }
                                    onRowClick={ () => null }
                                    data-testid={ componentId }
                                    placeholders={ showPlaceholders() }
                                    isLoading={ isApplicationRoleGroupDataFetchRequestLoading ||
                                        isDescendantDataFetchRequestLoading }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </>
            )
            : <ContentLoader />
    );
};

export default ApplicationRoleInvitedUserGroups;
