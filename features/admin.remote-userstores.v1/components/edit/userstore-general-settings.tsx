/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import Skeleton from "@oxygen-ui/react/Skeleton";
import { AppState, history } from "@wso2is/admin.core.v1";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { deleteUserStore, patchUserStore } from "@wso2is/admin.userstores.v1/api/user-stores";
import { DISABLED, RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { PatchData, UserStoreDetails, UserStoreProperty } from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue } from "@wso2is/form";
import { Field, Forms, Validation } from "@wso2is/forms";
import {
    ConfirmationModal,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    Message,
    Popup,
    PrimaryButton,
    useConfirmationModalAlert,
    useDocumentation,
    useMediaContext
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, CheckboxProps, Divider, Grid, Icon, List, Segment } from "semantic-ui-react";
import { disconnectAgentConnection, generateToken, regenerateToken } from "../../api/remote-user-stores";
import useGetUserStoreAgentConnections from "../../api/use-get-user-store-agent-connections";
import {
    RemoteUserStoreConstants,
    USERSTORE_VALIDATION_REGEX_PATTERNS
} from "../../constants/remote-user-stores-constants";
import { AgentConnectionInterface } from "../../models/remote-user-stores";
import { validateInputWithRegex } from "../../utils/userstore-utils";

/**
 * Props for the user store general settings component.
 */
interface UserStoreGeneralSettingsInterface extends IdentifiableComponentInterface {
    /**
     * User store object.
     */
    userStore: UserStoreDetails;
    /**
     * User store ID
     */
    userStoreId: string;
    /**
     * User store manager.
     */
    userStoreManager: RemoteUserStoreManagerType;
    /**
     * Flag to hold if the user store is disabled.
     */
    isDisabled: boolean;
    /**
     * Call back to handle disabling/enabling the user store.
     */
    handleUserStoreDisabled: (value: string) => void;
    /**
     * Whether the component should be rendered in read-only mode.
     */
    isReadOnly?: boolean;
}

/**
 * This component renders the attribute mappings component.
 *
 * @param props - Props injected to the component.
 *
 * @returns user store general settings component.
 */
