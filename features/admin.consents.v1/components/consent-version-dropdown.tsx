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

import Box from "@oxygen-ui/react/Box/Box";
import type { PurposeVersionSummaryDTOInterface } from "@wso2is/common.consents.v1";
import React, { type FunctionComponent, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Icon } from "semantic-ui-react";

interface ConsentVersionDropdownPropsInterface {
	currentVersion: string;
	versions: PurposeVersionSummaryDTOInterface[];
}

export const ConsentVersionDropdown: FunctionComponent<ConsentVersionDropdownPropsInterface> = (
    props: ConsentVersionDropdownPropsInterface
): ReactElement => {
    const { currentVersion, versions } = props;
    const { t } = useTranslation();

    return (
        <Box
            sx={ {
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "8px"
            } }
        >
            <Dropdown
                trigger={ (
                    <span>
                        { t("consents:form.versionDropdown.trigger", { version: currentVersion }) }
                        <Icon name="chevron down" style={ { marginLeft: "6px" } } />
                    </span>
                ) }
                icon={ null }
                pointing="top right"
                className="consent-version-dropdown"
            >
                <Dropdown.Menu>
                    {
                        versions.map(
                            (version: PurposeVersionSummaryDTOInterface): React.ReactNode => (
                                <Dropdown.Item
                                    key={ version.id }
                                    text={
                                        version.version === currentVersion
                                            ? t("consents:form.versionDropdown.currentVersionLabel", {
                                                version: version.version
                                            })
                                            : t("consents:form.versionDropdown.trigger", {
                                                version: version.version
                                            })
                                    }
                                    active={ version.version === currentVersion }
                                />
                            )
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        </Box>
    );
};

