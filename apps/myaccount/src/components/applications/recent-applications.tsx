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
import { Grid } from "semantic-ui-react";
import { RecentApplicationCard } from "./recent-application-card";
import { Application } from "../../models";

/**
 * Proptypes for the recent applications component.
 */
interface RecentApplicationsProps {
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
    const { onAppNavigate, recentApps, showFavourites } = props;

    return (
        <Grid>
            <Grid.Row>
                {
                    (recentApps && recentApps.length && recentApps.length > 0)
                        ? recentApps.map((app) => (
                            <Grid.Column computer={ 5 } tablet={ 16 } mobile={ 16 } key={ app.id }>
                                <RecentApplicationCard
                                    app={ app }
                                    showFavouriteIcon={ showFavourites }
                                    onAppNavigate={ onAppNavigate }
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
 */
RecentApplications.defaultProps = {
    showFavourites: true
};
