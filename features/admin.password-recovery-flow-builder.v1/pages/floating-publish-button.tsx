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
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import useGetFlowConfig from "@wso2is/admin.flows.v1/api/use-get-flow-config";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import classNames from "classnames";
import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import usePasswordRecoveryFlowBuilder from "../hooks/use-password-recovery-flow-builder";
import "./floating-publish-button.scss";

/**
 * Floating button for publishing the flow.
 *
 * @returns Floating button for publishing the flow.
 */
const FloatingPublishButton = (): ReactElement => {
    const { t } = useTranslation();
    const { isResourcePropertiesPanelOpen } = useAuthenticationFlowBuilderCore();
    const { data: flowConfig, error: flowConfigError } = useGetFlowConfig(FlowTypes.PASSWORD_RECOVERY);
    const dispatch: Dispatch = useDispatch();
    const { isPublishing, onPublish } = usePasswordRecoveryFlowBuilder();

    /**
     * Handle flow config fetch errors using useEffect
     */
    useEffect(() => {
        if (flowConfigError) {
            dispatch(addAlert<AlertInterface>({
                description: t("flows:passwordRecovery.notifications.fetchFlowConfig.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:passwordRecovery.notifications.fetchFlowConfig.genericError.message")
            }));
        }
    }, [ flowConfigError ]);

    return (
        <Button
            className={ classNames("floating-publish-button", { transition: isResourcePropertiesPanelOpen }) }
            variant="contained"
            loading={ isPublishing }
            onClick={ onPublish }
        >
            { flowConfig?.isEnabled ? t("common:publish") : t("common:saveDraft") }
        </Button>
    );
};

export default FloatingPublishButton;
