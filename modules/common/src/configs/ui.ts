/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    ReactComponent as EmptyListIllustration
} from "../assets/illustrations/empty-list-illustration.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../assets/illustrations/empty-search-illustration.svg";
import { ReactComponent as CaretLeftIcon } from "../assets/icons/caret-left-icon.svg";
import { ReactComponent as CaretRightIcon } from "../assets/icons/caret-right-icon.svg";
import { ReactComponent as CrossIcon } from "../assets/icons/cross-icon.svg";
import { ReactComponent as PinIcon } from "../assets/icons/pin-icon.svg";
import { ReactComponent as UnPinIcon } from "../assets/icons/unpin-icon.svg";
import { ReactComponent as CertificateAvatar
} from "../assets/illustrations/certificate-avatar.svg";
import { ReactComponent as CertificateBadge } from "../assets/illustrations/badge.svg";
import { ReactComponent as CertificateIllustration
} from "../assets/illustrations/certificate.svg";
import { ReactComponent as CertificateRibbon } from "../assets/illustrations/ribbon.svg";
import { ReactComponent as FileUploadIllustration } from "../assets/icons/upload.svg";

import { 
    GetAdvancedSearchIconsInterface,
    GetCertificateIllustrationsInterface,
    GetEmptyPlaceholderIllustrationsInterface, 
    GetHelpPanelActionIconsInterface 
} from "../models/ui";

/**
 * Get Empty Placeholder Illustrations. Please add the types to
 * {@link GetEmptyPlaceholderIllustrationsInterface} if introducing
 * new icons/images.
 */
export const getEmptyPlaceholderIllustrations = (): GetEmptyPlaceholderIllustrationsInterface => {

    return {
        emptyList: EmptyListIllustration,
        newList: EmptyListIllustration,
        emptySearch: EmptySearchResultsIllustration
    };
};

/**
* Get Certificate illustrations. Please add the types to
* {@link GetHelpPanelActionIconsInterface} if introducing
* new icons/images.
*/
export const getHelpPanelActionIcons = (): GetHelpPanelActionIconsInterface => {

    return {
        caretLeft: CaretLeftIcon,
        caretRight: CaretRightIcon,
        close: CrossIcon,
        pin: PinIcon,
        unpin: UnPinIcon
    };
 };

 /**
 * Get Certificate illustrations. Please add the types to
 * {@link GetCertificateIllustrationsInterface} if introducing
 * new icons/images.
 */
export const getCertificateIllustrations = (): GetCertificateIllustrationsInterface => {

    return {
        avatar: CertificateAvatar,
        badge: CertificateBadge,
        file: CertificateIllustration,
        ribbon: CertificateRibbon,
        uploadPlaceholder: FileUploadIllustration
    };
};

/**
 * Get Advanced Search Icons. Please add the types to
 * {@link GetAdvancedSearchIconsInterface} if introducing
 * new icons/images.
 */
export const getAdvancedSearchIcons = (): GetAdvancedSearchIconsInterface  => {

    return {
        clear: CrossIcon
    };
};
