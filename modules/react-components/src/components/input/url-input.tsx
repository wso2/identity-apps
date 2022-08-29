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
import { URLUtils } from "@wso2is/core/utils";
import React, { FunctionComponent, ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { Button, Grid, Icon, Input, Label, Popup } from "semantic-ui-react";
import { LinkButton } from "../button";
import { LabelWithPopup } from "../label";
import { Hint } from "../typography";

export interface URLInputPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    addURLTooltip?: string;
    duplicateURLErrorMessage: string;
    emptyErrorMessage?: string;
    urlState: string;
    setURLState: any;
    placeholder?: string;
    labelName: string;
    computerWidth?: number;
    validation?: (value?) => boolean;
    validationErrorMsg: string;
    value?: string;
    hint?: ReactNode;
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
     * Callback to remove the allowed origin
     */
    handleRemoveAllowedOrigin?: (url: string) => void;
    /**
     * Popup label availability
     */
    labelEnabled?: boolean;
    /**
     * Show or hide Allow button
     */
    isAllowEnabled?: boolean;
    /**
     * Product name
     */
    productName?: string;
    /**
     * Allow showing additional content
     */
    restrictSecondaryContent?: boolean;
    /**
     * Denotes whether this input component url type is
     * origin or redirect url types.
     */
    onlyOrigin?: boolean;
    /**
     * Skips URL validation.
     */
    skipValidation?: boolean;
    /**
     * Skips internal validations only.
     * Checks validity using provided validator
     */
    skipInternalValidation?: boolean;
    isCustom?: boolean;
    addOriginByDefault?: boolean;
    /**
     * Resolve i18n tag for popupHeaderPositive content
     */
    popupHeaderPositive?: string;
    /**
     * Resolve i18n tag for popupHeaderNegative content
     */
    popupHeaderNegative?: string;
    /**
     * Resolve i18n tag for popupContentPositive content
     */
    popupContentPositive?: string;
    /**
     * Resolve i18n tag for popupContentNegative content
     */
    popupContentNegative?: string;
    /**
     * Resolve i18n tag for popupDetailedContentPositive content
     */
    popupDetailedContentPositive?: string;
    /**
     * Resolve i18n tag for popupDetailedContentNegative content
     */
    popupDetailedContentNegative?: string;
    /**
     * Resolve i18n tag for insecureURLDescription content
     */
    insecureURLDescription?: string;
    /**
     * Resolve i18n tag for showLessContent content
     */
    showLessContent?: string;
    /**
     * Resolve i18n tag for showMoreContent content
     */
    showMoreContent?: string;
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
        restrictSecondaryContent,
        customLabel,
        duplicateURLErrorMessage,
        emptyErrorMessage,
        isAllowEnabled,
        allowedOrigins,
        handleAddAllowedOrigin,
        handleRemoveAllowedOrigin,
        labelEnabled,
        showError,
        setShowError,
        urlState,
        setURLState,
        validation,
        validationErrorMsg,
        placeholder,
        productName,
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
        onlyOrigin,
        skipValidation,
        skipInternalValidation,
        isCustom,
        addOriginByDefault,
        popupHeaderPositive,
        popupHeaderNegative,
        popupContentPositive,
        popupContentNegative,
        popupDetailedContentPositive,
        popupDetailedContentNegative,
        insecureURLDescription,
        showLessContent,
        showMoreContent,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ changeUrl, setChangeUrl ] = useState<string>("");
    const [ predictValue, setPredictValue ] = useState<string[]>([]);
    const [ validURL, setValidURL ] = useState<boolean>(true);
    const [ duplicateURL, setDuplicateURL ] = useState<boolean>(false);
    const [ keepFocus, setKeepFocus ] = useState<boolean>(false);
    const [ hideEntireComponent, setHideEntireComponent ] = useState<boolean>(false);
    const [ showMore, setShowMore ] = useState<boolean>(false);

    /**
     * Add URL to the URL list.
     *
     * @returns {string} URLs.
     */
    const addUrl = useCallback((): string => {

        let url: string = changeUrl;

        /**
         * If the entered URL is a invalid i.e not a standard URL input, then we won't add
         * the input to the state.
         */
        if (!(skipValidation || skipInternalValidation) && !URLUtils.isURLValid(url, true)) {
            setValidURL(false);

            return;
        }

        const urlValid = skipValidation
            ? true
            : validation(url);

        setValidURL(urlValid);

        /*
         * If the entered URL is valid and it is intended to be an origin URL,
         * and it has a trailing "/" at the end, it is sliced to get the valid origin. 
        */
        if (urlValid && onlyOrigin && url.charAt(url.length - 1) === "/") {
            url = url.slice(0, -1);
        }

        if (urlValid && (urlState === "" || urlState === undefined)) {
            setURLState(url);
            if (addOriginByDefault) {
                const originOfURL = URLUtils.urlComponents(url).origin;

                handleAddAllowedOrigin(originOfURL);
                allowedOrigins.push(originOfURL);
            }
            setChangeUrl("");

            return url;
        } else {
            const availableURls: string[] = !urlState ? [] : urlState?.split(",");
            const urls = new Set([
                ...(onlyOrigin ? (allowedOrigins ?? []) : []),
                ...(availableURls ?? [])
            ]);
            const checkDuplicateUrl = (url: string): boolean => {
                if (url.charAt(url.length-1) === "/") {
                    return urls.has(url) || urls.has(url.slice(0, -1));
                }
                else {
                    return urls.has(url) || urls.has(url + "/");
                }
            };
            const duplicate: boolean = checkDuplicateUrl(url);

            urlValid && setDuplicateURL(duplicate);

            if (urlValid && !duplicate) {
                setURLState((url + "," + urlState));
                if (addOriginByDefault) {
                    handleAddAllowedOrigin(url);
                    allowedOrigins.push(url);
                }
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
        setChangeUrl(changeValue.toString().trim());
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

        // If defined only, perform allowed origins related housekeeping tasks.
        if (!allowedOrigins) {
            return;
        }

        if (allowedOrigins.includes(removeURL)) {
            allowedOrigins.splice(allowedOrigins.indexOf(removeURL), 1);
        }
        handleRemoveAllowedOrigin(removeURL);
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
        if (urlState && urlState !== "" && !validURL) {
            setValidURL(true);
        }
    }, [ urlState ]);

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

    /**
     * Once clicked this function will immediately delegates the
     * action to the parent above this component. Calls -
     * {@link React.MouseEvent.preventDefault} to avoid accidental
     * form submission events.
     *
     * @param event {React.MouseEvent<HTMLButtonElement>}
     * @param url {string} user input
     */
    const onAllowOriginClick = (event: React.MouseEvent<HTMLButtonElement>, url: string): void => {
        event.preventDefault();
        handleAddAllowedOrigin(url);
        allowedOrigins.push(url);
    };

    const computerSize: any = (computerWidth) ? computerWidth : 8;

    const resolveCORSStatusLabel = (url: string) => {
        const { origin, href } = URLUtils.urlComponents(url);
        const positive = isOriginIsKnownAndAllowed(url);
        const isValid = (URLUtils.isURLValid(url, true) && (URLUtils.isHttpUrl(url) ||
            URLUtils.isHttpsUrl(url)));

        /**
         * TODO : React Components should not depend on the product
         * locale bundles.
         * Issue to track. {@link https://github.com/wso2/product-is/issues/10693}
         */
        return (
            (!isCustom || isValid)
                ? (
                    <LabelWithPopup
                        className="cors-details-popup"
                        trigger={ (
                            <Icon
                                className={ "p-1" }
                                name={ positive ? "check" : "exclamation triangle" }
                                color={ positive ? "green" : "grey" }
                            />
                        ) }
                        popupHeader={
                            positive ?
                                (popupHeaderPositive
                                    ? popupHeaderPositive
                                    : "CORS is Allowed for")
                                :
                                (popupHeaderNegative
                                    ? popupHeaderNegative
                                    : "CORS is not Allowed for")
                        }
                        popupSubHeader={ (
                            <React.Fragment>
                                <Icon name={ positive ? "check" : "times" } color={ positive ? "green" : "red" }/>
                                { origin && origin !== "null" ? origin : href }
                            </React.Fragment>
                        ) }
                        popupContent={ (
                            <React.Fragment>
                                {
                                    positive
                                        ? (popupContentPositive
                                            ? popupContentPositive
                                            : "The origin of this URL is allowed to make requests to " +
                                            `${productName} APIs from a browser.`)
                                        : (popupContentNegative
                                            ? popupContentNegative
                                            : "You need to enable CORS for the origin of this URL to make requests" +
                                            ` to ${productName} from a browser.`)
                                }
                                { !restrictSecondaryContent && (
                                    <>
                                        <a onClick={ () => setShowMore(!showMore) }>
                                            &nbsp;{ showMore 
                                                ? (showLessContent
                                                    ? showLessContent
                                                    : "Show less") 
                                                : (showMoreContent
                                                    ? showMoreContent
                                                    : "Show more") }
                                        </a><br/>
                                        {
                                            showMore && (
                                                <React.Fragment>
                                                    {
                                                        positive
                                                            ? (popupDetailedContentPositive
                                                                ? popupDetailedContentPositive
                                                                : "")
                                                            : (popupDetailedContentNegative
                                                                ? popupDetailedContentNegative
                                                                : "")
                                                    }
                                                    <br/>
                                                    <Trans
                                                        i18nKey={
                                                            positive ?
                                                                "console:develop.features.URLInput." +
                                                                "withLabel.positive.detailedContent.1" :
                                                                "console:develop.features.URLInput." +
                                                                "withLabel.negative.detailedContent.1"
                                                        }
                                                        tOptions={ { tenantName: tenantDomain } }
                                                    >
                                                        Therefore enabling CORS for this origin will allow you to access
                                                        Identity Server APIs from the applications registered in the
                                                        <strong>{ tenantDomain }</strong> organization.
                                                    </Trans>
                                                </React.Fragment>
                                            )
                                        }
                                    </>
                                ) }
                            </React.Fragment>
                        ) }
                        popupOptions={ { basic: true, on: "hover" } }
                        labelColor={ positive ? "green" : "red" }
                    />
                )
                : null
        );
    };

    /**
     * Resolves the error label.
     *
     * @return {React.ReactElement | React.ReactNode}
     */
    const resolveValidationLabel = (): ReactElement | ReactNode => {
        if(!validURL && !changeUrl && emptyErrorMessage) {
            return (
                <Label className="prompt" basic color="red" pointing>
                    { emptyErrorMessage }
                </Label>
            );
        }

        if (!validURL) {
            return (
                <Label basic className="prompt" color="red" pointing>
                    { validationErrorMsg }
                </Label>
            );
        }

        if (duplicateURL) {
            return (
                <Label basic className="prompt" color="red" pointing>
                    { duplicateURLErrorMessage }
                </Label>
            );
        }

        return customLabel;
    };

    /**
     * This function is a predicate that checks whether a given
     * URL is already allowed or not. It evaluates against the
     * list {@link allowedOrigins}
     *
     * In this function `origin` refers to the url containing
     * `<scheme>://<host>:<port>` you should not confuse origin
     * with host.
     *
     * Why check the scheme diff for origin?
     * {@link https://tools.ietf.org/html/rfc6454#section-3.2.1}
     * {@link https://stackoverflow.com/a/19542686}
     *
     * @param url {string} a URL i.e., https://myapp.io/x/y/z\
     * @return {boolean} origin allowed or not
     */
    const isOriginIsKnownAndAllowed = (url: string): boolean => {
        const urlComponents = URLUtils.urlComponents(url);

        if (!urlComponents) {
            return false;
        }
        // `origin` contains <scheme>://<host>:<port> (port if exists)
        const { origin: checkingOrigin } = urlComponents;
        // This is just a "make sure" operation that cleans out any attached
        // paths from the url. Also, if theres any trailing slashes it will
        // even out with the checkingOrigin vice versa. + We need it because
        // {@link Set} uses "same-value-zero equality" in has() operation.
        const normalizedOrigins = allowedOrigins?.map(
            (url) => URLUtils.urlComponents(url)?.origin
        );

        return new Set<string>(normalizedOrigins ?? []).has(checkingOrigin);
    };

    const shouldShowAllowOriginAction = (origin: string): boolean => {
        return labelEnabled && (isAllowEnabled && !isOriginIsKnownAndAllowed(origin));
    };

    /**
     * Chip widget that contains the origin or href with a
     * following remove button.
     *
     * @param url {string}
     */
    const urlTextWidget = (url: string): ReactElement => {

        const { protocol, host } = URLUtils.urlComponents(url);
        let { pathWithoutProtocol } = URLUtils.urlComponents(url);

        // `pathWithoutProtocol` is taken from the `href` attribute returned when parsed using URL constructor.
        // It always appends a `/` if the URL doesn't have it. Need to get rid of this additional `/`.
        if (url.slice(-1) !== "/") {
            pathWithoutProtocol = pathWithoutProtocol.replace(/\/$/, "");
        }

        return (
            <span>
                { (!URLUtils.isHTTPS(url) && !onlyOrigin && !isCustom) ? (
                    <Popup
                        trigger={
                            <span style={ { color: "red", textDecoration: "line-through" } }>{ protocol }</span>
                        }
                        content={ 
                            insecureURLDescription
                                ? insecureURLDescription
                                : "The entered URL is a non-TLS URL. Please proceed with caution." }
                        position="top left"
                        size="mini"
                        hoverable
                        inverted
                    />
                ) : <span>{ protocol }</span> }
                <span>://</span>
                <span className="decoded-path">
                    { onlyOrigin ? decodeURIComponent(host) : decodeURIComponent(pathWithoutProtocol) }
                </span>
            </span>
        );
    };

    /**
     * Added url remove button. In the click event it will send
     * the full {@code url} regardless of the type {@code onlyOrigin}
     *
     * @param url {string}
     */
    const urlRemoveButtonWidget = (url: string): ReactElement => {
        return (
            <Icon
                name="delete"
                onClick={ () => removeValue(url) }
                data-componentid={ `${ componentId }-${ url }-delete-button` }
                data-testid={ `${ testId }-${ url }-delete-button` }
            />
        );
    };

    const urlChipItemWidget = (url: string): ReactElement => {
        const { origin } = URLUtils.urlComponents(url);

        return (
            <Grid.Row key={ url } className={ "urlComponentTagRow" }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                    <p>
                        { /*Section that contains | https://origin X |*/ }
                        { /*Chip widget with protocol highlights*/ }
                        <Label
                            data-componentid={ `${ componentId }-${ url }` }
                            data-testid={ `${ testId }-${ url }` }
                        >
                            { urlTextWidget(url) }
                            { !readOnly && urlRemoveButtonWidget(url) }
                        </Label>

                        { /*Below is the exclamation mark that shows a popup*/ }
                        { /*when clicked on top of it.*/ }
                        &nbsp;{ labelEnabled && resolveCORSStatusLabel(url) }

                        { /*Below is the static label text that get rendered*/ }
                        { /*when the url is not allowed in cors list.*/ }
                        { shouldShowAllowOriginAction(origin) &&
                        <span className={ "grey" }>&nbsp;<em>CORS not allowed for origin of this URL.</em></span>
                        }

                        { /*Below is the `Allow` button that gets rendered when*/ }
                        { /*this url is not allowed is cors list.*/ }
                        { shouldShowAllowOriginAction(origin) && (
                            <LinkButton
                                className={ "m-1 p-1 with-no-border orange" }
                                onClick={ (e) => {
                                    onAllowOriginClick(e, origin);
                                } }
                                data-componentid={ `${ componentId }-${ url }-allow-button` }
                                data-testid={ `${ testId }-${ url }-allow-button` }
                            >
                                <span style={ { fontWeight: "bold" } }>Allow</span>
                            </LinkButton>
                        ) }
                    </p>
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        !hideEntireComponent && (
            <>
                <Grid.Row columns={ 1 } className={ "urlComponentLabelRow" }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                        {
                            required ? (
                                <div className={ "required field" }>
                                    <label>{ labelName }</label>
                                </div>
                            ) : (
                                <div className={ "field" }>
                                    <label>{ labelName }</label>
                                </div>
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
                            data-componentid={ componentId }
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
                                            data-componentid={ `${ componentId }-add-button` }
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
                        if (skipValidation || skipInternalValidation) {
                            return (
                                <Grid.Row key={ url } className={ "urlComponentTagRow" }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                                        <p>
                                            <Label
                                                data-componentid={ `${ componentId }-${ url }` }
                                                data-testid={ `${ testId }-${ url }` }
                                            >
                                                <span>{ url }</span>
                                                { !readOnly && urlRemoveButtonWidget(url) }
                                            </Label>
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                            );
                        }

                        if (URLUtils.isURLValid(url, true)) {
                            return urlChipItemWidget(url);
                        }
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
        )
    );
};

/**
 * Default props for the URL input component.
 */
URLInput.defaultProps = {
    addOriginByDefault: false,
    addURLTooltip: "Add a URL",
    allowEmptyValues: false,
    "data-componentid": "url-input",
    "data-testid": "url-input",
    duplicateURLErrorMessage: "This URL is already added. Please select a different one.",
    isAllowEnabled: true,
    isCustom: false,
    labelEnabled: false,
    onlyOrigin: false,
    restrictSecondaryContent: true,
    showPredictions: true
};
