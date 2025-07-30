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
import { useTranslation } from "react-i18next";
import { ExecutionTypes } from "../../../../models/steps";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./execution-factory.scss";

/**
 * Props interface of {@link CommonStepFactory}
 */
export type ExecutionFactoryPropsInterface = Pick<CommonStepFactoryPropsInterface, "data"> &
    IdentifiableComponentInterface;

/**
 * Factory for creating execution types.
 *
 * @param props - Props injected to the component.
 * @returns The ExecutionFactory component.
 */
export const ExecutionFactory: FC<ExecutionFactoryPropsInterface> = ({
    data,
    "data-componentid": componentId = "execution-factory"
}: ExecutionFactoryPropsInterface): ReactElement => {
    const { t } = useTranslation();

    if ((data?.action as any)?.executor?.name === ExecutionTypes.GoogleFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" height="20" />
                <Typography variant="body1">{ t("flows:core.executions.names.google") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.AppleFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId } className="flow-builder-execution apple">
                <img src="https://www.svgrepo.com/show/494331/apple-round.svg" height="20" />
                <Typography variant="body1">{ t("flows:core.executions.names.apple") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.FacebookFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" height="20" />
                <Typography variant="body1">{ t("flows:core.executions.names.facebook") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.MicrosoftFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/448239/microsoft.svg" height="20" />
                <Typography variant="body1">{ t("flows:core.executions.names.microsoft") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.GithubFederation) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId } className="flow-builder-execution github">
                <img src="https://www.svgrepo.com/show/473620/github.svg" height="20" />
                <Typography variant="body1">{ t("flows:core.executions.names.github") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.PasskeyEnrollment) {
        return (
            <Box display="flex" gap={ 1 } data-componentid={ componentId }>
                <img src="https://www.svgrepo.com/show/246819/fingerprint.svg" height="20" />
                <Typography variant="body1">{ t("flows:core.executions.names.passkeyEnrollment") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.MagicLinkExecutor) {
        return (
            <Box
                display="flex"
                gap={ 1 }
                data-componentid={ componentId }
                className="flow-builder-execution magic-link"
            >
                <img src="https://www.svgrepo.com/show/524687/link.svg" height="20"/>
                <Typography variant="body1">{ t("flows:core.executions.names.magicLink") }</Typography>
            </Box>
        );
    }

    if ((data?.action as any)?.executor?.name === ExecutionTypes.ConfirmationCode) {
        return (
            <Box
                display="flex"
                gap={ 1 }
                data-componentid={ componentId }
                className="flow-builder-execution confirmation-code"
            >
                <img src="https://www.svgrepo.com/show/468264/check-mark-square-2.svg" height="20"/>
                <Typography variant="body1">{ t("flows:core.executions.names.confirmationCode") }</Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" gap={ 1 } data-componentid={ componentId }>
            <Typography variant="body1">{ t("flows:core.executions.names.default") }</Typography>
        </Box>
    );
};

export default ExecutionFactory;
