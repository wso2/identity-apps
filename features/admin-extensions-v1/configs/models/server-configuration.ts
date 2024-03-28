/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ReactElement, ReactNode } from "react";
import { TFunction } from "react-i18next";
import { RequestErrorInterface, RequestResultInterface } from "../../../features/core/hooks/use-request";
import { GovernanceConnectorInterface } from "../../../features/server-configurations";
import { ValidationFormInterface } from "../../../features/validation/models";

export interface ServerConfigurationConfig {
    autoEnableConnectorToggleProperty: boolean;
    backButtonDisabledConnectorIDs: string[];
    connectorCategoriesToHide: string[];
    connectorCategoriesToShow: string[];
    connectorPropertiesToShow: string[];
    connectorToggleName: Record<string, string>;
    connectorsToShow: string[];
    connectorStatusViewDisabledConnectorIDs: string[];
    connectorsToHide: string[];
    customConnectors: string[];
    extendedConnectors: string[];
    predefinedConnectorCategories: string[];
    dynamicConnectors: boolean,
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
    usePasswordHistory: () => RequestResultInterface<GovernanceConnectorInterface, RequestErrorInterface>;
    processInitialValues: (
        initialValues: ValidationFormInterface,
        passwordHistoryCount: GovernanceConnectorInterface,
        setPasswordHistoryEnabled: (state: boolean) => void
    ) => PasswordHistoryCountInterface;
    processPasswordCountSubmitData: (data: ValidationFormInterface) => Promise<any>;
    passwordHistoryCountComponent: (
        componentId: string,
        passwordHistoryEnabled: boolean,
        setPasswordHistoryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>,
        isReadOnly?: boolean
    ) => ReactElement;
    passwordExpiryComponent: (
        componentId: string,
        passwordExpiryEnabled: boolean,
        setPasswordExpiryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>,
        isReadOnly?: boolean
    ) => ReactElement;
    usePasswordExpiry: () => RequestResultInterface<GovernanceConnectorInterface, RequestErrorInterface>;
    processPasswordExpiryInitialValues: (
        initialValues: ValidationFormInterface,
        passwordExpiryTime: GovernanceConnectorInterface,
        setPasswordExpiryEnabled: (state: boolean) => void
    ) => PasswordExpiryInterface;
    processPasswordExpirySubmitData: (data: ValidationFormInterface) => Promise<any>;
    processPasswordPoliciesSubmitData: (data: ValidationFormInterface, isLegacy: boolean) => Promise<void>;
}

export interface PasswordHistoryCountInterface extends ValidationFormInterface {
    passwordHistoryCount?: number | string;
    passwordHistoryCountEnabled?: boolean;
}

export interface PasswordExpiryInterface extends ValidationFormInterface {
    passwordExpiryTime?: number | string;
    passwordExpiryEnabled?: boolean;
}

export interface PasswordPoliciesInterface extends ValidationFormInterface {
    passwordExpiryTime?: number | string;
    passwordExpiryEnabled?: boolean;
    passwordHistoryCount?: number | string;
    passwordHistoryCountEnabled?: boolean;
}
