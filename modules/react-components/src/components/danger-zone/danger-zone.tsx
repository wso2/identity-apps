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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { Button, Checkbox, CheckboxProps, Header, Responsive, Segment } from "semantic-ui-react";

/**
 * Danger zone component Prop types.
 */
export interface DangerZoneProps extends TestableComponentInterface {
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
        [ "data-testid" ]: testId
    } = props;

    return (
        <Segment data-testid={ testId } className="danger-zone" padded clearing>
            <Header as="h5" color="red" floated="left" data-testid={ `${ testId }-header` }>
                { header }
                <Header.Subheader className="sub-header" data-testid={ `${ testId }-sub-header` }>
                    { subheader }
                </Header.Subheader>
            </Header>
            {
                toggle ?
                    <Checkbox
                        toggle
                        id={ toggle?.id }
                        onChange={ toggle?.onChange }
                        checked={ toggle?.checked }
                        className="danger-zone toggle-switch"
                        data-testid={ `${ testId }-toggle` }
                    />
                    :
                    <Button
                        data-testid={ testId + "-delete-button" }
                        fluid={ window.innerWidth <= Responsive.onlyTablet.maxWidth }
                        negative
                        className={
                            (window.innerWidth <= Responsive.onlyTablet.maxWidth)
                                ? "mb-1x mt-1x"
                                : ""
                        }
                        floated="right"
                        onClick={ onActionClick }
                    >
                        { actionTitle }
                    </Button>
            }
        </Segment>
    );
};

/**
 * Default props for the danger zone component.
 */
DangerZone.defaultProps = {
    "data-testid": "danger-zone"
};
