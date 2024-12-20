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

import FormHelperText from "@mui/material/FormHelperText";
import Box from "@oxygen-ui/react/Box";
import InputLabel from "@oxygen-ui/react/InputLabel";
import OutlinedInput from "@oxygen-ui/react/OutlinedInput";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Component } from "../../../../../models/component";

/**
 * Props interface of {@link OTPInputAdapter}
 */
export interface OTPInputAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the node.
     */
    nodeId: string;
    /**
     * The node properties.
     */
    node: Component;
}

/**
 * Adapter for the OTP inputs.
 *
 * @param props - Props injected to the component.
 * @returns The OTPInputAdapter component.
 */
export const OTPInputAdapter: FunctionComponent<OTPInputAdapterPropsInterface> = ({
    node
}: OTPInputAdapterPropsInterface): ReactElement => {
    return (
        <div className={ node.config?.field?.className }>
            <InputLabel htmlFor="otp-input-adapter" required={ node.config?.field?.required } disableAnimation>
                { node.config?.field?.label }
            </InputLabel>
            <Box display="flex" flexDirection="row" gap={ 1 }>
                { [ ...Array(6) ].map((_: number, index: number) => (
                    <OutlinedInput
                        key={ index }
                        size="small"
                        id="otp-input-adapter"
                        type={ node.config?.field?.type }
                        style={ node.config?.styles }
                        placeholder={ node.config?.field?.placeholder || "" }
                    />
                )) }
            </Box>
            { node.config?.field?.hint && (
                <FormHelperText id="otp-input-adapter-helper-text">{ node.config?.field?.hint }</FormHelperText>
            ) }
        </div>
    );
};

export default OTPInputAdapter;
