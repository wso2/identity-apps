/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { FunctionComponent, SVGProps } from "react";
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
    setupSocialConnections: FunctionComponent<SVGProps<SVGSVGElement>>
} => {

    return {
        onboardApplications: OnboardApplicationsIllustration,
        onboardUsers: OnboardUsersIllustration,
        setupSocialConnections: SetupSocialConnections
    };
};
