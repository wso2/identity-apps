/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { UserCircleDotIcon } from "@oxygen-ui/react-icons";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    filterList,
    history,
    sortList
} from "@wso2is/admin.core.v1";
import { attributeConfig } from "@wso2is/admin.extensions.v1";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { LinkButton, ListLayout, PrimaryButton, SecondaryButton } from "@wso2is/react-components";
import kebabCase from "lodash-es/kebabCase";
import React, { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, DropdownProps, Grid, Icon, Modal, PaginationProps } from "semantic-ui-react";
import { ClaimsList, ListType } from "../../";
import { addExternalClaim } from "../../../api";
import { ClaimManagementConstants } from "../../../constants";
import { AddExternalClaim } from "../../../models";
import { resolveType } from "../../../utils";
import { ExternalClaims } from "../../wizard";

interface EditExternalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * Dialect ID
     */
    dialectID: string;
    /**
     * The list of external claims.
     */
    claims: ExternalClaim[];
    /**
     * Triggers an update.
     */
    update: () => void;
    /**
     * Sets to true if the list is being loaded.
     */
    isLoading: boolean;
    /**
     * Attribute type
     */
    attributeType?: string;
    /**
     * Attribute URI
     */
    attributeUri: string;
    /**
     * Mapped local claim list
     */
    mappedLocalClaims: string[];
    /**
     * Is the attribute button enabled.
     */
    isAttributeButtonEnabled: boolean;
    /**
     * Attribute button Text.
     */
    attributeButtonText: string;
    /**
     * Update mapped claims on delete or edit
     */
    updateMappedClaims?: Dispatch<SetStateAction<boolean>>;
}

/**
 * Interface for attribute sort by props.
 */
interface SortByInterface {
    key: number;
    text: string;
    value: string;
}

/**
 * This lists the external claims.
 *
 * @param props - Props injected to the component.
 *
 * @returns EditExternalClaims component.
 */
