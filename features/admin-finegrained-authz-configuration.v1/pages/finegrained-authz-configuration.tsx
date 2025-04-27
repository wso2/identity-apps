/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { AppConstants  } from "@wso2is/admin.core.v1/constants/app-constants";
import {  history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface  } from "@wso2is/admin.core.v1/models/config";
import {  AppState  } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { ContentLoader, EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Ref } from "semantic-ui-react";
import {
    updateFineGrainedAuthzConfig,
    useFineGrainedAuthzConfig
} from "../api/finegrained-authz-configuration";
import {
    FineGrainedAuthzConfigFormValuesInterface,
    FineGrainedAuthzConfigAPIResponseInterface
} from "../models/finegrained-authz-configuration";
import { title } from "process";
import { Page } from "@wso2is/i18n";

/**
 * Props for Fine Grained Authz Configuration page.
 */
type FineGrainedAuthzConfigurationPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "fine-grained-authz-configuration-form";

/**
 * Fine Grained Authz Configuration page.
 */
export const FineGrainedAuthzConfigurationPage: FunctionComponent<FineGrainedAuthzConfigurationPageInterface> = (
    props: FineGrainedAuthzConfigurationPageInterface
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

    const [ fineGrainedAuthzConfig, setFineGrainedAuthzConfig ] =
        useState<FineGrainedAuthzConfigFormValuesInterface>(undefined);

    const {
        data: originalFineGrainedAuthzConfig,
        isLoading: isFineGrainedAuthzConfigFetchRequestLoading,
        error: fineGrainedAuthzConfigFetchRequestError,
        mutate: mutateFineGrainedAuthzConfig
    } = useFineGrainedAuthzConfig();


    useEffect(() => {
        if ( originalFineGrainedAuthzConfig instanceof IdentityAppsApiException ||
            fineGrainedAuthzConfigFetchRequestError
        ) {
            dispatch(addAlert({
                description: t("fineGrainedAuthzConfiguration: notifications." +
                    "getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("fineGrainedAuthzConfiguration: notifications." 
                    + "getConfiguration.error.message")
            }));

            return;
        }
            
        if (!originalFineGrainedAuthzConfig) {
            return;
        }

        setFineGrainedAuthzConfig({
            enableFineGrainedAuthz: originalFineGrainedAuthzConfig.enableFineGrainedAuthz
        });
    }, [originalFineGrainedAuthzConfig]);

    /**
     * Displayes the error banner when unable to fetch the update fine grained authz config.
     */
    const handleUpdateError = () => {
        dispatch(
            addAlert({
                description: t("fineGrainedAuthzConfiguration:notifications." +
                "updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("fineGrainedAuthzConfiguration:notifications." +
                "updateConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the success banner when the update fine grained authz config is successful.
     */
        const handleUpdateSuccess = () => {
            dispatch(
                addAlert({
                    description: t("fineGrainedAuthzConfiguration:notifications." +
                    "updateConfiguration.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("fineGrainedAuthzConfiguration:notifications." +
                    "updateConfiguration.success.message")
                })
            );
        };


    const handleSubmit = (value: boolean) => {
        const data: FineGrainedAuthzConfigAPIResponseInterface = {
            enableFineGrainedAuthz: value
        };

        updateFineGrainedAuthzConfig(data).then(() => {
            handleUpdateSuccess();
        }).catch(() => {
            handleUpdateError();
        }).finally(() => {
            mutateFineGrainedAuthzConfig();
        });
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    return (
        <PageLayout
            title={ t("fineGrainedAuthzConfig:title") }
            pageTitle={ t("fineGrainedAuthzConfig:title") }
            description={ t("fineGrainedAuthzConfig:description") }
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
                                { isFineGrainedAuthzConfigFetchRequestLoading
                                    ? (
                                        <ContentLoader />
                                    )
                                    : (
                                        <>
                                            <Form
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ null }
                                                initialValues={ fineGrainedAuthzConfig }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                noValidate={ true }
                                            >
                                                <Grid>
                                                <Grid.Row columns={ 1 } key={ 1 }>
                                                <Grid.Column key="">
                                                    <Field.Checkbox
                                                        ariaLabel="Enable Fine Grained Authorization"
                                                        name="enableFineGrainedAuthz"
                                                        hint={ t("fineGrainedAuthzConfig:form.enableFineGrainedAuthz" +
                                                            ".hint") }
                                                        label={ t("fineGrainedAuthzConfig:form." +
                                                            "enableFineGrainedAuthz.label") }
                                                        readOnly={
                                                            isReadOnly
                                                        }
                                                        width={ 16 }
                                                        data-componentid={
                                                            `${componentId}-enable-fine-grained-authz`
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


FineGrainedAuthzConfigurationPage.defaultProps = {
    "data-componentid": "fine-grained-authz-configuration-page"
};

export default FineGrainedAuthzConfigurationPage;