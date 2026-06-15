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

import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import CreateDevicePolicyWizard from "../components/create-device-policy-wizard";
import DevicePolicyList from "../components/device-policy-list";
import { useGetDevicePolicies } from "../hooks/use-get-device-policies";

type DeviceAssurancePoliciesPagePropsInterface = IdentifiableComponentInterface;

const DeviceAssurancePoliciesPage: FunctionComponent<DeviceAssurancePoliciesPagePropsInterface> = (
    props: DeviceAssurancePoliciesPagePropsInterface
): ReactElement => {
    const { "data-componentid": componentId = "device-assurance-policies-page" } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    const {
        data: policyListResponse,
        isLoading: isPolicyListLoading,
        error: policyListFetchError,
        mutate: mutatePolicyList
    } = useGetDevicePolicies(listItemLimit, listOffset, searchQuery || undefined);

    useEffect((): void => {
        if (!policyListFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:assurancePolicies.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:assurancePolicies.notifications.fetch.genericError.message")
        }));
    }, [ policyListFetchError ]);

    const handlePolicyFilter = (query: string): void => {
        if (!query) {
            setSearchQuery("");
            setListOffset(0);

            return;
        }

        const match: RegExpMatchArray | null = query.match(/"([^"]*)"/);
        const filterValue: string = match ? match[1] : query;

        setSearchQuery(filterValue);
        setListOffset(0);
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
        setListOffset(0);
    };

    const handlePaginationChange = (_event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (
        _event: MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
        setListOffset(0);
    };

    const totalResults: number = policyListResponse?.totalResults ?? 0;

    return (
        <PageLayout
            title={ t("devices:assurancePolicies.title") }
            description={ t("devices:assurancePolicies.description") }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: (): void => history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION")),
                text: t("devices:assurancePolicies.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handlePolicyFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devices:assurancePolicies.advancedSearch.form.inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devices:assurancePolicies.advancedSearch.form.inputs.filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("devices:assurancePolicies.advancedSearch.form.inputs.filterValue.placeholder")
                        }
                        placeholder={ t("devices:assurancePolicies.advancedSearch.placeholder") }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-componentid={ `${ componentId }-search` }
                    />
                ) }
                currentListSize={ policyListResponse?.count ?? 0 }
                isLoading={ isPolicyListLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSearchQueryClear={ handleSearchQueryClear }
                searchQuery={ searchQuery }
                showPagination={ true }
                showTopActionPanel={ true }
                totalPages={ Math.ceil(totalResults / listItemLimit) || 1 }
                totalListSize={ totalResults }
                rightActionPanel={ (
                    <PrimaryButton
                        onClick={ (): void => setShowWizard(true) }
                        data-componentid={ `${ componentId }-add-button` }
                    >
                        <Icon name="add" />
                        { t("devices:assurancePolicies.wizard.heading") }
                    </PrimaryButton>
                ) }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <DevicePolicyList
                    isLoading={ isPolicyListLoading }
                    list={ policyListResponse?.policies ?? [] }
                    onPolicyDelete={ mutatePolicyList }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
            { showWizard && (
                <CreateDevicePolicyWizard
                    data-componentid={ `${ componentId }-create-wizard` }
                    onClose={ (): void => setShowWizard(false) }
                    onSuccess={ (): void => {
                        setShowWizard(false);
                        mutatePolicyList();
                    } }
                />
            ) }
        </PageLayout>
    );
};

export default DeviceAssurancePoliciesPage;
