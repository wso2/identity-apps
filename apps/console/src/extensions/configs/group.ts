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

import { I18n } from "@wso2is/i18n";
import { SharedUserStoreConstants } from "../../features/core";
import { GroupsInterface } from "../../features/groups";
import { CONSUMER_USERSTORE } from "../../features/userstores";

export const groupConfig = {
    addGroupWizard: {
        defaultUserstore: CONSUMER_USERSTORE,
        requiredSteps: ["BasicDetails"],
        //""
        subHeading: I18n.instance.t("extensions:manage.groups.addGroupWizard.subHeading")
         //t("console:manage.features.roles.addRoleWizard.subHeading", { type: "group" })
        ,
        submitStep: "BasicDetails"
    },
    editGroups: {
        basicTab: {
            showGroupNameLabel: false,
            userstore: (groupObject: GroupsInterface) => {
                return CONSUMER_USERSTORE;
                /* groupObject?.displayName?.split("/")?.length > 1
                                     ? groupObject.displayName.split("/")[0]
                                     : SharedUserStoreConstants.PRIMARY_USER_STORE; */
            }
        },
        basicTabName: I18n.instance.t("extensions:manage.groups.editGroups.basicTabName"),
        //I18n.instance.t("console:manage.features.roles.edit.menuItems.basic")
        showRolesTab: false
    },
    groupsList: {
        description: I18n.instance.t("extensions:manage.groups.groupsList.description"),
        filterGroups: (groupResources: GroupsInterface[]): GroupsInterface[] => {
            return groupResources.filter((role: GroupsInterface) => {
                return role.displayName.includes("CONSUMER/");
            });
        /*  groupResources.filter((role: GroupsInterface) => {
                    return !role.displayName.includes("Application/") && !role.displayName.includes("Internal/");
            }); */
        },
        //t("console:manage.pages.groups.subTitle") },
        showUserstoreDropdown: false
    }
};
