/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { ReactComponent as DocumentIcon } from "../resources/assets/images/icons/document-icon.svg";
import { ReactComponent as FlowExtensionIcon } from "../resources/assets/images/icons/flow-extension.svg";
import { ReactComponent as GearsIcon } from "../resources/assets/images/icons/gears-icon.svg";

/**
 * Type representing an SVG imported via the `ReactComponent` named export.
 */
type SVGComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

/**
 * Icons used in the Flow Extension create wizard steps.
 */
interface FlowExtensionWizardStepIcons {
    general: SVGComponent;
    endpoint: SVGComponent;
}

/**
 * Get the Flow Extension icon.
 *
 * @returns The Flow Extension icon as a React component.
 */
export const getFlowExtensionIcon = (): SVGComponent => FlowExtensionIcon;

/**
 * Get the icons used in the Flow Extension create wizard steps.
 *
 * @returns The wizard step icons.
 */
export const getFlowExtensionWizardStepIcons = (): FlowExtensionWizardStepIcons => ({
    endpoint: GearsIcon,
    general: DocumentIcon
});
