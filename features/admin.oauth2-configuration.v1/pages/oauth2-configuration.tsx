/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import {
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import { revertOAuth2Configurations, updateOAuth2Configurations, useOAuth2Config } from "../api/oauth2-configuration";
import {
    OAuth2ConfigAPIResponseInterface,
    OAuth2ConfigFormErrorValidationsInterface,
    OAuth2ConfigFormValuesInterface
} from "../models/oauth2-configuration";

/**
 * Props for OAuth2 configuration settings page.
 */
type OAuth2ConfigurationPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "oauth2-config-form";

/**
 * OAuth2 configuration page.
 */
export const OAuth2ConfigurationPage: FunctionComponent<OAuth2ConfigurationPageInterface> = (
    props: OAuth2ConfigurationPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const isReadOnly: boolean = !useRequiredScopes(
        featureConfig?.governanceConnectors?.scopes?.update
    );

    const dispatch: Dispatch<any> = useDispatch();

    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ oauth2Config , setOAuth2Config ] =
        useState<OAuth2ConfigFormValuesInterface>(undefined);

    const {
        data: originalOAuth2Config,
        isLoading: isOAuth2FetchRequestLoading,
        mutate: mutateOAuth2Config,
        error: oauth2ConfigFetchRequestError
    } = useOAuth2Config();

    useEffect(() => {
        if (originalOAuth2Config instanceof IdentityAppsApiException
            || oauth2ConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalOAuth2Config) {
            return;
        }

        setOAuth2Config({
            preserveSessionAtPasswordUpdate: originalOAuth2Config.preserveSessionAtPasswordUpdate ?? false
        });
    }, [ originalOAuth2Config ]);

    /**
     * Displays the error banner when unable to fetch OAuth2 configuration configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("oauth2Config:notifications." +
                "getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("oauth2Config:notifications." +
                "getConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when OAuth2 configuration configurations are updated.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("oauth2Config:notifications." +
                "updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("oauth2Config:notifications." +
                "updateConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the sucess banner when OAuth2 configuration configurations are reverted.
     */
    const handleRevertSuccess = () => {
        dispatch(
            addAlert({
                description: t("oauth2Config:notifications." +
                    "revertConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("oauth2Config:notifications." +
                    "revertConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to update OAuth2 configuration configurations.
     */
    const handleUpdateError = () => {
        dispatch(
            addAlert({
                description: t("oauth2Config:notifications." +
                "updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("oauth2Config:notifications." +
                "updateConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to revert OAuth2 configuration configurations.
     */
    const handlerevertError = () => {
        dispatch(
            addAlert({
                description: t("oauth2Config:notifications." +
                    "revertConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("oauth2Config:notifications." +
                    "revertConfiguration.error.message")
            })
        );
    };

    /**
     * Validate input data.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (
        values: OAuth2ConfigFormValuesInterface
    ): OAuth2ConfigFormErrorValidationsInterface => {
        const error: OAuth2ConfigFormErrorValidationsInterface = {
            preserveSessionAtPasswordUpdate: undefined
        };

        return error;
    };

    /**
     * Handle OAuth2 configuration form submit.
     */
    const handleSubmit = (values: OAuth2ConfigFormValuesInterface) => {
        setIsSubmitting(true);

        const data: OAuth2ConfigAPIResponseInterface = {
            preserveSessionAtPasswordUpdate: values.preserveSessionAtPasswordUpdate
        };

        updateOAuth2Configurations(data).then(() => {
            handleUpdateSuccess();
        }).catch(() => {
            handleUpdateError();
        }).finally(() => {
            setIsSubmitting(false);
            mutateOAuth2Config();
        });
    };

    /**
     * Handle OAuth2 configuration revert.
     */
    const onConfigRevert = (): void => {
        setIsSubmitting(true);

        revertOAuth2Configurations()
            .then(() => {
                handleRevertSuccess();
            }).catch(() => {
                handlerevertError();
            }).finally(() => {
                setIsSubmitting(false);
                mutateOAuth2Config();
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
            title={ t("oauth2Config:title") }
            pageTitle={ t("oauth2Config:title") }
            description={ t("oauth2Config:description") }
            backButton={ {
                onClick: () => onBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            data-componentid={ `${ componentId }-form-layout` }
            pageHeaderMaxWidth
        >
            <Ref innerRef={ pageContextRef }>
                <Grid className={ "mt-2" } >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                { isOAuth2FetchRequestLoading
                                    ? renderLoadingPlaceholder()
                                    : (
                                        <>
                                            <Form
                                                key={ JSON.stringify(oauth2Config) || "empty" }
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ handleSubmit }
                                                initialValues={ oauth2Config }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                validate={ validateForm }
                                                autoComplete="new-password"
                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 1 } key={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <Field.Checkbox
                                                                ariaLabel={ t("oauth2Config:form." +
                                                                "preserveSessionAtPasswordUpdate.label") }
                                                                name="preserveSessionAtPasswordUpdate"
                                                                label={ t("oauth2Config:form." +
                                                                    "preserveSessionAtPasswordUpdate.label") }
                                                                hint={ t("oauth2Config:form." +
                                                                    "preserveSessionAtPasswordUpdate.hint") }
                                                                readOnly={ isReadOnly }
                                                                data-componentid={ `${componentId}-
                                                                    preserve-session-at-password-update` }
                                                                toggle
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form>
                                            {
                                                !isReadOnly && (
                                                    <>
                                                        <Divider hidden />
                                                        <Grid.Row columns={ 1 } className="mt-6">
                                                            <Grid.Column width={ 10 }>
                                                                <PrimaryButton
                                                                    size="small"
                                                                    loading={ isSubmitting }
                                                                    onClick={ () => {
                                                                        formRef?.current?.triggerSubmit();
                                                                    } }
                                                                    ariaLabel="OAuth2 configuration form update button"
                                                                    data-componentid={
                                                                        `${ componentId }-update-button`
                                                                    }
                                                                >
                                                                    { t("common:update") }
                                                                </PrimaryButton>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                    { !isReadOnly && (
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
                    ) }
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OAuth2ConfigurationPage.defaultProps = {
    "data-componentid": "oauth2-configuration-settings-page"
};

export default OAuth2ConfigurationPage;
