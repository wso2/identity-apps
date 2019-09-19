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

import React from "react";
import { useTranslation } from "react-i18next";
import { List } from "semantic-ui-react";
import { NotificationActionPayload } from "../models/notifications";
import { Fido } from "./multi-factor-fido";
import { SmsOtp } from "./multi-factor-smsotp";
import { SettingsSection } from "./settings-section";

/**
 * Proptypes for the basic details component.
 */
interface MFAProps {
    onNotificationFired: (notification: NotificationActionPayload) => void;
}

export const MultiFactor: React.FunctionComponent<MFAProps> = (props: MFAProps): JSX.Element => {
    const { t } = useTranslation();
    const { onNotificationFired } = props;

    return (
        <SettingsSection
            description={ t("views:securityPage.multiFactor.subTitle") }
            header={ t("views:securityPage.multiFactor.title") }
        >
            <List divided verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    <SmsOtp onNotificationFired={ onNotificationFired }/>
                </List.Item>
                <List.Item className="inner-list-item">
                    <Fido/>
                </List.Item>
            </List>
        </SettingsSection>
    );
}
