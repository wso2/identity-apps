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

import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import { getHelpPanelActionIcons } from "../../configs/ui";

import { ComponentsPropsInterface } from "./modal-with-side-panel-types";

/**
 * The side panel of the modal.
 *
 * @param {PropsWithChildren<ComponentsPropsInterface>} props - Props to be injected into the component.
 * @return {ReactElement} The side panel.
 */
export const ModalWithSidePanelSidePanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    const [ sidePanelOpen, setSidePanelOpen ] = useState<boolean>(true);

    return (
        <div className={ `side-panel ${ props?.className ?? "" } ${ !sidePanelOpen ? "closed" : "" }` }>
            <div className={ `side-panel-content ${ sidePanelOpen ? "visible" : "hidden" }` }>
                { props?.children }
            </div>
            <div className={ `toggle-button-column ${ !sidePanelOpen ? "closed" : "" }` }>
                <div
                    className="toggle-button"
                    onClick={ () => {
                        setSidePanelOpen(!sidePanelOpen);
                    } }
                >
                    <GenericIcon
                        hoverable={ true }
                        hoverType="circular"
                        background={ false }
                        transparent={ true }
                        link={ true }
                        icon={
                            sidePanelOpen
                                ? getHelpPanelActionIcons().caretLeft
                                : getHelpPanelActionIcons().caretRight
                        }
                    />
                </div>
            </div>
        </div>
    );
};
