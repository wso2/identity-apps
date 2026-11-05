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

import { Show } from "@wso2is/access-control";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { useGetFunctionLibraries } from "../api/function-library";
import AddFunctionLibraryWizard from "../components/add-function-library-wizard";
import FunctionLibrariesList from "../components/function-libraries-list";
import { FUNCTION_LIBRARIES_PAGE } from "../constants/component-ids";
import { FunctionLibraryListResponseInterface } from "../models/function-library";

/**
 * Props interface of {@link FunctionLibrariesPage}.
 */
type FunctionLibrariesPagePropsInterface = IdentifiableComponentInterface;

/**
 * Function libraries listing page.
 *
 * @param props - Props injected to the component.
 * @returns Function libraries page.
 */
const FunctionLibrariesPage: FunctionComponent<FunctionLibrariesPagePropsInterface> = (
    props: FunctionLibrariesPagePropsInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = FUNCTION_LIBRARIES_PAGE } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showAddWizard, setShowAddWizard ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);

    const {
        data: functionLibraryListResponse,
        error: functionLibraryListError,
        isLoading: isFunctionLibraryListLoading,
        mutate: mutateFunctionLibraryList
    } = useGetFunctionLibraries<FunctionLibraryListResponseInterface>(listItemLimit, listOffset);

    const totalListSize: number = functionLibraryListResponse?.totalResults ?? 0;

    useEffect(() => {
        if (!functionLibraryListError) {
            return;
        }

        const axiosError: AxiosError<HttpErrorResponseDataInterface> =
            functionLibraryListError as unknown as AxiosError<HttpErrorResponseDataInterface>;

        dispatch(addAlert({
            description: axiosError?.response?.data?.description
                ?? t("functionLibraries:notifications.fetchList.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("functionLibraries:notifications.fetchList.genericError.message")
        }));
    }, [ functionLibraryListError ]);

    /**
     * Moves back a page when the last item of the current (non-first) page gets deleted.
     */
    useEffect(() => {
        if (listOffset > 0 && functionLibraryListResponse && !functionLibraryListResponse.scriptLibraries?.length) {
            setListOffset(Math.max(0, listOffset - listItemLimit));
        }
    }, [ functionLibraryListResponse ]);

    const handlePaginationChange: (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void = (
        _event: MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange: (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps) => void = (
        _event: MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
        setListOffset(0);
    };

    const handleAddWizardClose: (shouldRefresh?: boolean) => void = (shouldRefresh?: boolean): void => {
        setShowAddWizard(false);

        if (shouldRefresh) {
            mutateFunctionLibraryList();
        }
    };

    return (
        <PageLayout
            title={ t("functionLibraries:page.title") }
            pageTitle={ t("functionLibraries:page.title") }
            description={ t("functionLibraries:page.description") }
            action={ (totalListSize > 0) && (
                <Show when={ featureConfig?.functionLibraries?.scopes?.create }>
                    <PrimaryButton
                        onClick={ () => setShowAddWizard(true) }
                        data-componentid={ `${ componentId }-add-button` }
                    >
                        <Icon name="add" />
                        { t("functionLibraries:page.primaryAction") }
                    </PrimaryButton>
                </Show>
            ) }
            data-componentid={ `${ componentId }-layout` }
        >
            <FunctionLibrariesList
                functionLibraryList={ functionLibraryListResponse?.scriptLibraries }
                isLoading={ isFunctionLibraryListLoading }
                listItemLimit={ listItemLimit }
                activePage={ Math.floor(listOffset / listItemLimit) + 1 }
                totalListSize={ totalListSize }
                onPageChange={ handlePaginationChange }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onFunctionLibraryDelete={ () => mutateFunctionLibraryList() }
                onAddNewFunctionLibrary={ () => setShowAddWizard(true) }
                data-componentid={ `${ componentId }-list` }
            />
            { showAddWizard && (
                <AddFunctionLibraryWizard
                    onClose={ handleAddWizardClose }
                    data-componentid={ `${ componentId }-add-wizard` }
                />
            ) }
        </PageLayout>
    );
};

export default FunctionLibrariesPage;
