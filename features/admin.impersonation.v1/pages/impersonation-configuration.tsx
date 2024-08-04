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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import {
    updateImpersonationConfigurations,
    useImpersonationConfig
} from "../api/impersonation-configuration";
import {
    ImpersonationConfigFormValuesInterface,
    ImpersonationConfigPatchInterface
} from "../models/impersonation-configuration";

/**
 * Props for impersonation Configuration settings page.
 */
type ImpersonationConfigurationPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "impersonation-configuration-form";

/**
 * Impersonation Configuration page.
 */
export const ImpersonationConfigurationPage: FunctionComponent<ImpersonationConfigurationPageInterface> = (
    props: ImpersonationConfigurationPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const isReadOnly: boolean = !useRequiredScopes(
        featureConfig?.server?.scopes?.update
    );

    const dispatch: Dispatch<any> = useDispatch();

    const { t } = useTranslation();

    const [ impersonationConfig, setImpersonationConfig ] =
        useState<ImpersonationConfigFormValuesInterface>(undefined);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: originalImpersonationConfig,
        isLoading: isImpersonationFetchRequestLoading,
        mutate: mutateImpersonationConfig,
        error: impersonationConfigFetchRequestError
    } = useImpersonationConfig();

    useEffect(() => {
        if (
            originalImpersonationConfig instanceof IdentityAppsApiException
            || impersonationConfigFetchRequestError
        ) {
            dispatch(
                addAlert({
                    description: t("impersonation:notifications." +
                    "getConfiguration.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("impersonation:notifications." +
                    "getConfiguration.error.message")
                })
            );

            return;
        }

        if (!originalImpersonationConfig) {
            return;
        }

        setImpersonationConfig({
            enableEmailNotification: originalImpersonationConfig.enableEmailNotification
        });
    }, [ originalImpersonationConfig ]);

    /**
     * Handle Impersonation form submit.
     */
    const handleSubmit = (value: boolean) => {
        const data: ImpersonationConfigPatchInterface[] = [
            {
                operation: "REPLACE",
                path: "/enableEmailNotification",
                value: value
            }
        ];

        setIsSubmitting(true);
        updateImpersonationConfigurations(data).then(() => {
            dispatch(
                addAlert({
                    description: t("impersonation:notifications." +
                    "updateConfiguration.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("impersonation:notifications." +
                    "updateConfiguration.success.message")
                })
            );
        }).catch(() => {
            setIsSubmitting(true);
            dispatch(
                addAlert({
                    description: t("impersonation:notifications." +
                    "updateConfiguration.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("impersonation:notifications." +
                    "updateConfiguration.error.message")
                })
            );
        }).finally(() => {
            setIsSubmitting(false);
            mutateImpersonationConfig();
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
                        data-componentid={ `${componentId}-loading-card` }
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
            title={ t("impersonation:title") }
            pageTitle={ t("impersonation:title") }
            description={ t("impersonation:description") }
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
                                { isImpersonationFetchRequestLoading
                                    ? renderLoadingPlaceholder()
                                    : (
                                        <>
                                            <Form
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ null }
                                                initialValues={ impersonationConfig }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                noValidate={ true }
                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 1 } key={ 1 }>
                                                        <Grid.Column key="enableEmailNotification">
                                                            <Field.Checkbox
                                                                ariaLabel="Enable Email Notification"
                                                                name="enableEmailNotification"
                                                                hint={ t("impersonation:form.enableEmailNotification" +
                                                                    ".hint") }
                                                                label={ t("impersonation:form." +
                                                                    "enableEmailNotification.label") }
                                                                readOnly={
                                                                    isReadOnly || (!isReadOnly && isSubmitting)
                                                                }
                                                                width={ 16 }
                                                                data-componentid={
                                                                    `${componentId}-enable-email-notification`
                                                                }
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
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ImpersonationConfigurationPage.defaultProps = {
    "data-componentid": "impersonation-configuration-page"
};

export default ImpersonationConfigurationPage;
