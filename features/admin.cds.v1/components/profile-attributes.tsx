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

import Chip from "@oxygen-ui/react/Chip/Chip";
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
    Dispatch,
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useMemo,
    useState
} from "react";
import { useDispatch } from "react-redux";
import { Header, Label, SemanticICONS, SemanticWIDTHS } from "semantic-ui-react";

import { deleteSchemaAttributeById } from "../api/profile-attributes";
import { ProfileSchemaListingRow, SCOPE_CONFIG } from "../models/profile-attribute-listing";

// =============================================================================
// Column width constants (Semantic UI 16-unit grid)
// Attribute(7) + Scope(7) + Actions(2) = 16
// =============================================================================
const COL_WIDTH_ATTRIBUTE: SemanticWIDTHS = 7;
const COL_WIDTH_SCOPE: SemanticWIDTHS = 7;
const COL_WIDTH_ACTIONS: SemanticWIDTHS = 2;

interface ProfileSchemaListingProps extends IdentifiableComponentInterface {
    isLoading: boolean;
    onRefresh: () => void;
    rows: ProfileSchemaListingRow[];
}

export const ProfileSchemaListing: FunctionComponent<ProfileSchemaListingProps> = ({
    isLoading,
    onRefresh,
    rows,
    ["data-componentid"]: componentId = "profile-schema-listing"
}: ProfileSchemaListingProps): ReactElement => {

    const dispatch: Dispatch<any> = useDispatch();

    const [ deleting, setDeleting ] = useState<ProfileSchemaListingRow | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);

    const columns: TableColumnInterface[] = useMemo(() => ([
        // ── Column 1: Attribute (fills majority of row) ───────────────────────
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
            title: "Attribute",
            width: COL_WIDTH_ATTRIBUTE
        },

        // ── Column 2: Scope (chip + optional belongs_to label) ────────────────
        {
            allowToggleVisibility: false,
            dataIndex: "scope",
            id: "scope",
            key: "scope",
            render: (row: ProfileSchemaListingRow): ReactNode => {
                const config = SCOPE_CONFIG[row.scope];

                if (!config?.label) return null;

                return (
                    <>
                        <Chip
                            label={ config.label }
                            size="small"
                            variant="outlined"
                            sx={ {
                                // backgroundColor: config.backgroundColor,
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
            title: "Scope",
            width: COL_WIDTH_SCOPE
        },

        // ── Column 3: Actions ─────────────────────────────────────────────────
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: "",
            width: COL_WIDTH_ACTIONS
        }
    ]), [ componentId ]);

    const actions: TableActionsInterface[] = useMemo(() => ([
        {
            hidden: (row: ProfileSchemaListingRow): boolean => !row.deletable || !row.attribute_id,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, row: ProfileSchemaListingRow): void => {
                e?.stopPropagation?.();
                setDeleting(row);
                setShowDeleteModal(true);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon"
        }
    ]), []);

    const handleDelete = async (): Promise<void> => {
        try {
            if (!deleting) return;

            await deleteSchemaAttributeById(deleting.scope, deleting.attribute_id);

            dispatch(addAlert({
                description: "Attribute deleted successfully.",
                level: AlertLevels.SUCCESS,
                message: "Deleted"
            }));

            onRefresh();
        } catch (err: any) {
            dispatch(addAlert({
                description: err?.message ?? "Failed to delete the attribute.",
                level: AlertLevels.ERROR,
                message: "Delete failed"
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
                    assertionHint="Please confirm the deletion."
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
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    type="negative"
                >
                    <>
                        <ConfirmationModal.Header>
                            Delete Attribute
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            This action is irreversible!
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            Are you sure you want to delete <b>{ deleting.attribute_name }</b>?
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ProfileSchemaListing;