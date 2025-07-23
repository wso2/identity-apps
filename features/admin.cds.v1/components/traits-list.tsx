import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable, AppAvatar, AnimatedAvatar, ConfirmationModal } from "@wso2is/react-components";
import { TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import { SemanticICONS } from "semantic-ui-react";
import { Trait } from "../api/traits";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import axios from "axios";
import { error } from "console";

interface TraitsListProps {
    traits: Trait[];
    isLoading: boolean;
    onRefresh: () => void;
    onSearchQueryClear?: () => void;
    searchQuery?: string;
}

export const TraitsList: FunctionComponent<TraitsListProps> = ({
    traits,
    isLoading,
    onRefresh
}: TraitsListProps): ReactElement => {
    const dispatch = useDispatch();
    const [ deletingTrait, setDeletingTrait ] = useState<Trait>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const columns: TableColumnInterface[] = [
        {
            allowToggleVisibility: false,
            dataIndex: "attribute_name",
            id: "attribute_name",
            key: "attribute_name",
            render: (trait: Trait) => {
                const displayName = trait.attribute_name.replace(/^traits\./, "");
                const initial = displayName.split(".").pop();

                return (
                    <div className="header-with-icon">
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
                        { displayName }
                    </div>
                );
            },
            title: "Name"
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

    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "pencil alternate",
            onClick: (e: SyntheticEvent, trait: Trait): void => {
                history.push(AppConstants.getPaths().get("TRAITS_EDIT").replace(":id", trait.attribute_id));
            },
            popupText: (): string => "Edit",
            renderer: "semantic-icon"
        },
        {
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, trait: Trait): void => {
                setDeletingTrait(trait);
                setShowDeleteModal(true);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon"
        }
    ];

    const handleDelete = async () => {
        try {
                axios
                    .delete(`http://localhost:8900/api/v1/profile-schema/traits/${deletingTrait.attribute_id}`)
                    .then((res) => {
                        dispatch(addAlert({
                            level: AlertLevels.SUCCESS,
                            message: "Trait deleted",
                            description: "Trait deleted successfully."
                        }));
                        onRefresh();
                    })
                    .catch((error) => {
                        dispatch(addAlert({
                            level: AlertLevels.ERROR,
                            message: "Delete failed",
                            description: error?.message || "Failed to delete the trait."
                        }));
                    });
        } finally {
            setShowDeleteModal(false);
            setDeletingTrait(null);
        }
    };

    return (
        <>
            <DataTable<Trait>
                isLoading={ isLoading }
                columns={ columns }
                data={ traits }
                actions={ actions }
                onRowClick={ (e: SyntheticEvent, trait: Trait): void => {
                    history.push(AppConstants.getPaths().get("TRAITS_EDIT").replace(":id", trait.attribute_id));
                } }
                showHeader={ true }
                transparent={ !isLoading && traits.length === 0 }
                showActions={ true }
            />

            { deletingTrait && (
                <ConfirmationModal
                    onClose={ () => {
                        setDeletingTrait(null);
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
                        setDeletingTrait(null);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                >
                    <>
                        <ConfirmationModal.Header>Delete Trait</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            This action is irreversible!
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            Are you sure you want to delete the trait <b>{ deletingTrait.attribute_name }</b>?<br />
                            This action will remove this trait from the profile schema and from the profiles that have this trait.
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            ) }
        </>
    );
};
