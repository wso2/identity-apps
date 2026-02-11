import React, { FunctionComponent, ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable, AppAvatar, AnimatedAvatar, ConfirmationModal } from "@wso2is/react-components";
import { TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import { SemanticICONS } from "semantic-ui-react";
import Chip from "@oxygen-ui/react/Chip/Chip";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import axios from "axios";
import { CDM_BASE_URL } from "../models/constants";
import { ProfileSchemaAttribute } from "../models/profile-attributes";
import { ProfileSchemaListingRow,  } from "../models/profile-attribute-listing";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";

interface ProfileSchemaListingProps {
    rows: ProfileSchemaListingRow[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const ProfileSchemaListing: FunctionComponent<ProfileSchemaListingProps> = ({
    rows,
    isLoading,
    onRefresh
}: ProfileSchemaListingProps): ReactElement => {

    const dispatch = useDispatch();

    const [ deleting, setDeleting ] = useState<ProfileSchemaListingRow | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const columns: TableColumnInterface[] = [
        {
            allowToggleVisibility: false,
            dataIndex: "display_name",
            id: "attribute",
            key: "attribute",
            render: (row: ProfileSchemaListingRow) => {
                const initial = row.display_name?.charAt(0)?.toUpperCase() || "?";

                return (
                    <div style={ { display: "flex", alignItems: "center", gap: 10 } }>
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ initial }
                                    size="mini"
                                />
                            ) }
                            size="mini"
                            spaced="right"
                        />

                        <div style={ { display: "flex", alignItems: "center", gap: 8 } }>
                            <span>{ row.display_name }</span>
                            { row.chip_label && (
                                <Chip size="small" label={ row.chip_label } variant="outlined" />
                            ) }
                        </div>
                    </div>
                );
            },
            title: "Attribute"
        },
        {
            allowToggleVisibility: false,
            dataIndex: "belongs_to",
            id: "belongs_to",
            key: "belongs_to",
            render: (row: ProfileSchemaListingRow) => row.scope === "application_data" ? (row.belongs_to ?? null) : null,
            title: "Belongs to"
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: ""
        }
    ];

    const actions: TableActionsInterface[] = useMemo(() => ([
        {
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, row: ProfileSchemaListingRow): void => {
                e?.stopPropagation?.();

                setDeleting(row);
                setShowDeleteModal(true);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon",
            hidden: (row: ProfileSchemaListingRow): boolean => !row.deletable || !row.attribute_id
        }
    ]), []);

    const resolveDeleteUrl = (row: ProfileSchemaListingRow): string | null => {
        if (!row.attribute_id) return null;

        if (row.scope === "traits") {
            return `${CDM_BASE_URL}/profile-schema/traits/${row.attribute_id}`;
        }

        if (row.scope === "application_data") {
            return `${CDM_BASE_URL}/profile-schema/application_data/${row.attribute_id}`;
        }

        return null;
    };

    const handleDelete = async (): Promise<void> => {
        try {
            if (!deleting) return;

            const url = resolveDeleteUrl(deleting);
            if (!url) {
                dispatch(addAlert({
                    level: AlertLevels.ERROR,
                    message: "Delete failed",
                    description: "No delete endpoint for this attribute."
                }));
                return;
            }

            await axios.delete(url);

            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: "Deleted",
                description: "Attribute deleted successfully."
            }));

            onRefresh();
        } catch (err: any) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Delete failed",
                description: err?.message || "Failed to delete the attribute."
            }));
        } finally {
            setShowDeleteModal(false);
            setDeleting(null);
        }
    };

    const handleRowClick = (_: SyntheticEvent, row: ProfileSchemaListingRow): void => {
        if (!row.attribute_id) return;

        // If editable, go to edit page
        if (row.editable) {
            history.push(
                AppConstants.getPaths()
                    .get("PROFILE_ATTRIBUTE")
                    .replace(":scope", row.scope)
                    .replace(":id", row.attribute_id)
            );
        }
    };

    return (
        <>
            <DataTable<ProfileSchemaListingRow>
                isLoading={ isLoading }
                columns={ columns }
                data={ rows }
                actions={ actions }
                showHeader={ true }
                showActions={ true }
                transparent={ !isLoading && rows.length === 0 }
                onRowClick={ handleRowClick }
            />

            { deleting && (
                <ConfirmationModal
                    onClose={ () => {
                        setDeleting(null);
                        setShowDeleteModal(false);
                    } }
                    type="negative"
                    open={ showDeleteModal }
                    assertionHint="Please confirm the deletion."
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ () => {
                        setShowDeleteModal(false);
                        setDeleting(null);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                >
                    <>
                        <ConfirmationModal.Header>Delete Attribute</ConfirmationModal.Header>
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