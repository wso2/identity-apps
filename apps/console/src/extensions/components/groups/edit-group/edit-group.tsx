/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// TODO: Move to shared components.
import { useDispatch, useSelector } from "react-redux";
import { BasicGroupDetails } from "./edit-group-basic";
import { GroupUsersList } from "./edit-group-users";
import { AppState, FeatureConfigInterface, SharedUserStoreUtils } from "../../../../features/core";
import { GroupsInterface } from "../../../../features/groups";
import { GroupConstants } from "../../../../features/groups/constants";

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
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Flag for request loading status.
     */
    isGroupDetailsRequestLoading?: boolean;
}

/**
 * Component which will allow editing of a selected group.
 *
 * @param props contains group details to be edited.
 */
export const EditGroup: FunctionComponent<EditGroupProps> = (props: EditGroupProps): ReactElement => {

    const {
        groupId,
        group,
        onGroupUpdate,
        featureConfig,
        readOnlyUserStores,
        isGroupDetailsRequestLoading
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ isReadOnlyLoading, setReadOnlyLoading ] = useState<boolean>(true);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);

    const dispatch = useDispatch();

    useEffect(() => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response: string[]) => {
            setReadOnlyUserStoresList(response);
        }).catch((error) => {
            dispatch(addAlert({
                description: t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
            }));
        }).finally(() => {
            setReadOnlyLoading(false);
        });
    }, [ ]);

    useEffect(() => {
        if(!group) {
            return;
        }

        const userStore = group?.displayName.split("/");

        if (!isFeatureEnabled(featureConfig?.groups, GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
            || readOnlyUserStoresList?.includes(userStore[0]?.toString())
            || !hasRequiredScopes(featureConfig?.groups, featureConfig?.groups?.scopes?.update, allowedScopes)
        ) {
            setReadOnly(true);
        }
    }, [ group, readOnlyUserStoresList ]);

    const resolveResourcePanes = () => {
        const panes = [
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
                            isReadOnlyLoading={ isReadOnlyLoading }
                        />
                    </ResourceTab.Pane>
                )
            },{
                menuItem: t("console:manage.features.roles.edit.menuItems.users"),
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

        return panes;
    };

    return (
        <ResourceTab panes={ resolveResourcePanes() } />
    );
};
