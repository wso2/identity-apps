/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
        header,
        subheader,
        onActionClick,
        toggle,
        isButtonDisabled,
        buttonDisableHint,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const { isMobileViewport } = useMediaContext();

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
                                        isMobileViewport
                                            ? "mb-1x mt-1x inline-button button-width"
                                            : "inline-button"
                                    }
                                >
                                    <Button
                                        data-componentid={ componentId + "-delete-button" }
                                        data-testid={ testId + "-delete-button" }
                                        fluid={ isMobileViewport }
                                        negative
                                        onClick={ onActionClick }
                                        disabled={ isButtonDisabled }
                                    >
                                        { actionTitle }
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
