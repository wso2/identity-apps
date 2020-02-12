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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Forms } from "@wso2is/forms";
import { isEmpty } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid, Label } from "semantic-ui-react";
import { createApplication } from "../../api/application";
import { history } from "../../helpers";
import { MainApplicationInterface } from "../../models";

interface WizardSummaryProps {
    data: MainApplicationInterface;
    back: any;
    next: any;
    loadData: any;
}

/**
 * Creates Summary of the application data.
 *
 * @param props WizardSummaryProps
 */
export const WizardSummary: FunctionComponent<WizardSummaryProps> = (props): JSX.Element => {
    const {
        data,
        back,
        loadData,
        next
    } = props;

    useEffect(() => {
        loadData();
    }, []);

    const dispatch = useDispatch();

    const createGeneralSettings = () => {
        const generalSetting = {
            Name: data.name,
            Description: data.description,
            Image_Url: data.imageUrl,
            Access_Url: data.accessUrl,
            Discoverable_By_EndUsers: data.advancedConfigurations.discoverableByEndUsers ? "true" : "false"
        };
        const result = Object.keys(generalSetting).map((detail) => {
            if (detail !== null) {
                return (
                    <Grid.Row columns={ 2 } key={ detail } className="endpoint-row">
                        <Grid.Column width={ 5 }>
                            { detail.replace(/_/g, " ") }
                        </Grid.Column>
                        <Grid.Column width={ 11 }>
                            { generalSetting[detail] }
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        });
        return result;
    };

    const buildCallBackURLWithSeparator = (url: string): string => {
        if (url.includes("regexp=(")) {
            url = url.replace("regexp=(", "");
            url = url.replace(")", "");
            url =  url.split("|").join(",");
        }
        return url;
    };

    const createProtocolSettings = () => {
        let result = {};
        if (data.inboundProtocolConfiguration.oidc !== null) {
            const oidc = data.inboundProtocolConfiguration.oidc;
            const setting = {
                Allowed_Grant_Type: oidc.grantTypes.toString(),
                Callback_Urls: oidc.callbackURLs && buildCallBackURLWithSeparator(oidc.callbackURLs.toString()),
                Public_Client: oidc.publicClient ? "true" : "false"
            };
            result = Object.keys(setting).map((detail) => {
                if (detail !== null && setting[detail] !== null) {
                    return (
                        <Grid.Row columns={ 2 } key={ detail } className="endpoint-row">
                            <Grid.Column width={ 5 }>
                                { detail.replace(/_/g, " ") }
                            </Grid.Column>
                            <Grid.Column width={ 11 }>
                                { setting[detail] }
                            </Grid.Column>
                        </Grid.Row>
                    );
                }
            });
        }
        return result;
    };

    const createNewApplication = (app) => {
        createApplication(app)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully Added the application",
                    level: AlertLevels.SUCCESS,
                    message: "Creation successful"
                }));
                if (!isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdAppID = location.substring(location.lastIndexOf("/") + 1);
                    history.push("/applications/" + createdAppID);
                }
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while creating the application",
                    level: AlertLevels.ERROR,
                    message: "Creation Error"
                }));
            });
    };

    const handleSubmit = () => {
        next();
        createNewApplication(data);
        history.push("/applications");
    };

    return (
        <>
            {
                (
                    <Forms
                        onSubmit={ (values) => {
                            handleSubmit();
                        } }
                    >
                        <Grid className={ "protocolForm" }>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Label as="a" color="orange" ribbon> General Settings</Label>
                                </Grid.Column>
                            </Grid.Row>
                            { createGeneralSettings() }
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Label as="a" color="blue" ribbon> Protocol Settings</Label>
                                </Grid.Column>
                            </Grid.Row>
                            { createProtocolSettings() }
                            <Grid.Row columns={ 3 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                                    <Button onClick={ back } size="small" className="form-button">
                                        Back
                                    </Button>
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }/>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                                    <Button primary type="submit" size="small" className="form-button">
                                        Submit
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms
                    >
                )
            }
        </>
    );
};
