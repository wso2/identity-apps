/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Chip from "@oxygen-ui/react/Chip";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, Label, SemanticICONS, SemanticWIDTHS } from "semantic-ui-react";

import { deleteSchemaAttributeById } from "../api/profile-attributes";
import { ProfileSchemaListingRow, SCOPE_CONFIG } from "../models/profile-attribute-listing";

const COL_WIDTH_ATTRIBUTE: SemanticWIDTHS = 7;
const COL_WIDTH_SCOPE: SemanticWIDTHS = 7;
const COL_WIDTH_ACTIONS: SemanticWIDTHS = 2;

interface ProfileSchemaListingPropsInterface extends IdentifiableComponentInterface {
    isLoading: boolean;
    onRefresh: () => void;
    rows: ProfileSchemaListingRow[];
}

export const ProfileSchemaListing: FunctionComponent<ProfileSchemaListingPropsInterface> = ({
    isLoading,
    onRefresh,
    rows,
    ["data-componentid"]: componentId = "profile-schema-listing"
}: ProfileSchemaListingPropsInterface): ReactElement => {

    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation("customerDataService");

    const [ deleting, setDeleting ] = useState<ProfileSchemaListingRow | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);

    const columns: TableColumnInterface[] = useMemo(() => ([
        {
            allowToggleVisibility: false,
            dataIndex: "display_name",
            id: "attribute",
            key: "attribute",
            render: (row: ProfileSchemaListingRow): ReactNode => (
                <Header image as="h6" className="header-with-icon">
                    <AppAvatar
                        data-componentid={ `${componentId}-item-image` }
                        image={ (
                            <AnimatedAvatar
                                name={ row.display_name?.charAt(0)?.toUpperCase() ?? "?" }
                                size="mini"
                            />
                        ) }
                        size="mini"
                        spaced="right"
                    />
                    <Header.Content>
                        { row.display_name }
                    </Header.Content>
                </Header>
            ),
            title: t("profileAttributes.list.columns.attribute"),
            width: COL_WIDTH_ATTRIBUTE
        },
        {
            allowToggleVisibility: false,
            dataIndex: "scope",
            id: "scope",
            key: "",
            render: (row: ProfileSchemaListingRow): ReactNode => {
                const config: typeof SCOPE_CONFIG[keyof typeof SCOPE_CONFIG] = SCOPE_CONFIG[row.scope];

                if (!config?.label) return null;

                return (
                    <>
                        <Chip
                            label={ config.label }
                            size="small"
                            variant="outlined"
                            sx={ {
                                color: config.chipColor,
                                fontWeight: 500
                            } }
                        />
                        { row.scope === "application_data" && row.belongs_to && (
                            <Label pointing="left" size="small">
                                { row.belongs_to }
                            </Label>
                        ) }
                    </>
                );
            },
            textAlign: "left",
            title: "",
            width: COL_WIDTH_SCOPE
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: "",
            width: COL_WIDTH_ACTIONS
        }
    ]), [ componentId, t ]);

    const actions: TableActionsInterface[] = useMemo(() => ([
        {
            hidden: (row: ProfileSchemaListingRow): boolean =>
                !row.attribute_id ||
                row.scope === "identity_attributes" ||
                !row.editable,

            icon: (): SemanticICONS => "pencil alternate",

            onClick: (e: SyntheticEvent, row: ProfileSchemaListingRow): void => {
                e?.stopPropagation?.();

                history.push(
                    AppConstants.getPaths()
                        .get("PROFILE_ATTRIBUTE")
                        .replace(":scope", row.scope)
                        .replace(":id", row.attribute_id)
                );
            },

            popupText: (): string =>
                t("profileAttributes.list.actions.edit"),

            renderer: "semantic-icon"
        },
        {
            hidden: (row: ProfileSchemaListingRow): boolean => !row.deletable || !row.attribute_id,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, row: ProfileSchemaListingRow): void => {
                e?.stopPropagation?.();
                setDeleting(row);
                setShowDeleteModal(true);
            },
            popupText: (): string => t("profileAttributes.list.actions.delete"),
            renderer: "semantic-icon"
        }
    ]), [ t ]);

    const handleDelete = async (): Promise<void> => {
        try {
            if (!deleting) return;

            await deleteSchemaAttributeById(deleting.scope, deleting.attribute_id);

            dispatch(addAlert({
                description: t("profileAttributes.list.notifications.deleteAttribute.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("profileAttributes.list.notifications.deleteAttribute.success.message")
            }));

            onRefresh();
        } catch (err: any) {
            dispatch(addAlert({
                description: err?.message
                    ?? t("profileAttributes.list.notifications.deleteAttribute.error.description"),
                level: AlertLevels.ERROR,
                message: t("profileAttributes.list.notifications.deleteAttribute.error.message")
            }));
        } finally {
            setShowDeleteModal(false);
            setDeleting(null);
        }
    };

    const handleRowClick = (_: SyntheticEvent, row: ProfileSchemaListingRow): void => {
        if (!row.attribute_id || !row.editable) return;

        history.push(
            AppConstants.getPaths()
                .get("PROFILE_ATTRIBUTE")
                .replace(":scope", row.scope)
                .replace(":id", row.attribute_id)
        );
    };

    return (
        <>
            <DataTable<ProfileSchemaListingRow>
                actions={ actions }
                columns={ columns }
                data={ rows }
                data-componentid={ `${componentId}-table` }
                isLoading={ isLoading }
                onRowClick={ handleRowClick }
                rowKey="id"
                showActions={ true }
                showHeader={ true }
                transparent={ !isLoading && rows.length === 0 }
            />

            { deleting && (
                <ConfirmationModal
                    assertionHint={ t("profileAttributes.list.confirmations.deleteAttribute.assertionHint") }
                    assertionType="checkbox"
                    closeOnDimmerClick={ false }
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ () => {
                        setDeleting(null);
                        setShowDeleteModal(false);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    onSecondaryActionClick={ () => {
                        setShowDeleteModal(false);
                        setDeleting(null);
                    } }
                    open={ showDeleteModal }
                    primaryAction={ t("common.buttons.confirm") }
                    secondaryAction={ t("common.buttons.cancel") }
                    type="negative"
                >
                    <>
                        <ConfirmationModal.Header>
                            { t("profileAttributes.list.confirmations.deleteAttribute.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("profileAttributes.list.confirmations.deleteAttribute.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            <Trans
                                i18nKey=
                                    "customerDataService:profileAttributes.list.confirmations.deleteAttribute.content"
                                values={ { attributeName: deleting.attribute_name } }
                                components={ [ null, <strong key="0" /> ] }
                            />
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            ) }
        </>
    );
};

