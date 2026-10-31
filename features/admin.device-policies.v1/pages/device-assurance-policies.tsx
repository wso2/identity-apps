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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import useGetDevicePolicies from "../api/use-get-device-policies";
import DevicePolicyList from "../components/device-policy-list";
import DevicePolicyWizard from "../components/device-policy-wizard";
import { DevicePolicyInterface } from "../models/device-policy";

type DevicePoliciesPagePropsInterface = IdentifiableComponentInterface;

/**
 * Page that lists the device assurance policies of the organization.
 *
 * @param props - Props injected to the component.
 * @returns Device assurance policies page.
 */
const DeviceAssurancePoliciesPage: FunctionComponent<DevicePoliciesPagePropsInterface> = ({
    "data-componentid": componentId = "device-assurance-policies-page"
}: DevicePoliciesPagePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const devicePoliciesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devicePolicies
    );
    const hasReadPermission: boolean = useRequiredScopes(devicePoliciesFeatureConfig?.scopes?.read);
    const hasCreatePermission: boolean = useRequiredScopes(devicePoliciesFeatureConfig?.scopes?.create);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ searchQuery, setSearchQuery ] = useState<string | undefined>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    const {
        data: policyList,
        error: policyListFetchError,
        isLoading: isPolicyListLoading,
        mutate: mutatePolicyList
    } = useGetDevicePolicies(listItemLimit, listOffset, searchQuery, hasReadPermission);

    useEffect(() => {
        if (!policyListFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:assurancePolicies.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:assurancePolicies.notifications.fetch.genericError.message")
        }));
    }, [ policyListFetchError ]);

    /**
     * The search box emits a SCIM style query such as `name co value`, but the policies endpoint
     * only accepts the value to match against the policy name.
     *
     * @param query - Search query.
     */
    const handlePolicyFilter = (query: string): void => {
        const match: RegExpMatchArray | null = query?.match(/^name\s+co\s+(.*)$/);
        const value: string = (match ? match[1] : query ?? "").trim().replace(/^"(.*)"$/, "$1");

        setSearchQuery(value || undefined);
        setListOffset(0);
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery(undefined);
        setTriggerClearQuery(!triggerClearQuery);
        setListOffset(0);
    };

    const handlePaginationChange = (_event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (_event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        setListOffset(0);
    };

    const handlePolicyDelete = (): void => {
        // Step back a page when the last policy on the current page is deleted.
        if (policyList?.policies?.length === 1 && listOffset > 0) {
            setListOffset(Math.max(0, listOffset - listItemLimit));

            return;
        }

        mutatePolicyList();
    };

    const handlePolicyCreate = (policy: DevicePolicyInterface): void => {
        setShowWizard(false);
        history.push(AppConstants.getPaths().get("DEVICE_POLICY_EDIT").replace(":id", policy.id));
    };

    const totalResults: number = policyList?.totalResults ?? 0;

    return (
        <PageLayout
            pageTitle={ t("devices:assurancePolicies.title") }
            title={ t("devices:assurancePolicies.title") }
            description={ t("devices:assurancePolicies.description") }
            action={ hasCreatePermission && (totalResults > 0 || !!searchQuery) && (
                <PrimaryButton
                    onClick={ (): void => setShowWizard(true) }
                    data-componentid={ `${ componentId }-add-button` }
                >
                    <Icon name="add" />
                    { t("devices:assurancePolicies.buttons.add") }
                </PrimaryButton>
            ) }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: (): void => history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION")),
                text: t("devices:assurancePolicies.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${ componentId }-layout` }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handlePolicyFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("devices:assurancePolicies.list.columns.name"),
                                value: "name"
                            }
                        ] }
                        disableSearchFilterDropdown={ true }
                        placeholder={ t("devices:assurancePolicies.advancedSearch.placeholder") }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-componentid={ `${ componentId }-search` }
                    />
                ) }
                currentListSize={ policyList?.count ?? 0 }
                isLoading={ isPolicyListLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSearchQueryClear={ handleSearchQueryClear }
                searchQuery={ searchQuery }
                showPagination={ true }
                showTopActionPanel={ true }
                totalPages={ Math.ceil(totalResults / listItemLimit) }
                totalListSize={ totalResults }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <DevicePolicyList
                    isLoading={ isPolicyListLoading }
                    list={ policyList?.policies ?? [] }
                    onPolicyAdd={ hasCreatePermission ? (): void => setShowWizard(true) : undefined }
                    onPolicyDelete={ handlePolicyDelete }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
            { showWizard && (
                <DevicePolicyWizard
                    onClose={ (): void => setShowWizard(false) }
                    onSuccess={ handlePolicyCreate }
                    data-componentid={ `${ componentId }-wizard` }
                />
            ) }
        </PageLayout>
    );
};

export default DeviceAssurancePoliciesPage;
