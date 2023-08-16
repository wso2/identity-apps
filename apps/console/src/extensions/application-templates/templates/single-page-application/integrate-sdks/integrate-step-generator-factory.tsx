/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { JavaScriptSDKIntegrateSteps } from "./javascript";
import { ReactSDKIntegrateSteps } from "./react";
import { SDKInitConfig } from "../../../shared";
import { SupportedSPATechnologyTypes } from "../models";

/**
 * Interface for SDK integrate step generator component.
 */
interface IntegrateStepGeneratorFactoryPropsInterface extends IdentifiableComponentInterface {
    configurationOptions: (heading?: ReactNode) => ReactElement;
    sdkConfig: SDKInitConfig;
    technology: SupportedSPATechnologyTypes;
    productName: string;
}

/**
 * Integrate SDKs Step generator factory.
 *
 * returns Integrate SDKs Step generator component.
 */
export const IntegrateStepGeneratorFactory: FunctionComponent<IntegrateStepGeneratorFactoryPropsInterface> = (
    props: IntegrateStepGeneratorFactoryPropsInterface
): ReactElement => {

    const {
        configurationOptions,
        sdkConfig,
        technology,
        productName
    } = props;

    switch (technology) {
        case SupportedSPATechnologyTypes.REACT:
            return (
                <ReactSDKIntegrateSteps
                    sdkConfig={ sdkConfig }
                    productName={ productName }
                    configurationOptions={ configurationOptions }
                />
            );
        case SupportedSPATechnologyTypes.JAVASCRIPT:
            return (
                <JavaScriptSDKIntegrateSteps
                    sdkConfig={ sdkConfig }
                    productName={ productName }
                    configurationOptions={ configurationOptions }
                />
            );
    }
};

/**
 * Default props for the component
 */
IntegrateStepGeneratorFactory.defaultProps = {
    "data-componentid": "integrate-sdk-step-generator-factory"
};
