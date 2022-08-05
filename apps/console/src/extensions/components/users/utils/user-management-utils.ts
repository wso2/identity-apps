/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { FormValidation } from "@wso2is/validation";
import { SCIMConfigs } from "../../../configs/scim";

/**
 * Utility class for user management operations.
 */
export class UserManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Resolves the sub header of the user list item.
     *
     * @return {string} Sub header of the user list item.
     * @param user
     */
    public static resolveUserListSubheader(user): string {

        let subHeader;

        if (user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId ||
            user.userName?.split("/")[ 1 ]?.split("-")?.length > 3) {
            subHeader = (user.emails && user.emails[0] && FormValidation.email(user.emails[0]))
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
     * @return {string} Header of the user list item.
     * @param user
     */
    public static resolveUserListHeader(user): string {

        let header;

        if (user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId ||
            user.userName?.split("/")[ 1 ]?.split("-")?.length > 3) {

            header = (user.name && user.name.givenName !== undefined)
                ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                : this.resolveUserListSubheader(user);

        } else {
            header = (user.name && user.name.givenName !== undefined)
                ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                : this.resolveUserListSubheader(user);
        }

        return header;
    }
}
