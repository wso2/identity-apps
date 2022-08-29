/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import {  FunctionComponent, SVGProps } from "react";
import { ReactComponent as BriefcaseIcon } from "../../../themes/default/assets/images/icons/briefcase-icon.svg";
import { ReactComponent as CertificateIcon } from "../../../themes/default/assets/images/icons/certificate-icon.svg";
import { ReactComponent as ClaimsIcon } from "../../../themes/default/assets/images/icons/claims-icon.svg";
import { ReactComponent as CogwheelIcon } from "../../../themes/default/assets/images/icons/cog-wheel-icon.svg";
import { ReactComponent as DatabaseIcon } from "../../../themes/default/assets/images/icons/database-icon.svg";
import { ReactComponent as PaperRocketIcon } from "../../../themes/default/assets/images/icons/paper-rocket-icon.svg";
import { ReactComponent as UserGroupIcon } from "../../../themes/default/assets/images/icons/user-group-icon.svg";
import { ReactComponent as UserIcon } from "../../../themes/default/assets/images/icons/user-icon.svg";
import {
    ReactComponent as SecurityIllustration
} from "../../../themes/default/assets/images/illustrations/security-illustration.svg";

export const getOverviewPageIllustrations = (): {
    jumbotronIllustration: FunctionComponent<SVGProps<SVGSVGElement>>;
    quickLinks: {
        certificates: FunctionComponent<SVGProps<SVGSVGElement>>;
        dialects: FunctionComponent<SVGProps<SVGSVGElement>>;
        emailTemplates: FunctionComponent<SVGProps<SVGSVGElement>>;
        generalConfigs: FunctionComponent<SVGProps<SVGSVGElement>>;
        groups: FunctionComponent<SVGProps<SVGSVGElement>>;
        roles: FunctionComponent<SVGProps<SVGSVGElement>>;
    },
    statsOverview: {
        groups: FunctionComponent<SVGProps<SVGSVGElement>>;
        users: FunctionComponent<SVGProps<SVGSVGElement>>;
        userstores: FunctionComponent<SVGProps<SVGSVGElement>>;
    }
} => {

    return {
        jumbotronIllustration: SecurityIllustration,
        quickLinks: {
            certificates: CertificateIcon,
            dialects: ClaimsIcon,
            emailTemplates: PaperRocketIcon,
            generalConfigs: CogwheelIcon,
            groups: UserGroupIcon,
            roles: BriefcaseIcon
        },
        statsOverview: {
            groups: UserGroupIcon,
            users: UserIcon,
            userstores: DatabaseIcon
        }
    };
};
