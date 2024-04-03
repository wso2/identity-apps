/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { DeploymentConfigInterface } from "../models/config";
import { DeploymentConfigContext } from "../context/deployment-config-context";

// eslint-disable-next-line @typescript-eslint/ban-types
type DeploymentConfigProviderPropsInterface = {};

/**
 * Deployment Configuration Provider.
 *
 * @param {React.PropsWithChildren<DeploymentConfigProviderPropsInterface>} props - Props injected to the component.
 * @returns {React.ReactElement}
 */
const DeploymentConfigProvider = (props: PropsWithChildren<DeploymentConfigProviderPropsInterface>): ReactElement => {

    const { children } = props;

    const [ deploymentConfig, setDeploymentConfig ] = useState<DeploymentConfigInterface | undefined>(undefined);

    return (
        <DeploymentConfigContext.Provider
            value={ {
                deploymentConfig,
                setDeploymentConfig
            } }
        >
            { children }
        </DeploymentConfigContext.Provider>
    );
};

export default DeploymentConfigProvider;
