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

import { HttpResponse, useAuthContext } from "@asgardeo/auth-react";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { userConfig } from "@wso2is/admin.extensions.v1/configs/user";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { isMyAccountImpersonationRole } from "@wso2is/admin.roles.v2/components/role-utils";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    ProfileInfoInterface,
    RolesMemberInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AuthenticateUtils } from "@wso2is/core/utils";
import { DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { Dispatch, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMyAccountApplicationData } from "../../admin.applications.v1/api/application";
import { useGetApplication } from "../../admin.applications.v1/api/use-get-application";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants/application-management";
import { ApplicationListItemInterface } from "../../admin.applications.v1/models/application";
import { useUserDetails } from "../api";
import { UserManagementConstants } from "../constants";

/**
 * Props for Impersonate User Action component.
 */
interface UserImpersonationActionInterface extends IdentifiableComponentInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Whether the user is locked.
     */
    isLocked: boolean;
    /**
     * Whether the user is disabled.
     */
    isDisabled: boolean;
    /**
     * Whether user is read only.
     */
    isReadOnly: boolean;
    /**
     * Whether the user is managed by the parent organization.
     */
    isUserManagedByParentOrg: boolean;
}

/**
 * Impersonate User Action component.
 */
export const UserImpersonationAction: FunctionComponent<UserImpersonationActionInterface> = (
    props: UserImpersonationActionInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId,
        user,
        isLocked,
        isDisabled,
        isReadOnly,
        isUserManagedByParentOrg
    } = props;

    const { httpRequest } = useAuthContext();
    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    const [ impersonationInProgress, setImpersonationInProgress ] = useState<boolean>(false);
    const [ codeVerifier, setCodeVerifier ] = useState<string>(undefined);
    const [ codeChallenge, setCodeChallenge ] = useState<string>(undefined);
    const [ idToken, setIdToken ] = useState(undefined);
    const [ subjectToken, setSubjectToken ] = useState(undefined);
    const [ authenticatedUserRoles, setAuthenticatedUserRoles ] = useState<RolesMemberInterface[]>([]);
    const [ myAccountAppId, setMyAccountAppId ] = useState<string>(null);
    const [ isMyAccountEnabled, setMyAccountStatus ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);
    const [ isMyAccountImpersonatable, setIsMyAccountImpersonatable ]
        = useState<boolean>(false);

    const consoleUrl: string = useSelector((state: AppState) => state?.config?.deployment?.clientHost);
    const organizationType: string = useSelector((state: AppState) => state?.organization?.organizationType);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
    const authenticatedUserProfileInfo: ProfileInfoInterface = useSelector((state: AppState) =>
        state?.profile?.profileInfo);
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const userFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config.ui.features?.users);
    const accountAppClientID: string = useSelector((state: AppState) =>
        state.config.deployment.accountApp.clientID);
    const getUserId = (userId: string): string => {
        const tenantAwareUserId: string = userId.split("@").length > 1 ? userId.split("@")[0] : userId;
        const userDomainAwareUserId: string = tenantAwareUserId.split("/").length > 1 ?
            tenantAwareUserId.split("/")[1] : tenantAwareUserId;

        return userDomainAwareUserId;
    };
    const {
        data: myAccountApplicationData,
        isLoading: isMyAccountApplicationDataFetchRequestLoading
    } = useMyAccountApplicationData("advancedConfigurations,templateId,clientId,issuer");
    const {
        data: myAccountApplication,
        isLoading: isMyAccountApplicationGetRequestLoading
    } = useGetApplication(myAccountAppId , !!myAccountAppId);
    const {
        data: authenticatedUserProfileInfoData,
        isLoading: isAuthenticatedUserFetchRequestLoading
    } = useUserDetails(getUserId(authenticatedUserProfileInfo?.id));

    const isSubOrgUser: boolean = (organizationType === OrganizationType.SUBORGANIZATION);
    const IMPERSONATION_ARTIFACTS: string = "impersonation_artifacts";
    let impersonation_artifacts: any = sessionStorage.getItem(IMPERSONATION_ARTIFACTS);

    useEffect(() => {
        if (!isAuthenticatedUserFetchRequestLoading) {
            if (authenticatedUserProfileInfoData != undefined) {
                setAuthenticatedUserRoles(authenticatedUserProfileInfoData?.roles);
            }
        }
    }, [ isAuthenticatedUserFetchRequestLoading ]);

    useEffect(() => {
        if (impersonation_artifacts != undefined && impersonation_artifacts != null
                && !impersonation_artifacts.includes("oauth2_error")) {
            const id_token: any = new URLSearchParams(impersonation_artifacts)
                .get(UserManagementConstants.ID_TOKEN);
            const subject_token: any = new URLSearchParams(impersonation_artifacts)
                .get(UserManagementConstants.SUBJECT_TOKEN);

            if (id_token && subject_token) {
                setIdToken(id_token);
                setSubjectToken(subject_token);
            }
        }
    }, [ impersonation_artifacts ]);

    useEffect(() => {
        window.addEventListener("message", handleInitImpersonateIframeMessage);

        return () => window.removeEventListener("message", handleInitImpersonateIframeMessage);
    }, []);

    useEffect(() => {
        if (idToken && subjectToken) {
            sendTokenRequest(idToken, subjectToken);
        }
    }, [ idToken, subjectToken ]);

    useEffect(() => {
        if (impersonationInProgress) {
            setTimeout(() => {
                if (impersonationInProgress && idToken == undefined && subjectToken == undefined) {
                    setImpersonationInProgress(false);
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.impersonateUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.impersonateUser.error.message"
                        )
                    }));
                }
            }, 5000);
        }
    }, [ impersonationInProgress ]);

    const handleInitImpersonateIframeMessage = (event: CompositionEvent) => {
        if (event.data === "impersonation-authorize-request-complete"
                && sessionStorage.getItem(IMPERSONATION_ARTIFACTS) != null) {
            impersonation_artifacts = sessionStorage.getItem(IMPERSONATION_ARTIFACTS).substring(1);
            sessionStorage.removeItem(IMPERSONATION_ARTIFACTS);

            if (impersonation_artifacts.includes("error")) {
                setImpersonationInProgress(false);
                dispatch(addAlert({
                    description: t(
                        "users:notifications.impersonateUser.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "users:notifications.impersonateUser.error.message"
                    )
                }));
            }

            const id_token: any = new URLSearchParams(impersonation_artifacts).get(UserManagementConstants.ID_TOKEN);
            const subject_token: any
                = new URLSearchParams(impersonation_artifacts).get(UserManagementConstants.SUBJECT_TOKEN);

            if (id_token && subject_token) {
                setIdToken(id_token);
                setSubjectToken(subject_token);
            }
        }
    };

    /**
     * Set the application id for My Account.
     */
    useEffect(() => {
        if (myAccountApplicationData?.applications?.length === 1) {
            myAccountApplicationData.applications.forEach((
                item: ApplicationListItemInterface
            ) => {
                setMyAccountAppId(item?.id);
            });
        }
    }, [ myAccountApplicationData ]);

    /**
     * Sets the initial spinner.
     */
    useEffect(() => {
        if (!isMyAccountApplicationGetRequestLoading
                && !isMyAccountApplicationDataFetchRequestLoading
        ) {
            if (myAccountApplication) {
                // Set if my account is enabled.
                setMyAccountStatus(myAccountApplication?.applicationEnabled);

                // Set if my account login Steps is one and the BasicAuthenticator is included.
                if (myAccountApplication?.authenticationSequence?.steps?.length === 1) {
                    const step: any = myAccountApplication?.authenticationSequence?.steps[0];

                    if (Array.isArray(step?.options) && step.options.some(
                        (option: any) => option?.authenticator === "BasicAuthenticator"
                    )) {
                        setIsMyAccountImpersonatable(true);
                    }
                }
            }
        }
    }, [
        isMyAccountApplicationGetRequestLoading,
        isMyAccountApplicationDataFetchRequestLoading,
        myAccountAppId
    ]);

    /**
     * This function sends the token request to the server.
     *
     * @param idToken       - The ID token received from the impersonation request.
     * @param subjectToken  - The subject token received from the impersonation request.
     */
    const sendTokenRequest = (idToken: any, subjectToken: any) => {

        const formData: any = {
            actor_token: idToken,
            actor_token_type: ApplicationManagementConstants.TOKEN_TYPE_ID_TOKEN,
            client_id: accountAppClientID,
            code_verifier: codeVerifier,
            grant_type: ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE,
            requested_token_type: ApplicationManagementConstants.TOKEN_TYPE_ACCESS_TOKEN,
            subject_token: subjectToken,
            subject_token_type: ApplicationManagementConstants.TOKEN_TYPE_JWT_TOKEN
        };

        const urlEncodedData: any = new URLSearchParams(formData).toString();

        const requestConfig: any = {
            attachToken: false,
            data: urlEncodedData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            shouldEncodeToFormData: false,
            url: sessionStorage.getItem("token_endpoint")
        };

        httpRequest(requestConfig)
            .then((response: HttpResponse) => {
                if (response.status === 200) {
                    setImpersonationInProgress(false);
                    setIdToken(undefined);
                    setSubjectToken(undefined);
                    setCodeChallenge(undefined);
                    setCodeVerifier(undefined);
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.impersonateUser.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "users:notifications.impersonateUser.success.message"
                        )
                    }));
                    window.open(consumerAccountURL, "_blank");
                }
            })
            .catch(() => {
                setImpersonationInProgress(false);
                dispatch(addAlert({
                    description: t(
                        "users:notifications.impersonateUser.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "users:notifications.impersonateUser.error.message"
                    )
                }));
            });
    };

    /**
     * This function returns the username or the default email of the current user (if the username is empty).
     *
     * @param user - user that the username will be extracted from.
     * @param shouldReturnDefaultEmailAsFallback - whether to return the default email address when the username is
     *                                             empty.
     */
    const resolveUsernameOrDefaultEmail = (user: ProfileInfoInterface,
        shouldReturnDefaultEmailAsFallback: boolean): string => {
        let username: string = user?.userName;

        if (username.length === 0 && shouldReturnDefaultEmailAsFallback) {
            return user.email;
        }

        if (username.split("/").length > 1) {
            username = username.split("/")[1];
        }

        return username;
    };

    const resolvedUsername: string = resolveUsernameOrDefaultEmail(user, false);
    const isUserCurrentLoggedInUser: boolean = authenticatedUser?.includes(resolvedUsername);

    /**
     * This function checks the authenticated user is authorized to perform impersonation.
     */
    const isLoggedInUserAuthorizedToImpersonate = (): boolean => {

        for (let index: number = 0; index < authenticatedUserRoles?.length; index++) {
            const authenticatedUserRole: RolesMemberInterface = authenticatedUserRoles[index];

            if (isMyAccountImpersonationRole(authenticatedUserRole?.display,
                authenticatedUserRole?.audienceDisplay)) {
                return true;
            }
        }

        return false;
    };

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    /**
     * This function checks whether the authenticated user's (impersonator) tenant is the logged tenant.
     */
    const isAuthenticatedUserInAnAllowedUserstore = (): boolean => {

        const userUserStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : userstoresConfig?.primaryUserstoreName;

        const authenticatedUserUserStore: string = authenticatedUserProfileInfo?.id?.split("/").length > 1
            ? authenticatedUserProfileInfo?.id?.split("/")[0]
            : (
                userConfig?.allowImpersonationForPrimaryUserStore
                    ? primaryUserStoreDomainName : UserManagementConstants.ASGARDEO_USERSTORE
            );

        return authenticatedUserUserStore !== UserManagementConstants.ASGARDEO_USERSTORE
            || userUserStore === authenticatedUserUserStore;
    };

    /**
     * This function returns if the impersonation action is enabled for the current user.
     *  1. My Account is enabled.
     *  2. The user is authorized to impersonate.
     *  3. The user is not locked.
     *  4. The user is not disabled.
     */
    const isImpersonatable = (): boolean => {

        return isMyAccountImpersonatable && isMyAccountEnabled
            && isLoggedInUserAuthorizedToImpersonate() && !isLocked && !isDisabled;
    };

    /**
     * This function handles impersonation of the user.
     */
    const handleUserImpersonation = async (): Promise<void> => {

        const codeVerifier: string = AuthenticateUtils.generateCodeVerifier();
        const codeChallenge: string = await AuthenticateUtils.getCodeChallangeForTheVerifier(codeVerifier);

        setCodeVerifier(codeVerifier);
        setCodeChallenge(codeChallenge);
        setImpersonationInProgress(true);
    };

    /**
     * This function returns the tenant aware URL.
     *
     * @param url - The URL to be modified.
     */
    const getTenantAwareURL = (url: string): string => {

        const newURL: URL = new URL(url);
        const newPathname: string = newURL.pathname.replace(/^\/t\/[^/]+/, "");

        newURL.pathname = newPathname;

        return newURL.toString();
    };

    /**
     * This function resolves the iframe for the impersonation.
     */
    const resolveIframe = (): ReactElement => {

        if (impersonationInProgress && codeChallenge != undefined && codeChallenge != null) {
            return (
                <iframe
                    hidden
                    src={ `${getTenantAwareURL(consoleUrl)}/resources/users/init-impersonate.html`
                        + `?userId=${encodeURIComponent(user.id)}`
                        + `&codeChallenge=${encodeURIComponent(codeChallenge)}`
                        + `&clientId=${encodeURIComponent(accountAppClientID)}`
                    }
                />
            );
        }

        return null;
    };

    /**
     * This function resolves the button disable hint.
     */
    const resolvedButtonDisableHint = (): string | undefined => {
        const baseKey: string = "user:editUser.userActionZoneGroup.impersonateUserZone.buttonDisableHints";

        if (!isMyAccountImpersonatable) {
            return t(`${baseKey}.myAccountLoginFlowIncompatible`);
        }
        if (!isMyAccountEnabled) {
            return t(`${baseKey}.myAccountDisabled`);
        }
        if (!isLoggedInUserAuthorizedToImpersonate()) {
            return t(`${baseKey}.insufficientPermissions`);
        }
        if (isDisabled) {
            return t(`${baseKey}.userAccountDisabled`);
        }
        if (isLocked) {
            return t(`${baseKey}.userAccountLocked`);
        }

        return undefined;
    };

    /**
     * This function returns impersonate user action in the danger zone.
     */
    const resolveUserActions = (): ReactElement => {

        return (
            !isSubOrgUser && !isUserCurrentLoggedInUser && isAuthenticatedUserInAnAllowedUserstore()
                && isFeatureEnabled(userFeatureConfig,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_IMPERSONATION")) ?
                (
                    <React.Fragment>
                        <DangerZoneGroup
                            className="action-zone"
                        >
                            {
                                !isReadOnly && !isUserManagedByParentOrg && (
                                    <DangerZone
                                        data-componentid={ `${ componentId }-danger-zone-button` }
                                        className="action-zone"
                                        actionTitle={ t("user:editUser." +
                                            "userActionZoneGroup.impersonateUserZone.actionTitle") }
                                        header={
                                            t("user:editUser.userActionZoneGroup.impersonateUserZone.header")
                                        }
                                        subheader={
                                            t("user:editUser.userActionZoneGroup.impersonateUserZone.subheader")
                                        }
                                        onActionClick={ (): void => {
                                            handleUserImpersonation();
                                        } }
                                        isButtonDisabled={  !isImpersonatable() }
                                        buttonDisableHint={ resolvedButtonDisableHint() }
                                        isButtonLoading={ impersonationInProgress }
                                    />
                                )
                            }
                        </DangerZoneGroup>
                        { resolveIframe() }
                    </React.Fragment>
                ) : null
        );
    };

    return resolveUserActions();
};

/**
 * Default props for the component.
 */
UserImpersonationAction.defaultProps = {
    "data-componentid": "impersonate-user-action"
};

export default UserImpersonationAction;
