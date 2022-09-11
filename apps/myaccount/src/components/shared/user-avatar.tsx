/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Dimmer, Form, Icon, Modal, Popup } from "semantic-ui-react";
import { Avatar, AvatarProps } from "./avatar";
import { updateProfileInfo } from "../../api";
import { getThirdPartyLogos } from "../../configs";
import { UIConstants } from "../../constants";
import { resolveUserDisplayName } from "../../helpers";
import { AlertInterface, AlertLevels, AuthStateInterface, ProfileSchema } from "../../models";
import { getProfileInformation } from "../../store/actions";

/**
 * Prop types for the user avatar component.
 */
interface UserAvatarProps extends AvatarProps {
    authState?: AuthStateInterface;
    gravatarInfoPopoverText?: React.ReactNode;
    showGravatarLabel?: boolean;
    showEdit?: boolean;
    profileUrl?: string;
    urlSchema?: ProfileSchema;
    onAlertFired?: (alert: AlertInterface) => void;
}

/**
 * Enum to be used to specify the type of error when submitting the url
 */
enum Error {
    REQUIRED,
    VALIDATION,
    NONE
}

/**
 * User Avatar component.
 *
 * @param props - Props injected in to the user avatar component.
 * @returns User Avatar component.
 */
export const UserAvatar: FunctionComponent<UserAvatarProps> = (props: UserAvatarProps): JSX.Element => {
    const {
        authState,
        gravatarInfoPopoverText,
        name,
        image,
        showGravatarLabel,
        showEdit,
        profileUrl,
        urlSchema,
        onAlertFired,
        ...rest
    } = props;

    const [ userImage, setUserImage ] = useState(null);
    const [ showPopup, setShowPopup ] = useState(false);
    const [ showEditOverlay, setShowEditOverlay ] = useState(false);
    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ url, setUrl ] = useState("");
    const [ urlError, setUrlError ] = useState(Error.NONE);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Check if the image is a promise, and resolve.
    useEffect(() => {
        if (image instanceof Promise) {
            image
                .then((response) => {
                    setUserImage(response);
                })
                .catch(() => {
                    setUserImage(null);
                });
        } else if (!isEmpty(image)) {
            setUserImage(image);
        }
    }, [ image ]);

    /**
     * Checks if the image is from `Gravatar`.
     *
     * @returns If gravatar URL or not.
     */
    const isGravatarURL = (): boolean => {
        return (userImage && userImage.includes(UIConstants.GRAVATAR_URL))
            || (authState && authState.profileInfo && authState.profileInfo.userImage
                && authState.profileInfo.userImage.includes(UIConstants.GRAVATAR_URL))
            || (authState && authState.profileInfo && authState.profileInfo.profileUrl
                && authState.profileInfo.profileUrl.includes(UIConstants.GRAVATAR_URL));
    };


    /**
     * Resolves the top label image.
     *
     * @returns Gravatar label.
     */
    const resolveTopLabel = (): string => {
        if (isGravatarURL()) {
            return getThirdPartyLogos().gravatar;
        }

        return null;
    };

    /**
     * Handles the mouse over event.
     *
     */
    const handleOnMouseOver = () => {
        setShowPopup(true);
    };

    /**
     * Handles the mouse out event.
     *
     */
    const handleOnMouseOut = () => {
        setShowPopup(false);
    };

    /**
     * This contains the Avatar component
     */
    const avatar = (
        <Avatar
            avatar
            avatarType="user"
            bordered={ false }
            image={
                (authState && authState.profileInfo
                    && (authState.profileInfo.profileUrl || authState.profileInfo.userImage))
                    ?
                    authState.profileInfo.profileUrl
                        ? authState.profileInfo.profileUrl
                        : authState.profileInfo.userImage
                    :
                    userImage
            }
            label={ showGravatarLabel ? resolveTopLabel() : null }
            name={ authState ? resolveUserDisplayName(authState) : name || "" }
            onMouseOver={ handleOnMouseOver }
            onMouseOut={ handleOnMouseOut }
            { ...rest }
        />
    );

    /**
     * This function services the API call to update the profileUrl
     */
    const updateProfileUrl = () => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {
                        profileUrl: url
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateProfileInfo(data).then((response) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.message"
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
                setShowEditModal(false);
            }
        });
    };

    /**
     * This is called when the save button is clicked
     */
    const handleSubmit = async () => {

        if (isEmpty(url)) {
            setUrlError(Error.REQUIRED);
        } else if (! await FormValidation.imageUrl(url)) {
            setUrlError(Error.VALIDATION);
        } else {
            updateProfileUrl();
        }

    };

    /**
     * This function is called when the modal is closed
     */
    const closeModal = () => {
        setShowEditModal(false);
        setUrlError(Error.NONE);
    };

    /**
     * This function is called when the button inside dimmer is clicked
     * This shows the modal and sets the profileUrl.
     */
    const openModal = () => {
        setShowEditModal(true);
        setUrl(profileUrl);
    };

    /**
     * Show Edit Modal
     */
    const editModal = () => {
        const fieldName = t("myAccount:components.profile.fields."
            + urlSchema.name.replace(".", "_"),
        { defaultValue: urlSchema.displayName }
        );

        return (
            <Modal
                dimmer="blurring"
                size="tiny"
                open={ showEditModal }
                onClose={ closeModal }
            >
                <Modal.Content>
                    <h3>{ t("myAccount:components.userAvatar.urlUpdateHeader") }</h3>
                    <Form>
                        <Form.Input
                            value={ url }
                            onChange={ (e) => { setUrl(e.target.value); } }
                            label={ fieldName }
                            required={ urlSchema.required }
                            error={
                                urlError === Error.VALIDATION
                                    ? {
                                        content: t(
                                            "myAccount:components.profile.forms." +
                                            "generic.inputs.validations.invalidFormat",
                                            {
                                                fieldName
                                            }
                                        ),
                                        pointing: "above"
                                    }
                                    : urlError === Error.REQUIRED
                                        ? {
                                            content: t(
                                                "myAccount:components.profile.forms.generic.inputs.validations.empty",
                                                {
                                                    fieldName
                                                }
                                            ),
                                            pointing: "above"
                                        }
                                        : false
                            }
                            placeholder={ t("myAccount:components.profile.forms.generic.inputs.placeholder", {
                                fieldName
                            }) }
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button className="link-button" onClick={ closeModal } >
                        { t("common:cancel").toString() }
                    </Button>
                    <Button primary={ true } onClick={ handleSubmit }>
                        { t("common:save").toString() }
                    </Button>
                </Modal.Actions>

            </Modal>

        );
    };

    return (
        <>
            { !isEmpty(urlSchema) && showEditModal ? editModal() : null }
            <Popup
                content={ gravatarInfoPopoverText }
                position="bottom center"
                size="mini"
                disabled={ !(showGravatarLabel && isGravatarURL()) }
                inverted
                hoverable
                open={ showPopup }
                trigger={
                    (
                        showEdit
                            ? (
                                <Dimmer.Dimmable
                                    className="circular user-avatar"
                                    onMouseOver={ () => { setShowEditOverlay(true); } }
                                    onMouseOut={ () => { setShowEditOverlay(false); } }
                                    blurring
                                    dimmed={ showEditOverlay }
                                >
                                    <Dimmer active={ showEditOverlay }>
                                        <Button
                                            circular
                                            basic
                                            className="upload-button"
                                            onClick={ openModal }
                                        >
                                            <Icon name="camera" size="large" />
                                        </Button>
                                    </Dimmer>
                                    { avatar }
                                </Dimmer.Dimmable>
                            )
                            : avatar
                    )
                }
            />
        </>
    );
};

/**
 * Default prop types for the User avatar component.
 */
UserAvatar.defaultProps = {
    authState: null,
    gravatarInfoPopoverText: null,
    name: null,
    showGravatarLabel: false
};
