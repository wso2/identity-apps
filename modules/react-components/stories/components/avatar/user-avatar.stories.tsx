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
import React from "react";
import { UserAvatar } from "../../../src";
import { meta } from "./user-avatar.stories.meta";

export default {
    parameters: {
        component: UserAvatar,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/User Avatar"
};

/**
 * Story to display all the user avatar variations.
 * @return {any}
 */
export const All = () => {
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

All.story = {
    parameters: {
        docs: {
            storyDescription: meta.description,
        },
    }
};

/**
 * Story to display the default user avatar variation.
 * @return {any}
 */
export const Default = () => (
    <>
        <UserAvatar
            spaced="right"
            size="tiny"
        />
    </>
);

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description,
        },
    }
};

/**
 * Story to display the user avatar with initials.
 * @return {any}
 */
export const Initials = () => (
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

Initials.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description,
        },
    }
};

/**
 * Story to display the user avatar from image.
 * @return {any}
 */
export const Image = () => (
    <>
        <UserAvatar
            spaced="right"
            size="tiny"
            image="https://avatars3.githubusercontent.com/u/25959096?s=460&v=4"
        />
    </>
);

Image.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description,
        },
    }
};

/**
 * Story to display the user avatar with gravatar URL.
 * @return {any}
 */
export const Gravatar = () => (
    <>
        <UserAvatar
            spaced="right"
            size="tiny"
            gravatarInfoPopoverText={ (
                <div>
                    This image has been retrieved from
                    { " " }
                    <a href={ UIConstants.GRAVATAR_URL } rel="noopener noreferrer" target="_blank" >Gravatar</a>
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

Gravatar.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description,
        },
    }
};

/**
 * Story to display the user avatar loading status.
 * @return {any}
 */
export const Placeholder = () => (
    <>
        <UserAvatar
            isLoading={ true }
            spaced="right"
            size="tiny"
        />
    </>
);

Placeholder.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description,
        },
    }
};

/**
 * Story to display the editable user avatar.
 * @return {any}
 */
export const Editable = () => (
    <>
        <UserAvatar
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
            isEditable={ true }
            onEditAvatarClicked={ action("Edit avatar button clicked") }
        />
    </>
);

Editable.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description,
        },
    }
};

/**
 * Story to display the user avatar sizes.
 * @return {any}
 */
export const Sizes = () => (
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

Sizes.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 6 ].description,
        },
    }
};

/**
 * Story to enable user to dynamically interact with the avatar component.
 * @return {any}
 */
export const Playground = () => (
    <>
        <UserAvatar
            name={ text("User's name", "Brion Silva") }
            // tslint:disable:object-literal-sort-keys
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
            // tslint:enable:object-literal-sort-keys
            spaced={ radios("Spaced", { Right: "right", Left: "left" }, "right") }
        />
    </>
);

Playground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 7 ].description,
        },
    }
};
