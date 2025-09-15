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
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store/index";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Label } from "semantic-ui-react";
import { useGetRoleById } from "../api";
import { EditRole } from "../components/edit-role/edit-role";
import { RoleAudienceTypes } from "../constants/role-constants";
import { useGetRoleByIdV3 } from "../hooks/use-get-role-by-id-v3";

type RoleEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const RoleEditPage: FunctionComponent<RoleEditPagePropsInterface> = (
    props: RoleEditPagePropsInterface
): ReactElement =>  {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ currentActiveTabIndex, setCurrentActiveTabIndex ] = useState<number>(0);
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );
    const {
        data: roleObjectV2,
        isLoading: isRoleDetailsRequestLoadingV2,
        error: roleDetailsRequestErrorV2,
        mutate: mutateRoleObjectV2,
        isValidating: isRoleDetailsRequestValidatingV2
    } = useGetRoleById(!userRolesV3FeatureEnabled ? roleId : null);
    const {
        data: roleObjectV3,
        isLoading: isRoleDetailsRequestLoadingV3,
        error: roleDetailsRequestErrorV3,
        mutate: mutateRoleObjectV3,
        isValidating: isRoleDetailsRequestValidatingV3
    } = useGetRoleByIdV3(userRolesV3FeatureEnabled ? roleId : null);

    const roleObject: any = useMemo(
        () => userRolesV3FeatureEnabled ? roleObjectV3 : roleObjectV2,
        [ roleObjectV2, roleObjectV3, userRolesV3FeatureEnabled ]
    );

    /**
     * Get Role data from URL id
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];

        setRoleId(roleId);
    }, []);

    /**
     * Handle if any error occurs while fetching the role details.
     */
    useEffect(() => {
        if(roleDetailsRequestErrorV2 || roleDetailsRequestErrorV3) {
            dispatch(addAlert<AlertInterface>({
                description: t("roles:notifications.fetchRole.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("roles:notifications.fetchRole.genericError.message")
            }));
        }
    }, [ roleDetailsRequestErrorV2, roleDetailsRequestErrorV3 ]);

    /**
     * Get the placeholders.
     */
    const getPlaceholders = (): ReactElement => {
        if (roleDetailsRequestErrorV2 || roleDetailsRequestErrorV3) {
            return (
                <EmptyPlaceholder
                    subtitle={ [ t("roles:edit.placeholders.errorPlaceHolder.subtitles.0"),
                        t("roles:edit.placeholders.errorPlaceHolder.subtitles.1") ] }
                    title={ t("roles:edit.placeholders.errorPlaceHolder.title") }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={ (
                        <Button onClick={ handleBackButtonClick }>
                            { t("roles:edit.placeholders.errorPlaceHolder.action") }
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
        if (userRolesV3FeatureEnabled) {
            mutateRoleObjectV3();
        } else {
            mutateRoleObjectV2();
        }
        setCurrentActiveTabIndex(activeTabIndex);
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("ROLES"));
    };

    return (
        (roleDetailsRequestErrorV2 || roleDetailsRequestErrorV3)
            ? getPlaceholders()
            : (
                <TabPageLayout
                    data-componentid={ componentId }
                    isLoading={ isRoleDetailsRequestLoadingV2 || isRoleDetailsRequestLoadingV3 }
                    title={
                        roleObject && roleObject?.displayName
                            ? roleObject?.displayName
                            : t("pages:rolesEdit.title")
                    }
                    description={ (
                        <Grid container alignItems="center">
                            <Grid>
                                {
                                    RoleAudienceTypes.ORGANIZATION === roleObject?.audience?.type.toUpperCase()
                                        ? t("roles:list.columns.managedByOrg.label")
                                        : t("roles:list.columns.managedByApp.label")
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
                    pageTitle={ t("pages:rolesEdit.title") }
                    backButton={ {
                        onClick: handleBackButtonClick,
                        text: t("pages:rolesEdit.backButton", { type: "roles" })
                    } }
                    titleTextAlign="left"
                    bottomMargin={ false }
                >
                    <EditRole
                        isLoading={ isRoleDetailsRequestLoadingV2 || isRoleDetailsRequestValidatingV2
                            || isRoleDetailsRequestLoadingV3 || isRoleDetailsRequestValidatingV3 }
                        roleObject={ roleObject }
                        onRoleUpdate={ onRoleUpdate }
                        featureConfig={ featureConfig }
                        defaultActiveIndex={ currentActiveTabIndex }
                    />
                </TabPageLayout>
            )
    );
};

/**
 * Default props for the component.
 */
RoleEditPage.defaultProps = {
    "data-componentid": "role-mgt-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RoleEditPage;
