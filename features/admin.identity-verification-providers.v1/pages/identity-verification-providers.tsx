/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, UIConstants, history } from "../../admin.core.v1";
import { useIDVPTemplateTypeMetadataList, useIdentityVerificationProviderList } from "../api";
import { IdentityVerificationProviderList } from "../components";
import { IdentityVerificationProviderConstants } from "../constants";
import { handleIDVPTemplateRequestError, handleIdvpListFetchRequestError } from "../utils";

type IDVPPropsInterface = IdentifiableComponentInterface;
/**
 * Identity Verification Providers list page.
 *
 * @param props - Props injected to the component.
 * @returns IDVP list page.
 */
const IdentityVerificationProvidersPage: FunctionComponent<IDVPPropsInterface> = (props: IDVPPropsInterface) => {
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
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

    /**
     * Displays error notification if the API fetch request for IDVP list failed.
     */
    useEffect( () => {
        if (!idvpListFetchRequestError) {
            return;
        }
        handleIdvpListFetchRequestError(idvpListFetchRequestError);
    } , [ idvpListFetchRequestError ]);

    /**
     * Displays error notification if the API fetch request for IDVP template type list failed.
     */
    useEffect(() => {
        if (!idvpTemplateTypeRequestError){
            return;
        }
        handleIDVPTemplateRequestError(idvpTemplateTypeRequestError);
    }, [ idvpTemplateTypeRequestError ]);

    /**
     * Handles item per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     * @returns void
     */
    const handleItemsPerPageDropdownChange = (event: SyntheticEvent, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     * @returns void
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * Triggers a re-fetch for the identity verification provider list after deleting an identity verification provider.
     *
     * @returns void
     */
    const onIdentityVerificationProviderDelete = async (): Promise<void> => {
        await idvpListMutator();
    };

    return (
        <PageLayout
            pageTitle="Identity Verification Providers"
            action={
                (!isIDVPListRequestLoading && (idvpList?.identityVerificationProviders?.length > 0)) &&
                (
                    <Show when={ featureConfig?.identityVerificationProviders?.scopes?.create }>
                        <PrimaryButton
                            onClick={ (): void => {
                                history.push(AppConstants.getPaths().get(
                                    IdentityVerificationProviderConstants.IDVP_TEMPLATE_PATH
                                ));
                            } }
                            data-componentid={ `${ componentId }-add-button` }
                        >
                            <Icon name="add"/> { t("idvp:buttons.addIDVP") }
                        </PrimaryButton>
                    </Show>
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
                showPagination={ true }
                showTopActionPanel={ false }
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
