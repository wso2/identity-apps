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
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
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
import useConsoleRoles from "../../hooks/use-console-roles";

/**
 * Props interface of {@link ConsoleSharedAccess}
 */
type ConsoleRolesShareWithAllPropsInterface = IdentifiableComponentInterface;

/**
 *
 * @param props - Props injected to the component.
 * @returns Console roles share with all component.
 */
const ConsoleRolesShareWithAll: FunctionComponent<ConsoleRolesShareWithAllPropsInterface> = (
    props: ConsoleRolesShareWithAllPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "console-roles-share-with-all"
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
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ isSearching, setIsSearching ] = useState<boolean>(false);

    const {
        consoleRoles,
        consoleRolesFetchRequestError,
        isConsoleRolesFetchRequestLoading
    } = useConsoleRoles(
        true,
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        null,
        searchQuery
    );

    const isSelectNoneDisabled: boolean = useMemo((): boolean => {
        return selectedRoles.length === 0;
    }, [ selectedRoles ]);

    const isSelectAllDisabled: boolean = useMemo((): boolean => {
        return consoleRoles?.Resources?.length === 0 || selectedRoles.length === consoleRoles?.Resources?.length;
    }, [ consoleRoles?.Resources, selectedRoles ]);


    /**
     * The following useEffect is used to handle if any error occurs while fetching the roles list.
     */
    useEffect(() => {
        if (consoleRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("roles:notifications.fetchRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.fetchRoles.genericError.message")
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
                    <Text className="mb-0" muted subHeading size={ 12 }>
                        <Button
                            variant="text"
                            size="small"
                            tabIndex={ 6 }
                            disabled={ isSelectAllDisabled }
                            onClick={ () => setSelectedRoles(consoleRoles?.Resources ?? []) }
                        >
                            {
                                t("extensions:develop.applications.edit." +
                                "sections.apiAuthorization.sections." +
                                "apiSubscriptions.scopesSection.selectAll" )
                            }
                        </Button>
                        |
                        <Button
                            variant="text"
                            size="small"
                            tabIndex={ 7 }
                            disabled={ isSelectNoneDisabled }
                            onClick={ () => setSelectedRoles([]) }
                        >
                            {
                                t("extensions:develop.applications.edit." +
                                "sections.apiAuthorization.sections." +
                                "apiSubscriptions.scopesSection." +
                                "selectNone" )
                            }
                        </Button>
                    </Text>
                )
            }
            <Autocomplete
                fullWidth
                multiple
                data-componentid={ `${componentId}-autocomplete` }
                loading={ isConsoleRolesFetchRequestLoading || isSearching }
                placeholder={ t("consoleSettings:sharedAccess.modes.shareWithSelectedPlaceholder") }
                options={ consoleRoles?.Resources ?? [] }
                value={ selectedRoles }
                onChange={ (event: SyntheticEvent, value: RolesInterface[]) => {
                    handleRolesOnChange(value);
                } }
                disabled={ isReadOnly }
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
                        placeholder="Type to search for roles"
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
                ) => value.map((option: RolesInterface, index: number) => (
                    <Chip
                        { ...getTagProps({ index }) }
                        key={ index }
                        label={ option.displayName }
                        variant={
                            selectedRoles?.find(
                                (claim: RolesInterface) => claim.id === option.id
                            )
                                ? "filled"
                                : "outlined"
                        }
                    />
                )) }
            />
        </>
    );
};

export default ConsoleRolesShareWithAll;
