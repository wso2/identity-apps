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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { Divider, Grid, Label, LabelProps, Popup, PopupProps } from "semantic-ui-react";

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
 * @param {ContentLoaderPropsInterface} props - Props injected to the global loader component.
 *
 * @return {React.ReactElement}
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
