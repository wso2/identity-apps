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
