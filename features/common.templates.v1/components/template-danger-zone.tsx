/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { TemplateManagementConstants } from "../constants/template-management-constants";

/**
 * Props interface for the TemplateDangerZone component.
 */
interface TemplateDangerZoneProps extends IdentifiableComponentInterface {

    /**
     * Template type - "email" or "sms"
     */
    templateType: "email" | "sms";

    /**
     * Is the template a system template.
     */
    isSystemTemplate: boolean;

    /**
     * Is the template inherited from parent organization.
     */
    isInheritedTemplate: boolean;

    /**
     * Currently selected locale.
     */
    selectedLocale: string;

    /**
     * Callback for the delete/revert action.
     */
    onDeleteRequest: () => void;
}

/**
 * Component to render the danger zone for template management.
 * Can be used for both email and SMS templates.
 *
 * @param props - Component props
 * @returns ReactElement
 */
export const TemplateDangerZone: FunctionComponent<TemplateDangerZoneProps> = (
    props: TemplateDangerZoneProps
): ReactElement => {
    const {
        templateType,
        isSystemTemplate,
        isInheritedTemplate,
        selectedLocale,
        onDeleteRequest,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    // If the template is a system or inherited template, don't show the danger zone
    if (isSystemTemplate || isInheritedTemplate) {
        return null;
    }

    const dangerZoneProps = {
        actionTitle: t(`${templateType}Templates:dangerZone.action`),
        header: t(`${templateType}Templates:dangerZone.heading`),
        subheader: t(`${templateType}Templates:dangerZone.message`)
    };

    return (
        <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
            <DangerZone
                { ...dangerZoneProps }
                data-componentid={ `${componentId}-remove-${templateType}-template` }
                onActionClick={ onDeleteRequest }
            />
        </DangerZoneGroup>
    );
};

export default TemplateDangerZone;
