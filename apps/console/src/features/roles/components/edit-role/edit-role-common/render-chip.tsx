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

import { ChipProps } from "@oxygen-ui/react";
import Chip from "@oxygen-ui/react/Chip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GroupsInterface } from "apps/console/src/features/groups/models";
import { UserBasicInterface } from "apps/console/src/features/users/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { ChipMoreDetails } from "./chip-more-details";

interface RenderChipInterface extends IdentifiableComponentInterface, ChipProps {

    /**
     * Key of the chip.
     */
    key: string | number;
    /**
     * Callback to set the active option.
     */
    setActiveOption: (option: GroupsInterface|UserBasicInterface) => void;
    /**
     * Primary text of the chip.
     */
    primaryText: string;
    /**
     * User store of the user.
     */
    userStore: string;
    /**
     * Option object.
     */
    option: GroupsInterface | UserBasicInterface;
    /**
     * Active option object.
     */
    activeOption: GroupsInterface | UserBasicInterface;
}

export const RenderChip: FunctionComponent<RenderChipInterface> = (
    props: RenderChipInterface
): ReactElement => {

    const {
        key,
        setActiveOption,
        primaryText,
        userStore,
        option,
        activeOption
    } = props;

    const [ popoverAnchorEl, setPopoverAnchorEl ] = useState<Element>(null);

    /**
     * Handles the mouse enter event of the chip.
     * 
     * @param event - Mouse event
     * @param option - Group or user object
     */
    const handleChipMouseEnter = (event: SyntheticEvent, option: GroupsInterface | UserBasicInterface) => {
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
            {
                activeOption?.id === option.id
                    ? (
                        <ChipMoreDetails 
                            popoverAnchorEl={ popoverAnchorEl } 
                            onPopoverClose={ handleChipMouseLeave } 
                            primaryText={ primaryText } 
                            userStore={ userStore } 
                        />
                    )
                    : null
            }
            <Chip
                { ...props }
                key={ key }
                label={ primaryText }
                onMouseEnter={ (event: SyntheticEvent) => handleChipMouseEnter(event, option) }
            />
        </>
    );
};
