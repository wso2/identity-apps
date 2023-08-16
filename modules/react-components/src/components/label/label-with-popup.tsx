/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { Divider, Grid, Label, LabelProps, PopupProps } from "semantic-ui-react";
import { Popup } from "../popup";

export interface LabelWithPopupPropsInterface extends IdentifiableComponentInterface, LabelProps {
    /**
     * Header of the popup
     */
    popupHeader?: string;
    /**
     * Sub heading of the popup
     */
    popupSubHeader?: ReactNode | string;
    /**
     * Popup content
     */
    popupContent?: ReactNode | string;
    /**
     * Popup footer right actions
     */
    popupFooterRightActions?: any;
    /**
     * Popup footer left actions
     */
    popupFooterLeftActions?: any;
    /**
     * Popup footer left side content
     */
    popupFooterLeftContent?: ReactNode | string;
    /**
     * Other props for the popup.
     */
    popupOptions?: PopupProps;
    /**
     * Color of the circular label.
     */
    labelColor: LabelProps["color"];
    /**
     * A trigger element for the popup widget. If not provided
     * then a default trigger (a label) will be applied.
     */
    trigger?: ReactElement;
}

/**
 * Content loader component.
 *
 * @param props - Props injected to the global loader component.
 *
 * @returns the content loader component
 */
export const LabelWithPopup: FunctionComponent<LabelWithPopupPropsInterface> = (
    props: LabelWithPopupPropsInterface
): ReactElement => {

    const {
        className,
        popupHeader,
        popupSubHeader,
        popupContent,
        popupFooterRightActions,
        popupFooterLeftContent,
        popupOptions,
        labelColor,
        trigger,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames("label-with-popup", className);

    return (
        <Popup
            wide
            size="small"
            className={ classes }
            position="right center"
            trigger={
                trigger ?? (
                    <Label
                        circular
                        size="mini"
                        className="micro spaced-right status-label-with-popup"
                        color={ labelColor }
                        { ...rest }
                    />
                )
            }
            on="hover"
            data-componentid={ componentId }
            { ...popupOptions }
        >
            <Popup.Content data-componentid={ `${ componentId }-content-container` }>
                <Grid>
                    {
                        (popupHeader || popupSubHeader) && (
                            <Grid.Row>
                                <Grid.Column>
                                    {
                                        popupHeader && (
                                            <Popup.Header data-componentid={ `${ componentId }-header` }>
                                                <strong>{ popupHeader }</strong>
                                            </Popup.Header>
                                        )
                                    }
                                    { popupSubHeader }
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    {
                        popupContent && (
                            <Grid.Row>
                                <Grid.Column data-componentid={ `${ componentId }-content` }>
                                    { popupContent }
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    {
                        (popupFooterLeftContent || popupFooterRightActions) && (
                            <>
                                <Divider/>
                                <Grid.Row>
                                    {
                                        popupFooterLeftContent && (
                                            <Grid.Column
                                                verticalAlign="middle"
                                                floated="left"
                                                width={ 10 }
                                                data-componentid={ `${ componentId }-footer-left-content` }
                                            >
                                                { popupFooterLeftContent }
                                            </Grid.Column>
                                        )
                                    }
                                    {
                                        popupFooterRightActions && (
                                            <Grid.Column
                                                verticalAlign="middle"
                                                floated="right"
                                                width={ 6 }
                                                data-componentid={ `${ componentId }-footer-right-actions` }
                                            >
                                                { popupFooterRightActions }
                                            </Grid.Column>
                                        )
                                    }
                                </Grid.Row>
                            </>
                        )
                    }
                </Grid>
            </Popup.Content>
        </Popup>
    );
};

/**
 * Default proptypes for component.
 */
LabelWithPopup.defaultProps = {
    "data-componentid": "label-with-popup",
    "data-testid": "label-with-popup"
};
