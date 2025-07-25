import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useState
} from "react";
import { DataTable, ConfirmationModal, UserAvatar } from "@wso2is/react-components";
import { TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { Header, SemanticICONS } from "semantic-ui-react";
import axios from "axios";
import { ProfileModel } from "../models/profile";
import Chip from "@oxygen-ui/react/Chip/Chip";

interface ProfilesListProps {
    profiles?: ProfileModel[];
    isLoading: boolean;
    onRefresh: () => void;
    onSearchQueryClear?: () => void;
    searchQuery?: string;
}

const ProfilesList: FunctionComponent<ProfilesListProps> = ({
    profiles,
    isLoading,
    onRefresh 
}: ProfilesListProps): ReactElement => {

    const dispatch = useDispatch();

    const [ deletingProfile, setDeletingProfile ] = useState<ProfileModel>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const columns: TableColumnInterface[] = [
        {
            allowToggleVisibility: false,
            dataIndex: "profile_id",
            id: "profile_id",
            key: "profile_id",
            title: "Profile ID",
            render: (profile: ProfileModel): ReactNode => {
                return (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        // data-componentid={ `${ testId }-item-heading` }
                    >
                        <UserAvatar
                            data-componentid="users-list-item-image"
                            name={ typeof profile.profile_id === "string" ? profile.profile_id.charAt(0).toUpperCase() : "U" }
                            size="mini"
                            // image={ user.profileUrl }
                            spaced="right"
                            data-suppress=""
                        />   
                         <Header.Content>
                            { profile.profile_id }
                            <Header.Subheader>
                                {
                                    profile.identity_attributes?.givenname && profile.identity_attributes?.lastname
                                        ? `${ profile.identity_attributes.givenname } ${ profile.identity_attributes.lastname }`.trim()
                                        : ""
                                }
                            </Header.Subheader>
                        </Header.Content>                     
                    </Header>
                );
            },
        },
        // {
        //     allowToggleVisibility: true,
        //     id: "user_id",
        //     key: "user_id",
        //     title: "User ID",
        //     dataIndex: "user_id",
        //     render: (profile: ProfileModel) => profile.identity_attributes?.user_id || "-"
        // },
        {
            allowToggleVisibility: true,
            id: "user_name",
            key: "user_name",
            title: "User Account",
            dataIndex: "user_name",
            render: (profile: ProfileModel) => {
                const username = profile.identity_attributes?.username;
        
                return username ? (
                    username
                ) : (
                    <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="Anonymous"
                        data-testid="anonymous-username-chip"
                    />
                );
            }
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "action",
            key: "action",
            textAlign: "right",
            title: "",
        }
    ];

    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "eye",
            onClick: (_: SyntheticEvent, ProfileModel: ProfileModel): void => {
                history.push(AppConstants.getPaths().get("PROFILE_VIEW")?.replace(":id", ProfileModel.profile_id));
            },
            popupText: (): string => "View",
            renderer: "semantic-icon"
        },
        {
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_: SyntheticEvent, ProfileModel: ProfileModel): void => {
                setDeletingProfile(ProfileModel);
                setShowDeleteModal(true);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon"
        }
    ];

    const handleDelete = async (): Promise<void> => {
        try {
            await axios.delete(`http://localhost:8900/api/v1/profiles/${deletingProfile.profile_id}`);

            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: "Profile deleted",
                description: "The Profile was successfully deleted."
            }));

            onRefresh();
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Delete failed",
                description: error?.message || "Failed to delete the Profile."
            }));
        } finally {
            setShowDeleteModal(false);
            setDeletingProfile(null);
        }
    };

    return (
        <>
            <DataTable<ProfileModel>
                isLoading={ isLoading }
                rowKey="profile_id"
                columns={ columns }
                data={ profiles }
                actions={ actions }
                onRowClick={ (_: SyntheticEvent, ProfileModel: ProfileModel) => {
                    history.push(AppConstants.getPaths().get("PROFILE_VIEW")
                        ?.replace(":id", ProfileModel.profile_id));
                } }
                showHeader
                showActions
                transparent={ !isLoading && (profiles?.length ?? 0) === 0 }
                />

            { deletingProfile && (
                <ConfirmationModal
                    onClose={ () => {
                        setDeletingProfile(null);
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
                        setDeletingProfile(null);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                >
                    <>
                        <ConfirmationModal.Header>Delete Profile</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            This action is irreversible!
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            Are you sure you want to delete the Profile <b>{ deletingProfile.profile_id }</b>?
                            This action cannot be undone.
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ProfilesList;
