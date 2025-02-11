/**
 * Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { SettingsSection } from "@wso2is/selfcare.core.v1/components";
import { getSettingsSectionIcons } from "@wso2is/selfcare.core.v1/configs";
import { AlertInterface, AlertLevels } from "@wso2is/selfcare.core.v1/models";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "../../api";

/**
 * Prop types for the profile export component.
 * Also see {@link ProfileExport.defaultProps}
 */
interface ProfileExportProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Profile export component.
 *
 * @param props - Props injected to the component.
 * @returns Profile Export component.
 */
export const ProfileExport: FunctionComponent<ProfileExportProps> = (
    props: ProfileExportProps
): JSX.Element => {

    const { onAlertFired, ["data-testid"]: testId } = props;
    const { t } = useTranslation();

    /**
     * The following method exports user's profile data into a json file.
     */
    const downloadUserProfile = (): void => {
        getUserInfo()
            .then((response: AxiosResponse) => {
                if (response.data) {
                    const blob: Blob = new Blob(
                        [ JSON.stringify(response.data, null, 2) ],
                        { type: "application/json" }
                    );
                    const url: string = window.URL.createObjectURL(blob);
                    const a: HTMLAnchorElement = document.createElement("a");

                    a.style.display = "none";
                    a.href = url;
                    a.download = "user-profile.json";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    // Sets a success notification.
                    onAlertFired({
                        description: t(
                            "myAccount:components.profileExport.notifications.downloadProfileInfo.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "myAccount:components.profileExport.notifications.downloadProfileInfo.success.message"
                        )
                    });
                } else {
                    onAlertFired({
                        description: t(
                            "myAccount:components.profileExport.notifications.downloadProfileInfo." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.profileExport.notifications.downloadProfileInfo.genericError.message"
                        )
                    });
                }
            })
            .catch((error: AxiosError & { response: { detail: string } }) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.profileExport.notifications.downloadProfileInfo.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.profileExport.notifications.downloadProfileInfo.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.profileExport.notifications.downloadProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.profileExport.notifications.downloadProfileInfo.genericError.message"
                    )
                });
            });
    };

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            contentPadding={ false }
            description={ t("myAccount:sections.profileExport.description") }
            header={ t("myAccount:sections.profileExport.heading") }
            icon={ getSettingsSectionIcons().profileExport }
            iconMini={ getSettingsSectionIcons().profileExportMini }
            iconSize="x60"
            iconStyle="twoTone"
            iconFloated="right"
            onPrimaryActionClick={ downloadUserProfile }
            primaryAction={ t("myAccount:sections.profileExport.actionTitles.export") }
            primaryActionIcon="cloud download"
        />
    );
};

/**
 * Default properties for the {@link ProfileExport} component.
 * See type definitions in {@link ProfileExportProps}
 */
ProfileExport.defaultProps = {
    "data-testid": "profile"
};
