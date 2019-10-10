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
import { SettingsSection } from "./settings-section";
import { SecurityQuestionsComponent } from "./account-recovery-security-qs";
import { EmailRecovery } from "./account-recovery-email";
import { CodeRecovery } from "./account-recovery-code";

/**
 * Proptypes for the basic details component.
 */
interface AccountRecoveryProps {
    onNotificationFired: (notification: NotificationActionPayload) => void;
}

export const AccountRecovery: React.FunctionComponent<AccountRecoveryProps> = (
    props: AccountRecoveryProps
): JSX.Element => {
    const { t } = useTranslation();
    const { onNotificationFired } = props;

    return (
        <SettingsSection
            description={ t("views:accountRecovery.subTitle") }
            header={ t("views:accountRecovery.title") }
        >
            <List divided verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    <SecurityQuestionsComponent/>
                </List.Item>
                <List.Item className="inner-list-item">
                    <EmailRecovery onNotificationFired={onNotificationFired}/>
                </List.Item>
                <List.Item className="inner-list-item">
                    <CodeRecovery onNotificationFired={onNotificationFired}/>
                </List.Item>
            </List>
        </SettingsSection>
    );
}
