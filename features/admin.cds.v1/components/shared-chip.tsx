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
     * Handle of the organization that owns and shares the item.
     */
    ownerOrg?: string;
    /**
     * Shows the chip of an inherited identity attribute instead.
     */
    inherited?: boolean;
}

/**
 * Marks an attribute or rule that a parent organization shares, or an identity attribute that
 * a child organization inherits from its root. Uses the same Oxygen chip as shared connections. The
 * owner organization shows in the tooltip.
 */
const SharedChip: FunctionComponent<SharedChipPropsInterface> = ({
    ownerOrg,
    inherited = false,
    ["data-componentid"]: componentId = "cds-shared-chip"
}: SharedChipPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const chip: ReactElement = (
        <Chip
            label={ inherited
                ? t("customerDataService:sharing.inherited")
                : t("customerDataService:sharing.shared") }
            size="small"
            data-componentid={ componentId }
        />
    );

    if (!ownerOrg) {
        return chip;
    }

    return (
        <Tooltip
            title={ inherited
                ? t("customerDataService:sharing.inheritedFrom", { org: ownerOrg })
                : t("customerDataService:sharing.sharedBy", { org: ownerOrg }) }
        >
            { chip }
        </Tooltip>
    );
};

export default SharedChip;
