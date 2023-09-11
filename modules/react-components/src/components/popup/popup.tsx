/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import React, { ReactElement } from "react";
// eslint-disable-next-line no-restricted-imports
import { PopupContentProps, PopupHeaderProps, PopupProps, Popup as SemanticPopup } from "semantic-ui-react";

/**
 * A wrapper for the semantic Popup component.
 *
 * @param props - Popup Props
 *
 * @returns
 */
export const Popup: {
    (props: PopupProps): ReactElement;
    Content: React.FC<PopupContentProps>;
    Header: React.FC<PopupHeaderProps>;
} = (props: PopupProps): ReactElement => {
    return (
        <SemanticPopup
            popper={ <div style={ { filter: "none" } }></div> }
            { ...props }
        />
    );
};

Popup.Content = SemanticPopup.Content;
Popup.Header = SemanticPopup.Header;
