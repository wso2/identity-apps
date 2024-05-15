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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren } from "react";
import useApplicationTemplates from "../../hooks/use-application-templates";
import { CategorizedApplicationTemplatesInterface } from "../../models/application-templates";

/**
 * Props interface for the `MockApplicationTemplatesComponent`.
 */
export interface MockApplicationTemplatesComponentProps extends IdentifiableComponentInterface {};

/**
 * Mock application templates using components.
 *
 * @param props - Props for the `MockApplicationTemplatesComponent`.
 * @returns MockApplicationTemplatesComponent
 */
const MockApplicationTemplatesComponent: FunctionComponent<PropsWithChildren<MockApplicationTemplatesComponentProps>> = (
    props: PropsWithChildren<MockApplicationTemplatesComponentProps>
) => {
    const {
        "data-componentid": componentId
    } = props;

    const {
        categorizedTemplates,
        isApplicationTemplatesRequestLoading,
        templates
    } = useApplicationTemplates();

    return (
        <>
            {
                isApplicationTemplatesRequestLoading !== undefined
                    ? <div data-componentid={ `${componentId}-loading-status` }></div>
                    : null
            }
            {
                categorizedTemplates.map((template: CategorizedApplicationTemplatesInterface) => (
                    <div data-componentid={ `${componentId}-${template?.id}` }>
                        { `Number of templates-${template?.templates?.length}` }
                    </div>
                ))
            }
            {
                <div data-componentid={ `${componentId}-templates` }>{ `Number of templates-${templates?.length}` }</div>
            }
        </>
    )
}

MockApplicationTemplatesComponent.defaultProps = {
    "data-componentid": "mock-application-templates-component"
}

export default MockApplicationTemplatesComponent;
