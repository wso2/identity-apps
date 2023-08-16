/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import { ApplicationInterface } from "../../../../features/applications/models";
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
