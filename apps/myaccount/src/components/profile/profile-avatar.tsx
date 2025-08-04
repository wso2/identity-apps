/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { resolveUserDisplayName, resolveUserEmails } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileInfoInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EditAvatarModal,
    UserAvatar
} from "@wso2is/react-components";
import React, { Dispatch, FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateProfileImageURL } from "../../api/profile";
import { UIConstants } from "../../constants/ui-constants";
import { getProfileInformation } from "../../store/actions/authenticate";

interface ProfileAvatarPropsInterface extends IdentifiableComponentInterface {
    isReadOnly: boolean;
    isProfileUpdating: boolean;
    profileInfo: ProfileInfoInterface;
    setIsUpdating: (isUpdating: boolean) => void;
}

const ProfileAvatar: FunctionComponent<ProfileAvatarPropsInterface> = (
    {
        isReadOnly,
        isProfileUpdating,
        profileInfo,
        setIsUpdating,
        ["data-componentid"]: componentId = "component-id"
    }: ProfileAvatarPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();

    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    /**
     * Handles edit avatar modal submit action.
     *
     * @param e - Event.
     * @param url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        setIsUpdating(true);

        updateProfileImageURL(url)
            .then(() => {
                dispatch(addAlert({
                    description: t("myAccount:components.profile.notifications.updateProfileInfo.success" +
                                ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.success.message")
                }));

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t("myAccount:components.profile.notifications.updateProfileInfo.error" +
                                    ".description",
                        { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.profile.notifications.updateProfileInfo.error.message")
                    }));
                }

                dispatch(addAlert({
                    description: t("myAccount:components.profile.notifications.updateProfileInfo.genericError" +
                                ".description"),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
                }));
            })
            .finally(() => {
                setShowEditAvatarModal(false);
                setIsUpdating(false);
            });
    };

    return (
        <>
            <UserAvatar
                data-testid={ `${componentId}-user-avatar` }
                editable={ !isReadOnly }
                showGravatarLabel
                size="tiny"
                tabIndex={ 0 }
                onKeyPress={ (e: React.KeyboardEvent<HTMLElement>) => {
                    if (e.key === "Enter" && !isReadOnly) {
                        setShowEditAvatarModal(true);
                    }
                } }
                onClick={ () => !isReadOnly && setShowEditAvatarModal(true) }
                profileInfo={ profileInfo }
                gravatarInfoPopoverText={ (
                    <Trans i18nKey="myAccount:components.userAvatar.infoPopover">
                                    This image has been retrieved from
                        <a href={ UIConstants.GRAVATAR_URL } target="_blank" rel="noopener noreferrer">
                                        Gravatar
                        </a> service.
                    </Trans>
                ) }
            />
            {
                showEditAvatarModal && (
                    <EditAvatarModal
                        data-testid={ `${componentId}-edit-avatar-modal` }
                        open={ showEditAvatarModal }
                        name={ resolveUserDisplayName(profileInfo) }
                        emails={ resolveUserEmails(profileInfo?.emails) }
                        onClose={ () => setShowEditAvatarModal(false) }
                        onCancel={ () => setShowEditAvatarModal(false) }
                        onSubmit={ handleAvatarEditModalSubmit }
                        imageUrl={ profileInfo?.profileUrl }
                        heading={ t("myAccount:modals.editAvatarModal.heading") }
                        submitButtonText={ t("myAccount:modals.editAvatarModal.primaryButton") }
                        isSubmitting={ isProfileUpdating }
                        cancelButtonText={ t("myAccount:modals.editAvatarModal.secondaryButton") }
                        translations={ {
                            gravatar: {
                                errors: {
                                    noAssociation: {
                                        content: (
                                            <Trans
                                                i18nKey={ "myAccount:modals.editAvatarModal.content.gravatar.errors." +
                                                        "noAssociation.content" }
                                            >
                                                It seems like the selected email is not registered on Gravatar.
                                                Sign up for a Gravatar account by visiting
                                                <a href="https://www.gravatar.com"> Gravatar Official Website</a>
                                                or use one of the following.
                                            </Trans>
                                        ),
                                        header: t("myAccount:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("myAccount:modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("myAccount:modals.editAvatarModal.content.hostedAvatar.heading"),
                                input: {
                                    errors: {
                                        http: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                        "hostedAvatar.input.errors.http.content"),
                                            header: t("myAccount:modals.editAvatarModal.content." +
                                                        "hostedAvatar.input.errors.http.header")
                                        },
                                        invalid: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                        "hostedAvatar.input.errors.invalid.content"),
                                            pointing: t("myAccount:modals.editAvatarModal.content." +
                                                        "hostedAvatar.input.errors.invalid.pointing")
                                        }
                                    },
                                    hint: t("myAccount:modals.editAvatarModal.content.hostedAvatar.input.hint"),
                                    placeholder: t("myAccount:modals.editAvatarModal.content.hostedAvatar.input" +
                                                    ".placeholder"),
                                    warnings: {
                                        dataURL: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                        "hostedAvatar.input.warnings.dataURL.content"),
                                            header: t("myAccount:modals.editAvatarModal.content." +
                                                        "hostedAvatar.input.warnings.dataURL.header")
                                        }
                                    }
                                }
                            },
                            systemGenAvatars: {
                                heading: t("myAccount:modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("myAccount:modals.editAvatarModal.content.systemGenAvatars." +
                                                "types.initials")
                                }
                            }
                        } }
                    />
                )
            }
        </>
    );
};

export default ProfileAvatar;
