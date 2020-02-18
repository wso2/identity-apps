/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import * as React from "react";
import { WithTranslation } from "react-i18next";
import { Divider, Grid, Icon, List } from "semantic-ui-react";
import { ThemeIcon } from "../../../components/shared";
import { MFAIcons } from "../../../configs";

export const TOTPAuthenticator: React.FunctionComponent<any> = (props: WithTranslation): JSX.Element => {
    return (

        <Grid padded={ true }>
            <Grid.Row columns={ 2 }>
                <Grid.Column width={ 11 } className="first-column">
                    <List.Content floated="left">
                        <ThemeIcon
                            icon={ MFAIcons.authenticatorApp }
                            size="mini"
                            twoTone={ true }
                            transparent={ true }
                            square={ true }
                            rounded={ true }
                            relaxed={ true }
                        />
                    </List.Content>
                    <List.Content>
                        <List.Header>
                            Authenticator App
                        </List.Header>
                        <List.Description>
                            Use your phone
                        </List.Description>
                    </List.Content>
                </Grid.Column>
                <Grid.Column width={ 5 } className="last-column">
                    <List.Content floated="right">
                        <Icon
                            link={ true }
                            onClick={ () => {} }
                            className="list-icon"
                            size="small"
                            color="grey"
                            name="pencil alternate"
                        />
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
