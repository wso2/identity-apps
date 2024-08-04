/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import { ExtendedFeatureConfigInterface } from "../../../configs/models/common";
import { APIAuthorization } from "../../application/components/api-authorization";

/**
 * Prop types for the API resources list component.
 */
interface APIAuthorizationTabProps extends SBACInterface<ExtendedFeatureConfigInterface> {
    /**
     * Is the application a choreo application.
     */
    isChoreoApp: boolean;
}

/**
 * A function returning a ReactElement to render application tab pane.
 */
const APIAuthorizationTab: FunctionComponent<APIAuthorizationTabProps> = (
    props: APIAuthorizationTabProps
): ReactElement  => {

    const { isChoreoApp } = props;

    return (
        <ResourceTab.Pane controlledSegmentation>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 } >
                        <APIAuthorization isChoreoApp={ isChoreoApp } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </ResourceTab.Pane>
    );
};

export default APIAuthorizationTab;
