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
import type { TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { Header, SemanticICONS } from "semantic-ui-react";
import Chip from "@oxygen-ui/react/Chip/Chip";

import type { ProfileModel } from "../models/profiles";
import { deleteCDSProfile } from "../api/cds-profiles";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ deletingProfile, setDeletingProfile ] = useState<ProfileModel | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);

    const getDisplayName = (profile: ProfileModel): string => {
        const given = (profile?.identity_attributes as any)?.givenname;
        const last = (profile?.identity_attributes as any)?.lastname;

        return `${given ?? ""} ${last ?? ""}`.trim();
    };

    const columns: TableColumnInterface[] = useMemo(() => ([
        {
            allowToggleVisibility: false,
            dataIndex: "profile_id",
            id: "profile_id",
            key: "profile_id",
            title: t("customerDataService:profiles.list.columns.profile"),
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
                            { getDisplayName(profile) || "-" }
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            )
        },
        {
            allowToggleVisibility: true,
            id: "user",
            key: "user",
            title: t("customerDataService:profiles.list.columns.user"),
            dataIndex: "user",
            render: (profile: ProfileModel): ReactNode => {
                const userId = profile.user_id;

                // Anonymous → only chip (don’t show user_id)
                if (!userId) {
                    return (
                        <Chip
                            size="small"
                            color="primary"
                            variant="outlined"
                            label={ t("customerDataService:profiles.list.chips.anonymous") }
                            data-testid="anonymous-username-chip"
                        />
                    );
                }

                // Linked → only chip (don’t show user_id)
                return (
                    <Chip
                        size="small"
                        color="success"
                        variant="outlined"
                        label={ t("customerDataService:profiles.list.chips.linked") }
                        data-testid="linked-user-chip"
                    />
                );
            }
        },
        {
            allowToggleVisibility: true,
            id: "unified_profiles",
            key: "unified_profiles",
            title: t("customerDataService:profiles.list.columns.unifiedProfiles"),
            dataIndex: "unified_profiles",
            render: (profile: ProfileModel): ReactNode => {
                const merged = profile.merged_from;
                const hasMerged = Array.isArray(merged) && merged.length > 0;

                if (!hasMerged) {
                    return (
                        <Chip
                            size="small"
                            variant="outlined"
                            label={ t("customerDataService:profiles.list.chips.notUnified") }
                            data-testid="not-unified-profile-chip"
                        />
                    );
                }

                return (
                    <Chip
                        size="small"
                        variant="outlined"
                        label={ t("customerDataService:profiles.list.chips.unified") }
                        data-testid="unified-profile-chip"
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
            title: ""
        }
    ]), [ t ]);

    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "trash alternate",
            hidden: (profile: ProfileModel) => !!profile.user_id, // only anonymous
            onClick: (_: SyntheticEvent, profile: ProfileModel): void => {
                setDeletingProfile(profile);
                setShowDeleteModal(true);
            },
            popupText: (): string => t("customerDataService:common.buttons.delete"),
            renderer: "semantic-icon"
        }
    ];

    const handleDelete = async (): Promise<void> => {
        if (!deletingProfile) return;

        try {
            await deleteCDSProfile(deletingProfile.profile_id);

            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:profiles.list.notifications.delete.success.message"),
                description: t("customerDataService:profiles.list.notifications.delete.success.description")
            }));

            onRefresh();
        } catch (error: any) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: t("customerDataService:profiles.list.notifications.delete.error.message"),
                description:
                    error?.response?.data?.description
                    ?? error?.response?.data?.detail
                    ?? error?.message
                    ?? t("customerDataService:profiles.list.notifications.delete.error.description")
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
                    history.push(AppConstants.getPaths().get("PROFILE")?.replace(":id", profile.profile_id));
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
                    assertionHint={ t("customerDataService:profiles.list.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("customerDataService:common.buttons.confirm") }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ () => {
                        setShowDeleteModal(false);
                        setDeletingProfile(null);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                >
                    <>
                        <ConfirmationModal.Header>
                            { t("customerDataService:profiles.list.confirmations.delete.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("customerDataService:profiles.list.confirmations.delete.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("customerDataService:profiles.list.confirmations.delete.content", {
                                profileId: deletingProfile.profile_id
                            }) }
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ProfilesList;
