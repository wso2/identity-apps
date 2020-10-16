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
import { 
    ConfirmationModal, 
    EmptyPlaceholder, 
    Hint, 
    LinkButton, 
    PageLayout, 
    PrimaryButton 
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Checkbox, Divider, Form, Grid, GridColumn, GridRow, Header, Icon, Radio, Segment } from "semantic-ui-react";
import { GovernanceConnectorsIllustration } from "../../../features/server-configurations";
import { ReactComponent as CodeForkIcon } from "../../../themes/default/assets/images/icons/code-fork.svg";
import { 
    createRemoteRepoConfig, 
    deleteRemoteRepoConfig, 
    getRemoteRepoConfig, 
    getRemoteRepoConfigList,
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

/**
 * Component to handle Remote Repository Configuration.
 */
const RemoteRepoConfig: FunctionComponent = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ remoteRepoConfig, setRemoteRepoConfig ] = useState<InterfaceRemoteRepoConfig>(undefined);
    const [ remoteRepoConfigDetail, setRemoteRepoConfigDetail ] = useState<InterfaceRemoteConfigDetails>(undefined);
    const [ showConfigDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ connectivity, setConnectivity ] = useState<string>("");
    const [ isEnabled, setIsEnabled ] = useState<boolean>(false);
    const [ isCreate, setIsCreate ] = useState<boolean>(false);
    const [ showFetchForm, setShowFetchForm ] = useState<boolean>(false);

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
                            setIsEnabled(response.data.isEnabled);
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
            accessToken: values.get("accessToken")?.toString(),
            configEnabled: isEnabled,
            configName: "ApplicationConfigurationRepository",
            gitBranch: values.get("gitBranch").toString(),
            gitDirectory: values.get("gitFolder").toString(),
            gitUrl: values.get("gitURL").toString(),
            pollingfreq: parseInt(values.get("pollingFreq")?.toString()),
            userName: values.get("userName")?.toString()
        };
    };

    const handleFormSubmit = (values: InterfaceRemoteConfigForm): void => {
        const configs: InterfaceRemoteRepoConfigDetails = {
            actionListener: {
                attributes: {
                    frequency: values.pollingfreq
                },
                type: connectivity
            },
            configurationDeployer: {
                attributes: {},
                type: "SP"
            },
            isEnabled: true,
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
                setShowFetchForm(false);
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
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.createConfig.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.remoteConfig.notifications.createConfig.genericError.message"
                )
            });
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

    const getRemoteFecthForm = () => {
        return (
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
                    {
                        remoteRepoConfigDetail && 
                            <>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                                        <label>Enable Fetch Configuration</label>
                                        <Hint>Enable configuration to fetch applications</Hint>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 4 } tablet={ 4 } computer={ 6 }>
                                        <Checkbox 
                                            toggle
                                            checked={
                                                isEnabled
                                            }
                                            onChange={ ()=> {
                                                setIsEnabled(!isEnabled);
                                                updateRemoteRepoConfig(remoteRepoConfigDetail.id, {
                                                    isEnabled: !isEnabled,
                                                    remoteFetchName: remoteRepoConfigDetail.remoteFetchName
                                                })
                                            } }
                                            label={
                                                isEnabled ? "Enabled" : "Disabled"
                                            }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Divider />
                            </>
                    }
                    <GridRow columns={ 2 }>
                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                type="text"
                                name="gitURL"
                                label={ "GitHub Repository URL" }
                                placeholder={ "Ex : https://github.com/samplerepo/sample-project" }
                                required={ true }
                                requiredErrorMessage={ "Github Repository URL is required." }
                                disabled={ remoteRepoConfig ? true : false }
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
                                label={ "Github Branch" }
                                placeholder={ "Ex : Master " }
                                required={ true }
                                requiredErrorMessage={ "Github branch is required." }
                                disabled={ remoteRepoConfig ? true : false }
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
                                name="gitFolder"
                                label={ "GitHub Directory" }
                                placeholder={ "Ex : SampleConfigFolder/" }
                                required={ true }
                                requiredErrorMessage={ "Github configuration directory is required." }
                                disabled={ remoteRepoConfig ? true : false }
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
                                    disabled={ remoteRepoConfig ? true : false }
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
                                    disabled={ remoteRepoConfig ? true : false }
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
                                        label={ "Guthub Username" }
                                        placeholder={ "Ex: John Doe" }
                                        required={ false }
                                        disabled={ remoteRepoConfig ? true : false }
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
                                        label={ "Github Personal Access Token" }
                                        placeholder={ "Personal Access Token" }
                                        required={ false }
                                        disabled={ remoteRepoConfig ? true : false }
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
                                        disabled={ remoteRepoConfig ? true : false }
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
                                    disabled={ remoteRepoConfig ? true : false }
                                    requiredErrorMessage={ "" }
                                />
                            </GridColumn>
                        </GridRow>
                    }
                </Grid>
                <Grid padded>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { !remoteRepoConfig &&
                                <PrimaryButton
                                    disabled={ remoteRepoConfig ? true : false }
                                    floated="left"
                                >
                                    Save Configuration
                                </PrimaryButton>
                            }
                            { remoteRepoConfig && 
                                <LinkButton
                                    floated="left"
                                    attached
                                    onClick={ () => {
                                        setShowDeleteConfirmationModal(true)
                                    } }
                                >
                                    Remove Configuration
                                </LinkButton>
                            }
                            { showFetchForm && 
                                <LinkButton
                                    floated="left"
                                    onClick={ () => {
                                        setShowFetchForm(false)
                                    } }
                                >   
                                    Cancel
                                </LinkButton>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        )
    }
    
    return (
        <PageLayout
            title="Remote Configurations"
            description="Configure github repository to work seamlessly with the identity server."
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
                                                        Application Configuration Repository
                                                        <Header.Subheader>
                                                            Configure repository for fetching applications
                                                        </Header.Subheader>
                                                    </Header>
                                                </Grid.Column>
                                                <Grid.Column width={ 6 } textAlign="right">
                                                    <GovernanceConnectorsIllustration />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        <Divider />
                                        { 
                                            ( showFetchForm || remoteRepoConfigDetail ) &&
                                                getRemoteFecthForm()
                                        }
                                        {
                                            !remoteRepoConfigDetail && !showFetchForm &&
                                            <EmptyPlaceholder
                                                action={
                                                    <PrimaryButton onClick={ () => { setShowFetchForm(true) } }>
                                                        <Icon name="add"/>
                                                        { "Configure Repository" }
                                                    </PrimaryButton>
                                                }
                                                title={ "Add Configuration" }
                                                subtitle={ [
                                                    "Currently there are no repositories configured. You can" +
                                                    " add a new configuration." 
                                                ] }
                                                image={ CodeForkIcon }
                                                imageSize="tiny"
                                            />
                                        }
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
    )
}

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteRepoConfig;
