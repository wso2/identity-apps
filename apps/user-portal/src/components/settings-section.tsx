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

import React, { FunctionComponent, MouseEvent } from "react";
import { Card, Grid, Header, List } from "semantic-ui-react";
import { ThemeIcon, ThemeIconSizes } from "./icon";

/**
 * Proptypes for the settings section component.
 */
interface SettingsSectionProps {
    actionTitle?: string;
    contentPadding?: boolean;
    onActionClick?: (event: MouseEvent<HTMLElement>) => void;
    description?: string;
    header: string;
    icon?: any;
    iconFloated?: "left" | "right";
    iconStyle?: "twoTone" | "default" | "colored";
    iconSize?: ThemeIconSizes;
    isEdit?: boolean;
}

/**
 * Settings section component.
 *
 * @param {PropsWithChildren<any>} props
 * @return {any}
 */
export const SettingsSection: FunctionComponent<SettingsSectionProps> = (props): JSX.Element => {
    const {
        icon, iconFloated, iconSize, iconStyle, header, description, onActionClick, actionTitle, isEdit, contentPadding
    } = props;

    return (
        <Card className="settings-card" fluid padded="very">
            <Card.Content>
                <Grid>
                    <Grid.Row className="header-section" columns={ 2 }>
                        <Grid.Column  width={ 10 } className="no-padding">
                            <Header as="h2">{ header }</Header>
                            <Card.Meta>{ description }</Card.Meta>
                        </Grid.Column>
                        <Grid.Column width={ 6 } className="no-padding">
                            {
                                icon
                                    ?
                                    <ThemeIcon
                                        icon={ icon }
                                        transparent
                                        size={ iconSize }
                                        floated={ iconFloated }
                                        defaultIcon={ iconStyle === "default" }
                                        twoTone={ iconStyle === "twoTone" }
                                        colored={ iconStyle === "colored" }
                                    />
                                    : null
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={ `main-content ${ contentPadding ? "" : "no-padding" }` } columns={ 1 }>
                        <Grid.Column className="no-padding" width={ 16 }>
                            { props.children }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
            { (actionTitle !== "" && !isEdit)
                ?
                <Card.Content className="extra-content" extra>
                    <List selection verticalAlign="middle">
                        <List.Item className="action-button" onClick={ onActionClick }>
                            <List.Header className="action-button-text"
                                         onClick={ onActionClick }>{ actionTitle }</List.Header>
                        </List.Item>
                    </List>
                </Card.Content>
                : null
            }
        </Card>
    );
};

/**
 * Default proptypes for the settings section component.
 */
SettingsSection.defaultProps = {
    actionTitle: "",
    contentPadding: false,
    description: "",
    header: "",
    isEdit: false
};
