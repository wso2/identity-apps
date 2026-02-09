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

import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useMemo,
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
import Chip from "@oxygen-ui/react/Chip/Chip";
import { ProfileModel } from "../models/profiles";
import { deleteUserProfile } from "../api/profiles";

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

    const [ deletingProfile, setDeletingProfile ] = useState<ProfileModel | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const getDisplayName = (profile: ProfileModel): string => {
        const given =
            profile.identity_attributes?.givenname
        const last =
            profile.identity_attributes?.lastname 

        const full = `${ given ?? "" } ${ last ?? "" }`.trim();

        return full;
    };

    const shortId = (id?: string): string => {
        if (!id) return "";
        return id.length > 8 ? `${ id.slice(0, 8) }…` : id;
    };

    const columns: TableColumnInterface[] = useMemo(() => ([
        {
            allowToggleVisibility: false,
            dataIndex: "profile_id",
            id: "profile_id",
            key: "profile_id",
            title: "Profile",
            render: (profile: ProfileModel): ReactNode => (
                <Header image as="h6" className="header-with-icon">
                    <UserAvatar
                        data-componentid="profiles-list-item-image"
                        name={ typeof profile.profile_id === "string"
                            ? profile.profile_id.charAt(0).toUpperCase()
                            : "P"
                        }
                        size="mini"
                        spaced="right"
                        data-suppress=""
                    />
                    <Header.Content>
                        { profile.profile_id }
                        <Header.Subheader>
                            { getDisplayName(profile) }
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            )
        },
        {
            allowToggleVisibility: true,
            id: "attached_user",
            key: "attached_user",
            title: "Attached User",
            dataIndex: "attached_user",
            render: (profile: ProfileModel): ReactNode => {
                const userId = profile.user_id;
                const username = profile.identity_attributes?.username;
        
                // Case 1: Anonymous → only chip
                if (!userId) {
                    return (
                        <Chip
                            size="small"
                            color="primary"
                            variant="outlined"
                            label="Anonymous"
                            data-testid="anonymous-username-chip"
                        />
                    );
                }
        
                // Case 2 + 3: Identified
                return (
                    <Header as="h6">
                        <Header.Content>
                            { userId }
        
                            {/* Only show row2 if username exists */}
                            { username && (
                                <Header.Subheader>
                                    { username }
                                </Header.Subheader>
                            ) }
                        </Header.Content>
                    </Header>
                );
            }
        },        
        {
            allowToggleVisibility: true,
            id: "merged_from",
            key: "merged_from",
            title: "Merged From",
            dataIndex: "merged_from",
            render: (profile: ProfileModel): ReactNode => {
                const merged = (profile as any).merged_from as
                    Array<{ profile_id: string }> | undefined;
        
                if (!merged || merged.length === 0) {
                    return null;   // show nothing if empty
                }
        
                return (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        { merged.map((m) => (
                            <Chip
                                key={ m.profile_id }
                                size="small"
                                variant="outlined"
                                label={ m.profile_id }   // full profile ID
                            />
                        )) }
                    </div>
                );
            }
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "action",
            key: "action",
            textAlign: "right",
            title: ""
        }
    ]), []);

    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "trash alternate",
            hidden: (profile: ProfileModel) => !!profile.user_id, // only anonymous
            onClick: (_: SyntheticEvent, profile: ProfileModel): void => {
                setDeletingProfile(profile);
                setShowDeleteModal(true);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon"
        }
    ];

    const handleDelete = async (): Promise<void> => {
        if (!deletingProfile) return;

        try {
            await deleteUserProfile(deletingProfile.profile_id);

            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: "Profile deleted",
                description: "The profile was successfully deleted."
            }));

            onRefresh();
        } catch (error: any) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Delete failed",
                description: error?.response?.data?.description ?? error?.message ?? "Failed to delete the profile."
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
                onRowClick={ (_: SyntheticEvent, profile: ProfileModel) => {
                    history.push(AppConstants.getPaths().get("PROFILE_VIEW")?.replace(":id", profile.profile_id));
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
                            Are you sure you want to delete the profile <b>{ deletingProfile.profile_id }</b>?
                            This action cannot be undone.
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ProfilesList;
