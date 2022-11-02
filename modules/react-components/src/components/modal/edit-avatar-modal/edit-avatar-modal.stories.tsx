/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import React, { ReactElement, useState } from "react";
import { getSampleProfileInfo } from "../../../storybook-helpers/meta";
import { PrimaryButton } from "../../button";
import { meta } from "../confirmation-modal/confirmation-modal.stories.meta";
import { EditAvatarModal } from "../edit-avatar-modal";

export default {
    parameters: {
        component: EditAvatarModal,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Edit Avatar Modal"
};

/**
 * Story to display the modal basic usage.
 *
 * @returns the EditAvartal modal with edit button.
 */
export const BasicUsage = (): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(false);

    const handleShowModalButtonOnClick = (): void => {
        setOpen(true);
    };

    return (
        <>
            <PrimaryButton onClick={ (): void => handleShowModalButtonOnClick() }>
                Open
            </PrimaryButton>

            <EditAvatarModal
                open={ open }
                name={ resolveUserDisplayName(getSampleProfileInfo()) }
                emails={ getSampleProfileInfo().emails }
                onClose={ () => setOpen(false) }
                onSecondaryActionClick={ () => setOpen(false) }
                heading="Update profile picture"
            />
        </>
    );
};

BasicUsage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
