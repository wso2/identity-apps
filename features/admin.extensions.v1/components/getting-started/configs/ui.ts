/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { FunctionComponent, SVGProps } from "react";
import {
    ReactComponent as TryItAppIllustration
} from "../../../assets/illustrations/asgardeo-rafiki-illustration.svg";
import {
    ReactComponent as OnboardUsersIllustration
} from "../../../assets/images/illustrations/onboard-users-illustration.svg";
import {
    ReactComponent as OnboardApplicationsIllustration
} from "../../../assets/images/illustrations/register-applications-illustration.svg";
import {
    ReactComponent as SetupSocialConnections
} from "../../../assets/images/illustrations/setup-social-connections-illustration.svg";

export const getGettingStartedCardIllustrations = (): {
    onboardApplications: FunctionComponent<SVGProps<SVGSVGElement>>;
    onboardUsers: FunctionComponent<SVGProps<SVGSVGElement>>;
    setupSocialConnections: FunctionComponent<SVGProps<SVGSVGElement>>;
    tryItApplication: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        onboardApplications: OnboardApplicationsIllustration,
        onboardUsers: OnboardUsersIllustration,
        setupSocialConnections: SetupSocialConnections,
        tryItApplication: TryItAppIllustration
    };
};
