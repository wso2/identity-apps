/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertInterface, ProfileInfoInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ConsumerUserGroupsList } from "./consumer-user-groupslist";
import { ConsumerUserProfile } from "./consumer-user-profile";
import { FeatureConfigInterface } from "../../../../../features/core";
import { GroupsInterface, useGroupList } from "../../../../../features/groups";
import { ConnectorPropertyInterface } from "../../../../../features/server-configurations";
import { UserSessions } from "../../../../../features/users/components/user-sessions";
import { SCIMConfigs } from "../../../../configs/scim";
import { CONSUMER_USERSTORE } from "../../../users/constants";

interface EditConsumerUserPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Flag for request loading status.
     */
    isUserProfileLoading?: boolean;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
    /**
      * Show if the user is from a readonly and WSOutboundUserStoreManager type user store.
      */
     isReadOnlyUserStore?: boolean;
}

/**
 * Consumer user edit component.
 *
 * @returns Edit consumer user component.
 */
export const EditConsumerUser: FunctionComponent<EditConsumerUserPropsInterface> = (
    props: EditConsumerUserPropsInterface
): JSX.Element => {

    const {
        user,
        handleUserUpdate,
        isUserProfileLoading,
        isReadOnly,
        isReadOnlyUserStore,
        connectorProperties
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const excludeMembers: string = "members";

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>(undefined);

    const {
        data: groupData,
        error: groupDataError
    } = useGroupList(
        user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource
            ? user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource
            : CONSUMER_USERSTORE, 
        excludeMembers
    );

    useEffect(() => {
        if (groupData?.totalResults > 0) {
            setGroupsList(groupData?.Resources);
        } 
    }, [ groupData ]);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    const resolvePanes = () => {
        if ((groupList?.length > 0 && (!user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId)) && !groupDataError) {
            return ([
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.0"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ConsumerUserProfile
                                isUserProfileLoading={ isUserProfileLoading }
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ isReadOnly }
                                isReadOnlyUserStore={ isReadOnlyUserStore }
                                connectorProperties={ connectorProperties }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.1"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ConsumerUserGroupsList
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ isReadOnly }
                                primaryGroups={ groupList }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.3"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <UserSessions user={ user } />
                        </ResourceTab.Pane>
                    )
                }
            ]);
        } else {
            return ([
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.0"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ConsumerUserProfile
                                isUserProfileLoading={ isUserProfileLoading }
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ isReadOnly }
                                isReadOnlyUserStore={ isReadOnlyUserStore }
                                connectorProperties={ connectorProperties }
                            />
                        </ResourceTab.Pane>
                    )
                },
                !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId &&
                    !window[ "AppUtils" ].getConfig().organizationName
                    ? {
                        menuItem: t("console:manage.features.users.editUser.tab.menuItems.3"),
                        render: () => (
                            <ResourceTab.Pane controlledSegmentation attached={ false }>
                                <UserSessions user={ user } />
                            </ResourceTab.Pane>
                        )
                    }
                    : null
            ]);
        }
    };

    return (
        <ResourceTab
            panes={ resolvePanes() }
        />
    );
};
