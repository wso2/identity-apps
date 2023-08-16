/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { I18n } from "@wso2is/i18n";
import { EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { ReactNode } from "react";
import { Icon } from "semantic-ui-react";
import { UserstoresConfig } from "./models";
import { getEmptyPlaceholderIllustrations } from "../../features/core";
import { RemoteUserStoreConstants } from "../components/user-stores/constants";

export const userstoresConfig: UserstoresConfig = {
    onUserstoreEdit: (userstoreId: string) => {
        return userstoreId === RemoteUserStoreConstants.CUSTOMER_USERSTORE_ID;
    },
    shouldShowUserstore: (typeName: string) => {
        const CONSUMER_USERSTORE_TYPE = "AsgardeoBusinessUserStoreManager";

        return typeName === CONSUMER_USERSTORE_TYPE;
    },
    userstoreDomain: {
        appendToUsername: false
    },
    userstoreEdit: {
        basicDetails: {
            showType: false
        },
        groupDetails: {
            showAdditionalProperties: false,
            showToggles: false
        },
        remoteUserStoreEditPath: "edit-remote-user-store",
        userDetails: {
            showAdditionalProperties: false,
            showDisplayName: false
        }
    },
    userstoreList: {
        allowAddingUserstores: false,
        renderEmptyPlaceholder: (emptyPlaceholderAction) => {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ emptyPlaceholderAction }>
                            <Icon name="add" />
                            { I18n.instance.t("extensions:manage.features.userStores.configs." +
                                "addUserStores.actionTitle") as ReactNode }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ I18n.instance.t("extensions:manage.features.userStores.configs." +
                        "addUserStores.title") }
                    subtitle={ [
                        I18n.instance.t("extensions:manage.features.userStores.configs." +
                            "addUserStores.subTitle") as ReactNode
                    ] }
                />
            );
        }
    }
};
