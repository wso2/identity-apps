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

import { ProfileConstants } from "@wso2is/core/constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Overview } from "../components";
import { commonConfig } from "../extensions";
import { resolveUserProfileName } from "../helpers";
import { InnerPageLayout } from "../layouts";
import { AuthStateInterface } from "../models";
import { AppState } from "../store";

/**
 * Prop types for the overview page.
 */
interface OverviewPagePropsInterface extends TestableComponentInterface {
    enableNonLocalCredentialUserView?: boolean;
    enableAlternateWidgetLayout?: boolean;

}

/**
 * Overview page.
 *
 * @return {React.ReactElement}
 */
const OverviewPage: FunctionComponent<OverviewPagePropsInterface> = (
    props: OverviewPagePropsInterface
): ReactElement => {

    const {
        enableNonLocalCredentialUserView,
        enableAlternateWidgetLayout
    } = props;
    const { t } = useTranslation();
    const isProfileInfoLoading: boolean = useSelector( (state: AppState) => state.loaders.isProfileInfoLoading);
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const [ userProfileName, setUserProfileName ] = useState<string>(null);
    const [ isNonLocalCredentialUser, setIsNonLocalCredentialUser ] = useState<boolean>(false);
    const [ userSource, setUserSource ] = useState<string>(null);

    useEffect(() => {
        if (isProfileInfoLoading === undefined) {
            return;
        }

        setUserProfileName(resolveUserProfileName(profileDetails, isProfileInfoLoading));
    }, [ isProfileInfoLoading ]);

    /**
     * Verifies whether a user is a federated user (user without local credentials).
     */
    useEffect(() => {
        if (!enableNonLocalCredentialUserView) {
            return;
        }
        // Verifies if the user is a user without local credentials.
        if (!profileDetails?.profileInfo?.[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.
            [ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("LOCAL_CREDENTIAL_EXISTS")]) {
            setIsNonLocalCredentialUser(true);
        }

    }, [profileDetails?.profileInfo]);

    /**
     * Sets the source of the user.
     */
    useEffect(() => {
        // Sets user's source of sign up if the user is a federated user.
        const userSource = profileDetails?.profileInfo?.[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.
            [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("IDP_TYPE")];

        if (isNonLocalCredentialUser && userSource) {
            setUserSource(userSource);
        }
    }, [profileDetails?.profileInfo, isNonLocalCredentialUser]);

    return (
        <InnerPageLayout
            pageTitle={ userProfileName ? (
                <div>
                    {
                        t(
                            "myAccount:pages:overview.title",
                            { firstName: userProfileName }
                        )
                    }
                </div>

            ) : null }
            pageDescription={ t("myAccount:pages:overview.subTitle") }
            pageTitleTextAlign="left"
        >
            { /* Loads overview component only when user info is loaded.
                Loads overview component based on user credential type (local/non-local).*/ }
            { isProfileInfoLoading == false &&
                <Overview
                    userSource={ userSource }
                    enableAlternateWidgetLayout={ enableAlternateWidgetLayout }
                />
            }
        </InnerPageLayout>
    );
};

/**
 * Default properties for the {@link OverviewPage} component.
 * See type definitions in {@link OverviewPage}
 */
OverviewPage.defaultProps = {
    enableNonLocalCredentialUserView: commonConfig.nonLocalCredentialUser.enableNonLocalCredentialUserView,
    enableAlternateWidgetLayout: commonConfig.overviewPage.enableAlternateWidgetLayout
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OverviewPage;
