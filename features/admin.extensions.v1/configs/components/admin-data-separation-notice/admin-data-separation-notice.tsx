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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";

/**
 * Props interface of {@link AdminDataSeparationNotice}
 */
export interface AdminDataSeparationNoticeProps extends IdentifiableComponentInterface {

    setDisplayBanner?: (display: boolean) => void;
}

/**
 * Section to display new feature announcements.
 *
 * @param props - Props injected to the component.
 * @returns AdminDataSeparationNotice component.
 */
const AdminDataSeparationNotice: FunctionComponent<AdminDataSeparationNoticeProps> = ({
    setDisplayBanner
}: AdminDataSeparationNoticeProps): ReactElement => {

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);
    const [ viewDetails, setViewDetails ] = useState<boolean>(true);

    /**
     * Function to resolve the details of the banner view.
     *
     * @returns ReactElement - The details of the banner view.
     */
    const resolveBannerViewDetails = (): ReactElement => {
        return (
            <Box className="banner-grid" sx={ { overflowX: "auto", width: "100%" } }>
                <List
                    dense
                    sx={ {
                        listStylePosition: "outside",
                        listStyleType: "disc",
                        pl: 4
                    } }>
                    <ListItem
                        component="li"
                        disablePadding
                        sx={ {
                            display: "list-item",
                            listStylePosition: "inherit",
                            listStyleType: "inherit",
                            wordBreak: "break-word"
                        } }
                    >
                        <ListItemText>
                            <Typography variant="body1">
                                <Trans>
                                    Admin users can continue to sign in to both the EU and US regions
                                    using the same credentials. However, <strong>password changes made
                                    in one region will not be synced with the other</strong>. For example,
                                    if an admin resets their password in the EU region, it will not
                                    be reflected in the US region.
                                </Trans>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem
                        component="li"
                        disablePadding
                        sx={ {
                            display: "list-item",
                            listStylePosition: "inherit",
                            listStyleType: "inherit",
                            wordBreak: "break-word"
                        } }
                    >
                        <ListItemText>
                            <Typography variant="body1">
                                <Trans>
                                    <strong>Billing and subscription data</strong> related to accounts
                                    will be <strong>managed independently within each region.</strong>
                                </Trans>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
            </Box>
        );
    };

    const classes: any = classNames( { "admin-data-alert-expanded-view": viewDetails } );

    return (
        <Alert
            className={ classes }
            severity="warning"
            sx={ {
                boxSizing: "border-box",
                paddingRight: "150px",
                position: "relative",
                width: "100%"
            } }
        >
            <AlertTitle className="alert-title" variant="h5">
                <Trans components={ { strong: <strong /> } }>
                    Changes to Admin Data Handling
                </Trans>
            </AlertTitle>

            <Box
                sx={ {
                    alignItems: "center",
                    backgroundColor: "inherit",
                    columnGap: 1,
                    display: "flex",
                    position: "absolute",
                    right: 8,
                    top: 8,
                    width: 140,
                    zIndex: 10
                } }
            >
                <Button
                    className="banner-view-hide-details"
                    data-componentid="outdated-app-view-details-button"
                    size="small"
                    onClick={ () => setViewDetails(!viewDetails) }
                    sx={ {
                        minWidth: 110,
                        whiteSpace: "nowrap"
                    } }
                >
                    { viewDetails ? "Hide Details" : "View Details" }
                </Button>

                <Icon
                    link
                    onClick={ () => setDisplayBanner(false) }
                    size="small"
                    color="grey"
                    name="close"
                    data-componentid="close-btn"
                    sx={ { cursor: "pointer" } }
                />
            </Box>

            <Typography variant="body1" sx={ { mt: 1 } }>
                <Trans>
                    As of <strong>June 27, 2025</strong>, we have
                    implemented <strong>region-based separation of admin user data</strong> in { productName } to
                    meet compliance and data residency requirements.
                </Trans>
            </Typography>

            { viewDetails && resolveBannerViewDetails() }
        </Alert>

    );
};

export default AdminDataSeparationNotice;
