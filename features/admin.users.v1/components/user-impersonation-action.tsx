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
import { AppState } from "@wso2is/admin.core.v1/store";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface, ProfileInfoInterface,
    RolesMemberInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { Dispatch, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants/application-management";
import { useUserDetails } from "../api";
import { UserManagementConstants } from "../constants";
import { UserManagementUtils } from "../utils/user-management-utils";

/**
 * Props for Impersonate User Action component.
 */
interface UserImpersonationActionInterface extends IdentifiableComponentInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Whether impersonation action is read only.
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
        isReadOnly,
        isUserManagedByParentOrg
    } = props;

    const { httpRequest } = useAuthContext();
    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    // State to manage the impersonation process.
    const [ impersonationInProgress, setImpersonationInProgress ] = useState<boolean>(false);
    const [ codeVerifier, setCodeVerifier ] = useState<string>(undefined);
    const [ codeChallenge, setCodeChallenge ] = useState<string>(undefined);
    const [ idToken, setIdToken ] = useState(undefined);
    const [ subjectToken, setSubjectToken ] = useState(undefined);
    const [ authenticatedUserRoles, setAuthenticatedUserRoles ] = useState<RolesMemberInterface[]>([]);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
    const authenticatedUserProfileInfo: ProfileInfoInterface = useSelector((state: AppState) =>
        state?.profile?.profileInfo);
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const userFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config.ui.features?.users);
    const accountAppClientID: string = useSelector((state: AppState) =>
        state.config.deployment.accountApp.clientID);
    const accountAppImpersonateRoleName: string = useSelector((state: AppState) =>
        state.config.deployment.accountApp.impersonationRoleName);
    const isCurrentUserAdmin: boolean = user?.roles?.some((role: RolesMemberInterface) =>
        role.display === administratorConfig.adminRoleName) ?? false;

    const {
        data: authenticatedUserProfileInfoData,
        isLoading: isAuthenticatedUserFetchRequestLoading
    } = useUserDetails(authenticatedUserProfileInfo?.id);

    const IMPERSONATION_ARTIFACTS: string = "impersonation_artifacts";
    let impersonation_artifacts: any = sessionStorage.getItem(IMPERSONATION_ARTIFACTS);

    useEffect(() => {
        if (!isAuthenticatedUserFetchRequestLoading) {
            if (authenticatedUserProfileInfoData) {
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

    useEffect(() => {
        window.addEventListener("message", handleInitImpersonateIframeMessage);

        return () => window.removeEventListener("message", handleInitImpersonateIframeMessage);
    }, []);

    useEffect(() => {

        if (idToken && subjectToken) {

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
        }
    }, [ idToken, subjectToken ]);

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

    const isLoggedInUserAuthorizedToImpersonate = (): boolean => {

        for (let index: number = 0; index < authenticatedUserRoles?.length; index++) {
            const authenticatedUserRole: RolesMemberInterface = authenticatedUserRoles[index];

            if (authenticatedUserRole.display === accountAppImpersonateRoleName) {
                return true;
            }
        }

        return false;
    };

    const isMyAccountImpersonatable = (): boolean => {

        // Load My Account Application and check
        // 1. If it has skip login consent.
        // 2. If it has disabled application.
        // 3. If it has shared with the sub org.

        return !isUserCurrentLoggedInUser && isLoggedInUserAuthorizedToImpersonate();
    };

    /**
     * This function handles impersonation of the user.
     */
    const handleUserImpersonation = async (): Promise<void> => {

        const codeVerifier: string = UserManagementUtils.generateCodeVerifier();
        const codeChallenge: string = await UserManagementUtils.getCodeChallangeForTheVerifier(codeVerifier);

        setCodeVerifier(codeVerifier);
        setCodeChallenge(codeChallenge);
        setImpersonationInProgress(true);
    };

    const resolveIframe = (): ReactElement => {

        if (impersonationInProgress && codeChallenge != undefined && codeChallenge != null) {
            return (
                <iframe
                    hidden
                    src={ "https://localhost:9001/console/resources/users/init-impersonate.html"
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
     * This function returns impersonate user action in the danger zone.
     */
    const resolveUserActions = (): ReactElement => {

        return (
            (
                !isReadOnly
                || isUserManagedByParentOrg
                || user[ SCIMConfigs.scim.systemSchema ]?.userSourceId
            ) && (
                !isCurrentUserAdmin
                || !isUserCurrentLoggedInUser
            ) && isLoggedInUserAuthorizedToImpersonate() && isFeatureEnabled(userFeatureConfig, "IMPERSONATE_USER") ?
                (
                    <React.Fragment>
                        <DangerZoneGroup
                            className="action-zone"
                        >
                            {
                                !isUserManagedByParentOrg && (
                                    <DangerZone
                                        data-componentid={ `${ componentId }-danger-zone-toggle` }
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
                                        isButtonDisabled={ !isMyAccountImpersonatable() }
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
