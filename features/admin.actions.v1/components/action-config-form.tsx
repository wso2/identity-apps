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
import Skeleton from "@oxygen-ui/react/Skeleton";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1";
import useGetRulesMeta from "@wso2is/admin.rules.v1/api/use-get-rules-meta";
import RulesComponent from "@wso2is/admin.rules.v1/components/rules-component";
import { RuleExecuteCollectionWithoutIdInterface, RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { getRuleInstanceValue } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    SelectFieldAdapter,
    TextFieldAdapter
} from "@wso2is/form";
import { EmphasizedSegment, Heading, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import createAction from "../api/create-action";
import updateAction from "../api/update-action";
import useGetActionById from "../api/use-get-action-by-id";
import useGetActionsByType from "../api/use-get-actions-by-type";
import { ActionsConstants } from "../constants/actions-constants";
import {
    ActionConfigFormPropertyInterface,
    ActionInterface,
    ActionUpdateInterface,
    AuthenticationPropertiesInterface,
    AuthenticationType,
    AuthenticationTypeDropdownOption
} from "../models/actions";
import "./action-config-form.scss";

/**
 * Prop types for the action configuration form component.
 */
interface ActionConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Action's initial values.
     */
    initialValues: ActionConfigFormPropertyInterface;
    /**
     * Flag for loading state.
     */
    isLoading?: boolean;
    /**
     * Action Type of the Action.
     */
    actionTypeApiPath: string;
    /**
     * Specifies action creation state.
     */
    isCreateFormState: boolean;
}

