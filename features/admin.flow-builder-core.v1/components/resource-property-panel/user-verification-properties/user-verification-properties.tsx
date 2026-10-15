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

const MAX_TOKEN_AGE_META_KEY: string = "maxTokenAge";

/**
 * Props interface of {@link UserVerificationProperties}
 */
type UserVerificationPropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * User Verification properties component for the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns UserVerificationProperties component.
 */
const UserVerificationProperties: FunctionComponent<UserVerificationPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "user-verification-properties",
    onChange
}: UserVerificationPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const maxTokenAge: string = resource?.data?.action?.executor?.meta?.[ MAX_TOKEN_AGE_META_KEY ] ?? "";

    const handleMaxTokenAgeChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ MAX_TOKEN_AGE_META_KEY }`, event.target.value.trim(), resource);
    };

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                { t("flows:core.executions.userVerification.configurationHint") }
            </Typography>
            <TextField
                key={ resource?.id }
                type="number"
                size="small"
                fullWidth
                label={ t("flows:core.executions.userVerification.maxTokenAgeLabel") }
                placeholder="300"
                value={ maxTokenAge }
                helperText={ t("flows:core.executions.userVerification.maxTokenAgeHint") }
                inputProps={ { min: 1, step: 1 } }
                onChange={ handleMaxTokenAgeChange }
                data-componentid={ `${ componentId }-max-token-age` }
            />
        </Stack>
    );
};

export default UserVerificationProperties;
