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

import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Divider, Transition } from "semantic-ui-react";
import { getUserInfo } from "../actions";
import { NotificationComponent } from "./notification";
import { SettingsSection } from "./settings-section";

class ProfileExportComponent extends React.Component<WithTranslation, any> {
    constructor(props) {
        super(props);
        this.state = {
            notification: {
                description: "",
                message: "",
                other: {
                    error: false,
                    success: false
                }
            },
            updateStatus: false
        };
    }

    /**
     * The following method handles the onClick event of the dismiss button
     */
    public handleDismiss = () => {
        this.setState({
            updateStatus: false
        });
    }

    /**
     * The following method export user's profile data into a json file
     */
    public downloadUserProfile = () => {
        const {t} = this.props;
        const {notification} = this.state;
        getUserInfo()
            .then((response) => {
                if (response.status === 200) {
                    const blob = new Blob([JSON.stringify(response.data, null, 2)], {type : "application/json"});
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = "user-profile.json";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:userProfile.notification.downloadProfileInfo.success.description"
                            ),
                            message: t(
                                "views:userProfile.notification.downloadProfileInfo.success.message"
                            ),
                            other: {
                                success: true
                            }
                        },
                        updateStatus: true
                    });
                } else {
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:userProfile.notification.downloadProfileInfo.error.description"
                            ),
                            message: t(
                                "views:userProfile.notification.downloadProfileInfo.error.message"
                            ),
                            other: {
                                error: true
                            }
                        },
                        updateStatus: true
                    });
                }
            });
    }

    public render() {
        const {t} = this.props;
        const {notification} = this.state;
        const {description, message, other} = notification;

        return (
            <SettingsSection
                header={t("views:profileExport.header")}
                description={t("views:profileExport.description")}
                actionTitle={t("views:profileExport.buttons.export")}
                onActionClick={this.downloadUserProfile}>
                <Transition visible={this.state.updateStatus} duration={500}>
                    <NotificationComponent {...other} onDismiss={this.handleDismiss} size="small"
                                           description={description} message={message}
                    />
                </Transition>
                <Divider hidden/>
            </SettingsSection>
        );
    }
}

export const ProfileExport = withTranslation()(ProfileExportComponent);
