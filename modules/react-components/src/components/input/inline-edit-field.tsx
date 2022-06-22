/**
* Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid, GridColumn, Icon, Input, InputOnChangeData, Popup } from "semantic-ui-react";

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
 * @param {InlineEditInputPropsInterface} props - props required for the inline edit component.
 * @return {React.ReactElement}
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
