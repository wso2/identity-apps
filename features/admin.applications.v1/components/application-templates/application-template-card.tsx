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

import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classnames from "classnames";
import React, { FunctionComponent, MouseEvent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationTemplateConstants } from "../../constants/application-templates";
import {
    ApplicationTemplateListInterface,
    CustomAttributeInterface,
    SupportedTechnologyMetadataInterface
} from "../../models/application-templates";
import "./application-template-card.scss";
import { ApplicationTemplateManagementUtils } from "../../utils/application-template-management-utils";

/**
 * Props for the application template card component.
 */
export interface ApplicationTemplateCardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback function triggered upon clicking on the application template card.
     *
     * @param e - Click event.
     */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /**
     * Details needed to render the application template card.
     */
    template: ApplicationTemplateListInterface;
}

/**
 * Application template card component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application template card component.
 */
const ApplicationTemplateCard: FunctionComponent<ApplicationTemplateCardPropsInterface> = (
    props: ApplicationTemplateCardPropsInterface
): ReactElement => {
    const {
        template,
        onClick,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    /**
     * Extract the supported technology details related to the current application template.
     */
    const supportedTechnologies: SupportedTechnologyMetadataInterface[] = useMemo(() => {
        if (!template?.customAttributes ||
            !Array.isArray(template?.customAttributes) ||
            template?.customAttributes?.length <= 0) {

            return [];
        }

        const property: CustomAttributeInterface =  template?.customAttributes?.find(
            (property: CustomAttributeInterface) =>
                property?.key === ApplicationTemplateConstants.SUPPORTED_TECHNOLOGIES_ATTRIBUTE_KEY
        );

        return property?.value ? JSON.parse(property?.value) : [];
    }, [ template ]);

    /**
     * Check whether the current application template should be displayed as a 'coming soon' template.
     */
    const comingSoon: boolean = useMemo(() => {
        if (!template?.customAttributes
            || !Array.isArray(template?.customAttributes)
            || template?.customAttributes?.length <= 0) {

            return false;
        }

        const property: CustomAttributeInterface = template?.customAttributes.find(
            (property: CustomAttributeInterface) =>
                property?.key === ApplicationTemplateConstants.COMING_SOON_ATTRIBUTE_KEY
        );

        return property?.value === "true";
    }, [ template ]);

    return (
        <Card
            key={ template?.id }
            className={ classnames("application-template", { disabled: comingSoon }) }
            onClick={
                (e: MouseEvent<HTMLDivElement>) => {
                    if (!comingSoon) {
                        onClick(e);
                    }
                }
            }
            data-componentid={ `${componentId}-${template?.id}` }
        >
            {
                comingSoon
                    ? (
                        <div className="application-template-coming-soon-ribbon">
                            { t("common:comingSoon") }
                        </div>
                    )
                    : null
            }
            <CardContent className="application-template-header">
                <div className="application-template-image-container">
                    <img
                        className="application-template-image"
                        src={ ApplicationTemplateManagementUtils.resolveApplicationResourcePath(template?.image) }
                        loading="lazy"
                    />
                </div>
                <div>
                    <Typography variant="h6">
                        { template.name }
                    </Typography>
                </div>
            </CardContent>
            <CardContent className="application-template-body">
                <Tooltip title={ template?.description }>
                    <div className="application-template-description">
                        <Typography variant="body2" color="text.secondary">
                            { template.description }
                        </Typography>
                    </div>
                </Tooltip>
                { supportedTechnologies?.length > 0 && (
                    <AvatarGroup className="application-template-supported-technologies" max={ 10 }>
                        { supportedTechnologies.map(
                            (technology: SupportedTechnologyMetadataInterface) => (
                                <Avatar
                                    sx={ { height: 20, width: 20 } }
                                    key={ technology?.displayName }
                                    className="application-template-supported-technology"
                                    alt={ technology?.displayName }
                                    src={
                                        ApplicationTemplateManagementUtils
                                            .resolveApplicationResourcePath(technology?.logo)
                                    }
                                />
                            )
                        ) }
                    </AvatarGroup>
                ) }
            </CardContent>
        </Card>
    );
};

/**
 * Default props for the component.
 */
ApplicationTemplateCard.defaultProps = {
    "data-componentid": "application-template-card"
};

export default ApplicationTemplateCard;
