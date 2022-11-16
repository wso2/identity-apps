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
import {
    ReactComponent as CertificateAvatar
} from "../../../themes/default/assets/images/icons/certificate-avatar.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as FileUploadIllustration } from "../../../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as CertificateBadge } from "../../../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../../../themes/default/assets/images/illustrations/certificate.svg";
import { ReactComponent as CertificateRibbon } from "../../../themes/default/assets/images/illustrations/ribbon.svg";

export const getCertificateIllustrations = (): {
    avatar: FunctionComponent<SVGProps<SVGSVGElement>>;
    badge: FunctionComponent<SVGProps<SVGSVGElement>>;
    file: FunctionComponent<SVGProps<SVGSVGElement>>;
    ribbon: FunctionComponent<SVGProps<SVGSVGElement>>;
    uploadPlaceholder: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        avatar: CertificateAvatar,
        badge: CertificateBadge,
        file: CertificateIllustration,
        ribbon: CertificateRibbon,
        uploadPlaceholder: FileUploadIllustration
    };
};

export const getImportCertificateWizardStepIcons = (): {
    general: FunctionComponent<SVGProps<SVGSVGElement>> ,
} => {

    return {
        general: DocumentIcon
    };
};
