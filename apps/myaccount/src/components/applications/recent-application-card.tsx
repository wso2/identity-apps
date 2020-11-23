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
import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { Card, Icon } from "semantic-ui-react";
import { Application } from "../../models";
import { AppAvatar } from "../shared";

/**
 * Proptypes for the recent application card component.
 * Also see {@link RecentApplicationCardProps.defaultProps}
 */
interface RecentApplicationCardProps extends TestableComponentInterface {
    app: Application;
    onAppNavigate: (id: string, url: string) => void;
    showFavouriteIcon: boolean;
}

/**
 * Recent application card component.
 *
 * @return {JSX.Element}
 */
export const RecentApplicationCard: FunctionComponent<RecentApplicationCardProps> = (
    props: RecentApplicationCardProps
): JSX.Element => {

    const { app, onAppNavigate, showFavouriteIcon } = props;
    const { ["data-testid"]: testId } = props;

    const appImageContainerClassNames = classNames({
        [ "default" ]: !app.image
    }, "application-image");

    return (
        <Card
            className="application-card recent"
            onClick={ () => onAppNavigate(app.id, app.accessUrl) }
            link={ false }
            data-testid={ testId }
        >
            <Card.Content className={ appImageContainerClassNames }>
                <AppAvatar spaced="right" size="small" name={ app.name } image={ app.image } onCard/>
            </Card.Content>
            <Card.Content className="application-content">
                <div className="text-content-container">
                    <Card.Header className="application-name">{ app.name }</Card.Header>
                    <Card.Description className="application-description">{ app.description }</Card.Description>
                    {
                        app.tags && app.tags.length && app.tags.length > 0
                            ? (
                                <Card.Meta>
                                    <Icon name="tag" size="small"/>
                                    {
                                        app.tags.map((tag, index) => {
                                            if (index === 0) {
                                                return (
                                                    <span className="application-tag" key={ index }>
                                                        { " " }{ tag }
                                                    </span>
                                                );
                                            }
                                            return (
                                                <span className="application-tag" key={ index }>
                                                    { ", " }{ tag }
                                                </span>
                                            );
                                        })
                                    }
                                </Card.Meta>
                            )
                            : null
                    }
                </div>
                <div className="favourite-icon-container">
                    {
                        showFavouriteIcon && app.favourite
                            ? (
                                <Icon
                                    name={
                                        app.favourite ? "star" : "star outline"
                                    }
                                    className={
                                        app.favourite ? "favourite-icon favoured" : "favourite-icon"
                                    }
                                />
                            )
                            : null
                    }
                </div>
            </Card.Content>
        </Card>
    );
};

/**
 * Default properties of {@link RecentApplicationCard}
 * See type definitions in {@link RecentApplicationCardProps}
 */
RecentApplicationCard.defaultProps = {
    "data-testid": "recent-application-card"
};
