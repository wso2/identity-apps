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

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Box from "@oxygen-ui/react/Box";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import "./admin-data-separation-notice.scss";

/**
 * Props interface of {@link AdminDataSeparationNotice}
 */
export interface AdminDataSeparationNoticeProps extends IdentifiableComponentInterface {
}

/**
 * Section to display new feature announcements.
 *
 * @param props - Props injected to the component.
 * @returns AdminDataSeparationNotice component.
 */
const AdminDataSeparationNotice: FunctionComponent<AdminDataSeparationNoticeProps> = ({
    ...rest
}: AdminDataSeparationNoticeProps): ReactElement => {

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    /**
     * Function to resolve the details of the banner view.
     *
     * @returns ReactElement - The details of the banner view.
     */

    const resolveBannerViewDetails = (): ReactElement => {
        return (
            <Grid className="banner-grid">
                <List dense>
                    <ListItem
                        component="li"
                        sx={ { display: "list-item", listStyleType: "disc" } }
                    >
                        <ListItemText>
                            <Typography variant="body2">
                                <Trans>
                                    Admin users can continue signing in to both the EU and US regions using
                                    the same credentials. However, <strong>password changes made in one region will
                                    not sync to the other</strong>. For example, if an admin resets their password
                                    in the EU region, it will not be updated in the US region.
                                </Trans>
                            </Typography>
                        </ListItemText>
                    </ListItem>

                    <ListItem
                        component="li"
                        sx={ { display: "list-item", listStyleType: "disc" } }
                    >
                        <ListItemText>
                            <Typography variant="body2">
                                <Trans>
                                    <strong>Billing and subscription data</strong> related to admin accounts
                                    will be <strong>managed independently within each region.</strong>
                                </Trans>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
            </Grid>
        );
    };

    return (
        <Paper
            className={ classNames("admin-data-separation-notice") }
            data-componentid="region-separation-announcement"
            variant="outlined"
            { ...rest }
        >

            <Box className="admin-data-separation-notice-content">
                <Box>
                    <Typography variant="h3" display="flex" alignItems="center" gap={ 1 } mb={ 1 }>
                        <WarningAmberOutlinedIcon color="warning" sx={ { fontSize: 28, verticalAlign: "middle" } } />
                        Changes to Admin Data Handling
                    </Typography>
                    <Typography variant="body2">
                        Effective from <strong>June 27, 2025</strong>, we are
                        introducing <strong>region-based separation of admin user data</strong> in { productName } to
                        meet compliance and data residency requirements. With this change,
                    </Typography>
                    { (
                        <Typography variant="body2" sx={ { pl: 4 } } >
                            { resolveBannerViewDetails() }
                        </Typography>
                    ) }

                </Box>
            </Box>

        </Paper>
    );
};

export default AdminDataSeparationNotice;
