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

import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { EmailTemplateDetails } from "../models";
import { EMAIL_TEMPLATE_VIEW_PATH } from "../constants";
import { getEmailTemplate } from "../api";
import { PageLayout } from "../layouts";
import { history } from "../helpers";
import { AddLocaleTemplate } from "../components/email-templates";

export const AddTemplateLocale: FunctionComponent = (): ReactElement => {
    
    const [ templateTypeId, setTemplateTypeId ] = useState<string>('');
    const [ emailTemplateTypeDetails, setEmailTemplateTypeDetails ] = useState<EmailTemplateDetails>(undefined);

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = () => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const templateTypeId = path[ path.length - 2 ];

        setTemplateTypeId(templateTypeId);

        getEmailTemplate(templateTypeId).then((response: AxiosResponse<EmailTemplateDetails>) => {
            if (response.status === 200) {
                setEmailTemplateTypeDetails(response.data);
            }
        })
    }, [emailTemplateTypeDetails !== undefined]);

    return (
        <PageLayout
            title={ "Add new locale for template" }
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Go back to " + emailTemplateTypeDetails?.displayName + " template"
            } }
            titleTextAlign="left"
            showBottomDivider={ true }
            bottomMargin={ false }
        >
            <AddLocaleTemplate />
        </PageLayout>
    )
}
