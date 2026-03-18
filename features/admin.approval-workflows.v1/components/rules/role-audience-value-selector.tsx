/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import {
    ApplicationListInterface,
    ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import useRequest from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ExpressionFieldTypes } from "@wso2is/admin.rules.v1/models/rules";
import { HttpMethods, IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce from "lodash-es/debounce";
import React, {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useGetWorkflowResources from "../../hooks/use-get-workflow-resources";

/**
 * Application option for the autocomplete dropdown.
 */
interface ApplicationOptionInterface {
    id: string;
    label: string;
    isDisabled?: boolean;
}

/**
 * Props interface of {@link RoleAudienceValueSelector}.
 */
interface RoleAudienceValueSelectorPropsInterface extends IdentifiableComponentInterface {
    conditionId: string;
    expressionId: string;
    expressionValue: string;
    filterBaseResourcesUrl: string;
    initialResourcesLoadUrl: string;
    ruleId: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    readonly?: boolean;
}

/**
 * Derives the initial audience type from the stored expression value.
 *
 * @param expressionValue - The stored expression value.
 * @param organizationId - The current organization UUID.
 * @returns The resolved audience type, or null if empty.
 */
const deriveInitialAudienceType = (
    expressionValue: string,
    organizationId: string
): RoleAudienceTypes | null => {
    if (!expressionValue) {
        return null;
    }

    if (expressionValue === organizationId) {
        return RoleAudienceTypes.ORGANIZATION;
    }

    // Both the "APPLICATION" sentinel and actual app UUIDs resolve to APPLICATION.
    return RoleAudienceTypes.APPLICATION;
};

/**
 * Custom value selector for the `role.audience` rule field.
 *
 * Renders a two-tier selection:
 * - 3rd dropdown: "Organization" or "Application"
 * - 4th dropdown (conditional): Searchable application list when "Application" is selected.
 *
 * @param props - Component props.
 * @returns The RoleAudienceValueSelector component.
 */
const RoleAudienceValueSelector: FunctionComponent<RoleAudienceValueSelectorPropsInterface> = ({
    ["data-componentid"]: componentId = "role-audience-value-selector",
    conditionId,
    expressionId,
    expressionValue,
    filterBaseResourcesUrl,
    initialResourcesLoadUrl,
    ruleId,
    setIsResourceMissing,
    readonly: isReadonly
}: RoleAudienceValueSelectorPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { updateConditionExpression } = useRulesContext();

    const organizationId: string = useSelector(
        (state: AppState) => state?.organization?.organization?.id
    );

    const [ audienceType, setAudienceType ] = useState<RoleAudienceTypes | null>(
        () => deriveInitialAudienceType(expressionValue, organizationId)
    );
    const [ inputValue, setInputValue ] = useState<string | null>(null);
    const [ inputValueLabel, setInputValueLabel ] = useState<string | null>(null);
    const [ debouncedSearchQuery, setDebouncedSearchQuery ] = useState<string>(null);
    const [ isAutocompleteOpen, setIsAutocompleteOpen ] = useState<boolean>(false);

    const MORE_ITEMS: string = "more-items";

    const shouldFetchApps: boolean = audienceType === RoleAudienceTypes.APPLICATION;

    const activeApplicationsUrl: string = debouncedSearchQuery && filterBaseResourcesUrl
        ? filterBaseResourcesUrl.replace("filter=", `filter=name+sw+${debouncedSearchQuery}`)
        : initialResourcesLoadUrl;

    const {
        data: applicationListData,
        isLoading: isApplicationListLoading
    } = useGetWorkflowResources<ApplicationListInterface>(activeApplicationsUrl, shouldFetchApps);

    const hasMoreItems: boolean =
        (applicationListData?.totalResults ?? 0) > (applicationListData?.count ?? 0);

    const setDebouncedSearchQueryDebounced: (value: string) => void = useCallback(
        debounce((value: string) => setDebouncedSearchQuery(value), 700),
        []
    );

    /**
     * Whether the current expression value is a real application ID
     * (not empty, not the "APPLICATION" sentinel, not the organization ID).
     */
    const isRealAppId: boolean =
        audienceType === RoleAudienceTypes.APPLICATION &&
        !!expressionValue &&
        expressionValue !== RoleAudienceTypes.APPLICATION &&
        expressionValue !== organizationId;

    /**
     * Validate the selected application still exists by fetching its details.
     * If the fetch fails (e.g., 404), the resource is considered missing.
     */
    const {
        data: appValidationData,
        error: appValidationError,
        isLoading: isValidatingApp
    } = useRequest<{ name: string }>(
        isRealAppId ? {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: HttpMethods.GET,
            url: `${store.getState().config.endpoints.applications}/${expressionValue}`
        } : null
    );

    /**
     * Update the resource missing state based on validation result.
     */
    useEffect(() => {
        if (!isRealAppId) {
            setIsResourceMissing(false);

            return;
        }
        if (!isValidatingApp) {
            setIsResourceMissing(!!appValidationError);
        }
    }, [ isRealAppId, isValidatingApp, appValidationError ]);

    /**
     * Filter and map applications into autocomplete options.
     * - Exclude system apps (CONSOLE, MY_ACCOUNT)
     * - Exclude fragment apps
     * - Disable organization-audience apps
     */
    const applicationOptions: ApplicationOptionInterface[] = useMemo(() => {
        if (!applicationListData?.applications) {
            return [];
        }

        return applicationListData.applications
            .filter((app: ApplicationListItemInterface) =>
                app.associatedRoles?.allowedAudience !== RoleAudienceTypes.ORGANIZATION
            )
            .map((app: ApplicationListItemInterface) => ({
                id: app.id,
                label: app.name
            }));
    }, [ applicationListData ]);

    /**
     * Resolve the selected application label when in APPLICATION mode
     * and the component mounts with an existing expression value.
     */
    useEffect(() => {
        if (isRealAppId && !inputValueLabel) {
            const matchedApp: ApplicationOptionInterface | undefined = applicationOptions.find(
                (opt: ApplicationOptionInterface) => opt.id === expressionValue
            );

            if (matchedApp) {
                setInputValue(expressionValue);
                setInputValueLabel(matchedApp.label);
            } else if (appValidationData?.name) {
                // Fallback to the validation response if the app is outside the paginated list.
                setInputValue(expressionValue);
                setInputValueLabel(appValidationData.name);
            }
        }
    }, [ applicationOptions, expressionValue, isRealAppId, appValidationData ]);

    /**
     * Handle audience type change from the first dropdown.
     */
    const handleAudienceTypeChange = (e: SelectChangeEvent): void => {
        const newAudienceType: RoleAudienceTypes = e.target.value as RoleAudienceTypes;

        setAudienceType(newAudienceType);
        setInputValue(null);
        setInputValueLabel(null);
        setDebouncedSearchQuery(null);

        if (newAudienceType === RoleAudienceTypes.ORGANIZATION) {
            updateConditionExpression(
                organizationId,
                ruleId,
                conditionId,
                expressionId,
                ExpressionFieldTypes.Value,
                true
            );
        } else {
            // Store the audience type as a sentinel so that if the component
            // remounts before an app is selected, it can recover the state.
            updateConditionExpression(
                RoleAudienceTypes.APPLICATION,
                ruleId,
                conditionId,
                expressionId,
                ExpressionFieldTypes.Value,
                true
            );
        }
    };

    const autocompleteComponentsProps: object = useMemo(() => ({
        popper: {
            modifiers: [
                {
                    enabled: true,
                    fn: ({ state }: { state: Record<string, Record<string, unknown>> }) => {
                        const popperStyles: Record<string, unknown> =
                            state.styles.popper as Record<string, unknown>;

                        popperStyles.width =
                            `${(state.rects.reference as Record<string, number>).width}px`;
                    },
                    name: "sameWidth",
                    phase: "beforeWrite",
                    requires: [ "computeStyles" ]
                },
                {
                    enabled: false,
                    name: "flip"
                },
                {
                    enabled: false,
                    name: "preventOverflow"
                }
            ],
            style: { zIndex: 9999 }
        }
    }), []);

    return (
        <Box data-componentid={ componentId }>
            { /* Audience type selector: Organization or Application */ }
            <FormControl fullWidth size="small">
                <Select
                    disabled={ isReadonly }
                    value={ audienceType ?? "" }
                    displayEmpty
                    data-componentid={ `${componentId}-audience-type-select` }
                    MenuProps={ {
                        disablePortal: false,
                        sx: { zIndex: 9999 }
                    } }
                    onChange={ handleAudienceTypeChange }
                    renderValue={ (selected: string) => {
                        if (!selected) {
                            return (
                                <Box component="span" sx={ { color: "text.disabled" } }>
                                    { t("rules:fields.autocomplete.selectPlaceholderText") }
                                </Box>
                            );
                        }

                        if (selected === RoleAudienceTypes.ORGANIZATION) {
                            return t(
                                "roles:addRoleWizard.forms.roleBasicDetails.roleAudience.values.organization"
                            );
                        }

                        return t(
                            "roles:addRoleWizard.forms.roleBasicDetails.roleAudience.values.application"
                        );
                    } }
                >
                    <MenuItem value={ RoleAudienceTypes.ORGANIZATION }>
                        { t("roles:addRoleWizard.forms.roleBasicDetails.roleAudience.values.organization") }
                    </MenuItem>
                    <MenuItem value={ RoleAudienceTypes.APPLICATION }>
                        { t("roles:addRoleWizard.forms.roleBasicDetails.roleAudience.values.application") }
                    </MenuItem>
                </Select>
            </FormControl>

            { /* Conditional application selector */ }
            { audienceType === RoleAudienceTypes.APPLICATION && (
                <FormControl fullWidth size="small" sx={ { mt: 1 } }>
                    <Autocomplete
                        className="autocomplete"
                        disabled={ isReadonly }
                        data-componentid={ `${componentId}-application-select` }
                        open={ isAutocompleteOpen }
                        onOpen={ () => setIsAutocompleteOpen(true) }
                        onClose={ () => setIsAutocompleteOpen(false) }
                        componentsProps={ autocompleteComponentsProps }
                        options={ [
                            ...applicationOptions,
                            ...(hasMoreItems
                                ? [ {
                                    id: MORE_ITEMS,
                                    isDisabled: true,
                                    label: t("rules:fields.autocomplete.moreItemsMessage")
                                } ]
                                : [])
                        ] }
                        filterOptions={ (opts: ApplicationOptionInterface[]) => opts }
                        getOptionLabel={ (option: ApplicationOptionInterface) => option.label || "" }
                        value={ inputValue ? { id: inputValue, label: inputValueLabel ?? "" } : null }
                        isOptionEqualToValue={ (
                            option: ApplicationOptionInterface,
                            value: ApplicationOptionInterface
                        ) => value?.id && option.id === value.id }
                        loading={ isApplicationListLoading }
                        onChange={ (
                            _e: ChangeEvent,
                            value: ApplicationOptionInterface | null
                        ) => {
                            if (value?.isDisabled) return;

                            if (value) {
                                setInputValue(value.id);
                                setInputValueLabel(value.label);
                                updateConditionExpression(
                                    value.id,
                                    ruleId,
                                    conditionId,
                                    expressionId,
                                    ExpressionFieldTypes.Value,
                                    true
                                );
                            } else {
                                setInputValue(null);
                                setInputValueLabel("");
                                setDebouncedSearchQuery(null);
                            }
                        } }
                        inputValue={ inputValueLabel ?? "" }
                        onInputChange={ (_event: ChangeEvent, value: string) => {
                            setInputValueLabel(value);
                            setDebouncedSearchQueryDebounced(value);
                        } }
                        renderInput={ (params: AutocompleteRenderInputParams) => (
                            <TextField
                                { ...params }
                                variant="outlined"
                                placeholder={ t("rules:fields.autocomplete.placeholderText") }
                                InputProps={ {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            { isApplicationListLoading ? (
                                                <CircularProgress color="inherit" size={ 20 } />
                                            ) : null }
                                            { params.InputProps.endAdornment }
                                        </>
                                    )
                                } }
                            />
                        ) }
                        renderOption={ (
                            props: React.HTMLAttributes<HTMLLIElement>,
                            option: ApplicationOptionInterface
                        ) => {
                            if (option.id === MORE_ITEMS) {
                                return (
                                    <li
                                        { ...props }
                                        className="MuiAutocomplete-moreItemsAvailableMessage"
                                        key={ option.id }
                                    >
                                        { option.label }
                                    </li>
                                );
                            }

                            return (
                                <li { ...props } key={ option.id }>
                                    { option.label }
                                </li>
                            );
                        } }
                    />
                </FormControl>
            ) }
        </Box>
    );
};

export default RoleAudienceValueSelector;
