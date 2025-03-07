/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { RedirectionTypes } from "../../../../models/steps";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";

/**
 * Props interface of {@link CommonStepFactory}
 */
export type RedirectionFactoryPropsInterface = IdentifiableComponentInterface & CommonStepFactoryPropsInterface;

/**
 * Factory for creating redirection types.
 *
 * @param props - Props injected to the component.
 * @returns The RedirectionFactory component.
 */
export const RedirectionFactory: FunctionComponent<RedirectionFactoryPropsInterface> = ({
    resource,
    data,
    "data-componentid": componentId = "redirection-factory"
}: RedirectionFactoryPropsInterface): ReactElement => {
    if ((data?.action as any)?.executor?.name === RedirectionTypes.Google) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" height="20" />
                <Typography variant="body1">Google</Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" gap={ 1 } data-componentid={ componentId }>
            <Typography variant="body1">Redirection</Typography>
        </Box>
    );
};

export default RedirectionFactory;
