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

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import React, { ReactElement, useState } from "react";
import { meta } from "./confirmation-modal.stories.meta";
import { EditAvatarModal, PrimaryButton } from "../../../src";
import { getSampleProfileInfo } from "../../meta";

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
 * @return {React.ReactElement}
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
