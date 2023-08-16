/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
