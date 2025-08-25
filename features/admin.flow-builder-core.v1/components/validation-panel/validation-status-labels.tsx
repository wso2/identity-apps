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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "../../hooks/use-validation-status";
import Notification, { NotificationType } from "../../models/notification";
import "./validation-status-labels.scss";
import { useAuthenticationFlowBuilderCore } from "../../public-api";

/**
 * Props interface of {@link ValidationStatusLabelsPropsInterface}
 */
export interface ValidationStatusLabelsPropsInterface extends IdentifiableComponentInterface {}

/**
 * Component to render a list of validation status labels.
 *
 * @param props - Props injected to the component.
 * @returns The ValidationStatusLabels component.
 */
const ValidationStatusLabels: FunctionComponent<ValidationStatusLabelsPropsInterface> = ({
    "data-componentid": componentId = "validation-status-labels"
}: ValidationStatusLabelsPropsInterface): ReactElement => {
    const {
        notifications,
        setCurrentActiveTab,
        setOpenValidationPanel,
        setSelectedNotification
    } = useValidationStatus();
    const { setIsOpenResourcePropertiesPanel } = useAuthenticationFlowBuilderCore();
    const { t } = useTranslation();

    const errorCount: number = notifications?.filter(
        (notification: Notification) => notification.getType() === NotificationType.ERROR)?.length || 0;
    const warningCount: number = notifications?.filter(
        (notification: Notification) => notification.getType() === NotificationType.WARNING)?.length || 0;
    const infoCount: number = notifications?.filter(
        (notification: Notification) => notification.getType() === NotificationType.INFO)?.length || 0;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            data-componentid={ componentId }
            className="flow-builder-validation-status-labels"
            gap={ 1 }
        >
            {
                infoCount > 0 && (
                    <Button
                        color="info"
                        variant="contained"
                        className="info-button"
                        onClick={ () => {
                            setCurrentActiveTab(2);
                            setIsOpenResourcePropertiesPanel(false);
                            setSelectedNotification(null);
                            setOpenValidationPanel(true);
                        } }
                    >
                        { `${infoCount} ${t("flows:core.validationStatusLabels.info")}` }
                    </Button>
                )
            }
            {
                warningCount > 0 && (
                    <Button
                        color="warning"
                        variant="contained"
                        className="warning-button"
                        onClick={ () => {
                            setCurrentActiveTab(1);
                            setIsOpenResourcePropertiesPanel(false);
                            setSelectedNotification(null);
                            setOpenValidationPanel(true);
                        } }
                    >
                        { warningCount === 1 ?
                            `1 ${t("flows:core.validationStatusLabels.warning")}` :
                            `${warningCount} ${t("flows:core.validationStatusLabels.warnings")}` }
                    </Button>
                )
            }
            {
                errorCount > 0 && (
                    <Button
                        color="error"
                        variant="contained"
                        className="error-button"
                        onClick={ () => {
                            setCurrentActiveTab(0);
                            setIsOpenResourcePropertiesPanel(false);
                            setSelectedNotification(null);
                            setOpenValidationPanel(true);
                        } }
                    >
                        { errorCount === 1 ?
                            `1 ${t("flows:core.validationStatusLabels.error")}` :
                            `${errorCount} ${t("flows:core.validationStatusLabels.errors")}` }
                    </Button>
                )
            }
        </Box>
    );
};

export default ValidationStatusLabels;
