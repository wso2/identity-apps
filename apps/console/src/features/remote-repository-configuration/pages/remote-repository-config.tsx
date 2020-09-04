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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import { ConfirmationModal, LinkButton, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Form, Grid, GridColumn, GridRow, Header, Radio, Segment } from "semantic-ui-react";
import { GovernanceConnectorsIllustration } from "../../../features/server-configurations";
import { 
    createRemoteRepoConfig, 
    deleteRemoteRepoConfig, 
    getRemoteRepoConfig, 
    getRemoteRepoConfigList, 
    triggerConfigDeployment, 
    updateRemoteRepoConfig 
} from "../api";
import { 
    InterfaceEditDetails, 
    InterfaceRemoteConfigDetails, 
    InterfaceRemoteConfigForm, 
    InterfaceRemoteRepoConfig, 
    InterfaceRemoteRepoConfigDetails, 
    InterfaceRemoteRepoListResponse 
} from "../models";

const RemoteRepoConfig: FunctionComponent = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ remoteRepoConfig, setRemoteRepoConfig ] = useState<InterfaceRemoteRepoConfig>(undefined);
    const [ remoteRepoConfigDetail, setRemoteRepoConfigDetail ] = useState<InterfaceRemoteConfigDetails>(undefined);
    const [ showConfigDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ connectivity, setConnectivity ] = useState<string>("");
    const [ isEnabled, setIsEnabled ] = useState<boolean>(false);
    const [ isCreate, setIsCreate ] = useState<boolean>(false);

    useEffect(() => {
        getRemoteConfigList();
    }, [ remoteRepoConfig != undefined, remoteRepoConfigDetail != undefined, isCreate ]);

    const getRemoteConfigList = () => {
        getRemoteRepoConfigList().then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            if (response.status === 200) {
                if (response.data.remotefetchConfigurations.length > 0) {
                    setRemoteRepoConfig(response.data.remotefetchConfigurations[0]);
                    setConnectivity(
                        response.data.remotefetchConfigurations[0].actionListenerType === "POLLING" ? 
                            "POLLING" : "WEBHOOK"
                    );
                    getRemoteRepoConfig(response.data.remotefetchConfigurations[0].id).then((
                        response: AxiosResponse<InterfaceRemoteConfigDetails>
                    )  => {
                        if (response.status === 200) {
                            setRemoteRepoConfigDetail(response.data);
                        }
                    })
                }
            }
        }).catch(() => {
            //Handle Error
        })
    }

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

    const handleFormSubmit = (values: InterfaceRemoteConfigForm): void => {
        const configs: InterfaceRemoteRepoConfigDetails = {
            actionListener: {
                type: "POLLING",
                attributes: {
                    frequency: values.pollingfreq
                }
            },
            configurationDeployer: {
                attributes: {},
                type: "SP"
            },
            isEnabled: values.configEnabled,
            remoteFetchName: values.configName,
            repositoryManager: {
                attributes: {
                    accessToken: values.accessToken,
                    branch: values.gitBranch,
                    directory: values.gitDirectory,
                    uri: values.gitUrl,
                    userName: values.userName
                },
                type: "GIT"
            }
        }
        createConfiguration(configs);
    };

    const createConfiguration = (templateTypeName: InterfaceRemoteRepoConfigDetails): void => {
        createRemoteRepoConfig(templateTypeName).then((response: AxiosResponse) => {
            if (response.status === 201) {
                setIsCreate(true);
                handleAlerts({
                    description: t(
                        "devPortal:components.remoteConfig.notifications.createConfig.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.remoteConfig.notifications.createConfig.success.message"
                    )
                });
            }
        }).catch(() => {
            //handle error
        })
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle config deletion action.
     *
     * @param role - Config ID which needs to be deleted
     */
    const handleOnDelete = (config: InterfaceRemoteRepoConfig): void => {
        deleteRemoteRepoConfig(config.id).then(() => {
            setRemoteRepoConfig(undefined);
            setRemoteRepoConfigDetail(undefined);
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.message"
                )
            });
        });
    };

    /**
     * Function which will handle config trigger.
     * @param config Config ID which needs to be triggered
     */
    const handleOnTrigger = (config: InterfaceRemoteRepoConfig): void => {
        triggerConfigDeployment(config.id).then((response) => {
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.triggerConfig.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.remoteConfig.notifications.triggerConfig.success.message"
                )
            });
        });
    }

    const handleOnConfigUpdate = (id: string, values: InterfaceEditDetails): void => {
        updateRemoteRepoConfig(id, values).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.message"
                )
            });
        })
    }
    
    return (
        <PageLayout
            title="Remote Fetch Management"
            description="Configure a remote repository to work seamlessly with the identity server."
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 12 }>
                        <Segment basic className="emphasized bordered">
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 10 }>
                                                    <Header>
                                                        Remote Fetch Configuration
                                                        <Header.Subheader>
                                                            Configure remote fetch repository
                                                        </Header.Subheader>
                                                    </Header>
                                                </Grid.Column>
                                                <Grid.Column width={ 6 } textAlign="right">
                                                    <GovernanceConnectorsIllustration />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        <Divider />
                                        <Forms
                                            onSubmit={ (values) => { 
                                                if (remoteRepoConfigDetail) {
                                                    handleOnConfigUpdate(
                                                        remoteRepoConfigDetail.id, getFormValues(values)
                                                    );
                                                } else {
                                                    handleFormSubmit(getFormValues(values));
                                                }
                                            } }
                                        >
                                            <Grid padded>
                                                <GridRow columns={ 2 }>
                                                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                                        <Field
                                                            type="text"
                                                            name="configName"
                                                            label={ "Configuration Name" }
                                                            placeholder={ "Name for the repository configuration" }
                                                            required={ true }
                                                            requiredErrorMessage={ "Configuration Name is required." }
                                                            value={ 
                                                                remoteRepoConfigDetail ? 
                                                                    remoteRepoConfigDetail?.remoteFetchName : ""
                                                            }
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
                                                            value={ 
                                                                remoteRepoConfigDetail ? 
                                                                    remoteRepoConfigDetail?.
                                                                        repositoryManagerAttributes?.uri : ""
                                                            }
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
                                                            value={ 
                                                                remoteRepoConfigDetail ? 
                                                                    remoteRepoConfigDetail.
                                                                        repositoryManagerAttributes?.branch : ""
                                                            }
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
                                                            requiredErrorMessage={ "Git directory is required." }
                                                            value={ 
                                                                remoteRepoConfigDetail ? 
                                                                    remoteRepoConfigDetail?.
                                                                        repositoryManagerAttributes?.directory : ""
                                                            }
                                                        />
                                                    </GridColumn>
                                                </GridRow>
                                                <GridRow columns={ 1 }>
                                                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 6 }>
                                                        <Form.Field>
                                                            Connectivity Mechanism
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Radio
                                                                label='Polling'
                                                                name='radioGroup'
                                                                value='this'
                                                                checked={ connectivity === "POLLING" }
                                                                onChange={ () => {
                                                                    setConnectivity("POLLING")
                                                                } }
                                                            />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Radio
                                                                label='Webhook'
                                                                name='radioGroup'
                                                                value='that'
                                                                checked={ connectivity === "WEBHOOK" }
                                                                onChange={ () => {
                                                                    setConnectivity("WEBHOOK")
                                                                } }
                                                            />
                                                        </Form.Field>
                                                    </GridColumn>
                                                </GridRow>
                                                {
                                                    connectivity === "POLLING" &&
                                                    <>
                                                        <GridRow columns={ 2 }>
                                                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                                                <Field
                                                                    type="text"
                                                                    name="userName"
                                                                    label={ "User Name" }
                                                                    placeholder={ "GIT Username" }
                                                                    required={ false }
                                                                    requiredErrorMessage={ "" }
                                                                    value={ 
                                                                        remoteRepoConfigDetail?.
                                                                            repositoryManagerAttributes?.userName 
                                                                    }
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
                                                                    value={ 
                                                                        remoteRepoConfigDetail?.
                                                                            repositoryManagerAttributes?.accessToken 
                                                                    }
                                                                />
                                                            </GridColumn>
                                                        </GridRow>
                                                        <GridRow columns={ 1 }>
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
                                                    </>
                                                }
                                                {
                                                    connectivity === "WEBHOOK" &&
                                                    <GridRow columns={ 1 }>
                                                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                                            <Field
                                                                type="text"
                                                                name="sharedKey"
                                                                label={ "GitHub Shared Key" }
                                                                required={ false }
                                                                requiredErrorMessage={ "" }
                                                            />
                                                        </GridColumn>
                                                    </GridRow>
                                                }
                                            </Grid>
                                            <Grid padded>
                                                <Grid.Row column={ 1 }>
                                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                                        <PrimaryButton
                                                            floated="left"
                                                        >
                                                            { remoteRepoConfig ? 
                                                                "Update Configuration" : "Create Configuration" 
                                                            }
                                                        </PrimaryButton>
                                                        { remoteRepoConfig && 
                                                            <LinkButton
                                                                floated="left"
                                                                onClick={ () => {
                                                                    setShowDeleteConfirmationModal(true)
                                                                } }
                                                            >
                                                                { "Remove Configuration" }
                                                            </LinkButton>
                                                        }
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Forms>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                showConfigDeleteConfirmation && 
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showConfigDeleteConfirmation }
                    assertion={ remoteRepoConfigDetail.remoteFetchName }
                    assertionHint={ 
                        (
                            <p>
                                <Trans
                                    i18nKey={ "devPortal:components:remoteConfig.list.confirmations.deleteItem." +
                                    "assertionHint" }
                                    tOptions={ { roleName: remoteRepoConfigDetail.remoteFetchName } }
                                >
                                    Please type <strong>{ remoteRepoConfigDetail.remoteFetchName }</strong> to confirm.
                                </Trans>
                            </p>
                        )
                    }
                    assertionType="input"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => { 
                        handleOnDelete(remoteRepoConfig);
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
        </PageLayout>
        
        /*<PageLayout
                title="Remote Repository Deployment Configuration"
                description="Configure a remote repository to work seamlessly with the identity server."
            >
            
                <ListLayout
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onPageChange={ () => { console.log() } }
                    showPagination={ false }
                    showTopActionPanel={ false }
                    totalPages={ Math.ceil(remoteRepoConfig?.length / listItemLimit) }
                    totalListSize={ remoteRepoConfig?.length }
                >
                    <RemoteRepoList 
                        showCreateWizard={ setShowWizard } 
                        handleConfigDelete={ handleOnDelete } 
                        repoObjectList={ remoteRepoConfig }
                        handleOnTrigger={ handleOnTrigger }
                    />
                </ListLayout>
                {
                showWizard && (
                    <CreateRemoteRepoConfig
                        data-testid="role-mgt-create-role-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                    />
                )
            }
        </PageLayout>*/
    )
}

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteRepoConfig;
