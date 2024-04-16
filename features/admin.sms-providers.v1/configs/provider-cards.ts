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

import { getSMSProviderIcons } from "../configs/ui";
import { SMSProviderCardInterface } from "../models";

export const providerCards: SMSProviderCardInterface[] = [
    { icon: getSMSProviderIcons().twilio, id: 1, key: "TwilioSMSProvider", name: "Twilio" },
    { icon: getSMSProviderIcons().vonage, id: 2, key: "VonageSMSProvider", name: "Vonage" },
    { icon: getSMSProviderIcons().custom, id: 3, key: "CustomSMSProvider", name: "Custom" }
];
