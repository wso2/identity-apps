/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Button, Checkbox, CheckboxProps, Header, Popup, Responsive, Segment } from "semantic-ui-react";

/**
 * Danger zone component Prop types.
 */
export interface DangerZoneProps extends TestableComponentInterface, IdentifiableComponentInterface {
    /**
     * Title for the danger zone action.
     */
    actionTitle: string;
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
     * @param {React.SyntheticEvent<HTMLButtonElement>} e - Click event.
     */
    onActionClick: (e: SyntheticEvent<HTMLButtonElement>) => void;
    /**
     * Button disable state.
     */
    isButtonDisabled?: boolean;
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
     * @param {CheckboxProps} data - Checkbox data.
     */
    onChange: (event, data: CheckboxProps) => void;
    /**
     * ID of the toggle.
     */
    id?: string;
}

/**
 * Danger zone component.
 *
 * @param {DangerZoneProps} props - Props injected to the danger zone component.
 *
 * @return {React.ReactElement}
 */
export const DangerZone: FunctionComponent<DangerZoneProps> = (
    props: DangerZoneProps
): ReactElement => {

    const {
        actionTitle,
        header,
        subheader,
        onActionClick,
        toggle,
        isButtonDisabled,
        buttonDisableHint,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <Segment data-testid={ testId } data-componentid={ componentId } className="danger-zone" padded clearing>
            <Header
                as="h5"
                color="red"
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
            {
                toggle
                    ? (
                        <Checkbox
                            toggle
                            id={ toggle?.id }
                            onChange={ toggle?.onChange }
                            checked={ toggle?.checked }
                            className="danger-zone toggle-switch"
                            data-componentid={ `${ componentId }-toggle` }
                            data-testid={ `${ testId }-toggle` }
                        />
                    )
                    : (
                        <Popup
                            trigger={ (
                                <div
                                    className={
                                        (window.innerWidth <= Responsive.onlyTablet.maxWidth)
                                            ? "mb-1x mt-1x inline-button button-width"
                                            : "inline-button"
                                    }
                                >
                                    <Button
                                        data-componentid={ componentId + "-delete-button" }
                                        data-testid={ testId + "-delete-button" }
                                        fluid={ window.innerWidth <= Responsive.onlyTablet.maxWidth }
                                        negative
                                        onClick={ onActionClick }
                                        disabled={ isButtonDisabled }
                                    >
                                        { actionTitle }
                                    </Button>
                                </div>
                            ) }
                            content={ buttonDisableHint }
                            position={
                                (window.innerWidth <= Responsive.onlyTablet.maxWidth)
                                    ? "top center"
                                    : "top right"
                            }
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
