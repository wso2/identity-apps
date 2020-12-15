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
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Grid, Icon, Input, Label, Popup } from "semantic-ui-react";
import { LabelWithPopup } from "../label";
import { Hint } from "../typography";

export interface URLInputPropsInterface extends TestableComponentInterface {
    addURLTooltip?: string;
    duplicateURLErrorMessage: string;
    urlState: string;
    setURLState: any;
    placeholder?: string;
    labelName: string;
    computerWidth?: number;
    validation: (value?) => boolean;
    validationErrorMsg: string;
    value?: string;
    hint?: string;
    showError?: boolean;
    setShowError?: any;
    required?: boolean;
    disabled?: boolean;
    hideComponent?: boolean;
    /**
     * Allows submitting empty values.
     * When this is true, the `+` button will not be disabled when the input is empty.
     */
    allowEmptyValues?: boolean;
    /**
     * Custom label to be passed from outside.
     */
    customLabel?: ReactNode;
    /**
     * Show/Hide predictions.
     */
    showPredictions?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Passes the submit function as an argument.
     */
    getSubmit?: (submitFunction: (callback: (url?: string) => void) => void) => void;
    /**
     * CORS allowed origin list for the tenant.
     */
    allowedOrigins?: string[];
    /**
     * Tenant domain
     */
    tenantDomain?: string;
    /**
     * Callback to add the allowed origin
     */
    handleAddAllowedOrigin?: (url: string) => void;
    /**
     * Popup label availability
     */
    labelEnabled?: boolean;
    /**
     * Show or hide Allow button
     */
    isAllowEnabled?: boolean;
}

