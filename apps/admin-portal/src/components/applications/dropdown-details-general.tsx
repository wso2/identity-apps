/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { Component, FunctionComponent, useState } from "react";
import { Button, Divider, Form, Grid, Header, Portal, Segment } from "semantic-ui-react";

interface GeneralDetailsProps {
    name: string;
    description: string;
}

/**
 * Shows the brief general details of the application.
 * @param props Pass the application name and description.
 */
export const GeneralDetails: FunctionComponent<GeneralDetailsProps> = (props): JSX.Element => {
    return (
        <div>
            <Form>
                <Grid className="details-grid">
                    <Grid.Row columns={ 1 } className="details-row">
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 2 }/>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 } className="details-column">
                            <label className="tag">Name</label>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 4 }>
                            <label className="value">{ props.name }</label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 } className="details-row">
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 2 }/>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 } className="details-column">
                            <label className="tag">Description</label>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 4 }>
                            <label className="value">{ props.description }</label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden/>
            </Form>
        </div>
    );
};
