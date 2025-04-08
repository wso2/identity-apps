/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AutocompleteRenderGetTagProps, AutocompleteRenderInputParams, Typography } from "@mui/material";
import TextField from "@oxygen-ui/react/TextField/TextField";
import { AutoCompleteRenderOption } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/auto-complete-render-option";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CheckboxFieldAdapter, FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { Button, Hint, Steps } from "@wso2is/react-components";
import { t } from "i18next";
import React, { HTMLAttributes, SyntheticEvent, memo, useMemo, useState } from "react";
import "./add-integration-form.scss";
import { useDispatch } from "react-redux";
import { Checkbox, Divider, Grid, Icon, Input, Modal, Radio } from "semantic-ui-react";

import { v4 as uuidv4 } from "uuid";
import { STATIC_CREDENTIAL_ENABLED_INTEGRATIONS } from "../../constants/agents";
import Autocomplete from "@oxygen-ui/react/Autocomplete";

interface AddIntegrationFormProps extends IdentifiableComponentInterface {
    selectedIntegration: any;
    onClose: any;
    onUpdate: any;
}

enum CredentialType {
    STATIC = "static",
    OAUTH2 = "oauth2"
}

enum OAuthCredentialGrantType {
    ACCOUNT = "account",
    REQUEST_ON_DEMAND = "request_on_demand"
}

