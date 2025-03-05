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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Chip, { ChipProps } from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Paper from "@oxygen-ui/react/Paper";
import Popover from "@oxygen-ui/react/Popover";
import { getSidePanelIcons } from "@wso2is/admin.core.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { AnimatedAvatar, AppAvatar, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { GroupMetadataInterface } from "../../../models/application";

interface DiscoverableGroupRenderChipInterface extends IdentifiableComponentInterface, ChipProps {
    /**
     * Key of the chip.
     */
    key: string | number;
    /**
     * Callback to set the active option.
     */
    setActiveOption: (option: any) => void;
    /**
     * Primary text of the chip.
     */
    primaryText: string;
    /**
     * User store of the user.
     */
    userStore?: string;
    /**
     * Option object.
     */
    option: GroupMetadataInterface;
    /**
     * Active option object.
     */
    activeOption: any;
}

export const DiscoverableGroupRenderChip: FunctionComponent<DiscoverableGroupRenderChipInterface> = (
    {
        key,
        setActiveOption,
        primaryText,
        userStore,
        option,
        activeOption,
        ...props
    }: DiscoverableGroupRenderChipInterface
): ReactElement => {

    const [ popoverAnchorEl, setPopoverAnchorEl ] = useState<Element>(null);

    /**
     * Handles the mouse enter event of the chip.
     *
     * @param event - Mouse event.
     * @param option - Group or user object.
     */
    const handleChipMouseEnter = (event: SyntheticEvent) => {
        setPopoverAnchorEl(event.currentTarget);
        setActiveOption(option);
    };

    /**
     * Handles the mouse leave event of the chip.
     */
    const handleChipMouseLeave = () => {
        setPopoverAnchorEl(null);
        setActiveOption(null);
    };

    return (
        <>
            <Chip
                { ...props }
                key={ key }
                label={ primaryText }
                onMouseEnter={ handleChipMouseEnter }
                onMouseLeave={ handleChipMouseLeave }
            />
            {
                activeOption?.id === option.id && (
                    <Popover
                        className="role-chip-popover"
                        open={ !!popoverAnchorEl }
                        anchorEl={ popoverAnchorEl }
                        onClose={ handleChipMouseLeave }
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
                                                <ListItemText primary={ primaryText }/>
                                            </Grid>
                                        </Grid>
                                        <Grid justifyContent="flex-end">
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
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Popover>
                )
            }
        </>
    );
};
