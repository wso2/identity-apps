/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";

import Grid from "@oxygen-ui/react/Grid";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { AppState } from "@wso2is/admin.core.v1/store";
import { UserStoreDropdownItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AutoCompleteRenderOption } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/auto-complete-render-option";
import { RenderChip } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/render-chip";
import { RoleConstants, Schemas } from "@wso2is/admin.roles.v2/constants";
import { StepEditSectionsInterface } from "../../models/users";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleDropdownItem } from "../../models/roles";
import { getRolesList } from "@wso2is/admin.roles.v2/api";
// import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";

type StepRolesPropsInterface = IdentifiableComponentInterface & StepEditSectionsInterface;

export const StepRolesList: FunctionComponent<StepRolesPropsInterface> = (
    props: StepRolesPropsInterface
): ReactElement => {
    const { isReadOnly, activeRoleType, onRolesChange, initialValues } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [roleSearchValue, setRoleSearchValue] = useState<string>(undefined);
    const [roles, setRoles] = useState<RolesInterface[]>([]);
    const [allRoles, setAllRoles] = useState<RolesInterface[]>([]);
    const [activeOption, setActiveOption] = useState<RolesInterface>(undefined);
    const [selectedRoleType, setSelectedRoleType] = useState<string>("ORGANIZATION");
    const [selectedRolesFromRoleType, setSelectedRolesFromRoleType] = useState<RolesInterface[]>([]);
    const [isRoleSearchLoading, setRoleSearchLoading] = useState<boolean>(false);
    const [selectedAllRoles, setSelectedAllRoles] = useState<Record<string, RolesInterface[]>>({});
    const [selectedRoles, setSelectedRoles] = useState<RolesInterface[]>([]);

    const filterQuery = selectedRoleType
    ? `audience.type eq ${selectedRoleType}` 
    : "";

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        error: rolesListError,
        mutate: mutateRolesList
    } = useGetRolesList(50, 0, filterQuery, "users,groups,permissions,associatedApplications");



    /**
     * Filter options for the roles list.
     */
    const filterOptions: RoleDropdownItem[] = [
        {
            key: RoleConstants.ROLE_AUDIENCE_APPLICATION_FILTER,
            text: "Application",
            value: "Application"
        },
        {
            key: RoleConstants.ROLE_AUDIENCE_ORGANIZATION_FILTER,
            text: "Organization",
            value: "Organization"
        }
    ];

    const filteredRoles = useMemo(() => {
        if (!roleSearchValue) return roles; // Show all roles if no search term
        // console.log("Search Value: ", roleSearchValue)
        console.log("Filtered roles: ", roles.filter(role => role.displayName.toLowerCase().includes(roleSearchValue.toLowerCase())))

        return roles.filter(role => role.displayName.toLowerCase().includes(roleSearchValue.toLowerCase()));
    }, [roleSearchValue, roles]);

    useEffect(() => {
        if (rolesList?.Resources) {
            const filteredRoles = rolesList?.Resources?.filter((role: RolesInterface) =>
                role.displayName !== "system" &&
                role.displayName !== "everyone" &&
                role.displayName !== "selfsignup"
            );
            setRoles(filteredRoles);
        } else {
            setRoles([]);
        }
        // setRoles(rolesList?.Resources);
        // // console.log("Filtered role: ", roles);
    }, [rolesList]);

    useEffect(() => {
        // console.log("Selected Role Type:", selectedRoleType);
    }, [selectedRoleType]);

    useEffect(() => {
        console.log("Selected Roles Updated", selectedRoles);
    }, [selectedRoles]);
  
    

    const updateSelectedAllRoles = () => {
        if (Array.isArray(selectedRolesFromRoleType)) {
            const tempSelectedRoles: Record<string, RolesInterface[]> = selectedAllRoles;
            tempSelectedRoles[selectedRoleType] = selectedRolesFromRoleType;
            setSelectedAllRoles(tempSelectedRoles);
            console.log("Selected All roles", selectedAllRoles);
        }
    };

    /**
     * Handles the search query for the users list.
     */
    const searchRoles: DebouncedFunc<(query: string) => void> = useCallback(
        debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setRoleSearchValue(query);
        }, RoleConstants.DEBOUNCE_TIMEOUT),
        []
    );

    /**
     * Show error if user list fetch request failed
     */
    useEffect(() => {
        if ( rolesListError ) {
            dispatch(
                addAlert({
                    description: t("roles:edit.users.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:edit.users.notifications.fetchError.message")
                })
            );
        }
    }, [ rolesListError ]);

    useEffect(() => {
        onRolesChange(selectedRoles);
    },[selectedRoles, onRolesChange])

    const fetchAllRoles = async () => {
        try {
            const response = await getRolesList(null);
    
            const filteredRoles = response?.data?.Resources?.filter((role: RolesInterface) =>
                role.displayName !== "system" &&
                role.displayName !== "everyone" &&
                role.displayName !== "selfsignup"
            );
    
            setAllRoles(filteredRoles);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };
    
    useEffect(() => {
        fetchAllRoles(); // Only fetch once
    }, []);
    
    useEffect(() => {
        if (!initialValues || !allRoles.length) return;
    
        const stepRoles = initialValues?.roles;
        console.log("Initial Roles in this step are ", stepRoles);
        const matchedRoles = allRoles.filter((role: RolesInterface) =>
            stepRoles.includes(role.displayName)
        );
        setSelectedRoles(matchedRoles);
    }, [initialValues, allRoles]); // <-- wait for both
    

    // useEffect(() => {
    //     if (rolesList?.Resources) {
    //         setRoles(rolesList.Resources);
    
    //         const stepRoles = initialValues?.roles;
    //         console.log("Initial Values in this step", initialValues);
    
    //         if (Array.isArray(stepRoles)) {
    //             const matchedRoles = rolesList.Resources.filter((role: RolesInterface) =>
    //                 stepRoles.includes(role.displayName)
    //             );
    
    //             // Group matched roles by role type
    //             const groupedRoles: Record<string, RolesInterface[]> = matchedRoles.reduce((acc, role) => {
    //                 const roleType = role.audience?.type ?? "UNKNOWN";
    //                 if (!acc[roleType]) {
    //                     acc[roleType] = [];
    //                 }
    //                 acc[roleType].push(role);
    //                 return acc;
    //             }, {});
    
    //             setSelectedAllRoles(groupedRoles);
    //             console.log("Selected grouped Roles", selectedAllRoles);
    
    //             // Set the current view’s roles (e.g., ORGANIZATION roles)
    //             setSelectedRolesFromRoleType(groupedRoles[selectedRoleType] || []);
    //             setSelectedRoles(matchedRoles);
    //             console.log("Initially selected roles:", selectedRoles);
    //         }
    //     } else {
    //         setRoles([]);
    //     }
    // }, [rolesList, initialValues, selectedRoleType]);
    
    

    return (
        <>
            {roles && !isReadOnly && (
                <Grid container spacing={1} alignItems="center" className="full-width">
                    {!activeRoleType && (
                        <>
                            <Grid md={2}>
                                <label>Roles</label>
                            </Grid>
                            <Grid xs={12} sm={4} md={3} alignItems="center">
                                <Select
                                    value={selectedRoleType}
                                    onChange={(e: SelectChangeEvent<unknown>) => {
                                        updateSelectedAllRoles();
                                        setSelectedRolesFromRoleType([]);
                                        console.log("Selected Value", e.target.value as string);
                                        setSelectedRoleType(e.target.value as string);
                                    }}
                                    fullWidth
                                    sx={{ height: 38 }}
                                >
                                    {isRolesListLoading ? (
                                        <p>{t("common:loading")}</p>
                                    ) : (
                                        filterOptions?.map((roleType: RoleDropdownItem) => (
                                            <MenuItem key={roleType.key} value={roleType.value}>
                                                {roleType.text}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </Grid>
                        </>
                    )}
                    <Grid xs={12} sm={4} md={7}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            loading={isRolesListLoading || isRoleSearchLoading}
                            options={roles}
                            value={selectedRoles}
                            getOptionLabel={(role: RolesInterface) => role.displayName}
                            renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField {...params} placeholder={"Type role/s to search and assign"} />
                            )}
                            onChange={(event: SyntheticEvent, roles: RolesInterface[]) => {
                                // Handle role selection changes
                                setSelectedRolesFromRoleType(roles);
                                setSelectedRoles(prevRoles => {
                                    // Create a copy of the previous roles to preserve the previous selections
                                    const updatedRoles = [...prevRoles];

                                    // Add new roles that are not already in the updatedRoles
                                    roles.forEach(role => {
                                        if (!updatedRoles.some(r => r.id === role.id)) {
                                            updatedRoles.push(role);
                                        }
                                    });

                                    // Remove roles that are no longer selected (deselected)
                                    prevRoles.forEach(role => {
                                        if (!roles.some(r => r.id === role.id)) {
                                            // This role has been deselected, so remove it
                                            const indexToRemove = updatedRoles.findIndex(r => r.id === role.id);
                                            if (indexToRemove !== -1) {
                                                updatedRoles.splice(indexToRemove, 1);
                                            }
                                        }
                                    });

                                    return updatedRoles;
                                });
                            }}
                            filterOptions={(roles: RolesInterface[]) => roles}
                            onInputChange={(_event: SyntheticEvent, searchTerm: string) => {
                                setRoleSearchLoading(true);
                                searchRoles(searchTerm);
                            }}
                            isOptionEqualToValue={(option: RolesInterface, value: RolesInterface) =>
                                option.id === value.id
                            }
                            renderTags={(value: RolesInterface[], getTagProps: AutocompleteRenderGetTagProps) =>
                                value.map((option: RolesInterface, index: number) => (
                                    <RenderChip
                                        {...getTagProps({ index })}
                                        key={index}
                                        primaryText={option.displayName}
                                        userStore={option.audience.type}
                                        option={option}
                                        activeOption={activeOption}
                                        setActiveOption={setActiveOption}
                                        variant="filled"
                                    />
                                ))
                            }
                            renderOption={(
                                props: HTMLAttributes<HTMLLIElement>,
                                option: RolesInterface,
                                { selected }: { selected: boolean }
                            ) => (
                                <AutoCompleteRenderOption
                                    selected={selected}
                                    // subTitle={ option.audience.display }
                                    displayName={option.displayName}
                                    userstore={option.audience.type}
                                    renderOptionProps={props}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
StepRolesList.defaultProps = {
    "data-componentid": "create-step-users"
};
