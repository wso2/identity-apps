/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, Show, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid } from "semantic-ui-react";
import changeActionStatus from "../api/change-action-status";
import deleteAction from "../api/delete-action";
import useGetActionById from "../api/use-get-action-by-id";
import useGetActionsByType from "../api/use-get-actions-by-type";
import PreIssueAccessTokenActionConfigForm from "../components/pre-issue-access-token-action-config-form";
import PreUpdatePasswordActionConfigForm from "../components/pre-update-password-action-config-form";
import PreUpdateProfileActionConfigForm from "../components/pre-update-profile-action-config-form";
import { ActionsConstants } from "../constants/actions-constants";
import {
    ActionConfigFormPropertyInterface, PreUpdatePasswordActionConfigFormPropertyInterface,
    PreUpdatePasswordActionResponseInterface,
    PreUpdateProfileActionConfigFormPropertyInterface,
    PreUpdateProfileActionResponseInterface
} from "../models/actions";
import "./action-configuration-page.scss";
import { useHandleError, useHandleSuccess } from "../util/alert-util";

/**
 * Props for the Action Configuration page.
 */
type ActionConfigurationPageInterface = IdentifiableComponentInterface;

const ActionConfigurationPage: FunctionComponent<ActionConfigurationPageInterface> = ({
    [ "data-componentid" ]: _componentId = "action-configuration-page"
}: ActionConfigurationPageInterface): ReactElement => {

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.actions);
    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ isActive, setIsActive ] = useState<boolean>(false);
    const [ showCreateForm, setShowCreateForm ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const handleSuccess: (operation: string) => void = useHandleSuccess();
    const handleError: (error: AxiosError, operation: string) => void = useHandleError();

    const hasActionUpdatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.update);
    const hasActionCreatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.create);

    const actionTypeApiPath: string = useMemo(() => {
        const path: string[] = history.location.pathname.split("/");
        const actionType: string = path[path.length - 1];

        switch (actionType) {
            case ActionsConstants.ACTION_TYPES.PRE_ISSUE_ACCESS_TOKEN.getUrlPath():
                return ActionsConstants.ACTION_TYPES.PRE_ISSUE_ACCESS_TOKEN.getApiPath();
            case ActionsConstants.ACTION_TYPES.PRE_UPDATE_PASSWORD.getUrlPath():
                return ActionsConstants.ACTION_TYPES.PRE_UPDATE_PASSWORD.getApiPath();
            case ActionsConstants.ACTION_TYPES.PRE_UPDATE_PROFILE.getUrlPath():
                return ActionsConstants.ACTION_TYPES.PRE_UPDATE_PROFILE.getApiPath();
            case ActionsConstants.ACTION_TYPES.PRE_REGISTRATION.getUrlPath():
                return ActionsConstants.ACTION_TYPES.PRE_REGISTRATION.getApiPath();
            default:
                return null;
        }
    }, [ history.location.pathname ]);

    const {
        data: actions,
        error: actionsFetchRequestError,
        isLoading: isActionsLoading,
        mutate: mutateActions
    } = useGetActionsByType(actionTypeApiPath);

    useEffect(() => {
        if (actions?.length >= 1) {
            setShowCreateForm(false);
            setIsActive(actions[0]?.status.toString() === ActionsConstants.ACTIVE_STATUS);
        } else {
            setShowCreateForm(true);
        }
    }, [ actions ]);

    const actionId: string = useMemo(() => actions?.[0]?.id || null, [ actions ]);

    const {
        data: action,
        error: actionFetchRequestError,
        isLoading: isActionLoading,
        mutate: mutateAction
    } = useGetActionById(actionTypeApiPath, actionId);

    const isLoading: boolean = isActionsLoading || !actions || !Array.isArray(actions) || isActionLoading;

    const actionCommonInitialValues: ActionConfigFormPropertyInterface =
        useMemo(() => {
            if (action) {
                return {
                    authenticationType: action?.endpoint?.authentication?.type?.toString(),
                    endpointUri: action?.endpoint?.uri,
                    id: action?.id,
                    name: action?.name,
                    rule: action?.rule
                };

            } else {
                return null;
            }
        }, [ action ]);

    const preUpdatePasswordActionInitialValues: PreUpdatePasswordActionConfigFormPropertyInterface =
        useMemo(() => {
            if (action && actionTypeApiPath === ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH ) {
                return {
                    ...actionCommonInitialValues,
                    attributes: (action as PreUpdatePasswordActionResponseInterface)?.attributes,
                    certificate: (action as PreUpdatePasswordActionResponseInterface)?.passwordSharing.certificate
                        || "",
                    passwordSharing: (action as PreUpdatePasswordActionResponseInterface)?.passwordSharing.format
                };
            } else {
                return null;
            }
        }, [ action ]);

    const preUpdateProfileActionInitialValues: PreUpdateProfileActionConfigFormPropertyInterface =
        useMemo(() => {

            if (action && actionTypeApiPath === ActionsConstants.PRE_UPDATE_PROFILE_API_PATH ) {
                return {
                    ...actionCommonInitialValues,
                    attributes: (action as PreUpdateProfileActionResponseInterface)?.attributes
                };
            } else {
                return null;
            }
        }, [ action ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching Actions by Type.
     */
    useEffect(() => {
        if (isActionsLoading || !actionsFetchRequestError) {
            return;
        }

        if (actionsFetchRequestError.response?.data?.description) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("actions:notification.error.fetchByType.description",
                        { description: actionsFetchRequestError.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.error.fetchByType.message")
                })
            );
        } else {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("actions:notification.genericError.fetchByType.description"),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.genericError.fetchByType.message")
                })
            );
        }
    }, [ isActionsLoading, actionsFetchRequestError ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching the Action by Id.
     */
    useEffect(() => {
        if (isActionLoading || !actionFetchRequestError) {
            return;
        }

        if (actionFetchRequestError.response?.data?.description) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("actions:notification.error.fetchById.description",
                        { description: actionFetchRequestError.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.error.fetchById.message")
                })
            );
        } else {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("actions:notification.genericError.fetchById.description"),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.genericError.fetchById.message")
                })
            );
        }
    }, [ isActionLoading, actionFetchRequestError ]);

    /**
     * This function resolves whether the form is read-only or not.
     */
    const isReadOnly = (): boolean => {
        if (showCreateForm) {
            return !hasActionCreatePermissions;
        } else {
            return !hasActionUpdatePermissions;
        }
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("ACTIONS"));
    };

    /**
     * Resolves Title of the page.
     */
    const resolveActionTitle = (actionType: string): string => {
        switch(actionType) {
            case ActionsConstants.ACTION_TYPES.PRE_ISSUE_ACCESS_TOKEN.getApiPath():
                return t("actions:types.preIssueAccessToken.heading");
            case ActionsConstants.ACTION_TYPES.PRE_UPDATE_PASSWORD.getApiPath():
                return t("actions:types.preUpdatePassword.heading");
            case ActionsConstants.ACTION_TYPES.PRE_UPDATE_PROFILE.getApiPath():
                return t("actions:types.preUpdateProfile.heading");
            case ActionsConstants.ACTION_TYPES.PRE_REGISTRATION.getApiPath():
                return t("actions:types.preRegistration.heading");
        }
    };

    /**
     * Resolves description of the page.
     */
    const resolveActionDescription = (actionType: string): ReactNode => {
        switch(actionType) {
            case ActionsConstants.ACTION_TYPES.PRE_ISSUE_ACCESS_TOKEN.getApiPath():
                return (
                    <>
                        { t("actions:types.preIssueAccessToken.description.expanded") }
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
            case ActionsConstants.ACTION_TYPES.PRE_UPDATE_PASSWORD.getApiPath():
                return (
                    <>
                        { t("actions:types.preUpdatePassword.description.expanded") }
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
            case ActionsConstants.ACTION_TYPES.PRE_UPDATE_PROFILE.getApiPath():
                return (
                    <>
                        { t("actions:types.preUpdateProfile.description.expanded") }
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
            case ActionsConstants.ACTION_TYPES.PRE_REGISTRATION.getApiPath():
                return (
                    <>
                        { t("actions:types.preRegistration.description.expanded") }
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
            default:
                return "";
        }
    };

    /**
     * This renders the toggle button for action status.
     */
    const actionToggle = (): ReactElement => {
        const handleToggle = (e: SyntheticEvent, data: CheckboxProps) => {
            const toggleOperation: string = data.checked ? ActionsConstants.ACTIVATE : ActionsConstants.DEACTIVATE;

            setIsSubmitting(true);
            changeActionStatus(
                actionTypeApiPath,
                actionCommonInitialValues.id,
                toggleOperation)
                .then(() => {
                    handleSuccess(toggleOperation);
                })
                .catch((error: AxiosError) => {
                    handleError(error, toggleOperation);
                })
                .finally(() => {
                    setIsActive(data.checked);
                    mutateAction();
                    setIsSubmitting(false);
                });
        };

        return !isLoading && !showCreateForm && !isEmpty(actions) && (
            <Checkbox
                label={
                    isActive
                        ? t("actions:status.active")
                        : t("actions:status.inactive")
                }
                toggle
                onChange={ handleToggle }
                checked={ isActive }
                readOnly={ !hasActionUpdatePermissions || isSubmitting }
                data-componentId={ `${ _componentId }-${ actionTypeApiPath }-enable-toggle` }
                disabled={ !hasActionUpdatePermissions || isSubmitting }
            />
        );
    };

    const handleDelete = (): void => {
        setIsSubmitting(true);
        deleteAction(actionTypeApiPath, actionCommonInitialValues.id)
            .then(() => {
                handleSuccess(ActionsConstants.DELETE);
                mutateActions();
                history.push(AppConstants.getPaths().get("ACTIONS"));
            })
            .catch((error: AxiosError) => {
                handleError(error, ActionsConstants.DELETE);
            })
            .finally(() => {
                setOpenRevertConfigModal(false);
                setIsSubmitting(false);
            });
    };

    return (
        <PageLayout
            title={ resolveActionTitle(actionTypeApiPath) }
            description={ resolveActionDescription(actionTypeApiPath) }
            backButton={ {
                "data-componentid": `${ _componentId }-${ actionTypeApiPath }-page-back-button`,
                onClick: () => handleBackButtonClick(),
                text: t("actions:goBackActions")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${ _componentId }-${ actionTypeApiPath }-page-layout` }
        >
            { actionToggle() }
            {
                <Grid className="grid-form">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            { actionTypeApiPath === ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_API_PATH && (
                                <PreIssueAccessTokenActionConfigForm
                                    initialValues={ actionCommonInitialValues }
                                    isLoading={ isLoading }
                                    isReadOnly={ isReadOnly() }
                                    actionTypeApiPath={ actionTypeApiPath }
                                    isCreateFormState={ showCreateForm }
                                />
                            )
                            }
                            { actionTypeApiPath === ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH && (
                                <PreUpdatePasswordActionConfigForm
                                    initialValues={ preUpdatePasswordActionInitialValues }
                                    isLoading={ isLoading }
                                    isReadOnly={ isReadOnly() }
                                    actionTypeApiPath={ actionTypeApiPath }
                                    isCreateFormState={ showCreateForm }
                                />
                            )
                            }
                            { actionTypeApiPath === ActionsConstants.PRE_UPDATE_PROFILE_API_PATH && (
                                <PreUpdateProfileActionConfigForm
                                    initialValues={ preUpdateProfileActionInitialValues }
                                    isLoading={ isLoading }
                                    isReadOnly={ isReadOnly() }
                                    actionTypeApiPath={ actionTypeApiPath }
                                    isCreateFormState={ showCreateForm }
                                />
                            )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            }
            { !isLoading && !showCreateForm && !isEmpty(actions) && (
                <Show
                    when={ actionsFeatureConfig?.scopes?.delete }
                >
                    <DangerZoneGroup
                        sectionHeader={ t("actions:dangerZoneGroup.header") }
                    >
                        <DangerZone
                            data-componentid={ `${ _componentId }-danger-zone` }
                            actionTitle={
                                t("actions:dangerZoneGroup.revertConfig.actionTitle")
                            }
                            header={ t("actions:dangerZoneGroup.revertConfig.heading") }
                            subheader={
                                t("actions:dangerZoneGroup.revertConfig.subHeading")
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
                        assertionHint={ t("actions:confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setOpenRevertConfigModal(false) }
                        onPrimaryActionClick={ (): void => handleDelete() }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${ _componentId }-revert-confirmation-modal-header` }
                        >
                            { t("actions:confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={
                                `${ _componentId }revert-confirmation-modal-message`
                            }
                            attached
                            negative
                        >
                            { t("actions:confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("actions:confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </Show>
            ) }
        </PageLayout>
    );
};

export default ActionConfigurationPage;
