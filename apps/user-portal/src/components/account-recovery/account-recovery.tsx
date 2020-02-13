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

import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { List } from "semantic-ui-react";
import { ACCOUNT_RECOVERY, EMAIL_RECOVERY, SECURITY, SECURITY_QUESTIONS } from "../../constants";
import { AppConfig } from "../../helpers";
import { AlertInterface } from "../../models";
import { checkEnabled } from "../../utils";
import { SettingsSection } from "../shared";
import { EmailRecovery, SecurityQuestionsComponent } from "./options";

/**
 * Prop types for AccountRecoveryComponent component.
 */
interface AccountRecoveryProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * The AccountRecoveryComponent component in the Settings section
 *
 * @param {AccountRecoveryProps} props
 * @return {JSX.Element}
 */
export const AccountRecoveryComponent: React.FunctionComponent<AccountRecoveryProps> = (
    props: AccountRecoveryProps
): JSX.Element => {
    const { t } = useTranslation();
    const { onAlertFired } = props;
    const accountRecoveryConfig = useContext(AppConfig)[SECURITY][ACCOUNT_RECOVERY];

    return (
        <SettingsSection
            description={ t("views:sections.accountRecovery.description") }
            header={ t("views:sections.accountRecovery.heading") }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    {
                        checkEnabled(accountRecoveryConfig, SECURITY_QUESTIONS)
                            ? (
                                <SecurityQuestionsComponent onAlertFired={ onAlertFired } />
                            )
                            : null
                    }
                </List.Item>
                <List.Item className="inner-list-item">
                    {
                        checkEnabled(accountRecoveryConfig, EMAIL_RECOVERY)
                            ? (
                                <EmailRecovery onAlertFired={ onAlertFired } />
                            )
                            : null
                    }
                </List.Item>
            </List>
        </SettingsSection>
    );
};
