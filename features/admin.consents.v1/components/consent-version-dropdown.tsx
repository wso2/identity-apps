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

import Box from "@oxygen-ui/react/Box";
import Menu from "@oxygen-ui/react/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Button from "@oxygen-ui/react/Button";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import type { PurposeVersionSummaryDTOInterface } from "@wso2is/common.consents.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { type FunctionComponent, type ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";

interface ConsentVersionDropdownPropsInterface extends IdentifiableComponentInterface {
    currentVersion: string;
    versions: PurposeVersionSummaryDTOInterface[];
    onVersionChange?: (version: string) => void;
}

const DropdownTrigger: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
	textTransform: "none",
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(0.5),
	color: theme.palette.text.primary
}));

export const ConsentVersionDropdown: FunctionComponent<ConsentVersionDropdownPropsInterface> = (
    props: ConsentVersionDropdownPropsInterface
): ReactElement => {
    const {
        currentVersion,
        versions,
        onVersionChange,
        ["data-componentid"]: componentId = "consent-version-dropdown"
    } = props;
    const { t } = useTranslation();
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const open: boolean = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    return (
        <Box
            data-componentid={ componentId }
            sx={ {
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "8px"
            } }
        >
            <DropdownTrigger
                id="consent-version-dropdown-trigger"
                data-componentid={ `${componentId}-trigger` }
                aria-controls={ open ? "consent-version-menu" : undefined }
                aria-haspopup="true"
                aria-expanded={ open ? "true" : undefined }
                onClick={ handleClick }
                variant="text"
                endIcon={ <ChevronDownIcon /> }
            >
                { t("consents:form.versionDropdown.trigger", { version: currentVersion }) }
            </DropdownTrigger>
            <Menu
                id="consent-version-menu"
                anchorEl={ anchorEl }
                open={ open }
                onClose={ handleClose }
                anchorOrigin={ {
                    vertical: "top",
                    horizontal: "right"
                } }
                transformOrigin={ {
                    vertical: "top",
                    horizontal: "right"
                } }
            >
                {
                    versions.map(
                        (version: PurposeVersionSummaryDTOInterface): React.ReactNode => (
                            <MenuItem
                                key={ version.id }
                                selected={ version.version === currentVersion }
                                onClick={ (): void => {
                                    onVersionChange?.(version.version);
                                    handleClose();
                                } }
                            >
                                {
                                    version.version === currentVersion
                                        ? t("consents:form.versionDropdown.currentVersionLabel", {
                                            version: version.version
                                        })
                                        : t("consents:form.versionDropdown.trigger", {
                                            version: version.version
                                        })
                                }
                            </MenuItem>
                        )
                    )
                }
            </Menu>
        </Box>
    );
};

