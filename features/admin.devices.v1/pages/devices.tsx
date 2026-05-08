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
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import DeviceList from "../components/device-list";
import { useGetDevices } from "../hooks/use-get-devices";
import { DeviceResponseInterface } from "../models/devices";

type DevicesPagePropsInterface = IdentifiableComponentInterface;

const DevicesPage: FunctionComponent<DevicesPagePropsInterface> = (
    props: DevicesPagePropsInterface
): ReactElement => {
    const { "data-componentid": componentId = "devices-page" } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const sortingOptions: DropdownItemProps[] = useMemo((): DropdownItemProps[] => [
        { key: 1, text: t("devices:list.columns.deviceName"), value: "deviceName" },
        { key: 2, text: t("devices:list.columns.user"), value: "userName" },
        { key: 3, text: t("devices:list.columns.status"), value: "status" },
        { key: 4, text: t("devices:list.columns.registeredAt"), value: "registeredAt" }
    ], [ t ]);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(null);

    const {
        data: deviceList,
        isLoading: isDeviceListLoading,
        error: deviceListFetchError,
        mutate: mutateDeviceList
    } = useGetDevices();

    useEffect((): void => {
        if (!deviceListFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:notifications.fetch.genericError.message")
        }));
    }, [ deviceListFetchError ]);

    const filteredAndSortedList: DeviceResponseInterface[] = useMemo((): DeviceResponseInterface[] => {
        if (!deviceList) {
            return [];
        }

        let result: DeviceResponseInterface[] = [ ...deviceList ];

        if (searchQuery) {
            const lowerQuery: string = searchQuery.toLowerCase();

            result = result.filter((device: DeviceResponseInterface): boolean =>
                device.deviceName?.toLowerCase().includes(lowerQuery)
                || device.userName?.toLowerCase().includes(lowerQuery)
                || device.userId?.toLowerCase().includes(lowerQuery)
                || device.status?.toLowerCase().includes(lowerQuery)
            );
        }

        const sortKey: string = (listSortingStrategy?.value ?? sortingOptions[0]?.value ?? "deviceName") as string;

        result.sort((a: DeviceResponseInterface, b: DeviceResponseInterface): number => {
            const aVal: string = (a[sortKey as keyof DeviceResponseInterface] ?? "") as string;
            const bVal: string = (b[sortKey as keyof DeviceResponseInterface] ?? "") as string;

            return aVal.localeCompare(bVal);
        });

        return result;
    }, [ deviceList, searchQuery, listSortingStrategy ]);

    const paginatedList: DeviceResponseInterface[] = useMemo((): DeviceResponseInterface[] =>
        filteredAndSortedList.slice(listOffset, listOffset + listItemLimit),
    [ filteredAndSortedList, listOffset, listItemLimit ]);

    const totalPages: number = useMemo((): number =>
        Math.ceil(filteredAndSortedList.length / listItemLimit),
    [ filteredAndSortedList.length, listItemLimit ]);

    const handleDeviceFilter = (query: string): void => {
        setSearchQuery(query);
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

    const handleListSortingStrategyOnChange = (_event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const selected: DropdownItemProps = sortingOptions.find(
            (option: DropdownItemProps): boolean => data.value === option.value
        );

        setListSortingStrategy(selected);
        setListOffset(0);
    };

    return (
        <PageLayout
            title={ t("devices:title") }
            description={ t("devices:description") }
            data-componentid={ `${ componentId }-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleDeviceFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("devices:list.columns.deviceName"),
                                value: "deviceName"
                            },
                            {
                                key: 1,
                                text: t("devices:list.columns.user"),
                                value: "userName"
                            },
                            {
                                key: 2,
                                text: t("devices:list.columns.status"),
                                value: "status"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devices:advancedSearch.form.inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devices:advancedSearch.form.inputs.filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("devices:advancedSearch.form.inputs.filterValue.placeholder")
                        }
                        placeholder={ t("devices:advancedSearch.placeholder") }
                        defaultSearchAttribute="deviceName"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-componentid={ `${ componentId }-list-advanced-search` }
                    />
                ) }
                currentListSize={ paginatedList.length }
                isLoading={ isDeviceListLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                showPagination={ filteredAndSortedList.length > listItemLimit }
                showTopActionPanel={ isDeviceListLoading || filteredAndSortedList.length > 0 || !!searchQuery }
                sortOptions={ sortingOptions }
                sortStrategy={ listSortingStrategy ?? sortingOptions[0] }
                totalPages={ totalPages }
                totalListSize={ filteredAndSortedList.length }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <DeviceList
                    isLoading={ isDeviceListLoading }
                    list={ paginatedList }
                    onDeviceDelete={ mutateDeviceList }
                    searchQuery={ searchQuery }
                    onSearchQueryClear={ handleSearchQueryClear }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

export default DevicesPage;
