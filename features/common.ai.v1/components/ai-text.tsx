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
import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { ReactComponent as AIIcon }
    from "../../../themes/wso2is/assets/images/icons/solid-icons/ai-icon.svg";
import "./ai-text.scss";

/**
 * Interface for the AI text component.
 */
interface AITextProps extends IdentifiableComponentInterface {
    children?: ReactNode;
    showSparkle?: boolean;
    iconWidth?: number;
    iconHeight?: number;
}

/**
 * AI text component.
 *
 * @param props - Props injected to the component.
 *
 * @returns AIText component.
 */
const AIText = (props: PropsWithChildren<AITextProps>): ReactElement => {

    const {
        children,
        iconHeight,
        iconWidth,
        showSparkle
    } = props;

    return (
        <>
            <span className="ai-text">
                { children }
            </span>
            {
                showSparkle && (
                    <AIIcon
                        className="ai-sparkle-icon"
                        height={ iconHeight }
                        width={ iconWidth }
                    />
                )
            }
        </>
    );
};

AIText.defaultProps = {
    iconHeight: 20,
    iconWidth: 20,
    showSparkle: true
};

export default AIText;
