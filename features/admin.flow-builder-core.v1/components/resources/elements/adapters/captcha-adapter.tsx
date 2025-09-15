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

import Box from "@oxygen-ui/react/Box/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import RecaptchaBadge from "../../../../assets/recaptcha-badge.svg";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link CaptchaAdapter}
 */
export type CaptchaAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for Captcha component.
 *
 * @param props - Props injected to the component.
 * @returns The CaptchaAdapter component.
 */
const CaptchaAdapter: FunctionComponent<CaptchaAdapterPropsInterface> = ({
    resource
}: CaptchaAdapterPropsInterface): ReactElement => (
    <Box display="flex" alignItems="center" justifyContent="center">
        <img
            src={ RecaptchaBadge }
            alt={ resource?.config?.alt }
            width="100%"
        />
    </Box>
);

export default CaptchaAdapter;
