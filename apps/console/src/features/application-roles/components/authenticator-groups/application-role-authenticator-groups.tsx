/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AuthenticatorGroupsList } from "./authenticator-groups-list";
import { ApplicationRolesConstants } from "../../../../extensions/components/application/constants";
import { getApplicationDetails } from "../../../applications/api";
import {
    AuthenticatorInterface as ApplicationAuthenticatorInterface,
    ApplicationInterface,
    AuthenticationStepInterface
} from "../../../applications/models";
import { AuthenticatorManagementConstants } from "../../../connections";
import { getAuthenticators } from "../../../identity-providers/api";
import { AuthenticatorInterface, AuthenticatorTypes } from "../../../identity-providers/models";

interface ApplicationRoleAuthenticatorGroupsProps extends IdentifiableComponentInterface {
    appId: string;
    roleId: string;
}

const ApplicationRoleAuthenticatorGroups = (props: ApplicationRoleAuthenticatorGroupsProps): ReactElement => {
    const {
        appId,
        roleId,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(true);
    const [ isAuthenticatorRequestLoading, setAuthenticatorRequestLoading ] = useState<boolean>(true);
    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<AuthenticatorInterface[]>([]);
    const [ authenticatorGroups, setAuthenticatorGroups ] = useState<AuthenticatorInterface[]>([]);
    const [ attributeStepAuthenticators, setAttributeStepAuthenticators ] =
        useState<ApplicationAuthenticatorInterface[]>([]);

    useEffect(() => {
        getApplication(appId);
    }, [ appId ]);

    useEffect(() => {
        getFederatedAuthenticators();
    }, []);

    useEffect(() => {
        setIsLoading(isApplicationRequestLoading || isAuthenticatorRequestLoading);
    }, [ isApplicationRequestLoading, isAuthenticatorRequestLoading ]);

    useEffect(() => {
        if(federatedAuthenticators.length <= 0 || attributeStepAuthenticators.length <= 0) {
            return;
        }

        getAutheticatorGroups();
    }, [ federatedAuthenticators, attributeStepAuthenticators ]);

    /**
     * Retrieves application details from the API.
     *
     * @param id - Application id.
     */
    const getApplication = (id: string): void => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response: ApplicationInterface) => {
                const attributeStepId: number = response?.authenticationSequence?.attributeStepId;
                const attributeStep: AuthenticationStepInterface
                = response?.authenticationSequence?.steps?.find((step: any) => {
                    return step.id === attributeStepId;
                });

                setAttributeStepAuthenticators(attributeStep?.options);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplication.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.fetchApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchApplication.genericError." +
                        "message")
                }));
            })
            .finally(() => {
                setApplicationRequestLoading(false);
            });
    };

    /**
     * Retrieves federated authenticators from the API.
     */
    const getFederatedAuthenticators = () => {
        setAuthenticatorRequestLoading(true);

        getAuthenticators(null, AuthenticatorTypes.FEDERATED)
            .then((response: AuthenticatorInterface[]) => {
                // Remove Organization Login federated authenticator from the list
                const filteredFederatedAuthenticators: AuthenticatorInterface[]
                = response.filter((authenticator: AuthenticatorInterface) => {
                    return authenticator.name !== ApplicationRolesConstants.ORGANIZATION_LOGIN;
                });

                setFederatedAuthenticators(filteredFederatedAuthenticators);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(
                        addAlert({
                            description: t(
                                "authenticationProvider:notifications" +
                                ".getIDPList.error.message",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "authenticationProvider:notifications.getIDPList.error.message"
                            )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "authenticationProvider:notifications" +
                            ".getIDPList.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "authenticationProvider:notifications" +
                            ".getIDPList.genericError.message"
                        )
                    })
                );
            }).finally(() => {
                setAuthenticatorRequestLoading(false);
            });
    };

    const getAutheticatorGroups = () => {
        // Filtering the federated autheticators that are in the attribute step
        const filteredFederatedAuthenticators: AuthenticatorInterface[]
        = federatedAuthenticators.filter((federatedAuthenticator: AuthenticatorInterface) => {
            return attributeStepAuthenticators.find((attributeStepAuthenticator: ApplicationAuthenticatorInterface) => {
                // Filtering out the SSO authenticator as well, because IdP groups cannot be created in the
                // SSO authenticator
                return federatedAuthenticator.name === attributeStepAuthenticator.idp
                    && (
                        attributeStepAuthenticator.authenticator
                            !== AuthenticatorManagementConstants.ORGANIZATION_SSO_AUTHENTICATOR_NAME
                    );
            });
        });

        setAuthenticatorGroups(filteredFederatedAuthenticators);
    };

    return (
        !isLoading
            ? (
                <AuthenticatorGroupsList
                    data-componentid={ `${ componentId }-application-list` }
                    isLoading={ isLoading }
                    groupsList={ authenticatorGroups }
                    roleId={ roleId }
                    appId={ appId }
                />
            )
            : <ContentLoader />
    );
};

export default ApplicationRoleAuthenticatorGroups;
