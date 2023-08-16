/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { Icon } from "semantic-ui-react";
import { meta } from "./step.stories.meta";
import { Steps } from "../../index";

export default {
    parameters: {
        component: Steps,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Steps"
};

/**
 * Story to display steps.
 *
 * @returns DefaultSteps React Component
 */
export const DefaultSteps = (): ReactElement => (
    <Steps.Group header="Fill the basic information about your application." current={ 1 }>
        <Steps.Step icon={ <Icon name="document" /> } title="General settings" />
        <Steps.Step icon={ <Icon name="wheel" /> } title="Protocol Selection" />
        <Steps.Step icon={ <Icon name="gears" /> } title="Protocol Configuration" />
    </Steps.Group>
);

DefaultSteps.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
