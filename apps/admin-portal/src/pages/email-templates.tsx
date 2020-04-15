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

import React, { ReactElement, useEffect, useState } from "react";
import { Icon, PaginationProps, DropdownProps } from "semantic-ui-react";
import { AxiosResponse } from "axios";
import { PrimaryButton } from "@wso2is/react-components";
import { PageLayout, ListLayout } from "../layouts";
import { EmailTemplateList } from "../components/email-templates";
import { getEmailTemplateTypes } from "../api";
import { UserConstants } from "../constants";
import { EmailTemplateType } from "../models";

/**
 * Component to list available email templates.
 * 
 */
export const EmailTemplates = (): ReactElement => {

    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ listOffset, setListOffset ] = useState<number>(0);
    
    const [ emailTemplateTypes, setEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ paginatedEmailTemplateTypes, setPaginatedEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_EMAIL_TEMPLATE_TYPE_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        getEmailTemplateTypes().then((response: AxiosResponse<EmailTemplateType[]>) => {
            if (response.status === 200) {
                setEmailTemplateTypes(response.data);
                setEmailTemplateTypePage(listOffset, listItemLimit);
            }
        });
    }, [emailTemplateTypes.length]);

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setEmailTemplateTypePage(offsetValue, listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setEmailTemplateTypePage(listOffset, data.value as number);
    };

    const setEmailTemplateTypePage = (offsetValue: number, itemLimit: number) => {
        setPaginatedEmailTemplateTypes(emailTemplateTypes?.slice(offsetValue, itemLimit + offsetValue));
    }

    return (
        <PageLayout
            title="Email Templates"
            description="Create and manage templates for relevant email template types."
            showBottomDivider={ true } 
        >
            <ListLayout
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    (
                        <PrimaryButton onClick={ () => { console.log() } }>
                            <Icon name="add"/>
                            Add Template Type
                        </PrimaryButton>
                    )
                }
                showPagination={ true }
                totalPages={ Math.ceil(emailTemplateTypes?.length / listItemLimit) }
                totalListSize={ emailTemplateTypes?.length }
            >
                <EmailTemplateList templateList={ paginatedEmailTemplateTypes } />
            </ListLayout>
        </PageLayout>
    )
}
