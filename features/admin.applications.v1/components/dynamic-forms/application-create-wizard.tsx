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

import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import Pagination from "@mui/material/Pagination/Pagination";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    Heading,
    LinkButton,
    Markdown,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import merge from "lodash-es/merge";
import React, { ChangeEvent, FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, ModalProps } from "semantic-ui-react";
import { ApplicationFormDynamicField } from "./application-form-dynamic-field";
import { AppState, TierLimitReachErrorModal } from "../../../admin.core.v1";
import { ModalWithSidePanel } from "../../../admin.core.v1/components/modals/modal-with-side-panel";
import { AppConstants } from "../../../admin.core.v1/constants/app-constants";
import { history } from "../../../admin.core.v1/helpers/history";
import { EventPublisher } from "../../../admin.core.v1/utils/event-publisher";
import { createApplication } from "../../api";
import useGetApplicationTemplate from "../../api/use-get-application-template";
import useGetApplicationTemplateMetadata from "../../api/use-get-application-template-metadata";
import { ApplicationManagementConstants } from "../../constants";
import useApplicationSharingEligibility from "../../hooks/use-application-sharing-eligibility";
import { MainApplicationInterface, URLFragmentTypes } from "../../models";
import { ApplicationTemplateListInterface } from "../../models/application-templates";
import { DynamicFieldInterface } from "../../models/dynamic-fields";
import {
    ApplicationCreateWizardFormInitialValuesInterface,
    ApplicationCreateWizardFormValuesInterface
} from "../../models/form";
import buildCallBackUrlsWithRegExp from "../../utils/build-callback-urls-with-regexp";
import { ApplicationShareModal } from "../modals/application-share-modal";
import "./application-create-wizard.scss";

/**
 * Prop types of the `ApplicationCreateWizard` component.
 */
export interface ApplicationCreateWizardPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * The template to be used for the application creation.
     */
    template: ApplicationTemplateListInterface;
    /**
     * Callback triggered when closing the application creation wizard.
     */
    onClose: () => void;
}

