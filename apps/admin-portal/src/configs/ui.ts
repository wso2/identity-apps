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

import { ReactComponent as AccountPolicyIcon } from "../themes/default/assets/images/icons/account-policy-icon.svg";
import { ReactComponent as AlertIcon } from "../themes/default/assets/images/icons/alert-icon.svg";
import { ReactComponent as ArrowRight } from "../themes/default/assets/images/icons/arrow-right-icon.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BoxIcon } from "../themes/default/assets/images/icons/box-icon.svg";
import { ReactComponent as BriefcaseIcon } from "../themes/default/assets/images/icons/briefcase-icon.svg";
import { ReactComponent as CaretRightIcon } from "../themes/default/assets/images/icons/caret-right-icon.svg";
import { ReactComponent as CertificateAvatar } from "../themes/default/assets/images/icons/certificate-avatar.svg";
import { ReactComponent as CertificateIcon } from "../themes/default/assets/images/icons/certificate-icon.svg";
import { ReactComponent as ClaimsIcon } from "../themes/default/assets/images/icons/claims-icon.svg";
import { ReactComponent as CloseIcon } from "../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CogwheelIcon } from "../themes/default/assets/images/icons/cog-wheel-icon.svg";
import { ReactComponent as ConsentIcon } from "../themes/default/assets/images/icons/consent.svg";
import { ReactComponent as CrossIcon } from "../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as DatabaseAvatar } from "../themes/default/assets/images/icons/database-avatar.svg";
import { ReactComponent as DatabaseIcon } from "../themes/default/assets/images/icons/database-icon.svg";
import { ReactComponent as DocumentIcon } from "../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as DragSquaresIcon } from "../themes/default/assets/images/icons/drag-squares-icon.svg";
import { ReactComponent as EmailIcon } from "../themes/default/assets/images/icons/email-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as GearsIcon } from "../themes/default/assets/images/icons/gears-icon.svg";
import { ReactComponent as GraphIcon } from "../themes/default/assets/images/icons/graph-icon.svg";
import { ReactComponent as KeyIcon } from "../themes/default/assets/images/icons/key-icon.svg";
import { ReactComponent as LaunchIcon } from "../themes/default/assets/images/icons/launch-icon.svg";
import { ReactComponent as MagnifierIcon } from "../themes/default/assets/images/icons/magnifier-icon.svg";
import { ReactComponent as MaximizeIcon } from "../themes/default/assets/images/icons/maximize-icon.svg";
import { ReactComponent as MinimizeIcon } from "../themes/default/assets/images/icons/minimize-icon.svg";
import { ReactComponent as PaperRocketIcon } from "../themes/default/assets/images/icons/paper-rocket-icon.svg";
import { ReactComponent as PinIcon } from "../themes/default/assets/images/icons/pin-icon.svg";
import { ReactComponent as PlugIcon } from "../themes/default/assets/images/icons/plug-icon.svg";
import { ReactComponent as ReportIcon } from "../themes/default/assets/images/icons/report-icon.svg";
import { ReactComponent as SpinWheelIcon } from "../themes/default/assets/images/icons/spin-wheel-icon.svg";
import { ReactComponent as FileUploadIllustration } from "../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as UserConfigIcon } from "../themes/default/assets/images/icons/user-config-icon.svg";
import { ReactComponent as UserGroupIcon } from "../themes/default/assets/images/icons/user-group-icon.svg";
import { ReactComponent as UserIcon } from "../themes/default/assets/images/icons/user-icon.svg";
import {
    ReactComponent as ActiveDirectoryUserstoreIllustration
} from "../themes/default/assets/images/illustrations/ad-illustration.svg";
import {
    ReactComponent as AssociatedAccountsMini
} from "../themes/default/assets/images/illustrations/associated-accounts-mini.svg";
import {
    ReactComponent as AssociatedAccounts
} from "../themes/default/assets/images/illustrations/associated-accounts.svg";
import { ReactComponent as CertificateBadge } from "../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../themes/default/assets/images/illustrations/certificate.svg";
import {
    ReactComponent as ChangePasswordMini
} from "../themes/default/assets/images/illustrations/change-password-mini.svg";
import { ReactComponent as ChangePassword } from "../themes/default/assets/images/illustrations/change-password.svg";
import {
    ReactComponent as CustomApplicationTemplateIllustration
} from "../themes/default/assets/images/illustrations/custom-app-illustration.svg";
import {
    ReactComponent as FederatedAssociationsMini
} from "../themes/default/assets/images/illustrations/federated-associations-mini.svg";
import {
    ReactComponent as FederatedAssociations
} from "../themes/default/assets/images/illustrations/federated-associations.svg";
import {
    ReactComponent as JDBCUserstoreIllustration
} from "../themes/default/assets/images/illustrations/jdbc-illustration.svg";
import {
    ReactComponent as LDAPUserstoreIllustration
} from "../themes/default/assets/images/illustrations/ldap-illustration.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../themes/default/assets/images/illustrations/no-search-results.svg";
import {
    ReactComponent as ProfileExportMini
} from "../themes/default/assets/images/illustrations/profile-export-mini.svg";
import { ReactComponent as ProfileExport } from "../themes/default/assets/images/illustrations/profile-export.svg";
import { ReactComponent as CertificateRibbon } from "../themes/default/assets/images/illustrations/ribbon.svg";
import {
    ReactComponent as SecurityIllustration
} from "../themes/default/assets/images/illustrations/security-illustration.svg";
import {
    ReactComponent as SecurityQuestionsMini
} from "../themes/default/assets/images/illustrations/security-questions-mini.svg";
import {
    ReactComponent as SecurityQuestions
} from "../themes/default/assets/images/illustrations/security-questions.svg";

