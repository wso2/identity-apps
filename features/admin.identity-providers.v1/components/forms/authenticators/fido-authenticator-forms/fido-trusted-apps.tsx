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
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon } from "semantic-ui-react";
import { FIDOTrustedAppWizard } from "./fido-trusted-app-wizard";
import { FIDOTrustedAppsList } from "./fido-trusted-apps-list";
import { updateFidoTrustedApps, useFIDOTrustedApps } from "../../../../api/fido-trusted-apps";
import { IdentityProviderManagementConstants } from "../../../../constants";
import { FIDOTrustedAppTypes, FIDOTrustedAppsValuesInterface } from "../../../../models";

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
    triggerSubmission: (submissionCallback: (callback: () => void) => void) => void;
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
        const trustedApps: FIDOTrustedAppsValuesInterface = {
            android: {},
            ios: {}
        };

        if (fidoTrustedAppsFetchRequestIsLoading) {
            setFIDOTrustedApps(trustedApps);

            return trustedApps;
        }

        if (fidoTrustedApps) {
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
        }

        setFIDOTrustedApps(trustedApps);

        return trustedApps;
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
    const updateFIDOTrustedApps = (callback: () => void) => {
        if (!FIDOTrustedApps || isEqual(FIDOTrustedApps, initialFIDOTrustedAppsList)) {
            callback();

            return;
        }

        const androidApps: string[] = [];

        for (const appName in FIDOTrustedApps?.android) {
            if (FIDOTrustedApps?.android?.[appName]?.length > 0) {
                FIDOTrustedApps?.android?.[appName]?.forEach((hash: string) => {
                    androidApps?.push(`${appName}${
                        IdentityProviderManagementConstants.FIDO_TRUSTED_APPS_SHA_SEPARATOR
                    }${hash}`);
                });
            } else {
                androidApps?.push(appName);
            }
        }

        const iosApps: string[] = Object.keys(FIDOTrustedApps?.ios);

        updateFidoTrustedApps({ android: androidApps, ios: iosApps })
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateFIDOTrustedApps." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "updateFIDOTrustedApps.success.message")
                }));

                mutateFIDOTrustedApps();
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: t("authenticationProvider:" +
                            "notifications.updateFIDOTrustedApps." +
                            "error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "updateFIDOTrustedApps.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateFIDOTrustedApps." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:" +
                        "notifications.updateFIDOTrustedApps." +
                        "genericError.message")
                }));
            }).finally(() => callback());
    };

    /**
     * Expose the function to call the submit action.
     */
    triggerSubmission(updateFIDOTrustedApps);

    /**
     * Update the current list of trusted apps with the given app.
     *
     * @param appName - Name of the updating app.
     * @param appType - Type of the updating app.
     * @param deleteApp - Whether the app should be removed.
     * @param shaValues - SHA values associated with the app.
     */
    const updateCurrentTrustedAppsList = (
        appName: string,
        appType: FIDOTrustedAppTypes,
        deleteApp?: boolean,
        shaValues?: string[]
    ) => {
        const clonedTrustedApps: FIDOTrustedAppsValuesInterface = cloneDeep(FIDOTrustedApps);

        if (deleteApp) {
            delete clonedTrustedApps?.[appType]?.[appName];
        } else {
            if (!clonedTrustedApps?.[appType]?.[appName]) {
                clonedTrustedApps[appType][appName] = [];
            }

            if (shaValues) {
                clonedTrustedApps[appType][appName] = shaValues;
            }
        }

        setFIDOTrustedApps(clonedTrustedApps);
    };

    return (
        <Fragment>
            <EmphasizedSegment
                padded="very"
                loading={ fidoTrustedAppsFetchRequestIsLoading }
                data-componentid={ `${componentId}-fido-trusted-apps-list` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column className="heading-wrapper" computer={ 12 } mobile={ 14 }>
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
                                        type="button"
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
                    updateTrustedApps={ updateCurrentTrustedAppsList }
                    isTrustedAppsFetchErrorOccurred={ !!fidoTrustedAppsFetchError }
                    readOnly={ readOnly }
                    setIsTrustedAppsAddWizardOpen={ setIsTrustedAppsAddWizardOpen }
                />
            </EmphasizedSegment>
            {
                isTrustedAppsAddWizardOpen && (
                    <FIDOTrustedAppWizard
                        trustedApps={ FIDOTrustedApps }
                        closeWizard={ (): void => setIsTrustedAppsAddWizardOpen(false) }
                        updateTrustedApps={ updateCurrentTrustedAppsList }
                    />
                )
            }
        </Fragment>
    );
};

/**
 * Default props for the component.
 */
FIDOTrustedApps.defaultProps = {
    "data-componentid": "fido-trusted-apps"
};
