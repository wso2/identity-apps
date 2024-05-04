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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Heading, PrimaryButton } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon } from "semantic-ui-react";
import { updateFidoTrustedApps, useFIDOTrustedApps } from "../../../../api/fido-trusted-apps";
import { IdentityProviderManagementConstants } from "../../../../constants";
import { FIDOTrustedAppsValuesInterface } from "../../../../models";
import { FIDOTrustedAppsList } from "./fido-trusted-apps-list";

/**
 * Interface for the `FIDOTrustedApps` component props.
 */
interface FIDOTrustedAppsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the trusted apps are read-only or not.
     */
    readOnly: boolean;
    /**
     * Provide an external function for calling the submission.
     *
     * @param submissionCallback - Function responsible for actual submission, which should be
     * invoked to submit form values. It returns a promise indicating whether the submission
     * was successful or not.
     */
    triggerSubmission: (submissionCallback: () => Promise<boolean>) => void;
}

/**
 * Component for Configuring FIDO Trusted Apps.
 *
 * @param props - Props injected to the component.
 * @returns `FIDOTrustedApps` component.
 */
export const FIDOTrustedApps: FunctionComponent<FIDOTrustedAppsPropsInterface> = (
    props: FIDOTrustedAppsPropsInterface
): ReactElement => {

    const {
        readOnly,
        triggerSubmission,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ FIDOTrustedApps, setFIDOTrustedApps ] = useState<FIDOTrustedAppsValuesInterface>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ hideTrustedAppsButton, setHideTrustedAppsButton ] = useState<boolean>(true);
    const [ isTrustedAppsAddWizardOpen, setIsTrustedAppsAddWizardOpen ] = useState<boolean>(false);

    const {
        data: fidoTrustedApps,
        isLoading: fidoTrustedAppsFetchRequestIsLoading,
        error: fidoTrustedAppsFetchError,
        mutate: mutateFIDOTrustedApps
    } = useFIDOTrustedApps();

    /**
     * Retrieve the list of FIDO trusted apps from the response data.
     */
    const initialFIDOTrustedAppsList: FIDOTrustedAppsValuesInterface = useMemo(() => {
        if (fidoTrustedAppsFetchRequestIsLoading) {
            return null;
        }

        if (fidoTrustedApps) {
            const trustedApps: FIDOTrustedAppsValuesInterface = {
                android: {},
                ios: {}
            };

            if (fidoTrustedApps?.android
                && Array.isArray(fidoTrustedApps?.android)
                && fidoTrustedApps?.android?.length > 0) {
                fidoTrustedApps?.android?.forEach((app: string) => {
                    if (app) {
                        const appData: string[] = app?.split(
                            IdentityProviderManagementConstants.FIDO_TRUSTED_APPS_SHA_SEPARATOR);

                        if (!trustedApps?.android?.[appData[0]]) {
                            trustedApps.android[appData[0]] = [];
                        }

                        if (appData?.length > 1) {
                            trustedApps.android[appData[0]].push(appData[1]);
                        }
                    }
                });
            }
            if (fidoTrustedApps?.ios
                && Array.isArray(fidoTrustedApps?.ios)
                && fidoTrustedApps?.ios?.length > 0) {
                fidoTrustedApps?.ios?.forEach((app: string) => {
                    if (app) {
                        if (!trustedApps?.ios?.[app]) {
                            trustedApps.ios[app] = [];
                        }
                    }
                });
            }

            if (Object.keys(trustedApps?.android)?.length > 0 || Object.keys(trustedApps?.ios)?.length > 0) {
                return trustedApps;
            }
        }

        return null;
    }, [ fidoTrustedApps ]);

    /**
     * Check whether to hide the trusted app addition button.
     */
    useEffect(() => {
        setHideTrustedAppsButton(
            readOnly || !!fidoTrustedAppsFetchError || !FIDOTrustedApps || (
                Object.keys(FIDOTrustedApps?.android)?.length === 0 &&
                Object.keys(FIDOTrustedApps?.ios)?.length === 0
            )
        );
    }, [ FIDOTrustedApps, readOnly, fidoTrustedAppsFetchError ]);

    /**
     * Handle errors that occur during the FIDO trusted apps fetch request.
     */
    useEffect(() => {
        if (!fidoTrustedAppsFetchError) {
            return;
        }

        if (fidoTrustedAppsFetchError?.response?.data?.description) {
            dispatch(addAlert({
                description: fidoTrustedAppsFetchError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications.getFIDOTrustedApps.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("authenticationProvider:notifications." +
                "getFIDOTrustedApps.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("authenticationProvider:notifications." +
                "getFIDOTrustedApps.genericError.message")
        }));
    }, [ fidoTrustedAppsFetchError ]);

    /**
     * Update FIDO trusted apps.
     */
    const updateFIDOTrustedApps = (): Promise<boolean> => {
        if (!FIDOTrustedApps) {
            return;
        }

        setIsSubmitting(true);

        const androidApps: string[] = [];

        for (const appName in FIDOTrustedApps?.android) {
            androidApps?.push(`${appName}${
                IdentityProviderManagementConstants.FIDO_TRUSTED_APPS_SHA_SEPARATOR
            }${FIDOTrustedApps?.android?.[appName]?.join(
                IdentityProviderManagementConstants.FIDO_TRUSTED_APPS_SHA_SEPARATOR)}`);
        }

        const iosApps: string[] = Object.keys(FIDOTrustedApps?.ios);

        return updateFidoTrustedApps({ android: androidApps, ios: iosApps })
            .then(() => {
                addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateFIDOTrustedApps." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "updateFIDOTrustedApps.success.message")
                });

                mutateFIDOTrustedApps();

                return true;
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    addAlert({
                        description: t("authenticationProvider:" +
                            "notifications.updateFIDOTrustedApps." +
                            "error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "updateFIDOTrustedApps.error.message")
                    });

                    return false;
                }

                addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateFIDOTrustedApps." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:" +
                        "notifications.updateFIDOTrustedApps." +
                        "genericError.message")
                });

                return false;
            })
            .finally(() => setIsSubmitting(false));
    };

    /**
     * Expose the function to call the submit action.
     */
    useEffect(() => {
        triggerSubmission(updateFIDOTrustedApps);
    }, []);

    return (
        <Fragment>
            <EmphasizedSegment
                padded="very"
                loading={ fidoTrustedAppsFetchRequestIsLoading }
                data-componentid={ `${componentId}-fido-trusted-apps-list` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column className="heading-wrapper" computer={ 10 } mobile={ 12 }>
                            <Heading as="h4">
                                { t("authenticationProvider:forms.authenticatorSettings.fido2.trustedApps.heading") }
                            </Heading>
                            <Heading subHeading ellipsis as="h6" >
                                { t("authenticationProvider:forms.authenticatorSettings.fido2.trustedApps.subHeading") }
                            </Heading>
                        </Grid.Column>
                        <Grid.Column computer={ 4 } mobile={ 6 }>
                            {
                                !hideTrustedAppsButton
                                && (
                                    <PrimaryButton
                                        data-componentid={ "fido-trusted-apps-add-button" }
                                        basic
                                        size="medium"
                                        floated="right"
                                        onClick={ (): void => setIsTrustedAppsAddWizardOpen(true) }
                                    >
                                        <Icon name="add" />
                                        { t("authenticationProvider:forms.authenticatorSettings." +
                                            "fido2.trustedApps.buttons.addButton") }
                                    </PrimaryButton>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <FIDOTrustedAppsList
                    trustedApps={ FIDOTrustedApps }
                    setTrustedApps={ setFIDOTrustedApps }
                    isTrustedAppsFetchErrorOccurred={ !!fidoTrustedAppsFetchError }
                    readOnly={ readOnly }
                    setIsTrustedAppsAddWizardOpen={ setIsTrustedAppsAddWizardOpen }
                />
            </EmphasizedSegment>
            {/* {
                removeSubscribedAPIResource && (
                    <ConfirmationModal
                        primaryActionLoading={ isUnsubscribeAPIResourceLoading }
                        open={ removeSubscribedAPIResource !== null }
                        onClose={ (): void => setRemoveSubscribedAPIResource(null) }
                        type="negative"
                        assertionHint={ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                            ".apiSubscriptions.confirmations.unsubscribeAPIResource.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setRemoveSubscribedAPIResource(null) }
                        onPrimaryActionClick={ (): void => handleAPIResourceUnsubscribe() }
                        data-componentid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                isAuthorizeAPIResourceWizardOpen && (
                    <AuthorizeAPIResource
                        templateId={ templateId }
                        subscribedAPIResourcesListData={ subscribedAPIResourcesListData }
                        closeWizard={ (): void => setIsAuthorizeAPIResourceWizardOpen(false) }
                        handleCreateAPIResource= { handleCreateAPIResource } />
                )
            } */}
        </Fragment>
    );
};

/**
 * Default props for the component.
 */
FIDOTrustedApps.defaultProps = {
    "data-componentid": "fido-trusted-apps"
};