export const EditExternalClaims: FunctionComponent<EditExternalClaimsPropsInterface> = (
    props: EditExternalClaimsPropsInterface
): ReactElement => {

    const {
        attributeType,
        attributeUri,
        mappedLocalClaims,
        isAttributeButtonEnabled,
        attributeButtonText,
        updateMappedClaims,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Attributes to sort the list by
     */
    const SORT_BY: SortByInterface[] = [
        {
            key: 0,
            text: t("claims:external.attributes.attributeURI",
                { type: resolveType(attributeType, true, true) }),
            value: "claimURI"
        },
        {
            key: 1,
            text: t("claims:external.attributes.mappedClaim"),
            value: "mappedLocalClaimURI"
        }
    ];

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ filteredClaims, setFilteredClaims ] = useState<ExternalClaim[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ showAddExternalClaim, setShowAddExternalClaim ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ disableSubmit, setDisableSubmit ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ triggerAddExternalClaim, setTriggerAddExternalClaim ] = useTrigger();
    const [ resetPagination, setResetPagination ] = useTrigger();

    const dispatch: Dispatch<any> = useDispatch();

    const { dialectID, claims, update, isLoading } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (claims) {
            setFilteredClaims(claims);
            handleSearchQueryClear(); // Clear the search field upon new claims
        }
    }, [ claims ]);

    useEffect(() => {
        setFilteredClaims(sortList(filteredClaims, sortBy.value, sortOrder));
    }, [ sortBy, sortOrder ]);

    /**
     * Slices and returns a portion of the list.
     *
     * @param list - List to be paginated.
     * @param limit - Pagination limit.
     * @param offset - Pagination offset.
     *
     * @returns paginated list.
     */
    const paginate = (list: ExternalClaim[], limit: number, offset: number): ExternalClaim[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles change in the number of items to show.
     *
     * @param event - Dropdown changed event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
    * Paginates.
    * @param event - Pagination changed event.
    * @param data - Pagination data.
    */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handle sort strategy change.
     *
     * @param event - Sort strategy changed event.
     * @param data - Dropdown data.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter((option: SortByInterface) => option.value === data.value)[ 0 ]);
    };

    /**
    * Handles sort order change.
     *
    * @param isAscending - Is sort oder ascending or not.
    */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handles the `onFilter` callback action from the
     * advanced search component.
     *
     * @param query - Search query.
     */
    const handleExternalClaimFilter = (query: string): void => {
        try {
            const filteredList: ExternalClaim[] = filterList(
                claims, query, sortBy.value, sortOrder
            );

            setFilteredClaims(filteredList);
            setSearchQuery(query);
            setOffset(0);
            setResetPagination();
        } catch (error) {
            dispatch(addAlert({
                description: error?.message,
                level: AlertLevels.ERROR,
                message: t("claims:external.advancedSearch.error")
            }));
        }
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredClaims(claims);
    };

    const handleAttributesSubmit = (claims: AddExternalClaim[]): void => {

        const addAttributesRequests: Promise<AddExternalClaim>[] = claims.map((claim: AddExternalClaim) => {
            return addExternalClaim(dialectID, {
                claimURI: claim.claimURI,
                mappedLocalClaimURI: claim.mappedLocalClaimURI
            });
        });

        setIsSubmitting(true);
        Promise.all(addAttributesRequests).then(() => {
            dispatch(addAlert(
                {
                    description: t("claims:external.notifications." +
                        "addExternalAttribute.success.description", {
                        type: resolveType(attributeType)
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("claims:external.notifications." +
                        "addExternalAttribute.success.message")
                }
            ));
            update();
            updateMappedClaims(true);
        }).catch((error: any) => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("claims:external.notifications." +
                            "addExternalAttribute.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("claims:external.notifications." +
                            "addExternalAttribute.genericError.message")
                }
            ));
        }).finally(() => {
            setIsSubmitting(false);
            setShowAddExternalClaim(false);
        });
    };

    /**
     * Handles the update button disable state.
     */
    const handleClaimListChange = (buttonState: boolean): void => {
        setDisableSubmit(buttonState);
    };

    return (
        <ListLayout
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleExternalClaimFilter }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t("claims:external.attributes.attributeURI",
                                { type: resolveType(attributeType, true, true) }),
                            value: "claimURI"
                        },
                        {
                            key: 1,
                            text: t("claims:external.attributes.mappedClaim"),
                            value: "mappedLocalClaimURI"
                        }
                    ] }
                    filterAttributePlaceholder={
                        t("claims:external.advancedSearch.form.inputs" +
                            ".filterAttribute.placeholder", { type: resolveType(attributeType, true, true) })
                    }
                    filterConditionsPlaceholder={
                        t("claims:external.advancedSearch.form.inputs" +
                            ".filterCondition.placeholder", { type: resolveType(attributeType, true, true) })
                    }
                    filterValuePlaceholder={
                        t("claims:external.advancedSearch.form.inputs" +
                            ".filterValue.placeholder")
                    }
                    placeholder={ t("claims:external.advancedSearch.placeholder",
                        { type: resolveType(attributeType, true, true) }) }
                    defaultSearchAttribute="claimURI"
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                    data-testid={ `${ testId }-list-advanced-search` }
                />
            ) }
            currentListSize={ listItemLimit }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            onPageChange={ handlePaginationChange }
            onSortStrategyChange={ handleSortStrategyChange }
            onSortOrderChange={ handleSortOrderChange }
            resetPagination={ resetPagination }
            showPagination={ true }
            sortOptions={ SORT_BY }
            sortStrategy={ sortBy }
            showTopActionPanel={ isLoading || !(!searchQuery && filteredClaims?.length <= 0) }
            totalPages={ Math.ceil(filteredClaims?.length / listItemLimit) }
            totalListSize={ filteredClaims?.length }
            rightActionPanel={
                (<>
                    {
                        attributeConfig?.editAttributeMappings?.showAddExternalAttributeButton(dialectID)
                        && hasRequiredScopes(
                            featureConfig?.attributeDialects,
                            featureConfig?.attributeDialects?.scopes?.create,
                            allowedScopes
                        ) && isAttributeButtonEnabled
                        && (
                            /**
                             * `loading` property is used to check whether the current selected
                             * dialect is same as the dialect which the claims are loaded.
                             * If it's different, this condition will wait until the correct
                             * dialects are loaded onto the view.
                             */
                            <PrimaryButton
                                loading={ claims && attributeUri !== claims[0]?.claimDialectURI }
                                onClick={ (): void => {
                                    if (attributeUri !== claims[0]?.claimDialectURI) {
                                        return;
                                    }
                                    setShowAddExternalClaim(true);
                                } }
                                disabled={
                                    (
                                        showAddExternalClaim
                                        || (claims && attributeUri !== claims[0]?.claimDialectURI)
                                    )
                                }
                                data-testid={ `${testId}-list-layout-add-button` }
                            >
                                <Icon name="add" />
                                {
                                    attributeButtonText
                                }
                            </PrimaryButton>
                        )
                    }
                    { attributeType === ClaimManagementConstants.OIDC &&
                    featureConfig?.oidcScopes?.enabled &&
                    hasRequiredScopes(
                        featureConfig?.oidcScopes,
                        featureConfig?.oidcScopes?.scopes?.feature,
                        allowedScopes
                    ) && (
                        <SecondaryButton
                            onClick={ () => {
                                history.push(AppConstants.getPaths().get("OIDC_SCOPES"));
                            } }
                            data-componentid={ `${testId}-oidc-scopes-button` }
                        >
                            <UserCircleDotIcon fill="black" className="icon" />
                            { t("console:develop.features.sidePanel.oidcScopes") }
                        </SecondaryButton>
                    ) }
                </>)
            }
            data-testid={ `${ testId }-list-layout` }
        >
            {
                showAddExternalClaim && (
                    <Modal
                        open={ showAddExternalClaim }
                        onClose={ () => { setShowAddExternalClaim(false); } }
                        dimmer="blurring"
                        size="small"
                        data-testid={ `${ testId }-add-external-claim-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <Modal.Header>
                            { t("claims:external.pageLayout.edit.header",
                                { type: resolveType(attributeType, true) }) }
                        </Modal.Header>
                        <Modal.Content scrolling className="edit-attribute-mapping">
                            <ExternalClaims
                                data-testid={ `${ testId }-add-external-claims` }
                                onSubmit={ (claims: AddExternalClaim[]) => {
                                    handleAttributesSubmit(claims);
                                } }
                                submitState={ triggerAddExternalClaim }
                                values={ claims }
                                shouldShowInitialValues={ false }
                                attributeType={ attributeType }
                                claimDialectUri={ attributeUri }
                                dialectId={ dialectID }
                                wizard={ false }
                                mappedLocalClaims={ mappedLocalClaims }
                                onClaimListChange={ handleClaimListChange }
                            />
                        </Modal.Content>
                        <Modal.Actions>
                            <LinkButton
                                onClick={ () => { setShowAddExternalClaim(false); } }
                                data-testid={ `${ testId }-add-external-claim-modal-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                            <PrimaryButton
                                disabled={ disableSubmit || isSubmitting }
                                loading={ isSubmitting }
                                onClick={ () => {
                                    eventPublisher.publish("manage-attribute-mappings-add-new-attribute", {
                                        type: kebabCase(attributeType)
                                    });
                                    setTriggerAddExternalClaim();
                                } }
                                data-testid={ `${ testId }-add-external-claim-modal-save-button` }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Modal.Actions>
                    </Modal>
                )
            }
            <Grid columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Divider hidden />
                    <ClaimsList
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleExternalClaimFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("claims:external.attributes.attributeURI",
                                            { type: resolveType(attributeType, true, true) }),
                                        value: "claimURI"
                                    },
                                    {
                                        key: 1,
                                        text: t("claims:external.attributes.mappedClaim"),
                                        value: "mappedLocalClaimURI"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("claims:external.advancedSearch.form.inputs" +
                                        ".filterAttribute.placeholder", {
                                        type: resolveType(attributeType, true, true)
                                    })
                                }
                                filterConditionsPlaceholder={
                                    t("claims:external.advancedSearch.form.inputs" +
                                        ".filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("claims:external.advancedSearch.form.inputs" +
                                        ".filterValue.placeholder")
                                }
                                placeholder={ t("claims:external.advancedSearch.placeholder",
                                    { type: resolveType(attributeType, true, true) }) }
                                defaultSearchAttribute="claimURI"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-list-advanced-search` }
                            />
                        ) }
                        showTableHeaders={ true }
                        isLoading={ isLoading }
                        list={ paginate(filteredClaims, listItemLimit, offset) }
                        localClaim={ ListType.EXTERNAL }
                        update={ () => update() }
                        dialectID={ dialectID }
                        onEmptyListPlaceholderActionClick={ () => setShowAddExternalClaim(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid={ `${ testId }-list` }
                        attributeType={ attributeType }
                        featureConfig={ featureConfig }
                        updateMappedClaims={ updateMappedClaims }
                    />
                </Grid.Column>
            </Grid>
        </ListLayout>
    );
};

/**
 * Default props for the component.
 */
EditExternalClaims.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "edit-external-claims",
    isLoading: true
};
