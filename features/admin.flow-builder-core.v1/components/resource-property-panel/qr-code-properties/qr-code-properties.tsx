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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { CommonResourcePropertiesPropsInterface } from "../resource-properties";

/**
 * Props interface of {@link QrCodeProperties}
 */
type QrCodePropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Smallest and largest size the accounts page draws, in pixels.
 */
const MIN_SIZE: number = 96;
const MAX_SIZE: number = 480;

/**
 * Properties of a QR code element: the data it encodes and its size.
 *
 * @param props - Props injected to the component.
 * @returns QrCodeProperties component.
 */
const QrCodeProperties: FunctionComponent<QrCodePropertiesPropsInterface> = ({
    resource,
    onChange,
    ["data-componentid"]: componentId = "qr-code-properties"
}: QrCodePropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <TextField
                key={ `${ resource?.id }-data` }
                fullWidth
                label={ t("flows:core.elements.qrCode.properties.data.label") }
                defaultValue={ resource?.config?.data ?? "" }
                helperText={ t("flows:core.elements.qrCode.properties.data.hint") }
                onChange={ (event: ChangeEvent<HTMLInputElement>): void =>
                    onChange("config.data", event.target.value, resource) }
                data-componentid={ `${ componentId }-data` }
            />
            <TextField
                key={ `${ resource?.id }-size` }
                fullWidth
                type="number"
                label={ t("flows:core.elements.qrCode.properties.size.label") }
                defaultValue={ resource?.config?.size ?? "" }
                helperText={ t("flows:core.elements.qrCode.properties.size.hint") }
                inputProps={ { max: MAX_SIZE, min: MIN_SIZE } }
                onChange={ (event: ChangeEvent<HTMLInputElement>): void => {
                    const size: number = parseInt(event.target.value, 10);

                    onChange("config.size", Number.isNaN(size) ? undefined : size, resource);
                } }
                data-componentid={ `${ componentId }-size` }
            />
        </Stack>
    );
};

export default QrCodeProperties;
