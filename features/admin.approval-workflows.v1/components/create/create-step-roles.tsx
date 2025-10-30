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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import { getRolesList } from "@wso2is/admin.roles.v2/api/roles";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleConstants } from "@wso2is/admin.roles.v2/constants/role-constants";
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
import AutoCompleteRenderOption from "./auto-complete-render-option";
import RenderChip from "./render-chip";
import { StepEditSectionsInterface } from "../../models/ui";

type StepRolesPropsInterface = IdentifiableComponentInterface & StepEditSectionsInterface;

const StepRolesList: FunctionComponent<StepRolesPropsInterface> = (
    props: StepRolesPropsInterface
): ReactElement => {
    const {
        isReadOnly,
        activeRoleType,
        onRolesChange,
        initialValues,
        showValidationError,
        ["data-componentid"]: componentId
        = "workflow-model-approval-step-roles"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ roleSearchValue, setRoleSearchValue ] = useState<string>(undefined);
    const [ roles, setRoles ] = useState<RolesInterface[]>([]);
    const [ allRoles, setAllRoles ] = useState<RolesInterface[]>([]);
    const [ activeOption, setActiveOption ] = useState<RolesInterface>(undefined);
    const [ isRoleSearchLoading, setRoleSearchLoading ] = useState<boolean>(false);
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ validationError, setValidationError ] = useState<boolean>(false);
    const [ hasInitialized, setHasInitialized ] = useState<boolean>(false);

    const filterQuery: string = (() => {
        if (roleSearchValue) {
            return `displayName co "${roleSearchValue}"`;
        } else {
            return null;
        }
    })();

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        error: rolesListError,
        mutate: mutateRolesList
    } = useGetRolesList(null, null, filterQuery, "users,groups,permissions,associatedApplications");

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
        setRoleSearchLoading(false);
    }, [ rolesList ]);

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
        fetchAllRoles();
    }, []);

    useEffect(() => {
        setValidationError(showValidationError);
    },[ showValidationError ]);

    /**
     * Pre-selects roles based on initial form values once roles are loaded.
     * Only runs on first initialization to prevent resetting manual selections.
     */
    useEffect(() => {
        if (!initialValues || !allRoles.length || hasInitialized) return;

        const stepRoles: string[] = initialValues?.roles;

        if (stepRoles?.length > 0) {
            const matchedRoles: RolesInterface[] = allRoles.filter((role: RolesInterface) =>
                stepRoles.includes(role.id)
            );

            setSelectedRoles(matchedRoles);
        }

        setHasInitialized(true);
    }, [ initialValues, allRoles ]);

    return (
        <>
            { roles && (
                <Grid
                    container
                    spacing={ 2 }
                    alignItems="flex-start"
                    className="full-width"
                    data-componentid={ `${componentId}-role-grid` }
                >
                    { !activeRoleType && (
                        <Grid
                            xs={ 12 }
                            sm={ 2 }
                            md={ 2 }
                            data-componentid={ `${componentId}-field-role-type-label` }
                        >
                            <label>{ t("approvalWorkflows:forms.configurations.template.roles.label") }</label>
                        </Grid>
                    ) }
                    <Grid
                        xs={ 12 }
                        sm={ 10 }
                        md={ activeRoleType ? 12 : 10 }
                        data-componentid={ `${componentId}-field-role-autocomplete-container` }
                    >
                        <Autocomplete
                            data-componentid={ `${componentId}-field-role-autocomplete` }
                            multiple
                            disableCloseOnSelect
                            loading={ isRolesListLoading || isRoleSearchLoading }
                            options={ roles }
                            value={ selectedRoles }
                            disabled={ isReadOnly }
                            getOptionLabel={ (role: RolesInterface) => role.displayName }
                            slotProps={ {
                                popper: {
                                    placement: "bottom-start"
                                }
                            } }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <TextField
                                    { ...params }
                                    placeholder={ "Type role/s to search and assign" }
                                    error={ validationError }
                                    data-componentid={ `${componentId}-field-role-search` }
                                />
                            ) }
                            onChange={ (event: SyntheticEvent, roles: RolesInterface[]) => {
                                setSelectedRoles(roles);
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
                                        audience={ option.audience?.type ?? undefined }
                                        option={ option }
                                        activeOption={ activeOption }
                                        setActiveOption={ setActiveOption }
                                        variant="filled"
                                        data-componentid={ `${componentId}-chip-selected-role-${option.id}` }
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
                                    audience={ option.audience?.type ?? undefined }
                                    audienceDisplay={ option.audience?.display ?? undefined }
                                    renderOptionProps={ props }
                                    data-componentid={ `${componentId}-option-role-${option.id}` }
                                />
                            ) }
                        />
                    </Grid>
                </Grid>

            ) }
        </>
    );
};

export default StepRolesList;