export const UserStoreGeneralSettings: FunctionComponent<UserStoreGeneralSettingsInterface> = (
    props: UserStoreGeneralSettingsInterface
): ReactElement => {
    const {
        isDisabled,
        userStore,
        userStoreId,
        userStoreManager,
        handleUserStoreDisabled,
        isReadOnly = false,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const { isMobileViewport } = useMediaContext();

    const AGENT_CONNECTION_DESCRIPTION: string = "Users with an account in this user store connected via this agent, " +
        "can sign in to the My Account and other business applications registered in the organization.";

    const [ agentIndex, setAgentIndex ] = useState<number>(null);
    const [ agentOneToken, setAgentOneToken ] = useState<string>("");
    const [ agentTwoToken, setAgentTwoToken ] = useState<string>("");
    const [ agentHAToken, setAgentHAToken ] = useState<string>("");
    const [ isAgentOneTokenGenerated, setIsAgentOneTokenGenerated ] = useState<boolean>(false);
    const [ isAgentTwoTokenGenerated, setIsAgentTwoTokenGenerated ] = useState<boolean>(false);
    const [ isAgentHATokenGenerated, setIsAgentHATokenGenerated ] = useState<boolean>(false);
    const [ disconnectingAgentConnection, setDisconnectingAgentConnection ] = useState<AgentConnectionInterface>(null);
    const [ regeneratingAgentConnection, setRegeneratingAgentConnection ] = useState<AgentConnectionInterface>(null);
    const [ showDisconnectConfirmationModal, setShowDisconnectConfirmationModal ] = useState<boolean>(false);
    const [ showRegenerateConfirmationModal, setShowRegenerateConfirmationModal ] = useState<boolean>(false);
    const [ showGenerateTokenModal, setShowGenerateTokenModal ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showTokenModal, setShowTokenModal ] = useState<boolean>(false);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const {
        data: agentConnectionsData,
        isLoading: isAgentConnectionsRequestLoading,
        error: agentConnectionsRequestError,
        mutate: mutateAgentConnectionsRequest
    } = useGetUserStoreAgentConnections(userStoreId, userStoreManager);

    // Filter out agent connections without an agent or display name.
    const agentConnections: AgentConnectionInterface[] = useMemo(() => {
        const _agentConnections: AgentConnectionInterface[] = agentConnectionsData?.filter(
            (connection: AgentConnectionInterface) => connection?.agent && !isEmpty(connection?.agent?.displayName)
        );

        return _agentConnections;
    }, [ agentConnectionsData ]);

    /**
     * Handle the agent connection request error.
     */
    useEffect(() => {
        if (agentConnectionsRequestError) {
            dispatch(
                addAlert({
                    description: t("remoteUserStores:notifications.connectionStatusCheckError.description"),
                    level: AlertLevels.ERROR,
                    message: t("remoteUserStores:notifications.connectionStatusCheckError.message")
                })
            );
        }
    }, [ agentConnectionsRequestError?.response?.data?.code ]);

    useEffect(() => {
        if (!isAgentOneTokenGenerated && !isAgentTwoTokenGenerated) {
            return;
        }

        mutateAgentConnectionsRequest();
    }, [ regeneratingAgentConnection ]);

    useEffect(() => {
        if (agentHAToken) {
            setIsAgentHATokenGenerated(true);
        }
    }, [ agentHAToken ]);

    useEffect(() => {
        if (agentOneToken) {
            setIsAgentOneTokenGenerated(true);
        }
    }, [ agentOneToken ]);

    useEffect(() => {
        if (agentTwoToken) {
            setIsAgentTwoTokenGenerated(true);
        }
    }, [ agentTwoToken ]);

    /**
     * The following function handles token generation.
     */
    const handleGenerateToken = () => {
        generateToken(userStoreId, userStoreManager)
            .then((response: { token: string }) => {
                setAgentHAToken(response.token);
                setShowGenerateTokenModal(true);
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("remoteUserStores:notifications.tokenGenerateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("userstores:notifications.tokenGenerateError.message")
                    })
                );
            });
    };

    /**
     * The following function returns the status of the user store agent connection.
     *
     * @param status - Status of the agent connection.
     */
    const resolveConnectionStatusIcon = (status: boolean) => {
        if (status) {
            return <Icon name="check circle" color="green" className="mr-1" />;
        } else {
            return <Icon name="times circle" color="red" className="mr-1" />;
        }
    };

    /**
     * The following function handles disconnecting a selected user store agent.
     *
     * @param disconnectingAgentConnection - User store agent
     * connection object.
     */
    const handleAgentDisconnect = (disconnectingAgentConnection: AgentConnectionInterface) => {
        disconnectAgentConnection(userStoreId, disconnectingAgentConnection.agent.Id, userStoreManager)
            .then(() => {
                setShowDisconnectConfirmationModal(false);
                mutateAgentConnectionsRequest();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("remoteUserStores:notifications.disconnectError.description"),
                        level: AlertLevels.ERROR,
                        message: t("remoteUserStores:notifications.disconnectError.message")
                    })
                );
            });
    };

    /**
     * The following function handles regenerating the token of a selected user store agent.
     *
     * @param regeneratingAgentConnection - Agent connection object.
     */
    const handleRegenerateAgentConnectionToken = (regeneratingAgentConnection: AgentConnectionInterface) => {
        regenerateToken(regeneratingAgentConnection.tokenId, userStoreId, userStoreManager)
            .then((response: { token: string }) => {
                if (agentIndex === 0) {
                    setAgentOneToken(response.token);
                } else {
                    setAgentTwoToken(response.token);
                }
                setShowRegenerateConfirmationModal(false);
                setShowTokenModal(true);
                setRegeneratingAgentConnection(null);
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("remoteUserStores:notifications.tokenGenerateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("userstores:notifications.tokenGenerateError.message")
                    })
                );
            });
    };

    /**
     * The following function  renders the user store delete confirmation modal.
     *
     * @returns delete confirmation modal.
     */
    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setShowDeleteConfirmationModal(false) }
            type="negative"
            open={ showDeleteConfirmationModal }
            assertion={ userStore?.name }
            assertionHint={ t("extensions:manage.features.userStores.delete.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("userstores:confirmation.confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
            onPrimaryActionClick={ (): void => {
                deleteUserStore(userStoreId)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("userstores:notifications.deleteUserstore.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("userstores:notifications.deleteUserstore.success.message")
                        }));
                        dispatch(addAlert({
                            description: t("userstores:notifications.delay.description"),
                            level: AlertLevels.WARNING,
                            message: t("userstores:notifications.delay.message")
                        }));

                        history.push(AppConstants.getPaths().get("USERSTORES"));
                    })
                    .catch((error: { description: string; message: string }) => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("userstores:notifications.deleteUserstore.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message
                                ?? t("userstores:notifications.deleteUserstore.genericError.message")
                        }));
                    })
                    .finally(() => {
                        setShowDeleteConfirmationModal(false);
                    });
            } }
            data-testid={ `${componentId}-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header data-testid={ `${componentId}-delete-confirmation-modal-header` }>
                { t("userstores:confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-testid={ `${componentId}-delete-confirmation-modal-message` }
            >
                { t("userstores:confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${componentId}-delete-confirmation-modal-content` }>
                { t("userstores:confirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * The following function  renders the agent token regeneration confirmation modal.
     *
     * @returns agent token regeneration confirmation modal.
     */
    const tokenRegenerationModal = () => (
        <ConfirmationModal
            onClose={ (): void => setShowTokenModal(false) }
            type="warning"
            open={ showTokenModal }
            secondaryAction={ t("common:close") }
            onSecondaryActionClick={ (): void => {
                setShowTokenModal(false);
                setIsAgentOneTokenGenerated(null);
                setIsAgentTwoTokenGenerated(null);
            } }
        >
            <ConfirmationModal.Header data-testid={ `${componentId}-delete-confirmation-modal-header` }>
                New Installation Token
            </ConfirmationModal.Header>
            <ConfirmationModal.Content data-testid={ `${componentId}-delete-confirmation-modal-content` }>
                {
                    isAgentOneTokenGenerated && (
                        <Grid className="mt-2 mb-2">
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    <Message
                                        content="Make sure to note down the installation token as it
                                                        will be required when running the user store agent. You won’t
                                                        be able to see it again!"
                                        type="warning"
                                    />
                                    <label>Installation token</label>
                                    <CopyInputField
                                        value={ agentOneToken ? agentOneToken : "" }
                                        data-testid={ `${componentId}-client-secret-readonly-input` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
                {
                    isAgentTwoTokenGenerated && (
                        <Grid className="mt-2 mb-2">
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    <Message
                                        content="Make sure to note down the installation token as it
                                                        will be required when running the user store agent. You won't
                                                        be able to see it again!"
                                        type="info"
                                    />
                                    <label>Installation token</label>
                                    <CopyInputField
                                        value={ agentTwoToken ? agentTwoToken : "" }
                                        data-testid={ `${componentId}-client-secret-readonly-input` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * The following function  renders the agent token generation confirmation modal.
     *
     * @returns agent token regeneration modal.
     */
    const tokenGenerationModal = () => (
        <ConfirmationModal
            onClose={ (): void => setShowGenerateTokenModal(false) }
            type="warning"
            open={ showGenerateTokenModal }
            secondaryAction={ t("common:close") }
            onSecondaryActionClick={ (): void => {
                setShowGenerateTokenModal(false);
                setIsAgentHATokenGenerated(null);
            } }
        >
            <ConfirmationModal.Header data-testid={ `${componentId}-delete-confirmation-modal-header` }>
                New Installation Token
            </ConfirmationModal.Header>
            <ConfirmationModal.Content data-testid={ `${componentId}-delete-confirmation-modal-content` }>
                {
                    isAgentHATokenGenerated && (
                        <Grid className="mt-2 mb-2">
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    <Message
                                        content="Make sure to note down the installation token as it
                                                        will be required when running the user store agent. You won't
                                                        be able to see it again!"
                                        type="warning"
                                    />
                                    <label>Installation token</label>
                                    <CopyInputField
                                        value={ agentHAToken ? agentHAToken : "" }
                                        data-testid={ `${componentId}-client-secret-readonly-input` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Handles user store disabled toggle.
     *
     * @param event - The emitted event.
     * @param data - The checkbox data.
     */
    const handleUserStoreDisable = (event: any, data: CheckboxProps): void => {
        const patchData: PatchData = {
            operation: "REPLACE",
            path: `/properties/${RemoteUserStoreConstants.PROPERTY_NAME_DISABLED}`,
            value: Boolean(data.checked).toString()
        };

        patchUserStore(userStoreId, [ patchData ])
            .then(() => {
                handleUserStoreDisabled(Boolean(data.checked).toString());

                dispatch(
                    addAlert<AlertInterface>({
                        description: t("userstores:notifications.updateUserstore.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("userstores:notifications.updateUserstore.success.message")
                    })
                );

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once backend is fixed.
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("userstores:notifications.updateDelay.description"),
                        level: AlertLevels.WARNING,
                        message: t("userstores:notifications.updateDelay.message")
                    })
                );

                // Re-fetch the user store details
            })
            .catch((error: { description: string; message: string }) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description:
                            error?.description ||
                            t("userstores:notifications.updateUserstore.genericError.description"),
                        level: AlertLevels.ERROR,
                        message:
                            error?.message || t("userstores:notifications.updateUserstore.genericError.message")
                    })
                );
            });
    };

    /**
     * Handles updating the user store description.
     *
     * @param values - Form values.
     */
    const handleUpdateDescription = (values: Map<string, FormValue>): void => {
        const patchData: PatchData = {
            operation: "REPLACE",
            path: "/description",
            value: values.get("description").toString()
        };

        patchUserStore(userStoreId, [ patchData ])
            .then(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("userstores:notifications.updateUserstore.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("userstores:notifications.updateUserstore.success.message")
                    })
                );

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once backend is fixed.
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("userstores:notifications.updateDelay.description"),
                        level: AlertLevels.WARNING,
                        message: t("userstores:notifications.updateDelay.message")
                    })
                );

                // Re-fetch the user store details
            })
            .catch((error: { description: string; message: string }) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description:
                            error?.description ||
                            t("userstores:notifications.updateUserstore.genericError.description"),
                        level: AlertLevels.ERROR,
                        message:
                            error?.message || t("userstores:notifications.updateUserstore.genericError.message")
                    })
                );
            });
    };

    const renderLoadingSkeleton = (): ReactElement => {
        return (
            <div data-componentid={ `${componentId}-loading-skeleton` }>
                <Skeleton component="h1" width={ "40%" } />
                <Skeleton />
                <br />
                <Skeleton component="h1" width={ "40%" } />
                <Skeleton />
            </div>
        );
    };

    const renderEmptyPlaceholder = (): ReactElement => {
        return (
            <EmptyPlaceholder
                data-componentid={ `${componentId}-empty-placeholder` }
                title={ t("remoteUserStores:pages.edit.generalSettings.connections.emptyPlaceholder.heading") }
                subtitle={ [
                    t("remoteUserStores:pages.edit.generalSettings.connections.emptyPlaceholder.description1"),
                    t("remoteUserStores:pages.edit.generalSettings.connections.emptyPlaceholder.description2")
                ] }
            />
        );
    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 6 }>
                            <Forms
                                onSubmit={ (values: Map<string, FormValue>) => {
                                    handleUpdateDescription(values);
                                } }
                            >
                                <Field
                                    type="text"
                                    name="description"
                                    label={ t("remoteUserStores:form.fields.description.label") }
                                    required={ false }
                                    placeholder={ t("remoteUserStores:form.fields.description.placeholder") }
                                    maxLength={ 300 }
                                    minLength={ 3 }
                                    width={ 14 }
                                    data-testid={ `${componentId}-user-store-description-textarea` }
                                    value={ userStore?.description ? userStore?.description : "" }
                                    validation={ (value: string, validation: Validation) => {
                                        let isMatch: boolean = true;
                                        let validationErrorMessage: string;

                                        const validityResult: Map<
                                                string,
                                                string | boolean
                                            > = validateInputWithRegex(
                                                value,
                                                USERSTORE_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                                            );
                                        const validationMatch: boolean =
                                                validityResult.get("isMatch").toString() === "true";

                                        if (validationMatch) {
                                            isMatch = false;
                                            const invalidString: string = validityResult
                                                .get("invalidStringValue")
                                                .toString();

                                            validationErrorMessage = t(
                                                "console:manage.features.userstores.forms.general.description" +
                                                        ".validationErrorMessages.invalidInputErrorMessage",
                                                {
                                                    invalidString: invalidString
                                                }
                                            );
                                        } else {
                                            isMatch = true;
                                        }

                                        if (!isMatch) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(validationErrorMessage);
                                        }
                                    } }
                                    readOnly={ isReadOnly }
                                />
                                <Popup
                                    trigger={
                                        (<div
                                            className={
                                                isMobileViewport
                                                    ? "mb-1x mt-1x inline-button button-width"
                                                    : "inline-button"
                                            }
                                        >
                                            <PrimaryButton
                                                type="submit"
                                                disabled={
                                                    !(
                                                        userStore?.properties?.find(
                                                            (property: UserStoreProperty) =>
                                                                property.name === DISABLED
                                                        )?.value === "false"
                                                    ) || isReadOnly
                                                }
                                            >
                                                { t("common:update") }
                                            </PrimaryButton>
                                        </div>)
                                    }
                                    content={ t(
                                        "extensions:manage.features.userStores.edit." +
                                                "general.disable.buttonDisableHint"
                                    ) }
                                    size="mini"
                                    wide
                                    disabled={
                                        !!(
                                            userStore?.properties?.find(
                                                (property: UserStoreProperty) => property.name === DISABLED
                                            )?.value === "false"
                                        )
                                    }
                                />
                            </Forms>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <Divider />
                <Divider hidden />

                <Heading as="h4">User Store Agent Connection(s)</Heading>
                <Segment className="agent-connections-section" padded="very">
                    { isAgentConnectionsRequestLoading && renderLoadingSkeleton() }
                    { !isAgentConnectionsRequestLoading &&
                            (!agentConnections || agentConnections.length === 0) &&
                            renderEmptyPlaceholder() }
                    { !isAgentConnectionsRequestLoading && agentConnections?.length > 0 && (
                        <List divided verticalAlign="middle" relaxed="very" width={ 10 }>
                            { agentConnections.map((connection: AgentConnectionInterface, index: number) => (
                                <List.Item key={ index } columns={ 2 } verticalAlign="middle">
                                    <List.Content floated="right">
                                        { connection?.connected ? (
                                            <Button
                                                basic
                                                color="red"
                                                onClick={ () => {
                                                    setDisconnectingAgentConnection(connection);
                                                    setShowDisconnectConfirmationModal(true);
                                                } }
                                                disabled={ isReadOnly }
                                            >
                                                { t("remoteUserStores:pages.edit.generalSettings."
                                                    + "connections.actions.disconnect") }
                                            </Button>
                                        ) : null }
                                        <Button
                                            className="ml-4"
                                            color={ connection.connected ? "red" : "orange" }
                                            onClick={ () => {
                                                setAgentIndex(index);
                                                setRegeneratingAgentConnection(connection);
                                                setShowRegenerateConfirmationModal(true);
                                            } }
                                            disabled={ isReadOnly || isDisabled }
                                        >
                                            { t("remoteUserStores:pages.edit.generalSettings."
                                                + "connections.actions.regenerate") }
                                        </Button>
                                    </List.Content>
                                    <List.Content>
                                        <List.Header>
                                            { resolveConnectionStatusIcon(connection?.connected) }
                                            <strong>{ connection?.agent?.displayName }</strong>
                                        </List.Header>
                                        <List.Description className="mt-2 ml-1">
                                            { AGENT_CONNECTION_DESCRIPTION }
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            )) }
                            { agentConnections.length === 1 && (
                                <List.Item columns={ 2 } verticalAlign="middle">
                                    <List.Content floated="right">
                                        <Button
                                            color="orange"
                                            onClick={ handleGenerateToken }
                                            disabled={ isReadOnly || isDisabled }
                                        >
                                            { t("remoteUserStores:pages.edit.generalSettings."
                                                + "connections.actions.generate") }
                                        </Button>
                                    </List.Content>
                                    <List.Content>
                                        <List.Header>
                                            <Icon name="times circle" color="red" className="mr-1" />
                                            <strong>On-Prem-Agent-2</strong>
                                        </List.Header>
                                        <List.Description className="mt-2 ml-1">
                                            { t(
                                                "extensions:manage.features.userStores.edit." +
                                                        "general.connectionsSections.agents.agentTwo.description"
                                            ) }
                                            <DocumentationLink
                                                link={ getLink("manage.userStores.highAvailability.learnMore") }
                                            >
                                                { t("common:learnMore") }
                                            </DocumentationLink>
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            ) }
                        </List>
                    ) }
                </Segment>
            </EmphasizedSegment>
            <Divider hidden />
            <Divider hidden />
            { disconnectingAgentConnection && (
                <ConfirmationModal
                    data-testid={ `${componentId}-confirmation-modal` }
                    onClose={ (): void => setShowDisconnectConfirmationModal(false) }
                    type="warning"
                    open={ showDisconnectConfirmationModal }
                    assertionHint={ t("user:deleteUser.confirmationModal.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDisconnectConfirmationModal(false);
                        setAlert(null);
                    } }
                    onPrimaryActionClick={ (): void => handleAgentDisconnect(disconnectingAgentConnection) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-testid={ `${componentId}-confirmation-modal-header` }>
                        { t("user:deleteUser.confirmationModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-testid={ `${componentId}-confirmation-modal-message` }
                        attached
                        warning
                    >
                        This action is irreversible and will disconnect the user store agent connection.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                        If you disconnect the user store agent connection users onboarded from the remote user store
                        will not be able to log in to My Account or any other applications onboarded in Asgardeo.
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { regeneratingAgentConnection && (
                <ConfirmationModal
                    data-testid={ `${componentId}-confirmation-modal` }
                    onClose={ (): void => setShowRegenerateConfirmationModal(false) }
                    type="warning"
                    open={ showRegenerateConfirmationModal }
                    assertionHint={ t("user:deleteUser.confirmationModal.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowRegenerateConfirmationModal(false);
                        setAlert(null);
                    } }
                    onPrimaryActionClick={
                        (): void => handleRegenerateAgentConnectionToken(regeneratingAgentConnection)
                    }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-testid={ `${componentId}-confirmation-modal-header` }>
                        { t("user:deleteUser.confirmationModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-testid={ `${componentId}-confirmation-modal-message` }
                        attached
                        warning
                    >
                        This action is irreversible and will revoke the previously used installation token.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                        If you regenerate the token the users with the previous token will no longer be authorised to
                        run the user store agent with that token. You will also need to restart the user store agent as
                        revoking the previous token will disconnect the agent..
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { !isPrivilegedUser && !isReadOnly && (
                <DangerZoneGroup
                    sectionHeader={ t("common:dangerZone") }
                    data-testid={ `${componentId}-danger-zone-group` }
                >
                    <DangerZone
                        actionTitle={ t("userstores:dangerZone.disable.actionTitle") }
                        header="Disable User Store"
                        subheader={ t("userstores:dangerZone.disable.subheader") }
                        onActionClick={ undefined }
                        data-testid={ `${componentId}-delete-danger-zone` }
                        toggle={ {
                            checked: isDisabled,
                            onChange: handleUserStoreDisable
                        } }
                    />
                    <DangerZone
                        actionTitle={ t("userstores:dangerZone.delete.actionTitle") }
                        header={ t("userstores:dangerZone.delete.header") }
                        subheader={ t("userstores:dangerZone.delete.subheader") }
                        onActionClick={ () => setShowDeleteConfirmationModal(true) }
                        data-testid={ `${componentId}-delete-danger-zone` }
                    />
                </DangerZoneGroup>
            ) }
            { showDeleteConfirmationModal && deleteConfirmation() }
            { (isAgentOneTokenGenerated || isAgentTwoTokenGenerated) && tokenRegenerationModal() }
            { isAgentHATokenGenerated && tokenGenerationModal() }
        </>
    );
};
