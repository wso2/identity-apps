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

import Badge from "@oxygen-ui/react/Badge";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "../../hooks/use-validation-status";
import Notification, { NotificationType } from "../../models/notification";
import { useAuthenticationFlowBuilderCore } from "../../public-api";
import "./validation-status-labels.scss";

/**
 * Props interface of {@link ValidationStatusLabelsPropsInterface}
 */
export interface ValidationStatusLabelsPropsInterface extends IdentifiableComponentInterface {}

const BellIcon = ({ height = 16, width = 16 }: { height?: number; width?: number }): ReactElement => {
    /* eslint-disable-next-line max-len */
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={ width } height={ height } fill="currentColor"><path d="M224 512c35.3 0 63.9-28.7 63.9-64H160.1c0 35.3 28.7 64 63.9 64zm215.4-149.7c-20.9-21.5-55.5-52.3-55.5-154.3 0-77.7-54.5-139.2-127.9-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v21c-73.4 16-127.9 77.5-127.9 155.2 0 102-34.6 132.8-55.5 154.3-6 6.2-8.9 14.4-8.9 22.6v25c0 12.1 9.8 22 21.9 22h383c12.1 0 21.9-9.9 21.9-22v-25c0-8.2-2.9-16.4-8.8-22.6z"/></svg>;
};

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

    const handleNotificationClick = (): void => {
        // Set active tab based on priority: Error (0) > Warning (1) > Info (2)
        let activeTab: number = 0;

        if (errorCount > 0) {
            activeTab = 0;
        } else if (warningCount > 0) {
            activeTab = 1;
        }

        setCurrentActiveTab(activeTab);
        setIsOpenResourcePropertiesPanel(false);
        setSelectedNotification(null);
        setOpenValidationPanel(true);
    };

    // Determine priority: Error > Warning > Info
    let badgeContent: number = 0;
    let badgeColor: "error" | "warning" | "info" = "info";

    if (errorCount > 0) {
        badgeContent = errorCount;
        badgeColor = "error";
    } else if (warningCount > 0) {
        badgeContent = warningCount;
        badgeColor = "warning";
    } else if (infoCount > 0) {
        badgeContent = infoCount;
        badgeColor = "info";
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            data-componentid={ componentId }
            className="flow-builder-validation-status-labels"
        >
            <Tooltip title={ t("flows:core.notificationPanel.trigger.label") }>
                <IconButton onClick={ handleNotificationClick }>
                    <BellIcon height={ 20 } width={ 20 } />
                    <Badge
                        badgeContent={ badgeContent }
                        color={ badgeColor }
                        overlap="circular"
                        sx={ {
                            "& .MuiBadge-badge": {
                                right: -6,
                                top: -12
                            }
                        } }
                    />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ValidationStatusLabels;
