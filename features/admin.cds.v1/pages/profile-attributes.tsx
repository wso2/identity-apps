import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { useTranslation } from "react-i18next";
import { Field } from "@wso2is/forms";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder
} from "@wso2is/react-components";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { DropdownItemProps, DropdownProps, Form, Icon, PaginationProps } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";

import { AddTraitModal } from "../modals/add-profile-attribute";

import { fetchFullProfileSchema } from "../api/profile-attributes";
import { toProfileSchemaListingRows } from "../profile-schema-listing";
import { ProfileSchemaListingRow , SchemaListingScope} from "../models/profile-attribute-listing";
import { ProfileSchemaListing } from "../components/profile-attribute-list";
import { fetchProfileSchemaByScope } from "../api/profile-attributes";

const ProfileSchemaPage: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const SORT_BY: DropdownItemProps[] = [
        { key: 0, text: t("traits:page.sortByName", { defaultValue: "Name" }), value: "display_name" }, 
        { key: 1, text: "Scope", value: "scope" }
    ];

    const SCOPE_ORDER: Record<string, number> = {
        core: 0,
        application_data: 1,
        identity_attributes: 2,
        traits: 3,
    };

    const SCOPE_FIELD = "schema_scope";

    const SCOPE_OPTIONS = [
        { key: 0, text: "Identity Attributes", value: "identity_attributes" },
        { key: 1, text: "Traits", value: "traits" },
        { key: 2, text: "Application Data", value: "application_data" }
    ];


    // ✅ rows instead of traits
    const [ rows, setRows ] = useState<ProfileSchemaListingRow[]>([]);
    const [ originalRows, setOriginalRows ] = useState<ProfileSchemaListingRow[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const [ offset, setOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);

    const [ sortBy, setSortBy ] = useState<DropdownItemProps>(SORT_BY[0]);
    const [ sortOrder, setSortOrder ] = useState<boolean>(true);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ showAddTraitModal, setShowAddTraitModal ] = useState<boolean>(false);
    const [ selectedScope, setSelectedScope ] = useState<SchemaListingScope>("identity_attributes");

    const initialRender = useRef(true);

    const fetchSchemaRows = () => {
        setIsLoading(true);

        fetchFullProfileSchema()
            .then((schema) => {
                const flattened = toProfileSchemaListingRows(schema);

                setRows(flattened);
                setOriginalRows(flattened);
                setOffset(0); // ✅ reset pagination after refresh
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.message || "Failed to fetch profile schema.",
                    level: AlertLevels.ERROR,
                    message: "Error"
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchSchemaRows();
    }, []);

    // Optional sorting (works on display_name for rows)
    useEffect(() => {
    if (initialRender.current) {
        initialRender.current = false;
        return;
    }

    const sorted = [...rows].sort((a, b) => {
        // Sort by scope with a defined order
        if (sortBy.value === "scope") {
            const aOrder = SCOPE_ORDER[a.scope] ?? 99;
            const bOrder = SCOPE_ORDER[b.scope] ?? 99;

            if (aOrder !== bOrder) {
                return sortOrder ? (aOrder - bOrder) : (bOrder - aOrder);
            }

            // tie-breaker: sort by name inside the same scope
            const aName = (a.display_name ?? "").toLowerCase();
            const bName = (b.display_name ?? "").toLowerCase();

            if (aName < bName) return sortOrder ? -1 : 1;
            if (aName > bName) return sortOrder ? 1 : -1;

            return 0;
        }

        // Default: sort by display_name (or whatever key you picked)
        const aVal = ((a as any)[sortBy.value as string] ?? "").toString().toLowerCase();
        const bVal = ((b as any)[sortBy.value as string] ?? "").toString().toLowerCase();

        if (aVal < bVal) return sortOrder ? -1 : 1;
        if (aVal > bVal) return sortOrder ? 1 : -1;

        // tie-breaker: scope order
        const aOrder = SCOPE_ORDER[a.scope] ?? 99;
        const bOrder = SCOPE_ORDER[b.scope] ?? 99;

        return aOrder - bOrder;
    });

    setRows(sorted);
}, [ sortBy, sortOrder ]);


    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ) => {
        setListItemLimit(data.value as number);
        setOffset(0);
    };

    const handlePaginationChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ) => {
        setOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleSortStrategyChange = (
        event: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps
    ) => {
        setSortBy(SORT_BY.find(option => option.value === data.value));
    };

    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    const handleAddProfileAttribute = () => {
        setShowAddTraitModal(true);
    };

const toRowsFromScopeResponse = (scope: SchemaListingScope, attrs: any[]): ProfileSchemaListingRow[] => {
    // convert scope response -> listing rows (only that scope)
    return (attrs ?? []).map((a) => {
        const fullName = a.attribute_name ?? "";
        const display = fullName.split(".").pop() || fullName;

        return {
            id: `${scope}:${a.attribute_id ?? fullName}`,
            scope,
            attribute_id: a.attribute_id,
            attribute_name: fullName,
            display_name: display,
            chip_label: scope,
            belongs_to: scope === "application_data" ? (a.application_identifier ?? "") : undefined,
            editable: scope !== "identity_attributes",   // tweak as you like
            deletable: scope === "traits" || scope === "application_data"
        };
    });
};

type BasicFilter = {
    attribute: string;
    operator: string;
    value: string;
};

const parseBasicFilterQuery = (q: string): BasicFilter | null => {
    const trimmed = (q ?? "").trim();
    if (!trimmed) return null;

    // expected: "<attr> <op> <value...>"
    const parts = trimmed.split(" ");
    if (parts.length < 3) return null;

    const attribute = parts[0]?.trim();
    const operator = parts[1]?.trim();
    const value = parts.slice(2).join(" ").trim();

    if (!attribute || !operator || !value) return null;

    return { attribute, operator, value };
};

const withScopePrefix = (scope: SchemaListingScope, value: string): string => {
    const v = (value ?? "").trim();
    if (!v) return "";

    if (v.startsWith(`${scope}.`)) {
        return v;
    }

    return `${scope}.${v}`;
};


const handleSchemaFilter = async (query: string): Promise<void> => {
    const parsed = parseBasicFilterQuery(query);

    // If user cleared or query isn't in the expected format, reset.
    if (!parsed) {
        fetchSchemaRows();
        return;
    }

    const { attribute, operator, value } = parsed;

    // You said backend expects: attribute_name+op+identity_attributes.email
    // So we scope the VALUE side.
    const scopedValue = withScopePrefix(selectedScope, value);

    setIsLoading(true);

    try {
        const filter = `${attribute} ${operator} ${scopedValue}`;

        const attrs = await fetchProfileSchemaByScope(selectedScope as any, filter);

        setRows(toRowsFromScopeResponse(selectedScope, attrs));
        setOffset(0);
    } catch (error: any) {
        dispatch(addAlert({
            description: error?.message || "Failed to filter schema.",
            level: AlertLevels.ERROR,
            message: "Error"
        }));
    } finally {
        setIsLoading(false);
    }
};

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setOffset(0);
        fetchSchemaRows();
    };

    const paginate = (list: ProfileSchemaListingRow[], limit: number, offset: number): ProfileSchemaListingRow[] => {
        return list?.slice(offset, offset + limit);
    };

    const paginatedRows = paginate(rows, listItemLimit, offset);

    return (
        <PageLayout
            isLoading={ isLoading }
            title={ "Profile Schema" }
            pageTitle={ "Profile Schema" }
            description={ "Manage profile schema attributes here." }
            backButton={{
                onClick: () => { history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")); },
                text: "Go back"
            }}
            action={ (
                <PrimaryButton onClick={ handleAddProfileAttribute }>
                    <Icon name="add" />
                    Add Trait
                </PrimaryButton>
            )}
        >
            {
                rows.length === 0 && !isLoading ? (
                    <EmptyPlaceholder
                        action={ (
                            <PrimaryButton onClick={ handleAddProfileAttribute }>
                                <Icon name="add" />
                                Add Trait
                            </PrimaryButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title="No Attributes Found"
                        subtitle={[ "Schema seems empty. Add a trait to get started." ]}
                    />
                ) : (
                    <ListLayout
                        currentListSize={ rows.length }
                        listItemLimit={ listItemLimit }
                        onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                        onPageChange={ handlePaginationChange }
                        showPagination={ true }
                        showTopActionPanel={ true }
                        totalPages={ Math.ceil(rows.length / listItemLimit) }
                        totalListSize={ rows.length }
                        sortOptions={ SORT_BY }
                        sortStrategy={ sortBy }
                        onSortStrategyChange={ handleSortStrategyChange }
                        onSortOrderChange={ handleSortOrderChange }
                        onSearchQueryClear={ handleSearchQueryClear }   
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleSchemaFilter }
                                filterAttributeOptions={[
                                    { key: 0, text: "Attribute Name", value: "attribute_name" }
                                ]}
                                disableSearchFilterDropdown={ false }
                                placeholder="Search attribute name (e.g., email)"
                                defaultSearchAttribute="attribute_name"
                                defaultSearchOperator="sw"
                                filterConditionOptions={[
                                    { key: 0, text: "Starts with", value: "sw" },
                                    { key: 1, text: "Contains", value: "co" },
                                    { key: 2, text: "Equals", value: "eq" }
                                ]}
                                triggerClearQuery={ triggerClearQuery }
                            >
                                { <Form.Group widths="equal">
                                    <Field
                                    children={ SCOPE_OPTIONS }
                                    label="Scope"
                                    name={ SCOPE_FIELD }
                                    placeholder="Select scope"
                                    required={ true }
                                    requiredErrorMessage="Scope is required"
                                    type="dropdown"
                                    value={ selectedScope }
                                    listen={ (values: Map<string, any>) => {
                                        const scope = values.get(SCOPE_FIELD) as SchemaListingScope;

                                        if (scope && scope !== selectedScope) {
                                        setSelectedScope(scope);
                                        }
                                    } }
                                    />
                                </Form.Group> }
                            </AdvancedSearchWithBasicFilters>
                        ) }
                        isLoading={ isLoading }
                        
                    >
                        <ProfileSchemaListing
                            rows={ paginatedRows }
                            isLoading={ isLoading }
                            onRefresh={ fetchSchemaRows }
                        />
                    </ListLayout>
                )
            }

            <AddTraitModal
                open={ showAddTraitModal }
                onClose={ () => setShowAddTraitModal(false) }
                onAddSuccess={ fetchSchemaRows }   // ✅ refresh full schema after adding trait
            />
        </PageLayout>
    );
};

export default ProfileSchemaPage;
