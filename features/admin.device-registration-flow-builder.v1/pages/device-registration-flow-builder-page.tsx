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

import FlowBuilderPage from
    "@wso2is/admin.flow-builder-core.v1/components/flow-builder-page-skeleton/flow-builder-page";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import DeviceRegistrationFlowBuilder from "../components/device-registration-flow-builder";
import useDeviceRegistrationFlowBuilder from "../hooks/use-device-registration-flow-builder";
import DeviceRegistrationFlowBuilderProvider from "../providers/device-registration-flow-builder-provider";

/**
 * Props interface of {@link DeviceRegistrationFlowBuilderPage}
 */
export type DeviceRegistrationFlowBuilderPageProps = IdentifiableComponentInterface & PropsWithChildren;

/**
 * Wraps the `DeviceRegistrationFlowBuilderPage` with the required context providers.
 *
 * @param props - Props injected to the component.
 * @returns PageWithContext component.
 */
const DeviceRegistrationFlowBuilderPageWithContext: FunctionComponent<DeviceRegistrationFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId,
    children
}: DeviceRegistrationFlowBuilderPageProps): ReactElement => {
    const { t } = useTranslation();
    const { isPublishing, onPublish } = useDeviceRegistrationFlowBuilder();
    const { setRefetchFlow } = useAuthenticationFlowBuilderCore();

    return (
        <FlowBuilderPage
            data-componentid={ componentId }
            flowType={ FlowTypes.DEVICE_REGISTRATION }
            flowTypeDisplayName={ t("flows:deviceRegistration.flowDisplayName") }
            isPublishing={ isPublishing }
            onPublish={ onPublish }
            onRevert={ () => setRefetchFlow(true) }
        >
            { children }
        </FlowBuilderPage>
    );
};

/**
 * Landing page for the Device Registration Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns DeviceRegistrationFlowBuilderPage component.
 */
const DeviceRegistrationFlowBuilderPage: FunctionComponent<DeviceRegistrationFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "device-registration-flow-builder-page"
}: DeviceRegistrationFlowBuilderPageProps): ReactElement => (
    <DeviceRegistrationFlowBuilderProvider>
        <DeviceRegistrationFlowBuilderPageWithContext data-componentid={ componentId }>
            <DeviceRegistrationFlowBuilder />
        </DeviceRegistrationFlowBuilderPageWithContext>
    </DeviceRegistrationFlowBuilderProvider>
);

export default DeviceRegistrationFlowBuilderPage;