export default function AddIntegrationWizard({
    selectedIntegration,
    onClose,
    onUpdate,
    ["data-componentid"]: componentId
}: AddIntegrationFormProps) {
    const dispatch: any = useDispatch();

    const [ selectedCredentialType, setSelectedCredentialType ] = useState<CredentialType>(CredentialType.OAUTH2);

    const [ isAccount, setIsAccountSelected ] = useState(false);
    const [ isRequest, setIsRequest ] = useState(false);


    // Define state for each checkbox
    const [ isCalendarSelected, setCalendarSelected ] = useState(false);
    const [ isReadonlySelected, setReadonlySelected ] = useState(false);
    const [ isCeventsSelected, setCeventsSelected ] = useState(false);
    const [ isFreebusySelected, setFreebusySelected ] = useState(false);




    const configureIntegration = () => {
        onClose();
        onUpdate(selectedIntegration?.id);
    };


    const Scopes: any = memo(() => {
        return (
            <div className="mt-3">
                <Typography variant="body1">Scopes</Typography>

                <Input
                    data-testid="user-mgt-groups-list-search-input"
                    icon={ <Icon name="search" /> }
                    onChange={ null }
                    placeholder={ "Search scopes" }
                    floated="left"
                    size="small"
                    style={ { width: "100%", marginBottom: "15px", marginTop: "15px" } }
                />

                <div style={ { height: "130px", overflow: "scroll", overflowX: "hidden" } }>

                    <div style={ { display: "flex", flexDirection: "row", alignItems: "center" } }>
                        <Checkbox
                            className="mt-5"
                            label={ "" }
                            onChange={ () => setCalendarSelected(!isCalendarSelected) }
                            checked={ isCalendarSelected }
                            data-componentid={ `${componentId}-connected-account-checkbox-calendar` }
                        />
                        <div style={ { marginTop: "5%", marginLeft: "2%" } }>
                            <Typography variant="body1">
      See, edit, share, and delete all the calendars you can access using Google Calendar.
                            </Typography>
                            <Typography variant="body2">
      https://www.googleapis.com/auth/calendar
                            </Typography>
                        </div>
                    </div>

                    <div style={ { display: "flex", flexDirection: "row", alignItems: "center" } }>
                        <Checkbox
                            className="mt-5"
                            label={ "" }
                            onChange={ () => setReadonlySelected(!isReadonlySelected) }
                            checked={ isReadonlySelected }
                            data-componentid={ `${componentId}-connected-account-checkbox-readonly` }
                        />
                        <div style={ { marginTop: "5%", marginLeft: "2%" } }>
                            <Typography variant="body1">View events on all your calendars.</Typography>
                            <Typography variant="body2">
      https://www.googleapis.com/auth/calendar.events.readonly
                            </Typography>
                        </div>
                    </div>

                    <div style={ { display: "flex", flexDirection: "row", alignItems: "center" } }>
                        <Checkbox
                            className="mt-5"
                            label={ "" }
                            onChange={ () => setCeventsSelected(!isCeventsSelected) }
                            checked={ isCeventsSelected }
                            data-componentid={ `${componentId}-connected-account-checkbox-cevents` }
                        />
                        <div style={ { marginTop: "5%", marginLeft: "2%" } }>
                            <Typography variant="body1">View and edit events on all your calendars.</Typography>
                            <Typography variant="body2">
      https://www.googleapis.com/auth/calendar.events
                            </Typography>
                        </div>
                    </div>

                    <div style={ { display: "flex", flexDirection: "row", alignItems: "center" } }>
                        <Checkbox
                            className="mt-5"
                            label={ "" }
                            onChange={ () => setFreebusySelected(!isFreebusySelected) }
                            checked={ isFreebusySelected }
                            data-componentid={ `${componentId}-connected-account-checkbox-freebusy` }
                        />
                        <div style={ { marginTop: "5%", marginLeft: "2%" } }>
                            <Typography variant="body1">View your availability in your calendars.</Typography>
                            <Typography variant="body2">
      https://www.googleapis.com/auth/calendar.events.freebusy
                            </Typography>
                        </div>
                    </div>


                </div>

            </div>
        );
    });

    return (
        <Modal
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ !!selectedIntegration }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header style={ { display: "flex", alignItems: "center", padding: "4%", paddingLeft: "4%" } }>
                <img
                    src={ selectedIntegration.imageUrl }
                    alt={ `${selectedIntegration.name} logo` }
                    style={ { width: "25px", height: "25px", marginRight: "12px" } }
                />
                <div>
                    { selectedIntegration?.name }
                </div>
            </Modal.Header>
            <Modal.Content scrolling style={ { height: "70vh" } }>
                { selectedIntegration?.name === "MCP Server" ? (<div>
                    <FinalForm
                        onSubmit={ (values: any) => {


                        } }
                        render={ ({ handleSubmit }: FormRenderProps) => {
                            return (<form id="addAgentForm" onSubmit={ handleSubmit }>
                                <FinalFormField
                                    name="name"
                                    label="Name"
                                    autoComplete="new-password"
                                    placeholder="MCP server name"
                                    component={ TextFieldAdapter }
                                />
                                <FinalFormField
                                    label="Authorized Redirect URL"
                                    name="callbackUrl"
                                    className="mt-3"
                                    autoComplete="new-password"
                                    placeholder="Enter the callback URL"
                                    component={ TextFieldAdapter }
                                />
                            </form>);
                        } }
                    />

                </div>) : (
                    <div>
                        <Typography variant="h6">Connection Method</Typography>

                        <Radio
                            className="mt-3"
                            label={ "OAuth 2.0" }
                            onChange={ () => setSelectedCredentialType(CredentialType.OAUTH2) }
                            checked={ selectedCredentialType === CredentialType.OAUTH2 }
                            data-componentid={ `${componentId}-oauth2-checkbox` }
                        />

                        <Radio
                            className="ml-5 mt-3"
                            label={ "Token (Eg: PAT, API key etc)" }
                            onChange={ () => setSelectedCredentialType(CredentialType.STATIC) }
                            checked={ selectedCredentialType === CredentialType.STATIC }
                            data-componentid={ `${componentId}-static-credential-checkbox` }
                        />
                        <Hint inline popup>
Provide a long-lived credential that the agent can use without requiring user approval during execution.
                        </Hint>

                        <Grid.Row>
                            <Grid.Column computer={ 12 }>
                                { selectedCredentialType === CredentialType.STATIC && (
                                    <TextField
                                        type="password"
                                        className="mt-2"
                                        sx={ { width: "100%" } }
                                        placeholder={ "Enter the token obtained from " + selectedIntegration?.name }
                                    />
                                ) }
                            </Grid.Column>
                        </Grid.Row>

                        { selectedCredentialType === CredentialType.OAUTH2 && (<>
                            <Scopes />
                            <Divider style={ { marginTop: "7%", marginBottom: "0%" } }/>
                        </>) }


                        { selectedCredentialType === CredentialType.OAUTH2 && (
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        <Checkbox
                                            className="mt-5"
                                            label={ "Connected account" }
                                            onChange={ () => setIsAccountSelected(!isAccount) }
                                            checked={ isAccount === true }
                                            data-componentid={ `${componentId}-connected-account-checkbox` }
                                        />
                                        <Hint inline popup>
                Connect an account for the agent to use.
                                        </Hint>

                                        { isAccount && (
                                            <div
                                                style={ { display: "flex", flexDirection: "row", width: "100%" } }
                                                className="mt-2"
                                            >
                                                <TextField
                                                    type="text"
                                                    placeholder="Enter account identifier"
                                                    sx={ { width: "20vw" } }
                                                />
                                                <Button basic primary className="ml-3">
                        Connect
                                                </Button>
                                            </div>
                                        ) }
                                    </Grid.Column>
                                    <Grid.Column width={ 16 }>
                                        <Checkbox
                                            className="mt-5"
                                            label="Request on demand"
                                            onChange={ () => setIsRequest(!isRequest) }
                                            checked={ isRequest === true }
                                            data-componentid={ `${componentId}-request-on-demand-checkbox` }
                                        />
                                        <Hint inline popup>
                Configure agent to request access token with the selected scopes on demand.
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        ) }
                    </div>
                ) }

            </Modal.Content>

            <Modal.Actions>
                <Button
                    className="link-button"
                    onClick={ onClose }
                    data-testid={ `${componentId}-confirmation-modal-actions-cancel-button` }
                >
                    Cancel
                </Button>
                <Button
                    primary={ true }
                    type="submit"
                    onClick={ configureIntegration }
                    data-testid={ `${componentId}-confirmation-modal-actions-continue-button` }
                >
                    Done
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
