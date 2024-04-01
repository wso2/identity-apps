/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    GenericIcon
} from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { getMiscellaneousIcons } from "../../../../../admin.core.v1/configs";

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
