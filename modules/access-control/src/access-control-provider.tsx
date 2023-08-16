/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { AccessProvider } from "react-access-control";
import { AccessControlContext } from "./access-control-context-provider";

/**
 * Interface to store Access Control Provider props
 */
export interface AccessControlProviderInterface {
    featureConfig: any; // TODO : Properly map FeatureConfigInterface type
    allowedScopes: string;
}

/**
 * This will wrap all children passed to it with access control provider
 * with context generated using the scopes received.
 *
 * @param props - Props injected to the component.
 * @returns Access Control Provider component.
 */
export const AccessControlProvider: FunctionComponent<PropsWithChildren<AccessControlProviderInterface>> = (
    props: PropsWithChildren<AccessControlProviderInterface>
): ReactElement => {

    const {
        allowedScopes,
        children,
        featureConfig
    } = props;

    return (
        <AccessProvider>
            <AccessControlContext allowedScopes={ allowedScopes } featureConfig={ featureConfig }>
                { children }
            </AccessControlContext>
        </AccessProvider>
    );

};
