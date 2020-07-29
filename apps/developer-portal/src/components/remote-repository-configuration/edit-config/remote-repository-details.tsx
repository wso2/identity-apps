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

import { Field, Forms } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Checkbox, Divider, Grid, GridColumn, GridRow } from "semantic-ui-react";
import { InterfaceEditDetails, InterfaceRemoteConfigDetails } from "../../../models";

interface RemoteConfigDetailProps {
    configObject: InterfaceRemoteConfigDetails;
    handleConfigDelete: (repoConfig: InterfaceRemoteConfigDetails) => void;
    onConfigUpdate?: (id: string, values: InterfaceEditDetails) => void;
}

export const RemoteConfigDetail: FunctionComponent<RemoteConfigDetailProps> = (
    props: RemoteConfigDetailProps
): ReactElement => {
    const { t } = useTranslation();

    const {
        configObject,
        onConfigUpdate,
        handleConfigDelete
    } = props;
    
    const [ showConfigDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isEnabled, setIsEnabled ] = useState<boolean>();

    useEffect(() => {
        if (configObject) {
            setIsEnabled(configObject.isEnabled)
        }
    }, [configObject]);

    const getFormValues = (values: any): InterfaceEditDetails => {
        return {
            isEnabled: isEnabled,
            remoteFetchName: values.get("configName").toString()
        };
    };

    return (
        <>
            <EmphasizedSegment>
                <Forms 
                    onSubmit={ (values) => { 
                        onConfigUpdate(configObject.id, getFormValues(values));
                    } }
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
                                    value={ configObject ? configObject.remoteFetchName : "" }
                                    requiredErrorMessage={ "Configuration Name is required." }
                                />
                            </GridColumn>
                        </GridRow>
                        <GridRow columns={ 1 }>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Checkbox 
                                    name="configEnabled"
                                    required={ false }
                                    requiredErrorMessage=""
                                    type="checkbox"
                                    toggle
                                    onChange={ () => {
                                        setIsEnabled(!isEnabled)
                                    } }
                                    checked={ isEnabled }
                                    label='Is Configuration Enabled' 
                                />
                            </GridColumn>
                        </GridRow>
                        <GridRow columns={ 1 }>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    type="text"
                                    name="gitURL"
                                    label={ "Git Repository URI" }
                                    placeholder={ "Git repository URL" }
                                    required={ true }
                                    disabled
                                    value={ configObject ? configObject.repositoryManagerAttributes.uri : "" }
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
                                    disabled
                                    value={ configObject ? configObject.repositoryManagerAttributes.branch : "" }
                                    requiredErrorMessage={ "Git Branch is required." }
                                />
                            </GridColumn>
                        </GridRow>
                        <GridRow columns={ 1 }>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    type="text"
                                    name="gitDirectory"
                                    label={ "Directory" }
                                    placeholder={ "Git Directory" }
                                    required={ true }
                                    disabled
                                    value={ configObject ? configObject.repositoryManagerAttributes.directory : "" }
                                    requiredErrorMessage={ "Git directory is required." }
                                />
                            </GridColumn>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    type="number"
                                    name="pollingFreq"
                                    label={ "Polling Frequency" }
                                    required={ true }
                                    disabled
                                    value={
                                        configObject ? configObject.actionListenerAttributes.frequency.toString() : ""
                                    }
                                    requiredErrorMessage={ "" }
                                />
                            </GridColumn>
                        </GridRow>
                        <GridRow columns={ 1 }>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    type="text"
                                    name="userName"
                                    label={ "User Name" }
                                    placeholder={ "GIT Username" }
                                    required={ false }
                                    disabled
                                    value={ configObject ? configObject.repositoryManagerAttributes.userName : "" }
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
                                    disabled
                                    value={ configObject ? configObject.repositoryManagerAttributes.accessToken : "" }
                                    requiredErrorMessage={ "" }
                                />
                            </GridColumn>
                        </GridRow>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                >
                                    { "Update Configuration" }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            </EmphasizedSegment>
            <Divider hidden />
            <DangerZoneGroup sectionHeader="Danger Zone">
                <DangerZone
                    actionTitle={ "Delete Config" }
                    header={ "Delete Remote Configuration" }
                    subheader={ "This will remove the configuration from the account." }
                    onActionClick={ () => { setShowDeleteConfirmationModal(true) } }
                />
            </DangerZoneGroup> 
            {
                showConfigDeleteConfirmation && 
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showConfigDeleteConfirmation }
                    assertion={ configObject.remoteFetchName }
                    assertionHint={ 
                        (
                            <p>
                                <Trans
                                    i18nKey={ "devPortal:components:remoteConfig.list.confirmations.deleteItem." +
                                    "assertionHint" }
                                    tOptions={ { roleName: configObject.remoteFetchName } }
                                >
                                    Please type <strong>{ configObject.remoteFetchName }</strong> to confirm.
                                </Trans>
                            </p>
                        )
                    }
                    assertionType="input"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => { 
                        handleConfigDelete(configObject);
                        setShowDeleteConfirmationModal(false);
                    } }
                >
                    <ConfirmationModal.Header>
                        { t("devPortal:components:remoteConfig.list.confirmations.deleteConfig.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("devPortal:components:remoteConfig.list.confirmations.deleteConfig.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("devPortal:components:remoteConfig.list.confirmations.deleteConfig.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            }
        </>
    )
};
