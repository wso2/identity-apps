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

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";

import Grid from "@oxygen-ui/react/Grid";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { getRolesList } from "@wso2is/admin.roles.v2/api";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleConstants } from "@wso2is/admin.roles.v2/constants";
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
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AutoCompleteRenderOption } from
    "./auto-complete-render-option";
import { RenderChip } from "./render-chip";
import { RoleDropdownItem } from "../../models/roles";
import { StepEditSectionsInterface } from "../../models/users";

type StepRolesPropsInterface = IdentifiableComponentInterface & StepEditSectionsInterface;

export const StepRolesList: FunctionComponent<StepRolesPropsInterface> = (
    props: StepRolesPropsInterface
): ReactElement => {
    const {
        isReadOnly,
        activeRoleType,
        onRolesChange,
        initialValues,
        showValidationError,
        ["data-componentid"]: testId
        = "workflow-model-approval-step-roles"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ roleSearchValue, setRoleSearchValue ] = useState<string>(undefined);
    const [ roles, setRoles ] = useState<RolesInterface[]>([]);
    const [ allRoles, setAllRoles ] = useState<RolesInterface[]>([]);
    const [ activeOption, setActiveOption ] = useState<RolesInterface>(undefined);
    const [ selectedRoleType, setSelectedRoleType ] = useState<string>("Organization");
    const [ selectedRolesFromRoleType, setSelectedRolesFromRoleType ] = useState<RolesInterface[]>([]);
    const [ isRoleSearchLoading, setRoleSearchLoading ] = useState<boolean>(false);
    const [ selectedAllRoles, setSelectedAllRoles ] = useState<Record<string, RolesInterface[]>>({});
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ validationError, setValidationError ] = useState<boolean>(false);

    const filterQuery: string = (() => {
        if (selectedRoleType && roleSearchValue) {
            return `audience.type eq "${selectedRoleType}" and displayName co "${roleSearchValue}"`;
        } else if (selectedRoleType) {
            return `audience.type eq "${selectedRoleType}"`;
        } else if (roleSearchValue) {
            return `displayName co "${roleSearchValue}"`;
        } else {
            return "";
        }
    })();

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        error: rolesListError,
        mutate: mutateRolesList
    } = useGetRolesList(null, null, filterQuery, "users,groups,permissions,associatedApplications");

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

    /**
     * Filters and sets available roles whenever the roles list updates.
     */
    useEffect(() => {
        if (rolesList?.Resources) {
            const filteredRoles: RolesInterface[] = rolesList?.Resources?.filter((role: RolesInterface) =>
                role.displayName !== "system" &&
                role.displayName !== "everyone" &&
                role.displayName !== "selfsignup"
            );

            setRoles(filteredRoles);
        } else {
            setRoles([]);
        }

    }, [ rolesList ]);

    /**
     * Updates the selected roles mapped to the current role type.
     */
    const updateSelectedAllRoles = () => {
        if (Array.isArray(selectedRolesFromRoleType)) {
            const tempSelectedRoles: Record<string, RolesInterface[]> = selectedAllRoles;

            tempSelectedRoles[selectedRoleType] = selectedRolesFromRoleType;
            setSelectedAllRoles(tempSelectedRoles);
        }
    };

    /**
     * Handles the search query for the users list.
     */
    const searchRoles: DebouncedFunc<(query: string) => void> = useCallback(
        debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setRoleSearchValue(query);
            mutateRolesList();
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

    /**
     * Notifies parent component when selected roles change.
     */
    useEffect(() => {
        onRolesChange(selectedRoles);
    },[ selectedRoles, onRolesChange ]);

    /**
     * Fetches all roles and filters out system-specific roles.
     */
    const fetchAllRoles = async () => {
        try {
            const response: any = await getRolesList(null);

            const filteredRoles: any = response?.data?.Resources?.filter((role: RolesInterface) =>
                role.displayName !== "system" &&
                role.displayName !== "everyone" &&
                role.displayName !== "selfsignup"
            );

            setAllRoles(filteredRoles);
        } catch (error) {
            dispatch(addAlert({
                description: t("roles:notifications.fetchRoles." +
                    "genericError.description"),
                level: AlertLevels.ERROR,
                message: t("roles:notifications.fetchRoles.genericError.message")
            }));
        }
    };

    useEffect(() => {
        fetchAllRoles(); // Only fetch once
    }, []);

    useEffect(() => {
        setValidationError(showValidationError);
    },[ showValidationError ]);

    /**
     * Pre-selects roles based on initial form values once roles are loaded.
     */
    useEffect(() => {
        if (!initialValues || !allRoles.length) return;

        const stepRoles: string[] = initialValues?.roles;

        const matchedRoles: RolesInterface[] = allRoles.filter((role: RolesInterface) =>
            stepRoles.includes(role.id)
        );

        setSelectedRoles(matchedRoles);
    }, [ initialValues, allRoles ]);

    return (
        <>
            { roles && !isReadOnly && (
                <Grid
                    container
                    spacing={ 1 }
                    alignItems="center"
                    className="full-width"
                    data-componentid={ `${testId}-role-grid` }
                >
                    { !activeRoleType && (
                        <>
                            <Grid
                                md={ 1.5 }
                                data-componentid={ `${testId}-field-role-type-label` }
                            >
                                <label>{ t("approvalWorkflows:forms.configurations.template.roles.label") }</label>
                            </Grid>
                            <Grid
                                xs={ 12 }
                                sm={ 4 }
                                md={ 3.5 }
                                alignItems="center"
                                data-componentid={ `${testId}-field-role-type-select-container` }
                            >
                                <Select
                                    data-componentid={ `${testId}-dropdown-role-type` }
                                    value={ selectedRoleType }
                                    onChange={ (e: SelectChangeEvent<unknown>) => {
                                        updateSelectedAllRoles();
                                        setSelectedRolesFromRoleType([]);
                                        setSelectedRoleType(e.target.value as string);
                                    } }
                                    fullWidth
                                    sx={ { height: 38 } }
                                >
                                    { isRolesListLoading ? (
                                        <p>{ t("common:loading") }</p>
                                    ) : (
                                        filterOptions?.map((roleType: RoleDropdownItem) => (
                                            <MenuItem
                                                key={ roleType.key }
                                                value={ roleType.value }
                                                data-componentid={ `${testId}-dropdown-role-option-${roleType.key}` }
                                            >
                                                { roleType.text }
                                            </MenuItem>
                                        ))
                                    ) }
                                </Select>
                            </Grid>
                        </>
                    ) }
                    <Grid
                        xs={ 12 }
                        sm={ 6.5 }
                        md={ 7 }
                        data-componentid={ `${testId}-field-role-autocomplete-container` }
                    >
                        <Autocomplete
                            data-componentid={ `${testId}-field-role-autocomplete` }
                            multiple
                            disableCloseOnSelect
                            loading={ isRolesListLoading || isRoleSearchLoading }
                            options={ roles }
                            value={ selectedRoles }
                            getOptionLabel={ (role: RolesInterface) => role.displayName }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <TextField
                                    { ...params }
                                    placeholder={ "Type role/s to search and assign" }
                                    error={ validationError }
                                    data-componentid={ `${testId}-field-role-search` }
                                />
                            ) }
                            onChange={ (event: SyntheticEvent, roles: RolesInterface[]) => {
                                setSelectedRolesFromRoleType(roles);
                                setSelectedRoles((prevRoles: RolesInterface[]) => {
                                    const updatedRoles: RolesInterface[] = [ ...prevRoles ];

                                    roles.forEach((role: RolesInterface) => {
                                        if (!updatedRoles.some((r: RolesInterface) => (r.id === role.id))) {
                                            updatedRoles.push(role);
                                        }
                                    });
                                    prevRoles.forEach((role: RolesInterface) => {
                                        if (!roles.some((r: RolesInterface) => (r.id === role.id))) {
                                            const indexToRemove: number =
                                            updatedRoles.findIndex((r: RolesInterface) => (r.id === role.id));

                                            if (indexToRemove !== -1) {
                                                updatedRoles.splice(indexToRemove, 1);
                                            }
                                        }
                                    });

                                    return updatedRoles;
                                });
                            } }
                            filterOptions={ (roles: RolesInterface[]) => roles }
                            onInputChange={ (_event: SyntheticEvent, searchTerm: string) => {
                                setRoleSearchLoading(true);
                                searchRoles(searchTerm);
                            } }
                            isOptionEqualToValue={ (option: RolesInterface, value: RolesInterface) =>
                                option.id === value.id
                            }
                            renderTags={ (value: RolesInterface[], getTagProps: AutocompleteRenderGetTagProps) =>
                                value.map((option: RolesInterface, index: number) => (
                                    <RenderChip
                                        { ...getTagProps({ index }) }
                                        key={ index }
                                        primaryText={ option.displayName }
                                        audience={ option.audience.type }
                                        option={ option }
                                        activeOption={ activeOption }
                                        setActiveOption={ setActiveOption }
                                        variant="filled"
                                        data-componentid={ `${testId}-chip-selected-role-${option.id}` }
                                    />
                                ))
                            }
                            renderOption={ (
                                props: HTMLAttributes<HTMLLIElement>,
                                option: RolesInterface,
                                { selected }: { selected: boolean }
                            ) => (
                                <AutoCompleteRenderOption
                                    selected={ selected }
                                    displayName={ option.displayName }
                                    audience={ option.audience.type }
                                    renderOptionProps={ props }
                                    data-componentid={ `${testId}-option-role-${option.id}` }
                                />
                            ) }
                        />
                    </Grid>
                </Grid>

            ) }
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
StepRolesList.defaultProps = {
    "data-componentid": "create-step-users"
};
