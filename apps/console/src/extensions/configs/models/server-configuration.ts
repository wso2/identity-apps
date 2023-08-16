/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ReactElement, ReactNode } from "react";
import { TFunction } from "react-i18next";
import { RequestErrorInterface, RequestResultInterface } from "../../../features/core/hooks/use-request";
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
        t: TFunction<"translation", undefined>
    ) => ReactElement;
    passwordExpiryComponent: (
        componentId: string,
        passwordExpiryEnabled: boolean,
        setPasswordExpiryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>
    ) => ReactElement;
    usePasswordExpiry: () => RequestResultInterface<GovernanceConnectorInterface, RequestErrorInterface>;
    processPasswordExpiryInitialValues: (
        initialValues: ValidationFormInterface,
        passwordExpiryTime: GovernanceConnectorInterface,
        setPasswordExpiryEnabled: (state: boolean) => void
    ) => PasswordExpiryInterface;
    processPasswordExpirySubmitData: (data: ValidationFormInterface) => Promise<any>;
}

export interface PasswordHistoryCountInterface extends ValidationFormInterface {
    passwordHistoryCount?: number | string;
    passwordHistoryCountEnabled?: boolean;
}

export interface PasswordExpiryInterface extends ValidationFormInterface {
    passwordExpiryTime?: number | string;
    passwordExpiryEnabled?: boolean;
}