export const SidePanelIcons = {
    certificate: CertificateIcon,
    childIcon: ArrowRight,
    claims: ClaimsIcon,
    connectors: {
        [ "Account Management Policies" ]: UserConfigIcon,
        [ "Analytics Engine" ]: GraphIcon,
        [ "Consent Management" ]: ConsentIcon,
        [ "Login Policies" ]: AccountPolicyIcon,
        [ "Password Policies" ]: KeyIcon,
        default: PlugIcon
    },
    emailTemplates: PaperRocketIcon,
    groups: UserGroupIcon,
    overview: DashboardIcon,
    roles: BriefcaseIcon,
    serverConfigurations: GearsIcon,
    userStore: DatabaseIcon,
    users: UserIcon
};

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
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

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const EmptyPlaceholderIllustrations = {
    alert: AlertIcon,
    emptyList: BoxIcon,
    emptySearch: MagnifierIcon,
    fileUpload: FileUploadIllustration,
    genericError: CloseIcon,
    loginError: ForbiddenIcon,
    newList: LaunchIcon,
    pageNotFound: BlockedMagnifierIcon,
    search: EmptySearchResultsIllustration
};

export const UserWizardStepIcons = {
    general: DocumentIcon,
    groups: GearsIcon,
    roles: SpinWheelIcon,
    summary: ReportIcon
};

export const RolesWizardStepIcons = {
    assignUser: UserIcon,
    general: DocumentIcon,
    permissions: KeyIcon,
    summary: ReportIcon
};

export const EmailTemplateIllustrations = {
    emptyEmailListing: EmailIcon
};

export const OperationIcons = {
    drag: DragSquaresIcon,
    maximize: MaximizeIcon,
    minimize: MinimizeIcon
};

export const HelpSidebarIcons = {
    actionPanel: {
        close: CrossIcon,
        pin: PinIcon
    },
    mini: {
        SDKs: BoxIcon,
        docs: DocumentIcon
    }
};

export const DatabaseAvatarGraphic = DatabaseAvatar;

export const CertificateIllustrations = {
    avatar: CertificateAvatar,
    badge: CertificateBadge,
    file: CertificateIllustration,
    ribbon: CertificateRibbon,
    uploadPlaceholder: FileUploadIllustration
};

export const ImportCertificateWizardStepIcons = {
    general: DocumentIcon
};

export const AddDialectWizardStepIcons = {
    general: DocumentIcon
};

export const AddLocalClaimWizardStepIcons = {
    general: DocumentIcon
};

export const AddEmailTemplateTypeWizardStepIcons = {
    general: DocumentIcon
};

export const ViewLocaleTemplateWizardStepIcons = {
    general: DocumentIcon
};

export const AddUserstoreWizardStepIcons = {
    general: DocumentIcon
};

export const UserstoreTemplateIllustrations = {
    ad: ActiveDirectoryUserstoreIllustration,
    default: CustomApplicationTemplateIllustration,
    jdbc: JDBCUserstoreIllustration,
    ldap: LDAPUserstoreIllustration
};

export const OverviewPageIllustrations = {
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
