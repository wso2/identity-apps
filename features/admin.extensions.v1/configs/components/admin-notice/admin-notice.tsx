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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Icon } from "semantic-ui-react";

/**
 * Props interface of {@link AdminNotice}
 */
export interface AdminNoticeProps extends IdentifiableComponentInterface {

    /**
     * Title of the notice.
     */
    title: ReactElement;
    /**
     * Description of the notice.
     */
    description: ReactElement;
    /**
     * Instructions related to the notice.
     */
    instructions: ReactElement[];
    /**
     * Function to set the display state of the banner.
     */
    setDisplayBanner?: (display: boolean) => void;
}

/**
 * Section to display announcements.
 *
 * @param props - Props injected to the component.
 * @returns AdminNotice component.
 */
const AdminNotice: FunctionComponent<AdminNoticeProps> = (props: AdminNoticeProps): ReactElement => {

    const {
        title,
        description,
        instructions,
        setDisplayBanner,
        [ "data-componentid" ]: componentId
    } = props;

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
                    {
                        instructions.map((instruction: ReactElement, index: number) => (
                            <ListItem
                                key={ index }
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
                                        { instruction }
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        );
    };

    const classes: any = classNames( { "admin-data-alert-expanded-view" : viewDetails } );

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
                <strong>{ title }</strong>
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
                    data-componentid={ componentId + "-view-details-button" }
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
                { description }
            </Typography>

            { viewDetails && resolveBannerViewDetails() }
        </Alert>

    );
};

export default AdminNotice;
