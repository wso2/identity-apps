/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// TODO: Move to shared components.
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { BasicGroupDetails } from "./edit-group-basic";
import { GroupRolesList } from "./edit-group-roles";
import { GroupUsersList } from "./edit-group-users";
import { AppState, FeatureConfigInterface } from "../../../../admin-core-v1";
import { GroupsInterface } from "../../../../admin-groups-v1";
import { GroupConstants } from "../../../../admin-groups-v1/constants";
import useGroupManagement from "../../../../admin-groups-v1/hooks/use-group-management";
import { CONSUMER_USERSTORE } from "../../../../admin-users-v1tores/constants";
import { ExtendedFeatureConfigInterface } from "../../../configs/models";
import { UserStoreUtils } from "../../../utils/user-store-utils";
import { getAllApplicationRolesList } from "../api";
import { ApplicationRoleInterface } from "../models";

/**
 * Captures props needed for edit group component
 */
interface EditGroupProps extends SBACInterface<FeatureConfigInterface> {
    /**
     * Group ID
     */
    groupId: string;
    /**
     * Group details
     */
    group: GroupsInterface;
    /**
     * Handle group update callback.
     */
    onGroupUpdate: () => void;
    /**
     * Flag for request loading status.
     */
    isGroupDetailsRequestLoading?: boolean;
}

/**
 * Component which will allow editing of a selected group.
 *
 * @param props - contains group details to be edited.
 */
export const EditGroup: FunctionComponent<EditGroupProps> = (props: EditGroupProps): ReactElement => {

    const {
        groupId,
        group,
        onGroupUpdate,
        featureConfig,
        isGroupDetailsRequestLoading
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const extendedFeatureConfig: ExtendedFeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features);

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ isUserstoreRemote, setUserstoreRemote ] = useState<boolean>(false);
    const [ isReadOnlyLoading, setReadOnlyLoading ] = useState<boolean>(true);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ isRolesTabEnabled, setRolesTabEnabled ] = useState<boolean>(false);
    const [ isResourcePanesLoading, setIsResourcePanesLoading ] = useState<boolean>(true);

    const { activeTab, updateActiveTab } = useGroupManagement();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {

        checkRolesTabEnabled();
        UserStoreUtils.getReadOnlyUserStores()
            .then((response: string[]) => {
                setReadOnlyUserStoresList(response);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.fetchGroups.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
                }));
            })
            .finally(() => {
                setReadOnlyLoading(false);
            });
    }, [ ]);

    useEffect(() => {
        if(!group) {
            return;
        }

        const userStore: string[] = group?.displayName.split("/");

        if (!isFeatureEnabled(featureConfig?.groups, GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
            || readOnlyUserStoresList?.includes(userStore[0]?.toString())
            || !hasRequiredScopes(featureConfig?.groups, featureConfig?.groups?.scopes?.update, allowedScopes)
        ) {
            setReadOnly(true);
        }

        if(userStore[0]?.toString() !== CONSUMER_USERSTORE) {
            setUserstoreRemote(true);
        }
    }, [ group, readOnlyUserStoresList ]);

    /**
     * Check if the application roles tab should be enabled.
     */
    const checkRolesTabEnabled = () => {

        const userHasRequiredScopes: boolean = hasRequiredScopes(
            extendedFeatureConfig?.apiResources,
            [ ...extendedFeatureConfig?.apiResources?.scopes?.create,
                ...extendedFeatureConfig?.apiResources?.scopes?.delete,
                ...extendedFeatureConfig?.apiResources?.scopes?.read,
                ...extendedFeatureConfig?.apiResources?.scopes?.update ],
            allowedScopes
        );

        if (!userHasRequiredScopes) {
            setRolesTabEnabled(false);
            setIsResourcePanesLoading(false);
        } else {
            if (extendedFeatureConfig?.apiResources?.enabled) {
                setRolesTabEnabled(true);
                setIsResourcePanesLoading(false);
            } else if (extendedFeatureConfig?.applicationRoles?.enabled) {
                getAllApplicationRolesList()
                    .then((response: ApplicationRoleInterface[]) => {
                        (response.length > 0)
                            ? setRolesTabEnabled(true)
                            : setRolesTabEnabled(false);
                    })
                    .catch(() => {
                        setRolesTabEnabled(false);
                    })
                    .finally(() => {
                        setIsResourcePanesLoading(false);
                    });
            } else {
                setRolesTabEnabled(false);
                setIsResourcePanesLoading(false);
            }
        }

    };

    const resolveResourcePanes = () => {
        const panes: {
            menuItem?: string;
            render?: () => React.ReactNode;
        }[] = [
            {
                menuItem: "General",
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicGroupDetails
                            data-testid="group-mgt-edit-group-basic"
                            groupId={ groupId }
                            isGroup={ true }
                            groupObject={ group }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly }
                            isUserstoreRemote = { isUserstoreRemote }
                            isReadOnlyLoading={ isReadOnlyLoading }
                        />
                    </ResourceTab.Pane>
                )
            },{
                menuItem: t("roles:edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <GroupUsersList
                            isGroupDetailsRequestLoading={ isGroupDetailsRequestLoading }
                            data-testid="group-mgt-edit-group-users"
                            isGroup={ true }
                            group={ group }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly }
                        />
                    </ResourceTab.Pane>
                )
            }
        ];

        if (isRolesTabEnabled) {
            panes.push(
                {
                    menuItem: isSubOrg
                        ? t("extensions:console.applicationRoles.heading")
                        : t("extensions:manage.groups.edit.roles.title"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <GroupRolesList
                                isGroupDetailsRequestLoading={ isGroupDetailsRequestLoading }
                                data-componentid="group-mgt-edit-group-roles"
                                isGroup={ true }
                                group={ group }
                                onGroupUpdate={ onGroupUpdate }
                                isReadOnly={ isReadOnly }
                            />
                        </ResourceTab.Pane>
                    )
                }
            );
        }

        return panes;
    };

    return (
        <ResourceTab
            activeIndex={ activeTab }
            isLoading={ isResourcePanesLoading }
            onTabChange={ (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => {
                updateActiveTab(data.activeIndex as number);
            } }
            panes={ resolveResourcePanes() }
        />
    );
};
