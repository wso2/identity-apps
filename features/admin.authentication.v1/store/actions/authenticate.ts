/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, DecodedIDTokenPayload } from "@asgardeo/auth-react";
import { Config } from "@wso2is/admin.core.v1/configs";
import { store } from "@wso2is/admin.core.v1/store";
import { getProfileInfo, getProfileSchemas } from "@wso2is/admin.users.v1/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import {
    addAlert,
    setProfileInfo,
    setProfileInfoRequestLoadingStatus,
    setProfileSchemaRequestLoadingStatus,
    setSCIMSchemas
} from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import isEmpty from "lodash-es/isEmpty";
import { Dispatch } from "redux";

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = (
    meEndpoint: string = Config.getServiceResourceEndpoints().me,
    clientOrigin: string = window["AppUtils"].getConfig().clientOriginWithTenant,
    fetchProfileSchema: boolean = false
) => (dispatch: Dispatch): void => {

    dispatch(setProfileInfoRequestLoadingStatus(true));

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const getProfileInfoFromToken: boolean = store.getState().auth.isPrivilegedUser ||
                                    (window[ "AppUtils" ].getConfig().getProfileInfoFromIDToken ?? false);

    const getProfileSchema = (): void => {
        if (!fetchProfileSchema && !isEmpty(store.getState().profile.profileSchemas)) {
            return;
        }

        dispatch(setProfileSchemaRequestLoadingStatus(true));
        getProfileSchemas()
            .then((response: ProfileSchemaInterface[]) => {
                dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t("console:manage.notifications.getProfileSchema." +
                                "error.message")
                        })
                    );
                }

                dispatch(
                    addAlert<AlertInterface>({
                        description: I18n.instance.t(
                            "console:manage.notifications.getProfileSchema.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t(
                            "console:manage.notifications.getProfileSchema.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                dispatch(setProfileSchemaRequestLoadingStatus(false));
            });
    };

    if (getProfileInfoFromToken || isSubOrg && meEndpoint.includes("scim2/Me")) {
        AsgardeoSPAClient.getInstance().getDecodedIDToken().then((decodedToken: DecodedIDTokenPayload) => {
            const profileInfo: ProfileInfoInterface = {
                emails: [ decodedToken.email ] ?? [],
                id: decodedToken.sub,
                name: {
                    familyName: decodedToken.family_name ?? "",
                    givenName: decodedToken.given_name ?? ""
                },
                profileUrl: decodedToken.profile,
                userId: decodedToken.userid ?? "",
                userName: decodedToken.username
            };

            dispatch(setProfileInfo(profileInfo));
            dispatch(setProfileInfoRequestLoadingStatus(false));
            getProfileSchema();
        });
    } else {
        // Get the profile info.
        // TODO: Add the function to handle SCIM disabled error.
        getProfileInfo(meEndpoint, clientOrigin, null)
            .then((infoResponse: ProfileInfoInterface) => {
                if (infoResponse.responseStatus !== 200) {
                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "console:manage.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t("console:manage.notifications.getProfileInfo.genericError.message")
                        })
                    );

                    return;
                }
                dispatch(setProfileInfo<ProfileInfoInterface>(infoResponse));
                getProfileSchema();

                return;
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "console:manage.notifications.getProfileInfo.error.description", {
                                    description: error.response.data.detail
                                } ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t("console:manage.notifications.getProfileInfo.error.message")
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: I18n.instance.t("console:manage.notifications.getProfileInfo.genericError." +
                            "description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.notifications.getProfileInfo.genericError.message")
                    })
                );
            })
            .finally(() => {
                dispatch(setProfileInfoRequestLoadingStatus(false));
            });
    }
};
