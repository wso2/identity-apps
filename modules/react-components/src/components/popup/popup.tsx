/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
// eslint-disable-next-line no-restricted-imports
import { PopupProps, Popup as SemanticPopup } from "semantic-ui-react";

/**
 * A wrapper for the semantic Popup component.
 *
 * @param props - Popup Props
 *
 * @returns
 */
export const Popup = (props: PopupProps): ReactElement => {
    return (
        <SemanticPopup
            popper={ <div style={ { filter: "none" } }></div> }
            { ...props }
        />
    );
};

Popup.Content = SemanticPopup.Content;
Popup.Header = SemanticPopup.Header;
