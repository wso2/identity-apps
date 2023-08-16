/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    GenericIcon
} from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { getMiscellaneousIcons } from "../../../../../features/core/configs";

export const OrganizationSuperTrigger = (): ReactElement => {
    return (
        <span className="tenant-dropdown-trigger" data-testid="tenant-dropdown-trigger">
            <GenericIcon
                transparent
                inline
                className="tenant-dropdown-trigger-icon"
                data-testid="tenant-dropdown-trigger-icon"
                icon={ getMiscellaneousIcons().tenantIcon }
                size="micro"
            />
        </span>
    );
};

OrganizationSuperTrigger.defaultProps = {
    "data-componentid": "organization-super-trigger"
};
