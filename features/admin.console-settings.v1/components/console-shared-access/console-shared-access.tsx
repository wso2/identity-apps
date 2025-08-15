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

import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { useRequiredScopes } from "@wso2is/access-control";
import {
    editApplicationRolesOfExistingOrganizations,
    shareApplicationWithAllOrganizations
} from "@wso2is/admin.applications.v1/api/application-roles";
import useGetApplicationShare from "@wso2is/admin.applications.v1/api/use-get-application-share";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import {
    RoleSharingInterface,
    ShareApplicationWithAllOrganizationsDataInterface,
    ShareOrganizationsAndRolesPatchDataInterface,
    ShareOrganizationsAndRolesPatchOperationInterface
} from "@wso2is/admin.applications.v1/models/application";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SelectedOrganizationRoleInterface } from "@wso2is/admin.organizations.v1/models";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import SelectiveOrgShareWithSelectiveRoles
    from "@wso2is/common.ui.shared-access.v1/components/selective-org-share-with-selective-roles";
import { AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment, Text } from "@wso2is/react-components";
import { AnimatePresence, motion } from "framer-motion";
import differenceBy from "lodash-es/differenceBy";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import ConsoleRolesShareWithAll from "./console-roles-share-with-all";
import { ConsoleRolesOnboardingConstants } from "../../constants/console-roles-onboarding-constants";
import useConsoleRoles from "../../hooks/use-console-roles";
import useConsoleSettings from "../../hooks/use-console-settings";
import { ApplicationSharingPolicy, RoleSharingModes } from "../../models/shared-access";

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

    const { consoleId } = useConsoleSettings();

    const isReadOnly: boolean = !(useRequiredScopes(applicationsFeatureConfig?.scopes?.update));

    const {
        consoleRoles: administratorRole,
        consoleAdminRoleFetchRequestError
    } = useConsoleRoles(
        true,
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        null,
        `displayName eq ${ ConsoleRolesOnboardingConstants.ADMINISTRATOR }`
    );

    const {
        consoleRoles,
        consoleRolesFetchRequestError
    } = useConsoleRoles(true, 100, null, null);

    const {
        data: originalOrganizationTree,
        isLoading: isOrganizationTreeFetchRequestLoading,
        isValidating: isOrganizationTreeFetchRequestValidating,
        error:  originalOrganizationTreeFetchRequestError,
        mutate: mutateOriginalOrganizationTree
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(consoleId),
        false,
        null,
        "roles",
        1,
        null,
        null,
        "sharingMode"
    );

    const [ sharedAccessMode, setSharedAccessMode ] = useState<RoleSharingModes>(
        RoleSharingModes.ALL);
    const [ initialSelectedRoles, setInitialSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ addedRoles, setAddedRoles ] = useState<Record<string, RoleSharingInterface[]>>({});
    const [ removedRoles, setRemovedRoles ] = useState<Record<string, RoleSharingInterface[]>>({});
    const [ roleSelections, setRoleSelections ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ clearAdvancedRoleSharing, setClearAdvancedRoleSharing ] = useState<boolean>(false);

    /**
     * If the Administrator role is fetched, set it as the selected role.
     */
    useEffect(() => {
        if (administratorRole?.Resources?.length > 0) {
            setSelectedRoles([ administratorRole?.Resources[0] ]);
            setInitialSelectedRoles([ administratorRole?.Resources[0] ]);
        }
    }, [ administratorRole ]);

    useEffect(() => {
        if (!originalOrganizationTree?.sharingMode) {
            setSharedAccessMode(RoleSharingModes.SELECTED);

            return;
        }

        if (originalOrganizationTree?.sharingMode?.roleSharing?.mode ===
                RoleSharingModes.ALL) {
            setSharedAccessMode(RoleSharingModes.ALL);
        }

        if (originalOrganizationTree?.sharingMode?.roleSharing?.mode ===
                RoleSharingModes.SELECTED) {
            setSharedAccessMode(RoleSharingModes.SELECTED);

            const initialRoles: RolesInterface[] =
                originalOrganizationTree?.sharingMode?.roleSharing?.roles?.map(
                    (role: RoleSharingInterface) => ({
                        audience: {
                            display: role.audience.display,
                            type: role.audience.type
                        },
                        displayName: role.displayName,
                        id: role.displayName
                    }) as RolesInterface
                );

            if (initialRoles?.length > 0) {
                const tempInitialRoles: RolesInterface[] = [ ...initialRoles ];
                // Check if the administrator role is already available in the initial roles.
                const isAdministratorRoleAvailable: boolean = tempInitialRoles.some(
                    (role: RolesInterface) =>
                        role.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR
                );

                // If the administrator role is not available,
                // add it to the initial roles in the first position.
                if (!isAdministratorRoleAvailable) {
                    tempInitialRoles.unshift(administratorRole?.Resources[0]);
                } else {
                    // If the administrator role is available, move it to the first position.
                    const administratorRoleIndex: number = tempInitialRoles.findIndex(
                        (role: RolesInterface) =>
                            role.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR
                    );

                    tempInitialRoles.splice(administratorRoleIndex, 1);
                    tempInitialRoles.unshift(administratorRole?.Resources[0]);
                }

                setSelectedRoles(tempInitialRoles);
                setInitialSelectedRoles(tempInitialRoles);
            }
        }
    }, [ originalOrganizationTree ]);

    /**
     * If the Administrator role is not fetched, show an error.
     */
    useEffect(() => {
        if (consoleRolesFetchRequestError || consoleAdminRoleFetchRequestError) {
            dispatch(addAlert({
                description: t("consoleSettings:sharedAccess.notifications.fetchRoles.error.description",
                    { error: consoleRolesFetchRequestError.message }),
                level: AlertLevels.ERROR,
                message: t("consoleSettings:sharedAccess.notifications.fetchRoles.error.message")
            }));
        }
    }, [ consoleRolesFetchRequestError, consoleAdminRoleFetchRequestError ]);

    /**
     * If the organization tree is not fetched, show an error.
     */
    useEffect(() => {
        if (originalOrganizationTreeFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.error.message")
                })
            );
        }
    }, [ originalOrganizationTreeFetchRequestError ]);

    const resetStates = (): void => {
        setAddedRoles({});
        setRemovedRoles({});
        setRoleSelections({});
        setSelectedRoles([ administratorRole?.Resources[0] ]);
        setInitialSelectedRoles([ administratorRole?.Resources[0] ]);
        mutateOriginalOrganizationTree();
        setClearAdvancedRoleSharing(false);
    };

    const shareAllRolesWithAllOrgs = (): void => {
        const data: ShareApplicationWithAllOrganizationsDataInterface = {
            applicationId: consoleId,
            policy: ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: {
                mode: RoleSharingModes.ALL,
                roles: []
            }
        };

        shareApplicationWithAllOrganizations(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
                }));
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                }));
            })
            .finally(() => {
                mutateOriginalOrganizationTree();
            });
    };

    const shareSelectedRolesWithAllOrgs = (): void => {
        const data: ShareApplicationWithAllOrganizationsDataInterface = {
            applicationId: consoleId,
            policy: ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: {
                mode: RoleSharingModes.SELECTED,
                roles: selectedRoles.map((role: RolesInterface) => {
                    return {
                        audience: {
                            display: role.audience.display ?? ApplicationManagementConstants.CONSOLE_APP_NAME,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    };
                })
            }
        };

        shareApplicationWithAllOrganizations(data)
            .then(() => {
                // Share individual roles with selected organizations. if any
                shareSelectedRolesWithSelectedOrgs();
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                }));
            })
            .finally(() => {
                mutateOriginalOrganizationTree();
            });
    };

    const shareSelectedRolesWithSelectedOrgs = (): void => {
        const addOperations: ShareOrganizationsAndRolesPatchOperationInterface[] = Object.entries(addedRoles)
            .map(([ orgId, roles ]: [string, RoleSharingInterface[]]) => {
                const roleData: RoleSharingInterface[] = roles.map(
                    (role: RoleSharingInterface) => ({
                        audience: {
                            display: role.audience.display,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    })
                );

                if (isEmpty(roleData)) {
                    return null;
                }

                return {
                    op: "add",
                    path: `organizations[orgId eq "${orgId}"].roles`,
                    value: roleData
                };
            }).filter((item: any) => item !== null);

        const removeOperations: ShareOrganizationsAndRolesPatchOperationInterface[] = Object.entries(removedRoles)
            .map(([ orgId, roles ]: [string, RoleSharingInterface[]]) => {
                const roleData: RoleSharingInterface[] = roles.map(
                    (role: RoleSharingInterface) => ({
                        audience: {
                            display: role.audience.display,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    })
                );

                if (isEmpty(roleData)) {
                    return null;
                }

                return {
                    op: "remove",
                    path: `organizations[orgId eq "${orgId}"].roles`,
                    value: roleData
                };
            }).filter((item: any) => item !== null);

        const data: ShareOrganizationsAndRolesPatchDataInterface = {
            Operations: [
                ...addOperations,
                ...removeOperations
            ],
            applicationId: consoleId
        };

        if (data?.Operations?.length > 0) {
            editApplicationRolesOfExistingOrganizations(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("consoleSettings:sharedAccess.notifications." +
                            "shareRoles.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
                    }));

                    resetStates();
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("consoleSettings:sharedAccess.notifications." +
                            "shareRoles.error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                    }));
                })
                .finally(() => {
                    mutateOriginalOrganizationTree();
                });
        } else {
            // If there are no operations to perform, just reset the states and show a success message.
            resetStates();
            dispatch(addAlert({
                description: t("consoleSettings:sharedAccess.notifications." +
                    "shareRoles.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
            }));
        }
    };

    const submitSharedRoles = () : void => {
        if (sharedAccessMode === RoleSharingModes.ALL) {
            shareAllRolesWithAllOrgs();
        } else if (sharedAccessMode === RoleSharingModes.SELECTED) {
            shareSelectedRolesWithAllOrgs();
        }
    };

    // Function to mark a specific role as selected/unselected across all organizations
    const updateRoleSelectionForAllOrganizations = (
        updatedRole: RolesV2Interface,
        isSelected: boolean
    ): void => {
        const updatedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> = { ...roleSelections };

        Object.keys(updatedRoleSelections).forEach((orgId: string) => {
            updatedRoleSelections[orgId] = updatedRoleSelections[orgId].map(
                (role: SelectedOrganizationRoleInterface) => {
                    if (role.displayName === updatedRole.displayName) {
                        return {
                            ...role,
                            selected: isSelected
                        };
                    }

                    return role;
                }
            );
        });

        setRoleSelections(updatedRoleSelections);

        if (isSelected) {
            // If the role is selected, we have to remove it from the removedRoles for all organizations
            const updatedRemovedRoles: Record<string, RoleSharingInterface[]> = { ...removedRoles };

            Object.keys(updatedRemovedRoles).forEach((orgId: string) => {
                updatedRemovedRoles[orgId] = updatedRemovedRoles[orgId].filter(
                    (role: RoleSharingInterface) => role.displayName !== updatedRole.displayName
                );
            });

            setRemovedRoles(updatedRemovedRoles);
        } else {
            // If the role is unselected, we have to remove it from the addedRoles for all organizations
            const updatedAddedRoles: Record<string, RoleSharingInterface[]> = { ...addedRoles };

            Object.keys(updatedAddedRoles).forEach((orgId: string) => {
                updatedAddedRoles[orgId] = updatedAddedRoles[orgId].filter(
                    (role: RoleSharingInterface) => role.displayName !== updatedRole.displayName
                );
            });

            setAddedRoles(updatedAddedRoles);
        }
    };

    if (isOrganizationTreeFetchRequestLoading || isOrganizationTreeFetchRequestValidating) {
        return <ContentLoader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid container>
                <Grid xl={ 8 } xs={ 12 }>
                    <Text className="mb-2" subHeading>
                        { t("consoleSettings:sharedAccess.description") }
                    </Text>
                    <FormControl fullWidth>
                        <RadioGroup
                            value={ sharedAccessMode }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                const value: RoleSharingModes = event.target.value as RoleSharingModes;

                                setSharedAccessMode(value);

                                // Clear advanced role sharing states when switching modes from ALL to SELECTED
                                if (value === RoleSharingModes.SELECTED) {
                                    setClearAdvancedRoleSharing(true);
                                    setAddedRoles({});
                                    setRemovedRoles({});
                                    setRoleSelections({});
                                    setSelectedRoles([ administratorRole?.Resources[0] ]);
                                    setInitialSelectedRoles([ administratorRole?.Resources[0] ]);
                                }

                                // Do not clear advanced role sharing states when switching modes from SELECTED to ALL
                                if (value === RoleSharingModes.ALL) {
                                    resetStates();
                                }
                            } }
                            data-componentid={ `${componentId}-radio-group` }
                        >
                            <FormControlLabel
                                value={ RoleSharingModes.ALL }
                                label={ t("consoleSettings:sharedAccess.modes.shareAllRolesWithAllOrgs") }
                                control={ <Radio /> }
                                disabled={ isReadOnly }
                                data-componentid={ `${componentId}-share-all-roles-with-all-orgs-radio-btn` }
                            />
                            <FormControlLabel
                                value={ RoleSharingModes.SELECTED }
                                label={ t("consoleSettings:sharedAccess.modes.shareWithAll") }
                                control={ <Radio /> }
                                disabled={ isReadOnly }
                                data-componentid={ `${componentId}-share-with-all-orgs-radio-btn` }
                            />
                            <AnimatePresence mode="wait">
                                {
                                    sharedAccessMode === RoleSharingModes.SELECTED
                                    && (
                                        <motion.div
                                            key="selected-orgs-block"
                                            initial={ { height: 0, opacity: 0 } }
                                            animate={ { height: "auto", opacity: 1 } }
                                            exit={ { height: 0, opacity: 0 } }
                                            transition={ { duration: 0.3 } }
                                        >
                                            <ConsoleRolesShareWithAll
                                                selectedRoles={ selectedRoles }
                                                setSelectedRoles={ setSelectedRoles }
                                                administratorRole={ administratorRole?.Resources[0] }
                                                onRoleChange={
                                                    updateRoleSelectionForAllOrganizations }
                                            />
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                            <Alert
                                severity="info"
                                className="mt-1 mb-2"
                            >
                                { t("consoleSettings:sharedAccess.sharingRolesTakeTimeMessage") }
                            </Alert>
                            <SelectiveOrgShareWithSelectiveRoles
                                applicationId={ consoleId }
                                applicationRolesList={ consoleRoles?.Resources }
                                addedRoles={ addedRoles }
                                setAddedRoles={ setAddedRoles }
                                removedRoles={ removedRoles }
                                setRemovedRoles={ setRemovedRoles }
                                roleSelections={ roleSelections }
                                setRoleSelections={ setRoleSelections }
                                disableOrgSelection={ true }
                                clearAdvancedRoleSharing={ clearAdvancedRoleSharing }
                                shareAllRoles={ false }
                                enableAdminRole={ true }
                                // Check the diff between
                                // initialSelectedRoles and selectedRoles
                                newlyAddedCommonRoles={ differenceBy(
                                    selectedRoles,
                                    initialSelectedRoles,
                                    "displayName"
                                ) }
                                newlyRemovedCommonRoles={ differenceBy(
                                    initialSelectedRoles,
                                    selectedRoles,
                                    "displayName"
                                ) }
                            />
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
    );
};

export default ConsoleSharedAccess;
