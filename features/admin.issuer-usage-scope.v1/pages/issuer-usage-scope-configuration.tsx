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

import { FormControlLabel } from "@mui/material";
import Divider from "@oxygen-ui/react/Divider";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { useRequiredScopes } from "@wso2is/access-control";
import type { OIDCApplicationConfigurationInterface } from "@wso2is/admin.applications.v1/models/application";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { OrganizationResponseInterface } from "@wso2is/admin.organizations.v1/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import {
    EmphasizedSegment,
    Hint,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetIssuerUsageScopeConfig from "../api/use-get-issuer-usage-scope-config";
import { updateIssuerUsageScopeConfig } from "../api/use-issuer-usage-scope-configs";
import { IssuerUsageScopeConfigConstants } from "../constants/issuer-usage-scope-configuration";
import { IssuerUsageScopeConfigAPIResponseInterface } from "../models/issuer-usage-scope-configuration";

/**
 * Props for Issuer Usage Scope Configuration settings page.
 */
type IssuerUsageScopeConfigurationPageInterface = IdentifiableComponentInterface;

/**
 * Issuer Usage Scope options enum.
 */
enum IssuerUsageScopeOption {
    ALL_EXISTING_AND_FUTURE_ORGS = "ALL_EXISTING_AND_FUTURE_ORGS",
    NONE = "NONE"
}

/**
 * Issuer Usage Scope Configuration page.
 */
