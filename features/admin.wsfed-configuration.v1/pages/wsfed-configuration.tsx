/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {  FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { DangerZone, DangerZoneGroup, EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import { revertWSFederationConfigurations,
    updateWSFederationConfigurations,
    useWSFederationConfig
} from "../api/wsfed-configuration";
import {
    WSFederationConfigAPIResponseInterface,
    WSFederationConfigFormValuesInterface
} from "../models/wsfed-configuration";

/**
 * Props for WSFederation Configuration settings page.
 */
type WSFederationConfigurationPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "wsfederation-configuration-form";

/**
 * WSFederation Configuration page.
 */
export const WSFederationConfigurationPage: FunctionComponent<WSFederationConfigurationPageInterface> = (
    props: WSFederationConfigurationPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes : string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly : boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.server,
        featureConfig?.server?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    const dispatch : Dispatch<any> = useDispatch();

    const { t } = useTranslation();

    const [ wsFederationConfig , setWSFederationConfig ] =
        useState<WSFederationConfigFormValuesInterface>(undefined);

    const {
        data: originalWSFederationConfig,
        isLoading: isWSFederationFetchRequestLoading,
        mutate: mutateWSFederationConfig,
        error: wsFederationConfigFetchRequestError
    } = useWSFederationConfig();

    useEffect(() => {
        if (originalWSFederationConfig instanceof IdentityAppsApiException
            || wsFederationConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalWSFederationConfig) {
            return;
        }

        setWSFederationConfig({
            enableRequestSigning: originalWSFederationConfig.enableRequestSigning
        });
    }, [ originalWSFederationConfig ]);

    /**
     * Displays the error banner when unable to fetch WSFederation configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("wsFederationConfig:notifications." +
                "getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("wsFederationConfig:notifications." +
                "getConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when WSFederation configurations are updated.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("wsFederationConfig:notifications." +
                "updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("wsFederationConfig:notifications." +
                "updateConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to update WSFederation configurations.
     */
    const handleUpdateError = () => {
        dispatch(
            addAlert({
                description: t("wsFederationConfig:notifications." +
                "updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("wsFederationConfig:notifications." +
                "updateConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the success banner when WSFederation configurations are reverted.
     */
    const handleRevertSuccess = () => {
        dispatch(
            addAlert({
                description: t("wsFederationConfig:notifications." +
                "revertConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("wsFederationConfig:notifications." +
                "revertConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to revert WSFederation configurations.
     */
    const handleRevertError = () => {
        dispatch(
            addAlert({
                description: t("wsFederationConfig:notifications." +
                "revertConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("wsFederationConfig:notifications." +
                "revertConfiguration.error.message")
            })
        );
    };

    /**
     * Handle WSFederation form submit.
     */
    const handleSubmit = (value: boolean) => {
        const data: WSFederationConfigAPIResponseInterface = {
            enableRequestSigning: value
        };

        updateWSFederationConfigurations(data).then(() => {
            handleUpdateSuccess();
        }).catch(() => {
            handleUpdateError();
        }).finally(() => {
            mutateWSFederationConfig();
        });
    };

    /**
     * Handle WSFederation configuration revert.
     */
    const onConfigRevert = (): void => {
        revertWSFederationConfigurations().then(() => {
            handleRevertSuccess();
        }).catch(() => {
            handleRevertError();
        }).finally(() => {
            mutateWSFederationConfig();
        });
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * This function returns loading placeholder.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        return (
            <Grid.Row columns={ 1 }>
                <div>
                    <div
                        className="ui card fluid settings-card"
                        data-testid={ `${componentId}-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                                <Divider hidden />
                            </div>
                        </div>
                        <div className="content extra extra-content">
                            <div className="action-button">
                                <Placeholder>
                                    <Placeholder.Line length="very short" />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                    <Divider hidden/>
                </div>
            </Grid.Row>
        );
    };

    return (
        <PageLayout
            title={ t("wsFederationConfig:title") }
            pageTitle={ t("wsFederationConfig:title") }
            description={ t("wsFederationConfig:description") }
            backButton={ {
                onClick: () => onBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid className={ "mt-2" } >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                { isWSFederationFetchRequestLoading
                                    ? renderLoadingPlaceholder()
                                    : (
                                        <>
                                            <Form
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ null }
                                                initialValues={ wsFederationConfig }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                noValidate={ true }
                                                autoComplete="new-password"
                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 1 } key={ 1 }>
                                                        <Grid.Column key="enableRequestSigning">
                                                            <Field.Checkbox
                                                                ariaLabel="Enable Authentication Requests Signing"
                                                                name="enableRequestSigning"
                                                                label={ t("wsFederationConfig:form." +
                                                                    "enableRequestSigning.label") }
                                                                readOnly={ isReadOnly }
                                                                width={ 16 }
                                                                data-componentid={
                                                                    `${componentId}-enable-request-signing` }
                                                                toggle
                                                                listen={ (value: boolean) => {
                                                                    handleSubmit(value);
                                                                } }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form>
                                        </>
                                    )
                                }
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 } className="mt-6">
                        <Grid.Column width={ 16 }>
                            <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                                <DangerZone
                                    actionTitle= { t("governanceConnectors:dangerZone.actionTitle") }
                                    header= { t("governanceConnectors:dangerZone.heading") }
                                    subheader= { t("governanceConnectors:dangerZone.subHeading") }
                                    onActionClick={ () => onConfigRevert() }
                                    data-testid={ `${ componentId }-danger-zone` }
                                />
                            </DangerZoneGroup>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
WSFederationConfigurationPage.defaultProps = {
    "data-componentid": "wsfederation-configuration-page"
};

export default WSFederationConfigurationPage;
