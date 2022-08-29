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

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { AlertLevels, ProfileInfoInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Heading,
    Jumbotron,
    PageLayout,
    StatsInsightsWidget,
    StatsOverviewWidget,
    StatsQuickLinksWidget,
    UserAvatar
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Icon, Responsive } from "semantic-ui-react";
import { AppConstants, AppState, UIConstants, history } from "../../core";
import { GroupList } from "../../groups/components";
import { GroupsInterface } from "../../groups/models";
import { getRolesList } from "../../roles/api";
import { RealmConfigInterface, getServerConfigs } from "../../server-configurations";
import { UserListInterface, UsersList, getUsersList } from "../../users";
import { QueryParams, getUserStores } from "../../userstores";
import { getOverviewPageIllustrations } from "../configs";

/**
 * Proptypes for the overview page component.
 */
type OverviewPageInterface = TestableComponentInterface;

/**
 * Overview page.
 *
 * @param {OverviewPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OverviewPage: FunctionComponent<OverviewPageInterface> = (
    props: OverviewPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ isGroupsListRequestLoading, setGroupsListRequestLoading ] = useState<boolean>(false);
    const [ userstoresCount, setUserstoresCount ] = useState<number>(0);
    const [ userCount, setUsersCount ] = useState<number>(0);
    const [ groupCount, setGroupCount ] = useState<number>(0);
    const [ realmConfigs, setRealmConfigs ] = useState<RealmConfigInterface>(undefined);

    useEffect(() => {
        getUserstoresList(null, null, null, null);
        getUserList(UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT, null, null, null, null);
        getGroupsList();
        getAdminUser();
    }, []);

    const getUserList = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {
        setUserListRequestLoading(true);

        getUsersList(limit, offset, filter, attribute, domain)
            .then((response) => {
                setUsersList(response);
                setUsersCount(response?.totalResults);
            })
            .finally(() => {
                setUserListRequestLoading(false);
            });
    };

    /**
     * Util method to get super admin
     */
    const getAdminUser = () => {
        getServerConfigs()
            .then((response) => {
                setRealmConfigs(response?.realmConfig);
            });
    };

    const getGroupsList = () => {
        setGroupsListRequestLoading(true);

        getRolesList(undefined)
            .then((response) => {
                if (response.status === 200) {
                    const roleResources = response.data.Resources;
                    if (roleResources && roleResources instanceof Array && roleResources.length !== 0) {
                        const updatedResources = roleResources.filter((role: RolesInterface) => {
                            return !role.displayName.includes("Application/")
                                && !role.displayName.includes("Internal/");
                        });
                        response.data.Resources = updatedResources;
                        setGroupsList(updatedResources);
                        setGroupCount(updatedResources.length);
                        
                        return;
                    }

                    setGroupsList([]);
                }
            })
            .finally(() => {
                setGroupsListRequestLoading(false);
            });
    };

    /**
     * Fetches all userstores.
     *
     * @param {number} limit - List limit.
     * @param {string} sort - Sort strategy.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getUserstoresList = (limit?: number, sort?: string, offset?: number, filter?: string) => {
        const params: QueryParams = {
            filter: filter || null,
            limit: limit || null,
            offset: offset || null,
            sort: sort || null
        };

        getUserStores(params)
            .then(response => {
                if (response && response instanceof Array) {
                    setUserstoresCount(response.length);
                }
            })
            .catch(error => {
                dispatch(addAlert(
                    {
                        description: error?.description
                            || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                                ".description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                                ".message")
                    }
                ));
            });
    };

    const resolveGridContent = () => (
        <>
            <Grid.Column className="with-bottom-gutters">
                <StatsQuickLinksWidget
                    heading={ t("console:manage.features.overview.widgets.quickLinks.heading") }
                    subHeading={ t("console:manage.features.overview.widgets.quickLinks.subHeading") }
                    links={ [
                        {
                            description: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".groups.subHeading"),
                            header: t("console:manage.features.overview.widgets.quickLinks.cards.groups" +
                                ".heading"),
                            image: getOverviewPageIllustrations().quickLinks.groups,
                            onClick: () => {
                                history.push(AppConstants.getPaths().get("GROUPS"));
                            }
                        },
                        {
                            description: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".roles.subHeading"),
                            header: t("console:manage.features.overview.widgets.quickLinks.cards.roles" +
                                ".heading"),
                            image: getOverviewPageIllustrations().quickLinks.roles,
                            onClick: () => {
                                history.push(AppConstants.getPaths().get("ROLES"));
                            }
                        },
                        {
                            description: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".dialects.subHeading"),
                            header: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".dialects.heading"),
                            image: getOverviewPageIllustrations().quickLinks.dialects,
                            onClick: () => {
                                history.push(AppConstants.getPaths().get("CLAIM_DIALECTS"));
                            }
                        },
                        {
                            description: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".certificates.subHeading"),
                            header: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".certificates.heading"),
                            image: getOverviewPageIllustrations().quickLinks.certificates,
                            onClick: () => {
                                history.push(AppConstants.getPaths().get("CERTIFICATES"));
                            }
                        },
                        {
                            description: t("console:manage.features.overview.widgets.quickLinks" +
                                ".cards.generalConfigs.subHeading"),
                            header: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".generalConfigs.heading"),
                            image: getOverviewPageIllustrations().quickLinks.generalConfigs,
                            onClick: () => {
                                history.push(AppConstants.getPaths().get("SERVER_CONFIGS"));
                            }
                        },
                        {
                            description: t("console:manage.features.overview.widgets.quickLinks" +
                                ".cards.emailTemplates.subHeading"),
                            header: t("console:manage.features.overview.widgets.quickLinks.cards" +
                                ".emailTemplates.heading"),
                            image: getOverviewPageIllustrations().quickLinks.emailTemplates,
                            onClick: () => {
                                history.push(AppConstants.getPaths().get("EMAIL_TEMPLATE_TYPES"));
                            }
                        }
                    ] }
                />
            </Grid.Column>
            <Grid.Column className="with-bottom-gutters">
                <StatsInsightsWidget
                    heading={ t("console:manage.features.overview.widgets.insights.groups.heading") }
                    subHeading={ t("console:manage.features.overview.widgets.insights.groups.subHeading") }
                    primaryAction={ <><Icon name="location arrow"/>{ t("common:explore") }</> }
                    onPrimaryActionClick={ () => history.push(AppConstants.getPaths().get("GROUPS")) }
                    showExtraContent={ groupList instanceof Array && groupList.length > 0 }
                >
                    <GroupList
                        selection
                        defaultListItemLimit={ UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT }
                        data-testid="group-mgt-groups-list"
                        isLoading={ isGroupsListRequestLoading }
                        onEmptyListPlaceholderActionClick={ () => history.push(AppConstants.getPaths().get("GROUPS")) }
                        showListItemActions={ false }
                        showMetaContent={ false }
                        groupList={ groupList }
                    />
                </StatsInsightsWidget>
            </Grid.Column>
            <Grid.Column className="with-bottom-gutters">
                <StatsInsightsWidget
                    heading={ t("console:manage.features.overview.widgets.insights.users.heading") }
                    subHeading={ t("console:manage.features.overview.widgets.insights.users.subHeading") }
                    primaryAction={ <><Icon name="location arrow"/>{ t("common:explore") }</> }
                    onPrimaryActionClick={ () => history.push(AppConstants.getPaths().get("USERS")) }
                    showExtraContent={
                        usersList?.Resources
                        && usersList.Resources instanceof Array
                        && usersList.Resources.length > 0
                    }
                >
                    <UsersList
                        selection
                        defaultListItemLimit={ UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT }
                        isLoading={ isUserListRequestLoading }
                        realmConfigs={ realmConfigs }
                        usersList={ usersList }
                        onEmptyListPlaceholderActionClick={ () => history.push(AppConstants.getPaths().get("USERS")) }
                        showListItemActions={ false }
                        showMetaContent={ false }
                        data-testid={ `${ testId }-list` }
                    />
                </StatsInsightsWidget>
            </Grid.Column>
        </>
    );

    return (
        <PageLayout
            contentTopMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <Jumbotron
                bordered
                background="white"
                contentInline
                iconOptions={ {
                    fill: "primary"
                } }
                data-testid={ `${ testId }-jumbotron` }
            >
                <div className="inline-flex">
                    <UserAvatar
                        inline
                        profileInfo={ profileInfo }
                        isLoading={ isProfileInfoLoading }
                        spaced="right"
                        size="x60"
                    />
                    <div>
                        <Heading as="h1" ellipsis compact>
                            {
                                t(
                                    "console:manage.overview.title",
                                    { firstName: resolveUserDisplayName(profileInfo) }
                                )
                            }
                        </Heading>
                        <Heading as="h5" subHeading ellipsis>
                            { t("console:manage.pages.overview.subTitle") }
                        </Heading>
                    </div>
                </div>
            </Jumbotron>
            <Divider hidden />
            <StatsOverviewWidget
                heading={ t("console:manage.features.overview.widgets.overview.heading") }
                subHeading={ t("console:manage.features.overview.widgets.overview.subHeading") }
                stats={ [
                    {
                        icon: getOverviewPageIllustrations().statsOverview.users,
                        iconOptions: {
                            background: "accent1",
                            fill: "white"
                        },
                        label: t("console:manage.features.overview.widgets.overview.cards.users.heading"),
                        value: userCount
                    },
                    {
                        icon: getOverviewPageIllustrations().statsOverview.groups,
                        iconOptions: {
                            background: "accent2",
                            fill: "white"
                        },
                        label: t("console:manage.features.overview.widgets.overview.cards.groups.heading"),
                        value: groupCount
                    },
                    {
                        icon: getOverviewPageIllustrations().statsOverview.userstores,
                        iconOptions: {
                            background: "accent3",
                            fill: "white"
                        },
                        label: t("console:manage.features.overview.widgets.overview.cards.userstores.heading"),
                        value: userstoresCount
                    }
                ] }
            />
            <Divider hidden/>
            <Grid>
                <Responsive
                    as={ Grid.Row }
                    columns={ 3 }
                    minWidth={ Responsive.onlyComputer.minWidth }
                >
                    { resolveGridContent() }
                </Responsive>
                <Responsive
                    as={ Grid.Row }
                    columns={ 1 }
                    maxWidth={ Responsive.onlyComputer.minWidth }
                >
                    { resolveGridContent() }
                </Responsive>
            </Grid>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OverviewPage.defaultProps = {
    "data-testid": "overview-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OverviewPage;
