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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {Divider, Grid} from "semantic-ui-react";
import {NotificationComponent} from "../../../user-portal/src/components";
import {
    Notification
} from "../../../user-portal/src/models/notifications";
import { UsersList } from "../components/users/users-list";
import UsersSearch from "../components/users/users-search";
import { InnerPageLayout } from "../layouts";

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersPage = (): JSX.Element => {
    const { t } = useTranslation();
    // const [ notification, setNotification ] = useState(createEmptyNotificationActionPayload());

    const handleNotification = (firedNotification: Notification) => {
        // setNotification(firedNotification);
    };

    const handleNotificationDismiss = () => {
        // setNotification({
        //     ...notification,
        //     visible: false
        // });
    };

    return (
        <InnerPageLayout
            pageTitle={ t("views:UsersPage.title") }
            pageDescription={ t("views:UsersPage.subTitle") }>
            {/*{*/}
            {/*    notification && notification.visible*/}
            {/*        ? (<NotificationComponent*/}
            {/*            message={ notification.message }*/}
            {/*            description={ notification.description }*/}
            {/*            onDismiss={ handleNotificationDismiss }*/}
            {/*            { ...notification.otherProps }/>)*/}
            {/*        : null*/}
            {/*}*/}
            <Grid>
                <Grid.Row width={ 16 }>
                    <UsersSearch/>
                </Grid.Row>
                <Grid.Row>
                    <UsersList onNotificationFired={ handleNotification }/>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};
