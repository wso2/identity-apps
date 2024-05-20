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

import { getApplicationList } from "@wso2is/admin.applications.v1/api";
import { ApplicationListInterface, ApplicationListItemInterface } from "@wso2is/admin.applications.v1/models";
import { AppConstants, UIConstants, getEmptyPlaceholderIllustrations, history } from "@wso2is/admin.core.v1";
import { getAllApplicationRolesList } from "@wso2is/admin.extensions.v1/components/groups/api";
import { ApplicationRoleInterface } from "@wso2is/admin.extensions.v1/components/groups/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmptyPlaceholder,
    ListLayout,
    PageLayout
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import find from "lodash-es/find";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Input } from "semantic-ui-react";
import { ApplicationRolesList } from "../components";

type ApplicationRolesPageInterface = IdentifiableComponentInterface;

/**
 * React component to list User Roles.
 *
 * @returns Application Roles page.
 */
const ApplicationRolesPage = (props: ApplicationRolesPageInterface): ReactElement => {
    const {
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const [ isListUpdated, setListUpdated ] = useState<boolean>(false);
    const [ isError, setError ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isApplicationRolesFetchRequestLoading, setIsApplicationRolesFetchRequestLoading ] =
        useState<boolean>(true);
    const [ initialApplicationRolesList, setInitialApplicationRolesList ] = useState<ApplicationRoleInterface[]>([]);
    const [ paginatedApplicationRoles, setPaginatedApplicationRoles ] = useState<ApplicationRoleInterface[]>([]);

    const listItemLimit: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

    useEffect(() => {
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getAllApplicationRoles();
    }, []);

    /**
     * Get all the application roles in the organization.
     */
    const getAllApplicationRoles = (): void => {
        setIsApplicationRolesFetchRequestLoading(true);
        getAllApplicationRolesList()
            .then((response: ApplicationRoleInterface[]) => {
                filterApplicationsList(response);
                setError(false);
            }).catch((error: AxiosError) => {
                setError(true);
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail ??
                            t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                                "error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message ??
                            t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                                "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                        "genericError.message")
                }));
                setIsApplicationRolesFetchRequestLoading(false);
            });
    };

    /**
     * Fetch the list of applications if there are roles.
     */
    const filterApplicationsList = (roles: ApplicationRoleInterface[]) => {
        if (isEmpty(roles)) {
            setIsApplicationRolesFetchRequestLoading(false);

            return;
        }

        getApplicationList(100, null, null)
            .then((response: ApplicationListInterface) => {
                mapApplicationListWithApplicationRoles(response.applications, roles);
                setError(false);
            })
            .catch((error: AxiosError) => {
                setError(true);
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplications." +
                            "error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("applications:notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchApplications." +
                        "genericError.message")
                }));
                setIsApplicationRolesFetchRequestLoading(false);
            });
    };

    /**
     * Map application list with application roles.
     */
    const mapApplicationListWithApplicationRoles = (applications: ApplicationListItemInterface[],
        roles: ApplicationRoleInterface[]) => {

        const filteredRoles: ApplicationRoleInterface[] = roles.filter((role: ApplicationRoleInterface) => {
            const application: ApplicationListItemInterface =
                find(applications, (application: ApplicationListItemInterface) => {
                    return application.id === role?.app;
                });

            if (application) {
                role.appName = application?.name;

                return role;
            }
        });

        setInitialApplicationRolesList(filteredRoles);
        setPaginatedApplicationRoles(filteredRoles);
        setIsApplicationRolesFetchRequestLoading(false);
    };

    const searchApplications = (query: string): void => {
        setSearchQuery(query);
        const filteredRoles: ApplicationRoleInterface[] = initialApplicationRolesList.filter(
            (role: ApplicationRoleInterface) => {

                return role.appName.toLowerCase().includes(query.toLowerCase());
            });

        setPaginatedApplicationRoles(filteredRoles);
    };

    const advancedSearchFilter = (): ReactElement => (
        <Input
            className="m-3"
            data-componentid={ `${ componentId }-search-input` }
            icon={ <Icon name="search" /> }
            iconPosition="left"
            onChange={ (e: ChangeEvent<HTMLInputElement>) => searchApplications(e.target.value) }
            value={ searchQuery }
            placeholder={ t("extensions:console.applicationRoles.searchApplication") }
            floated="left"
            style={ { width: 300 } }
            transparent
        />
    );

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setPaginatedApplicationRoles(initialApplicationRolesList);
    };

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("ROLES"));
    };

    return (
        <PageLayout
            title={ t("extensions:console.applicationRoles.heading") }
            description={ t("extensions:console.applicationRoles.subHeading") }
            pageTitle={ t("extensions:console.applicationRoles.heading") }
            backButton={ isSubOrg
                ? {
                    onClick: handleBackButtonClick,
                    text: t("extensions:console.applicationRoles.roles.goBackToRoles")
                }: null
            }
        >
            {
                isError
                    ? (
                        <EmptyPlaceholder
                            subtitle={ [ t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                                "genericError.description") ] }
                            title={ t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                                "genericError.message") }
                            image={ getEmptyPlaceholderIllustrations().genericError }
                            imageSize="tiny"
                        />
                    )
                    : (
                        <ListLayout
                            advancedSearch={ advancedSearchFilter() }
                            onPageChange={ null }
                            showPagination={ false }
                            showTopActionPanel={
                                !isApplicationRolesFetchRequestLoading &&
                                !(!searchQuery && paginatedApplicationRoles?.length <= 0)
                            }
                            totalPages={ Math.ceil(initialApplicationRolesList?.length / listItemLimit) }
                            totalListSize={ initialApplicationRolesList?.length }
                            isLoading={ isApplicationRolesFetchRequestLoading }
                        >
                            <ApplicationRolesList
                                data-componentid={ `${ componentId }-application-list` }
                                isLoading={ isApplicationRolesFetchRequestLoading }
                                onSearchQueryClear={ handleSearchQueryClear }
                                roleList={ paginatedApplicationRoles }
                                searchQuery={ searchQuery }
                            />
                        </ListLayout>
                    )
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApplicationRolesPage.defaultProps = {
    "data-componentid": "application-roles-page"
};

export default ApplicationRolesPage;
