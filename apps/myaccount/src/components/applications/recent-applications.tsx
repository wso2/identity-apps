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
import { Text } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { Grid, Popup } from "semantic-ui-react";
import { RecentApplicationCard } from "./recent-application-card";
import { Application } from "../../models";

/**
 * Proptypes for the recent applications component.
 * Also see {@link RecentApplications.defaultProps}
 */
interface RecentApplicationsProps extends TestableComponentInterface {
    onAppNavigate: (id: string, url: string) => void;
    recentApps: Application[];
    showFavourites?: boolean;
}

/**
 * Recent applications component.
 *
 * @return {JSX.Element}
 */
export const RecentApplications: FunctionComponent<RecentApplicationsProps> = (
    props: RecentApplicationsProps
): JSX.Element => {

    const {
        onAppNavigate,
        recentApps,
        showFavourites,
        ["data-testid"]: testId
    } = props;

    return (
        <Grid>
            <Grid.Row>
                {
                    (recentApps && recentApps.length && recentApps.length > 0)
                        ? recentApps.map((app) => (
                            <Grid.Column computer={ 5 } tablet={ 16 } mobile={ 16 } key={ app.id }>
                                <Popup
                                    trigger={ (
                                        <div>

                                            <RecentApplicationCard
                                                data-testid={ `${testId}-recent-application-card` }
                                                app={ app }
                                                showFavouriteIcon={ showFavourites }
                                                onAppNavigate={ onAppNavigate }
                                            />

                                        </div>
                                    ) }
                                    position="top center"
                                    content={ (
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Text>
                                                    { 
                                                        app.name?.length > 55 
                                                        ? app.name?.substring(0, 56) + " ..." 
                                                        : app.name 
                                                    }
                                                </Text>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Text className="hint-description">
                                                    { 
                                                        app.description
                                                    }
                                                </Text>
                                            </Grid.Column>
                                        </Grid.Row>
                                    ) }
                                /> 
                            </Grid.Column>
                        ))
                        : null
                }
            </Grid.Row>
        </Grid>
    );
};

/**
 * Recent applications component default props.
 * See type definitions in {@link RecentApplicationsProps}
 */
RecentApplications.defaultProps = {
    "data-testid": "recent-applications",
    showFavourites: true
};
