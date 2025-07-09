import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { useTranslation } from "react-i18next";
import { 
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder
} from "@wso2is/react-components";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { getTraits, Trait } from "../api/traits";
import { TraitsList } from "../components/traits-list";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";

const TraitsPage: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const SORT_BY: DropdownItemProps[] = [
        { key: 0, text: t("traits:page.sortByName", { defaultValue: "Name" }), value: "attribute_name" }
    ];

    const [ traits, setTraits ] = useState<Trait[]>([]);
    const [ originalTraits, setOriginalTraits ] = useState<Trait[]>([]); // To reset on clear search
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ offset, setOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ sortBy, setSortBy ] = useState<DropdownItemProps>(SORT_BY[0]);
    const [ sortOrder, setSortOrder ] = useState<boolean>(true);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const initialRender = useRef(true);

    const fetchTraits = () => {
        setIsLoading(true);
        getTraits()
            .then((response) => {
                setTraits(response);
                setOriginalTraits(response);
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.message || "Failed to fetch traits.",
                    level: AlertLevels.ERROR,
                    message: "Error"
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchTraits();
    }, []);

    useEffect(() => {
        if (!initialRender.current) {
            const sorted = [...traits].sort((a, b) => {
                if (a[sortBy.value as keyof Trait] < b[sortBy.value as keyof Trait]) return sortOrder ? -1 : 1;
                if (a[sortBy.value as keyof Trait] > b[sortBy.value as keyof Trait]) return sortOrder ? 1 : -1;
                return 0;
            });
            setTraits(sorted);
        } else {
            initialRender.current = false;
        }
    }, [ sortBy, sortOrder ]);

    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps
    ) => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (
        event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps
    ) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleSortStrategyChange = (
        event: React.SyntheticEvent<HTMLElement>, data: DropdownProps
    ) => {
        setSortBy(SORT_BY.find(option => option.value === data.value));
    };

    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    const handleAddTrait = () => {
        // TODO: Implement add trait flow
    };

    const handleTraitsFilter = (query: string): void => {
        const filtered = originalTraits.filter((trait) =>
            trait.attribute_name.toLowerCase().includes(query.toLowerCase())
        );
        setTraits(filtered);
        setSearchQuery(query);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setTraits(originalTraits);
    };

    const paginate = (list: Trait[], limit: number, offset: number): Trait[] => {
        return list?.slice(offset, offset + limit);
    };

    return (
        <PageLayout
            isLoading={ isLoading }
            title={ t("traits:page.title", { defaultValue: "Traits" }) }
            pageTitle={ t("traits:page.title", { defaultValue: "Traits" }) }
            description={ t("traits:page.description", { defaultValue: "Manage user traits here." }) }
            backButton={{
                onClick: () => { history.push(AppConstants.getPaths().get("CLAIM_DIALECTS")); },
                text: t("common:back", { defaultValue: "Back" })
            }}
            action={ traits.length > 0 && (
                <PrimaryButton onClick={ handleAddTrait }>
                    <Icon name="add" />
                    { t("traits:page.addButton", { defaultValue: "Add Trait" }) }
                </PrimaryButton>
            )}
        >
            {
                traits.length === 0 && !isLoading ? (
                    <EmptyPlaceholder
                        action={ (
                            <PrimaryButton onClick={ handleAddTrait }>
                                <Icon name="add" />
                                { t("traits:page.addButton", { defaultValue: "Add Trait" }) }
                            </PrimaryButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("traits:placeholders.emptyList.title", { defaultValue: "No Traits Found" }) }
                        subtitle={[
                            t("traits:placeholders.emptyList.subtitles",
                                { defaultValue: "Please add a trait to get started." })
                        ]}
                    />
                ) : (
                    <ListLayout
                        currentListSize={ listItemLimit }
                        listItemLimit={ listItemLimit }
                        onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                        onPageChange={ handlePaginationChange }
                        onSortStrategyChange={ handleSortStrategyChange }
                        onSortOrderChange={ handleSortOrderChange }
                        showPagination={ true }
                        showTopActionPanel={ true }
                        totalPages={ Math.ceil(traits.length / listItemLimit) }
                        totalListSize={ traits.length }
                        sortOptions={ SORT_BY }
                        sortStrategy={ sortBy }
                        advancedSearch={
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleTraitsFilter }
                                filterAttributeOptions={[
                                    { key: 0, text: "Name", value: "attribute_name" }
                                ]}
                                placeholder="Search by Name"
                                defaultSearchAttribute="attribute_name"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                onSearchQueryClear={ handleSearchQueryClear }
                                searchQuery={ searchQuery }
                            />
                        }
                        isLoading={ isLoading }
                    >
                        <TraitsList
                            traits={ paginate(traits, listItemLimit, offset) }
                            isLoading={ isLoading }
                            onRefresh={ fetchTraits }
                        />
                    </ListLayout>
                )
            }
        </PageLayout>
    );
};

export default TraitsPage;
