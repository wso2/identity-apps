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

import {
    AuthenticateSessionUtil,
    AuthenticateUserKeys
} from "@wso2is/authenticate";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Divider, Grid } from "semantic-ui-react";
import { HomeTileIcon } from "../components";
import { InnerPageLayout } from "../layouts";

/**
 * Overview page.
 *
 * @return {JSX.Element}
 */
export const HomePage = (): JSX.Element => {
    const { t } = useTranslation();
    return (
        <InnerPageLayout
            pageTitle={ t(
                "views:overviewPage.title",
                { firstName: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.DISPLAY_NAME) }
                ) }
            pageDescription={ t("views:overviewPage.subTitle") }
            pageTitleTextAlign="left"
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={8}>
                        <Card as={ Link } to="/personal-info" fluid className="margin-x1">
                            <Card.Content textAlign="center" className="padding-x2">
                                <HomeTileIcon icon="Profile"/>
                                <Divider hidden />
                                <Card.Header>
                                    { t("views:overviewPage.sections.personalInfo.header") }
                                </Card.Header>
                                <Card.Description>
                                    { t("views:overviewPage.sections.personalInfo.description") }
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={8}>
                        <Card as={ Link } to="/security" fluid className="margin-x1">
                            <Card.Content textAlign="center" className="padding-x2">
                                <HomeTileIcon icon="Security"/>
                                <Divider hidden />
                                <Card.Header>
                                    { t("views:overviewPage.sections.accountSecurity.header") }
                                </Card.Header>
                                <Card.Description>
                                    { t("views:overviewPage.sections.accountSecurity.description") }
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={8}>
                        <Card as={ Link } to="/consent-management" fluid className="margin-x1">
                            <Card.Content textAlign="center" className="padding-x2">
                                <HomeTileIcon icon="Consent"/>
                                <Divider hidden />
                                <Card.Header>
                                    { t("views:overviewPage.sections.applications.header") }
                                </Card.Header>
                                <Card.Description>
                                    { t("views:overviewPage.sections.applications.description") }
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};
