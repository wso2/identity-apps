/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionComponent, SVGProps } from "react";
import { ReactComponent as AuthorizeIcon } from 
    "../../../themes/default/assets/images/icons/account-policy-icon.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as KeyIcon } from "../../../themes/default/assets/images/icons/key-icon.svg";

export const getAPIResourceWizardStepIcons = (): {
    general: FunctionComponent<SVGProps<SVGSVGElement>>;
    authorize: FunctionComponent<SVGProps<SVGSVGElement>>;
    permissions: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        authorize: AuthorizeIcon,
        general: DocumentIcon,
        permissions: KeyIcon
    };
};
