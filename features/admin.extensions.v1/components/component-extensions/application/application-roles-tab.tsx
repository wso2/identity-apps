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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import { ApplicationInterface } from "../../../../admin.applications.v1/models";
import { ApplicationRoles } from "../../application/components/application-roles";

interface ApplicationRolesTabInterface extends IdentifiableComponentInterface {
    /**
     * Application.
     */
    application?: ApplicationInterface
    /**
     * on application update callback
     */
    onUpdate: () => void;
}

/**
 * A function returning a ReactElement to render application tab pane.
 */
const ApplicationRolesTab: FunctionComponent<ApplicationRolesTabInterface> = (
    props: ApplicationRolesTabInterface
): ReactElement => {
    const { application, onUpdate } = props;

    return (
        <ResourceTab.Pane controlledSegmentation>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 } >
                        <ApplicationRoles application={ application } onUpdate={ onUpdate }/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </ResourceTab.Pane>
    );
};

export default ApplicationRolesTab;
