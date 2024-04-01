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
import GroupsList from "./groups-list";
import { AppConstants, getEmptyPlaceholderIllustrations, history } from "../../../admin.core.v1";
import { AuthenticatorInterface } from "../../../admin-identity-providers-v1/models";

interface AuthenticatorGroupsListProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Groups list.
     */
    groupsList: AuthenticatorInterface[];
    roleId: string;
    appId: string;
}

/**
 * List component for Role Management list
 *
 * @returns application roles list component.
 */
export const AuthenticatorGroupsList = (props: AuthenticatorGroupsListProps): ReactElement => {

    const {
        appId,
        groupsList,
        roleId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ expandedAssignedApplications, setExpandedAssignedApplications ] = useState<string[]>([]);

    const navigateToConnections = () => history.push(AppConstants.getPaths().get("CONNECTIONS"));

    /**
     * Shows list placeholders.
     *
     * @returns placeholder component.
     */
    const showPlaceholders = (): ReactElement => {        
        if (groupsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-empty-list-empty-placeholder` }
                    action={ (
                        <LinkButton onClick={ navigateToConnections }>
                            { t("extensions:console.applicationRoles.authenticatorGroups.goToConnections") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("extensions:console.applicationRoles.authenticatorGroups.placeholder.title") }
                    subtitle={
                        [
                            t("extensions:console.applicationRoles.authenticatorGroups.placeholder.subTitle.0"),
                            t("extensions:console.applicationRoles.authenticatorGroups.placeholder.subTitle.1")
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
     * @param group - Authenticator group.
     */
    const handleAccordionTitleClick = (
        group: AuthenticatorInterface,
        expandedList: string[],
        stateActionExpanded: any
    ) => {
        let tempExpandedList: string[] = [ ...expandedList ];

        if (!expandedList?.includes(group.name)) {
            tempExpandedList.push(group.name);
        } else {
            tempExpandedList =  tempExpandedList
                .filter((roleDeselected: string) =>
                    roleDeselected !== group.name);
        }
        stateActionExpanded(tempExpandedList);
    };

    /**
     * Renders the authenticator groups list.
     * 
     * @param groupList - Role list.
     * 
     * @returns authenticator groups list component.
     */
    const resolveAuthenticatorGroupsList = (groupsList: AuthenticatorInterface[]): ReactElement => {
        return (
            <>
                {
                    showPlaceholders()
                }
                <SegmentedAccordion>
                    {
                        groupsList.map(
                            (group: AuthenticatorInterface) => {
                                return (
                                    <Fragment key={ group.id }>
                                        <SegmentedAccordion.Title
                                            id={ group.id }
                                            data-componentid={ `${ componentId }-${ group.name }-title` }
                                            attached={ true }
                                            active={ expandedAssignedApplications?.includes(group.name) }
                                            accordionIndex={ group.name }
                                            className="nested-list-accordion-title"
                                            onClick={ 
                                                () => 
                                                    handleAccordionTitleClick(
                                                        group,
                                                        expandedAssignedApplications,
                                                        setExpandedAssignedApplications
                                                    )
                                            }
                                            hideChevron={ false }
                                        >
                                            <AppAvatar
                                                image={ (
                                                    <AnimatedAvatar
                                                        name={ group.name }
                                                        size="mini"
                                                        data-componentid={ `${ componentId }-item-image-inner` }
                                                    />
                                                ) }
                                                size="mini"
                                                spaced="right"
                                                data-componentid={ `${ componentId }-item-image` }
                                            />
                                            { group.name }
                                        </SegmentedAccordion.Title>
                                        <SegmentedAccordion.Content
                                            secondary={ false }
                                            active={ expandedAssignedApplications?.includes(group.name) }
                                            data-componentid={ `${ componentId }-color-palette-accordion-content` }
                                        >
                                            <GroupsList
                                                authenticatorId={ group.id }
                                                roleId={ roleId }
                                                appId={ appId }
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
                        data-componentid={ `${ componentId }-authenticator-groups` }
                    >
                        { 
                            resolveAuthenticatorGroupsList(
                                groupsList
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
AuthenticatorGroupsList.defaultProps = {
    selection: true,
    showHeader: false,
    showListItemActions: true,
    showMetaContent: true,
    showRoleType: false
};
