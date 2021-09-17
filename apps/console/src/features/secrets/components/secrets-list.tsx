/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
import { AppConstants, history } from "../../core";
import { deleteSecret } from "../api/secret";
import { ADAPTIVE_SCRIPT_SECRETS, FEATURE_EDIT_PATH } from "../constants/secrets.common";
import { SecretModel } from "../models/secret";
import { formatDateString, humanizeDateString } from "../utils/secrets.date.utils";

/**
 * Props interface of {@link SecretsList}
 */
export type SecretsListProps = {
    whenSecretDeleted: (deletedSecret: SecretModel, shouldRefresh: boolean) => void;
    isSecretListLoading: boolean;
    selectedSecretType: string;
    secretList: SecretModel[];
    onAddNewSecretButtonClick: () => void;
    showAdaptiveAuthSecretBanner?: boolean;
} & IdentifiableComponentInterface;

/**
 * TODO: https://github.com/wso2/product-is/issues/12447
 * @param props {SecretsListProps}
 * @constructor
 * @return {ReactElement}
 */
const SecretsList: FC<SecretsListProps> = (props: SecretsListProps): ReactElement => {

    const {
        whenSecretDeleted,
        isSecretListLoading,
        secretList,
        ["data-componentid"]: testId,
        onAddNewSecretButtonClick,
        selectedSecretType,
        showAdaptiveAuthSecretBanner
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingSecret, setDeletingSecret ] = useState<SecretModel>(undefined);

    const onSecretEditClick = (event: React.SyntheticEvent, item: SecretModel) => {
        event?.preventDefault();
        const pathname = AppConstants
            .getPaths()
            .get(FEATURE_EDIT_PATH)
            .replace(":type", item?.type)
            .replace(":name", item?.secretName);
        history.push({ pathname });
    };

    /**
     * This will be only called when user gives their consent.
     * @see {@code SecretDeleteConfirmationModal}
     */
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
                    description: t("console:develop.features.secrets.alerts.deleteSecret.description", {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.secrets.alerts.deleteSecret.message")
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
                    description: t("console:develop.features.secrets.errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.secrets.errors.generic.message")
                }));
            } finally {
                const refreshSecretList = true;
                whenSecretDeleted(deletingSecret, refreshSecretList);
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
                            <Header.Content data-testid={ `${ testId }-first-column-item-header` }>
                                { data.secretName }
                                <Header.Subheader
                                    className="truncate ellipsis"
                                    data-testid={ `${ testId }-item-sub-heading` }>
                                    { data.description }
                                </Header.Subheader>
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
            assertionHint={ t("console:develop.features.secrets.modals.deleteSecret.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("console:develop.features.secrets.modals.deleteSecret.primaryActionButtonText") }
            secondaryAction={ t("console:develop.features.secrets.modals.deleteSecret.secondaryActionButtonText") }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }>
            <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                { t("console:develop.features.secrets.modals.deleteSecret.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }>
                { t("console:develop.features.secrets.modals.deleteSecret.warningMessage") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                { t("console:develop.features.secrets.modals.deleteSecret.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <GridLayout isLoading={ isSecretListLoading } showTopActionPanel={ false }>
            {
                showAdaptiveAuthSecretBanner && selectedSecretType === ADAPTIVE_SCRIPT_SECRETS && (
                    <Message data-componentid={ `${ testId }-page-message` }>
                        <Message.Header>
                            <strong>
                                { t("console:develop.features.secrets.banners.adaptiveAuthSecretType.title") }
                            </strong>
                        </Message.Header>
                        <Text>
                            { t("console:develop.features.secrets.banners.adaptiveAuthSecretType.content") }
                        </Text>
                    </Message>
                )
            }
            { secretList?.length > 0
                ? (
                    <Fragment>
                        <DataTable<SecretModel>
                            data={ secretList }
                            showHeader={ false }
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
    "data-componentid": "secrets-list",
    showAdaptiveAuthSecretBanner: false
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretsList;
