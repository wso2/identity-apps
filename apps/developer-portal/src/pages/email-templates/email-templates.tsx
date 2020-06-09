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

import { TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteLocaleTemplate, getEmailTemplate } from "../../api";
import { EmailTemplateList } from "../../components";
import { EMAIL_TEMPLATE_VIEW_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { AlertInterface, AlertLevels, EmailTemplate, EmailTemplateDetails } from "../../models";

/**
 * Props for the Email Templates page.
 */
type EmailTemplatesPageInterface = TestableComponentInterface;

/**
 * Component will list all available locale based email templates for
 * the selected email template type.
 *
 * @param {EmailTemplatesPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EmailTemplates: FunctionComponent<EmailTemplatesPageInterface> = (
    props: EmailTemplatesPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);

    const [ templateTypeId, setTemplateTypeId ] = useState<string>("");
    const [ emailTemplateTypeDetails, setEmailTemplateTypeDetails ] = useState<EmailTemplateDetails>(undefined);
    const [ emailTemplates, setEmailTemplates ] = useState<EmailTemplate[]>([]);
    const [ paginatedEmailTemplates, setPaginatedEmailTemplates ] = useState<EmailTemplate[]>([]);
    const [ isEmailTemplatesFetchRequestLoading, setIsEmailTemplatesFetchRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const templateTypeId = path[ path.length - 1 ];

        setTemplateTypeId(templateTypeId);

        getTemplates();
    }, [emailTemplateTypeDetails !== undefined, emailTemplates.length]);

    /**
     * Util method to get all locale templates.
     */
    const getTemplates = () => {
        setIsEmailTemplatesFetchRequestLoading(true);

        getEmailTemplate(templateTypeId)
            .then((response: AxiosResponse<EmailTemplateDetails>) => {
                if (response.status === 200) {
                    setEmailTemplateTypeDetails(response.data);

                    if (response.data.templates instanceof Array && response.data.templates.length !== 0) {
                        setEmailTemplates(response.data.templates);
                        setEmailTemplateTypePage(listOffset, listItemLimit);
                    }
                }
            })
            .finally(() => {
                setIsEmailTemplatesFetchRequestLoading(false);
            })
    };

    /**
     * Handler for pagination page change.
     * 
     * @param event pagination page change event
     * @param data pagination page change data
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setEmailTemplateTypePage(offsetValue, listItemLimit);
    };

    /**
     * Handler for Items per page dropdown change.
     * 
     * @param event drop down event
     * @param data drop down data
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setEmailTemplateTypePage(listOffset, data.value as number);
    };

    /**
     * Util method to paginate retrieved email template type list.
     * 
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     */
    const setEmailTemplateTypePage = (offsetValue: number, itemLimit: number) => {
        setPaginatedEmailTemplates(emailTemplates?.slice(offsetValue, itemLimit + offsetValue));
    };

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = () => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH);
    };

    /**
     * Util to handle back button event.
     */
    const handleAddNewTemplate = () => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId + "/add-template");
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Util method to delete locale email template based on the provided email template 
     * type id and locale based email template id.
     * 
     * @param templateTypeId - template type id
     * @param templateId - locale template id
     */
    const deleteTemplateType = (templateTypeId: string, templateId: string) => {
        deleteLocaleTemplate(templateTypeId, templateId).then((response: AxiosResponse) => {
            if (response.status === 204) {
                handleAlerts({
                    description: t(
                        "devPortal:components.emailTemplates.notifications.deleteTemplate.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.emailTemplates.notifications.deleteTemplate.success.message"
                    )
                });
            }
            getTemplates();
        }).catch((error: AxiosError) => {
            handleAlerts({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.emailTemplates.notifications.deleteTemplate.genericError.message"
                )
            });
        })
    };
    
    return (
        <PageLayout
            isLoading={ isEmailTemplatesFetchRequestLoading }
            title={
                (emailTemplateTypeDetails && emailTemplateTypeDetails.displayName)
                    ? t("devPortal:pages.emailTemplatesWithDisplayName.title",
                    { displayName: emailTemplateTypeDetails.displayName })
                    : t("devPortal:pages.emailTemplates.title")
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("devPortal:pages.emailTemplates.backButton")
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
                rightActionPanel={
                    (
                        <PrimaryButton
                            onClick={ () => handleAddNewTemplate() }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add"/>
                            { t("devPortal:components.emailTemplates.buttons.newTemplate") }
                        </PrimaryButton>
                    )
                }
                data-testid={ `${ testId }-list-layout` }
                showTopActionPanel={ isEmailTemplatesFetchRequestLoading || emailTemplates?.length  > 0 }
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
    )
};

/**
 * Default props for the component.
 */
EmailTemplates.defaultProps = {
    "data-testid": "email-templates"
};
