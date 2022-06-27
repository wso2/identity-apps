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
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { FederatedAssociations, LinkedAccounts, Profile, ProfileExport } from "../components";
import { AppConstants } from "../constants";
import { commonConfig } from "../extensions";
import { SCIMConfigs } from "../extensions/configs/scim";
import { InnerPageLayout } from "../layouts";
import { AlertInterface, AuthStateInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { addAlert } from "../store/actions";
import { CommonUtils } from "../utils";

/**
 * Prop types for the basic details component.
 * Also see {@link PersonalInfoPage.defaultProps}
 */
interface PersonalInfoPagePropsInterface extends TestableComponentInterface {
    enableNonLocalCredentialUserView?: boolean;
}

/**
 * Personal Info page.
 *
 * @return {React.ReactElement}
 */
const PersonalInfoPage:  FunctionComponent<PersonalInfoPagePropsInterface> = (
    props: PersonalInfoPagePropsInterface
): ReactElement => {
    const {
        enableNonLocalCredentialUserView
    } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const [ isNonLocalCredentialUser, setIsNonLocalCredentialUser ] = useState<boolean>(false);
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Checks if the user is a user without local credentials.
     */
    useEffect(() => {
        if (!enableNonLocalCredentialUserView) {
            return;
        }
        // Verifies if the user is a user without local credentials.
        const localCredentialExist = profileDetails?.profileInfo?.[SCIMConfigs.scim.customEnterpriseSchema]?.
            [ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("LOCAL_CREDENTIAL_EXISTS")];

        if (localCredentialExist && localCredentialExist == "false") {
            setIsNonLocalCredentialUser(true);
        }

    }, [profileDetails?.profileInfo]);


    return (
        <InnerPageLayout
            pageTitle={ t("myAccount:pages.personalInfo.title") }
            pageDescription={ 
                isFeatureEnabled(accessConfig?.personalInfo,
                    AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_LINKED_ACCOUNTS")) 
                    ? t("myAccount:pages.personalInfo.subTitle")
                    : isFeatureEnabled(accessConfig?.personalInfo,
                    AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_EXPORT_PROFILE")) 
                        ? t("myAccount:pages.personalInfoWithoutLinkedAccounts.subTitle")
                        : t("myAccount:pages.personalInfoWithoutExportProfile.subTitle") 
            }
        >
            {
                CommonUtils.isProfileReadOnly(isReadOnlyUser) 
                && (<Message 
                    type="info" 
                    content={ t("myAccount:pages.readOnlyProfileBanner") }
                />)
            }
            <Grid>
                {
                    hasRequiredScopes(accessConfig?.personalInfo,
                        accessConfig?.personalInfo?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.personalInfo,
                        AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_PROFILE"))
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <Profile
                                    isNonLocalCredentialUser={ isNonLocalCredentialUser }
                                    featureConfig={ accessConfig }
                                    onAlertFired={ handleAlerts }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    hasRequiredScopes(accessConfig?.personalInfo,
                        accessConfig?.personalInfo?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.personalInfo,
                        AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_LINKED_ACCOUNTS"))
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <LinkedAccounts onAlertFired={ handleAlerts }/>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    hasRequiredScopes(accessConfig?.personalInfo,
                        accessConfig?.personalInfo?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.personalInfo,
                        AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_EXTERNAL_LOGINS"))
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <FederatedAssociations
                                    isNonLocalCredentialUser={ isNonLocalCredentialUser }
                                    onAlertFired={ handleAlerts }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    hasRequiredScopes(accessConfig?.personalInfo,
                        accessConfig?.personalInfo?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.personalInfo,
                        AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_EXPORT_PROFILE"))
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <ProfileExport onAlertFired={ handleAlerts }/>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </InnerPageLayout>
    );
};

/**
* Default properties for the {@link PersonalInfoPage} component.
* See type definitions in {@link PersonalInfoPage}
*/
PersonalInfoPage.defaultProps = {
    enableNonLocalCredentialUserView: commonConfig.nonLocalCredentialUser.enableNonLocalCredentialUserView
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default PersonalInfoPage;
