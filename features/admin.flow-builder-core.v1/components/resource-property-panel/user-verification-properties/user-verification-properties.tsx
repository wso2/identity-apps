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

const TOKEN_VALIDITY_PERIOD_META_KEY: string = "tokenValidityPeriod";
const DEFAULT_TOKEN_VALIDITY_PERIOD: string = "5";
const MAX_TOKEN_VALIDITY_PERIOD: number = 10080;

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

    const tokenValidityPeriod: string = resource?.data?.action?.executor?.meta?.[ TOKEN_VALIDITY_PERIOD_META_KEY ]
        ?? DEFAULT_TOKEN_VALIDITY_PERIOD;

    const handleTokenValidityPeriodChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ TOKEN_VALIDITY_PERIOD_META_KEY }`, event.target.value.trim(), resource);
    };

    return (
        <Stack direction="column" spacing={ 1 } data-componentid={ componentId }>
            <Typography variant="body1">
                { t("flows:core.executions.userVerification.tokenValidityPeriodLabel") }
            </Typography>
            <Stack direction="row" spacing={ 0.5 }>
                <TextField
                    key={ resource?.id }
                    type="number"
                    aria-label="tokenValidityPeriod"
                    name="tokenValidityPeriod"
                    value={ tokenValidityPeriod }
                    onChange={ handleTokenValidityPeriodChange }
                    placeholder={ t("flows:core.executions.userVerification.tokenValidityPeriodPlaceholder") }
                    inputProps={ { max: MAX_TOKEN_VALIDITY_PERIOD, min: 1 } }
                    data-componentid={ `${ componentId }-token-validity-period` }
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={ { alignSelf: "center" } }>
                        mins
                </Typography>
            </Stack>
            <FormHelperText>
                { t("flows:core.executions.userVerification.tokenValidityPeriodHint") }
            </FormHelperText>
        </Stack>
    );
};

export default UserVerificationProperties;
