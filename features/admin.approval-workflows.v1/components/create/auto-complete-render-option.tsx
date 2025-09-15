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
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement
} from "react";

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
    audience?: string;
    /**
     * The audience display (e.g., application name for application audience roles).
     */
    audienceDisplay?: string;
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

const AutoCompleteRenderOption: FunctionComponent<AutoCompleteRenderOption> = (
    props: AutoCompleteRenderOption
): ReactElement => {

    const {
        selected,
        displayName,
        subTitle,
        ternaryTitle,
        ternarySubTitle,
        audience,
        audienceDisplay,
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
                        audience ? (
                            <Chip
                                label={
                                    audience?.toUpperCase() === RoleAudienceTypes.APPLICATION && audienceDisplay
                                        ? `${audience} | ${audienceDisplay}`
                                        : audience
                                }
                            />
                        ) : null
                    }
                </Grid>
            </Grid>
        </li>
    );
};

export default AutoCompleteRenderOption;
