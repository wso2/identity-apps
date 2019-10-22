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
import { Header, Icon } from "semantic-ui-react";
import { AccountStatusShields } from "../../../configs";
import { ThemeIcon } from "../../shared";

/**
 * Account status widget.
 *
 * @return {JSX.Element}
 */
export const AccountStatusWidget: FunctionComponent<{}> = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <div className="widget account-status">
            <div className="shield">
                <ThemeIcon icon={ AccountStatusShields.okay } size="auto" transparent/>
            </div>
            <div className="description">
                <Header className="status-header" as="h3">
                    { t("views:overviewPage.widgets.accountStatus.header") }
                </Header>
                <div className="meta">
                    <Icon className="meta-icon" name="check circle" />
                    { t("views:overviewPage.widgets.accountStatus.list.0") }
                </div>
                <div className="meta">
                    <Icon className="meta-icon" name="check circle" />
                    { t("views:overviewPage.widgets.accountStatus.list.1") }
                </div>
                <div className="meta">
                    <Icon className="meta-icon" name="check circle" />
                    { t("views:overviewPage.widgets.accountStatus.list.2") }
                </div>
            </div>
        </div>
    );
};
