/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { Placeholder } from "semantic-ui-react";

const PlaceholderLine = (): ReactElement => (
    <div className="log-row">
        <div className="log-time-container">
            <Placeholder fluid>
                <Placeholder.Line />
            </Placeholder>
        </div>
        <div className="log-description-container">
            <div className="log-desc-loader">
                <Placeholder fluid>
                    <Placeholder.Line />
                </Placeholder>
            </div>
        </div>
    </div>
);

/**
 * Loading component for diagnostic logs
 * @returns React functional component
 */
const LoaderPlaceholder = (): ReactElement => (
    <>
        <PlaceholderLine />
        <PlaceholderLine />
    </>
);

export default LoaderPlaceholder;
