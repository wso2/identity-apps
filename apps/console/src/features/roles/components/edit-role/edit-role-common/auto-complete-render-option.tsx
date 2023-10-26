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

import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement
} from "react";
import { getSidePanelIcons } from "../../../../core/configs/ui";

interface AutoCompleteRenderOption extends IdentifiableComponentInterface {
    /**
     * Is the option selected.
     */
    selected?: boolean;
    /**
     * The display name of the option.
     */
    displayName: string;
    /**
     * The subtitle of the option.
     */
    subTitle?: string;
    /**
     * The user store of the option.
     */
    userstore?: string;
    /**
     * The ternary title of the option. (This will display in the middle of the option)
     */
    ternaryTitle?: string;
    /**
     * The ternary subtitle of the option. (This will display in the middle of the option)
     */
    ternarySubTitle?: string;
    /**
     * The props passed to the option.
     */
    renderOptionProps: HTMLAttributes<HTMLLIElement>
}

export const AutoCompleteRenderOption: FunctionComponent<AutoCompleteRenderOption> = (
    props: AutoCompleteRenderOption
): ReactElement => {

    const {
        selected,
        displayName,
        subTitle,
        ternaryTitle,
        ternarySubTitle,
        userstore,
        renderOptionProps
    } = props;

    return (
        <li { ...renderOptionProps }>
            <Grid container justifyContent="space-between" alignItems="center" xs={ 12 }>
                <Grid container alignItems="center" xs={ 8 }>
                    <Grid>
                        {
                            typeof selected === "boolean" && (
                                <Checkbox checked={ selected } />
                            )
                        }
                    </Grid>
                    <Grid xs={ 5 }>
                        <ListItemText primary={ displayName } secondary={ subTitle } />  
                    </Grid>
                    {
                        ( ternaryTitle && ternarySubTitle ) 
                            ? (
                                <Grid>
                                    <ListItemText primary={ ternaryTitle } secondary={ ternarySubTitle } />
                                </Grid>
                            )
                            : null
                    }
                </Grid>
                <Grid justifyContent="flex-end">
                    {
                        userstore ? (
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
                                label={ userstore }
                            />
                        ) : null
                    }
                </Grid>
            </Grid>
        </li>
    );
};
