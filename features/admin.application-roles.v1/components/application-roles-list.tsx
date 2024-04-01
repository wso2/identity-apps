/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    IdentifiableComponentInterface,
    LoadableComponentInterface
} from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    EmptyPlaceholder,
    LinkButton,
    SegmentedAccordion
} from "@wso2is/react-components";
import React, { Fragment, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Grid } from "semantic-ui-react";
import RolesList from "./roles-list";
import { ApplicationRoleInterface } from "../../admin-extensions-v1/components/groups/models";
import { AppConstants, getEmptyPlaceholderIllustrations, history } from "../../admin.core.v1";

interface ApplicationRolesListProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Roles list.
     */
    roleList: ApplicationRoleInterface[];
    /**
     * On list item select callback.
     */
    onSearchQueryClear?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
}

/**
 * List component for Role Management list
 *
 * @returns application roles list component.
 */
export const ApplicationRolesList = (props: ApplicationRolesListProps): ReactElement => {

    const {
        onSearchQueryClear,
        roleList,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ expandedAssignedApplications, setExpandedAssignedApplications ] = useState<string[]>([]);

    const navigateToApplications = () => history.push(AppConstants.getPaths().get("APPLICATIONS"));

    /**
     * Shows list placeholders.
     *
     * @returns placeholder component.
     */
    const showPlaceholders = (): ReactElement => {        
        // When the search returns empty.
        if (searchQuery && roleList?.length === 0) {
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
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (roleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-empty-list-empty-placeholder` }
                    action={ (
                        <LinkButton onClick={ navigateToApplications }>
                            { t("extensions:manage.groups.edit.roles.placeHolders." +
                                "emptyRoles.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("extensions:console.applicationRoles.roleList.placeholder.title") }
                    subtitle={
                        [
                            t("extensions:console.applicationRoles.roleList.placeholder.subTitle.0"),
                            t("extensions:console.applicationRoles.roleList.placeholder.subTitle.1")
                        ]
                    }
                />
            );
        }

        return null;
    };

    /**
     * Handle expand accordion title.
     * 
     * @param appRole - Application role.
     */
    const handleAccordionTitleClick = (
        appRole: ApplicationRoleInterface,
        expandedList: string[],
        stateActionExpanded: any
    ) => {
        let tempExpandedList: string[] = [ ...expandedList ];

        if (!expandedList?.includes(appRole.app)) {
            tempExpandedList.push(appRole.app);
        } else {
            tempExpandedList =  tempExpandedList
                .filter((roleDeselected: string) =>
                    roleDeselected !== appRole.app);
        }
        stateActionExpanded(tempExpandedList);
    };

    /**
     * Renders the application roles list.
     * 
     * @param roles - Role list.
     * 
     * @returns Role list component.
     */
    const resolveApplicationRolesList = (filteredApplicationRoles: ApplicationRoleInterface[]): ReactElement => {
        return (
            <>
                {
                    showPlaceholders()
                }
                <SegmentedAccordion>
                    {
                        filteredApplicationRoles.map(
                            (application: ApplicationRoleInterface) => {
                                return (
                                    <Fragment key={ application.app }>
                                        <SegmentedAccordion.Title
                                            id={ application.app }
                                            data-componentid={ `${ componentId }-${application.app}-title` }
                                            attached={ true }
                                            active={ expandedAssignedApplications?.includes(application.app) }
                                            accordionIndex={ application.app }
                                            className="nested-list-accordion-title mb-2 mt-1"
                                            onClick={ 
                                                () => 
                                                    handleAccordionTitleClick(
                                                        application,
                                                        expandedAssignedApplications,
                                                        setExpandedAssignedApplications
                                                    )
                                            }
                                            hideChevron={ false }
                                        >
                                            <AppAvatar
                                                image={ (
                                                    <AnimatedAvatar
                                                        name={ application?.appName }
                                                        size="mini"
                                                        data-componentid={ `${ componentId }-item-image-inner` }
                                                    />
                                                ) }
                                                size="mini"
                                                spaced="right"
                                                data-componentid={ `${ componentId }-item-image` }
                                            />
                                            { application.appName }
                                        </SegmentedAccordion.Title>
                                        <SegmentedAccordion.Content
                                            secondary={ false }
                                            active={ expandedAssignedApplications?.includes(application.app) }
                                            data-componentid={ `${ componentId }-color-palette-accordion-content` }
                                        >
                                            <RolesList
                                                appId={ application.app }
                                                rolesList={ application.roles }
                                            />
                                        </SegmentedAccordion.Content>
                                    </Fragment>
                                );
                            })
                    }
                </SegmentedAccordion>
            </>
        );
    };

    return (
        <>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                    <Accordion
                        data-componentid={ `${ componentId }-application-roles` }
                    >
                        { 
                            resolveApplicationRolesList(
                                roleList
                            )
                        }
                    </Accordion>
                </Grid.Column>
            </Grid.Row>
        </>
    );
};

/**
 * Default props for the component.
 */
ApplicationRolesList.defaultProps = {
    selection: true,
    showHeader: false,
    showListItemActions: true,
    showMetaContent: true,
    showRoleType: false
};
