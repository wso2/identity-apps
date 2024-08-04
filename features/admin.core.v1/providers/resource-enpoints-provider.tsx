/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, ReactElement, useState } from "react";
import { ResourceEndpointsInterface } from "../models/config";
import { ResourceEndpointsContext } from "../context/resource-endpoints-context";

// Define the interface for the resource endpoint provider.
interface ResourceEndpointsProviderPropsInterface {
    resourceEndpoints?: ResourceEndpointsInterface;
    setResourceEndpoints?: (endpoints: ResourceEndpointsInterface) => void;
}

/**
 * Resource endpoint Provider.
 *
 * @param {React.PropsWithChildren<ResourceEndpointsProviderPropsInterface>} props - Props injected to the component.
 * @returns {React.ReactElement}
 */
const ResourceEndpointsProvider = (props: PropsWithChildren<ResourceEndpointsProviderPropsInterface>): ReactElement => {

    const { children } = props;

    const [ resourceEndpoints, setResourceEndpoints ] = useState<ResourceEndpointsInterface>(undefined);

    return (
        <ResourceEndpointsContext.Provider
            value={ {
                resourceEndpoints,
                setResourceEndpoints
            } }
        >
            { children }
        </ResourceEndpointsContext.Provider>
    );
};

export default ResourceEndpointsProvider;
