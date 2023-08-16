/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {  ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { ReactElement, SyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import { TabProps } from "semantic-ui-react";
import ApplicationRoleGroups from "./application-role-groups";
import ApplicationRoleInvitedUserGroups from "./application-role-invited-user-groups";
import ApplicationRoleAuthenticatorGroups from "./authenticator-groups/application-role-authenticator-groups";
import { ExtendedFeatureConfigInterface } from "../../../extensions";
import { URLFragmentTypes } from "../../applications/models";
import { AppState, history } from "../../core";

interface EditApplicationRolesProps extends IdentifiableComponentInterface {
    appId: string;
    roleId: string;
}

const EditApplicationRoles = (props: EditApplicationRolesProps): ReactElement => {
    const {
        appId,
        roleId,
        [ "data-componentid" ]: componentId
    } = props;

    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(undefined);
    const defaultActiveIndex: number = 0;
    
    const extendedFeatureConfig: ExtendedFeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features);
    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    /**
     * Handles the tab change.
     *
     * @param e - Click event.
     * @param data - Tab properties.
     */
    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        handleActiveTabIndexChange(data.activeIndex as number);
    };

    /**
     * Handles the activeTabIndex change.
     *
     * @param tabIndex - Active tab index.
     */
    const handleActiveTabIndexChange = (tabIndex:number): void => {
        history.push({
            hash: `#${ URLFragmentTypes.TAB_INDEX }${ tabIndex }`,
            pathname: window.location.pathname
        });
        setActiveTabIndex(tabIndex);
    };

    /**
     * Resolves the tab panes based on the application role.
     *
     * @returns Resolved tab panes.
     */
    const resolveTabPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [
            {
                componentId: "groups",
                menuItem: "Groups",
                render: ApplicationRoleGroupsPane
            }
        ];

        if (extendedFeatureConfig?.identityProviderGroups?.enabled) {
            panes.push(
                {
                    componentId: "authenticator-groups",
                    menuItem: "External Groups",
                    render: ApplicationRoleAuthenticatorGroupsPane
                }
            );
        }

        if (isSubOrg) {
            panes.push(
                {
                    componentId: "invited-user-groups",
                    menuItem: "Invited User Groups",
                    render: ApplicationRoleInvitedUserGroupsPane
                }
            );
        }
    
        return panes;
    };

    const ApplicationRoleGroupsPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ApplicationRoleGroups
                appId={ appId }
                roleId={ roleId }
                data-componentid={ `${ componentId }-application-role-groups` }
            />
        </ResourceTab.Pane>
    );

    const ApplicationRoleInvitedUserGroupsPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ApplicationRoleInvitedUserGroups
                appId={ appId }
                roleId={ roleId }
                data-componentid={ `${ componentId }-application-role-invited-user-groups` }
            />
        </ResourceTab.Pane>
    );

    const ApplicationRoleAuthenticatorGroupsPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ApplicationRoleAuthenticatorGroups
                appId={ appId }
                roleId={ roleId }
                data-componentid={ `${ componentId }-application-role-authenticator-groups` }
            />
        </ResourceTab.Pane>
    );

    return (
        <>
            <ResourceTab
                activeIndex={ activeTabIndex }
                data-testid={ `${ componentId }-resource-tabs` }
                defaultActiveIndex={ defaultActiveIndex }
                onTabChange={ handleTabChange }
                panes={ resolveTabPanes() }
            />
        </>
    );
};

export default EditApplicationRoles;