const IssuerUsageScopeConfigurationPage: FunctionComponent<IssuerUsageScopeConfigurationPageInterface> = (
    { "data-componentid": componentId = "issuer-usage-scope-configuration-page" }:
        IssuerUsageScopeConfigurationPageInterface
): ReactElement => {

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations
    );
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const isReadOnly: boolean = !useRequiredScopes(
        featureConfig?.server?.scopes?.update
    );

    const { t } = useTranslation([ "issuerUsageScope" ]);
    const dispatch: Dispatch = useDispatch();

    const [ issuerUsageScopeConfig, setIssuerUsageScopeConfig ] = useState<IssuerUsageScopeOption>(
        IssuerUsageScopeOption.NONE
    );

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ issuer, setIssuer ] = useState<string>("");

    /**
     * Fetch issuer usage scope configuration using SWR.
     */
    const {
        data: issuerUsageScopeData,
        error: issuerUsageScopeError
    } = useGetIssuerUsageScopeConfig<IssuerUsageScopeConfigAPIResponseInterface, IdentityAppsApiException>(true);

    /**
     * Set issuer usage scope config when data is loaded.
     */
    useEffect(() => {
        if (issuerUsageScopeData?.usageScope) {
            setIssuerUsageScopeConfig(issuerUsageScopeData.usageScope as IssuerUsageScopeOption);
        }
    }, [ issuerUsageScopeData ]);

    /**
     * Show error alert if issuer usage scope config fetch fails.
     */
    useEffect(() => {
        if (issuerUsageScopeError) {
            dispatch(addAlert<AlertInterface>({
                description: t("issuerUsageScope:notifications.getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("issuerUsageScope:notifications.getConfiguration.error.message")
            }));
        }
    }, [ issuerUsageScopeError ]);

    /**
     * Set issuer from OIDC configurations when available.
     */
    useEffect(() => {
        if (oidcConfigurations?.tokenEndpoint) {
            setIssuer(oidcConfigurations.tokenEndpoint);
        }
    }, [ oidcConfigurations ]);

    /**
     * Handle Issuer Usage Scope form submit.
     */
    const handleSubmit = () => {
        setIsSubmitting(true);

        updateIssuerUsageScopeConfig(issuerUsageScopeConfig)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("issuerUsageScope:notifications.updateConfiguration.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("issuerUsageScope:notifications.updateConfiguration.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                let errorDescription: string =
                    t("issuerUsageScope:notifications.updateConfiguration.defaultError.description");
                let errorMessage: string = t("issuerUsageScope:notifications.updateConfiguration.defaultError.message");

                // Check for specific error codes and provide custom messages
                if (error?.code) {
                    switch (error.code) {
                        case IssuerUsageScopeConfigConstants.ISSUER_USAGE_SCOPE_ISSUER_USED_IN_ORGS_ERROR_CODE:
                            errorDescription =
                            t("issuerUsageScope:notifications.updateConfiguration.issuerUsedInOrgsError.description");
                            errorMessage = error?.message ||
                                t("issuerUsageScope:notifications.updateConfiguration.issuerUsedInOrgsError.message");

                            break;
                        default:
                            errorMessage = error?.message || errorMessage;

                            break;
                    }
                } else {
                    // Use API provided error messages if available
                    errorMessage = error?.message || errorMessage;
                }

                dispatch(addAlert<AlertInterface>({
                    description: errorDescription,
                    level: AlertLevels.ERROR,
                    message: errorMessage
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    return (
        <PageLayout
            title={ t("issuerUsageScope:title") }
            pageTitle={ t("issuerUsageScope:title") }
            description={ t("issuerUsageScope:description") }
            backButton={ {
                onClick: () => onBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <Grid className={ "mt-2" } >
                <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                    <Grid>
                        <Grid xl={ 8 } xs={ 12 }>
                            <FinalForm
                                key={ issuer }
                                initialValues={ { name: issuer } }
                                onSubmit={ () => {} }
                                render={ ({ handleSubmit: _handleSubmit, values: _values }: FormRenderProps) => {
                                    return (
                                        <div className="form-field-wrapper">
                                            <FinalFormField
                                                className="text-field-container"
                                                FormControlProps={ {
                                                    margin: "dense"
                                                } }
                                                name="name"
                                                type="text"
                                                component={ TextFieldAdapter }
                                                label={
                                                    (<>
                                                        { t("issuerUsageScope:form.issuer.label")
                                                            .split("{{organizationName}}")[0] }
                                                        <code className="inline-code">
                                                            { currentOrganization?.name }
                                                        </code>
                                                        { t("issuerUsageScope:form.issuer.label")
                                                            .split("{{organizationName}}")[1] }
                                                    </>)
                                                }
                                                readOnly={ true }
                                                data-componentid={ `${componentId}-field-name` }
                                            />
                                        </div>
                                    );
                                } }
                            />
                            <Divider hidden />
                            <RadioGroup
                                value={ issuerUsageScopeConfig }
                                onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                    const selectedIssuerUsageType: IssuerUsageScopeOption =
                                        event.target.value as IssuerUsageScopeOption;

                                    setIssuerUsageScopeConfig(selectedIssuerUsageType);
                                } }
                                data-componentid={ `${componentId}-radio-group` }
                            >
                                <FormControlLabel
                                    value={ IssuerUsageScopeOption.ALL_EXISTING_AND_FUTURE_ORGS }
                                    label={ (
                                        <>
                                            { t("issuerUsageScope:form.options.allExistingAndFutureOrgs.label") }
                                            <Hint inline popup>
                                                {
                                                    t("issuerUsageScope:form.options.allExistingAndFutureOrgs.hint")
                                                        .split("{{organizationName}}")
                                                        .map((part: string, index: number, array: string[]) => (
                                                            <React.Fragment key={ index }>
                                                                { part }
                                                                { index < array.length - 1 && (
                                                                    <code className="inline-code">
                                                                        { currentOrganization?.name }
                                                                    </code>
                                                                ) }
                                                            </React.Fragment>
                                                        ))
                                                }
                                            </Hint>
                                        </>
                                    ) }
                                    control={ <Radio /> }
                                    data-componentid={ `${ componentId }-use-with-all-orgs-radio` }
                                />
                                <FormControlLabel
                                    value={ IssuerUsageScopeOption.NONE }
                                    label={ (
                                        <>
                                            { t("issuerUsageScope:form.options.none.label") }
                                            <Hint inline popup>
                                                { t("issuerUsageScope:form.options.none.hint") }
                                            </Hint>
                                        </>
                                    ) }
                                    control={ <Radio /> }
                                    data-componentid={ `${ componentId }-use-with-none-radio` }
                                />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                    {
                        !isReadOnly && (
                            <>
                                <Grid xs={ 8 } marginTop={ 3 }>
                                    <PrimaryButton
                                        size="small"
                                        onClick={ handleSubmit }
                                        ariaLabel={ t("issuerUsageScope:form.updateButton.ariaLabel") }
                                        data-componentid={ `${componentId}-update-button` }
                                        loading={ isSubmitting }
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                </Grid>
                            </>
                        )
                    }
                </EmphasizedSegment>
            </Grid>
        </PageLayout>
    );
};

export default IssuerUsageScopeConfigurationPage;
