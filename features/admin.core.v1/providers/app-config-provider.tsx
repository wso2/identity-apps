/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, ReactElement } from "react";
import DeploymentConfigProvider from "./deployment-config-provider";
import ResourceEndpointsProvider from "./resource-enpoints-provider";
import UIConfigProvider from "./ui-config-provider";

// eslint-disable-next-line @typescript-eslint/ban-types
type AppConfigProviderPropsInterface = {};

/**
 * App Configuration Provider.
 *
 * @param {React.PropsWithChildren<AppConfigProviderPropsInterface>} props - Props injected to the component.
 * @returns {React.ReactElement}
 */
export const AppConfigProvider = (props: PropsWithChildren<AppConfigProviderPropsInterface>): ReactElement => {

    const { children } = props;

    return (
        <DeploymentConfigProvider>
            <ResourceEndpointsProvider>
                <UIConfigProvider>
                    { children }
                </UIConfigProvider>
            </ResourceEndpointsProvider>
        </DeploymentConfigProvider>
    );
};
