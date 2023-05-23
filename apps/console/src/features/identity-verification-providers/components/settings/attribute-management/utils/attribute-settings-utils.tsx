/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { ContentLoader, EmphasizedSegment, EmptyPlaceholder } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { getEmptyPlaceholderIllustrations, store } from "../../../../../core";


export const handleGetAllLocalClaimsError = (error: IdentityAppsApiException): void => {
    if (error?.response?.data?.description) {
        store.dispatch(addAlert({
            description: I18n.instance.t("console:develop.features.idvp.notifications.getAllLocalClaims." +
                "error.description", { description: error.response.data.description }
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("console:develop.features.idvp.notifications.getAllLocalClaims.error.message")
        }));
    }

    store.dispatch(addAlert({
        description: I18n.instance.t("console:develop.features.idvp.notifications.getAllLocalClaims." +
            "genericError.description"
        ),
        level: AlertLevels.ERROR,
        message: I18n.instance.t("console:develop.features.idvp.notifications.getAllLocalClaims.genericError.message")
    }));
};

export const getContentLoader = (): ReactElement => {
    return (
        <EmphasizedSegment padded>
            <ContentLoader inline="centered" active/>
        </EmphasizedSegment>
    );
};

export const getEmptyAttributeMappingPlaceholder = (): ReactElement => {
    return (
        <EmptyPlaceholder
            title={ "You haven't selected any attributes" }
            subtitle={
                [
                    <p key={ "empty-attributes-mapping" }>
                        Map attributes and click <strong>Add Attribute Mapping</strong> to get started.
                    </p>
                ]
            }
            image={ getEmptyPlaceholderIllustrations().emptyList }
            imageSize="tiny"
        />
    );
};
