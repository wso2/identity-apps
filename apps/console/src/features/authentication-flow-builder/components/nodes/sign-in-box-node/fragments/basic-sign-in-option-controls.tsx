/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { IdentifiableComponentInterface } from "@wso2is/core/src/models";
import React, { MouseEvent, PropsWithChildren, ReactElement, ReactNode, SVGProps } from "react";

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const CrossIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 0 384 512" className="cross-icon" { ...rest }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
);

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const SwitchIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 0 512 512" { ...rest }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z" />
    </svg>
);

/**
 * Proptypes for the basic sign in option controls component.
 */
export interface BasicSignInOptionControlsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback for option remove button.
     * @param event - Click event.
     */
    onOptionRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Callback for option switch button.
     * @param event - Click event.
     */
    onOptionSwitch?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Option remove tooltip content.
     */
    optionRemoveTooltipContent?: ReactNode;
    /**
     * Option switch tooltip content.
     */
    optionSwitchTooltipContent?: ReactNode;
}

/**
 * Component wrapper to inherit the basic sign in option controls.
 *
 * @param props - Props injected to the component.
 * @returns Basic sign in option controls as a React component.
 */
const BasicSignInOptionControls = (props: PropsWithChildren<BasicSignInOptionControlsPropsInterface>): ReactElement => {
    const {
        children,
        onOptionRemove,
        onOptionSwitch,
        optionSwitchTooltipContent,
        optionRemoveTooltipContent,
        ["data-componentid"]: componentId
    } = props;

    if (!onOptionRemove && !onOptionSwitch) {
        return null;
    }

    return (
        <div className="basic-sign-in-option-controls-wrapper" data-componentid={ componentId }>
            <div className="basic-sign-in-option-controls">
                { onOptionSwitch && (
                    <Tooltip title={ optionSwitchTooltipContent } data-componentid={ `${componentId}-tooltip` }>
                        <IconButton
                            size="small"
                            onClick={ onOptionSwitch }
                            className="action-button"
                            data-componentid={ `${componentId}-switch-option-button` }
                        >
                            <SwitchIcon />
                        </IconButton>
                    </Tooltip>
                ) }
                { onOptionRemove && (
                    <Tooltip title={ optionRemoveTooltipContent }>
                        <IconButton
                            size="small"
                            onClick={ onOptionRemove }
                            className="action-button"
                            data-componentid={ `${componentId}-remove-option-button` }
                        >
                            <CrossIcon />
                        </IconButton>
                    </Tooltip>
                ) }
            </div>
            <div className="basic-sign-in-option-control-fields">
                { children }
            </div>
        </div>
    );
};

/**
 * Default props for the basic sign in option controls component.
 */
BasicSignInOptionControls.defaultProps = {
    "data-componentid": "basic-sign-in-option-controls",
    optionRemoveTooltipContent: "Remove",
    optionSwitchTooltipContent: "Switch"
};

export default BasicSignInOptionControls;
