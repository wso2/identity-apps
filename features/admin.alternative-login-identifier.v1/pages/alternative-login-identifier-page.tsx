/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Code from "@oxygen-ui/react/Code";
import Grid from "@oxygen-ui/react/Grid";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Typography from "@oxygen-ui/react/Typography";
import {
    ExtendedClaimInterface
} from "@wso2is/admin.applications.v1/components/settings/attribute-management/attribute-settings";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import { getAllLocalClaims, updateAClaim } from "@wso2is/admin.claims.v1/api/claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";
import { getConnectorDetails, updateGovernanceConnector } from "@wso2is/admin.server-configurations.v1/api";
import { ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "@wso2is/admin.server-configurations.v1/models";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";
import { IdentityAppsError } from "@wso2is/core/errors";
import {
    AlertLevels,
    Claim,
    ClaimsGetParams,
    IdentifiableComponentInterface,
    UniquenessScope
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { ConfirmationModal, ContentLoader, EmphasizedSegment, Message, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { AlternativeLoginIdentifierFormInterface } from "../models/alternative-login-identifier-validation";

/**
 * Props for alternative login identifier page.
 */
type AlternativeLoginIdentifierInterface = IdentifiableComponentInterface;

const FORM_ID: string = "alternative-login-identifier-form";

/**
 * Entrypoint for the alternative login identifier page.
 *
 * @param props - Props injected to the component.
 * @returns Alternative login identifier page component.
 */
const AlternativeLoginIdentifierInterface: FunctionComponent<AlternativeLoginIdentifierInterface> = (
    props: AlternativeLoginIdentifierInterface
): ReactElement => {

    const { ["data-componentid"]: componentId } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const enableIdentityClaims: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const categoryId: string = ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID;
    const connectorId: string = ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID;
    const [ isApplicationRedirect, setApplicationRedirect ] = useState<boolean>(false);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ availableClaims, setAvailableClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<AlternativeLoginIdentifierFormInterface>(undefined);
    const availiableLoginIdentifierAttributes: string[] =
        [
            ClaimManagementConstants.EMAIL_CLAIM_URI,
            ClaimManagementConstants.MOBILE_CLAIM_URI
        ];
    const [ isAlphanumericUsername, setIsAlphanumericUsername ] = useState<boolean>(false);
    const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);
    const [ pendingFormValues, setPendingFormValues ] = useState<AlternativeLoginIdentifierFormInterface>(null);

    const {
        data: validationData
    } = useValidationConfigData();

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = (): void => {
        if (isApplicationRedirect) {
            history.push(AppConstants.getPaths().get("APPLICATIONS"));

            return;
        }
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * Load multi attribute login connector.
     */
    const loadConnectorDetails = () => {

        getConnectorDetails(categoryId, connectorId)
            .then((response: GovernanceConnectorInterface) => {
                setConnector(response);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            });
    };

    /**
     * Load Local Claims.
     */
    const getClaims = () => {

        const params: ClaimsGetParams = {
            "exclude-identity-claims": !enableIdentityClaims,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params)
            .then((response: Claim[]) => {
                const filteredArray: Claim[] = response?.filter((item: Claim) =>
                    availiableLoginIdentifierAttributes.includes(item.claimURI));

                setAvailableClaims(filteredArray);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("claims:local.notifications.fetchLocalClaims.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:local.notifications.fetchLocalClaims." +
                        "genericError.message")
                }));
            });
    };

    /**
     * Initialize the initial form values.
     */
    const initializeForm = (): void => {

        if (isEmpty(connector?.properties) || isEmpty(availableClaims)) {
            return;
        }

        let resolvedInitialValues: AlternativeLoginIdentifierFormInterface = initialFormValues;

        const isEnabled: boolean =
            (connector?.properties?.find((property: ConnectorPropertyInterface) =>
                property.name === "account.multiattributelogin.handler.enable").value === "true");

        const property: ConnectorPropertyInterface =
            connector?.properties?.find((property: ConnectorPropertyInterface) =>
                property.name === "account.multiattributelogin.handler.allowedattributes");
        const allowedAttributes: string[] =  property?.value.split(",").map((item: string) => item.trim());

        resolvedInitialValues = {
            ...resolvedInitialValues,
            email: (isEnabled && allowedAttributes?.includes(ClaimManagementConstants.EMAIL_CLAIM_URI)) ||
                !isAlphanumericUsername,
            mobile: isEnabled && allowedAttributes?.includes(ClaimManagementConstants.MOBILE_CLAIM_URI)
        };

        setInitialFormValues(resolvedInitialValues);

    };

    /**
     * Alternative Login Identifier warning.
     */
    const sampleWarningSection = (): ReactElement => {

        return(
            <Message warning>
                <Icon className="warning circle icon"/>
                { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.warning") }
            </Message>
        );
    };

    /**
     * Info section for email login identifier.
     */
    const sampleInfoSection= (): ReactElement => {

        return(
            <Message info className="alternative-login-identifier-info">
                <Icon className="info circle"/>
                { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.info") }
            </Message>
        );
    };

    const getUpdatedConfigurations = (values: any) => {
        const defaultAllowedAttributes: string =
            ClaimManagementConstants.USER_NAME_CLAIM_URI;
        const updatedAllowedAttributes: string = [ defaultAllowedAttributes, ...values ].join(",");
        const enabled: boolean = updatedAllowedAttributes !== defaultAllowedAttributes;
        const data: any = {
            "account.multiattributelogin.handler.allowedattributes": updatedAllowedAttributes,
            "account.multiattributelogin.handler.enable": enabled
        };

        return data;
    };

    const resolveConnectorUpdateSuccessMessage = (): string => {
        return t(
            "extensions:manage.accountLogin.alternativeLoginIdentifierPage.notification.success.description"
        );
    };

    const resolveConnectorUpdateErrorMessage = (): string => {
        return t(
            "extensions:manage.accountLogin.alternativeLoginIdentifierPage.notification.error.description"
        );
    };

    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: resolveConnectorUpdateSuccessMessage(),
                level: AlertLevels.SUCCESS,
                message: t(
                    "governanceConnectors:notifications." + "updateConnector.success.message"
                )
            })
        );
    };

    const handleUpdateError = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: resolveConnectorUpdateErrorMessage(),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications.updateConnector.error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.genericError.message"
                    )
                })
            );
        }
    };

    const updateConnector = (updatedConnectorData: any, checkedClaims: string[]) => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        for (const key in updatedConnectorData) {
            data.properties.push({
                name: key,
                value: updatedConnectorData[key]
            });
        }
        setIsSubmitting(true);
        setIsLoading(true);
        updateGovernanceConnector(data, categoryId, connectorId)
            .then(() => {
                if (checkedClaims.length > 0) {
                    updateClaims(checkedClaims);
                }
                handleUpdateSuccess();
                loadConnectorDetails();
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
                setIsLoading(false);
            });
    };

    /**
     * Updates the uniqueness scope of a claim if it's selected and needs to be updated to ACROSS_USERSTORES.
     * Does not modify claims that are not selected.
     */
    const updateClaimUniquenessScope = (claim: Claim, checkedClaims: string[]) => {
        const isSelected: boolean = checkedClaims?.includes(claim.claimURI);

        const shouldUpdateClaim: boolean = isSelected &&
            (claim.uniquenessScope !== UniquenessScope.ACROSS_USERSTORES);

        return {
            isClaimUpdate: shouldUpdateClaim,
            updatedClaim: shouldUpdateClaim
                ? {
                    ...claim,
                    uniquenessScope: UniquenessScope.ACROSS_USERSTORES
                }
                : claim
        };
    };

    // Define a function to update and dispatch alerts.
    const updateClaimAndAlert = (claim: Claim) => {

        const claimId: string = claim?.id;

        delete claim.dialectURI;
        delete claim.id;

        return updateAClaim(claimId, claim)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                        "claimUpdateNotification.success.description",
                        { claimName: claim.displayName }
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                        "claimUpdateNotification.success.message"
                    )
                }));
                getClaims();
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description ||
                        t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.claimUpdateNotification." +
                            "error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message ||
                        t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.claimUpdateNotification." +
                            "error.description")
                }));
            });
    };

    /**
     * Updates the uniqueness scope of claims to ACROSS_USERSTORES.
     */
    const updateClaims = (checkedClaims : string[]) => {
        for (const claim of availableClaims) {
            const { isClaimUpdate, updatedClaim } = updateClaimUniquenessScope(claim, checkedClaims);

            if (isClaimUpdate) {
                updateClaimAndAlert(updatedClaim);
            }
        }
    };

    /**
     * Gets the processed checked claims from form values.
     */
    const getProcessedCheckedClaims = (values: AlternativeLoginIdentifierFormInterface): string[] => {
        const processedFormValues: AlternativeLoginIdentifierFormInterface = { ...values };
        let checkedClaims: string[] = availableClaims
            .filter((claim: Claim) =>
                processedFormValues[claim?.displayName?.toLowerCase()] !== undefined
                    ? processedFormValues[claim?.displayName?.toLowerCase()] : false)
            .map((claim: Claim) => claim?.claimURI);

        // Remove the email attribute from the allowed attributes list when email username type is enabled.
        if (!isAlphanumericUsername) {
            checkedClaims = checkedClaims.filter((item: string) => item !== ClaimManagementConstants.EMAIL_CLAIM_URI);
        }

        return checkedClaims;
    };

    /**
     * Checks if any claims need uniqueness scope update.
     */
    const shouldUpdateUniquenessScope = (checkedClaims: string[]): boolean => {
        return checkedClaims.some((claimURI: string) => {
            const claim: Claim = availableClaims.find((c: Claim) => c.claimURI === claimURI);

            return claim.uniquenessScope !== UniquenessScope.ACROSS_USERSTORES;
        });
    };

    /**
     * Processes form submission and updates connector and claims.
     */
    const processFormSubmission = (
        formValues: AlternativeLoginIdentifierFormInterface,
        hasUserConsent: boolean = false
    ): void => {
        const checkedClaims: string[] = getProcessedCheckedClaims(formValues);
        const updatedConnectorData: any = getUpdatedConfigurations(checkedClaims);
        const requiresUniquenessScopeUpdate: boolean = shouldUpdateUniquenessScope(checkedClaims);

        // Show confirmation modal if uniqueness scope update is required and no consent received yet.
        if (!hasUserConsent && requiresUniquenessScopeUpdate) {
            setPendingFormValues(formValues);
            setShowConfirmationModal(true);

            return;
        }

        updateConnector(updatedConnectorData, checkedClaims);
    };

    /**
     * Handles the initial form submission.
     */
    const handleSubmit = (values: AlternativeLoginIdentifierFormInterface): void => {
        processFormSubmission(values, false);
    };

    /**
     * Handles the form submission after user consents to uniqueness scope update.
     */
    const handleConsentedSubmit = (): void => {
        if (!pendingFormValues) {
            return;
        }

        processFormSubmission(pendingFormValues, true);
        setShowConfirmationModal(false);
    };

    useEffect(() => {
        const locationState: unknown = history.location.state;

        if (locationState === ApplicationManagementConstants.APPLICATION_STATE) {
            setApplicationRedirect(true);
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        initializeForm();
    }, [
        availableClaims,
        connector,
        isLoading
    ]);

    /**
     * Get username type.
     */
    useEffect(() => {
        if (validationData) {
            setIsAlphanumericUsername(getUsernameConfiguration(validationData)?.enableValidator === "true");
        }
    }, [ validationData ] );

    /**
     * Load multiattribute login and claim data.
     */
    useEffect(() => {
        setIsLoading(true);
        getClaims();
        loadConnectorDetails();
        setIsLoading(false);
    }, []);

    return (
        <>
            {
                !isLoading && initialFormValues
                    ? (
                        <PageLayout
                            pageTitle={ t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.pageTitle") }
                            title={ (
                                <>
                                    { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.pageTitle") }
                                </>
                            ) }
                            description={ (
                                <>
                                    { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.description") }
                                </>
                            ) }
                            data-componentid={ `${componentId}-page-layout` }
                            backButton={ {
                                "data-testid": `${componentId}-page-back-button`,
                                onClick: handleBackButtonClick,
                                text: isApplicationRedirect ?
                                    t("extensions:manage.accountLogin.goBackToApplication") :
                                    t("governanceConnectors:goBackLoginAndRegistration")
                            } }
                            bottomMargin={ false }
                            contentTopMargin={ true }
                            pageHeaderMaxWidth={ true }
                        >
                            <Grid className="mt-3">
                                <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                    <Form
                                        id={ FORM_ID }
                                        initialValues={ initialFormValues }
                                        uncontrolledForm={ false }
                                        validate={ null }
                                        onSubmit={
                                            (values: AlternativeLoginIdentifierFormInterface) => handleSubmit(values)
                                        }
                                    >
                                        <Typography>
                                            {
                                                t("extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                                                    "loginIdentifierTypes")
                                            }
                                        </Typography>
                                        {
                                            sampleWarningSection()
                                        }
                                        <List disablePadding>
                                            {
                                                availableClaims?.map((claim: Claim, index:number) => {
                                                    const name: string = claim?.displayName.toLowerCase();

                                                    return (
                                                        <>
                                                            <ListItem
                                                                key = { index }
                                                                disablePadding
                                                                disabled = {
                                                                    !(isAlphanumericUsername) && name === "email"
                                                                }
                                                            >
                                                                <Field.OxygenCheckbox
                                                                    disabled = {
                                                                        !(isAlphanumericUsername) && name === "email"
                                                                    }
                                                                    ariaLabel= { name }
                                                                    key= { index }
                                                                    name= { name }
                                                                    required={ false }
                                                                    data-componentid=
                                                                        { `${componentId}-${name}-checkbox` }
                                                                    className= "alternative-login-identifier-checkbox"
                                                                />
                                                                <ListItemText
                                                                    className="alternative-login-identifier-item-text "
                                                                    primary={ claim?.displayName }
                                                                    secondary={
                                                                        (
                                                                            <Code
                                                                                className=
                                                                                    "alternative-login-identifier-code"
                                                                            >
                                                                                { claim?.claimURI }
                                                                            </Code>
                                                                        )
                                                                    }
                                                                />
                                                            </ListItem>

                                                            {
                                                                !isAlphanumericUsername && name === "email" ?
                                                                    (
                                                                        sampleInfoSection()
                                                                    )
                                                                    : <></>
                                                            }
                                                        </>

                                                    );
                                                })
                                            }
                                        </List>
                                        <Field.Button
                                            form={ FORM_ID }
                                            size="small"
                                            buttonType="primary_btn"
                                            ariaLabel="Alternative Login Identifier update button"
                                            name="update-button"
                                            data-testid={ `${componentId}-submit-button` }
                                            disabled= { isSubmitting }
                                            loading= { isSubmitting }
                                            label={ t("common:update") }
                                            hidden={ null }
                                        />
                                    </Form>
                                </EmphasizedSegment>
                            </Grid>
                        </PageLayout>
                    ) : (
                        <ContentLoader />
                    )
            }
            <ConfirmationModal
                data-componentid={ `${componentId}-confirmation-modal` }
                onClose={ (): void => {
                    setShowConfirmationModal(false);
                } }
                type="warning"
                open={ showConfirmationModal }
                assertion={ t("common:confirm") }
                assertionHint={ t("extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                    "claimUpdateConfirmation.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setShowConfirmationModal(false);
                } }
                onPrimaryActionClick={ handleConsentedSubmit }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                        "claimUpdateConfirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                        "claimUpdateConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                        "claimUpdateConfirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
* Default props for the component.
*/
AlternativeLoginIdentifierInterface.defaultProps = {
    "data-componentid": "alternative-login-identifier-edit-page"
};

export default AlternativeLoginIdentifierInterface;
