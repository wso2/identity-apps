/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionComponent, ReactNode } from "react";
import { ReactComponent as SMSIcon } from "../../../themes/default/assets/images/icons/sms-icon.svg";
import { ReactComponent as TwilioLogo } from "../../../themes/default/assets/images/twilio-logo.svg";
import { ReactComponent as VonageLogo } from "../../../themes/default/assets/images/vonage-logo.svg";

// This is a temp flag to keep vonage logo hidden.
// remove this once explicit permission is granted to use vonage logo
const isVonageLogoVisible: boolean = false;

export const getSMSProviderIcons = (): {
    twilio: FunctionComponent | ReactNode;
    vonage: FunctionComponent | ReactNode;
    custom: FunctionComponent | ReactNode;
} => {
    return {
        custom: SMSIcon,
        twilio: TwilioLogo,
        vonage: isVonageLogoVisible ? VonageLogo : SMSIcon
    };
};
