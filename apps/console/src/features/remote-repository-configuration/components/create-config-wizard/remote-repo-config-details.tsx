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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";

interface RemoteRepoConfigDetailsProps extends TestableComponentInterface {
    onSubmit: (values: any) => void;
    triggerSubmit: boolean;
}

export const RemoteRepoConfigDetails: FunctionComponent<RemoteRepoConfigDetailsProps> = (
    props: RemoteRepoConfigDetailsProps
): ReactElement => {

    const { onSubmit, triggerSubmit } = props;

    const [ isEnabled, setIsEnabled ] = useState<boolean>(false);

    const getFormValues = (values: any): any => {
        return {
            accessToken: values.get("accessToken").toString(),
            configEnabled: isEnabled,
            configName: values.get("configName").toString(),
            gitBranch: values.get("gitBranch").toString(),
            gitDirectory: values.get("gitDirectory").toString(),
            gitUrl: values.get("gitURL").toString(),
            pollingfreq: parseInt(values.get("pollingFreq").toString()),
            userName: values.get("userName").toString()
        };
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            onChange={ (isPure: boolean, values: Map<string, FormValue>) => {
                if (values.get("configEnabled").includes("configEnabled") !== isEnabled) {
                    setIsEnabled(!!values.get("configEnabled").includes("configEnabled"));
                }
            } }
            submitState={ triggerSubmit }
        >
             <Grid>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="configName"
                            label={ "Configuration Name" }
                            placeholder={ "Name for the repository configuration" }
                            required={ true }
                            requiredErrorMessage={ "Configuration Name is required." }
                        />
                    </GridColumn>
                </GridRow>
                <GridRow columns={ 1 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                                name="configEnabled"
                                required={ false }
                                requiredErrorMessage=""
                                type="checkbox"
                                toggle
                                value={ isEnabled ? [ "configEnabled" ] : [] }
                                children={ [
                                    {
                                        label: "Is Config Enabled",
                                        value: "configEnabled"
                                    }
                                ] }
                            />
                    </GridColumn>
                </GridRow>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="gitURL"
                            label={ "Git Repository URI" }
                            placeholder={ "Git repository URL" }
                            required={ true }
                            requiredErrorMessage={ "Git Repository URL is required." }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="gitBranch"
                            label={ "Git Branch" }
                            placeholder={ "GIT Branch" }
                            required={ true }
                            requiredErrorMessage={ "Git Branch is required." }
                        />
                    </GridColumn>
                </GridRow>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="gitDirectory"
                            label={ "Directory" }
                            placeholder={ "Git Directory" }
                            required={ true }
                            requiredErrorMessage={ "Git directory is required." }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="number"
                            name="pollingFreq"
                            label={ "Polling Frequency" }
                            required={ true }
                            value="60"
                            requiredErrorMessage={ "" }
                        />
                    </GridColumn>
                </GridRow>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="userName"
                            label={ "User Name" }
                            placeholder={ "GIT Username" }
                            required={ false }
                            requiredErrorMessage={ "" }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="accessToken"
                            label={ "Personal Access Token" }
                            placeholder={ "Personal Access Token" }
                            required={ false }
                            requiredErrorMessage={ "" }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
}
