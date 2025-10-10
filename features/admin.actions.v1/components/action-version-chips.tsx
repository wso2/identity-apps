/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ActionVersionInfo } from "../hooks/use-action-versioning";

/**
 * Props for the Action Version Chips component.
 */
interface ActionVersionChipsProps extends IdentifiableComponentInterface {
    /**
     * Version information from the useActionVersioning hook.
     */
    versionInfo: ActionVersionInfo;
    /**
     * Size of the chips.
     */
    size?: "small" | "medium";
}

/**
 * Component to display action version chips.
 * Shows the current version and optionally an "Outdated" indicator.
 */
const ActionVersionChips: FunctionComponent<ActionVersionChipsProps> = ({
    versionInfo,
    size = "medium",
    ["data-componentid"]: componentId = "action-version-chips"
}: ActionVersionChipsProps): ReactElement => {
    const { t } = useTranslation();

    return (
        <Box
            sx={ {
                alignItems: "center",
                display: "flex",
                gap: 1
            } }
            data-componentid={ componentId }
        >
            { versionInfo.displayVersion && (
                <Chip
                    label={ t("actions:versioning.versionLabel", { version: versionInfo.displayVersion }) }
                    size={ size }
                    sx={ {
                        "> span": {
                            padding: ".5833em .833em"
                        },
                        backgroundColor: "#dcf0fa",
                        borderRadius: "var(--oxygen-shape-borderRadius)",
                        color: "#0082c3",
                        fontSize: "12px",
                        fontWeight: "500",
                        height: "24px"
                    } }
                    data-componentid={ `${componentId}-version` }
                />
            ) }
            { versionInfo.isOutdated && (
                <Chip
                    label={ t("actions:versioning.outdatedLabel") }
                    size={ size }
                    sx={ {
                        "> span": {
                            padding: ".5833em .833em"
                        },
                        backgroundColor: "#faebcd",
                        borderRadius: "var(--oxygen-shape-borderRadius)",
                        color: "#e68e00",
                        fontSize: "12px",
                        fontWeight: "500",
                        height: "24px"
                    } }
                    data-componentid={ `${componentId}-outdated` }
                />
            ) }
        </Box>
    );
};

export default ActionVersionChips;
