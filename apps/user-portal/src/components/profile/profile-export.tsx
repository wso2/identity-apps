/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { Notification } from "../../models";
import { SettingsSection } from "../shared";

/**
 * Prop types for the profile export component.
 */
interface ProfileExportProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Profile export component.
 *
 * @param {ProfileExportProps} props - Props injected to the profile export component.
 * @return {JSX.Element}
 */
export const ProfileExport: FunctionComponent<ProfileExportProps> = (
    props: ProfileExportProps
): JSX.Element => {
    const { onNotificationFired } = props;
    const { t } = useTranslation();

    /**
     * The following method exports user's profile data into a json file.
     */
    const downloadUserProfile = (): void => {
        getUserInfo()
            .then((response) => {
                if (response.data) {
                    const blob = new Blob(
                        [JSON.stringify(response.data, null, 2)],
                        { type: "application/json" }
                    );
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = "user-profile.json";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    // Sets a success notification.
                    onNotificationFired({
                        description: t(
                            "views:components.profileExport.notifications.downloadProfileInfo.success.description"
                        ),
                        message: t(
                            "views:components.profileExport.notifications.downloadProfileInfo.success.message"
                        ),
                        otherProps: {
                            positive: true
                        },
                        visible: true
                    });
                } else {
                    onNotificationFired({
                        description: t(
                            "views:components.profileExport.notifications.downloadProfileInfo.genericError.description"
                        ),
                        message: t(
                            "views:components.profileExport.notifications.downloadProfileInfo.genericError.message"
                        ),
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    });
                }
            })
            .catch((error) => {
                onNotificationFired({
                    description: error && error.data && error.data.details
                        ? t(
                            "views:components.profileExport.notifications.downloadProfileInfo.error.description",
                            {
                                description: error.data.details
                            }
                        )
                        : t(
                            "views:components.profileExport.notifications.downloadProfileInfo.genericError.description"
                        ),
                    message: error && error.data && error.data.details
                        ? t(
                            "views:components.profileExport.notifications.downloadProfileInfo.error.message"
                        )
                        : t(
                            "views:components.profileExport.notifications.downloadProfileInfo.genericError.message"
                        ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                });
            });
    };

    return (
        <SettingsSection
            contentPadding={ false }
            description={ t("views:sections.profileExport.description") }
            header={ t("views:sections.profileExport.heading") }
            icon={ SettingsSectionIcons.profileExport }
            iconMini={ SettingsSectionIcons.profileExportMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ downloadUserProfile }
            primaryAction={ t("views:sections.profileExport.actionTitles.export") }
            primaryActionIcon="cloud download"
        />
    );
};
