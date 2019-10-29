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
import { Notification } from "../../models";
import { SettingsSection } from "../shared";
import { FIDOAuthenticator, SMSOTPAuthenticator } from "./authenticators";

/**
 * Proptypes for the basic details component.
 */
interface MfaProps {
    onNotificationFired: (notification: Notification) => void;
}

export const MultiFactorAuthentication: React.FunctionComponent<MfaProps> = (props: MfaProps): JSX.Element => {
    const { t } = useTranslation();
    const { onNotificationFired } = props;

    return (
        <SettingsSection
            description={ t("views:sections.mfa.description") }
            header={ t("views:sections.mfa.heading") }
        >
            <List divided verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    <SMSOTPAuthenticator onNotificationFired={ onNotificationFired }/>
                </List.Item>
                <List.Item className="inner-list-item">
                    <FIDOAuthenticator onNotificationFired={ onNotificationFired } />
                </List.Item>
            </List>
        </SettingsSection>
    );
}
