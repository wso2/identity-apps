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
import { RouteComponentProps } from "react-router";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AppConstants, UIConstants, history } from "../../core";
import { deleteLocaleTemplate, getEmailTemplate } from "../api";
import { EmailTemplateList } from "../components";
import { EmailTemplate, EmailTemplateDetails } from "../models";

/**
 * Props for the Email Templates page.
 */
type EmailTemplatesPagePropsInterface = TestableComponentInterface;

/**
 * Route parameters interface.
 */
interface RouteParams {
    templateTypeId: string;
}

/**
 * Component will list all available locale based email templates for
 * the selected email template type.
 *
 * @param {EmailTemplatesPagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const EmailTemplatesPage: FunctionComponent<EmailTemplatesPagePropsInterface> = (
    props: EmailTemplatesPagePropsInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const templateTypeId = match?.params?.templateTypeId;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);

    const [ emailTemplateTypeDetails, setEmailTemplateTypeDetails ] = useState<EmailTemplateDetails>(undefined);
    const [ emailTemplates, setEmailTemplates ] = useState<EmailTemplate[]>([]);
    const [ paginatedEmailTemplates, setPaginatedEmailTemplates ] = useState<EmailTemplate[]>([]);
    const [ isEmailTemplatesFetchRequestLoading, setIsEmailTemplatesFetchRequestLoading ] = useState<boolean>(false);

    /**
     * Fetch the email templates when the template type id is available in the URL location.
     */
    useEffect(() => {
        if (!templateTypeId) {
            return;
        }

        getTemplates(templateTypeId, listItemLimit, listOffset);
    }, [ listOffset, listItemLimit, templateTypeId ]);

    /**
     * Util method to get all locale templates.
     */
    const getTemplates = (typeId: string, limit: number, offset: number): void => {
        setIsEmailTemplatesFetchRequestLoading(true);

        getEmailTemplate(typeId)
            .then((response: AxiosResponse<EmailTemplateDetails>) => {
                if (response.status === 200) {
                    setEmailTemplateTypeDetails(response.data);

                    if (response.data.templates instanceof Array && response.data.templates.length !== 0) {
                        setEmailTemplates(response.data.templates);
                        paginate(response.data.templates, offset, limit);
                    }

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplates.notifications.getTemplates" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplates.notifications.getTemplates" +
                        ".genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.emailTemplates.notifications.getTemplates.error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplates.notifications.getTemplates" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplates.notifications.getTemplates" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsEmailTemplatesFetchRequestLoading(false);
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
        paginate(emailTemplates, offsetValue, listItemLimit);
    };

    /**
     * Handler for Items per page dropdown change.
     *
     * @param event drop down event
     * @param data drop down data
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        paginate(emailTemplates, listOffset, data.value as number);
    };

    /**
     * Util method to paginate retrieved email template type list.
     *
     * @param {EmailTemplate[]} list - Email template list.
     * @param {number} offset - Pagination offset value.
     * @param {number} limit - Pagination item limit.
     */
    const paginate = (list: EmailTemplate[], offset: number, limit: number): void => {
        setPaginatedEmailTemplates(list.slice(offset, limit + offset));
    };

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("EMAIL_TEMPLATE_TYPES"));
    };

    /**
     * Util to handle back button event.
     */
    const handleAddNewTemplate = (): void => {
        history.push(AppConstants.getPaths().get("EMAIL_TEMPLATE_ADD").replace(":templateTypeId", templateTypeId));
    };

    /**
     * Util method to delete locale email template based on the provided email template
     * type id and locale based email template id.
     *
     * @param templateTypeId - template type id
     * @param templateId - locale template id
     */
    const deleteTemplateType = (templateTypeId: string, templateId: string): void => {
        deleteLocaleTemplate(templateTypeId, templateId)
            .then((response: AxiosResponse) => {
                if (response.status === 204) {
                    dispatch(addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.emailTemplates.notifications.deleteTemplate.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.emailTemplates.notifications.deleteTemplate.success.message"
                        )
                    }));

                    getTemplates(templateTypeId, listItemLimit, listOffset);

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplates.notifications.deleteTemplate" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplates.notifications.deleteTemplate" +
                        ".genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.emailTemplates.notifications.deleteTemplate.error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplates.notifications.deleteTemplate" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplates.notifications.deleteTemplate" +
                        ".genericError.message")
                }));
            });
    };

    return (
        <PageLayout
            action={
                (isEmailTemplatesFetchRequestLoading || emailTemplates?.length > 0)
                && (
                    <PrimaryButton
                        onClick={ handleAddNewTemplate }
                        data-testid={ `${ testId }-list-layout-add-button` }
                    >
                        <Icon name="add"/>
                        { t("console:manage.features.emailTemplates.buttons.newTemplate") }
                    </PrimaryButton>
                )
            }
            isLoading={ isEmailTemplatesFetchRequestLoading }
            title={
                (emailTemplateTypeDetails && emailTemplateTypeDetails.displayName)
                    ? t("console:manage.pages.emailTemplatesWithDisplayName.title",
                        { displayName: emailTemplateTypeDetails.displayName })
                    : t("console:manage.pages.emailTemplates.title")
            }
            pageTitle={
                (emailTemplateTypeDetails && emailTemplateTypeDetails.displayName)
                    ? t("console:manage.pages.emailTemplatesWithDisplayName.title",
                        { displayName: emailTemplateTypeDetails.displayName })
                    : t("console:manage.pages.emailTemplates.title")
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.emailTemplates.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(emailTemplates?.length / listItemLimit) }
                totalListSize={ emailTemplates?.length }
                data-testid={ `${ testId }-list-layout` }
                showTopActionPanel={ false }
            >
                <EmailTemplateList
                    isLoading={ isEmailTemplatesFetchRequestLoading }
                    onEmptyListPlaceholderActionClick={ () => handleAddNewTemplate() }
                    onDelete={ deleteTemplateType }
                    templateTypeId={ templateTypeId }
                    templateList={ paginatedEmailTemplates }
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EmailTemplatesPage.defaultProps = {
    "data-testid": "email-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EmailTemplatesPage;
