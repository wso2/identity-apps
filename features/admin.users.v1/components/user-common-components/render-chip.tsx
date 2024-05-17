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

import Chip, { ChipProps } from "@oxygen-ui/react/Chip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface, RolesMemberInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";

interface RenderChipInterface extends IdentifiableComponentInterface, ChipProps {
    /**
     * Key of the chip.
     */
    key: string | number;
    /**
     * Callback to set the active option.
     */
    setActiveOption: (option: RolesMemberInterface) => void;
    /**
     * Primary text of the chip.
     */
    primaryText: string;
    /**
     * Option object.
     */
    option: RolesMemberInterface;
    /**
     * Active option object.
     */
    activeOption: RolesMemberInterface;
}

export const RenderChip: FunctionComponent<RenderChipInterface> = (
    props: RenderChipInterface
): ReactElement => {

    const {
        key,
        setActiveOption,
        primaryText,
        option
    } = props;

    /**
     * Handles the mouse enter event of the chip.
     *
     * @param event - Mouse event
     * @param option - Group or user object
     */
    const handleChipMouseEnter = (event: SyntheticEvent) => {
        event.stopPropagation();
        setActiveOption(option);
    };

    /**
     * Handles the mouse leave event of the chip.
     */
    const handleChipMouseLeave = () => {
        setActiveOption(null);
    };

    return (
        <>
            <Chip
                { ...props }
                key={ key }
                label={
                    (<>
                        <Typography fontWeight={ 500 } sx={ { display: "inline-block" } }>{ primaryText }</Typography>
                        {
                            option?.audienceType && (
                                <Typography sx={ { display: "inline-block", fontStyle:"italic" } } >
                                    { " (" + option?.audienceType }
                                    { option?.audienceType?.toUpperCase() === RoleAudienceTypes.APPLICATION
                                        && (" | " + option?.audienceDisplay) }
                                    { ") " }
                                </Typography>
                            )
                        }
                    </>)
                }
                onMouseEnter={ handleChipMouseEnter }
                onMouseLeave={ handleChipMouseLeave }
            />
        </>
    );
};
