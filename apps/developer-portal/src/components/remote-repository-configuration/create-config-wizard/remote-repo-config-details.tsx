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
import { useTranslation } from "react-i18next";
import { Grid, GridColumn,  GridRow } from "semantic-ui-react";

interface RemoteRepoConfigDetailsProps extends TestableComponentInterface {
    onSubmit: (values: any) => void;
    triggerSubmit: boolean;
}

export const RemoteRepoConfigDetails: FunctionComponent<RemoteRepoConfigDetailsProps> = (
    props: RemoteRepoConfigDetailsProps
): ReactElement => {

    const { t } = useTranslation();

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
                            label={ t(
                                "devPortal:components.remoteConfig.createConfigForm.configName.label"
                            ) }
                            placeholder={ t(
                                "devPortal:components.remoteConfig.createConfigForm.configName.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "devPortal:components.remoteConfig.createConfigForm.configName.requiredMessage"
                            ) }
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
                                        label: t(
                                            "devPortal:components.remoteConfig.createConfigForm.enableConfig.label"
                                        ),
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
                            label={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitUrl.label"
                            )  }
                            placeholder={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitUrl.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitUrl.requiredMessage"
                            ) }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="gitBranch"
                            label={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitBranch.label"
                            )  }
                            placeholder={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitBranch.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitBranch.requiredMessage"
                            ) }
                        />
                    </GridColumn>
                </GridRow>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="gitDirectory"
                            label={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitDirectory.label"
                            )  }
                            placeholder={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitDirectory.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitDirectory.requiredMessage"
                            ) }
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
                            label={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitUserName.label"
                            )  }
                            placeholder={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitUserName.placeholder"
                            ) }
                            required={ false }
                            requiredErrorMessage={ "" }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="accessToken"
                            label={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitAccessToken.label"
                            )  }
                            placeholder={ t(
                                "devPortal:components.remoteConfig.createConfigForm.gitAccessToken.placeholder"
                            ) }
                            required={ false }
                            requiredErrorMessage={ "" }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
}
