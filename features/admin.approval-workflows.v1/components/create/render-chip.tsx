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

import Chip, { ChipProps } from "@oxygen-ui/react/Chip";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
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
    setActiveOption: (option: any) => void;
    /**
     * Primary text of the chip.
     */
    primaryText: string;
    /**
     * Secondary text of the chip.
     */
    secondaryText?: string;
    /**
     * User store of the user.
     */
    audience?: string;
    /**
     * Option object.
     */
    option: any;
    /**
     * Active option object.
     */
    activeOption: any;
}

const RenderChip: FunctionComponent<RenderChipInterface> = (
    props: RenderChipInterface
): ReactElement => {

    const {
        key,
        setActiveOption,
        primaryText,
        secondaryText,
        audience,
        option,
        activeOption
    } = props;

    const [ popoverAnchorEl, setPopoverAnchorEl ] = useState<Element>(null);

    // Build comprehensive audience display for popover
    const audienceDisplay: string = (() => {
        if (!audience) return "";

        let display: string = audience;

        if (audience?.toUpperCase() === RoleAudienceTypes.APPLICATION && option?.audience?.display) {
            display += ` | ${option.audience.display}`;
        }

        return display;
    })();

    /**
     * Handles the mouse enter event of the chip.
     *
     * @param event - Mouse event
     * @param option - Group or user object
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
                activeOption?.id === option.id
                    ? (
                        <ChipMoreDetails
                            popoverAnchorEl={ popoverAnchorEl }
                            onPopoverClose={ handleChipMouseLeave }
                            primaryText={ primaryText }
                            secondaryText={ secondaryText }
                            audience={ audienceDisplay }
                        />
                    )
                    : null
            }
        </>
    );
};

export default RenderChip;
