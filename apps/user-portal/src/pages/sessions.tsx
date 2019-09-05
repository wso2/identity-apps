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
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { UserSessionsComponent } from "../components";
import { InnerPageLayout } from "../layouts";

/**
 * Sessions page.
 *
 * @return {JSX.Element}
 */
export const SessionsPage = (): JSX.Element => {
    const { t } = useTranslation();
    return (
        <InnerPageLayout
            pageTitle={ t("views:sessionsPage:title") }
            pageDescription={ t("views:sessionsPage:subTitle") }
        >
            <Divider hidden/>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <UserSessionsComponent/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};
