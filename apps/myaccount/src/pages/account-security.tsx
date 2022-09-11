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
import { PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps } from "react-router";
import { Grid } from "semantic-ui-react";
import {
    AccountRecoveryComponent,
    ChangePassword,
    Consents,
    LoginVerifyingData,
    MultiFactorAuthentication,
    UserSessionsComponent
} from "../components";
import { AppConstants, CommonConstants } from "../constants";
import { commonConfig } from "../extensions";
import { SCIMConfigs } from "../extensions/configs/scim";
import { resolveUserstore } from "../helpers";
import { AlertInterface, AuthStateInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { addAlert } from "../store/actions";
import { CommonUtils } from "../utils";

/**
* Prop types for the Account Security page.
*/
interface AccountSecurityPagePropsInterface extends TestableComponentInterface, RouteProps {
    enableNonLocalCredentialUserView?: boolean;
}

/**
 * Account security page.
 *
 * @param props - Props injected to the component.
 * @returns Account security page.
 */
const AccountSecurityPage: FunctionComponent<AccountSecurityPagePropsInterface>= (
    props: AccountSecurityPagePropsInterface
): ReactElement => {

    const {
        enableNonLocalCredentialUserView
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const disableMFAforSuperTenantUser: boolean = useSelector((state: AppState) => {
        return state?.config?.ui?.disableMFAforSuperTenantUser;
    });
    const disableMFAForFederatedUsers: boolean = useSelector((state: AppState) => {
        return state?.config?.ui?.disableMFAForFederatedUsers;
    });
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    const [ isNonLocalCredentialUser, setIsNonLocalCredentialUser ] = useState<boolean>(false);
    const [ userstore, setUserstore ] = useState<string>(null);

    const consentControl = useRef<HTMLDivElement>(null);
    const accountSecurity = useRef<HTMLDivElement>(null);
    const accountActivity = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            switch (props.location.hash) {
                case `#${ CommonConstants.CONSENTS_CONTROL }`:
                    consentControl.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    break;
                case `#${ CommonConstants.ACCOUNT_ACTIVITY }`:
                    accountActivity.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    break;
                case `#${ CommonConstants.ACCOUNT_SECURITY }`:
                    accountSecurity.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    break;
            }
        }, 100);

    }, [ props.location ]);

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

    }, [ profileDetails?.profileInfo ]);

    /**
     * Sets userstore of the user.
     */
    useEffect(() => {
        if (profileDetails?.profileInfo?.userName) {
            const userstore: string = resolveUserstore(profileDetails.profileInfo.userName);

            setUserstore(userstore);
        }
    }, [ profileDetails?.profileInfo ]);

    /**
     * Dispatches the alert object to the redux store.
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Check if the login tenant is super tenant or not?
     *
     * @returns True if login tenant is super tenant.
     */
    const isSuperTenantLogin = (): boolean => {
        return AppConstants.getTenant() === AppConstants.getSuperTenant();
    };

    return (
        <PageLayout
            pageTitle="Security"
            title={ t("myAccount:pages.security.title") }
            description={
                (!isNonLocalCredentialUser
                    ?
                    t("myAccount:pages.security.subTitle")
                    :
                    // For socially signed up user.
                    ("Secure your account by managing your sessions"))
            }
        >
            <Grid>
                { !CommonUtils.isProfileReadOnly(isReadOnlyUser) && !isNonLocalCredentialUser
                    && hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_CHANGE_PASSWORD")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <ChangePassword onAlertFired={ handleAlerts } />
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { !CommonUtils.isProfileReadOnly(isReadOnlyUser) && !isNonLocalCredentialUser
                    && hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <div ref={ accountSecurity }>
                                    <AccountRecoveryComponent
                                        featureConfig={ accessConfig }
                                        onAlertFired={ handleAlerts }
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                  ((isNonLocalCredentialUser && (!disableMFAForFederatedUsers || !isSuperTenantLogin())) ||
                    !isNonLocalCredentialUser) &&
                  isFeatureEnabled(
                      accessConfig?.security,
                      AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA")
                  ) && !(disableMFAforSuperTenantUser && (isSuperTenantLogin())
                ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <MultiFactorAuthentication
                                    featureConfig={ accessConfig }
                                    onAlertFired={ handleAlerts }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_LOGIN_VERIFY_DATA")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <LoginVerifyingData
                                    featureConfig={ accessConfig }
                                    onAlertFired={ handleAlerts }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_ACTIVE_SESSIONS")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <div ref={ accountActivity }>
                                    <UserSessionsComponent onAlertFired={ handleAlerts } />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_CONSENTS")
                    ) && commonConfig.utils.isManageConsentAllowedForUser(userstore)
                    ? (

                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <div>
                                    <Consents onAlertFired={ handleAlerts } />
                                </div>
                                <div ref={ consentControl }/>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }
            </Grid>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AccountSecurityPage.defaultProps = {
    enableNonLocalCredentialUserView: commonConfig.nonLocalCredentialUser.enableNonLocalCredentialUserView
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AccountSecurityPage;
