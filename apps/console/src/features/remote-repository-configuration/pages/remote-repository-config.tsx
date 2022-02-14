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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
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
import {
    createRemoteRepoConfig,
    deleteRemoteRepoConfig,
    getRemoteRepoConfig,
    getRemoteRepoConfigList,
    updateRemoteRepoConfig
} from "../api";
import { getEmptyPlaceholderIllustrations, getSectionIllustrations } from "../configs";
import {
    InterfaceRemoteConfigDetails,
    InterfaceRemoteConfigForm,
    InterfaceRemoteRepoConfig,
    InterfaceRemoteRepoConfigDetails,
    InterfaceRemoteRepoListResponse,
    RemoteFetchActionListenerTypes,
    RemoteFetchDeployerTypes,
    RemoteFetchRepositoryManagerTypes
} from "../models";

/**
 * Proptypes for the remote config details component.
 */
type RemoteConfigDetailsPropsInterface = IdentifiableComponentInterface;

/**
 * Component to handle Remote Repository Configuration.
 *
 * @param {RemoteConfigDetailsPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const RemoteRepoConfig: FunctionComponent<RemoteConfigDetailsPropsInterface> = (
    props: RemoteConfigDetailsPropsInterface
): ReactElement => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const [ remoteRepoConfig, setRemoteRepoConfig ] = useState<InterfaceRemoteRepoConfig>(undefined);
    const [ remoteRepoConfigDetail, setRemoteRepoConfigDetail ] = useState<InterfaceRemoteConfigDetails>(undefined);
    const [ showConfigDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ connectivity, setConnectivity ] = useState<string>("");
    const [ isEnabled, setIsEnabled ] = useState<boolean>(false);
    const [ showFetchForm, setShowFetchForm ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Fetched the list of remote repo configs on component load.
     */
    useEffect(() => {
        getRemoteConfigList();
    }, []);

    /**
     * Util method to load configurations if available.
     */
    const getRemoteConfigList = (): void => {
        getRemoteRepoConfigList()
            .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
                if (response.data?.count > 0) {
                    const config: InterfaceRemoteRepoConfig = response.data.remotefetchConfigurations[ 0 ];
                    const listener: string = response.data.remotefetchConfigurations[ 0 ].actionListenerType;

                    setRemoteRepoConfig(config);
                    setConnectivity(
                        listener === RemoteFetchActionListenerTypes.Polling
                            ? RemoteFetchActionListenerTypes.Polling
                            : RemoteFetchActionListenerTypes.WebHook
                    );

                    // Fetch the available repo config.
                    getRemoteRepoConfig(config.id)
                        .then((response: AxiosResponse<InterfaceRemoteConfigDetails>) => {
                            setRemoteRepoConfigDetail(response.data);
                            setIsEnabled(response.data.isEnabled);
                        })
                        .catch(() => {
                            handleAlerts({
                                description: t("console:manage.features.remoteFetch.notifications." +
                                    "getRemoteRepoConfig.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: t("console:manage.features.remoteFetch.notifications." +
                                    "getRemoteRepoConfig.genericError.message")
                            });
                        });
                }
            })
            .catch(() => {
                handleAlerts({
                    description: t("console:manage.features.remoteFetch.notifications.getConfigList." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.remoteFetch.notifications.getConfigList." +
                        "genericError.message")
                });
            });
    };

    /**
     * Util method to get
     *
     * @param values
     */
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

    /**
     * Handles form submit.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: InterfaceRemoteConfigForm): void => {
        let configs: InterfaceRemoteRepoConfigDetails = {
            actionListener: {
                attributes: {},
                type: connectivity
            },
            configurationDeployer: {
                attributes: {},
                type: RemoteFetchDeployerTypes.SP
            },
            isEnabled: true,
            remoteFetchName: values.configName,
            repositoryManager: {
                attributes: {
                    accessToken: values.accessToken,
                    branch: values.gitBranch,
                    directory: values.gitDirectory,
                    uri: values.gitUrl,
                    username: values.userName
                },
                type: RemoteFetchRepositoryManagerTypes.GIT
            }
        };

        // `frequency` is only required when the listener type is `POLLING`.
        if (connectivity === RemoteFetchActionListenerTypes.Polling) {
            configs = {
                ...configs,
                actionListener: {
                    ...configs.actionListener,
                    attributes: {
                        ...configs.actionListener.attributes,
                        frequency: values.pollingfreq
                    }
                }
            };
        }

        createConfiguration(configs);
    };

    /**
     * Creates a repo configuration.
     *
     * @param {InterfaceRemoteRepoConfigDetails} templateTypeName - Template type name.
     */
    const createConfiguration = (templateTypeName: InterfaceRemoteRepoConfigDetails): void => {
        setIsSubmitting(true);

        createRemoteRepoConfig(templateTypeName)
            .then(() => {
                getRemoteConfigList();
                setShowFetchForm(false);

                handleAlerts({
                    description: t("console:manage.features.remoteFetch.notifications.createRepoConfig.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.remoteFetch.notifications.createRepoConfig.success" +
                        ".message")
                });
            })
            .catch(() => {
                handleAlerts({
                    description: t("console:manage.features.remoteFetch.notifications.createRepoConfig." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.remoteFetch.notifications.createRepoConfig." +
                        "genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle config deletion action.
     *
     * @param {InterfaceRemoteRepoConfig} config - Repo Config.
     */
    const handleOnDelete = (config: InterfaceRemoteRepoConfig): void => {
        deleteRemoteRepoConfig(config.id)
            .then(() => {
                setRemoteRepoConfig(undefined);
                setRemoteRepoConfigDetail(undefined);

                handleAlerts({
                    description: t("console:manage.features.remoteFetch.notifications.deleteRepoConfig." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.remoteFetch.notifications.deleteRepoConfig." +
                        "success.message")
                });
            })
            .catch(() => {
                handleAlerts({
                    description: t("console:manage.features.remoteFetch.notifications.deleteRepoConfig." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.remoteFetch.notifications.deleteRepoConfig." +
                        "genericError.message")
                });
            });
    };

    /**
     * Util method to render remote configuration form.
     *
     * @return {ReactElement}
     */
    const getRemoteFetchForm = (): ReactElement => {
        return (
            <Forms
                data-componentid={ `${ componentId }-config-form` }
                onSubmit={ (values) => {
                    handleFormSubmit(getFormValues(values));
                } }
            >
                <Grid padded>
                {
                        remoteRepoConfigDetail &&
                            <>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                                        <label>
                                            {
                                                t("console:manage.features.remoteFetch.forms.getRemoteFetchForm" +
                                                    ".fields.enable.label")
                                            }
                                        </label>
                                        <Hint>
                                            {
                                                t("console:manage.features.remoteFetch.forms.getRemoteFetchForm" +
                                                    ".fields.enable.hint")
                                            }
                                        </Hint>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 4 } tablet={ 4 } computer={ 6 }>
                                        <Checkbox
                                            toggle
                                            checked={
                                                isEnabled
                                            }
                                            data-componentid={ `${ componentId }-config-state` }
                                            onChange={ ()=> {
                                                setIsEnabled(!isEnabled);
                                                updateRemoteRepoConfig(remoteRepoConfigDetail?.id, {
                                                    isEnabled: !isEnabled,
                                                    remoteFetchName: remoteRepoConfigDetail?.remoteFetchName
                                                });
                                            } }
                                            label={
                                                isEnabled
                                                    ? t("common:enabled")
                                                    : t("common:disabled")
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
                                label={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitURL.label")
                                }
                                placeholder={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitURL.placeholder")
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitURL.validations.required")
                                }
                                disabled={ !!remoteRepoConfig }
                                data-componentid={ `${ componentId }-form-git-url` }
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
                                label={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitBranch.label")
                                }
                                placeholder={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitBranch.placeholder")
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitBranch.validations.required")
                                }
                                disabled={ !!remoteRepoConfig }
                                data-componentid={ `${ componentId }-form-git-branch` }
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
                                label={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitFolder.label")
                                }
                                placeholder={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitFolder.placeholder")
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "gitFolder.validations.required")
                                }
                                disabled={ !!remoteRepoConfig }
                                data-componentid={ `${ componentId }-form-git-directory` }
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
                                {
                                    t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                        "connectivity.label")
                                }
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label={
                                        t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.fields." +
                                            "connectivity.children.polling.label")
                                    }
                                    name="radioGroup"
                                    checked={ connectivity === "POLLING" }
                                    disabled={ !!remoteRepoConfig }
                                    data-componentid={ `${ componentId }-form-connection-polling` }
                                    onChange={ () => {
                                        setConnectivity("POLLING");
                                    } }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label={
                                        t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                            "fields.connectivity.children.webhook.label")
                                    }
                                    name="radioGroup"
                                    disabled={ !!remoteRepoConfig }
                                    checked={ connectivity === "WEB_HOOK" }
                                    data-componentid={ `${ componentId }-form-connection-webhook` }
                                    onChange={ () => {
                                        setConnectivity("WEB_HOOK");
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
                                        label={
                                            t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                                "fields.username.label")
                                        }
                                        placeholder={
                                            t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                                "fields.username.placeholder")
                                        }
                                        required={ false }
                                        disabled={ !!remoteRepoConfig }
                                        requiredErrorMessage={ "" }
                                        data-componentid={ `${ componentId }-form-git-username` }
                                        value={
                                            remoteRepoConfigDetail ?
                                                remoteRepoConfigDetail?.
                                                    repositoryManagerAttributes?.username : ""
                                        }
                                    />
                                </GridColumn>
                                <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        type="text"
                                        name="accessToken"
                                        label={
                                            t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                                "fields.accessToken.label")
                                        }
                                        placeholder={
                                            t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                                "fields.accessToken.placeholder")
                                        }
                                        required={ false }
                                        disabled={ !!remoteRepoConfig }
                                        requiredErrorMessage={ "" }
                                        data-componentid={ `${ componentId }-form-git-accesstoken` }
                                        value={
                                            remoteRepoConfigDetail ?
                                                remoteRepoConfigDetail?.
                                                    repositoryManagerAttributes?.accessToken : ""
                                        }
                                    />
                                </GridColumn>
                            </GridRow>
                            <GridRow columns={ 1 }>
                                <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        type="number"
                                        name="pollingFreq"
                                        disabled={ !!remoteRepoConfig }
                                        label={
                                            t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                                "fields.pollingFrequency.label")
                                        }
                                        required={ true }
                                        value="60"
                                        requiredErrorMessage={ "" }
                                    />
                                </GridColumn>
                            </GridRow>
                        </>
                    }
                    {
                        connectivity === "WEB_HOOK" &&
                        <GridRow columns={ 1 }>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    type="text"
                                    name="sharedKey"
                                    label={
                                        t("console:manage.features.remoteFetch.forms.getRemoteFetchForm." +
                                            "fields.sharedKey.label")
                                    }
                                    required={ false }
                                    disabled={ !!remoteRepoConfig }
                                    requiredErrorMessage={ "" }
                                    data-componentid={ `${ componentId }-form-git-shared-key` }
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
                                    disabled={ !!remoteRepoConfig || isSubmitting }
                                    floated="left"
                                    data-componentid={ `${ componentId }-save-configuration` }
                                    loading={ isSubmitting }
                                >
                                    {
                                        t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.actions.save")
                                    }
                                </PrimaryButton>
                            }
                            { remoteRepoConfig &&
                                <LinkButton
                                    floated="left"
                                    attached
                                    data-componentid={ `${ componentId }-remove-configuration` }
                                    onClick={ () => {
                                        setShowDeleteConfirmationModal(true);
                                    } }
                                >
                                    {
                                        t("console:manage.features.remoteFetch.forms.getRemoteFetchForm.actions.remove")
                                    }
                                </LinkButton>
                            }
                            { showFetchForm &&
                                <LinkButton
                                    floated="left"
                                    data-componentid={ `${ componentId }-cancel-configuration` }
                                    onClick={ () => {
                                        setShowFetchForm(false);
                                    } }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        );
    };

    return (
        <PageLayout
            title={ t("console:manage.features.remoteFetch.pages.listing.title") }
            description={ t("console:manage.features.remoteFetch.pages.listing.subTitle") }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 12 }>
                        <Segment basic className="emphasized bordered">
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column>
                                        <Grid padded>
                                            <Grid.Column width={ 16 }>
                                                <div
                                                    className="connector-section-with-image-bg"
                                                    style={ {
                                                        background: `url(${ getSectionIllustrations().appConfigRepo })`
                                                    } }
                                                >
                                                    <Header>
                                                        {
                                                            t("console:manage.features.remoteFetch.forms." +
                                                                "getRemoteFetchForm.heading.title")
                                                        }
                                                        <Header.Subheader>
                                                            {
                                                                t("console:manage.features.remoteFetch.forms." +
                                                                    "getRemoteFetchForm.heading.subTitle")
                                                            }
                                                        </Header.Subheader>
                                                    </Header>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Divider />
                                        {
                                            ( showFetchForm || remoteRepoConfigDetail ) &&
                                                getRemoteFetchForm()
                                        }
                                        {
                                            !remoteRepoConfigDetail && !showFetchForm &&
                                            <EmptyPlaceholder
                                                action={
                                                    <PrimaryButton
                                                        data-componentid={ `${ componentId }-add-configuration` }
                                                        onClick={ () => { setShowFetchForm(true); } }
                                                    >
                                                        <Icon name="add"/>
                                                        {
                                                            t("console:manage.features.remoteFetch.placeholders." +
                                                                "emptyListPlaceholder.action")
                                                        }
                                                    </PrimaryButton>
                                                }
                                                title={
                                                    t("console:manage.features.remoteFetch.placeholders." +
                                                        "emptyListPlaceholder.title")
                                                }
                                                subtitle={ [
                                                    t("console:manage.features.remoteFetch.placeholders." +
                                                        "emptyListPlaceholder.subtitles")
                                                ] }
                                                image={ getEmptyPlaceholderIllustrations().add }
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
                    data-componentid={ `${ componentId }-confirmation-modal` }
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showConfigDeleteConfirmation }
                    assertion={ remoteRepoConfigDetail?.remoteFetchName }
                    assertionHint={
                        (
                            <p>
                                <Trans
                                    i18nKey={ "console:manage.features.remoteConfig.list.confirmations.deleteItem." +
                                    "assertionHint" }
                                    tOptions={ { roleName: remoteRepoConfigDetail?.remoteFetchName } }
                                >
                                    Please type <strong>{ remoteRepoConfigDetail?.remoteFetchName }</strong> to confirm.
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
                        { t("console:manage.features.remoteConfig.list.confirmations.deleteConfig.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("console:manage.features.remoteConfig.list.confirmations.deleteConfig.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("console:manage.features.remoteConfig.list.confirmations.deleteConfig.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
RemoteRepoConfig.defaultProps = {
    "data-componentid": "remote-fetch"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteRepoConfig;
