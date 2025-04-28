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
import { useMyAccountApplicationData } from "../../admin.applications.v1/api/application";
import { useGetApplication } from "../../admin.applications.v1/api/use-get-application";
import { ApplicationListItemInterface } from "../../admin.applications.v1/models/application";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";

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

    const [ impersonationInProgress, setImpersonationInProgress ] = useState<boolean>(false);
    const [ codeVerifier, setCodeVerifier ] = useState<string>(undefined);
    const [ codeChallenge, setCodeChallenge ] = useState<string>(undefined);
    const [ idToken, setIdToken ] = useState(undefined);
    const [ subjectToken, setSubjectToken ] = useState(undefined);
    const [ authenticatedUserRoles, setAuthenticatedUserRoles ] = useState<RolesMemberInterface[]>([]);
    const [ myAccountAppId, setMyAccountAppId ] = useState<string>(null);
    const [ isMyAccountEnabled, setMyAccountStatus ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);

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
    const accountAppImpersonateRoleName: string = useSelector((state: AppState) =>
        state.config.deployment.accountApp.impersonationRoleName);

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
    } = useUserDetails(authenticatedUserProfileInfo?.id);

    const isSubOrgUser: boolean = (organizationType === OrganizationType.SUBORGANIZATION);
    const isCurrentUserAdmin: boolean = user?.roles?.some((role: RolesMemberInterface) =>
        role.display === administratorConfig.adminRoleName) ?? false;
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

    useEffect(() => {
        window.addEventListener("message", handleInitImpersonateIframeMessage);

        return () => window.removeEventListener("message", handleInitImpersonateIframeMessage);
    }, []);

    useEffect(() => {
        if (idToken && subjectToken) {
            sendTokenRequest(idToken, subjectToken);
        }
    }, [ idToken, subjectToken ]);

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
        let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

        if (!isMyAccountApplicationGetRequestLoading
                && !isMyAccountApplicationDataFetchRequestLoading
        ) {
            if (myAccountApplication) {
                status = myAccountApplication?.applicationEnabled;
            }
        }

        setMyAccountStatus(status);
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

            if (authenticatedUserRole.display === accountAppImpersonateRoleName) {
                return true;
            }
        }

        return false;
    };

    /**
     * This function returns if the impersonation action is enabled for the current user.
     *  1. My Account is enabled.
     *  2. The user is not the current logged in user.
     *  3. The user is not a sub organization user.
     *  4. The user is authorized to impersonate.
     */
    const isMyAccountImpersonatable = (): boolean => {

        return isMyAccountEnabled && !isUserCurrentLoggedInUser && !isSubOrgUser
            && isLoggedInUserAuthorizedToImpersonate();
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

    /**
     * This function resolves the iframe for the impersonation.
     */
    const resolveIframe = (): ReactElement => {

        if (impersonationInProgress && codeChallenge != undefined && codeChallenge != null) {
            return (
                <iframe
                    hidden
                    src={ `${consoleUrl}/resources/users/init-impersonate.html`
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
            !isUserCurrentLoggedInUser && !isSubOrgUser && isFeatureEnabled(userFeatureConfig, "IMPERSONATE_USER") ?
                (
                    <React.Fragment>
                        <DangerZoneGroup
                            className="action-zone"
                        >
                            {
                                !isUserManagedByParentOrg && (
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
