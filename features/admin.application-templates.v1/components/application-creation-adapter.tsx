/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { MinimalAppCreateWizard } from
    "@wso2is/admin.applications.v1/components/wizard/minimal-application-create-wizard";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import { ApplicationTemplateListItemInterface } from "@wso2is/admin.applications.v1/models/application";
import { ApplicationTemplateManagementUtils } from
    "@wso2is/admin.applications.v1/utils/application-template-management-utils";
import { AppState } from "@wso2is/admin.core.v1";
import { ExtensionTemplateListInterface } from "@wso2is/admin.template-core.v1/models/templates";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationCreateWizard } from "./application-create-wizard";
import { ApplicationTemplateCategories } from "../models/templates";

/**
 * Props for the Application creation adapter component.
 */
export interface ApplicationCreationAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * Template for rendering the application creation wizard.
     */
    template: ExtensionTemplateListInterface;
    /**
     * Indicator of whether the application creation wizard should be displayed or not.
     */
    showWizard: boolean;
    /**
     * Callback triggered when closing the application creation wizard.
     */
    onClose: () => void;
}

/**
 * Adapter for rendering the application creation wizard.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application creation adapter component.
 */
const ApplicationCreationAdapter: FunctionComponent<ApplicationCreationAdapterPropsInterface> = ({
    template,
    showWizard,
    onClose,
    "data-componentid": _componentId = "application-creation-adapter"
}: ApplicationCreationAdapterPropsInterface): ReactElement => {

    const oldApplicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state?.application?.groupedTemplates);

    const [
        isOldApplicationTemplateRequestLoading,
        setOldApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     *  Get old Application templates.
     */
    useEffect(() => {
        if (oldApplicationTemplates !== undefined) {
            return;
        }

        setOldApplicationTemplateRequestLoadingStatus(true);

        ApplicationTemplateManagementUtils.getApplicationTemplates()
            .finally(() => {
                setOldApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ oldApplicationTemplates ]);

    /**
     * Render the appropriate Application Creation Wizard based on the template category.
     *
     * @returns - Application Create Wizard Component.
     */
    const renderApplicationCreationWizard = (): ReactElement => {
        if (!template) {
            return null;
        }

        const oldApplicationTemplate: ApplicationTemplateListItemInterface = oldApplicationTemplates?.find(
            (oldTemplate: ApplicationTemplateListItemInterface) => oldTemplate?.templateId === template?.id);

        switch(template?.category) {
            case ApplicationTemplateCategories.DEFAULT:
                return (
                    <MinimalAppCreateWizard
                        title={ oldApplicationTemplate?.name }
                        subTitle={ oldApplicationTemplate?.description }
                        closeWizard={ (): void => onClose() }
                        template={ oldApplicationTemplate }
                        showHelpPanel={ true }
                        subTemplates={ oldApplicationTemplate?.subTemplates }
                        subTemplatesSectionTitle={ oldApplicationTemplate?.subTemplatesSectionTitle }
                        addProtocol={ false }
                        templateLoadingStrategy={ ApplicationManagementConstants.DEFAULT_APP_TEMPLATE_LOADING_STRATEGY }
                    />
                );
            default:
                return (
                    <ApplicationCreateWizard
                        onClose={ onClose }
                    />
                );
        }
    };

    return (
        showWizard
            ? isOldApplicationTemplateRequestLoading
                ? <ContentLoader dimmer/>
                : renderApplicationCreationWizard()
            : null
    );
};

export default ApplicationCreationAdapter;
