/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    GridLayout,
    TableActionsInterface,
    TableColumnInterface,
    Text
} from "@wso2is/react-components";
import React, { FC, Fragment, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, Message, SemanticICONS } from "semantic-ui-react";
import { EmptySecretListPlaceholder } from "./empty-secret-list-placeholder";
import { deleteSecret } from "../api/secret";
import { SecretModel } from "../models/secret";
import { formatDateString, humanizeDateString } from "../utils/secrets.date.utils";
import { ADAPTIVE_SCRIPT_SECRETS } from "../constants/secrets.common";

/**
 * Props interface of {@link SecretsList}
 */
export type SecretsListProps = {
    whenSecretDeleted: (deletedSecret: SecretModel, shouldRefresh: boolean) => void;
    isSecretListLoading: boolean;
    selectedSecretType: string;
    secretList: SecretModel[];
    onAddNewSecretButtonClick: () => void;
} & IdentifiableComponentInterface;

/**
 * TODO: Address https://github.com/wso2/product-is/issues/12447
 * @param props {SecretsListProps}
 * @constructor
 */
const SecretsList: FC<SecretsListProps> = (props: SecretsListProps): ReactElement => {

    const {
        whenSecretDeleted,
        isSecretListLoading,
        secretList,
        ["data-componentid"]: testId,
        onAddNewSecretButtonClick,
        selectedSecretType
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingSecret, setDeletingSecret ] = useState<SecretModel>(undefined);

    const onSecretEditClick = (event: React.SyntheticEvent, item: SecretModel) => {
        event?.preventDefault();
        // FIXME: stash key 'edit_section`
    };

    const onSecretDeleteClick = async (): Promise<void> => {
        if (deletingSecret) {
            try {
                await deleteSecret({
                    params: {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }
                });
                dispatch(addAlert({
                    description: `Deleted the secret ${ deletingSecret.secretName }`,
                    level: AlertLevels.SUCCESS,
                    message: "Secret Deleted Successfully"
                }));
            } catch (error) {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: error.response.data.message
                    }));
                    return;
                }
                dispatch(addAlert({
                    description: "Something went wrong",
                    level: AlertLevels.ERROR,
                    message: "We were unable to delete this secret. Please try again."
                }));
            } finally {
                whenSecretDeleted(deletingSecret, /*refresh the secret list?*/true);
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            }
        }
    };

    const createDatatableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "secretName",
                id: "secret-name",
                key: "data-column-secret-name",
                render(data: SecretModel) {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-first-column` }>
                            <Header.Content
                                data-testid={ `${ testId }-first-column-item-header` }>
                                <AppAvatar
                                    image={ (
                                        <AnimatedAvatar
                                            name={ data.secretName }
                                            size="mini"
                                            data-testid={ `${ testId }-item-image-inner` }
                                        />
                                    ) }
                                    size="mini"
                                    spaced="right"
                                    data-testid={ `${ testId }-item-image` }
                                />
                                { data.secretName }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Secret Name"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "created",
                id: "created-at",
                key: "data-column-created-at",
                render(data: SecretModel) {
                    return (
                        <Header as="h6" data-testid={ `${ testId }-second-column` }>
                            <Header.Content data-testid={ `${ testId }-second-column-data` }>
                                { formatDateString(data.created) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Created At"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "lastModified",
                id: "last-modified",
                key: "data-column-last-modified",
                render(data: SecretModel) {
                    return (
                        <Header as="h6" data-testid={ `${ testId }-third-column` }>
                            <Header.Content data-testid={ `${ testId }-third-column-data` }>
                                { humanizeDateString(data.lastModified) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Last Modified"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: "Take Action"
            }
        ];
    };

    const createDatatableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ testId }-item-edit-button`,
                hidden: () => false,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: onSecretEditClick,
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ testId }-item-delete-button`,
                hidden: () => false,
                icon: (): SemanticICONS => "trash alternate",
                onClick(event: SyntheticEvent, data: SecretModel) {
                    event?.preventDefault();
                    setDeletingSecret(data);
                    setShowDeleteConfirmationModal(true);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    const SecretDeleteConfirmationModal: ReactElement = (
        <ConfirmationModal
            onClose={ (): void => {
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            } }
            onSecondaryActionClick={ (): void => {
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            } }
            onPrimaryActionClick={ onSecretDeleteClick }
            open={ showDeleteConfirmationModal }
            type="warning"
            assertionHint={ "Yes I understand. I want to delete it." }
            assertionType="checkbox"
            primaryAction={ "Confirm" }
            secondaryAction={ "Cancel" }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }>
            <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                Are you sure?
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }>
                { /*TODO: Dynamically switch the message based on the secret-type. Adaptive or Custom */ }
                If you delete this secret, <strong>Adaptive Authentication Scripts</strong> depending on this
                value will stop working. Please proceed with caution.
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                This action is irreversible and will permanently delete the secret.
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <GridLayout isLoading={ isSecretListLoading } showTopActionPanel={ false }>
            {
                selectedSecretType === ADAPTIVE_SCRIPT_SECRETS && (
                    <Message data-componentid={ `${ testId }-page-message` }>
                        <Message.Header>
                            <strong>Adaptive Authentication Secrets</strong>
                        </Message.Header>
                        <Text>
                            These secrets can be used in the Adaptive Authentication script of
                            a registered application when accessing external APIs.
                        </Text>
                    </Message>
                )
            }
            { secretList?.length > 0
                ? (
                    <Fragment>
                        <DataTable<SecretModel>
                            data={ secretList }
                            onRowClick={ onSecretEditClick }
                            actions={ createDatatableActions() }
                            columns={ createDatatableColumns() }>
                        </DataTable>
                        { showDeleteConfirmationModal && SecretDeleteConfirmationModal }
                    </Fragment>
                )
                : (
                    <EmptySecretListPlaceholder
                        onAddNewSecret={ onAddNewSecretButtonClick }
                    />
                )
            }
        </GridLayout>
    );

};

/**
 * Default props of {@link SecretsList}
 */
SecretsList.defaultProps = {
    "data-componentid": "secrets-list"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretsList;
