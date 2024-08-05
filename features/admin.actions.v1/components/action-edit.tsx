/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { SelectChangeEvent } from "@mui/material";
import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, SelectFieldAdapter, TextFieldAdapter } from "@wso2is/form";
import { EmphasizedSegment, Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { ActionsConstants } from "../constants";
import {
    ActionConfigFormPropertyInterface,
    AuthTypeDropdownOption,
    AuthenticationType
} from "../models";
import "./action-edit.scss";

/**
 * Prop types for the action edit component.
 */
interface ActionEditInterface extends IdentifiableComponentInterface {
    /**
     * Action's initial values.
     */
    initialValues?: ActionConfigFormPropertyInterface;
    /**
     * Callback for form submit.
     * @param any - values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Action Type of the Action.
     */
    actionType: string;
    /**
     * Specifies action creation state.
     */
    isCreating?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Specifies the Authentication Type from the dropdown.
     */
    setAuthType?: (authType: AuthenticationType) => void;
    /**
     * Specifies the Cancelling of Authentication Update.
     */
    setAuthCancel?: (isAuthCancel: boolean) => void;
    /**
     * Whether the action authentication is updating.
     */
    setIsAuthUpdating?: (isAuthUpdating: boolean) => void;
}

export const ActionEdit: FunctionComponent<ActionEditInterface> = ({
    initialValues,
    onSubmit,
    readOnly,
    actionType,
    isCreating,
    isSubmitting,
    setAuthType,
    setAuthCancel,
    setIsAuthUpdating,
    "data-componentid": _componentId = "action-edit"
}: ActionEditInterface): ReactElement => {

    const [ isAuthChanging, setIsAuthChanging ] = useState<boolean>(false);
    const [ currentAuthType, setCurrentAuthType ] = useState<AuthenticationType>
    (initialValues ?  initialValues.authenticationType as AuthenticationType : null);

    const [ isShowSecret1, setIsShowSecret1 ] = useState(false);
    const [ isShowSecret2, setIsShowSecret2 ] = useState(false);
    const { t } = useTranslation();

    /**
     * The following useEffect is used to set the current Action Authentication Type.
     */
    useEffect(() => {
        if (initialValues) {
            setCurrentAuthType(initialValues.authenticationType as AuthenticationType);
            setIsAuthChanging(false);
        }
    }, [ initialValues ]);

    const renderInputAdornmentOfSecret1 = (): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !isShowSecret1 ? "eye" : "eye slash" }
                data-componentid={ `${ _componentId }-authentication-property-secret1-view-button` }
                onClick={ () => { setIsShowSecret1(!isShowSecret1); } }
            />
        </InputAdornment>
    );

    const renderInputAdornmentOfSecret2 = (): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !isShowSecret2 ? "eye" : "eye slash" }
                data-componentid={ `${ _componentId }-authentication-property-secret2-view-button` }
                onClick={ () => { setIsShowSecret2(!isShowSecret2); } }
            />
        </InputAdornment>
    );

    /**
     * This is called when the Change Authentication button is pressed.
     */
    const handleAuthChange = () : void => {
        setIsAuthUpdating(true);
        setIsAuthChanging(true);
    };

    /**
     * This is called when the cancel button is pressed.
     */
    const handleAuthCancel = () : void => {
        setAuthCancel(true);
        setCurrentAuthType(initialValues.authenticationType as AuthenticationType);
        setIsAuthChanging(false);
        setIsAuthUpdating(false);
    };

    const resolveAuthentication = (): ReactElement => {

        const handleAuthTypeChange = (event: SelectChangeEvent) => {
            switch (event.target.value) {
                case AuthenticationType.NONE.toString():
                    setCurrentAuthType(AuthenticationType.NONE);
                    setAuthType(AuthenticationType.NONE);

                    break;
                case AuthenticationType.BASIC.toString():
                    setCurrentAuthType(AuthenticationType.BASIC);
                    setAuthType(AuthenticationType.BASIC);

                    break;
                case AuthenticationType.BEARER.toString():
                    setCurrentAuthType(AuthenticationType.BEARER);
                    setAuthType(AuthenticationType.BEARER);

                    break;
                case AuthenticationType.API_KEY.toString():
                    setCurrentAuthType(AuthenticationType.API_KEY);
                    setAuthType(AuthenticationType.API_KEY);

                    break;
                default:
                    setCurrentAuthType(AuthenticationType.NONE);
                    setAuthType(AuthenticationType.NONE);
            }

            resolveAuthProperties();
        };

        return (
            <>
                <FinalFormField
                    key="authenticationType"
                    className="select-field-container"
                    width={ 16 }
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    ariaLabel="username"
                    required={ true }
                    data-componentid={ `${ _componentId }-authentication-type-dropdown` }
                    name="authenticationType"
                    type={ "dropdown" }
                    displayEmpty={ true }
                    label={ t("console:manage.features.actions.fields.authenticationType.label") }
                    placeholder={ t("console:manage.features.actions.fields.authenticationType.placeholder") }
                    component={ SelectFieldAdapter }
                    maxLength={ 100 }
                    minLength={ 0 }
                    options={
                        [ ...ActionsConstants.AUTH_TYPES.map((option: AuthTypeDropdownOption) => ({
                            text: t(option.text),
                            value: option.value.toString() }))
                        ]
                    }
                    onChange={ handleAuthTypeChange }
                />
                { resolveAuthProperties() }
            </>
        );
    };

    const resolveAuthProperties = (): ReactElement => {

        const showAuthSecretsHint = (): ReactElement => {
            return (
                <Hint className="hint-text" compact>
                    {
                        isCreating ? t("console:manage.features.actions.fields.authenticationType.hint.create")
                            : t("console:manage.features.actions.fields.authenticationType.hint.update")
                    }
                </Hint>
            );
        };

        switch (currentAuthType) {
            case AuthenticationType.NONE:
                break;
            case AuthenticationType.BASIC:
                return (
                    <>
                        { showAuthSecretsHint() }
                        <FinalFormField
                            key="username"
                            width={ 16 }
                            className="text-field-container"
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="username"
                            required={ true }
                            data-componentid={ `${ _componentId }-authentication-property-username` }
                            name="usernameAuthProperty"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret1()
                            } }
                            label={ t("console:manage.features.actions.fields.authentication" +
                                ".types.basic.properties.username.label") }
                            placeholder={ t("console:manage.features.actions.fields.authentication" +
                                ".types.basic.properties.username.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                        />
                        <FinalFormField
                            key="password"
                            className="text-field-container"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="password"
                            required={ true }
                            data-componentid={ `${ _componentId }-authentication-property-password` }
                            name="passwordAuthProperty"
                            type={ isShowSecret2 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret2()
                            } }
                            label={ t("console:manage.features.actions.fields.authentication" +
                                ".types.basic.properties.password.label") }
                            placeholder={ t("console:manage.features.actions.fields.authentication" +
                                ".types.basic.properties.password.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                        />
                    </>
                );
            case AuthenticationType.BEARER:
                return (
                    <>
                        { showAuthSecretsHint() }
                        <FinalFormField
                            key="accessToken"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="accessToken"
                            required={ true }
                            data-componentid={ `${ _componentId }-authentication-property-accessToken` }
                            name="accessTokenAuthProperty"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret1()
                            } }
                            label={ t("console:manage.features.actions.fields.authentication" +
                                ".types.bearer.properties.accessToken.label") }
                            placeholder={ t("console:manage.features.actions.fields.authentication" +
                                ".types.bearer.properties.accessToken.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                        />
                    </>
                );
            case AuthenticationType.API_KEY:
                return (
                    <>
                        { showAuthSecretsHint() }
                        <FinalFormField
                            key="header"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="header"
                            required={ true }
                            data-componentid={ `${ _componentId }-authentication-property-header` }
                            name="headerAuthProperty"
                            type={ "text" }
                            label={ t("console:manage.features.actions.fields.authentication" +
                                ".types.apiKey.properties.header.label") }
                            placeholder={ t("console:manage.features.actions.fields.authentication" +
                                ".types.apiKey.properties.header.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                        />
                        <FinalFormField
                            key="value"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="value"
                            required={ true }
                            data-componentid={ `${ _componentId }-authentication-property-value` }
                            name="valueAuthProperty"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret1()
                            } }
                            label={ t("console:manage.features.actions.fields.authentication" +
                                ".types.apiKey.properties.value.label") }
                            placeholder={ t("console:manage.features.actions.fields.authentication" +
                                ".types.apiKey.properties.value.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                        />
                    </>
                );
            default:
                break;
        }
    };

    const resolveAuthTypeDisplayName = (): string => {
        switch (currentAuthType) {
            case AuthenticationType.NONE:
                return t("console:manage.features.actions.fields.authentication.types.none.name");
            case AuthenticationType.BASIC:
                return t("console:manage.features.actions.fields.authentication.types.basic.name");
            case AuthenticationType.BEARER:
                return t("console:manage.features.actions.fields.authentication.types.bearer.name");
            case AuthenticationType.API_KEY:
                return t("console:manage.features.actions.fields.authentication.types.apiKey.name");
            default:
                return t("console:manage.features.actions.fields.authentication.types.none.name");
        }
    };

    return (
        <EmphasizedSegment
            className="form-wrapper"
            padded={ "very" }
            data-componentid={ `${ _componentId }-section` }
        >
            <div className="form-container with-max-width">
                <FinalFormField
                    key="name"
                    className="text-field-container"
                    width={ 16 }
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    ariaLabel="actionName"
                    required={ true }
                    data-componentid={ `${ _componentId }-action-name` }
                    name="name"
                    // initialValue={ !isCreating ? initialValues.name : "" }
                    type="text"
                    label={ t("console:manage.features.actions.fields.name.label") }
                    placeholder={ t("console:manage.features.actions.fields.name.placeholder") }
                    component={ TextFieldAdapter }
                    maxLength={ 100 }
                    minLength={ 0 }
                    autoComplete="new-password"
                />
                <FinalFormField
                    key="uri"
                    className="text-field-container"
                    width={ 16 }
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    ariaLabel="endpointUri"
                    required={ true }
                    data-componentid={ `${ _componentId }-action-name` }
                    name="endpointUri"
                    // initialValue={ !isCreating ? initialValues.endpointUri : "" }
                    type="text"
                    label={ t("console:manage.features.actions.fields.endpoint.label") }
                    placeholder={ t("console:manage.features.actions.fields.endpoint.placeholder") }
                    helperText={ (
                        <Hint className="hint" compact>
                            { t("console:manage.features.actions.fields.endpoint.hint") }
                        </Hint>
                    ) }
                    component={ TextFieldAdapter }
                    maxLength={ 100 }
                    minLength={ 0 }
                    autoComplete="new-password"
                />
                <Divider className="divider-container"/>
                <Heading className="heading-container" as="h5">
                    { t("console:manage.features.actions.fields.authentication.label") }
                </Heading>
                {
                    !isAuthChanging && !isCreating ? (
                        <Alert severity="info">
                            <>
                                <AlertTitle className="alert-title">
                                    <Trans
                                        i18nKey={
                                            currentAuthType === AuthenticationType.NONE ?
                                                t("console:manage.features.actions.fields.authentication" +
                                                ".info.title.noneAuthType") :
                                                t("console:manage.features.actions.fields.authentication" +
                                                    ".info.title.otherAuthType")
                                        }
                                        values={ { authType: resolveAuthTypeDisplayName() } }
                                        components={ { strong: <strong/> } }
                                    />
                                </AlertTitle>
                                <Trans
                                    i18nKey={ t("console:manage.features.actions.fields.authentication.info.message") }
                                >
                                If you are changing the authentication, be aware that the authentication secrets of
                                the external endpoint need to be updated.
                                </Trans>
                                <div>
                                    <Button
                                        onClick={ handleAuthChange }
                                        variant="outlined"
                                        size="small"
                                        className={ "mt-2" }
                                        data-componentid={ `${ _componentId }-edit-authentication-button` }
                                    >
                                        { t("console:manage.features.actions.buttons.changeAuthentication") }
                                    </Button>
                                </div>
                            </>
                        </Alert>
                    ) : (
                        <Box
                            p={ 3 }
                            sx={ {
                                backgroundColor: "#f9fafb",
                                borderRadius: 1
                            } }
                        >
                            <div className="box-container">
                                { resolveAuthentication() }
                                { !isCreating && (
                                    <Button
                                        onClick={ handleAuthCancel }
                                        variant="outlined"
                                        size="small"
                                        className={ "mt-2" }
                                        data-componentid={ `${ _componentId }-cancel-edit-authentication-button` }
                                    >
                                        { t("console:manage.features.actions.buttons.cancel") }
                                    </Button>
                                ) }
                            </div>
                        </Box>
                    )
                }
                {
                    !readOnly && (
                        <>
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={ onSubmit }
                                className={ "button-container" }
                                data-componentid={ `${ _componentId }-${ actionType }-update-button` }
                                loading={ isSubmitting }
                            >
                                { isCreating ? t("console:manage.features.actions.buttons.create")
                                    : t("console:manage.features.actions.buttons.update") }
                            </Button>
                        </>
                    )
                }
            </div>
        </EmphasizedSegment>
    );
};
