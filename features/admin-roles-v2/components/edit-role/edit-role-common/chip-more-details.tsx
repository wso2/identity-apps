/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Card, CardContent, Paper, Popover } from "@oxygen-ui/react";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { AnimatedAvatar, AppAvatar, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { getSidePanelIcons } from "../../../../core/configs/ui";

interface ChipMoreDetailsInterface extends IdentifiableComponentInterface {
    /**
     * The anchor element of the popover.
     */
    popoverAnchorEl: Element;
    /**
     * Callback to be fired when the popover is closed.
     */
    onPopoverClose: () => void;
    /**
     * The primary text of the chip and the popover.
     */
    primaryText: string;
    /**
     * The secondary text of the popover.
     */
    secondaryText?: string;
    /**
     * The user store of the option. This will display in the chip.
     */
    userStore?: string;
}

export const ChipMoreDetails: FunctionComponent<ChipMoreDetailsInterface> = (
    props: ChipMoreDetailsInterface
): ReactElement => {

    const {
        popoverAnchorEl,
        onPopoverClose,
        primaryText,
        secondaryText,
        userStore
    } = props;

    return (
        <Popover
            className="role-chip-popover"
            open={ !!popoverAnchorEl }
            anchorEl={ popoverAnchorEl }
            onClose={ onPopoverClose }
            anchorOrigin={ {
                horizontal: "left",
                vertical: "bottom"
            } }
            transformOrigin={ {
                horizontal: "left",
                vertical: "top"
            } }
            elevation={ 0 }
            disableRestoreFocus
        >
            <Paper>
                <Card className="role-chip-more-details">
                    <CardContent>
                        <Grid container alignItems="center" columnSpacing={ 2 }>
                            <Grid container alignItems="center" justifyContent="flex-start">
                                <Grid>
                                    <AppAvatar
                                        image={ (
                                            <AnimatedAvatar
                                                name={ primaryText }
                                                size="mini"
                                            />
                                        ) }
                                        size="mini"
                                    />
                                </Grid>
                                <Grid>
                                    <ListItemText
                                        primary={ primaryText }
                                        secondary={ secondaryText }
                                    />
                                </Grid>
                            </Grid>
                            <Grid justifyContent="flex-end">
                                {
                                    userStore ? (
                                        <Chip
                                            icon={ (
                                                <GenericIcon
                                                    inline
                                                    size="default"
                                                    transparent
                                                    icon={ getSidePanelIcons().userStore }
                                                    verticalAlign="middle"
                                                />
                                            ) }
                                            label={ userStore }
                                        />
                                    ) : null
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
        </Popover>
    );
};
