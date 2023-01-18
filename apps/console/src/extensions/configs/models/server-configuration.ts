/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AxiosError } from "axios";
import { ReactElement, ReactNode } from "react";
import { RequestErrorInterface } from "../../../features/core/hooks/use-request";
import { GovernanceConnectorInterface } from "../../../features/server-configurations";
import { ValidationFormInterface } from "../../../features/validation/models";

export interface ServerConfigurationConfig {
    autoEnableConnectorToggleProperty: boolean;
    connectorPropertiesToShow: string[];
    connectorToggleName: Record<string, string>;
    connectorsToShow: string[];
    intendSettings: boolean;
    renderConnector: (
        connector: GovernanceConnectorInterface,
        connectorForm: ReactElement,
        connectorIllustration: string,
        connectorTitle: ReactNode,
        connectorSubHeading: ReactNode,
        message: ReactNode
    ) => ReactElement;
    renderConnectorWithinEmphasizedSegment: boolean;
    showConnectorsOnTheSidePanel: boolean;
    showGovernanceConnectorCategories: boolean;
    showPageHeading: boolean;
    usePasswordHistory: () => { data: GovernanceConnectorInterface, error: AxiosError<RequestErrorInterface>, isLoading: boolean; };
    processInitialValues: (
        initialValues: ValidationFormInterface,
        passwordHistoryCount: GovernanceConnectorInterface
    ) => PasswordHistoryCountInterface;
    processPasswordCountSubmitData: (data: ValidationFormInterface) => Promise<any>;
    passwordHistoryCountComponent: ReactElement;
}

export interface PasswordHistoryCountInterface extends ValidationFormInterface {
    passwordHistoryCount: number;
    passwordHistoryCountEnabled: boolean;
}
