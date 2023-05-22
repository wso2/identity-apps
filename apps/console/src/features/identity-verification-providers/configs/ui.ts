/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import { ReactComponent as OpenBookIcon } from "../../../themes/default/assets/images/icons/open-book-icon.svg";
import { ReactComponent as ConnectionIcon} from "../../../themes/default/assets/images/icons/connection.svg";
import {
    ReactComponent as DefaultIDPIcon
} from "../../../themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";

export const getIdentityVerificationProviderWizardStepIcons = (): any => {

    return {
        general: DocumentIcon,
        idvpSettings: GearsIcon
    };
};

export const getHelpPanelIcons = (): any => {

    return {
        tabs: {
            docs: OpenBookIcon
        }
    };
};

export const getDefaultImageForIDVP = (): any => {
    // return ConnectionIcon;
    return DefaultIDPIcon;
};
