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
    ActiveDirectoryUserstoreIllustration,
    AlertIcon,
    ArrowRight,
    BlockedMagnifierIcon,
    BoxIcon,
    BriefcaseIcon,
    CaretRightIcon,
    CertificateAvatar,
    CertificateBadge,
    CertificateIcon,
    CertificateIllustration,
    CertificateRibbon,
    ClaimsIcon,
    CloseIcon,
    CodeIcon,
    CogwheelIcon,
    CrossIcon,
    CustomApplicationTemplateIllustration,
    DashboardIcon,
    DatabaseAvatar,
    DatabaseIcon,
    DocumentIcon,
    DragIcon,
    DragSquaresIcon,
    EmailIcon,
    EmptySearchResultsIllustration,
    ErrorIcon,
    FileUploadIllustration,
    ForbiddenIcon,
    GearsIcon,
    InfoIcon,
    JDBCUserstoreIllustration,
    KeyIcon,
    LDAPUserstoreIllustration,
    LaunchIcon,
    Logo,
    MFAIconSet,
    MagnifierIcon,
    MaximizeIcon,
    MinimizeIcon,
    PaperRocketIcon,
    PinIcon,
    PlugIcon,
    ReportIcon,
    SecurityIllustration,
    SettigsSectionIconSet,
    SpinWheelIcon,
    SuccessIcon,
    UserGroupIcon,
    UserIcon,
    WarningIcon
} from "@wso2is/theme";

export const LogoImage = Logo;

// Icon set for the side panel.
export const SidePanelIcons = {
    certificate: CertificateIcon,
    childIcon: ArrowRight,
    claims: ClaimsIcon,
    connections: PlugIcon,
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

export const GenericAppIcon = CodeIcon;
export const SettingsSectionIcons = SettigsSectionIconSet;
export const MFAIcons = MFAIconSet;

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const AlertIcons = {
    error: ErrorIcon,
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon
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
    general: DocumentIcon,
    permissions: KeyIcon,
    assignUser: UserIcon,
    summary: ReportIcon
};

export const EmailTemplateIllustrations = {
    emptyEmailListing: EmailIcon
};

export const PlaceHolderIcons = {
    drag: DragIcon
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

/**
 * The userstore avatar.
 */
export const DatabaseAvatarGraphic = DatabaseAvatar;

export const CertificateIllustrations = {
    /**
     * Certificate avatar.
     */
    avatar: CertificateAvatar,

    /**
     * Certificate Badge Illustration.
     */
    badge: CertificateBadge,

    /**
     * Certificate illustration.
     */
    file: CertificateIllustration,

    /**
     * Certificate Ribbon.
     */
    ribbon: CertificateRibbon,

    /**
     * File upload placeholder.
     */
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
        userstores: DatabaseIcon
    }
};
