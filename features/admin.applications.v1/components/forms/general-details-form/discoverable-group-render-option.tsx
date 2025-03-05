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

import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { getSidePanelIcons } from "@wso2is/admin.core.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement
} from "react";

interface DiscoverableGroupRenderOption extends IdentifiableComponentInterface {
    /**
     * Is the option selected.
     */
    selected?: boolean;
    /**
     * The display name of the option.
     */
    displayName: string;
    /**
     * The user store of the option.
     */
    userStore?: string;
    /**
     * The props passed to the option.
     */
    renderOptionProps: HTMLAttributes<HTMLLIElement>
}

export const DiscoverableGroupRenderOption: FunctionComponent<DiscoverableGroupRenderOption> = (
    {
        selected,
        displayName,
        userStore,
        renderOptionProps,
        [ "data-componentid" ]: componentId
    }: DiscoverableGroupRenderOption
): ReactElement => {

    return (
        <li { ...renderOptionProps } data-componentid={ componentId }>
            <Grid container justifyContent="space-between" alignItems="center" xs={ 12 }>
                <Grid container alignItems="center" xs={ 8 }>
                    <Checkbox checked={ selected } />
                    <ListItemText primary={ displayName } />
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
        </li>
    );
};
