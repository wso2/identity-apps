/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue } from "@wso2is/form";
import { Field, Forms } from "@wso2is/forms";
import {
    ConfirmationModal,
    ContentLoader,
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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, CheckboxProps, Divider, Grid, Icon, List, Segment } from "semantic-ui-react";
import { AppConstants, AppState, history } from "../../../../../admin.core.v1";
import { deleteUserStore, patchUserStore } from "../../../../../admin-userstores-v1/api/user-stores";
import { DISABLED } from "../../../../../admin-userstores-v1/constants/user-store-constants";
import {
    CategorizedProperties,
    PatchData,
    TypeProperty,
    UserStore,
    UserStoreProperty
} from "../../../../../admin-userstores-v1/models/user-stores";
import { disconnectAgentConnection, generateToken, getAgentConnections, regenerateToken } from "../../api";
import { AgentConnectionInterface, RegenerateTokenInterface } from "../../models";

/**
 * Props for the user store general settings component.
 */
interface UserStoreGeneralSettingsInterface extends TestableComponentInterface {
    /**
     * User store object.
     */
    userStore: UserStore;
    /**
     * User store ID
     */
    userStoreId: string;
    /**
     * Flag to hold if the user store is disabled.
     */
    isDisabled: string;
    /**
     * Call back to handle disabling/enabling the user store.
     */
    handleUserStoreDisabled: (value: string) => void;
    /**
     * User store properties.
     */
    userStoreProperties: CategorizedProperties;
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
        handleUserStoreDisabled,
        userStoreProperties,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const { isMobileViewport } = useMediaContext();

    const AGENT_CONNECTION_DESCRIPTION: string = "Users with an account in this user store connected via this agent, " +
        "can sign in to the My Account and other business applications registered in the organization.";

    const [ agentConnections, setAgentConnections ] = useState<AgentConnectionInterface[]>([]);
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
    const [ isAgentConnectionsRequestLoading, setIsAgentConnectionsRequestLoading ] = useState<boolean>(false);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    useEffect(() => {
        setIsAgentConnectionsRequestLoading(true);
        getAgentConnections(userStoreId)
            .then((response: AgentConnectionInterface[]) => {
                setAgentConnections(response.filter((connection: AgentConnectionInterface) => connection?.agent));
            })
            .finally(() => {
                setIsAgentConnectionsRequestLoading(false);
            });
    }, [ userStoreId ]);

