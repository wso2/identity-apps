/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import Grid from "@oxygen-ui/react/Grid";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement
} from "react";
import "./access-token-attribute-option.scss";

interface AccessTokenAttributeOptionPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is the option selected.
     */
    selected?: boolean;
    /**
     * The display name of the option.
     */
    displayName: string;
    /**
     * The claim URI of the option.
     */
    claimURI: string;
    /**
     * The props passed to the option.
     */
    renderOptionProps: HTMLAttributes<HTMLLIElement>
}

export const AccessTokenAttributeOption: FunctionComponent<AccessTokenAttributeOptionPropsInterface> = (
    props: AccessTokenAttributeOptionPropsInterface
): ReactElement => {

    const {
        selected,
        displayName,
        claimURI,
        renderOptionProps
    } = props;

    return (
        <li { ...renderOptionProps }>
            <Grid container justifyContent="space-between" alignItems="center" xs={ 12 }>
                <Grid container alignItems="top" xs={ 8 }>
                    <Grid>
                        <Checkbox checked={ selected } className="access-token-attribute-option-checkbox"/>
                    </Grid>
                    <Grid xs={ 5 }>
                        <ListItemText primary={ displayName } />
                        <Code>{ claimURI }</Code>
                    </Grid>
                </Grid>
            </Grid>
        </li>
    );
};
