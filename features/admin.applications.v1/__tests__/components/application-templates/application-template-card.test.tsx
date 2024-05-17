/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import * as Card from "@oxygen-ui/react/Card";
import cloneDeep from "lodash-es/cloneDeep";
import React, { PropsWithChildren } from "react";
import { render, screen, waitFor } from "../../../../test-configs";
import ApplicationTemplateCard, {
    ApplicationTemplateCardPropsInterface
} from "../../../components/application-templates/application-template-card";
import {
    applicationTemplatesListMockResponse
} from "../../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationTemplateCard", () => {
    const props: ApplicationTemplateCardPropsInterface = {
        onClick: jest.fn(),
        template: cloneDeep(applicationTemplatesListMockResponse[3])
    };

    const cardComponent: jest.SpyInstance = jest.spyOn(Card, "default");

    cardComponent.mockImplementation((props: PropsWithChildren) => <div>{ props?.children }</div>);

    test("Test the rendering of the application creation template card component", async () => {
        render(
            <ApplicationTemplateCard { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByText(applicationTemplatesListMockResponse[3]?.name)).toBeInTheDocument();
        });
    });

    test("Test the 'Coming Soon' label of the application template card component", async () => {
        props.template.customAttributes = [
            {
                key: "comingSoon",
                value: "true"
            }
        ];

        render(
            <ApplicationTemplateCard { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByText("common:comingSoon")).toBeInTheDocument();
        });
    });
});
