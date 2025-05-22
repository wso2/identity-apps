/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import Button from "@oxygen-ui/react/Button";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { CommonUtils } from "@wso2is/core/utils";
import {
    EmptyPlaceholder,
    TabPageLayout,
    UserAvatar
} from "@wso2is/react-components";
import React, { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserDetails } from "../api/use-get-user-details";
import { EditUser } from "../components/edit-user";
import UserManagementProvider from "../providers/user-management-provider";

/**
 * User Edit page.
 *
 * @returns User edit page react component.
 */
const UserEditPage = (): ReactElement => {

    const { t } = useTranslation();

    const path: string[] = history.location.pathname.split("/");
    const id: string = path[ path.length - 1 ];

    // Get user profile details.
    const {
        data: originalUserDetails,
        isLoading: isUserDetailsFetchRequestLoading,
        mutate: mutateUserDetails,
        error: userDetailsFetchRequestError
    } = useUserDetails(id);

    const user: any = useMemo(() => originalUserDetails , [ originalUserDetails ]);

    const handleUserUpdate = () => {
        mutateUserDetails();
    };

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("USERS"));
    };

    if (userDetailsFetchRequestError) {
        return (
            <EmptyPlaceholder
                action={ (
                    <Button variant="text" onClick={ CommonUtils.refreshPage }>
                        { t("console:common.placeholders.brokenPage.action") }
                    </Button>
                ) }
                image={ getEmptyPlaceholderIllustrations().brokenPage }
                imageSize="tiny"
                subtitle={ [
                    t("console:common.placeholders.brokenPage.subtitles.0"),
                    t("console:common.placeholders.brokenPage.subtitles.1")
                ] }
                title={ t("console:common.placeholders.brokenPage.title") }
            />
        );
    }

    return (
        <UserManagementProvider>
            <TabPageLayout
                isLoading={ isUserDetailsFetchRequestLoading }
                loadingStateOptions={ {
                    count: 5,
                    imageType: "circular"
                } }
                title={ user?.attributes?.username }
                pageTitle="Edit User"
                description={ `${user?.attributes?.name?.givenname} ${user?.attributes?.name?.lastname}` }
                image={ (
                    <UserAvatar
                        editable={ false }
                        hoverable={ false }
                        name={ user?.attributes?.username }
                        size="tiny"
                        image={ user?.profileUrl }
                    />
                ) }
                backButton={ {
                    "data-testid": "user-mgt-edit-user-back-button",
                    onClick: handleBackButtonClick,
                    text: t("pages:usersEdit.backButton", { type: "Users" })
                } }
                titleTextAlign="left"
                bottomMargin={ false }
            >
                <EditUser
                    user={ user }
                    handleUserUpdate={ handleUserUpdate }
                    isLoading={ false }
                    isReadOnly={ false }
                    isReadOnlyUserStore={ false }
                />
            </TabPageLayout>
        </UserManagementProvider>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserEditPage;
