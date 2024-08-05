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

import Divider from "@oxygen-ui/react/Divider";
import { Show, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { FinalForm, FormRenderProps, FormSpy } from "@wso2is/form";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    GridLayout,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid, Ref } from "semantic-ui-react";
import {
    activateAction,
    createAction,
    deactivateAction,
    deleteAction,
    updateAction,
    useActionsDetailsByType
} from "../api/actions";
import { ActionEdit } from "../components";
import { ActionsConstants } from "../constants";
import {
    ActionConfigFormPropertyInterface,
    ActionInterface,
    ActionUpdateInterface,
    AuthPropertiesInterface,
    AuthenticationType
} from "../models";
import "./action-edit-page.scss";

/**
 * Props for the Action Edit page.
 */
type ActionEditPageInterface = IdentifiableComponentInterface;

export const ActionEditPage: FunctionComponent<ActionEditPageInterface> = ({
    "data-componentid": _componentId = "action-edit-page"
}: ActionEditPageInterface): ReactElement => {

    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);
    const [ authType, setAuthType ] = useState<AuthenticationType>(null);
    const [ isAuthCancel, setAuthCancel ] = useState<boolean>(false);
    const [ isAuthUpdating, setIsAuthUpdating ] = useState<boolean>(false);
    const [ isActive, setIsActive ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isCreating, setIsCreating ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const actionTypeApiPath: string = useMemo(() => {
        const path: string[] = history.location.pathname.split("/");
        const actionType: string = path[path.length - 1];

        switch (actionType) {
            case ActionsConstants.ActionTypes.PRE_ISSUE_ACCESS_TOKEN.getUrlPath():
                return ActionsConstants.ActionTypes.PRE_ISSUE_ACCESS_TOKEN.getApiPath();
            case ActionsConstants.ActionTypes.PRE_UPDATE_PASSWORD.getUrlPath():
                return ActionsConstants.ActionTypes.PRE_UPDATE_PASSWORD.getApiPath();
            case ActionsConstants.ActionTypes.PRE_UPDATE_PROFILE.getUrlPath():
                return ActionsConstants.ActionTypes.PRE_UPDATE_PROFILE.getApiPath();
            case ActionsConstants.ActionTypes.PRE_REGISTRATION.getUrlPath():
                return ActionsConstants.ActionTypes.PRE_REGISTRATION.getApiPath();
            default:
                return null;
        }
    }, [ history.location.pathname ]);

    const {
        data: actionData,
        error: actionDataFetchRequestError,
        isLoading: isActionDataLoading,
        mutate: fetchActionConfigurations
    } = useActionsDetailsByType(actionTypeApiPath);


    const initialValues: ActionConfigFormPropertyInterface = useMemo(() => {
        if (actionData) {
            return {
                authenticationType: actionData[0]?.endpoint?.authentication?.type.toString(),
                endpointUri: actionData[0]?.endpoint.uri,
                id: actionData[0]?.id,
                name: actionData[0]?.name
            };
        }
    }, [ actionData ]);

    const hasActionUpdatePermissions: boolean = useRequiredScopes(featureConfig?.actions?.scopes?.update);

    useEffect(() => {
        if (actionData) {
            if (actionData.length < 1) {
                setIsCreating(true);
            } else {
                setIsCreating(false);
                setIsActive(actionData[0]?.status.toString() === ActionsConstants.ACTIVE_STATUS);
                setAuthType(actionData[0]?.endpoint.authentication.type);
            }
        } else {
            setIsCreating(true);
        }
    }, [ actionData ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching the Action.
     */
    useEffect(() => {
        if (actionDataFetchRequestError && !isActionDataLoading) {
            if (actionDataFetchRequestError.response && actionDataFetchRequestError.response.data
                && actionDataFetchRequestError.response.data.description) {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("console:manage.features.actions.notification.error.fetch.description",
                            { description: actionDataFetchRequestError.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.actions.notification.error.fetch.message")
                    })
                );
            } else {
                // Generic error message
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("console:manage.features.actions.notification.genericError.fetch.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.actions.notification.genericError.fetch.message")
                    })
                );
            }
        }
    }, [ ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get("ACTIONS"));
    };

    const resolveActionTitle = (actionType: string): string => {

        switch(actionType) {
            case ActionsConstants.ActionTypes.PRE_ISSUE_ACCESS_TOKEN.getApiPath():
                return t("console:manage.features.actions.types.preIssueAccessToken.heading");
            case ActionsConstants.ActionTypes.PRE_UPDATE_PASSWORD.getApiPath():
                return t("console:manage.features.actions.types.preUpdatePassword.heading");
            case ActionsConstants.ActionTypes.PRE_UPDATE_PROFILE.getApiPath():
                return t("console:manage.features.actions.types.preUpdateProfile.heading");
            case ActionsConstants.ActionTypes.PRE_REGISTRATION.getApiPath():
                return t("console:manage.features.actions.types.preRegistration.heading");
        }
    };

    const resolveActionDescription = (actionType: string): ReactNode => {

        switch(actionType) {
            case ActionsConstants.ActionTypes.PRE_ISSUE_ACCESS_TOKEN.getApiPath():
                return (
                    <>
                        { t("console:manage.features.actions.types.preIssueAccessToken.description.expanded") }
                        <DocumentationLink
                            link={
                                getLink("develop.actions.types.preIssueAccessToken.learnMore")
                            }
                            showEmptyLink={ false }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>

                );
            case ActionsConstants.ActionTypes.PRE_UPDATE_PASSWORD.getApiPath():
                return (
                    <>
                        { t("console:manage.features.actions.types.preUpdatePassword.description.expanded") }
                        <DocumentationLink
                            link={
                                getLink("develop.actions.types.preUpdatePassword.learnMore")
                            }
                            showEmptyLink={ false }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>

                );
            case ActionsConstants.ActionTypes.PRE_UPDATE_PROFILE.getApiPath():
                return (
                    <>
                        { t("console:manage.features.actions.types.preUpdateProfile.description.expanded") }
                        <DocumentationLink
                            link={
                                getLink("develop.actions.types.preUpdateProfile.learnMore")
                            }
                            showEmptyLink={ false }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>

                );
            case ActionsConstants.ActionTypes.PRE_REGISTRATION.getApiPath():
                return (
                    <>
                        { t("console:manage.features.actions.types.preRegistration.description.expanded") }
                        <DocumentationLink
                            link={
                                getLink("develop.actions.types.preRegistration.learnMore")
                            }
                            showEmptyLink={ false }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>

                );
        }
    };

    /**
     * This renders the enable toggle.
     */
    const actionToggle = (): ReactElement => {

        return !isCreating && actionData?.length > 0 && (
            <>
                <Checkbox
                    label={
                        isActive
                            ? t("console:manage.features.actions.status.active")
                            : t("console:manage.features.actions.status.inactive")
                    }
                    toggle
                    onChange={ handleToggle }
                    checked={ isActive }
                    readOnly={ !hasActionUpdatePermissions }
                    data-componentId={ `${ _componentId }-${ actionTypeApiPath }-enable-toggle` }
                />
            </>
        );
    };

    const handleToggle = (e: SyntheticEvent, data: CheckboxProps) => {
        setIsActive(data.checked);
        setIsSubmitting(true);

        if (data.checked) {

            activateAction(actionTypeApiPath, initialValues.id)
                .then(() => {
                    handleSuccess(ActionsConstants.UPDATE);
                    fetchActionConfigurations();
                })
                .catch((error: AxiosError) => {
                    handleError(error, ActionsConstants.UPDATE);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            deactivateAction(actionTypeApiPath, initialValues.id)
                .then(() => {
                    handleSuccess(ActionsConstants.UPDATE);
                })
                .catch((error: AxiosError) => {
                    handleError(error, ActionsConstants.UPDATE);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const handleSuccess = (operation: string) => {
        dispatch(
            addAlert({
                description: t("console:manage.features.actions.notification.success." + operation + ".description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.actions.notification.success." + operation + ".message")
            })
        );
    };

    const handleError = (error: AxiosError, operation: string) => {
        if (error.response && error.response.data && error.response.data.description) {
            dispatch(
                addAlert({
                    description: t("console:manage.features.actions.notification.error." + operation + ".description",
                        { description: error.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.actions.notification.error." + operation + ".message")
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t("console:manage.features.actions.notification.genericError." + operation
                        + ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.actions.notification.genericError." + operation
                        + ".message")
                })
            );
        }
    };

    const validateForm = (values: ActionConfigFormPropertyInterface): ActionConfigFormPropertyInterface => {
        const error: ActionConfigFormPropertyInterface = {
            accessTokenAuthProperty: undefined,
            authenticationType: undefined,
            endpointUri: undefined,
            headerAuthProperty: undefined,
            name: undefined,
            passwordAuthProperty: undefined,
            usernameAuthProperty: undefined,
            valueAuthProperty: undefined
        };

        if (!values?.name) {
            error.name = t("console:manage.features.actions.fields.name.validations.empty");
        }
        if (!values?.endpointUri) {
            error.endpointUri = t("console:manage.features.actions.fields.endpoint.validations.empty");
        }
        if (URLUtils.isURLValid(values?.endpointUri)) {
            if (!(URLUtils.isHttpUrl(values?.endpointUri) || URLUtils.isHttpsUrl(values?.endpointUri))) {
                error.endpointUri = t("console:manage.features.actions.fields.endpoint.validations.notHttpOrHttps");
            }
        } else {
            error.endpointUri = t("console:manage.features.actions.fields.endpoint.validations.invalidUrl");
        }
        if (!values?.authenticationType) {
            error.authenticationType = t("console:manage.features.actions.fields.authenticationType.validations.empty");
        }

        switch (authType) {
            case AuthenticationType.BASIC:
                if(isCreating || isAuthUpdating || values?.usernameAuthProperty || values?.passwordAuthProperty) {
                    if (!values?.usernameAuthProperty) {
                        error.usernameAuthProperty = t("console:manage.features.actions.fields.authentication." +
                            "types.basic.properties.username.validations.empty");
                    }
                    if (!values?.passwordAuthProperty) {
                        error.passwordAuthProperty = t("console:manage.features.actions.fields.authentication." +
                            "types.basic.properties.password.validations.empty");
                    }
                }

                break;
            case AuthenticationType.BEARER:
                if (isCreating || isAuthUpdating) {
                    if (!values?.accessTokenAuthProperty) {
                        error.accessTokenAuthProperty = t("console:manage.features.actions.fields.authentication." +
                        "types.bearer.properties.accessToken.validations.empty");
                    }
                }

                break;
            case AuthenticationType.API_KEY:
                if (isCreating || isAuthUpdating || values?.headerAuthProperty || values?.valueAuthProperty) {
                    if (!values?.headerAuthProperty) {
                        error.headerAuthProperty = t("console:manage.features.actions.fields.authentication." +
                            "types.apiKey.properties.header.validations.empty");
                    }
                    if (!values?.valueAuthProperty) {
                        error.valueAuthProperty = t("console:manage.features.actions.fields.authentication." +
                            "types.apiKey.properties.value.validations.empty");
                    }
                }

                break;
            default:
                break;
        }

        return error;
    };


    const handleSubmit = async (values: ActionConfigFormPropertyInterface) => {
        const authProperties: AuthPropertiesInterface = {};

        if (isAuthUpdating || isCreating) {
            switch (authType) {
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

        if (isCreating) {
            const actionValues: ActionInterface = {
                endpoint: {
                    authentication: {
                        properties: authProperties,
                        type: authType
                    },
                    uri: values.endpointUri
                },
                name: values.name
            };

            setIsSubmitting(true);
            createAction(actionTypeApiPath, actionValues)
                .then(() => {
                    handleSuccess(ActionsConstants.CREATE);
                    fetchActionConfigurations();
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
                endpoint: {
                    authentication: isAuthUpdating ? {
                        properties: authProperties,
                        type: authType
                    } : undefined,
                    uri: values?.endpointUri
                },
                name: values?.name
            };

            setIsSubmitting(true);
            updateAction(actionTypeApiPath, initialValues.id, updatingValues)
                .then(() => {
                    handleSuccess(ActionsConstants.UPDATE);
                    setIsAuthUpdating(false);
                    fetchActionConfigurations();
                })
                .catch((error: AxiosError) => {
                    handleError(error, ActionsConstants.UPDATE);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    return !isActionDataLoading && actionData ? (
        <PageLayout
            title={ resolveActionTitle(actionTypeApiPath) }
            description={ resolveActionDescription(actionTypeApiPath) }
            backButton={ {
                "data-componentid": `${ _componentId }-${ actionTypeApiPath }-page-back-button`,
                onClick: () => handleBackButtonClick(),
                text: t("console:manage.features.actions.goBackActions")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${ _componentId }-${ actionTypeApiPath }-page-layout` }
        >
            { actionToggle() }
            {
                <Ref innerRef={ pageContextRef }>
                    <Grid className={ "mt-3 mb-3" }>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <FinalForm
                                    onSubmit={ handleSubmit }
                                    validate={ validateForm }
                                    initialValues={ initialValues }
                                    render={ ({ handleSubmit, form }: FormRenderProps) => (
                                        <form
                                            className="action-update-form"
                                            onSubmit={ handleSubmit }
                                        >
                                            <ActionEdit
                                                initialValues={ initialValues }
                                                onSubmit={ handleSubmit }
                                                readOnly={ !hasActionUpdatePermissions }
                                                actionType={ actionTypeApiPath }
                                                isCreating={ isCreating }
                                                isSubmitting={ isSubmitting }
                                                setAuthType={ setAuthType }
                                                setAuthCancel={ setAuthCancel }
                                                setIsAuthUpdating={ setIsAuthUpdating }
                                            />
                                            <FormSpy
                                                subscription={ { values: true } }
                                            >
                                                { ({ values }) => {
                                                    if (isAuthCancel) {
                                                        form.change("authenticationType",
                                                            initialValues.authenticationType);
                                                        switch (authType) {
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
                                                        setAuthCancel(false);
                                                    }

                                                    if (authType !== initialValues.authenticationType) {
                                                        // Clear inputs of other fields.
                                                        switch (authType) {
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
                                                    }

                                                    return null;
                                                } }
                                            </FormSpy>
                                        </form>
                                    ) }
                                ></FinalForm>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Ref>
            }
            <Divider hidden className="button-container" />
            {
                !isActionDataLoading && !isCreating && (
                    <Show
                        when={ featureConfig?.actions?.scopes?.delete }
                    >
                        <DangerZoneGroup
                            sectionHeader={ t("console:manage.features.actions.dangerZoneGroup.header") }
                        >
                            <DangerZone
                                data-componentid={ `${ _componentId }-delete-action-of-type-${ actionTypeApiPath}` }
                                actionTitle={
                                    t("console:manage.features.actions.dangerZoneGroup.revertConfig.actionTitle")
                                }
                                header={ t("console:manage.features.actions.dangerZoneGroup.revertConfig.heading") }
                                subheader={
                                    t("console:manage.features.actions.dangerZoneGroup.revertConfig.subHeading")
                                }
                                onActionClick={ (): void => {
                                    setOpenRevertConfigModal(true);
                                } }
                            />
                        </DangerZoneGroup>
                        <ConfirmationModal
                            primaryActionLoading={ isSubmitting }
                            data-componentid={ `${ _componentId }-revert-confirmation-modal` }
                            onClose={ (): void => setOpenRevertConfigModal(false) }
                            type="negative"
                            open={ isOpenRevertConfigModal }
                            assertionHint={ t("console:manage.features.actions.confirmationModal.assertionHint") }
                            assertionType="checkbox"
                            primaryAction={ t("common:confirm") }
                            secondaryAction={ t("common:cancel") }
                            onSecondaryActionClick={ (): void => setOpenRevertConfigModal(false) }
                            onPrimaryActionClick={ (): void => {
                                setIsSubmitting(true);
                                deleteAction(actionTypeApiPath, initialValues.id)
                                    .then(() => {
                                        handleSuccess(ActionsConstants.DELETE);
                                        fetchActionConfigurations();
                                    })
                                    .catch((error: AxiosError) => {
                                        handleError(error, ActionsConstants.DELETE);
                                    })
                                    .finally(() => {
                                        setIsSubmitting(false);
                                        setOpenRevertConfigModal(false);
                                    });
                            } }
                            closeOnDimmerClick={ false }
                        >
                            <ConfirmationModal.Header
                                data-componentid={ `${ _componentId }-revert-confirmation-modal-header` }
                            >
                                { t("console:manage.features.actions.confirmationModal.header") }
                            </ConfirmationModal.Header>
                            <ConfirmationModal.Message
                                data-componentid={
                                    `${ _componentId }revert-confirmation-modal-message`
                                }
                                attached
                                negative
                            >
                                { t("console:manage.features.actions.confirmationModal.message") }
                            </ConfirmationModal.Message>
                            <ConfirmationModal.Content>
                                { t("console:manage.features.actions.confirmationModal.content") }
                            </ConfirmationModal.Content>
                        </ConfirmationModal>
                    </Show>
                )
            }
        </PageLayout>
    ) : (
        <GridLayout isLoading={ isActionDataLoading } className={ "pt-5" } />
    );
};

export default ActionEditPage;
