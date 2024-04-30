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

import { NotificationItem } from "../common";

export interface aiNS{
    aiLoginFlow: {
        banner: {
            full:{
                heading: string;
                subheading: string;
                button: string;
            };
            input:{
                heading: string;
                subheading: string;
                placeholder: string;
                button: string;
            };
            collapsed:{
                heading: string;
                subheading: string;
                button: string;
            };

        };
        didYouKnow: string;
        notifications: {
            generateError: NotificationItem;
            generateInputError: NotificationItem;
            generateLimitError: NotificationItem;
            generateResultError: NotificationItem;
            generateResultFailed: NotificationItem;
            generateStatusError: NotificationItem;
            noAuthenticators: NotificationItem;
            rateLimitError: NotificationItem;
        };
        screens: {
            loading:{
                heading: string;
                facts:{
                    0: string;
                    1: string;
                    2: string;
                };
                states:{
                    0: string;
                    1: string;
                    2: string;
                    3: string;
                    4: string;
                    5: string;
                    6: string;
                    7: string;
                    8: string;
                    9: string;
                    10: string;
                };
            };
        };
        disclaimer: string;
        termsAndConditions: string;
        title: string;
    };
}
