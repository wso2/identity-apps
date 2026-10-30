/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { CommonResourcePropertiesPropsInterface } from "../resource-properties";

/**
 * Props interface of {@link AuthsignalProperties}
 */
type AuthsignalPropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Executor metadata key holding the action code of the Authsignal flow to run.
 */
export const AUTHSIGNAL_FLOW_REF_PROPERTY_KEY: string = "action.executor.meta.flowRef";

/**
 * Properties of a step using the Authsignal executor.
 *
 * @param props - Props injected to the component.
 * @returns AuthsignalProperties component.
 */
const AuthsignalProperties: FunctionComponent<AuthsignalPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "authsignal-properties",
    onChange
}: AuthsignalPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const flowRef: string = (resource?.data?.action?.executor?.meta?.flowRef as string) ?? "";

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                { t("flows:core.executions.authsignal.description") }
            </Typography>
            <TextField
                // Remount per step so the uncontrolled value follows the selected step.
                key={ resource?.id }
                fullWidth
                size="small"
                label={ t("flows:core.executions.authsignal.flowRef.label") }
                placeholder={ t("flows:core.executions.authsignal.flowRef.placeholder") }
                helperText={ t("flows:core.executions.authsignal.flowRef.hint") }
                defaultValue={ flowRef }
                onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                    onChange(AUTHSIGNAL_FLOW_REF_PROPERTY_KEY, event.target.value.trim(), resource)
                }
                data-componentid={ `${componentId}-flow-ref` }
            />
        </Stack>
    );
};

export default AuthsignalProperties;
