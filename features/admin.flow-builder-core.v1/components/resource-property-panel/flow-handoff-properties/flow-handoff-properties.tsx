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

import FormHelperText from "@oxygen-ui/react/FormHelperText";
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
const TARGET_URL_META_KEY: string = "targetUrl";
const DEFAULT_EXPIRY_TIME: string = "60";
const MAX_EXPIRY_TIME: number = 86400;
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

    const expiryTime: string = resource?.data?.action?.executor?.meta?.[ EXPIRY_TIME_META_KEY ]
        ?? DEFAULT_EXPIRY_TIME;
    const targetUrl: string = resource?.data?.action?.executor?.meta?.[ TARGET_URL_META_KEY ] ?? "";

    const handleExpiryTimeChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ EXPIRY_TIME_META_KEY }`, event.target.value.trim(), resource);
    };

    const handleTargetUrlChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ TARGET_URL_META_KEY }`, event.target.value.trim(), resource);
    };

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Stack direction="column" spacing={ 1 }>
                <Typography variant="body1">
                    { t("flows:core.executions.flowHandoff.expiryTimeLabel") }
                </Typography>
                <Stack direction="row" spacing={ 0.5 }>
                    <TextField
                        key={ resource?.id }
                        type="number"
                        aria-label="expiryTime"
                        name="expiryTime"
                        value={ expiryTime }
                        onChange={ handleExpiryTimeChange }
                        placeholder={ t("flows:core.executions.flowHandoff.expiryTimePlaceholder") }
                        inputProps={ { max: MAX_EXPIRY_TIME, min: 1 } }
                        data-componentid={ `${ componentId }-expiry-time` }
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={ { alignSelf: "center" } }>
                            secs
                    </Typography>
                </Stack>
                <FormHelperText>
                    { t("flows:core.executions.flowHandoff.expiryTimeHint") }
                </FormHelperText>
            </Stack>
            <Stack direction="column" spacing={ 1 }>
                <Typography variant="body1">
                    { t("flows:core.executions.flowHandoff.targetUrlLabel") }
                </Typography>
                <TextField
                    key={ `${ resource?.id }-target-url` }
                    type="url"
                    fullWidth
                    aria-label="targetUrl"
                    name="targetUrl"
                    value={ targetUrl }
                    onChange={ handleTargetUrlChange }
                    placeholder={ t("flows:core.executions.flowHandoff.targetUrlPlaceholder") }
                    inputProps={ { maxLength: MAX_META_VALUE_LENGTH } }
                    data-componentid={ `${ componentId }-target-url` }
                />
                <FormHelperText>
                    { t("flows:core.executions.flowHandoff.targetUrlHint") }
                </FormHelperText>
            </Stack>
        </Stack>
    );
};

export default FlowHandoffProperties;
