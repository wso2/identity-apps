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
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import {
    ReactComponent as DatabaseOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/database-outline.svg";
import {
    ReactComponent as ActiveDirectoryUserstoreIllustration
} from "../../../themes/default/assets/images/illustrations/ad-illustration.svg";
import {
    ReactComponent as CustomApplicationTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/custom-app-illustration.svg";
import {
    ReactComponent as JDBCUserstoreIllustration
} from "../../../themes/default/assets/images/illustrations/jdbc-illustration.svg";
import {
    ReactComponent as LDAPUserstoreIllustration
} from "../../../themes/default/assets/images/illustrations/ldap-illustration.svg";

export const getAddUserstoreWizardStepIcons  = (): {
    general: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        general: DocumentIcon
    };
};

export const getDatabaseAvatarGraphic  = (): FunctionComponent<SVGProps<SVGSVGElement>> => {

    return DatabaseOutlineIcon;
};

export const getUserstoreTemplateIllustrations = (): {
    ad: FunctionComponent<SVGProps<SVGSVGElement>>;
    default: FunctionComponent<SVGProps<SVGSVGElement>>;
    jdbc: FunctionComponent<SVGProps<SVGSVGElement>>;
    ldap: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        ad: ActiveDirectoryUserstoreIllustration,
        default: CustomApplicationTemplateIllustration,
        jdbc: JDBCUserstoreIllustration,
        ldap: LDAPUserstoreIllustration
    };
};

export const getTableIcons = (): {
    header: {
        default: FunctionComponent<SVGProps<SVGSVGElement>>;
    }
} => {

    return {
        header: {
            default: DatabaseOutlineIcon
        }
    };
};
