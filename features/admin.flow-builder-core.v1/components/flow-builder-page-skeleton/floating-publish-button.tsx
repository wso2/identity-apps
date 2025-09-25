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

import Button from "@oxygen-ui/react/Button";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import classNames from "classnames";
import React, { FC, HTMLAttributes, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetFlowConfig from "../../api/use-get-flow-config";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import useValidationStatus from "../../hooks/use-validation-status";
import "./floating-publish-button.scss";

/**
 * Props interface of {@link FloatingPublishButton}
 */
export interface FloatingPublishButtonProps extends IdentifiableComponentInterface, HTMLAttributes<HTMLDivElement>  {
    flowType: any;
    flowTypeDisplayName: string;
    isPublishing: boolean;
    onPublish: any;
}

/**
 * Publish button for the for the flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns FloatingPublishButton component.
 */
const FloatingPublishButton: FC<FloatingPublishButtonProps> = ({
    ["data-componentid"]: componentId = "flow-builder-page-publish-button",
    className,
    flowType,
    flowTypeDisplayName,
    isPublishing,
    onPublish
}: FloatingPublishButtonProps): ReactElement => {
    const { t } = useTranslation();
    const { isResourcePropertiesPanelOpen } = useAuthenticationFlowBuilderCore();
    const { openValidationPanel, isValid } = useValidationStatus();
    const { data: flowConfig, error: flowConfigError } = useGetFlowConfig(flowType);
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        if (flowConfigError) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("flows:core.notifications.fetchFlowConfig.genericError.description", {
                        flowType: flowTypeDisplayName
                    }),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.fetchFlowConfig.genericError.message", {
                        flowType: flowTypeDisplayName
                    })
                })
            );
        }
    }, [ flowConfigError ]);

    return (
        <Button
            className={ classNames("floating-publish-button", {
                transition: isResourcePropertiesPanelOpen || openValidationPanel
            }, className) }
            variant="contained"
            loading={ isPublishing }
            onClick={ onPublish }
            disabled={ !isValid }
            data-componentid={ componentId }
        >
            { flowConfig?.isEnabled ? t("common:publish") : t("common:saveDraft") }
        </Button>
    );
};

export default FloatingPublishButton;
