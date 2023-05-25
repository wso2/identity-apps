/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AppConstants, UIConstants, history } from "../../core";
import { useIdentityVerificationProviderList } from "../api";
import { useIDVPTemplateTypeMetadataList } from "../api/ui-metadata";
import { IdentityVerificationProviderList } from "../components";
import { IdentityVerificationProviderConstants } from "../constants";
import { handleIDVPTemplateRequestError, handleIdvpListFetchRequestError } from "../utils";


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
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS[0]
    );
    const {
        data: idvpList,
        isLoading: isIDVPListRequestLoading,
        error: idvpListFetchRequestError,
        mutate: idvpListMutator
    } = useIdentityVerificationProviderList(listItemLimit, listOffset);

    const {
        data: idvpTemplateTypes,
        isLoading: isIDVPTemplateTypeRequestLoading,
        error: idvpTemplateTypeRequestError
    } = useIDVPTemplateTypeMetadataList();

    useEffect( () => {
        handleIdvpListFetchRequestError(idvpListFetchRequestError);

    } , [ idvpListFetchRequestError ]);

    useEffect(() => {
        if(idvpTemplateTypeRequestError){
            handleIDVPTemplateRequestError(idvpTemplateTypeRequestError);
        }
    }, [ idvpTemplateTypeRequestError ]);

    /**
     * Handles item per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: SyntheticEvent, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * Sets the sorting strategy for identity verification provider list.
     *
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS.find((option: DropdownItemProps) => {
                return data.value === option.value;
            })
        );
    };

    /**
     * Triggers a re-fetch for the identity verification provider list after deleting an identity verification provider.
     */
    const onIdentityVerificationProviderDelete = async () => {
        await idvpListMutator();
    };

    return (
        <PageLayout
            pageTitle="Identity Verification Providers"
            action={
                (!isIDVPListRequestLoading && (idvpList?.identityVerificationProviders?.length > 0)) &&
                (
                    <PrimaryButton
                        onClick={ (): void => {
                            history.push(
                                AppConstants.getPaths().get(IdentityVerificationProviderConstants.IDVP_TEMPLATE_PATH)
                            );
                        } }
                        data-componentid={ `${ componentId }-add-button` }
                    >
                        <Icon name="add"/> { t("console:develop.features.idvp.buttons.addIDVP") }
                    </PrimaryButton>
                )
            }
            title={ t("console:develop.pages.idvp.title") }
            description={ t("console:develop.pages.idvp.subTitle") }
            data-componentid={ `${ componentId }-page-layout` }
            actionColumnWidth={ 6 }
            headingColumnWidth={ 10 }
        >
            <ListLayout
                isLoading={ isIDVPListRequestLoading || isIDVPTemplateTypeRequestLoading }
                currentListSize={ idvpList?.count ?? 0 }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                showPagination={ true }
                showTopActionPanel={ false }
                sortOptions={ IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={
                    Math.ceil((idvpList?.totalResults ?? 1) / listItemLimit)
                }
                totalListSize={ idvpList?.totalResults ?? 0 }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <IdentityVerificationProviderList
                    isLoading={ isIDVPListRequestLoading || isIDVPTemplateTypeRequestLoading }
                    idvpList={ idvpList }
                    idvpTemplateTypeList={ idvpTemplateTypes }
                    onEmptyListPlaceholderActionClick={ () =>
                        history.push(
                            AppConstants.getPaths().get(IdentityVerificationProviderConstants.IDVP_TEMPLATE_PATH)
                        )
                    }
                    onIdentityVerificationProviderDelete={ onIdentityVerificationProviderDelete }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
        </PageLayout>);
};

export default IdentityVerificationProvidersPage;
