/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid, GridColumn, Icon, Input, InputOnChangeData } from "semantic-ui-react";
import { Popup } from "../popup";

export interface InlineEditInputPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    text: string;
    validation?: string;
    errorHandler?: (status: boolean) => void;
    textPrefix?: string;
    textPostfix?: string;
    inputPlaceholderText?: string;
    onChangesSaved: (changedValue: string) => void;
    onEdit?: (editMode: boolean) => void;
    maxLength?: number;
}

/**
 * Inline edit input field component.
 *
 * @param props - props required for the inline edit component.
 * @returns inline edit input component
 */
export const InlineEditInput: FunctionComponent<InlineEditInputPropsInterface> = (
    props: InlineEditInputPropsInterface
): ReactElement => {

    const {
        errorHandler,
        text,
        textPrefix,
        textPostfix,
        inputPlaceholderText,
        validation,
        onChangesSaved,
        onEdit,
        maxLength,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ prevText, setPrevText ] = useState<string>(text);
    const [ textValue, setTextValue ] = useState<string>(text);
    const [ regExValidation, setRegExValidation ] = useState<RegExp>();
    const [ fieldError, setFieldError ] = useState<boolean>(false);

    useEffect(() => {
        setTextValue(text);
        setPrevText(text);
    }, [ text ]);

    useEffect(() => {
        if ( validation ) {
            const regEx = new RegExp(validation);

            setRegExValidation(regEx);
        }
    }, [ validation ]);

    return (
        editMode
            ? (
                <Grid verticalAlign="middle">
                    <Grid.Row columns={ 2 }>
                        <GridColumn width={ 12 }>
                            <Input
                                fluid
                                size="mini"
                                placeholder={ inputPlaceholderText }
                                value={ textValue }
                                error={ fieldError }
                                maxLength={ maxLength }
                                onChange={ (
                                    event: React.ChangeEvent<HTMLInputElement>,
                                    data: InputOnChangeData ) => {
                                    setTextValue(data.value.trim());
                                } }
                                data-componentid={ `${ componentId }-input` }
                                data-testid={ `${ testId }-input` }
                            />
                        </GridColumn>
                        <Grid.Column width={ 4 }>
                            <Popup
                                trigger={ (
                                    <Icon
                                        className="mr-3"
                                        name="check"
                                        link
                                        onClick={ () => {
                                            if (textValue === ""
                                                || ( validation && !textValue.match(regExValidation) )) {

                                                setFieldError(true);

                                                if (errorHandler) {
                                                    errorHandler(true);
                                                }

                                                return;
                                            }

                                            onEdit(false);
                                            setEditMode(false);
                                            onChangesSaved(textValue);
                                        } }
                                    />
                                ) }
                                content={ "Save Changes" }
                                position="top center"
                                inverted
                            />
                            <Popup
                                trigger={ (
                                    <Icon
                                        name="cancel"
                                        link
                                        onClick={ () => {
                                            setEditMode(false);
                                            onEdit(false);
                                            errorHandler(false);
                                            setTextValue(prevText);
                                        } }
                                    />
                                ) }
                                content={ "Cancel Changes" }
                                position="top center"
                                inverted
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
            : (
                <Grid columns="equal" verticalAlign="middle">
                    <Grid.Row>
                        <GridColumn width="16">
                            {
                                text && text !== "" && (
                                    <>
                                        <span className="mr-3">
                                            { textPrefix && textPrefix }
                                            <b>{ text && text }</b>
                                            { textPostfix && textPostfix }
                                        </span>
                                        <Popup
                                            trigger={ (
                                                <Icon
                                                    className="mr-3"
                                                    name="pencil"
                                                    link
                                                    onClick={ () => {
                                                        setEditMode(true);
                                                        onEdit(true);
                                                    } }
                                                />
                                            ) }
                                            content={ "Edit changes" }
                                            position="top center"
                                            inverted
                                        />
                                    </>
                                )
                            }
                        </GridColumn>
                    </Grid.Row>
                </Grid>
            )
    );
};

/**
 * Default props for the component.
 */
InlineEditInput.defaultProps = {
    "data-componentid": "inline-edit-field"
};
