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
import { WidgetIcons } from "../../../configs";
import { history } from "../../../helpers";
import { SettingsSection } from "../../shared";

/**
 * Account security widget.
 *
 * @return {JSX.Element}
 */
export const AccountSecurityWidget: FunctionComponent<{}> = (): JSX.Element => {
    const { t } = useTranslation();

    const navigate = () => {
        history.push("/security");
    };

    return (
        <div className="widget account-security">
            <SettingsSection
                header={ t("userPortal:components.overview.widgets.accountSecurity.header") }
                description={ t("userPortal:components.overview.widgets.accountSecurity.description") }
                primaryAction={ t("userPortal:components.overview.widgets.accountSecurity.actionTitles.update") }
                onPrimaryActionClick={ navigate }
                icon={ WidgetIcons.accountSecurity }
                iconMini={ WidgetIcons.accountSecurity }
                iconSize="tiny"
                iconStyle="twoTone"
            />
        </div>
    );
};
