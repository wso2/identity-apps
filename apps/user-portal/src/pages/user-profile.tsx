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
import { Container, Divider, Form } from "semantic-ui-react";
import {
    AssociatedAccountsPage,
    BasicDetails,
    PersonalDetails,
} from "../components";
import { InnerPageLayout } from "../layouts";

/**
 * User Profile Page of the User Portal
 */
class UserProfilePageComponent extends React.Component<WithTranslation, any> {
    public render() {
        const {t} = this.props;
        return (
            <InnerPageLayout
                pageTitle={t("views:userProfile.title")}
                pageDescription={t("views:userProfile.subTitle")}>
                <Container>
                    <Form>
                        <BasicDetails/>
                        <Divider hidden/>
                        <PersonalDetails/>
                        <Divider hidden/>
                        <AssociatedAccountsPage/>
                        <Divider hidden/>
                    </Form>
                </Container>
            </InnerPageLayout>
        );
    }
}

export const UserProfilePage = withTranslation()(UserProfilePageComponent);