const ActionConfigForm: FunctionComponent<ActionConfigFormInterface> = ({
    initialValues,
    isLoading,
    actionTypeApiPath,
    isCreateFormState,
    [ "data-componentid" ]: _componentId = "action-config-form"
}: ActionConfigFormInterface): ReactElement => {

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.actions);
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);
    const [ authenticationType, setAuthenticationType ] = useState<AuthenticationType>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isShowSecret1, setIsShowSecret1 ] = useState<boolean>(false);
    const [ isShowSecret2, setIsShowSecret2 ] = useState<boolean>(false);
    const [ isHasRule, setIsHasRule ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const hasActionUpdatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.update);
    const hasActionCreatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.create);

    const {
        mutate: mutateActions
    } = useGetActionsByType(actionTypeApiPath);

    const {
        data: actionData,
        mutate: mutateAction
    } = useGetActionById(actionTypeApiPath, initialValues?.id);

    const {
        data: RuleExpressionsMetaData
    } = useGetRulesMeta(actionTypeApiPath);

    /**
     * The following useEffect is used to set the current Action Authentication Type.
     */
    useEffect(() => {
        if (!initialValues?.id) {
            setIsAuthenticationUpdateFormState(true);
        } else {
            setAuthenticationType(initialValues.authenticationType as AuthenticationType);
            setIsAuthenticationUpdateFormState(false);
        }
    }, [ initialValues ]);

    useEffect(() => {
        if (actionData?.rule) {
            setIsHasRule(true);
        }
    }, [ actionData ]);

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${ _componentId }-authentication-property-secret1-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const renderLoadingPlaceholders = (): ReactElement => (
        <Box className="placeholder-box">
            <Skeleton variant="rectangular" height={ 7 } width="30%" />
            <Skeleton variant="rectangular" height={ 28 } />
            <Skeleton variant="rectangular" height={ 7 } width="90%" />
            <Skeleton variant="rectangular" height={ 7 } />
        </Box>
    );

    /**
     * This is called when the Change Authentication button is pressed.
     */
    const handleAuthenticationChange = (): void => {
        setIsAuthenticationUpdateFormState(true);
    };

    /**
     * This is called when the cancel button is pressed.
     */
    const handleAuthenticationChangeCancel = (): void => {
        setAuthenticationType(initialValues?.authenticationType as AuthenticationType);
        setIsAuthenticationUpdateFormState(false);
    };

    const handleSuccess = (operation: string): void => {
        dispatch(
            addAlert({
                description: t("actions:notification.success." + operation + ".description"),
                level: AlertLevels.SUCCESS,
                message: t("actions:notification.success." + operation + ".message")
            })
        );
    };

    const handleError = (error: AxiosError, operation: string): void => {
        if (error.response?.data?.description) {
            dispatch(
                addAlert({
                    description: t("actions:notification.error." + operation + ".description",
                        { description: error.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.error." + operation + ".message")
                })
            );
        } else {
            dispatch(
                addAlert({
                    description: t("actions:notification.genericError." + operation + ".description"),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.genericError." + operation + ".message")
                })
            );
        }
    };

    const getFieldDisabledStatus = (): boolean => {
        if (isCreateFormState) {
            return !hasActionCreatePermissions;
        } else {
            return !hasActionUpdatePermissions;
        }
    };

    const validateForm = (values: ActionConfigFormPropertyInterface): Partial<ActionConfigFormPropertyInterface> => {
        const error: Partial<ActionConfigFormPropertyInterface> = {};

        if (!values?.name) {
            error.name = t("actions:fields.name.validations.empty");
        }
        const actionNameRegex: RegExp = /^[a-zA-Z0-9-_][a-zA-Z0-9-_ ]*[a-zA-Z0-9-_]$/;

        if (!actionNameRegex.test(values?.name)) {
            error.name = t("actions:fields.name.validations.invalid");
        }
        if (!values?.endpointUri) {
            error.endpointUri = t("actions:fields.endpoint.validations.empty");
        }
        if (URLUtils.isURLValid(values?.endpointUri)) {
            if (!(URLUtils.isHttpsUrl(values?.endpointUri))) {
                error.endpointUri = t("actions:fields.endpoint.validations.notHttps");
            }
        } else {
            error.endpointUri = t("actions:fields.endpoint.validations.invalidUrl");
        }
        if (!values?.authenticationType) {
            error.authenticationType = t("actions:fields.authenticationType.validations.empty");
        }

        const apiKeyHeaderRegex: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]+$/;

        switch (authenticationType) {
            case AuthenticationType.BASIC:
                if(isCreateFormState || isAuthenticationUpdateFormState ||
                    values?.usernameAuthProperty || values?.passwordAuthProperty) {
                    if (!values?.usernameAuthProperty) {
                        error.usernameAuthProperty = t("actions:fields.authentication." +
                            "types.basic.properties.username.validations.empty");
                    }
                    if (!values?.passwordAuthProperty) {
                        error.passwordAuthProperty = t("actions:fields.authentication." +
                            "types.basic.properties.password.validations.empty");
                    }
                }

                break;
            case AuthenticationType.BEARER:
                if (isCreateFormState || isAuthenticationUpdateFormState) {
                    if (!values?.accessTokenAuthProperty) {
                        error.accessTokenAuthProperty = t("actions:fields.authentication." +
                        "types.bearer.properties.accessToken.validations.empty");
                    }
                }

                break;
            case AuthenticationType.API_KEY:
                if (isCreateFormState || isAuthenticationUpdateFormState ||
                    values?.headerAuthProperty || values?.valueAuthProperty) {
                    if (!values?.headerAuthProperty) {
                        error.headerAuthProperty = t("actions:fields.authentication." +
                            "types.apiKey.properties.header.validations.empty");
                    }
                    if (!apiKeyHeaderRegex.test(values?.headerAuthProperty)) {
                        error.headerAuthProperty = t("actions:fields.authentication." +
                            "types.apiKey.properties.header.validations.invalid");
                    }
                    if (!values?.valueAuthProperty) {
                        error.valueAuthProperty = t("actions:fields.authentication." +
                            "types.apiKey.properties.value.validations.empty");
                    }
                }

                break;
            default:
                break;
        }

        return error;
    };

    const handleSubmit = (
        values: ActionConfigFormPropertyInterface,
        changedFields: ActionConfigFormPropertyInterface) =>
    {

        let rule: RuleWithoutIdInterface | Record<string, never>;

        if (isHasRule) {
            const ruleValue: RuleExecuteCollectionWithoutIdInterface = getRuleInstanceValue();

            rule = ruleValue?.rules[0];

            if (rule?.rules?.length === 1 &&
                rule?.rules[0].expressions?.length === 1 &&
                rule?.rules[0]?.expressions[0].value === "") {

                rule = {};
            }
        }

        const authProperties: Partial<AuthenticationPropertiesInterface> = {};

        if (isAuthenticationUpdateFormState || isCreateFormState) {
            switch (authenticationType) {
                case AuthenticationType.BASIC:
                    authProperties.username = values.usernameAuthProperty;
                    authProperties.password = values.passwordAuthProperty;

                    break;
                case AuthenticationType.BEARER:
                    authProperties.accessToken = values.accessTokenAuthProperty;

                    break;
                case AuthenticationType.API_KEY:
                    authProperties.header = values.headerAuthProperty;
                    authProperties.value = values.valueAuthProperty;

                    break;
                case AuthenticationType.NONE:
                    break;
                default:
                    break;
            }
        }

        if (isCreateFormState) {
            const actionValues: ActionInterface = {
                endpoint: {
                    authentication: {
                        properties: authProperties,
                        type: authenticationType
                    },
                    uri: values.endpointUri
                },
                name: values.name,
                ...(rule !== null && { rule: rule })
            };

            setIsSubmitting(true);
            createAction(actionTypeApiPath, actionValues)
                .then(() => {
                    handleSuccess(ActionsConstants.CREATE);
                    mutateActions();
                })
                .catch((error: AxiosError) => {
                    handleError(error, ActionsConstants.CREATE);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            // Updating the action
            const updatingValues: ActionUpdateInterface = {
                endpoint: isAuthenticationUpdateFormState || changedFields?.endpointUri ? {
                    authentication: isAuthenticationUpdateFormState ? {
                        properties: authProperties,
                        type: authenticationType
                    } : undefined,
                    uri: changedFields?.endpointUri ? values.endpointUri : undefined
                } : undefined,
                name: changedFields?.name ? values.name : undefined,
                ...(rule !== null && { rule: rule })
            };

            setIsSubmitting(true);
            updateAction(actionTypeApiPath, initialValues.id, updatingValues)
                .then(() => {
                    handleSuccess(ActionsConstants.UPDATE);
                    setIsAuthenticationUpdateFormState(false);
                    mutateAction();
                })
                .catch((error: AxiosError) => {
                    handleError(error, ActionsConstants.UPDATE);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const renderFormFields = (): ReactElement => {
        const renderAuthenticationSection = (): ReactElement => {
            const renderAuthenticationSectionInfoBox = (): ReactElement => {
                const resolveAuthTypeDisplayName = (): string => {
                    switch (authenticationType) {
                        case AuthenticationType.NONE:
                            return t("actions:fields.authentication.types.none.name");
                        case AuthenticationType.BASIC:
                            return t("actions:fields.authentication.types.basic.name");
                        case AuthenticationType.BEARER:
                            return t("actions:fields.authentication.types.bearer.name");
                        case AuthenticationType.API_KEY:
                            return t("actions:fields.authentication.types.apiKey.name");
                        default:
                            return;
                    }
                };

                return (
                    <Alert className="alert-nutral" icon={ false }>
                        <AlertTitle
                            className="alert-title"
                            data-componentid={ `${ _componentId }-authentication-info-box-title` }
                        >
                            <Trans
                                i18nKey={
                                    authenticationType === AuthenticationType.NONE ?
                                        t("actions:fields.authentication.info.title.noneAuthType") :
                                        t("actions:fields.authentication.info.title.otherAuthType",
                                            { authType: resolveAuthTypeDisplayName() })
                                }
                                components={ { strong: <strong/> } }
                            />
                        </AlertTitle>
                        <Trans
                            i18nKey={ t("actions:fields.authentication.info.message") }
                        >
                                If you are changing the authentication, be aware that the authentication secrets of
                                the external endpoint need to be updated.
                        </Trans>
                        <div>
                            <Button
                                onClick={ handleAuthenticationChange }
                                variant="outlined"
                                size="small"
                                className={ "secondary-button" }
                                data-componentid={ `${ _componentId }-change-authentication-button` }
                                disabled={ getFieldDisabledStatus() }
                            >
                                { t("actions:buttons.changeAuthentication") }
                            </Button>
                        </div>
                    </Alert>
                );
            };

            const renderAuthenticationUpdateWidget = (): ReactElement => {
                const renderAuthentication = (): ReactElement => {
                    const renderAuthenticationPropertyFields = (): ReactElement => {
                        const showAuthSecretsHint = (): ReactElement => (
                            <Hint className="hint-text" compact>
                                {
                                    isCreateFormState ?
                                        t("actions:fields.authenticationType.hint.create")
                                        : t("actions:fields.authenticationType.hint.update")
                                }
                            </Hint>
                        );

                        switch (authenticationType) {
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
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    isShowSecret1,
                                                    () => setIsShowSecret1(!isShowSecret1))
                                            } }
                                            label={ t("actions:fields.authentication" +
                                                ".types.basic.properties.username.label") }
                                            placeholder={ t("actions:fields.authentication" +
                                                ".types.basic.properties.username.placeholder") }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            minLength={ 0 }
                                            disabled={ getFieldDisabledStatus() }
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
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    isShowSecret2,
                                                    () => setIsShowSecret2(!isShowSecret2))
                                            } }
                                            label={ t("actions:fields.authentication" +
                                                ".types.basic.properties.password.label") }
                                            placeholder={ t("actions:fields.authentication" +
                                                ".types.basic.properties.password.placeholder") }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            minLength={ 0 }
                                            disabled={ getFieldDisabledStatus() }
                                        />
                                    </>
                                );
                            case AuthenticationType.BEARER:
                                return (
                                    <>
                                        { showAuthSecretsHint() }
                                        <FinalFormField
                                            key="accessToken"
                                            className="text-field-container"
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
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    isShowSecret1,
                                                    () => setIsShowSecret1(!isShowSecret1))
                                            } }
                                            label={ t("actions:fields.authentication" +
                                                ".types.bearer.properties.accessToken.label") }
                                            placeholder={ t("actions:fields.authentication" +
                                                ".types.bearer.properties.accessToken.placeholder") }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            minLength={ 0 }
                                            disabled={ getFieldDisabledStatus() }
                                        />
                                    </>
                                );
                            case AuthenticationType.API_KEY:
                                return (
                                    <>
                                        { showAuthSecretsHint() }
                                        <FinalFormField
                                            key="header"
                                            className="text-field-container"
                                            width={ 16 }
                                            FormControlProps={ {
                                                margin: "dense"
                                            } }
                                            ariaLabel="header"
                                            required={ true }
                                            data-componentid={ `${ _componentId }-authentication-property-header` }
                                            name="headerAuthProperty"
                                            type={ "text" }
                                            label={ t("actions:fields.authentication" +
                                                ".types.apiKey.properties.header.label") }
                                            placeholder={ t("actions:fields.authentication" +
                                                ".types.apiKey.properties.header.placeholder") }
                                            helperText={ (
                                                <Hint className="hint" compact>
                                                    { t("actions:fields.authentication" +
                                                        ".types.apiKey.properties.header.hint") }
                                                </Hint>
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            minLength={ 0 }
                                            disabled={ getFieldDisabledStatus() }
                                        />
                                        <FinalFormField
                                            key="value"
                                            className="text-field-container"
                                            width={ 16 }
                                            FormControlProps={ {
                                                margin: "dense"
                                            } }
                                            ariaLabel="value"
                                            required={ true }
                                            data-componentid={ `${ _componentId }-authentication-property-value` }
                                            name="valueAuthProperty"
                                            type={ isShowSecret2 ? "text" : "password" }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    isShowSecret2,
                                                    () => setIsShowSecret2(!isShowSecret2))
                                            } }
                                            label={ t("actions:fields.authentication" +
                                                ".types.apiKey.properties.value.label") }
                                            placeholder={ t("actions:fields.authentication" +
                                                ".types.apiKey.properties.value.placeholder") }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            minLength={ 0 }
                                            disabled={ getFieldDisabledStatus() }
                                        />
                                    </>
                                );
                            default:
                                break;
                        }
                    };

                    const handleAuthTypeChange = (event: SelectChangeEvent) => {
                        switch (event.target.value) {
                            case AuthenticationType.NONE.toString():
                                setAuthenticationType(AuthenticationType.NONE);

                                break;
                            case AuthenticationType.BASIC.toString():
                                setAuthenticationType(AuthenticationType.BASIC);

                                break;
                            case AuthenticationType.BEARER.toString():
                                setAuthenticationType(AuthenticationType.BEARER);

                                break;
                            case AuthenticationType.API_KEY.toString():
                                setAuthenticationType(AuthenticationType.API_KEY);

                                break;
                            default:
                                setAuthenticationType(AuthenticationType.NONE);
                        }

                        renderAuthenticationPropertyFields();
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
                                label={ t("actions:fields.authenticationType.label") }
                                placeholder={ t("actions:fields.authenticationType.placeholder") }
                                component={ SelectFieldAdapter }
                                maxLength={ 100 }
                                minLength={ 0 }
                                options={
                                    [ ...ActionsConstants.AUTH_TYPES.map(
                                        (option: AuthenticationTypeDropdownOption) => ({
                                            text: t(option.text),
                                            value: option.value.toString() }))
                                    ]
                                }
                                onChange={ handleAuthTypeChange }
                                disabled={ getFieldDisabledStatus() }
                            />
                            { renderAuthenticationPropertyFields() }
                        </>
                    );
                };

                return (
                    <Box className="box-container">
                        <div className="box-field">
                            { renderAuthentication() }
                            { !isCreateFormState && (
                                <Button
                                    onClick={ handleAuthenticationChangeCancel }
                                    variant="outlined"
                                    size="small"
                                    className="secondary-button"
                                    data-componentid={ `${ _componentId }-cancel-edit-authentication-button` }
                                >
                                    { t("actions:buttons.cancel") }
                                </Button>
                            ) }
                        </div>
                    </Box>
                );
            };

            return ( !isAuthenticationUpdateFormState && !isCreateFormState && !(authenticationType === null) ?
                renderAuthenticationSectionInfoBox() : renderAuthenticationUpdateWidget());
        };

        if (isLoading) {
            return renderLoadingPlaceholders();
        }

        return (
            <>
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
                    type="text"
                    label={ t("actions:fields.name.label") }
                    placeholder={ t("actions:fields.name.placeholder") }
                    helperText={ (
                        <Hint className="hint" compact>
                            { t("actions:fields.name.hint") }
                        </Hint>
                    ) }
                    component={ TextFieldAdapter }
                    maxLength={ 100 }
                    minLength={ 0 }
                    disabled={ getFieldDisabledStatus() }
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
                    data-componentid={ `${ _componentId }-action-endpointUri` }
                    name="endpointUri"
                    type="text"
                    label={ t("actions:fields.endpoint.label") }
                    placeholder={ t("actions:fields.endpoint.placeholder") }
                    helperText={ (
                        <Hint className="hint" compact>
                            { t("actions:fields.endpoint.hint") }
                        </Hint>
                    ) }
                    component={ TextFieldAdapter }
                    maxLength={ 100 }
                    minLength={ 0 }
                    disabled={ getFieldDisabledStatus() }
                />
                <Divider className="divider-container"/>
                <Heading className="heading-container" as="h5">
                    { t("actions:fields.authentication.label") }
                </Heading>
                { renderAuthenticationSection() }
                { RuleExpressionsMetaData && (
                    <>
                        <Divider className="divider-container" />
                        <Heading className="heading-container" as="h5">
                            <Trans i18nKey={ t("actions:fields.rules.label") }>
                                Execution Rule
                            </Trans>
                        </Heading>
                        { isHasRule ? (
                            <RulesComponent
                                conditionExpressionsMetaData={ RuleExpressionsMetaData }
                                initialData={ actionData?.rule }
                            />
                        ) : (
                            <Alert className="alert-nutral" icon={ false }>
                                <AlertTitle
                                    className="alert-title"
                                    data-componentid={ `${ _componentId }-rule-info-box-title` }
                                >
                                    <Trans i18nKey={ t("actions:fields.rules.info.title") }>
                                        No execution rule is configured.
                                    </Trans>
                                </AlertTitle>
                                <Trans
                                    i18nKey={ t("actions:fields.authentication.info.message") }
                                >
                                    This action will be executed without any conditions.
                                </Trans>
                                <div>
                                    <Button
                                        onClick={ () => setIsHasRule(true) }
                                        variant="outlined"
                                        size="small"
                                        className={ "secondary-button" }
                                        data-componentid={ `${ _componentId }-configure-rule-button` }
                                    >
                                        { t("actions:fields.rules.button") }
                                    </Button>
                                </div>
                            </Alert>
                        ) }
                    </>
                ) }
            </>
        );
    };

    return (
        <FinalForm
            onSubmit={ (values: ActionConfigFormPropertyInterface, form: any) => {
                handleSubmit(values, form.getState().dirtyFields); }
            }
            validate={ validateForm }
            initialValues={ initialValues }
            render={ ({ handleSubmit, form }: FormRenderProps) => (
                <form onSubmit={ handleSubmit }>
                    <EmphasizedSegment
                        className="form-wrapper"
                        padded={ "very" }
                        data-componentid={ `${ _componentId }-section` }
                    >
                        <div className="form-container with-max-width">
                            { renderFormFields() }
                            { !isLoading && (
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={ handleSubmit }
                                    className={ "button-container" }
                                    data-componentid={ `${ _componentId }-primary-button` }
                                    loading={ isSubmitting }
                                    disabled={ getFieldDisabledStatus() }
                                >
                                    {
                                        isCreateFormState
                                            ? t("actions:buttons.create")
                                            : t("actions:buttons.update")
                                    }
                                </Button>
                            ) }
                        </div>
                    </EmphasizedSegment>
                    <FormSpy
                        subscription={ { values: true } }
                    >
                        { ({ values }: { values: ActionConfigFormPropertyInterface }) => {
                            if (!isAuthenticationUpdateFormState) {
                                form.change("authenticationType",
                                    initialValues?.authenticationType);
                                switch (authenticationType) {
                                    case AuthenticationType.BASIC:
                                        delete values.usernameAuthProperty;
                                        delete values.passwordAuthProperty;

                                        break;
                                    case AuthenticationType.BEARER:
                                        delete values.accessTokenAuthProperty;

                                        break;
                                    case AuthenticationType.API_KEY:
                                        delete values.headerAuthProperty;
                                        delete values.valueAuthProperty;

                                        break;
                                    default:
                                        break;
                                }
                            }

                            // Clear inputs of property field values of other authentication types.
                            switch (authenticationType) {
                                case AuthenticationType.BASIC:
                                    delete values.accessTokenAuthProperty;
                                    delete values.headerAuthProperty;
                                    delete values.valueAuthProperty;

                                    break;
                                case AuthenticationType.BEARER:
                                    delete values.usernameAuthProperty;
                                    delete values.passwordAuthProperty;
                                    delete values.headerAuthProperty;
                                    delete values.valueAuthProperty;

                                    break;
                                case AuthenticationType.API_KEY:
                                    delete values.usernameAuthProperty;
                                    delete values.passwordAuthProperty;
                                    delete values.accessTokenAuthProperty;

                                    break;
                                case AuthenticationType.NONE:
                                    delete values.usernameAuthProperty;
                                    delete values.passwordAuthProperty;
                                    delete values.headerAuthProperty;
                                    delete values.valueAuthProperty;
                                    delete values.accessTokenAuthProperty;

                                    break;
                                default:

                                    break;
                            }

                            return null;
                        } }
                    </FormSpy>
                </form>
            ) }
        >
        </FinalForm>
    );
};

export default ActionConfigForm;
