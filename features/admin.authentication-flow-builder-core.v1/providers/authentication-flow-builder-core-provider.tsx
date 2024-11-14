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

import Avatar from "@oxygen-ui/react/Avatar";
import Typography from "@oxygen-ui/react/Typography";
import Stack from "@oxygen-ui/react/Stack";
import capitalize from "lodash-es/capitalize";
import React, { PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import AuthenticationFlowBuilderCoreContext from "../context/authentication-flow-builder-core-context";
import { Base } from "../models/base";

/**
 * Props interface of {@link AuthenticationFlowBuilderCoreProvider}
 */
export type AuthenticationFlowBuilderProviderProps = unknown;

/**
 * This component provides authentication flow builder core related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The AuthenticationFlowBuilderCoreProvider component.
 */
const AuthenticationFlowBuilderCoreProvider = ({
    children
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
    const [ isElementPanelOpen, setIsElementPanelOpen ] = useState<boolean>(true);
    const [ isElementPropertiesPanelOpen, setIsOpenElementPropertiesPanel ] = useState<boolean>(false);
    const [ elementPropertiesPanelHeading, setElementPropertiesPanelHeading ] = useState<ReactNode>(null);

    const onElementDropOnCanvas = (element: Base): void  => {
        // TODO: Internationalize this string and get from a mapping.
        setElementPropertiesPanelHeading(
            <Stack>
                <Typography variant="h6">{ capitalize(element.category) } Properties</Typography>
                <Stack direction="row" className="sub-title" gap={ 1 } alignItems="center">
                    <Avatar
                        src={ element?.display?.image }
                        variant="square"
                    />
                    <Typography variant="body2">{ capitalize(element.type) }</Typography>
                </Stack>
            </Stack>
        );
        setIsOpenElementPropertiesPanel(true);
    };

    return (
        <AuthenticationFlowBuilderCoreContext.Provider
            value={ {
                elementPropertiesPanelHeading,
                isElementPanelOpen,
                isElementPropertiesPanelOpen,
                onElementDropOnCanvas,
                setElementPropertiesPanelHeading,
                setIsElementPanelOpen,
                setIsOpenElementPropertiesPanel
            } }
        >
            { children }
        </AuthenticationFlowBuilderCoreContext.Provider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
