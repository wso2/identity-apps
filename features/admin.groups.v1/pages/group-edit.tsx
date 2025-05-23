/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { TabPageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGroupById } from "../api/groups";
import { EditGroup } from "../components/edit-group/edit-group";
import { GroupsInterface } from "../models/groups";
import GroupManagementProvider from "../providers/group-management-provider";

const GroupEditPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();

    const { mutateUserStoreList } = useUserStores();

    const [ roleId, setGroupId ] = useState<string>(undefined);
    const [ group, setGroup ] = useState<GroupsInterface>();
    const [ isGroupDetailsRequestLoading, setIsGroupDetailsRequestLoading ] = useState<boolean>(true);

    /**
     * Get Group data from URL id
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];

        setGroupId(roleId);
        getGroupDetails(roleId);
    }, []);

    /**
     * As there is a delay in updating user stores,
     * user stores list needs be mutated in page load to avoid stale data.
     */
    useEffect(() => {
        mutateUserStoreList();
    }, []);

    const getGroupDetails = (roleId: string ): void => {
        setIsGroupDetailsRequestLoading(true);

        getGroupById(roleId)
            .then((response: AxiosResponse<GroupsInterface>) => {
                if (response.status === 200) {
                    setGroup(response.data);
                }
            }).catch(() => {
            // TODO: handle error
            })
            .finally(() => {
                setIsGroupDetailsRequestLoading(false);
            });
    };

    const onGroupUpdate = (): void => {
        getGroupDetails(roleId);
    };

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("GROUPS"));
    };

    const resolveGroupName = (): string => {
        if (group && group.displayName.indexOf("/") !== -1) {
            return group.displayName.split("/")[0] === userstoresConfig.primaryUserstoreName
                ? group.displayName.split("/")[1] : group.displayName;
        } else if (group) {
            return group.displayName;
        }
    };

    return (
        <GroupManagementProvider>
            <TabPageLayout
                isLoading={ isGroupDetailsRequestLoading }
                title={
                    group && group.displayName ?
                        resolveGroupName() :
                        t("pages:rolesEdit.title")
                }
                pageTitle={ t("pages:rolesEdit.title") }
                backButton={ {
                    onClick: handleBackButtonClick,
                    text: t("pages:rolesEdit.backButton", { type: "groups" })
                } }
                titleTextAlign="left"
                bottomMargin={ false }
            >
                <EditGroup
                    isLoading={ isGroupDetailsRequestLoading }
                    group={ group }
                    groupId={ roleId }
                    onGroupUpdate={ onGroupUpdate }
                />
            </TabPageLayout>
        </GroupManagementProvider>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GroupEditPage;
