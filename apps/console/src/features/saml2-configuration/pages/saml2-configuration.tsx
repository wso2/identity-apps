/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { EmphasizedSegment, PageLayout, PrimaryButton, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import { ApplicationManagementUtils } from "../../applications/utils/application-management-utils";
import { AppState, FeatureConfigInterface } from "../../core";
import { useSaml2Config } from "../api/saml2-configuration";
import { Saml2ConfigurationConstants } from "../constants/saml2-configuration";
import {
    Saml2ConfigFormErrorValidationsInterface,
    Saml2ConfigFormValuesInterface
} from "../models/saml2-configuration";

/**
 * Props for saml2 configuration settings page.
 */
type Saml2ConfigurationPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "saml2-config-form";

/**
 * saml2 configuration page.
 */
export const Saml2ConfigurationPage: FunctionComponent<Saml2ConfigurationPageInterface> = (
    props: Saml2ConfigurationPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);
    const url: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes : string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    
    const isReadOnly : boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.residentIdp,
        featureConfig?.residentIdp?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    const dispatch : Dispatch<any> = useDispatch();

    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ saml2Config , setSaml2Config ] = 
        useState<Saml2ConfigFormValuesInterface>(undefined);
    const [ destinationUrls, setDestinationUrls ] = useState("");
    const [ showURLError, setShowURLError ] = useState(false);

    const {
        data: originalSaml2Config,
        isLoading: isSaml2FetchRequestLoading,
        mutate: mutateSaml2Config,
        error: saml2ConfigFetchRequestError
    } = useSaml2Config();

    useEffect(() => {
        if (originalSaml2Config instanceof IdentityAppsApiException 
            || saml2ConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalSaml2Config) {
            return;
        }        

        setSaml2Config({
            destinationURLs: originalSaml2Config.destinationURLs ?? [],
            enableMetadataSigning: originalSaml2Config.enableMetadataSigning ?? false,
            metadataValidityPeriod: originalSaml2Config.metadataValidityPeriod ?? 0
        });
    }, [ originalSaml2Config ]);

    /**
     * Displays the error banner when unable to fetch saml2 configuration configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("console:saml2Config.notifications." +
                "getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:saml2Config.notifications." +
                "getConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when saml2 configuration configurations are updated.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("console:saml2Config.notifications." +
                "updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:saml2Config.notifications." +
                "updateConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to update saml2 configuration configurations.
     */
    const handleUpdateError = () => {
        dispatch(
            addAlert({
                description: t("console:saml2Config.notifications." +
                "updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:saml2Config.notifications." +
                "updateConfiguration.error.message")
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
        values: Saml2ConfigFormValuesInterface
    ): Saml2ConfigFormErrorValidationsInterface => {
        const error: Saml2ConfigFormErrorValidationsInterface = {
            destinationURLs: undefined,
            metadataValidityPeriod: undefined
        };

        if (values?.metadataValidityPeriod && (!FormValidation.isInteger(values.metadataValidityPeriod as number)
            || values.metadataValidityPeriod as number < 0)) {
            error.metadataValidityPeriod = t(
                "console:saml2Config.form.validation.metadataValidityPeriod"
            );
        }

        if (values?.destinationURLs && values.destinationURLs.length > 0) {
            error.destinationURLs = t(
                "console:saml2Config.form.validation.destinationURLs"
            );
        }

        return error;
    };

    /**
     * Handle saml2 configuration form submit.
     */
    const handleSubmit = (values: Saml2ConfigFormValuesInterface) => {
        // setIsSubmitting(true);
        const data: Saml2ConfigFormValuesInterface = {
            destinationURLs: destinationUrls?.split(","),
            enableMetadataSigning: values.enableMetadataSigning,
            metadataValidityPeriod: values.metadataValidityPeriod
        };
        
        // handle update
        console.log("data", data);
        
        
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
            title={ t("console:saml2Config.title") }
            pageTitle={ t("console:saml2Config.title") }
            description={ t("console:saml2Config.description") }
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
                                { isSaml2FetchRequestLoading
                                    ? renderLoadingPlaceholder() 
                                    : (
                                        <>
                                            <Form
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ handleSubmit }
                                                initialValues={ saml2Config }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                noValidate={ true }
                                                validate={ validateForm }
                                                autoComplete="new-password"

                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 1 } key={ 3 }>
                                                        <Grid.Column width={ 10 } key="enableMetadataSigning">
                                                            <Field.Checkbox
                                                                ariaLabel="Enable metadata signing checkbox"
                                                                name="enableMetadataSigning"
                                                                label={ t("console:saml2Config.form." +
                                                                    "enableMetadataSigning.label") }
                                                                readOnly={ isReadOnly }
                                                                data-componentid={ `${componentId}-
                                                                    enable-metadata-signing` }
                                                                toggle
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 } key={ 1 }>
                                                        <Grid.Column width={ 10 } key="metadataValidityPeriod">
                                                            <Field.Input
                                                                min={ Saml2ConfigurationConstants
                                                                    .SAML2_CONFIG_FIELD_MIN_LENGTH }
                                                                ariaLabel="Metadata Validity Period Field"
                                                                inputType="number"
                                                                name="metadataValidityPeriod"
                                                                label={ t("console:saml2Config.form." +
                                                                    "metadataValidityPeriod.label") }
                                                                hint={ t("console:saml2Config.form." +
                                                                    "metadataValidityPeriod.hint") }
                                                                value={ saml2Config?.metadataValidityPeriod }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ Saml2ConfigurationConstants
                                                                    .SAML2_CONFIG_FIELD_MIN_LENGTH }
                                                                minLength={ null }
                                                                data-componentid={ 
                                                                    `${componentId}-metadata-validity-period` }
                                                                autoComplete="new-password"
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 } key={ 2 }>
                                                        <Grid.Column width={ 10 } key="destinationUrl">
                                                            <div ref={ url } />
                                                            <URLInput
                                                                urlState={ destinationUrls }
                                                                setURLState={ (url: string) => {
                                                                    setDestinationUrls(url);
                                                                } }
                                                                labelName={ t("console:saml2Config.form." +
                                                                    "destinationUrl.label") }
                                                                hint={ t("console:saml2Config.form." +
                                                                    "destinationUrl.hint") }
                                                                required={ true }
                                                                value={
                                                                    saml2Config?.destinationURLs?.toString()
                                                                        ? ApplicationManagementUtils.
                                                                            buildCallBackURLWithSeparator(
                                                                                saml2Config?.destinationURLs.toString())
                                                                        : ""
                                                                }
                                                                showError={ showURLError }
                                                                setShowError={ setShowURLError }
                                                                validationErrorMsg={ t("console:saml2Config.form." +
                                                                    "validation.destinationURLs") }
                                                                validation={ (value: string) => {
                                                                    if (!URLUtils.isURLValid(value, true)) {
                                                                        setShowURLError(true);

                                                                        return false;
                                                                    }
                                                        
                                                                    return true;
                                                                } }
                                                                readOnly={ isReadOnly }
                                                                addURLTooltip={ t("common:addURL") }
                                                                duplicateURLErrorMessage={ 
                                                                    t("common:duplicateURLError") }
                                                                data-componentid={ `${ componentId }
                                                                    -destination-url-input` }
                                                                showPredictions={ false }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form>
                                            <Divider hidden />
                                            <Grid.Row columns={ 1 } className="mt-6">
                                                <Grid.Column width={ 10 }>
                                                    <PrimaryButton
                                                        size="small"
                                                        loading={ isSubmitting }
                                                        disabled={ isReadOnly }
                                                        onClick={ () => {
                                                            formRef?.current?.triggerSubmit();
                                                        } }
                                                        ariaLabel="saml2 configuration form update button"
                                                        data-componentid={ `${ componentId }-update-button` }
                                                    >
                                                        { t("common:update") }
                                                    </PrimaryButton>
                                                </Grid.Column>
                                            </Grid.Row>
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
Saml2ConfigurationPage.defaultProps = {
    "data-componentid": "saml2-configuration-settings-page"
};

export default Saml2ConfigurationPage;
