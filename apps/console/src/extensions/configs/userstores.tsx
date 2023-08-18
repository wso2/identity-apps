/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
