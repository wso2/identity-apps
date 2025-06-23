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
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Text } from "@wso2is/react-components";
import debounce from "lodash-es/debounce";
import React, {
    ChangeEvent,
    FunctionComponent,
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
import { DropdownProps } from "semantic-ui-react";
import { ConsoleRolesOnboardingConstants } from "../../constants/console-roles-onboarding-constants";
import useConsoleRoles from "../../hooks/use-console-roles";
import "./console-roles-share-with-all.scss";

/**
 * Props interface for the ConsoleRolesShareWithAll component.
 */
interface ConsoleRolesShareWithAllPropsInterface extends IdentifiableComponentInterface {
    selectedRoles: RolesInterface[];
    setSelectedRoles: (roles: RolesInterface[]) => void;
    administratorRole: RolesInterface
}

/**
 *
 * @param props - Props injected to the component.
 * @returns Console roles share with all component.
 */
const ConsoleRolesShareWithAll: FunctionComponent<ConsoleRolesShareWithAllPropsInterface> = (
    props: ConsoleRolesShareWithAllPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "console-roles-share-with-all",
        administratorRole,
        selectedRoles,
        setSelectedRoles
    } = props;

    const applicationsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const isReadOnly: boolean = !(useRequiredScopes(applicationsFeatureConfig?.scopes?.update));

    /**
     * This is a debounced function to handle the roles search.
     */
    const debouncedSearch: (value: string) => void = useCallback(
        debounce((value: string) => {
            const query: string = value ? `displayName co "${value}"` : undefined;

            setSearchQuery(query);
            setIsSearching(false);
        }, 1000),
        []
    );

    const [ searchQuery, setSearchQuery ] = useState<string>(undefined);
    const [ isSearching, setIsSearching ] = useState<boolean>(false);

    const {
        consoleRoles,
        consoleRolesFetchRequestError,
        isConsoleRolesFetchRequestLoading
    } = useConsoleRoles(
        true,
        100,
        null,
        searchQuery
    );

    const isSelectNoneDisabled: boolean = useMemo((): boolean => {
        return selectedRoles?.length === 0;
    }, [ selectedRoles ]);

    const isSelectAllDisabled: boolean = useMemo((): boolean => {
        return consoleRoles?.Resources?.length === 0 || selectedRoles?.length === consoleRoles?.Resources?.length;
    }, [ consoleRoles?.Resources, selectedRoles ]);


    /**
     * The following useEffect is used to handle if any error occurs while fetching the roles list.
     */
    useEffect(() => {
        if (consoleRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: consoleRolesFetchRequestError ?? t("roles:notifications.fetchRoles.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.fetchRoles.error.message")
                })
            );
        }
    }, [ consoleRolesFetchRequestError ]);

    const handleRolesOnChange = (value: RolesInterface[]): void => {
        setSelectedRoles(value);
    };

    return (
        <>
            {
                !isReadOnly && (
                    <Text
                        className="mb-0"
                        subHeading
                        size={ 12 }
                        muted
                    >
                        <Button
                            variant="text"
                            size="small"
                            tabIndex={ 6 }
                            disabled={ isSelectAllDisabled }
                            onClick={ () => {
                                // combine the previous selected roles with the new roles
                                const newRoles: RolesInterface[] = consoleRoles?.Resources?.filter(
                                    (role: RolesInterface) => !selectedRoles.some(
                                        (r: RolesInterface) => r.id === role.id)
                                );

                                // return the combined roles
                                setSelectedRoles([ ...selectedRoles, ...newRoles ]);
                            } }
                        >
                            {
                                t("common:selectAll" )
                            }
                        </Button>
                        |
                        <Button
                            variant="text"
                            size="small"
                            tabIndex={ 7 }
                            disabled={ isSelectNoneDisabled }
                            onClick={ () => setSelectedRoles(
                                administratorRole ? [ administratorRole ] : []
                            ) }
                        >
                            {
                                t("common:selectNone" )
                            }
                        </Button>
                    </Text>
                )
            }
            <Autocomplete
                fullWidth
                multiple
                data-componentid={ `${componentId}-autocomplete` }
                className="console-roles-share-with-all-autocomplete"
                loading={ isConsoleRolesFetchRequestLoading || isSearching }
                placeholder={ t("consoleSettings:sharedAccess.modes.shareWithSelectedPlaceholder") }
                options={ consoleRoles?.Resources ?? [] }
                value={ selectedRoles }
                onChange={ (event: SyntheticEvent, value: RolesInterface[]) => {
                    handleRolesOnChange(value);
                } }
                disableClearable={ true }
                disabled={ isReadOnly }
                getOptionDisabled={ (option: RolesInterface) => {
                    return option.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR;
                } }
                noOptionsText={ t("common:noResultsFound") }
                getOptionLabel={ (dropdownOption: DropdownProps) =>
                    dropdownOption?.displayName }
                isOptionEqualToValue={ (
                    option: RolesInterface,
                    value: RolesInterface) =>
                    option?.id === value.id
                }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        size="medium"
                        placeholder={ t("consoleSettings:sharedAccess.searchAvailableRolesPlaceholder") }
                        data-componentid={ `${componentId}-role-search-input` }
                        onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                            const value: string = event.target.value.trim();

                            setIsSearching(true);
                            debouncedSearch(value);
                        } }
                    />
                ) }
                renderTags={ (
                    value: RolesInterface[],
                    getTagProps: AutocompleteRenderGetTagProps
                ) => value.map((option: RolesInterface, index: number) => {
                    return (
                        <Chip
                            { ...getTagProps({ index }) }
                            key={ index }
                            label={ option.displayName }
                            variant={
                                selectedRoles?.find(
                                    (role: RolesInterface) => role.id === option.id
                                )
                                    ? "filled"
                                    : "outlined"
                            }
                            disabled={ option.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR }
                        />
                    );
                }
                ) }
            />
        </>
    );
};

export default ConsoleRolesShareWithAll;
