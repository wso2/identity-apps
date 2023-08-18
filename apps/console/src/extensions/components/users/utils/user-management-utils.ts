/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormValidation } from "@wso2is/validation";
import { store } from "apps/console/src/features/core";
import { ProfileSchemaInterface } from "modules/core/src/models";
import {
    UserManagementConstants
} from "../../../../features/users/constants/user-management-constants";
import { UserBasicInterface } from "../../../../features/users/models";
import { UserManagementUtils as UserManagementUtilsExt } from "../../../../features/users/utils";
import { SCIMConfigs } from "../../../configs/scim";

/**
 * Utility class for user management operations.
 */
export class UserManagementUtils extends UserManagementUtilsExt {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super();
    }

    /**
     * Resolves the sub header of the user list item.
     *
     * @param user - User object.
     * @returns Sub header of the user list item.
     */
    public static resolveUserListSubheader(user: UserBasicInterface): string {

        let subHeader: any;

        if (user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId ||
            user.userName?.split("/")[ 1 ]?.split("-")?.length > 3) {
            subHeader = (user.emails && user.emails[0] && FormValidation.email(user.emails[0].toString()))
                ? user.emails[0]
                : user.id;
        } else {
            subHeader = user.userName.split("/")?.length > 1
                ? user.userName.split("/")[ 1 ]
                : user.userName.split("/")[ 0 ];
        }

        return subHeader;
    }

    /**
     * Resolves the header of the user list item.
     *
     * @param user - User object.
     * @returns Header of the user list item.
     */
    public static resolveUserListHeader(user: UserBasicInterface): string {

        if (UserManagementUtils.isDisplayNameEnabled(store.getState()
            .profile.profileSchemas, user.displayName)) {
            return user.displayName;
        } else {
            if (user.name && user.name.givenName) {
                return user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "");
            } else {
                return UserManagementUtils.resolveUserListSubheader(user);
            }
        }
    }

    /**
    * Checks if the display name attribute is enabled or not
    *
    * @returns boolean
    * @param profileSchema - The schema
    * @param displayName - displayName
    */
    public static isDisplayNameEnabled(profileSchema: ProfileSchemaInterface[], displayName?: string): boolean {
        if (!displayName) {
            return false;
        }

        return profileSchema
            .some((schemaItem: ProfileSchemaInterface) => 
                schemaItem.name === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY.get("DISPLAY_NAME"));
    }
}
