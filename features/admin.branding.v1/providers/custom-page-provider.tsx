/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import CustomPageEditorContext from "../context/custom-page-editor-context";

/**
 * Props interface for the Portal Customization provider.
 */
export type CustomPageEditorProviderProps = PropsWithChildren;

/**
 * React context provider for the Custom Page Editor context.
 * This provider must be added at the root of the features to make the context available throughout the feature.
 *
 * @param props - Props injected to the component.
 * @returns Custom Page Editor context instance.
 */
const CustomPageEditorProvider: FunctionComponent<CustomPageEditorProviderProps> = (
    props: CustomPageEditorProviderProps
): ReactElement => {
    const { children } = props;

    const [ customLayoutMode, setCustomLayoutMode ] = useState<boolean>( false );

    return (
        <CustomPageEditorContext.Provider
            value={ {
                customLayoutMode,
                setCustomLayoutMode
            } }
        >
            { children }
        </CustomPageEditorContext.Provider>
    );
};

export default CustomPageEditorProvider;
