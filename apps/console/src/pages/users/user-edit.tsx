/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertInterface, ProfileInfoInterface, emptyProfileInfo } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, UserAvatar } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../api";
import { EditUser } from "../../components";
import { history } from "../../helpers";

/**
 * User Edit page.
 *
 * @return {React.ReactElement}
 */
const UserEditPage = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ user, setUserProfile ] = useState<ProfileInfoInterface>(emptyProfileInfo);
    const [ isUserDetailsRequestLoading, setIsUserDetailsRequestLoading ] = useState<boolean>(false);

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const getUser = (id: string) => {
        setIsUserDetailsRequestLoading(true);

        getUserDetails(id)
            .then((response) => {
                setUserProfile(response);
            })
            .catch(() => {
                // TODO add to notifications
            })
            .finally(() => {
                setIsUserDetailsRequestLoading(false);
            });
    };

    const handleUserUpdate = (id: string) => {
        getUser(id);
    };

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getUser(id);
    }, []);

    const handleBackButtonClick = () => {
        history.push("/users");
    };

    return (
        <PageLayout
            isLoading={ isUserDetailsRequestLoading }
            title={ t(user?.name?.givenName && user.name.familyName ? user.name.givenName + " " + user.name.familyName :
                "Administrator") }
            description={ t("" + user.emails && user.emails !== undefined ? user.emails[0].toString() :
                user.userName) }
            image={ (
                <UserAvatar
                    name={ user.userName }
                    size="tiny"
                    floated="left"
                    image={ user.profileUrl }
                />
            ) }
            backButton={ {
                "data-testid": "user-mgt-edit-user-back-button",
                onClick: handleBackButtonClick,
                text: t("adminPortal:pages.usersEdit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditUser user={ user } handleUserUpdate={ handleUserUpdate }/>
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserEditPage;
