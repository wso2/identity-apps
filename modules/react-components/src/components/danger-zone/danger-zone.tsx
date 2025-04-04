/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { Button, Checkbox, CheckboxProps, Header, Segment } from "semantic-ui-react";
import { useMediaContext } from "../media";
import { Popup } from "../popup";

/**
 * Danger zone component Prop types.
 */
export interface DangerZoneProps extends TestableComponentInterface, IdentifiableComponentInterface {
    /**
     * Title for the danger zone action.
     */
    actionTitle: string;
    /**
     * Button text for the danger zone.
     */
    buttonText?: string;
    /**
     * Danger zone style class name.
     */
    className?: string;
    /**
     * Heading for the danger zone.
     */
    header: string;
    /**
     * Sub heading for the danger zone.
     */
    subheader: string;
    /**
     * Use toggle button for the danger zone.
     */
    toggle?: DangerZoneToggleProps;
    /**
     * OnClick callback for the danger zone action.
     * @param e - Click event.
     */
    onActionClick: (e: SyntheticEvent<HTMLButtonElement>) => void;
    /**
     * Button disable state.
     */
    isButtonDisabled?: boolean;
    /**
     * Button loading state.
     */
    isButtonLoading?: boolean;
    /**
     * Button disable hint.
     */
    buttonDisableHint?: string;
}

/**
 * Danger zone toggle Prop types.
 */
export interface DangerZoneToggleProps {
    /**
     * Checked state.
     */
    checked: boolean;
    /**
     * Toggle onchange callback.
     * @param event - Toggle event.
     * @param data - Checkbox data.
     */
    onChange: (event, data: CheckboxProps) => void;
    /**
     * ID of the toggle.
     */
    id?: string;
    /**
     * Disable state of the toggle.
     */
    disabled?: boolean;
    /**
     * Disable hint for the toggle.
     */
    disableHint?: string;
}

/**
 * Danger zone component.
 *
 * @param props - Props injected to the danger zone component.
 *
 * @returns Danger Zone component.
 */
export const DangerZone: FunctionComponent<DangerZoneProps> = (
    props: DangerZoneProps
): ReactElement => {

    const {
        actionTitle,
        buttonText,
        className,
        header,
        subheader,
        onActionClick,
        toggle,
        isButtonDisabled,
        isButtonLoading,
        buttonDisableHint,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;
    const { isMobileViewport } = useMediaContext();
    const defaultClassName = className ?? "danger-zone";

    return (
        <Segment data-testid={ testId } data-componentid={ componentId } className={ defaultClassName } padded clearing>
            <div className="header-wrapper">
                <Header
                    as="h5"
                    className="header"
                    floated="left"
                    data-componentid={ `${ componentId }-header` }
                    data-testid={ `${ testId }-header` }
                >
                    { header }
                    <Header.Subheader
                        className="sub-header"
                        data-componentid={ `${ componentId }-sub-header` }
                        data-testid={ `${ testId }-sub-header` }
                    >
                        { subheader }
                    </Header.Subheader>
                </Header>
            </div>
            {
                toggle
                    ? (
                        <Popup
                            trigger={ (
                                <Checkbox
                                    toggle
                                    id={ toggle?.id }
                                    onChange={ toggle?.onChange }
                                    checked={ toggle?.checked }
                                    className={ defaultClassName + " toggle-switch" }
                                    data-componentid={ `${ componentId }-toggle` }
                                    data-testid={ `${ testId }-toggle` }
                                    disabled={ toggle?.disabled }
                                />
                            ) }
                            content={ toggle?.disableHint }
                            position={ isMobileViewport ? "top center" : "top right" }
                            size="mini"
                            wide
                            disabled={ !toggle?.disabled || !toggle?.disableHint }
                        />
                    )
                    : (
                        <Popup
                            trigger={ (
                                <div
                                    className={
                                        isMobileViewport
                                            ? "mb-1x mt-1x inline-button button-width"
                                            : "inline-button"
                                    }
                                >
                                    <Button
                                        data-componentid={ componentId + "-delete-button" }
                                        data-testid={ testId + "-delete-button" }
                                        fluid={ isMobileViewport }
                                        negative = { className ? false: true }
                                        primary = { !className ? false: true }
                                        onClick={ onActionClick }
                                        disabled={ isButtonDisabled }
                                        loading={ isButtonLoading }
                                        basic={ className ? true: false }
                                    >
                                        { buttonText ?? actionTitle }
                                    </Button>
                                </div>
                            ) }
                            content={ buttonDisableHint }
                            position={ isMobileViewport ? "top center" : "top right" }
                            size="mini"
                            wide
                            disabled={ !isButtonDisabled || !buttonDisableHint }
                        />
                    )
            }
        </Segment>
    );
};

/**
 * Default props for the danger zone component.
 */
DangerZone.defaultProps = {
    "data-componentid": "danger-zone",
    "data-testid": "danger-zone"
};
