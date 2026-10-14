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
import {
    CommonResourcePropertiesPropsInterface
} from "../resource-properties";

const EXPIRY_TIME_META_KEY: string = "expiryTime";
const PORTAL_URL_META_KEY: string = "portalUrl";
const MAX_META_VALUE_LENGTH: number = 255;

/**
 * Props interface of {@link FlowHandoffProperties}
 */
type FlowHandoffPropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Flow Handoff properties component for the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns FlowHandoffProperties component.
 */
const FlowHandoffProperties: FunctionComponent<FlowHandoffPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "flow-handoff-properties",
    onChange
}: FlowHandoffPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const expiryTime: string = resource?.data?.action?.executor?.meta?.[ EXPIRY_TIME_META_KEY ] ?? "";
    const portalUrl: string = resource?.data?.action?.executor?.meta?.[ PORTAL_URL_META_KEY ] ?? "";

    const handleExpiryTimeChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ EXPIRY_TIME_META_KEY }`, event.target.value.trim(), resource);
    };

    const handlePortalUrlChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ PORTAL_URL_META_KEY }`, event.target.value.trim(), resource);
    };

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                { t("flows:core.executions.flowHandoff.configurationHint") }
            </Typography>
            <TextField
                key={ resource?.id }
                type="number"
                size="small"
                fullWidth
                label={ t("flows:core.executions.flowHandoff.expiryTimeLabel") }
                placeholder="60"
                value={ expiryTime }
                helperText={ t("flows:core.executions.flowHandoff.expiryTimeHint") }
                inputProps={ { min: 1, step: 1 } }
                onChange={ handleExpiryTimeChange }
                data-componentid={ `${ componentId }-expiry-time` }
            />
            <TextField
                key={ `${ resource?.id }-portal-url` }
                type="url"
                size="small"
                fullWidth
                label={ t("flows:core.executions.flowHandoff.portalUrlLabel") }
                placeholder="https://"
                value={ portalUrl }
                helperText={ t("flows:core.executions.flowHandoff.portalUrlHint") }
                inputProps={ { maxLength: MAX_META_VALUE_LENGTH } }
                onChange={ handlePortalUrlChange }
                data-componentid={ `${ componentId }-portal-url` }
            />
        </Stack>
    );
};

export default FlowHandoffProperties;
