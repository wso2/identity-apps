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

import {
    ReactComponent as AccountPolicyIcon
} from "../../../themes/default/assets/images/icons/account-policy-icon.svg";
import { ReactComponent as ArrowRight } from "../../../themes/default/assets/images/icons/arrow-right-icon.svg";
import { ReactComponent as ConsentIcon } from "../../../themes/default/assets/images/icons/consent.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import { ReactComponent as GraphIcon } from "../../../themes/default/assets/images/icons/graph-icon.svg";
import { ReactComponent as KeyIcon } from "../../../themes/default/assets/images/icons/key-icon.svg";
import { ReactComponent as PlugIcon } from "../../../themes/default/assets/images/icons/plug-icon.svg";
import { ReactComponent as UserConfigIcon } from "../../../themes/default/assets/images/icons/user-config-icon.svg";
import {
    ReactComponent as AssociatedAccountsMini
} from "../../../themes/default/assets/images/illustrations/associated-accounts-mini.svg";
import {
    ReactComponent as AssociatedAccounts
} from "../../../themes/default/assets/images/illustrations/associated-accounts.svg";
import {
    ReactComponent as ChangePasswordMini
} from "../../../themes/default/assets/images/illustrations/change-password-mini.svg";
import {
    ReactComponent as ChangePassword
} from "../../../themes/default/assets/images/illustrations/change-password.svg";
import {
    ReactComponent as FederatedAssociationsMini
} from "../../../themes/default/assets/images/illustrations/federated-associations-mini.svg";
import {
    ReactComponent as FederatedAssociations
} from "../../../themes/default/assets/images/illustrations/federated-associations.svg";
import {
    ReactComponent as ProfileExportMini
} from "../../../themes/default/assets/images/illustrations/profile-export-mini.svg";
import {
    ReactComponent as ProfileExport
} from "../../../themes/default/assets/images/illustrations/profile-export.svg";
import {
    ReactComponent as SecurityQuestionsMini
} from "../../../themes/default/assets/images/illustrations/security-questions-mini.svg";
import {
    ReactComponent as SecurityQuestions
} from "../../../themes/default/assets/images/illustrations/security-questions.svg";

export const SidePanelIcons = {
    childIcon: ArrowRight,
    connectors: {
        [ "Account Management Policies" ]: UserConfigIcon,
        [ "Analytics Engine" ]: GraphIcon,
        [ "Consent Management" ]: ConsentIcon,
        [ "Login Policies" ]: AccountPolicyIcon,
        [ "Password Policies" ]: KeyIcon,
        default: PlugIcon
    },
    serverConfigurations: GearsIcon
};

export const SettingsSectionIcons = {
    associatedAccounts: AssociatedAccounts,
    associatedAccountsMini: AssociatedAccountsMini,
    changePassword: ChangePassword,
    changePasswordMini: ChangePasswordMini,
    federatedAssociations: FederatedAssociations,
    federatedAssociationsMini: FederatedAssociationsMini,
    profileExport: ProfileExport,
    profileExportMini: ProfileExportMini,
    securityQuestions: SecurityQuestions,
    securityQuestionsMini: SecurityQuestionsMini
};
