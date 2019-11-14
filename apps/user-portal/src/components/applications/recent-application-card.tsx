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

import React, { FunctionComponent } from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { Application } from "../../models";

/**
 * Proptypes for the recent application card component.
 */
interface RecentApplicationCardProps {
    app: Application;
    navigateToApp: () => void;
}

/**
 * Recent application card component.
 *
 * @return {JSX.Element}
 */
export const RecentApplicationCard: FunctionComponent<RecentApplicationCardProps> = (
    props: RecentApplicationCardProps
): JSX.Element => {
    const { app, navigateToApp } = props;

    return (
        <Card className="application-card recent" onClick={ navigateToApp } link={ false }>
            <Image
                className="logo"
                src={ app.logo }
                centered
            />
            <Card.Content>
                <div className="content text">
                    <Card.Header>{ app.name }</Card.Header>
                    {
                        app.tags && app.tags.length && app.tags.length > 0
                            ? (
                                <Card.Meta>
                                    <Icon name="tag" size="small"/>
                                    {
                                        app.tags.map((tag, index) => {
                                            if (index === 0) {
                                                return <span className="tag" key={ index }>&ensp;{ tag }</span>;
                                            }
                                            return <span className="tag" key={ index }>, { tag }</span>;
                                        })
                                    }
                                </Card.Meta>
                            )
                            : null
                    }
                </div>
                <div className="content icon">
                    <Icon
                        name={
                            app.favourite ? "star" : "star outline"
                        }
                        className={
                            app.favourite ? "favourite-icon favoured" : "favourite-icon"
                        }
                    />
                </div>
            </Card.Content>
        </Card>
    );
};
