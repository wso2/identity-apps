/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

import { action } from "@storybook/addon-actions";
import { boolean, radios, select, text } from "@storybook/addon-knobs";
import { UIConstants } from "@wso2is/core/constants";
import React, { ReactElement } from "react";
import { meta } from "./user-avatar.stories.meta";
import { UserAvatar } from "../../../src";

export default {
    parameters: {
        component: UserAvatar,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/User Avatar"
};

/**
 * Story to display all the user avatar variations.
 *
 * @return {React.ReactElement}
 */
export const AllUserAvatarVariations = (): ReactElement => {
    return (
        <>
            <UserAvatar
                spaced="right"
                size="tiny"
            />
            <UserAvatar
                spaced="right"
                size="tiny"
                name="brion"
            />
            <UserAvatar
                spaced="right"
                size="tiny"
                avatarInitialsLimit={ 2 }
                name="Brion Silva"
            />
            <UserAvatar
                spaced="right"
                size="tiny"
                image="https://avatars3.githubusercontent.com/u/25959096?s=460&v=4"
            />
            <UserAvatar
                spaced="right"
                size="tiny"
                gravatarInfoPopoverText={ (
                    <div>
                        This image has been retrieved from
                        { " " }
                        <a href={ UIConstants.GRAVATAR_URL } rel="noopener noreferrer" target="_blank">Gravatar</a>
                        { " " }
                        service.
                    </div>
                ) }
                showGravatarLabel={ true }
                profileInfo={ {
                    emails: [ "brion@wso2.com" ],
                    name: {
                        familyName: "Silva",
                        givenName: "Brion"
                    },
                    profileUrl: "https://www.gravatar.com/avatar/422ec35ee753b1a54c54f45ce5a34caf",
                    userName: "brion"
                } }
            />
        </>
    );
};

AllUserAvatarVariations.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display the default user avatar variation.
 *
 * @return {React.ReactElement}
 */
export const DefaultUserAvatar = (): ReactElement => (
    <UserAvatar
        spaced="right"
        size="tiny"
    />
);

DefaultUserAvatar.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display the user avatar with initials.
 *
 * @return {React.ReactElement}
 */
export const UserAvatarWithInitials = (): ReactElement => (
    <>
        <UserAvatar
            spaced="right"
            size="tiny"
            name="brion"
        />
        <UserAvatar
            spaced="right"
            size="tiny"
            avatarInitialsLimit={ 2 }
            name="Brion Silva"
        />
    </>
);

UserAvatarWithInitials.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display the user avatar from image.
 *
 * @return {React.ReactElement}
 */
export const UserAvatarWithImage = (): ReactElement => (
    <UserAvatar
        spaced="right"
        size="tiny"
        image="https://avatars3.githubusercontent.com/u/25959096?s=460&v=4"
    />
);

UserAvatarWithImage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display the user avatar with gravatar URL.
 *
 * @return {React.ReactElement}
 */
export const UserAvatarWithGravatar = (): ReactElement => (
    <UserAvatar
        spaced="right"
        size="tiny"
        gravatarInfoPopoverText={ (
            <div>
                This image has been retrieved from
                { " " }
                <a href={ UIConstants.GRAVATAR_URL } rel="noopener noreferrer" target="_blank">Gravatar</a>
                { " " }
                service.
            </div>
        ) }
        showGravatarLabel={ true }
        profileInfo={ {
            emails: [ "brion@wso2.com" ],
            name: {
                familyName: "Silva",
                givenName: "Brion"
            },
            profileUrl: "https://www.gravatar.com/avatar/422ec35ee753b1a54c54f45ce5a34caf",
            userName: "brion"
        } }
    />
);

UserAvatarWithGravatar.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};

/**
 * Story to display the user avatar loading status.
 *
 * @return {React.ReactElement}
 */
export const UserAvatarPlaceholder = (): ReactElement => (
    <UserAvatar
        isLoading={ true }
        spaced="right"
        size="tiny"
    />
);

UserAvatarPlaceholder.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description
        }
    }
};

/**
 * Story to display the editable user avatar.
 *
 * @return {React.ReactElement}
 */
export const EditableUserAvatar = (): ReactElement => (
    <UserAvatar
        editable
        spaced="right"
        size="tiny"
        profileInfo={ {
            emails: [ "brion@wso2.com" ],
            name: {
                familyName: "Silva",
                givenName: "Brion"
            },
            profileUrl: "https://avatars3.githubusercontent.com/u/25959096?s=460&v=4",
            userName: "brion"
        } }
        onClick={ action("Clicked on Avatar") }
        onEditIconClick={ action("Clicked on Avatar Edit Icon") }
    />
);

EditableUserAvatar.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 6 ].description
        }
    }
};

/**
 * Story to display the user avatar sizes.
 *
 * @return {React.ReactElement}
 */
export const UserAvatarSizes = (): ReactElement => (
    <>
        <UserAvatar
            spaced="right"
            size="mini"
            name="mini"
        />
        <UserAvatar
            spaced="right"
            size="little"
            name="little"
        />
        <UserAvatar
            avatarInitialsLimit={ 2 }
            spaced="right"
            size="x60"
            name="6 0"
        />
        <UserAvatar
            spaced="right"
            size="tiny"
            name="tiny"
        />
        <UserAvatar
            spaced="right"
            size="small"
            name="small"
        />
    </>
);

UserAvatarSizes.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 7 ].description
        }
    }
};

/**
 * Story to enable user to dynamically interact with the avatar component.
 *
 * @return {React.ReactElement}
 */
/* eslint-disable sort-keys */
export const UserAvatarPlayground = (): ReactElement => (
    <UserAvatar
        name={ text("User's name", "Brion Silva") }
        size={ select(
            "Size",
            {
                Mini: "mini",
                Little: "little",
                Tiny: "tiny",
                Small: "small",
                Medium: "medium",
                Large: "large",
                Big: "big",
                Huge: "huge",
                Massive: "massive"
            },
            "tiny"
        ) }
        avatarInitialsLimit={
            select("Avatar initials count", { One: 1, Two: 2 }, 1)
        }
        image={ text("Image URL", null) }
        isLoading={ boolean("Loading", false) }
        spaced={ radios("Spaced", { Right: "right", Left: "left" }, "right") }
    />
);
/* eslint-enable sort-keys */

UserAvatarPlayground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 8 ].description
        }
    }
};
