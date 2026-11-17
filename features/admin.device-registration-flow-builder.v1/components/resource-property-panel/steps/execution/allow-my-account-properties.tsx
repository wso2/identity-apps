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

import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Stack from "@oxygen-ui/react/Stack";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

const ALLOW_MY_ACCOUNT_META_KEY: string = "allowMyAccount";

/**
 * Props interface of {@link AllowMyAccountProperties}
 */
type AllowMyAccountPropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Setting of the user verification step that lets users start the device registration flow from My Account.
 *
 * @param props - Props injected to the component.
 * @returns AllowMyAccountProperties component.
 */
const AllowMyAccountProperties: FunctionComponent<AllowMyAccountPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "allow-my-account-properties",
    onChange
}: AllowMyAccountPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    // My Account is allowed unless the step disables it.
    const isMyAccountAllowed: boolean =
        resource?.data?.action?.executor?.meta?.[ ALLOW_MY_ACCOUNT_META_KEY ] !== "false";

    const handleAllowMyAccountChange: (event: ChangeEvent<HTMLInputElement>) => void = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(`action.executor.meta.${ ALLOW_MY_ACCOUNT_META_KEY }`, String(event.target.checked), resource);
    };

    return (
        <Stack direction="column" spacing={ 1 } sx={ { mt: 1 } } data-componentid={ componentId }>
            <FormControlLabel
                key={ `${ resource?.id }-${ ALLOW_MY_ACCOUNT_META_KEY }` }
                control={ (
                    <Checkbox
                        defaultChecked={ isMyAccountAllowed }
                        onChange={ handleAllowMyAccountChange }
                    />
                ) }
                label={ t("flows:core.executions.userVerification.allowMyAccountLabel") }
                data-componentid={ `${ componentId }-allow-my-account` }
            />
            <FormHelperText>
                { t("flows:core.executions.userVerification.allowMyAccountHint") }
            </FormHelperText>
        </Stack>
    );
};

export default AllowMyAccountProperties;
