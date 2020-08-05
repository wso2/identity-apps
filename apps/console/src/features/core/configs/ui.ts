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

import { ReactComponent as AlertIcon } from "../../../themes/default/assets/images/icons/alert-icon.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../../../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BoxIcon } from "../../../themes/default/assets/images/icons/box-icon.svg";
import { ReactComponent as CaretRightIcon } from "../../../themes/default/assets/images/icons/caret-right-icon.svg";
import {
    ReactComponent as CertificateAvatar
} from "../../../themes/default/assets/images/icons/certificate-avatar.svg";
import { ReactComponent as CloseIcon } from "../../../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CrossIcon } from "../../../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as DragSquaresIcon } from "../../../themes/default/assets/images/icons/drag-squares-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../../../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as MagnifierIcon } from "../../../themes/default/assets/images/icons/magnifier-icon.svg";
import { ReactComponent as MaximizeIcon } from "../../../themes/default/assets/images/icons/maximize-icon.svg";
import { ReactComponent as MinimizeIcon } from "../../../themes/default/assets/images/icons/minimize-icon.svg";
import { ReactComponent as PinIcon } from "../../../themes/default/assets/images/icons/pin-icon.svg";
import { ReactComponent as PlusIcon } from "../../../themes/default/assets/images/icons/plus-icon.svg";
import { ReactComponent as FileUploadIllustration } from "../../../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as CertificateBadge } from "../../../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../../../themes/default/assets/images/illustrations/certificate.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../../../themes/default/assets/images/illustrations/no-search-results.svg";
import { ReactComponent as CertificateRibbon } from "../../../themes/default/assets/images/illustrations/ribbon.svg";

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
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
    newList: PlusIcon,
    pageNotFound: BlockedMagnifierIcon,
    search: EmptySearchResultsIllustration
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

export const CertificateIllustrations = {
    avatar: CertificateAvatar,
    badge: CertificateBadge,
    file: CertificateIllustration,
    ribbon: CertificateRibbon,
    uploadPlaceholder: FileUploadIllustration
};
