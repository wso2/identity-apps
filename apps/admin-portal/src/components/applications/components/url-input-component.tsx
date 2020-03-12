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

import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Grid, Icon, Input, Label, Popup } from "semantic-ui-react";

interface URLInputComponentInterface {
    urlState: string;
    setURLState: any;
    placeholder?: string;
    labelName: string;
    computerWidth?: any;
    validation: (value?) => boolean;
    validationErrorMsg: string;
    value?: string;
    hint?: string;
    showError?: boolean;
    setShowError?: any;
    required?: boolean;
    disabled?: boolean;
}

/**
 * Create URL addition component.
 * @param props URLInputComponentInterface.
 */
export const URLInputComponent: FunctionComponent<URLInputComponentInterface> = (props): JSX.Element => {

    const {
        showError,
        setShowError,
        urlState,
        setURLState,
        validation,
        validationErrorMsg,
        placeholder,
        labelName,
        value,
        hint,
        required,
        disabled
    } = props;

    const [changeUrl, setChangeUrl] = useState("");
    const [predictValue, setPredictValue] = useState([]);
    const [validURL, setValidURL] = useState(true);
    const [duplicateURL, setDuplicateURL] = useState(false);
    const [keepFocus, setKeepFocus] = useState(false);

    /**
     * Add URL to the URL list.
     */
    const addUrl = () => {
        const url = changeUrl;
        const urlValid = validation(url);
        setValidURL(urlValid);
        const availableURls = urlState.split(",");
        const duplicate = availableURls.includes(url);
        setDuplicateURL(duplicate);
        if (urlValid && !duplicate) {
            if (urlState === "") {
                setURLState(url);
                setChangeUrl("");
            } else {
                setURLState((url + "," + urlState));
                setChangeUrl("");
            }
        }
    };

    /**
     * Initial prediction for the URL.
     * @param changeValue input by the user.
     */
    const getPredictions = (changeValue) => {

        return [
            "https://",
            "http://"
        ].filter((item) => item.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
    };

    /**
     * Enter button option.
     * @param e keypress event.
     */
    const keyPressed = (e) => {
        const key = e.which || e.charCode || e.keyCode;
        if (key === 13) {
            e.preventDefault();
            addUrl();
        }
    };

    /**
     * Handle change event of the input.
     *
     * @param event change event.
     */
    const handleChange = (event) => {
        const changeValue = event.target.value;
        let predictions = [];
        if (changeValue.length > 0) {
            predictions = getPredictions(changeValue);
        }
        if (!validURL) {
            setValidURL(true);
        }
        setKeepFocus(true);
        setPredictValue(predictions);
        setChangeUrl(changeValue);
    };

    /**
     * Handle blur event.
     */
    const handleOnBlur = () => {
        // TODO introduce a different method to handle this
        // if (!isEmpty(changeUrl)) {
        //     addUrl();
        // }
        setKeepFocus(false);
    };

    /**
     * When the predicted element is clicked select the predict.
     * @param predict filter prediction.
     */
    const onPredictClick = (predict: string) => {
        setChangeUrl(predict);
        setPredictValue([]);
    };

    const addFromButton = (e) => {
        e.preventDefault();
        addUrl();
    };

    /**
     * Remove the URL from the listed URLS.
     * @param removeURL URL to be removed.
     */
    const removeValue = (removeURL) => {
        let urlsAfterRemoved = urlState;
        if (urlState.split(",").length > 1) {
            urlsAfterRemoved = urlsAfterRemoved.split(removeURL + ",").join("");
        } else {
            urlsAfterRemoved = "";
        }
        setURLState(urlsAfterRemoved);
    };

    useEffect(
        () => {
            setURLState(value);
        }
        , [value]);

    useEffect(
        () => {
            if (showError) {
                setValidURL(false);
                setShowError(false);
            }
        }
        , [showError]);

    return (
        <>
            <Grid.Row columns={ 1 } className={ "urlComponentLabelRow" }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    {
                        required ? (
                            <div className={ "required field" }>
                                <label>{labelName}</label>
                            </div>
                        ) : (
                                <label>{labelName}</label>
                            )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={ "urlComponentInputRow" }>
                <Grid.Column mobile={ 14 } tablet={ 14 } computer={ 8 }>
                    <Input
                        fluid
                        error={ validURL && !duplicateURL ? false : true }
                        focus={ keepFocus }
                        value={ changeUrl }
                        onKeyDown={ keyPressed }
                        onChange={ handleChange }
                        onBlur={ handleOnBlur }
                        placeholder={ placeholder }
                        action
                    >
                        <input
                            disabled={ disabled ? disabled : false }
                        />
                        <Popup
                            trigger={
                                (
                                    <Button
                                        onClick={ (e) => addFromButton(e) }
                                        icon="add"
                                        type="button"
                                        disabled={ disabled ? disabled : false }
                                    />
                                )
                            }
                            position="top center"
                            content="Add URL"
                            inverted
                        />
                    </Input>
                    {
                        !validURL &&
                        (
                            <Label basic color="red" pointing>
                                {validationErrorMsg}
                            </Label>
                        )
                    }
                    {
                        duplicateURL &&
                        (
                            <Label basic color="red" pointing>
                                This URL is already added
                            </Label>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={ "urlComponentInputRow" }>
                <Grid.Column mobile={ 14 } tablet={ 14 } computer={ 8 }>
                    {
                        (predictValue.length > 0) &&
                        predictValue.map((predict) => {
                            return (
                                <Label
                                    key={ predict }
                                    basic
                                    color="grey"
                                    onClick={ () => onPredictClick(predict) }
                                >
                                    {predict}
                                </Label>
                            );
                        })
                    }
                </Grid.Column>
            </Grid.Row>
            {urlState && urlState.split(",").map((url) => {
                if (url !== "") {
                    return (
                        <Grid.Row key={ url } className={ "urlComponentTagRow" }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Label>
                                    {url}
                                    <Icon
                                        name="delete"
                                        onClick={ () => removeValue(url) }
                                    />
                                </Label>
                            </Grid.Column>
                        </Grid.Row>
                    );
                }
            })}
            {hint && (
                <Grid.Row className={ "urlComponentTagRow" }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Hint>
                            {hint}
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            )
            }
        </>
    );
};