/**
 * URL Input component.
 *
 * @param {URLInputPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const URLInput: FunctionComponent<URLInputPropsInterface> = (
    props: URLInputPropsInterface
): ReactElement => {

    const {
        addURLTooltip,
        allowEmptyValues,
        customLabel,
        duplicateURLErrorMessage,
        isAllowEnabled,
        allowedOrigins,
        handleAddAllowedOrigin,
        labelEnabled,
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
        disabled,
        hideComponent,
        showPredictions,
        computerWidth,
        readOnly,
        getSubmit,
        tenantDomain,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ changeUrl, setChangeUrl ] = useState<string>("");
    const [ predictValue, setPredictValue ] = useState<string[]>([]);
    const [ validURL, setValidURL ] = useState<boolean>(true);
    const [ duplicateURL, setDuplicateURL ] = useState<boolean>(false);
    const [ keepFocus, setKeepFocus ] = useState<boolean>(false);
    const [ hideEntireComponent, setHideEntireComponent ] = useState<boolean>(false);
    const [ successShowMore, setSuccessShowMore ] = useState<boolean>(false);
    const [ warningShowMore, setWarningShowMore ] = useState<boolean>(false);
    const [ allowOrigin, setAllowOrigin ] = useState<boolean>(false);

    /**
     * Add URL to the URL list.
     *
     * @returns {string} URLs.
     */
    const addUrl = useCallback((): string => {
        const url = changeUrl;
        const urlValid = validation(url);
        setValidURL(urlValid);
        if (urlValid && (urlState === "" || urlState === undefined)) {
            setURLState(url);
            setChangeUrl("");

            return url;
        } else {
            const availableURls: string[] = !urlState
                ? []
                : urlState?.split(",");

            const duplicate: boolean = availableURls?.includes(url);

            urlValid && setDuplicateURL(duplicate);

            if (urlValid && !duplicate) {
                setURLState((url + "," + urlState));
                setChangeUrl("");

                return url + "," + urlState;
            }
        }

        return;
    }, [ changeUrl, setURLState, urlState, validation ]);

    /**
     * This submits the URL and calls the callback function passing the URL as an argument.
     *
     * @param {(url: string) => void} callback A callback function that accepts the url as an optional argument.
     */
    const externalSubmit = (callback: (url?: string) => void): void => {
        if (getChangeUrl()) {
            const url = addUrl();
            if (url) {
                callback(url);
            }
        } else {
            callback();
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

    const addFormButton = (e) => {
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
            const urls: string[] = urlsAfterRemoved.split(",");
            const removeIndex = urls.findIndex((url) => url === removeURL);
            urls.splice(removeIndex, 1);
            urlsAfterRemoved = urls.join(",");
        } else {
            urlsAfterRemoved = "";
        }
        setURLState(urlsAfterRemoved);
    };

    /**
     * Returns the changeUrl value.
     *
     * @returns {string} Change URL.
     */
    const getChangeUrl = useCallback((): string => {
        return changeUrl;
    }, [ changeUrl ]);

    /**
     * Calls the prop method by passing the `addUrl` and `getChangeUrl` methods as arguments.
     */
    useEffect(() => {
        if (getSubmit) {
            getSubmit(externalSubmit);
        }
    }, [ getSubmit, addUrl, getChangeUrl ]);

    useEffect(() => {
        setURLState(value);
    }, [ value ]);

    useEffect(() => {
        if (showError) {
            setValidURL(false);
            setShowError(false);
        }
    }, [ showError ]);

    useEffect(() => {
        if (hideComponent) {
            setHideEntireComponent(hideComponent);
        }
    }, [ hideComponent ]);

    const handleAllowOrigin = (url: string): void => {
        handleAddAllowedOrigin(url);
        setAllowOrigin(true);
    };

    const computerSize: any = (computerWidth) ? computerWidth : 8;

    const resolveCORSStatusLabel = (url: string) => {
        const splitURL = url.split("/");
        const origin = splitURL[0] + "//" + splitURL[2];

        /**
         * TODO : React Components should not depend on the product 
         * locale bundles.
         * Issue to track. {@link https://github.com/wso2/product-is/issues/10693}
         */
        if (allowedOrigins?.includes(origin) || allowOrigin) {
            return (
                <LabelWithPopup
                    className="cors-details-popup"
                    popupHeader={ t("console:develop.features.URLInput.withLabel.positive.header") }
                    popupSubHeader={
                        <>
                            <Icon name="building outline"/>
                            { tenantDomain }
                        </>
                    }
                    popupContent={
                        <>
                            { t("console:develop.features.URLInput.withLabel.positive.content") }
                            <a onClick={ () => setSuccessShowMore(!successShowMore) }>
                                {
                                    successShowMore
                                        ? <> { t("common:showLess") }</>
                                        : <> { t("common:showMore") }</>
                                }
                            </a><br/>
                            {
                                successShowMore && (
                                    <>
                                        <br/>
                                        { t("console:develop.features.URLInput.withLabel.positive.detailedContent.0") }
                                        <br/>
                                        <Trans
                                            i18nKey={
                                                "console:develop.features.URLInput.withLabel.positive.detailedContent.1"
                                            }
                                            tOptions={ { tenantName: tenantDomain } }
                                        >
                                            Therefore enabling CORS for this origin will allow you to access
                                            Identity Server APIs from the applications registered in the
                                            <strong>{ tenantDomain }</strong> tenant domain.
                                        </Trans>
                                    </>
                                )
                            }
                        </>
                    }
                    popupFooterLeftContent={
                        <>
                            <Icon name="check" color="green"/>
                            { origin }
                        </>
                    }
                    popupOptions={ {
                        basic: true,
                        on: "click"
                    } }
                    labelColor="green"
                />
            );
        } else {
            return (
                <LabelWithPopup
                    className="cors-details-popup"
                    popupHeader={ t("console:develop.features.URLInput.withLabel.negative.header") }
                    popupSubHeader={
                        <>
                            <Icon name="building outline"/>
                            { tenantDomain }
                        </>
                    }
                    popupContent={
                        <>
                            { t("console:develop.features.URLInput.withLabel.negative.content") }
                            <a onClick={ () => setWarningShowMore(!warningShowMore) }>
                                {
                                    warningShowMore
                                        ? <> { t("common:showLess") }</>
                                        : <> { t("common:showMore") }</>
                                }
                            </a><br/>
                            {
                                warningShowMore && (
                                    <>
                                        <br/>
                                        { t("console:develop.features.URLInput.withLabel.negative.detailedContent.0") }
                                        <br/>
                                        <Trans
                                            i18nKey={
                                                "console:develop.features.URLInput.withLabel.negative.detailedContent.1"
                                            }
                                            tOptions={ { tenantName: tenantDomain } }
                                        >
                                            Therefore enabling CORS for this origin will allow you to access
                                            Identity Server APIs from the applications registered in the
                                            <strong>{ tenantDomain }</strong> tenant domain.
                                        </Trans>
                                    </>
                                )
                            }
                        </>
                    }
                    popupFooterRightActions={
                        isAllowEnabled && (
                            <Button
                                onClick={ () => handleAllowOrigin(origin) }
                                basic
                                color="orange"
                                floated="right"
                            >
                                { t("console:develop.features.URLInput.withLabel.negative.leftAction") }
                            </Button>
                        )
                    }
                    popupFooterLeftContent={
                        <>
                            <Icon name="times" color="red"/>
                            { origin }
                        </>
                    }
                    popupOptions={ {
                        basic: true,
                        on: "click"
                    } }
                    labelColor="red"
                />
            );
        }
    };

    /**
     * Resolves the error label.
     *
     * @return {React.ReactElement | React.ReactNode}
     */
    const resolveValidationLabel = (): ReactElement | ReactNode => {
        if (!validURL) {
            return (
                <Label basic color="red" pointing>
                    { validationErrorMsg }
                </Label>
            );
        }

        if (duplicateURL) {
            return (
                <Label basic color="red" pointing>
                    { duplicateURLErrorMessage }
                </Label>
            );
        }

        return customLabel;
    };

    return (!hideEntireComponent &&
        <>
            <Grid.Row columns={ 1 } className={ "urlComponentLabelRow" }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                    {
                        required ? (
                            <div className={ "required field" }>
                                <label>{ labelName }</label>
                            </div>
                        ) : (
                                <label>{ labelName }</label>
                            )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={ "urlComponentInputRow" }>
                <Grid.Column mobile={ 14 } tablet={ 14 } computer={ computerSize }>
                    <Input
                        fluid
                        error={ !(validURL && !duplicateURL) }
                        focus={ keepFocus }
                        value={ changeUrl }
                        onKeyDown={ keyPressed }
                        onChange={ handleChange }
                        onBlur={ handleOnBlur }
                        placeholder={ placeholder }
                        action
                        readOnly={ readOnly }
                        data-testid={ testId }
                    >
                        <input
                            disabled={ disabled ? disabled : false }
                        />
                        <Popup
                            disabled={ readOnly }
                            trigger={
                                (
                                    <Button
                                        onClick={ (e) => addFormButton(e) }
                                        icon="add"
                                        type="button"
                                        disabled={ readOnly || disabled || (!allowEmptyValues && !changeUrl) }
                                        data-testid={ `${ testId }-add-button` }
                                    />
                                )
                            }
                            position="top center"
                            content={ addURLTooltip }
                            inverted
                        />
                    </Input>
                    { resolveValidationLabel() }
                </Grid.Column>
            </Grid.Row>
            {
                showPredictions && (
                    <Grid.Row className={ "urlComponentInputRow" }>
                        <Grid.Column mobile={ 14 } tablet={ 14 } computer={ computerSize }>
                            {
                                (predictValue.length > 0) && predictValue.map((predict) => {
                                    return (
                                        <Label
                                            key={ predict }
                                            basic
                                            color="grey"
                                            onClick={ () => onPredictClick(predict) }
                                        >
                                            { predict }
                                        </Label>
                                    );
                                })
                            }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            { urlState && urlState.split(",").map((url) => {
                if (url !== "") {
                    return (
                        <Grid.Row key={ url } className={ "urlComponentTagRow" }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                                <Label data-testid={ `${ testId }-${ url }` }>
                                    {
                                        labelEnabled && (
                                            resolveCORSStatusLabel(url)
                                        )
                                    }
                                    { url }
                                    {
                                        !readOnly && (
                                            <Icon
                                                name="delete"
                                                onClick={ () => removeValue(url) }
                                                data-testid={ `${ testId }-${ url }-delete-button` }
                                            />
                                        )
                                    }
                                </Label>
                            </Grid.Column>
                        </Grid.Row>
                    );
                }
            }) }
            { hint && (
                <Grid.Row className={ "urlComponentTagRow" }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                        <Hint>
                            { hint }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            ) }
        </>
    );
};

/**
 * Default props for the URL input component.
 */
URLInput.defaultProps = {
    addURLTooltip: "Add a URL",
    allowEmptyValues: false,
    "data-testid": "url-input",
    duplicateURLErrorMessage: "This URL is already added. Please select a different one.",
    isAllowEnabled: true,
    labelEnabled: false,
    showPredictions: true
};
