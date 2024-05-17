/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { GenericIcon, TabPageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getSidePanelIcons,
    history
} from "@wso2is/admin.core.v1";
import { getGroupById } from "@wso2is/admin.groups.v1/api";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models";
import GroupManagementProvider from "@wso2is/admin.groups.v1/providers/group-management-provider";
import { EditGroup } from "../edit-group";

const GroupEditPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ roleId, setGroupId ] = useState<string>(undefined);
    const [ group, setGroup ] = useState<GroupsInterface>();
    const [ isGroupDetailsRequestLoading, setIsGroupDetailsRequestLoading ] = useState<boolean>(true);

    const excludeMembers: string = "members";

    /**
     * Get Group data from URL id
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];

        setGroupId(roleId);
        getGroupDetails(roleId, excludeMembers);
    }, []);

    const getGroupDetails = (roleId: string, excludedAttributes?: string): void => {
        setIsGroupDetailsRequestLoading(true);

        getGroupById(roleId, excludedAttributes)
            .then((response: AxiosResponse) => {
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
        getGroupDetails(roleId, excludeMembers);
    };

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("GROUPS"));
    };

    return (
        <GroupManagementProvider>
            <TabPageLayout
                isLoading={ isGroupDetailsRequestLoading }
                title={ group?.displayName?.split("/")[1] ?? t("pages:rolesEdit.title") }
                backButton={ {
                    onClick: handleBackButtonClick,
                    text: t("pages:rolesEdit.backButton", { type: "Groups" })
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                description={ (
                    <div>
                        {
                            <Label className="group-source-label">
                                <GenericIcon
                                    className="mt-1 mb-0"
                                    square
                                    inline
                                    size="default"
                                    transparent
                                    icon={ getSidePanelIcons().userStore }
                                    verticalAlign="middle"
                                />
                                <Label.Detail className="mt-1 ml-0 mb-1">
                                    { group?.displayName?.split("/")[0] }
                                </Label.Detail>
                            </Label>
                        }
                    </div>
                ) }
            >
                <EditGroup
                    isGroupDetailsRequestLoading={ isGroupDetailsRequestLoading }
                    group={ group }
                    groupId={ roleId }
                    onGroupUpdate={ onGroupUpdate }
                    featureConfig={ featureConfig }
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
