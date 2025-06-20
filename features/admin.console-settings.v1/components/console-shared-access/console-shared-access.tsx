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

import Button from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { useRequiredScopes } from "@wso2is/access-control";
import { shareApplicationWithAllOrganizations } from "@wso2is/admin.applications.v1/api/application-roles";
import { ShareApplicationWithAllOrganizationsDataInterface } from "@wso2is/admin.applications.v1/models/application";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Text } from "@wso2is/react-components";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import ConsoleRolesSelectiveShare from "./console-roles-selective-share";
import ConsoleRolesShareWithAll from "./console-roles-share-with-all";
import useConsoleSettings from "../../hooks/use-console-settings";
import { ApplicationSharingPolicy, RoleSharedAccessModes } from "../../models/shared-access";

/**
 * Props interface of {@link ConsoleSharedAccess}
 */
type ConsoleSharedAccessPropsInterface = IdentifiableComponentInterface;

/**
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleSharedAccess: FunctionComponent<ConsoleSharedAccessPropsInterface> = (
    props: ConsoleSharedAccessPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "console-shared-access"
    } = props;

    const applicationsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const isReadOnly: boolean = !(useRequiredScopes(applicationsFeatureConfig?.scopes?.update));

    const [ sharedAccessMode, setSharedAccessMode ] = useState<RoleSharedAccessModes>(
        RoleSharedAccessModes.SHARE_ALL_ROLES_WITH_ALL_ORGS);
    const [ isManageSharingModalOpen, setIsManageSharingModalOpen ] = useState<boolean>(false);

    const { consoleId } = useConsoleSettings();

    const shareAllRolesWithAllOrgs = (): void => {
        const data: ShareApplicationWithAllOrganizationsDataInterface = {
            applicationId: consoleId,
            policy: ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: {
                mode: "ALL",
                roles: []
            }
        };

        shareApplicationWithAllOrganizations(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareAllRolesWithAllOrgs.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consoleSettings:sharedAccess.notifications.shareAllRolesWithAllOrgs.success.message")
                }));
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareAllRolesWithAllOrgs.error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.shareAllRolesWithAllOrgs.error.message")
                }));
            }
            );
    };

    const submitSharedRoles = () : void => {
        if (sharedAccessMode === RoleSharedAccessModes.SHARE_ALL_ROLES_WITH_ALL_ORGS) {
            shareAllRolesWithAllOrgs();
        }

        if (sharedAccessMode === RoleSharedAccessModes.SHARE_WITH_SELECTED) {
            // Logic to update shared roles with selected organizations
        }
    };


    return (
        <>
            <EmphasizedSegment padded="very">
                <Grid container>
                    <Grid xs={ 8 }>
                        <Text className="mb-2" subHeading>
                            Select the following options to share the roles with the organizations.
                        </Text>
                        <FormControl fullWidth>
                            <RadioGroup
                                value={ sharedAccessMode }
                                onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                    setSharedAccessMode(event.target.value as RoleSharedAccessModes);
                                } }
                                data-componentid={ `${componentId}-radio-group` }
                            >
                                <FormControlLabel
                                    value={ RoleSharedAccessModes.SHARE_ALL_ROLES_WITH_ALL_ORGS }
                                    label={ t("consoleSettings:sharedAccess.modes.shareAllRolesWithAllOrgs") }
                                    control={ <Radio /> }
                                    disabled={ isReadOnly }
                                />
                                <FormControlLabel
                                    value={ RoleSharedAccessModes.SHARE_WITH_ALL_ORGS }
                                    label={ t("consoleSettings:sharedAccess.modes.shareWithAll") }
                                    control={ <Radio /> }
                                    disabled={ isReadOnly }
                                />
                                {
                                    sharedAccessMode === RoleSharedAccessModes.SHARE_WITH_ALL_ORGS && (
                                        <ConsoleRolesShareWithAll />
                                    )
                                }
                                <FormControlLabel
                                    value={ RoleSharedAccessModes.SHARE_WITH_SELECTED }
                                    label={ t("consoleSettings:sharedAccess.modes.shareWithSelected") }
                                    control={ <Radio /> }
                                    disabled={ isReadOnly }
                                />
                                {
                                    sharedAccessMode === RoleSharedAccessModes.SHARE_WITH_SELECTED && (
                                        <Grid xs={ 8 }>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={ () => setIsManageSharingModalOpen(true) }
                                                data-componentid={ `${componentId}-manage-sharing-button` }
                                            >
                                                Manage Sharing
                                            </Button>
                                            {
                                                isManageSharingModalOpen && (
                                                    <ConsoleRolesSelectiveShare
                                                        open={ isManageSharingModalOpen }
                                                        closeWizard={ () => setIsManageSharingModalOpen(false) }
                                                    />
                                                )
                                            }
                                        </Grid>
                                    )
                                }
                            </RadioGroup>
                        </FormControl>
                        <Button
                            className="mt-5"
                            data-componentid={ `${componentId}-save-button` }
                            variant="contained"
                            size="small"
                            disabled={ isReadOnly }
                            onClick={ () => submitSharedRoles() }
                        >
                            { t("common:save") }
                        </Button>
                    </Grid>
                </Grid>
            </EmphasizedSegment>
        </>
    );
};

export default ConsoleSharedAccess;
