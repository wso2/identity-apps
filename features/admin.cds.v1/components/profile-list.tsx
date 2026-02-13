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
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal, DataTable, TableActionsInterface, TableColumnInterface, UserAvatar
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
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, SemanticICONS } from "semantic-ui-react";

import { deleteCDSProfile } from "../api/profiles";
import type { ProfileModel } from "../models/profiles";

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
    const dispatch:Dispatch<any> = useDispatch();

    const [ deletingProfile, setDeletingProfile ] = useState<ProfileModel | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);

    const getDisplayName = (profile: ProfileModel): string => {
        const given:any = (profile?.identity_attributes as any)?.givenname;
        const last:any = (profile?.identity_attributes as any)?.lastname;

        return `${given ?? ""} ${last ?? ""}`.trim();
    };

    const columns: TableColumnInterface[] = useMemo(() => ([
        {
            allowToggleVisibility: false,
            dataIndex: "profile_id",
            id: "profile_id",
            key: "profile_id",
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
                            { getDisplayName(profile) || null}
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            ),
            title: t("customerDataService:profiles.list.columns.profile")
        },
        {
            allowToggleVisibility: true,
            dataIndex: "user",
            id: "user",
            key: "user",
            textAlign: "center",
            render: (profile: ProfileModel): ReactNode => {
                const userId:string = profile.user_id;

                // Anonymous 
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

                return null;
            },
            title: t("customerDataService:profiles.list.columns.user")
        },
        {
            allowToggleVisibility: true,
            dataIndex: "unified_profiles",
            id: "unified_profiles",
            key: "unified_profiles",
            textAlign: "center",
            render: (profile: ProfileModel): ReactNode => {
                const merged:Array<{ profile_id: string; reason: string }> = profile.merged_from;
                const hasMerged:boolean = Array.isArray(merged) && merged.length > 0;

                if (!hasMerged) {
                    return null;
                }

                return (
                    <Chip
                        size="small"
                        variant="outlined"
                        label={ t("customerDataService:profiles.list.chips.unified") }
                        data-testid="not-unified-profile-chip"
                    />
                );
            },
            title: t("customerDataService:profiles.list.columns.unifiedProfiles")
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
            hidden: (profile: ProfileModel) => !!profile.user_id,
            icon: (): SemanticICONS => "trash alternate",
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
                description: t("customerDataService:profiles.list.notifications.delete.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:profiles.list.notifications.delete.success.message")
            }));

            onRefresh();
        } catch (error: any) {
            dispatch(addAlert({
                description:
                    error?.response?.data?.description
                    ?? t("customerDataService:profiles.list.notifications.delete.error.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:profiles.list.notifications.delete.error.message")
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
