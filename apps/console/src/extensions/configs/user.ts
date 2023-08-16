/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ProfileInfoInterface } from "@wso2is/core/models";
import { User } from "./models";
import { deleteUser } from "../../features/users/api/users";
import { deleteGuestUser } from "../components/users/api";
import { CONSUMER_USERSTORE } from "../components/users/constants";

export const userConfig : User = {
    deleteUser: (user: ProfileInfoInterface): Promise<any> => {
        if (user.userName?.split("/")[0] === CONSUMER_USERSTORE) {
            return deleteUser(user.id);
        } else {
            return deleteGuestUser(user.id);
        }
    }
};
