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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ResourceTab,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { Grid } from "semantic-ui-react";
import {
    ApplicationInterface,
    ApplicationTemplateInterface
} from "../../../../admin.applications.v1/models";
import { M2MCustomConfiguration } from "../../../application-templates/shared/components";

/**
 * Prop types of the M2M Application Quickstart component.
 */
export interface M2MApplicationQuickStartPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
    onTriggerTabUpdate: (tabIndex: number) => void;
    defaultTabIndex: number;
}

const PROTOCOL_TAB_INDEX: number = 2;
const API_Authorization_INDEX: number = 3;

/**
 * M2M App Quick start content.
 *
 * @param  props - Props injected into the component.
 * @returns M2M App QuickStart.
 */
const M2MApplicationQuickStart:
    FunctionComponent<M2MApplicationQuickStartPropsInterface> = (
        props:M2MApplicationQuickStartPropsInterface
    ): ReactElement => {

        const {
            inboundProtocolConfig,
            onTriggerTabUpdate,
            [ "data-componentid" ]: componentId
        } = props;

        const { getLink } = useDocumentation();

        return (
            <ResourceTab.Pane controlledSegmentation>
                <Grid data-componentid={ componentId } className="ml-0 mr-0">
                    <Grid.Row className="technology-selection-wrapper single-page-qsg">
                        <Grid.Column computer={ 10 } widescreen={ 8 } className="custom-config-container p-0">
                            <M2MCustomConfiguration
                                onTriggerTabUpdate={ onTriggerTabUpdate }
                                protocolTabIndex={ PROTOCOL_TAB_INDEX }
                                APIAuthorizationTabIndex= { API_Authorization_INDEX }
                                inboundProtocolConfig={ inboundProtocolConfig }
                                icons={ [
                                ] }
                                data-componentid={ `${ componentId }-custom-configuration` }
                                documentationLink={
                                    getLink(
                                        "develop.applications.editApplication." +
                                            "oidcApplication.quickStart.m2mApp." +
                                            "learnMore"
                                    )
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </ResourceTab.Pane>
        );
    };

/**
 * Default props for the component
 */
M2MApplicationQuickStart.defaultProps = {
    "data-componentid": "m2m-app-quick-start"
};

export default M2MApplicationQuickStart;
