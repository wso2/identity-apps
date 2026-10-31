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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, GenericIcon, Popup } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, SVGProps } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";

/**
 * Props interface of {@link ConfigurationCard}.
 */
interface ConfigurationCardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Card description.
     */
    description: string;

    /**
     * Whether the card is disabled (greyed out and non-clickable).
     */
    disabled?: boolean;

    /**
     * Card icon.
     */
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;

    /**
     * Callback fired when the card is clicked.
     */
    onClick: () => void;

    /**
     * Card title.
     */
    title: string;
}

/**
 * Clickable configuration card with an icon, title, description and an edit action.
 */
const ConfigurationCard: FunctionComponent<ConfigurationCardPropsInterface> = ({
    description,
    disabled = false,
    icon: IconComponent,
    onClick,
    title,
    ["data-componentid"]: componentId = "cds-configuration-card"
}: ConfigurationCardPropsInterface): ReactElement => {

    const { t } = useTranslation();

    return (
        <EmphasizedSegment
            className={ classNames("clickable", { disabled }) }
            data-componentid={ componentId }
        >
            <List>
                <List.Item
                    onClick={ disabled ? undefined : onClick }
                    data-componentid={ `${ componentId }-link` }
                >
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 12 }>
                                <GenericIcon
                                    transparent
                                    verticalAlign="middle"
                                    rounded
                                    icon={ <IconComponent className="icon" fill="black" /> }
                                    spaced="right"
                                    size="mini"
                                    floated="left"
                                />
                                <List.Header>{ title }</List.Header>
                                <List.Description data-componentid={ `${ componentId }-description` }>
                                    { description }
                                </List.Description>
                            </Grid.Column>
                            <Grid.Column
                                width={ 4 }
                                verticalAlign="middle"
                                textAlign="right"
                            >
                                <Popup
                                    content={ t("common:edit") }
                                    trigger={ <Icon color="grey" name="pencil" /> }
                                    inverted
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            </List>
        </EmphasizedSegment>
    );
};

export default ConfigurationCard;
