/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import updateFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/update-flow-config";
import useAuthenticationFlowBuilderCore
    from "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import AuthenticationFlowBuilderCoreProvider
    from "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ReactFlowJsonObject, useReactFlow } from "@xyflow/react";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import configureDeviceRegistrationFlow from "../api/configure-device-registration-flow";
import ResourceProperties from "../components/resource-property-panel/resource-properties";
import ElementFactory from "../components/resources/elements/element-factory";
import DeviceRegistrationFlowConstants from "../constants/device-registration-flow-constants";
import DeviceRegistrationFlowBuilderContext from "../context/device-registration-flow-builder-context";
import { DeviceRegistrationFlowPayloadInterface } from "../models/flow";
import transformFlow from "../utils/transform-flow";

/**
 * Props interface of {@link DeviceRegistrationFlowBuilderProvider}
 */
type DeviceRegistrationFlowBuilderProviderProps = PropsWithChildren<unknown>;

/**
 * This component provides device registration flow builder related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The DeviceRegistrationFlowBuilderProvider component.
 */
const DeviceRegistrationFlowBuilderProvider: FunctionComponent<DeviceRegistrationFlowBuilderProviderProps> = ({
    children
}: DeviceRegistrationFlowBuilderProviderProps): ReactElement => {

    const screensList: PreviewScreenType[] = useMemo(() => ([
        PreviewScreenType.COMMON,
        PreviewScreenType.EMAIL_LINK_EXPIRY,
        PreviewScreenType.EMAIL_OTP,
        PreviewScreenType.SMS_OTP
    ]), []);

    return (
        <AuthenticationFlowBuilderCoreProvider
            ElementFactory={ ElementFactory }
            ResourceProperties={ ResourceProperties }
            flowType={ FlowTypes.DEVICE_REGISTRATION }
            screenTypes={ screensList }
        >
            <FlowContextWrapper>{ children }</FlowContextWrapper>
        </AuthenticationFlowBuilderCoreProvider>
    );
};

/**
 * This component wraps the flow context and provides necessary functions and state.
 *
 * @param props - Props injected to the component.
 * @returns The FlowContextWrapper component.
 */
const FlowContextWrapper: FunctionComponent<DeviceRegistrationFlowBuilderProviderProps> = ({
    children
}: DeviceRegistrationFlowBuilderProviderProps): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { toObject } = useReactFlow();
    const { flowCompletionConfigs } = useAuthenticationFlowBuilderCore();

    const [ isPublishing, setIsPublishing ] = useState<boolean>(false);

    const handlePublish = async (): Promise<boolean> => {
        setIsPublishing(true);

        const flow: ReactFlowJsonObject = toObject();

        if (!isEmpty(flowCompletionConfigs)) {
            try {
                await updateFlowConfig({
                    flowCompletionConfigs,
                    flowType: FlowTypes.DEVICE_REGISTRATION
                });
            } catch (_error) {
                dispatch(
                    addAlert({
                        description: t("flows:core.notifications.updateFlowConfig.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("flows:core.notifications.updateFlowConfig.genericError.message")
                    })
                );
            }
        }

        try {
            const deviceRegistrationFlow: DeviceRegistrationFlowPayloadInterface = {
                ...transformFlow(flow),
                flowType: DeviceRegistrationFlowConstants.DEVICE_REGISTRATION_FLOW_TYPE
            };

            await configureDeviceRegistrationFlow(deviceRegistrationFlow);

            dispatch(
                addAlert({
                    description: t("flows:deviceRegistration.notifications.updateFlow.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flows:deviceRegistration.notifications.updateFlow.success.message")
                })
            );

            return true;
        } catch (_error) {
            dispatch(
                addAlert({
                    description: t("flows:deviceRegistration.notifications.updateFlow.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:deviceRegistration.notifications.updateFlow.genericError.message")
                })
            );

            return false;
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <DeviceRegistrationFlowBuilderContext.Provider
            value={ {
                isPublishing,
                onPublish: handlePublish
            } }
        >
            { children }
        </DeviceRegistrationFlowBuilderContext.Provider>
    );
};

export default DeviceRegistrationFlowBuilderProvider;
