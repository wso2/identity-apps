/**  
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { store } from "../store/index";

export const handleGetRoleListError = (error) => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getRolesList.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getRolesList.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getRolesList.genericError." +
                    "description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getRolesList.genericError.message"
            )
        })
    );
};
