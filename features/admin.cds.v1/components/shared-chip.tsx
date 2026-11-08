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

import Chip from "@oxygen-ui/react/Chip";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface SharedChipPropsInterface extends IdentifiableComponentInterface {
    /**
     * Shows the chip of an inherited identity attribute instead.
     */
    inherited?: boolean;
}

/**
 * Marks an attribute or rule that a parent organization shares, or an identity attribute that
 * a child organization inherits from its root. Uses the same Oxygen chip as shared connections. The
 * tooltip tells that the item cannot be changed in this organization.
 */
const SharedChip: FunctionComponent<SharedChipPropsInterface> = ({
    inherited = false,
    ["data-componentid"]: componentId = "cds-shared-chip"
}: SharedChipPropsInterface): ReactElement => {

    const { t } = useTranslation();

    return (
        <Tooltip
            title={ inherited
                ? t("customerDataService:sharing.inheritedTooltip")
                : t("customerDataService:sharing.sharedTooltip") }
        >
            <Chip
                label={ inherited
                    ? t("customerDataService:sharing.inherited")
                    : t("customerDataService:sharing.shared") }
                size="small"
                data-componentid={ componentId }
            />
        </Tooltip>
    );
};

export default SharedChip;
