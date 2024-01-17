/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import Grid from "@oxygen-ui/react/Grid";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Label } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../core/configs/ui";
import { AppConstants } from "../../core/constants/app-constants";
import { history } from "../../core/helpers/history";
import { useGetRoleById } from "../../roles/api/roles";
import { RoleAudienceTypes } from "../../roles/constants/role-constants";
import ConsoleRolesEdit from "../components/console-roles/console-roles-edit/console-roles-edit";
import { ConsoleSettingsTabIDs } from "../models/ui";

/**
 * Props interface of {@link ConsoleRolesEditPage}
 */
type ConsoleRolesEditPageInterface = IdentifiableComponentInterface;

/**
 * Email Domain Discovery page.
 *
 * @param props - Props injected to the component.
 * @returns Email Domain Discovery page component.
 */
const ConsoleRolesEditPage: FunctionComponent<ConsoleRolesEditPageInterface> = (
    props: ConsoleRolesEditPageInterface
): ReactElement => {
    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ currentActiveTabIndex, setCurrentActiveTabIndex ] = useState<number>(0);

    /**
     * Get Role data from URL id
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];

        setRoleId(roleId);
    }, []);

    const {
        data: roleObject,
        isLoading: isRoleDetailsRequestLoading,
        error: roleDetailsRequestError,
        mutate: mutateRoleObject
    } = useGetRoleById(roleId);

    /**
     * Handle if any error occurs while fetching the role details.
     */
    useEffect(() => {
        if(roleDetailsRequestError) {
            dispatch(addAlert<AlertInterface>({
                description: t("console:manage.features.roles.notifications.fetchRole.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.roles.notifications.fetchRole.genericError.message")
            }));
        }
    }, [ roleDetailsRequestError ]);

    /**
     * Get the placeholders.
     */
    const getPlaceholders = (): ReactElement => {
        if (roleDetailsRequestError) {
            return (
                <EmptyPlaceholder
                    subtitle={ [ t("console:manage.features.roles.edit.placeholders.errorPlaceHolder.subtitles.0"),
                        t("console:manage.features.roles.edit.placeholders.errorPlaceHolder.subtitles.1") ] }
                    title={ t("console:manage.features.roles.edit.placeholders.errorPlaceHolder.title") }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={ (
                        <Button onClick={ handleBackButtonClick }>
                            { t("console:manage.features.roles.edit.placeholders.errorPlaceHolder.action") }
                        </Button>
                    ) }
                    imageSize="tiny"
                />
            );
        }
    };

    /**
     * Callback to when the role is updated.
     *
     * @param activeTabIndex - Active tab index.
     */
    const onRoleUpdate = (activeTabIndex: number): void => {
        mutateRoleObject();
        setCurrentActiveTabIndex(activeTabIndex);
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("CONSOLE_SETTINGS")
            + `#tab=${ ConsoleSettingsTabIDs.ROLES }`);
    };

    if (roleDetailsRequestError) {
        return getPlaceholders();
    }

    return (
        <TabPageLayout
            data-componentid={ componentId }
            isLoading={ isRoleDetailsRequestLoading }
            title={
                roleObject && roleObject?.displayName
                    ? roleObject?.displayName
                    : t("console:manage.pages.rolesEdit.title")
            }
            description={ (
                <Grid container alignItems="center">
                    <Grid>
                        {
                            RoleAudienceTypes.ORGANIZATION === roleObject?.audience?.type.toUpperCase()
                                ? t("console:manage.features.roles.list.columns.managedByOrg.label")
                                : t("console:manage.features.roles.list.columns.managedByApp.label")
                        }
                    </Grid>
                    <Grid>
                        <Label
                            className = {
                                RoleAudienceTypes.ORGANIZATION === roleObject?.audience?.type.toUpperCase()
                                    ? "issuer-label"
                                    : "client-id-label"
                            }
                        >
                            { roleObject?.audience?.display }
                        </Label>
                    </Grid>
                </Grid>
            ) }
            pageTitle={ t("console:manage.pages.rolesEdit.title") }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.rolesEdit.backButton", { type: "roles" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <ConsoleRolesEdit
                isLoading={ isRoleDetailsRequestLoading }
                roleObject={ roleObject }
                onRoleUpdate={ onRoleUpdate }
                defaultActiveIndex={ currentActiveTabIndex }
            />
        </TabPageLayout>
    );
};

ConsoleRolesEditPage.defaultProps = {
    "data-componentid": "console-roles-edit-page"
};

export default ConsoleRolesEditPage;
