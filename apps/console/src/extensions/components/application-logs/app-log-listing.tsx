/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { ReactElement, FunctionComponent, useEffect, useState } from "react";
import { PageLayout } from "@wso2is/react-components";
import { Grid } from "semantic-ui-react";
import { InterfaceAppLogEntry, InterfaceAppLogResponse } from "./app-log-models";
import { getAppLogs } from "./app-log-api";
import "./app-log-style.css";

const ApplicationLogListing: FunctionComponent = (): ReactElement => {

    const [ logData, setLogData ] = useState<InterfaceAppLogEntry[]>(undefined);

    useEffect(() => {
        getAppLogs().then((response: InterfaceAppLogResponse) => {
            setLogData(response.logs)
        }).catch(() => {
            // TODO : need to handle error
        })
    },[ logData !== undefined ]);

    return (
        <PageLayout
            title={ "Application Logs" }
            description={ "View application logs" }
            showBottomDivider={ true }
        >
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 3 }>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="log-container" column={ 2 }>
                    { logData && logData.length != 0 && 
                        logData.map((log: InterfaceAppLogEntry) => {
                            return (
                                <>
                                    <Grid.Column className="log-time" mobile={ 8 } tablet={ 8 } computer={ 3 }>
                                        <p>{ log.timestamp }</p>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 13 }>
                                        <p className="log-message">{ log.logMessage }</p>
                                    </Grid.Column>
                                </>
                            )
                        })
                    }
                </Grid.Row>
            </Grid>
        </PageLayout>
    )
}

export default ApplicationLogListing;
