/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement
} from "react";

interface AutoCompleteRenderOptionPropsInterface extends IdentifiableComponentInterface {
    /**
     * The display name of the option.
     */
    displayName: string;
    /**
     * The user store of the option.
     */
    audience?: string;
    /**
     * The audience display (e.g., application name for application audience roles).
     */
    audienceDisplay?: string;
    /**
     * The props passed to the option.
     */
    renderOptionProps: HTMLAttributes<HTMLLIElement>;
}

const AutoCompleteRenderOption: FunctionComponent<AutoCompleteRenderOptionPropsInterface> = (
    props: AutoCompleteRenderOptionPropsInterface
): ReactElement => {

    const {
        displayName,
        audience,
        audienceDisplay,
        renderOptionProps
    } = props;

    return (
        <li { ...renderOptionProps }>
            <Grid container justifyContent="space-between" alignItems="center" xs={ 12 } wrap="nowrap">
                <Grid container alignItems="center" xs={ 8 }>
                    <Grid xs={ 5 }>
                        <ListItemText primary={ displayName } />
                    </Grid>
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
