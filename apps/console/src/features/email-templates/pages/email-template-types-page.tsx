/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { UIConstants } from "../../core";
import { deleteEmailTemplateType, getEmailTemplateTypes } from "../api";
import { AddEmailTemplateTypeWizard, EmailTemplateTypeList } from "../components";
import { EmailTemplateType } from "../models";

/**
 * Props for the Email Templates Types page.
 */
type EmailTemplateTypesPagePropsInterface = TestableComponentInterface;

/**
 * Component to list available email template types.
 *
 * @param {EmailTemplateTypesPagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const EmailTemplateTypesPage: FunctionComponent<EmailTemplateTypesPagePropsInterface> = (
    props: EmailTemplateTypesPagePropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showNewTypeWizard, setShowNewTypeWizard ] = useState<boolean>(false);

    const [ emailTemplateTypes, setEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ paginatedEmailTemplateTypes, setPaginatedEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ isTemplateTypesFetchRequestLoading, setIsTemplateTypesFetchRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        getTemplateTypes(listItemLimit, listOffset)
    }, [ listOffset, listItemLimit ]);

    /**
     * Fetch the list of template types.
     *
     * @param {number} limit - Pagination limit.
     * @param {number} offset - Pagination offset.
     */
    const getTemplateTypes = (limit: number, offset: number): void => {
        setIsTemplateTypesFetchRequestLoading(true);

        getEmailTemplateTypes()
            .then((response: AxiosResponse<EmailTemplateType[]>) => {
                if (response.status === 200) {
                    setEmailTemplateTypes(response.data);
                    paginate(response.data, offset, limit);

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("adminPortal:components.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:components.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("adminPortal:components.emailTemplateTypes.notifications.getTemplateTypes" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("adminPortal:components.emailTemplateTypes.notifications.getTemplateTypes" +
                        ".genericError.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:components.emailTemplateTypes.notifications.getTemplateTypes" +
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
     * @param event pagination page change event
     * @param data pagination page change data
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        paginate(emailTemplateTypes, offsetValue, listItemLimit);
    };

    /**
     * Handler for Items per page dropdown change.
     *
     * @param event drop down event
     * @param data drop down data
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        paginate(emailTemplateTypes, listOffset, data.value as number);
    };

    /**
     * Util method to paginate retrieved email template type list.
     *
     * @param {EmailTemplateType[]} list - Email template types.
     * @param {number} offset - Pagination offset value.
     * @param {number} limit - Pagination item limit.
     */
    const paginate = (list: EmailTemplateType[], offset: number, limit: number): void => {
        setPaginatedEmailTemplateTypes(list.slice(offset, limit + offset));
    };

    /**
     * Function to perform the template type deletion.
     *
     * @param {string} templateTypeId - Deleting template type ID.
     */
    const deleteTemplateType = (templateTypeId: string): void => {
        deleteEmailTemplateType(templateTypeId)
            .then((response: AxiosResponse) => {
                if (response.status === 204) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("adminPortal:components.emailTemplateTypes.notifications" +
                            ".deleteTemplateType.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("adminPortal:components.emailTemplateTypes.notifications" +
                            ".deleteTemplateType.success.message")
                    }));

                    getTemplateTypes(listItemLimit, listOffset);

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("adminPortal:components.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("adminPortal:components.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("adminPortal:components.emailTemplateTypes.notifications" +
                            ".deleteTemplateType.error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("adminPortal:components.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("adminPortal:components.emailTemplateTypes.notifications" +
                        ".deleteTemplateType.genericError.message")
                }));
            })
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
                        { t("adminPortal:components.emailTemplateTypes.buttons.newType") }
                    </PrimaryButton>
                )
            }
            isLoading={ isTemplateTypesFetchRequestLoading }
            title={ t("adminPortal:pages.emailTemplateTypes.title") }
            description={ t("adminPortal:pages.emailTemplateTypes.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(emailTemplateTypes?.length / listItemLimit) }
                totalListSize={ emailTemplateTypes?.length }
                showTopActionPanel={ false }
                data-testid={ `${ testId }-list-layout` }
            >
                <EmailTemplateTypeList
                    isLoading={ isTemplateTypesFetchRequestLoading }
                    onDelete={ deleteTemplateType }
                    onEmptyListPlaceholderActionClick={ () => setShowNewTypeWizard(true) }
                    templateTypeList={ paginatedEmailTemplateTypes }
                    data-testid={ `${ testId }-list` }
                />
                {
                    showNewTypeWizard && (
                        <AddEmailTemplateTypeWizard
                            onCloseHandler={ () => {
                                getTemplateTypes(listItemLimit, listOffset);
                                setShowNewTypeWizard(false);
                            } }
                            data-testid={ `${ testId }-add-wizard` }
                        />
                    )
                }
            </ListLayout>
        </PageLayout>
    )
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
