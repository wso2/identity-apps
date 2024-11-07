/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import OxygenCode from "@oxygen-ui/react/Code";
import Divider from "@oxygen-ui/react/Divider";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CheckboxFieldAdapter,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    TextFieldAdapter
} from "@wso2is/form/src";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { ConfigurationsFormValuesInterface } from "../../models/ui";
import "./configurations-form.scss";

interface ConfigurationsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store manager.
     */
    userStoreManager:
        | RemoteUserStoreManagerType.WSOutboundUserStoreManager
        | RemoteUserStoreManagerType.RemoteUserStoreManager;
    /**
     * Whether the form is read only or not.
     */
    isReadOnly: boolean;
}

const ConfigurationsForm: FunctionComponent<ConfigurationsFormPropsInterface> = ({
    isReadOnly,
    ["data-componentid"]: componentId = "component-id"
}: ConfigurationsFormPropsInterface): ReactElement => {
    const usernameClaimUri: string = ClaimManagementConstants.USER_NAME_CLAIM_URI;
    const userIDClaimUri: string = ClaimManagementConstants.USER_ID_CLAIM_URI;

    const onSubmit = (values: ConfigurationsFormValuesInterface) => {
        console.log(values);
    };

    const initialValues: Partial<ConfigurationsFormValuesInterface> = {
        readGroups: true
    };

    return (
        <FinalForm
            onSubmit={ (values: ConfigurationsFormValuesInterface) => {
                onSubmit(values);
            } }
            // validate={ validateForm }
            initialValues={ initialValues }
            render={ ({ handleSubmit }: FormRenderProps) => {
                return (
                    <form onSubmit={ handleSubmit } className="configurations-form">
                        <Typography variant="h5">User Attributes</Typography>
                        <Divider />
                        <Grid container spacing={ 2 } className="form-grid-container">
                            <Grid xs={ 12 } md={ 4 }>
                                <FormLabel required>Username</FormLabel>
                                <br />
                                <OxygenCode variant="caption">{ usernameClaimUri }</OxygenCode>
                            </Grid>
                            <Grid xs={ 12 } md={ 6 }>
                                <FinalFormField
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    ariaLabel="userStoreName"
                                    data-componentid={ `${componentId}-field-name` }
                                    name={ usernameClaimUri }
                                    type="text"
                                    placeholder={ "Ex: un" }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    helperText={
                                        (<Hint className="hint" compact>
                                            {
                                                "Specify the attribute from the user store that represents the user's primary identifier."
                                            }
                                        </Hint>)
                                    }
                                />
                            </Grid>

                            <Grid xs={ 12 } md={ 4 }>
                                <FormLabel required>User ID</FormLabel>
                                <br />
                                <OxygenCode variant="caption">{ userIDClaimUri }</OxygenCode>
                            </Grid>
                            <Grid xs={ 12 } md={ 6 }>
                                <FinalFormField
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    ariaLabel="userStoreName"
                                    data-componentid={ `${componentId}-field-name` }
                                    name={ userIDClaimUri }
                                    type="text"
                                    placeholder={ "Ex: uid" }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    helperText={
                                        (<Hint className="hint" compact>
                                            {
                                                "Specify the attribute from the user store that represents the unique ID for the user."
                                            }
                                        </Hint>)
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="h5">Group Attributes</Typography>
                        <Divider />

                        <FormSpy subscription={ { values: true } }>
                            { ({ values }: { values: ConfigurationsFormValuesInterface }) => {
                                const isReadGroupsEnabled: boolean = values?.readGroups;

                                return (
                                    <Grid container spacing={ 2 } className="form-grid-container">
                                        <Grid xs={ 12 }>
                                            <FinalFormField
                                                label={ "Read groups" }
                                                name="readGroups"
                                                FormControlProps={ {
                                                    fullWidth: true,
                                                    margin: "dense"
                                                } }
                                                ariaLabel="connectedUserStoreType"
                                                data-componentid={ `${componentId}-field-description` }
                                                component={ CheckboxFieldAdapter }
                                                disabled={ isReadOnly }
                                                hint={
                                                    (<Hint className="hint" compact>
                                                        {
                                                            "Enable this option to retrieve group information from the user store."
                                                        }
                                                    </Hint>)
                                                }
                                            />
                                        </Grid>

                                        <Grid xs={ 12 } md={ 4 }>
                                            <FormLabel
                                                required={ isReadGroupsEnabled }
                                                disabled={ isReadOnly || !isReadGroupsEnabled }
                                            >
                                                Group name
                                            </FormLabel>
                                        </Grid>
                                        <Grid xs={ 12 } md={ 6 }>
                                            <FinalFormField
                                                FormControlProps={ {
                                                    margin: "dense"
                                                } }
                                                ariaLabel="groupName"
                                                data-componentid={ `${componentId}-field-name` }
                                                name="groupName"
                                                type="text"
                                                placeholder={ "Ex: groupName" }
                                                component={ TextFieldAdapter }
                                                disabled={ isReadOnly || !isReadGroupsEnabled }
                                                helperText={
                                                    (<Hint className="hint" compact>
                                                        {
                                                            "Specify the attribute from the user store that stores the group name."
                                                        }
                                                    </Hint>)
                                                }
                                            />
                                        </Grid>

                                        <Grid xs={ 12 } md={ 4 }>
                                            <FormLabel
                                                required={ isReadGroupsEnabled }
                                                disabled={ isReadOnly || !isReadGroupsEnabled }
                                            >
                                                Group ID
                                            </FormLabel>
                                        </Grid>
                                        <Grid xs={ 12 } md={ 6 }>
                                            <FinalFormField
                                                FormControlProps={ {
                                                    margin: "dense"
                                                } }
                                                ariaLabel="groupID"
                                                data-componentid={ `${componentId}-field-name` }
                                                name="groupID"
                                                type="text"
                                                placeholder={ "Ex: groupID" }
                                                component={ TextFieldAdapter }
                                                disabled={ isReadOnly || !isReadGroupsEnabled }
                                                helperText={
                                                    (<Hint className="hint" compact>
                                                        {
                                                            "Specify the attribute from the user store that stores the group ID."
                                                        }
                                                    </Hint>)
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            } }
                        </FormSpy>
                    </form>
                );
            } }
        />
    );
};

export default ConfigurationsForm;
