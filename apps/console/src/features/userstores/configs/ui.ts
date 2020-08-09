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

import { ReactComponent as DatabaseAvatar } from "../../../themes/default/assets/images/icons/database-avatar.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
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

export const AddUserstoreWizardStepIcons = {
    general: DocumentIcon
};

export const DatabaseAvatarGraphic = DatabaseAvatar;

export const UserstoreTemplateIllustrations = {
    ad: ActiveDirectoryUserstoreIllustration,
    default: CustomApplicationTemplateIllustration,
    jdbc: JDBCUserstoreIllustration,
    ldap: LDAPUserstoreIllustration
};
