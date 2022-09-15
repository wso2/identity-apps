/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, UIConstants, filterList, sortList } from "../../core";
import { OrganizationUtils } from "../../organizations/utils";
import { deleteEmailTemplateType, getEmailTemplateTypes } from "../api";
import { AddEmailTemplateTypeWizard, EmailTemplateTypeList } from "../components";
import { EmailTemplateType } from "../models";
import { EmailTemplateUtils } from "../utils/email-template-utils";

/**
 * Props for the Email Templates Types page.
 */
type EmailTemplateTypesPagePropsInterface = TestableComponentInterface;

/**
 * Component to list available email template types.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element
 */
const EmailTemplateTypesPage: FunctionComponent<EmailTemplateTypesPagePropsInterface> = (
    props: EmailTemplateTypesPagePropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY = [
        {
            key: 0,
            text: t("common:name"),
            value: "displayName"
        }
    ];

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showNewTypeWizard, setShowNewTypeWizard ] = useState<boolean>(false);

    const [ emailTemplateTypes, setEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ isTemplateTypesFetchRequestLoading, setIsTemplateTypesFetchRequestLoading ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ filteredEmailTemplateTypes, setFilteredEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);

    const [ resetPagination, setResetPagination ] = useTrigger();

    useEffect(() => {
        getTemplateTypes();
    }, []);

    useEffect(() => {
        setFilteredEmailTemplateTypes((sortList(filteredEmailTemplateTypes, sortBy.value, sortOrder)));
    }, [ sortBy, sortOrder ]);

    /**
     * Fetch the list of template types.
     *
     * @param limit - Pagination limit.
     * @param offset - Pagination offset.
     */
    const getTemplateTypes = (): void => {
        setIsTemplateTypesFetchRequestLoading(true);

        getEmailTemplateTypes()
            .then((response: AxiosResponse<EmailTemplateType[]>) => {

                if(!OrganizationUtils.isCurrentOrganizationRoot()){
                    response.data = EmailTemplateUtils.filterEmailTemplateTypesForOrganization(response.data);
                }

                if (response.status === 200) {
                    setEmailTemplateTypes(response.data);
                    setFilteredEmailTemplateTypes(response.data);

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.emailTemplateTypes.notifications.getTemplateTypes" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsTemplateTypesFetchRequestLoading(false);
            });
    };

    /**
     * Handler for pagination page change.
     *
     * @param event - pagination page change event
     * @param data - pagination page change data
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;

        setListOffset(offsetValue);
    };

    /**
     * Handler for Items per page dropdown change.
     *
     * @param event - drop down event
     * @param data - drop down data
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Util method to paginate retrieved email template type list.
     *
     * @param list - Email template types.
     * @param offset - Pagination offset value.
     * @param limit - Pagination item limit.
     */
    const paginate = (list: EmailTemplateType[], offset: number, limit: number): EmailTemplateType[] => {
        return list.slice(offset, limit + offset);
    };

    const handleSearch = (query: string): void => {
        // TODO: Implement using API once the API is ready
        setFilteredEmailTemplateTypes(filterList(emailTemplateTypes, query, "displayName", true));
        setSearchQuery(query);
        setListOffset(0);
        setResetPagination();
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredEmailTemplateTypes(emailTemplateTypes);
    };

    /**
     * Handle sort strategy change.
     *
     * @param event - React.SyntheticEvent<HTMLElement>.
     * @param data - DropdownProps.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setSortBy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
    };

    /**
     * Handles sort order change.
     *
     * @param isAscending - boolean value.
     */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Function to perform the template type deletion.
     *
     * @param templateTypeId - Deleting template type ID.
     */
    const deleteTemplateType = (templateTypeId: string): void => {
        deleteEmailTemplateType(templateTypeId)
            .then((response: AxiosResponse) => {
                if (response.status === 204) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("console:manage.features.emailTemplateTypes.notifications" +
                            ".deleteTemplateType.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.emailTemplateTypes.notifications" +
                            ".deleteTemplateType.success.message")
                    }));

                    getTemplateTypes();

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.emailTemplateTypes.notifications" +
                            ".deleteTemplateType.error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.message")
                }));
            });
    };

    return (
        <PageLayout
            action={
                (isTemplateTypesFetchRequestLoading || emailTemplateTypes?.length > 0) && (
                    <PrimaryButton
                        onClick={ () => setShowNewTypeWizard(true) }
                        data-testid={ `${ testId }-list-layout-add-button` }
                    >
                        <Icon name="add"/>
                        { t("console:manage.features.emailTemplateTypes.buttons.newType") }
                    </PrimaryButton>
                )
            }
            isLoading={ isTemplateTypesFetchRequestLoading }
            title={ t("console:manage.pages.emailTemplateTypes.title") }
            pageTitle={ t("console:manage.pages.emailTemplateTypes.title") }
            description={ t("console:manage.pages.emailTemplateTypes.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleSearch }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "displayName"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("console:manage.features.emailTemplateTypes.advancedSearch.form.inputs" +
                                ".filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("console:manage.features.emailTemplateTypes.advancedSearch.form.inputs" +
                                ".filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("console:manage.features.emailTemplateTypes.advancedSearch.form.inputs" +
                                ".filterValue.placeholder")
                        }
                        placeholder={
                            t("console:manage.features.emailTemplateTypes.advancedSearch.placeholder")
                        }
                        defaultSearchAttribute="displayName"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-testid={ `${ testId }-advanced-search` }
                    />
                ) }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                resetPagination={ resetPagination }
                totalPages={ Math.ceil(filteredEmailTemplateTypes?.length / listItemLimit) }
                totalListSize={ filteredEmailTemplateTypes?.length }
                showTopActionPanel={ isTemplateTypesFetchRequestLoading
                    || !(!searchQuery && filteredEmailTemplateTypes?.length <= 0) }
                data-testid={ `${ testId }-list-layout` }
                onSearchQueryClear={ handleSearchQueryClear }
                onSortStrategyChange={ handleSortStrategyChange }
                onSortOrderChange={ handleSortOrderChange }
                sortOptions={ SORT_BY }
                sortStrategy={ sortBy }
            >
                <EmailTemplateTypeList
                    isLoading={ isTemplateTypesFetchRequestLoading }
                    onDelete={ deleteTemplateType }
                    onEmptyListPlaceholderActionClick={ () => setShowNewTypeWizard(true) }
                    templateTypeList={ paginate(filteredEmailTemplateTypes, listOffset, listItemLimit) }
                    data-testid={ `${ testId }-list` }
                    searchQuery={ searchQuery }
                    onSearchQueryClear={ handleSearchQueryClear }
                />
                {
                    showNewTypeWizard && (
                        <AddEmailTemplateTypeWizard
                            onCloseHandler={ () => {
                                getTemplateTypes();
                                setShowNewTypeWizard(false);
                            } }
                            data-testid={ `${ testId }-add-wizard` }
                        />
                    )
                }
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EmailTemplateTypesPage.defaultProps = {
    "data-testid": "email-template-types"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EmailTemplateTypesPage;
