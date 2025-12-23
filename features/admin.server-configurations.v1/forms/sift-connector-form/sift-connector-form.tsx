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

import { Grid, Stack } from "@mui/material";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import FormGroup from "@oxygen-ui/react/FormGroup";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import CheckboxAdapter from "@wso2is/form/src/components/adapters/checkbox-field-adapter";
import { ContentLoader, GenericIcon, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Icon } from "semantic-ui-react";
import updateEventPublishingConfigurations from "../../api/event-publishing-configurations";
import useFraudDetectionConfigurations from "../../api/use-fraud-detection-configurations";
import { getSiftConnectorIcon } from "../../configs/ui";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import {
    FraudAnalyticEventMetadataInterface,
    FraudAnalyticEventPropertyInterface,
    FraudDetectionConfigurationsInterface
} from "../../models/fraud-detection";
import { GovernanceConnectorInterface } from "../../models/governance-connectors";
import { GovernanceConnectorUtils } from "../../utils/governance-connector-utils";
import "./sift-connector-form.scss";

/**
 * Proptypes for the Sift Connector Form component.
 */
interface SiftConnectorFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: Record<string, unknown>) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Sift Connector Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const SiftConnectorForm: FunctionComponent<SiftConnectorFormPropsInterface> = ({
    initialValues,
    onSubmit,
    readOnly,
    isSubmitting,
    [ "data-componentid" ]: componentId = "sift-connector"
}: SiftConnectorFormPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isShow, setIsShow ] = useState<boolean>(false);

    const {
        data: fraudDetectionConfigurations,
        error: fraudDetectionConfigurationsError,
        isLoading: isFraudDetectionConfigurationsLoading,
        mutate: mutateEventPublishingConfigurations
    } = useFraudDetectionConfigurations(true);

    const eventMetadata: Record<string, FraudAnalyticEventMetadataInterface> = GovernanceConnectorUtils
        .resolveEventPropertyMappings();

    // Memoize enriched fraud detection configurations
    const enrichedFraudDetectionConfigurations: FraudDetectionConfigurationsInterface | undefined = useMemo(() => {
        if (!fraudDetectionConfigurations) return undefined;

        return {
            ...fraudDetectionConfigurations,
            events: fraudDetectionConfigurations.events.map((event: FraudAnalyticEventPropertyInterface) => ({
                ...event,
                description: eventMetadata[event.eventName]?.description || "",
                displayName: eventMetadata[event.eventName]?.displayName || event.eventName
            }))
        };
    }, [ fraudDetectionConfigurations, eventMetadata ]);

    // Split events into two columns
    const { leftColumnEvents, rightColumnEvents } = useMemo(() => {
        if (!enrichedFraudDetectionConfigurations?.events) {
            return { leftColumnEvents: [], rightColumnEvents: [] };
        }

        enrichedFraudDetectionConfigurations.events.sort(
            (a: FraudAnalyticEventPropertyInterface, b: FraudAnalyticEventPropertyInterface) => {
                const orderA: number = eventMetadata[a.eventName]?.displayOrder || 0;
                const orderB: number = eventMetadata[b.eventName]?.displayOrder || 0;

                return orderA - orderB;
            }
        );
        const midPoint: number = Math.ceil(enrichedFraudDetectionConfigurations.events.length / 2);

        return {
            leftColumnEvents: enrichedFraudDetectionConfigurations.events.slice(0, midPoint),
            rightColumnEvents: enrichedFraudDetectionConfigurations.events.slice(midPoint)
        };
    }, [ enrichedFraudDetectionConfigurations ]);

    /**
     * Get updated API Key.
     *
     * @param values - Form values.
     * @returns Form values object.
     */
    const getUpdatedAPIKey = (values: Record<string, unknown>) => {

        const encodedApiKeyProperty: string = GovernanceConnectorUtils
            .encodeConnectorPropertyName(ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY);

        const data: { [ key: string]: unknown } = {
            [ ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY ]:
                values[encodedApiKeyProperty] || ""
        };

        return data;
    };

    /**
     * Render input adornment.
     *
     * @returns ReactElement
     */
    const renderInputAdornment = (): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !isShow ? "eye" : "eye slash" }
                data-testid={ "view-button" }
                onClick={ () => { setIsShow(!isShow); } }
            />
        </InputAdornment>
    );

    /**
     * Render event selection checkbox.
     *
     * @param event - Fraud analytic event property.
     * @returns ReactElement
     */
    const renderEventSelectionCheckbox = (event: FraudAnalyticEventPropertyInterface): ReactElement => {
        return (
            <Box mb={ 2 } key={ event.eventName } className="channel-checkbox-container">
                <FinalFormField
                    ariaLabel={ event.eventName }
                    data-componentid={ `${componentId}-${event.eventName}-checkbox` }
                    name={ `events.${GovernanceConnectorUtils.encodeConnectorPropertyName(event.eventName)}` }
                    component={ CheckboxAdapter }
                    checked={ event.enabled }
                    label={
                        (<Box className="checkbox-label">
                            <Box className="event-name-container">
                                <Typography variant="body1" component="span" className="event-name">
                                    { t(event.displayName) }
                                </Typography>
                            </Box>
                            <Typography variant="caption" component="div" className="event-description">
                                { t(event.description) }
                            </Typography>
                        </Box>)
                    }
                />
            </Box>
        );
    };

    /**
     * Render event publishing section.
     *
     * @returns ReactElement
     */
    const renderEventPublishingSection = (form): ReactElement => {
        return (
            <>
                <Box mt={ 2 } mb={ 1 } width="40%">
                    {
                        (form.getState().values.publishDeviceMetadata &&
                        form.getState().values.publishUserInfo) && (
                            <Alert
                                severity="warning"
                                data-componentid="include-pii-warning-message"
                            >
                                { t("governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors" +
                                    ".siftConnector.eventPublishing.eventProperties.piiPublishingWarning") }
                            </Alert>
                        )
                    }
                </Box>
                <Box mb={ 2 } width="40%">
                    <FormGroup>
                        <FinalFormField
                            ariaLabel="Include PII in event payload"
                            data-componentid={ `${componentId}-include-pii-checkbox` }
                            name="publishUserInfo"
                            component={ CheckboxAdapter }
                            label={
                                (<Box className="checkbox-label">
                                    <Box className="event-name-container">
                                        <Typography variant="body1" component="span" className="event-name">
                                            { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                                ".connectors.siftConnector.eventPublishing.eventProperties" +
                                                    ".publishUserInfo.label") }
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" component="div" className="event-description">
                                        { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                            ".connectors.siftConnector.eventPublishing.eventProperties" +
                                                ".publishUserInfo.description") }
                                    </Typography>
                                </Box>)
                            }
                        />
                        {
                            (form.getState().values.publishUserInfo &&
                            !form.getState().values.publishDeviceMetadata) && (
                                <Alert
                                    sx={ { marginTop: "6px", marginBottom: "8px" } }
                                    severity="warning"
                                    data-componentid="include-pii-warning-message"
                                >
                                    { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                        ".connectors.siftConnector.eventPublishing.eventProperties" +
                                            ".publishUserInfo.warning") }
                                </Alert>
                            )
                        }
                    </FormGroup>
                </Box>
                <Box mb={ 3 } width="40%">
                    <FormGroup>
                        <FinalFormField
                            ariaLabel="Include user device metadata in event payload"
                            data-componentid={ `${componentId}-include-device-metadata-checkbox` }
                            name="publishDeviceMetadata"
                            component={ CheckboxAdapter }
                            label={
                                (<Box className="checkbox-label">
                                    <Box className="event-name-container">
                                        <Typography variant="body1" component="span" className="event-name">
                                            { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                                ".connectors.siftConnector.eventPublishing.eventProperties" +
                                                    ".publishDeviceMetadata.label") }
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" component="div" className="event-description">
                                        { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                            ".connectors.siftConnector.eventPublishing.eventProperties" +
                                                ".publishDeviceMetadata.description") }
                                    </Typography>
                                </Box>)
                            }
                        />
                        {
                            (form.getState().values.publishDeviceMetadata &&
                            !form.getState().values.publishUserInfo) && (
                                <Alert
                                    sx={ { marginTop: "6px", marginBottom: "8px" } }
                                    severity="warning"
                                    data-componentid="include-pii-warning-message"
                                >
                                    { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                        ".connectors.siftConnector.eventPublishing.eventProperties" + 
                                            ".publishDeviceMetadata.warning") }
                                </Alert>
                            )
                        }
                    </FormGroup>
                </Box>
                <Box mb={ 1 }>
                    <Typography variant="h6" className="heading-container">
                        { t("governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors." +
                            "siftConnector.eventPublishing.eventProperties.title") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="section-description">
                        { t("governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors." +
                            "siftConnector.eventPublishing.eventProperties.subtitle") }
                    </Typography>
                </Box>
                <Grid mb={ 1 } container spacing={ 1 } className="channel-grid">
                    <Grid item xs={ 8 } md={ 4 }>
                        <FormGroup>
                            { leftColumnEvents?.map((event: FraudAnalyticEventPropertyInterface) =>
                                renderEventSelectionCheckbox(event)) }
                        </FormGroup>
                    </Grid>
                    <Grid item xs={ 8 } md={ 4 }>
                        <FormGroup>
                            { rightColumnEvents?.map(
                                (event: FraudAnalyticEventPropertyInterface) =>
                                    renderEventSelectionCheckbox(event)
                            ) }
                        </FormGroup>
                    </Grid>
                </Grid>
                <Box mb={ 1 }>
                    <Typography variant="h6" className="heading-container">
                        { t("governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors." +
                            "siftConnector.eventPublishing.eventDiagnostics.title") }
                    </Typography>
                </Box>
                <Box mb={ 2 } width="40%">
                    <FormGroup>
                        <FinalFormField
                            ariaLabel="Log request payload"
                            data-componentid={ `${componentId}-log-request-payload-checkbox` }
                            name="logRequestPayload"
                            component={ CheckboxAdapter }
                            label={
                                (<Box className="checkbox-label">
                                    <Box className="event-name-container">
                                        <Typography variant="body1" component="span" className="event-name">
                                            { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                                ".connectors.siftConnector.eventPublishing.eventDiagnostics." +
                                                    "logRequestPayload.label") }
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" component="div" className="event-description">
                                        { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                            ".connectors.siftConnector.eventPublishing.eventDiagnostics." +
                                                "logRequestPayload.description") }
                                    </Typography>
                                </Box>)
                            }
                        />
                    </FormGroup>
                </Box>
            </>
        );
    };

    /**
     * Handle form submission for event publishing configurations.
     *
     * @param values - Form values.
     */
    const handleEventPublishingSubmit = (values: Record<string, unknown>) => {
        const eventPublishingPayload: FraudDetectionConfigurationsInterface = {
            events: enrichedFraudDetectionConfigurations?.events.map((event: FraudAnalyticEventPropertyInterface) => ({
                enabled: values.events?.[ GovernanceConnectorUtils
                    .encodeConnectorPropertyName(event.eventName)] as boolean,
                eventName: event.eventName,
                properties: []
            })) || [],
            logRequestPayload: values.logRequestPayload as boolean || false,
            publishDeviceMetadata: values.publishDeviceMetadata as boolean || false,
            publishUserInfo: values.publishUserInfo as boolean || false
        };

        updateEventPublishingConfigurations(eventPublishingPayload).then(() => {
            if (values[GovernanceConnectorUtils.encodeConnectorPropertyName(
                ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY
            )] !== undefined) {
                onSubmit(getUpdatedAPIKey(values));
            }

            mutateEventPublishingConfigurations();
        }).catch(() => {
            dispatch(
                addAlert({
                    description: t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                        ".connectors.siftConnector.notifications.eventPropertiesUpdate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                        ".connectors.siftConnector.notifications.eventPropertiesUpdate.error.message")
                })
            );
        });
    };

    /**  * Resolve initial form values.
     *
     * @returns Initial form values.
     */
    const resolveInitialFormValues = () => {
        return {
            [ GovernanceConnectorUtils
                .encodeConnectorPropertyName(ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY)
            ]: initialValues?.properties[0]?.value ?? "",
            events: enrichedFraudDetectionConfigurations?.events.reduce(
                (formValue: Record<string, boolean>, event: FraudAnalyticEventPropertyInterface) => {

                    formValue[GovernanceConnectorUtils.encodeConnectorPropertyName(event.eventName)] = event.enabled;

                    return formValue;
                }, {} as Record<string, boolean>) ?? {},
            logRequestPayload: enrichedFraudDetectionConfigurations?.logRequestPayload ?? false,
            publishDeviceMetadata: enrichedFraudDetectionConfigurations?.publishDeviceMetadata ?? false,
            publishUserInfo: enrichedFraudDetectionConfigurations?.publishUserInfo ?? false
        };
    };

    return (
        <div className="sift-connector-form">
            <FinalForm
                onSubmit={ (values: Record<string, unknown>) =>
                    handleEventPublishingSubmit(values)
                }
                data-componentid={ `${ componentId }-configuration-form` }
                initialValues={ resolveInitialFormValues() }
                render={ ({ handleSubmit, form }: FormRenderProps) => (
                    <React.Fragment>
                        <Box mb={ 4 } display="flex">
                            <GenericIcon
                                bordered
                                shape="rounded"
                                floated="left"
                                spaced="right"
                                transparent
                                icon={ getSiftConnectorIcon().sift }
                            />
                            <Typography variant="h4" component="h2" className="sift-connector-title">
                                { t("governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors" +
                                    ".siftConnector.title") }
                            </Typography>
                        </Box>
                        <form onSubmit={ handleSubmit }>
                            <Stack direction="row" spacing={ 2 } mb={ 4 }>
                                <FinalFormField
                                    className="addon-field-wrapper"
                                    key={ ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY }
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    ariaLabel="API Key Input"
                                    data-componentid={ `${componentId}-configuration-form-api-key` }
                                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                        ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY) }
                                    inputType="password"
                                    type={ isShow ? "text" : "password" }
                                    label={ t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                        ".connectors.siftConnector.properties.siftConnectorApiKey.label") }
                                    placeholder={ t("governanceConnectors:connectorCategories" +
                                        ".loginAttemptsSecurity.connectors.siftConnector." +
                                            "properties.siftConnectorApiKey.placeholder") }
                                    component={ TextFieldAdapter }
                                    autoComplete="new-password"
                                    InputProps={ {
                                        endAdornment: renderInputAdornment()
                                    } }
                                />
                                {
                                    form.getState().values[GovernanceConnectorUtils
                                        .encodeConnectorPropertyName(ServerConfigurationsConstants
                                            .SIFT_CONNECTOR_API_KEY_PROPERTY)] && (
                                        <IconButton
                                            className="delete-button"
                                            onClick={ () => {
                                                form.change(
                                                    GovernanceConnectorUtils
                                                        .encodeConnectorPropertyName(ServerConfigurationsConstants
                                                            .SIFT_CONNECTOR_API_KEY_PROPERTY), ""
                                                );
                                            } }
                                            data-componentid={
                                                `${ componentId }-configuration-form-api-key-delete-button`
                                            }
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    )
                                }
                            </Stack>
                            <Divider />
                            {
                                (fraudDetectionConfigurationsError && isFraudDetectionConfigurationsLoading)
                                    ? <ContentLoader />
                                    : (
                                        <Box mt={ 4 } mb={ 3 }>
                                            <Typography
                                                variant="h5"
                                                className="sift-connector-form-event-publish-title"
                                            >
                                                { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                                    ".connectors.siftConnector.eventPublishing.title") }
                                            </Typography>
                                            <Typography
                                                mb={ 2 }
                                                variant="body2"
                                                className="sift-connector-form-event-publish-sub-title"
                                            >
                                                { t("governanceConnectors:connectorCategories.loginAttemptsSecurity" +
                                                    ".connectors.siftConnector.eventPublishing.subtitle") }
                                            </Typography>
                                            { renderEventPublishingSection(form) }
                                        </Box>
                                    )

                            }
                            <PrimaryButton
                                size="small"
                                disabled={ isSubmitting || readOnly }
                                loading={ isSubmitting }
                                data-componentid={
                                    `${ componentId }-configuration-form-submit-button`
                                }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        </form>
                    </React.Fragment>
                ) }
            />
        </div>
    );
};

export default SiftConnectorForm;