    useEffect(() => {
        if (!isAgentOneTokenGenerated && !isAgentTwoTokenGenerated) {
            return;
        }

        handleAgentConnectionList();
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
     * The following function handles fetching the agent connections.
     */
    const handleAgentConnectionList = () => {
        setIsAgentConnectionsRequestLoading(true);
        getAgentConnections(userStoreId)
            .then((response: AgentConnectionInterface[]) => {
                setAgentConnections(response.filter((connection: AgentConnectionInterface) => connection?.agent));
            })
            .finally(() => {
                setIsAgentConnectionsRequestLoading(false);
            });
    };

    /**
     * The following function handles token generation.
     */
    const handleGenerateToken = () => {

        const data: { userStoreId: string; } = { userStoreId: userStoreId };

        generateToken(data)
            .then((response: { token: string; }) => {
                setAgentHAToken(response.token);
                setShowGenerateTokenModal(true);
            });
    };

    /**
     * The following function returns the status of the user store agent connection.
     *
     * @param status - Status of the agent connection.
     */
    const resolveConnectionStatusIcon = (status: boolean) => {
        if (status) {
            return <Icon name="check circle" color="green" className="mr-1"/>;
        } else {
            return <Icon name="times circle" color="red" className="mr-1"/>;
        }
    };

    /**
     * The following function handles disconnecting a selected user store agent.
     *
     * @param disconnectingAgentConnection - User store agent
     * connection object.
     */
    const handleAgentDisconnect = (disconnectingAgentConnection: AgentConnectionInterface) => {
        disconnectAgentConnection(userStoreId, disconnectingAgentConnection.agent.Id)
            .then(() => {
                setShowDisconnectConfirmationModal(false);
                handleAgentConnectionList();
            });
    };

    /**
     * The following function handles regenerating the token of a selected user store agent.
     *
     * @param regeneratingAgentConnection - Agent connection object.
     */
    const handleRegenerateAgentConnectionToken = (regeneratingAgentConnection: AgentConnectionInterface) => {

        const tokenData: RegenerateTokenInterface = {
            existingTokenId: regeneratingAgentConnection.tokenId,
            userStoreId: userStoreId
        };

        regenerateToken(tokenData)
            .then((response: { token: string }) => {
                if (agentIndex === 0) {
                    setAgentOneToken(response.token);
                } else {
                    setAgentTwoToken(response.token);
                }
                setShowRegenerateConfirmationModal(false);
                setShowTokenModal(true);
                setRegeneratingAgentConnection(null);
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
            assertionHint={
                t("extensions:manage.features.userStores.delete." +
                    "assertionHint")
            }
            assertionType="checkbox"
            primaryAction={ t("userstores:confirmation.confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
            onPrimaryActionClick={ (): void => {
                deleteUserStore(userStoreId)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("userstores:notifications." +
                                "deleteUserstore.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("userstores:notifications." +
                                "deleteUserstore.success.message")

                        }));
                        dispatch(addAlert({
                            description: t("userstores:notifications." +
                                "delay.description"),
                            level: AlertLevels.WARNING,
                            message: t("userstores:notifications." +
                                "delay.message")
                        }));

                        history.push(AppConstants.getPaths().get("USERSTORES"));
                    })
                    .catch((error: { description: string, message: string}) => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("userstores:notifications." +
                                    "deleteUserstore.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message ?? t("userstores:notifications." +
                                "deleteUserstore.genericError.message")
                        }));
                    }).finally(() => {
                        setShowDeleteConfirmationModal(false);
                    });
            } }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("userstores:confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("userstores:confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
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
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                New Installation Token
            </ConfirmationModal.Header>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
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
                                    <label>
                                        Installation token
                                    </label>
                                    <CopyInputField
                                        value={ agentOneToken ? agentOneToken : "" }
                                        data-testid={ `${ testId }-client-secret-readonly-input` }
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
                                    <label>
                                        Installation token
                                    </label>
                                    <CopyInputField
                                        value={ agentTwoToken ? agentTwoToken : "" }
                                        data-testid={ `${ testId }-client-secret-readonly-input` }
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
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                New Installation Token
            </ConfirmationModal.Header>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
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
                                    <label>
                                        Installation token
                                    </label>
                                    <CopyInputField
                                        value={ agentHAToken ? agentHAToken : "" }
                                        data-testid={ `${ testId }-client-secret-readonly-input` }
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
        const name: string = userStoreProperties?.basic.required?.find(
            (property: TypeProperty) => property?.name === DISABLED
        )?.name;

        const patchData: PatchData = {
            operation: "REPLACE",
            path: `/properties/${ name }`,
            value: data.checked ? "true" : "false"
        };

        patchUserStore(userStoreId, [ patchData ])
            .then(() => {
                handleUserStoreDisabled(data.checked.toString());

                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userstores:notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("userstores:notifications.updateDelay.message")
                }));

                // Re-fetch the user store details
            })
            .catch((error: { description: string, message: string; }) => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("userstores:notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("userstores:notifications." +
                        "updateUserstore.genericError.message")
                }));
            });
    };

    /**
     * Handles updating the user store description.
     *
     * @param values - Form values.
     */
    const handleUpdateDescription = (values: Map<string,FormValue>): void => {
        const patchData: PatchData = {
            operation: "REPLACE",
            path: "/description",
            value: values.get("description").toString()
        };

        patchUserStore(userStoreId, [ patchData ])
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userstores:notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("userstores:notifications.updateDelay.message")
                }));

                // Re-fetch the user store details
            })
            .catch((error: { description: string, message: string }) => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("userstores:notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("userstores:notifications." +
                        "updateUserstore.genericError.message")
                }));
            });
    };

    return (
        <>
            { !isAgentConnectionsRequestLoading
                ? (
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
                                            requiredErrorMessage={ null }
                                            type="text"
                                            name="description"
                                            label="Description"
                                            required={ false }
                                            placeholder="Enter the description of the user store"
                                            maxLength={ 300 }
                                            minLength={ 3 }
                                            width={ 14 }
                                            data-testid={ `${ testId }-user-store-description-textarea` }
                                            value={
                                                userStore?.description
                                                    ? userStore?.description
                                                    : ""
                                            }
                                        />
                                        <Popup
                                            trigger={ (
                                                <div
                                                    className={
                                                        isMobileViewport
                                                            ? "mb-1x mt-1x inline-button button-width"
                                                            : "inline-button"
                                                    }
                                                >
                                                    <PrimaryButton
                                                        type="submit"
                                                        disabled={ !(userStore?.properties?.find(
                                                            (property: UserStoreProperty) =>
                                                                property.name === DISABLED)?.value === "false") }>
                                                        { t("common:update") }
                                                    </PrimaryButton>
                                                </div>
                                            ) }
                                            content={ t("extensions:manage.features.userStores.edit." +
                                                "general.disable.buttonDisableHint") }
                                            size="mini"
                                            wide
                                            disabled={ !!(userStore?.properties?.find(
                                                (property: UserStoreProperty) =>
                                                    property.name === DISABLED)?.value === "false") }
                                        />
                                    </Forms>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider hidden/>
                        <Divider/>
                        <Divider hidden/>
                        <Heading as="h4">User Store Agent Connection(s)</Heading>
                        <Segment className="agent-connections-section" padded="very">
                            <List divided verticalAlign="middle" relaxed="very" width={ 10 }>
                                {
                                    !isAgentConnectionsRequestLoading
                                        ? agentConnections.length > 0
                                            ? agentConnections.map(
                                                (connection: AgentConnectionInterface, index: number) => (
                                                    <List.Item key={ index } columns={ 2 } verticalAlign="middle">
                                                        <List.Content floated="right">
                                                            {
                                                                connection?.connected
                                                                    ? (<Button
                                                                        basic
                                                                        color="red"
                                                                        onClick={
                                                                            () => {
                                                                                setDisconnectingAgentConnection(
                                                                                    connection
                                                                                );
                                                                                setShowDisconnectConfirmationModal(
                                                                                    true
                                                                                );
                                                                            }
                                                                        }
                                                                    >
                                                                    Disconnect
                                                                    </Button>
                                                                    ) : null
                                                            }
                                                            <Button
                                                                className={
                                                                    !connection.connected
                                                                        ? index === 1 ? "ml-4 mt-4" : "ml-4"
                                                                        : index === 1 ? "mt-4" : ""
                                                                }
                                                                color={ connection.connected ? "red" : "orange" }
                                                                onClick={ () => {
                                                                    setAgentIndex(index);
                                                                    setRegeneratingAgentConnection(connection);
                                                                    setShowRegenerateConfirmationModal(true);
                                                                } }
                                                            >
                                                            Regenerate token
                                                            </Button>
                                                        </List.Content>
                                                        <List.Content>
                                                            <List.Header className={ index == 1 ? "mt-4" : "" }>
                                                                { resolveConnectionStatusIcon(connection?.connected) }
                                                                <strong>{ connection?.agent?.displayName }</strong>
                                                            </List.Header>
                                                            <List.Description className="mt-2 ml-1">
                                                                { AGENT_CONNECTION_DESCRIPTION }
                                                            </List.Description>
                                                        </List.Content>
                                                    </List.Item>
                                                ))
                                            : (
                                                <EmptyPlaceholder
                                                    title="No Agents Connected"
                                                    subtitle={ [
                                                        "There are no user store agent connections.",
                                                        "Please go through the setup guide to configure " +
                                                        "the user store agent(s)."
                                                    ] }
                                                />
                                            )
                                        : <ContentLoader/>
                                }
                                {
                                    agentConnections.length === 1 && (
                                        <List.Item columns={ 2 } verticalAlign="middle">
                                            <List.Content floated="right">
                                                <Button
                                                    className="mt-4"
                                                    color="orange"
                                                    onClick={ handleGenerateToken }
                                                >
                                                    Generate token
                                                </Button>
                                            </List.Content>
                                            <List.Content>
                                                <List.Header className="mt-4">
                                                    <Icon name="times circle" color="red" className="mr-1"/>
                                                    <strong>On-Prem-Agent-2</strong>
                                                </List.Header>
                                                <List.Description className="mt-2 ml-1">
                                                    { t("extensions:manage.features.userStores.edit." +
                                                        "general.connectionsSections.agents.agentTwo.description") }
                                                    <DocumentationLink
                                                        link={ getLink("manage.userStores.highAvailability.learnMore") }
                                                    >
                                                        { t("extensions:common.learnMore") }
                                                    </DocumentationLink>
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    )
                                }
                            </List>
                        </Segment>
                    </EmphasizedSegment>
                ) :
                <ContentLoader/>
            }
            <Divider hidden />
            <Divider hidden />
            {
                disconnectingAgentConnection && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDisconnectConfirmationModal(false) }
                        type="warning"
                        open={ showDisconnectConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal." +
                            "assertionHint") }
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
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
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
                )
            }
            {
                regeneratingAgentConnection && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowRegenerateConfirmationModal(false) }
                        type="warning"
                        open={ showRegenerateConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal." +
                            "assertionHint") }
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
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            warning
                        >
                            This action is irreversible and will revoke the previously used installation token.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            If you regenerate the token the users with the previous token will no longer be
                            authorised to run the user store agent with that token. You will also need to restart the
                            user store agent as revoking the previous token will disconnect the agent..
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                !isPrivilegedUser && (
                    <DangerZoneGroup
                        sectionHeader={ t("common:dangerZone") }
                        ata-testid={ `${ testId }-danger-zone-group` }
                    >
                        <DangerZone
                            actionTitle={ t("userstores:dangerZone.disable.actionTitle") }
                            header="Disable User Store"
                            subheader={ t("userstores:dangerZone.disable.subheader") }
                            onActionClick={ undefined }
                            data-testid={ `${ testId }-delete-danger-zone` }
                            toggle={ {
                                checked: isDisabled !== undefined
                                    ? isDisabled === "true"
                                    : userStore?.properties?.find(
                                        (property: UserStoreProperty) =>
                                            property.name === DISABLED)?.value === "false",
                                onChange: handleUserStoreDisable
                            } }
                        />
                        <DangerZone
                            actionTitle={ t("userstores:dangerZone.delete.actionTitle") }
                            header={ t("userstores:dangerZone.delete.header") }
                            subheader={ t("userstores:dangerZone.delete.subheader") }
                            onActionClick={ () => setShowDeleteConfirmationModal(true) }
                            data-testid={ `${ testId }-delete-danger-zone` }
                        />
                    </DangerZoneGroup>
                )
            }
            { showDeleteConfirmationModal && deleteConfirmation() }
            {
                (
                    isAgentOneTokenGenerated || isAgentTwoTokenGenerated
                ) && tokenRegenerationModal()
            }
            { isAgentHATokenGenerated && tokenGenerationModal() }
        </>
    );
};
