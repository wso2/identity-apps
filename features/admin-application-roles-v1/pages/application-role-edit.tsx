/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, TabPageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    ReactElement, 
    useEffect, 
    useState 
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getApplicationRolesList } from "../../../extensions/components/application/api";
import {
    ApplicationRolesResponseInterface,
    RoleListItemInterface
} from "../../../extensions/components/application/models";
import { AppConstants, history } from "../../core";
import EditApplicationRoles from "../components/edit-application-role";

type ApplicationRoleEditPageProps = IdentifiableComponentInterface

const ApplicationRoleEditPage = (props: ApplicationRoleEditPageProps): ReactElement => {
    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ appId, setAppId ] = useState<string>(undefined);
    const [ isRoleDetailsRequestLoading, setIsRoleDetailsRequestLoading ] = useState<boolean>(true);
    const [ isRoleExisting, setIsRoleExisting ] = useState<boolean>(false);

    const checkRoleExists = (roleId: string): void => {
        setIsRoleDetailsRequestLoading(true);        

        getApplicationRolesList(appId, null, null, null, null)
            .then((response: ApplicationRolesResponseInterface) => {
                // check if role id exists in the response
                if (response.roles.find((role: RoleListItemInterface) => role.name === roleId)) {
                    setIsRoleExisting(true);
                } else {
                    setIsRoleExisting(false);
                }
            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? 
                            error?.response?.data?.detail ?? 
                            t("extensions:develop.applications.edit.sections.roles.notifications." + 
                                "fetchApplicationRoles.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message ?? 
                            t("extensions:develop.applications.edit.sections.roles.notifications." + 
                                "fetchApplicationRoles.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "fetchApplicationRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "fetchApplicationRoles.genericError.message")
                }));
            })
            .finally(() => {
                setIsRoleDetailsRequestLoading(false);
            });
    };

    /**
     * Get Role data from URL id
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];
        const appId: string = path[ path.length - 2 ];
        
        setRoleId(roleId);
        setAppId(appId);
    }, []);

    useEffect(() => {
        if (!roleId || !appId) {
    
            return;
        }

        checkRoleExists(roleId);
    }, [ roleId, appId ]);

    const handleBackButtonClick = () => {
        if(isSubOrg) {
            history.push(AppConstants.getPaths().get("APPLICATION_ROLES_SUB"));
        } else {
            history.push(AppConstants.getPaths().get("APPLICATION_ROLES"));
        }
    };

    return (
        <TabPageLayout
            pageTitle="Edit Role"
            title={ (
                <span>{ roleId }</span>
            ) }
            contentTopMargin={ true }
            description={ null }
            image={ (
                <AnimatedAvatar
                    name={ roleId }
                    size="tiny"
                    floated="left"
                />

            ) }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            isLoading={ isRoleDetailsRequestLoading }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("pages:rolesEdit.backButton", { type: "application roles" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            pageHeaderMaxWidth={ true }
            data-testid={ `${ componentId }-page-layout` }
            truncateContent={ true }
        >
            {
                isRoleExisting
                    ? (
                        <EditApplicationRoles
                            appId={ appId }
                            roleId={ roleId }
                        />
                    ) 
                    : null
            }
        </TabPageLayout>
    );
};

ApplicationRoleEditPage.DefaultProps = {
    "data-componentid": "application-role-edit-page"
};

export default ApplicationRoleEditPage;
