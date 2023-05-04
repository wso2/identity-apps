import React, { FunctionComponent, SyntheticEvent, useEffect, useState } from "react";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AccessControlConstants, Show } from "@wso2is/access-control";
import { useTranslation } from "react-i18next";
import { AdvancedSearchWithBasicFilters, AppConstants, EventPublisher, history, UIConstants } from "../../core";
import { DropdownItemProps, DropdownProps, Icon } from "semantic-ui-react";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { IdentityVerificationProviderList } from "../components";
import { useIdentityVerificationProviderList } from "../api";
import { IdentityVerificationProviderInterface, IDVPListResponseInterface } from "../models";
import { identityProviderConfig } from "../../../extensions";
import { mutate } from "swr";


type IDVPPropsInterface = IdentifiableComponentInterface;

const IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 2,
        text: "Type",
        value: "type"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

const IdentityVerificationProvidersPage: FunctionComponent<IDVPPropsInterface> = (props: IDVPPropsInterface) => {


    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const [hasNextPage, setHasNextPage] = useState<boolean>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [triggerClearQuery, setTriggerClearQuery] = useState<boolean>(false);
    const [listItemLimit, setListItemLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [listOffset, setListOffset] = useState<number>(0);
    const [listSortingStrategy, setListSortingStrategy] = useState<DropdownItemProps>(
        IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS[0]
    );
    const {
        data: idvpList,
        isLoading: isIDVPListRequestLoading,
        error: idpListFetchRequestError,
        mutate: idvpListMutator
    } = useIdentityVerificationProviderList(listItemLimit, listOffset);
    console.log("idvpList", idvpList);
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const handleIdentityProviderListFilter = () => {
        console.log("handleIdentityProviderListFilter");
    };

    /**
     * Handles item per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: SyntheticEvent, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = () => {
        console.log("handlePaginationChange");

    };

    const handleListSortingStrategyOnChange = () => {
        console.log("handleListSortingStrategyOnChange");

    };

    const handleIdentityProviderDelete = async () => {
        console.log("reloading");
        await idvpListMutator();
    };

    const handleSearchQueryClear = () => {
        console.log("handleSearchQueryClear");
    };

    const getAdvancedSearchWithBasicFilters = () => {

        return (
            <AdvancedSearchWithBasicFilters
                onFilter={ handleIdentityProviderListFilter }
                filterAttributeOptions={ [
                    {
                        key: 0,
                        text: t("common:name"),
                        value: "name"
                    }
                ] }
                // TODO: Make this IDVP instead of Auth provider
                filterAttributePlaceholder={ t(
                    "console:develop.features.authenticationProvider.advancedSearch." +
                    "form.inputs.filterAttribute" +
                    ".placeholder"
                ) }
                filterConditionsPlaceholder={ t(
                    "console:develop.features.authenticationProvider.advancedSearch." +
                    "form.inputs.filterCondition" +
                    ".placeholder"
                ) }
                filterValuePlaceholder={ t(
                    "console:develop.features.authenticationProvider.advancedSearch." +
                    "form.inputs.filterValue" +
                    ".placeholder"
                ) }
                placeholder={ t(
                    "console:develop.features.authenticationProvider." +
                    "advancedSearch.placeholder"
                ) }
                defaultSearchAttribute="name"
                defaultSearchOperator="co"
                triggerClearQuery={ triggerClearQuery }
                data-componentid={ `${ componentId }-advance-search` }
            />
        )
    }

    return (
        <PageLayout
            pageTitle="Identity Verification Providers"
            action={
                (!isIDVPListRequestLoading && (searchQuery || idvpList?.identityVerificationProviders?.length > 0)) &&
                (
                    // TODO: Make this IDVP instead of IDP
                    <Show when={ AccessControlConstants.IDP_WRITE }>
                        <PrimaryButton
                            onClick={ (): void => {
                                eventPublisher.publish("connections-click-new-connection-button");
                                history.push(AppConstants.getPaths().get("IDVP_TEMPLATES"));
                            } }
                            data-componentid={ `${ componentId }-add-button` }
                        >
                            <Icon name="add"/> { t("console:develop.features.idvp.buttons.addIDVP") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("console:develop.pages.idvp.title") }
            description={ t("console:develop.pages.idp.subTitle") }
            data-componentid={ `${ componentId }-page-layout` }
            actionColumnWidth={ 6 }
            headingColumnWidth={ 10 }
        >
            <ListLayout
                isLoading={ isIDVPListRequestLoading }
                advancedSearch={ getAdvancedSearchWithBasicFilters() }
                currentListSize={ idvpList?.count ?? 0 }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                showPagination={ true }
                showTopActionPanel={ isIDVPListRequestLoading || !(!searchQuery && idvpList?.totalResults <= 0) }
                sortOptions={ IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={
                    Math.ceil((idvpList?.totalResults ?? 1) / listItemLimit)
                }
                totalListSize={ idvpList?.totalResults ?? 0 }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <IdentityVerificationProviderList
                    advancedSearch={ getAdvancedSearchWithBasicFilters() }
                    isLoading={ isIDVPListRequestLoading }
                    list={ idvpList }
                    onEmptyListPlaceholderActionClick={ () =>
                        history.push(AppConstants.getPaths().get("IDP_TEMPLATES"))
                    }
                    onIdentityVerificationProviderDelete={handleIdentityProviderDelete}
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
        </PageLayout>);
}

export default IdentityVerificationProvidersPage;
