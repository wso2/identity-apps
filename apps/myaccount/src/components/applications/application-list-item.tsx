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

import { TestableComponentInterface } from "@wso2is/core/models";
import { AnimatedAvatar, AppAvatar } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { Icon, Item, List } from "semantic-ui-react";
import { Application } from "../../models";

/**
 * Proptypes for the application list item component.
 * Also see {@link ApplicationListItem.defaultProps}
 */
interface ApplicationListItemProps extends TestableComponentInterface {
    app: Application;
    onAppNavigate: (id: string, url: string) => void;
    showFavouriteIcon: boolean;
}

/**
 * Application list item component.
 *
 * @returns JSX.Element
 */
export const ApplicationListItem: FunctionComponent<ApplicationListItemProps> = (
    props: ApplicationListItemProps
): JSX.Element => {

    const {
        app,
        onAppNavigate,
        showFavouriteIcon,
        ["data-testid"]: testId
    } = props;

    return (
        <Item.Group unstackable onClick={ () => onAppNavigate(app.id, app.accessUrl) } data-testid={ testId }>
            <Item className="application-list-item">
                <List.Content className="icon-container" floated="left">
                    {
                        app.image
                            ? (
                                <AppAvatar
                                    square
                                    size="mini"
                                    name={ app.name }
                                    image={ app.image }
                                    spaced="right"
                                    data-testid={ `${ testId }-item-image` }
                                />
                            )
                            : (
                                <AppAvatar
                                    square
                                    image={ (
                                        <AnimatedAvatar
                                            name={ app.name }
                                            size="mini"
                                            data-testid={ `${ testId }-item-image-inner` }
                                        />
                                    ) }
                                    size="mini"
                                    spaced="right"
                                    data-testid={ `${ testId }-item-image` }
                                />
                            )
                    }
                </List.Content>
                <Item>
                    <Item.Content
                        className="text-content-container app-text"
                    >
                        <Item.Header className="app-header">
                            <div className="item-header">{ app.name }</div>
                            {
                                (showFavouriteIcon && app.favourite)
                                    ? (
                                        <Icon
                                            name={
                                                app.favourite ? "star" : "star outline"
                                            }
                                            size="small"
                                            className="favourite-icon favoured"
                                        />
                                    ) : null
                            }
                        </Item.Header>
                        {
                            app.description
                                ? (
                                    <Item.Meta className="item-description app-description">
                                        { app.description }
                                    </Item.Meta>
                                ) : null
                        }
                        {
                            (app.tags && app.tags.length && app.tags.length > 0) 
                                ? (
                                    <Item.Extra>
                                        <Icon name="tag" size="small"/>
                                        {
                                            app.tags.map((tag, index) => {
                                                if (index === 0) {
                                                    return <span className="tag" key={ index }>{ " " }{ tag }</span>;
                                                }

                                                return <span className="tag" key={ index }>, { tag }</span>;
                                            })
                                        }
                                    </Item.Extra>
                                ) : null
                        }
                    </Item.Content>
                </Item>
            </Item>
        </Item.Group>
    );
};

/**
 * Default properties of {@link ApplicationListItem}
 * See type definitions in {@link ApplicationListItemProps}
 */
ApplicationListItem.defaultProps = {
    "data-testid": "application-list-item"
};