/**
 * Dynamic application create wizard component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationCreateWizard: FunctionComponent<ApplicationCreateWizardPropsInterface> = (
    props: ApplicationCreateWizardPropsInterface
): ReactElement => {
    const { ["data-componentid"]: componentId, template, onClose, ...rest } = props;

    const { data: templateData } = useGetApplicationTemplate(template?.id);
    const { data: templateMetadata } = useGetApplicationTemplateMetadata(template?.id);
    const isApplicationSharable: boolean = useApplicationSharingEligibility();
    const [ alert, setAlert, notification ] = useWizardAlert();

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ installGuideActivePage, setInstallGuideActivePage ] = useState<number>(1);
    const [ showApplicationShareModal, setShowApplicationShareModal ] = useState<boolean>(false);
    const [ lastCreatedApplicationId, setLastCreatedApplicationId ] = useState<string>(null);
    const [ isApplicationSharingEnabled, setIsApplicationSharingEnabled ] = useState<boolean>(false);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);

    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isClientSecretHashEnabled);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * After the application is created, the user will be redirected to the
     * edit page using this function.
     *
     * @param createdAppId - ID of the created application.
     */
    const handleAppCreationComplete = (createdAppId: string): void => {
        // The created resource's id is sent as a location header.
        // If that's available, navigate to the edit page.
        if (!createdAppId) {
            let searchParams: string = "?";
            const defaultTabIndex: number = 0;

            if (isClientSecretHashEnabled) {
                searchParams = `${ searchParams }&${
                    ApplicationManagementConstants.CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY }=true`;
            }

            history.push({
                hash: `#${URLFragmentTypes.TAB_INDEX}${defaultTabIndex}`,
                pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", createdAppId),
                search: searchParams
            });

            return;
        }

        // Fallback to applications page, if the location header is not present.
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    /**
     * This function will navigate the user to the notification message if there are any errors.
     */
    const scrollToNotification = () => {
        document.getElementById("notification-div")?.scrollIntoView({ behavior: "smooth" });
    };

    const onSubmit = (values: ApplicationCreateWizardFormValuesInterface): void => {
        const formValues: Record<string, any> = cloneDeep(values);

        const application: MainApplicationInterface = merge(templateData?.payload, formValues);

        // Moderate Values to match API restrictions.
        if (application.inboundProtocolConfiguration?.oidc?.callbackURLs) {
            application.inboundProtocolConfiguration.oidc.callbackURLs = buildCallBackUrlsWithRegExp(
                application.inboundProtocolConfiguration.oidc.callbackURLs
            );
        }

        createApplication(application)
            .then((response: AxiosResponse) => {
                eventPublisher.compute(() => {
                    eventPublisher.publish("application-register-new-application", {
                        type: templateData?.id
                    });
                });

                dispatch(
                    addAlert({
                        description: t(
                            "applications:notifications." +
                            "addApplication.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "applications:notifications." +
                            "addApplication.success.message"
                        )
                    })
                );

                const location: string = response.headers.location;
                const createdAppID: string = location.substring(location.lastIndexOf("/") + 1);

                if (isApplicationSharingEnabled) {
                    setLastCreatedApplicationId(createdAppID);
                    setShowApplicationShareModal(true);
                } else {
                    handleAppCreationComplete(createdAppID);
                }
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 403
                    && error?.response?.data?.code === ApplicationManagementConstants
                        .ERROR_CREATE_LIMIT_REACHED.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "applications:notifications." +
                            "addApplication.error.message"
                        )
                    });
                    scrollToNotification();

                    return;
                }

                setAlert({
                    description: t(
                        "applications:notifications." +
                        "addApplication.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "applications:notifications." +
                        "addApplication.genericError.message"
                    )
                });
                scrollToNotification();
            });
    };

    let formSubmit: (e: MouseEvent<HTMLButtonElement>) => void;

    if (openLimitReachedModal) {
        return (
            <TierLimitReachErrorModal
                actionLabel={ t(
                    "applications:notifications." +
                    "tierLimitReachedError.emptyPlaceholder.action"
                ) }
                handleModalClose={
                    () => {
                        setOpenLimitReachedModal(false);
                        onClose();
                    }
                }
                header={ t(
                    "applications:notifications.tierLimitReachedError.heading"
                ) }
                description={ t(
                    "applications:notifications." +
                    "tierLimitReachedError.emptyPlaceholder.subtitles"
                ) }
                message={ t(
                    "applications:notifications." +
                    "tierLimitReachedError.emptyPlaceholder.title"
                ) }
                openModal={ openLimitReachedModal }
            />
        );
    }

    if (showApplicationShareModal) {
        return (
            <ApplicationShareModal
                open={ showApplicationShareModal }
                applicationId={ lastCreatedApplicationId }
                onClose={ () => setShowApplicationShareModal(false) }
                onApplicationSharingCompleted={ () => {
                    setShowApplicationShareModal(false);
                    handleAppCreationComplete(lastCreatedApplicationId);
                    setLastCreatedApplicationId(null);
                } }
            />
        );
    }

    return (
        <ModalWithSidePanel
            className="wizard application-create-wizard"
            dimmer="blurring"
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ componentId }
            onClose={ onClose }
            { ...rest }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { template.name }
                    <Heading as="h6">{ template.description }</Heading>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    {
                        alert && (
                            <div id="notification-div" className="wizard-error">
                                { notification }
                            </div>
                        )
                    }
                    <FinalForm
                        initialValues={ templateData?.payload }
                        onSubmit={ onSubmit }
                        mutators={ {
                            setFormAttribute: (
                                [ fieldName, fieldVal ]: [ fieldName: string, fieldVal: any ],
                                state: MutableState<
                                    ApplicationCreateWizardFormValuesInterface,
                                    ApplicationCreateWizardFormInitialValuesInterface
                                >,
                                { changeValue }: Tools<
                                    ApplicationCreateWizardFormValuesInterface,
                                    ApplicationCreateWizardFormInitialValuesInterface
                                >
                            ) => {
                                changeValue(state, fieldName, () => fieldVal);
                            }
                        } }
                        render={ ({ form, handleSubmit }: FormRenderProps) => {
                            formSubmit = handleSubmit;

                            return (
                                <form id={ `${templateData?.id}-form` } onSubmit={ handleSubmit }>
                                    { templateMetadata?.create?.form?.fields.map((field: DynamicFieldInterface) => {
                                        return (
                                            <ApplicationFormDynamicField
                                                key={ field?.id }
                                                field={ field }
                                                form={ form }
                                            />
                                        );
                                    }) }
                                </form>
                            );
                        } }
                    />
                    { templateMetadata?.create?.isApplicationSharable && isApplicationSharable && (
                        <FormControl component="fieldset" variant="standard" margin="dense">
                            <FormControlLabel
                                control={ (
                                    <Checkbox
                                        color="primary"
                                        checked={ isApplicationSharingEnabled }
                                        onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                            setIsApplicationSharingEnabled(e.target.checked);
                                        } }
                                    />
                                ) }
                                label={ t("applications:forms.generalDetails.fields.isSharingEnabled.label") }
                            />
                        </FormControl>
                    ) }
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ onClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    onClick={ (e: MouseEvent<HTMLButtonElement>) => formSubmit(e) }
                                    floated="right"
                                    data-componentid={ `${componentId}-next-button` }
                                >
                                    { t("common:create") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { templateMetadata?.create?.guide && (
                <ModalWithSidePanel.SidePanel>
                    <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                        <div className="help-panel-header-text">
                            { t("applications:wizards.minimalAppCreationWizard.help.heading") }
                        </div>
                    </ModalWithSidePanel.Header>
                    <ModalWithSidePanel.Content className="installation-guide-content">
                        { Array.isArray(templateMetadata?.create?.guide) && (
                            <>
                                <Markdown
                                    source={ templateMetadata.create.guide[installGuideActivePage - 1].content }
                                />
                                { templateMetadata.create.guide.length > 1 && (
                                    <div className="installation-guide-stepper">
                                        <div className="installation-guide-stepper-progress">
                                            <Typography variant="body3">
                                                Page { installGuideActivePage } of{ " " }
                                                { templateMetadata.create.guide.length }
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    (installGuideActivePage /
                                                        templateMetadata.create.guide.length) *
                                                    100
                                                }
                                            />
                                        </div>
                                        <Pagination
                                            siblingCount={ 0 }
                                            boundaryCount={ 0 }
                                            count={ templateMetadata.create.guide.length }
                                            variant="outlined"
                                            shape="rounded"
                                            className="installation-guide-stepper-pagination"
                                            onChange={ (_: ChangeEvent, page: number) => {
                                                setInstallGuideActivePage(page);
                                            } }
                                        />
                                    </div>
                                ) }
                            </>
                        ) }
                    </ModalWithSidePanel.Content>
                </ModalWithSidePanel.SidePanel>
            ) }
        </ModalWithSidePanel>
    );
};

/**
 * Default props for the application creation wizard.
 */
ApplicationCreateWizard.defaultProps = {
    "data-componentid": "application-create-wizard"
};
