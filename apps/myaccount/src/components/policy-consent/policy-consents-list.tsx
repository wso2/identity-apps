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

import { i18nLink } from "@wso2is/common.branding.v1/utils/i18n-link";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PolicyConsentItemInterface } from "../../models/consents";
import { DangerZone, DangerZoneGroup, GenericIcon, Media } from "@wso2is/react-components";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowUpRightFromSquareIcon, ChevronDownIcon, ChevronUpIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { toSentenceCase } from "../../utils";
import { PolicyConsentIcon } from "../../configs";
import { EditSection } from "../shared";

/**
 * Prop types for the policy consent list component.
 */
interface PolicyConsentListPropsInterface extends IdentifiableComponentInterface {
    items: PolicyConsentItemInterface[];
    activeIndexes: number[];
    onToggleDetail: (index: number) => void;
    onRevokeClick: (item: PolicyConsentItemInterface) => void;
}

/**
 * Pure list component for policy consents.
 * Data fetching and state are managed by the parent.
 */
export const PolicyConsentList: FunctionComponent<PolicyConsentListPropsInterface> = (
    props: PolicyConsentListPropsInterface
): ReactElement => {

    const { items, activeIndexes, onToggleDetail, onRevokeClick, ["data-componentid"]: componentId } = props;
    const { t, i18n } = useTranslation();

    const resolveStateClassname: (state: string) => string = (state: string): string => {
        if (state === "ACTIVE") {
            return "positive";
        }

        return "";
    };

    return (
        <List className="main-content-inner" data-componentid={ componentId } disablePadding>
            {
                items.length > 0
                    ? items.map((item: PolicyConsentItemInterface, index: number) => (
                        <Box key={ item.consentId }>
                            <ListItem className="inner-list-item" disableGutters>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    width="100%"
                                    px={ 2 }
                                    py={ 1 }
                                >
                                    <Box display="flex" alignItems="center" gap={ 1.5 }>
                                        <GenericIcon
                                            icon={ PolicyConsentIcon }
                                            size="micro"
                                            bordered
                                            defaultIcon
                                            relaxed
                                            rounded
                                            spaced="right"
                                            square
                                            floated="left"
                                        />
                                        <Box>
                                            <Typography variant="body1" fontWeight={ 500 }>
                                                { item.purposeName }
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <Box
                                                    component="span"
                                                    className={
                                                        `active-label ${ resolveStateClassname(item.state) }`
                                                    }
                                                />
                                                { item.state === "ACTIVE"
                                                    ? `${ t(
                                                        "myAccount:components" +
                                                        ".policyConsentManagement" +
                                                        ".consentedOnLabel"
                                                    ) } ${ new Date(
                                                        item.timestamp
                                                    ).toLocaleDateString(i18n.language) }`
                                                    : toSentenceCase(item.state)
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Media lessThan="computer">
                                            <Box display="flex" alignItems="center">
                                                { item.policyUrl && (
                                                    <Button
                                                        component="a"
                                                        href={ i18nLink(i18n.language, item.policyUrl) }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        variant="text"
                                                        size="small"
                                                        data-componentid={
                                                            `${ componentId }-${ item.purposeId }-view-policy-button`
                                                        }
                                                    >
                                                        <ArrowUpRightFromSquareIcon />
                                                    </Button>
                                                ) }
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={ () => onToggleDetail(index) }
                                                >
                                                    { activeIndexes.includes(index)
                                                        ? <ChevronUpIcon />
                                                        : <ChevronDownIcon />
                                                    }
                                                </Button>
                                            </Box>
                                        </Media>
                                        <Media greaterThanOrEqual="computer">
                                            <Box display="flex" alignItems="center">
                                                { item.policyUrl && (
                                                    <Button
                                                        component="a"
                                                        href={ i18nLink(i18n.language, item.policyUrl) }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        variant="text"
                                                        size="small"
                                                        endIcon={ <ArrowUpRightFromSquareIcon /> }
                                                        className="show-more-button"
                                                        data-componentid={
                                                            `${ componentId }-${ item.purposeId }-view-policy-button`
                                                        }
                                                    >
                                                        { t(
                                                            "myAccount:components.policyConsentManagement" +
                                                            ".policyUrlLabel"
                                                        ) }
                                                    </Button>
                                                ) }
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    endIcon={
                                                        activeIndexes.includes(index)
                                                            ? <ChevronUpIcon />
                                                            : <ChevronDownIcon />
                                                    }
                                                    className="show-more-button"
                                                    onClick={ () => onToggleDetail(index) }
                                                    data-componentid={
                                                        `${ componentId }-${ item.purposeId }-show-more-button`
                                                    }
                                                >
                                                    { activeIndexes.includes(index)
                                                        ? t("common:showLess")
                                                        : t("common:showMore")
                                                    }
                                                </Button>
                                            </Box>
                                        </Media>
                                    </Box>
                                </Box>
                            </ListItem>
                            {
                                activeIndexes.includes(index) && (
                                    <EditSection
                                        data-componentid={
                                            `${ componentId }-${ item.purposeId }-edit-section`
                                        }
                                    >
                                        <Box px={ 2 } pb={ 2 }>
                                            <DangerZoneGroup
                                                sectionHeader={ t("common:dangerZone") }
                                            >
                                                <DangerZone
                                                    actionTitle={ t(
                                                        "myAccount:components" +
                                                        ".policyConsentManagement" +
                                                        ".dangerZones.revoke.actionTitle"
                                                    ) }
                                                    header={ t(
                                                        "myAccount:components" +
                                                        ".policyConsentManagement" +
                                                        ".dangerZones.revoke.header"
                                                    ) }
                                                    subheader={ t(
                                                        "myAccount:components" +
                                                        ".policyConsentManagement" +
                                                        ".dangerZones.revoke.subheader"
                                                    ) }
                                                    onActionClick={ () => onRevokeClick(item) }
                                                    data-componentid={
                                                        `${ componentId }-${ item.purposeId }` +
                                                        "-danger-zone-revoke"
                                                    }
                                                />
                                            </DangerZoneGroup>
                                        </Box>
                                    </EditSection>
                                )
                            }
                            { index < items.length - 1 && <Divider /> }
                        </Box>
                    ))
                    : null
            }
        </List>
    );
};

PolicyConsentList.defaultProps = {
    "data-componentid": "policy-consent-list"
};
