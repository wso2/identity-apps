/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import React, { FC, ReactElement } from "react";
import { RedirectionTypes } from "../../../../models/steps";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./redirection-factory.scss";

/**
 * Props interface of {@link CommonStepFactory}
 */
export type RedirectionFactoryPropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Factory for creating redirection types.
 *
 * @param props - Props injected to the component.
 * @returns The RedirectionFactory component.
 */
export const RedirectionFactory: FC<RedirectionFactoryPropsInterface> = ({
    data,
    "data-componentid": componentId = "redirection-factory"
}: RedirectionFactoryPropsInterface): ReactElement => {
    if ((data?.action as any)?.executor?.name === RedirectionTypes.GoogleFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" height="20" />
                <Typography variant="body1">Google</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === RedirectionTypes.AppleFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId } className="flow-builder-redirection apple">
                <img src="https://www.svgrepo.com/show/494331/apple-round.svg" height="20" />
                <Typography variant="body1">Apple</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === RedirectionTypes.FacebookFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" height="20" />
                <Typography variant="body1">Facebook</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === RedirectionTypes.MicrosoftFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/448239/microsoft.svg" height="20" />
                <Typography variant="body1">Microsoft</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === RedirectionTypes.GithubFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId } className="flow-builder-redirection github">
                <img src="https://www.svgrepo.com/show/473620/github.svg" height="20" />
                <Typography variant="body1">Github</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === RedirectionTypes.PasskeyEnrollment) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/246819/fingerprint.svg" height="20" />
                <Typography variant="body1">Enroll Passkey</Typography>
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
