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

import Grid from "@oxygen-ui/react/Grid";
import Switch from "@oxygen-ui/react/Switch";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1";
import { useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    GovernanceConnectorUtils,
    RevertGovernanceConnectorConfigInterface,
    ServerConfigurationsConstants,
    getConnectorDetails,
    revertGovernanceConnectorProperties
} from "@wso2is/admin.server-configurations.v1";
import { getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Hint,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Ref } from "semantic-ui-react";
import { revertValidationConfigData, updateValidationConfigData, useValidationConfigData } from "../api";
import { PasswordExpiryRuleList } from "../components/password-expiry-rule-list";
import { ValidationConfigConstants, ValidationConfigurationFields } from "../constants/validation-config-constants";
import {
    PasswordExpiryRule,
    PasswordExpiryRuleAttribute,
    PasswordExpiryRuleOperator,
    ValidationFormInterface
} from "../models";
import "./password-validation-form.scss";

/**
 * Props for validation configuration page.
 */
type MyAccountSettingsEditPage = IdentifiableComponentInterface;

const FORM_ID: string = "validation-config-form";

/**
 * Validation configuration listing page.
 *
 * @param props - Props injected to the component.
 * @returns Validation configuration listing page component.
 */
export const ValidationConfigEditPage: FunctionComponent<MyAccountSettingsEditPage> = (
    props: MyAccountSettingsEditPage
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const isPasswordInputValidationEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isPasswordInputValidationEnabled);
    const disabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.loginAndRegistration?.disabledFeatures);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const maxPasswordLengthLimit: number = useSelector((state: AppState) =>
        state?.config?.ui?.passwordPolicyConfigs?.maxPasswordAllowedLength);
    const maxPasswordLengthLimitLength: number = maxPasswordLengthLimit?.toString()?.length;

    const [ isSubmitting, setSubmitting ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<
        ValidationFormInterface
    >(undefined);
    const [ isRuleType ] = useState<boolean>(true);
    const [
        isUniqueChrValidatorEnabled,
        setUniqueChrValidatorEnabled
    ] = useState<boolean>(false);
    const [
        isConsecutiveChrValidatorEnabled,
        setConsecutiveChrValidatorEnabled
    ] = useState<boolean>(false);
    const [ currentValues, setCurrentValues ] = useState<ValidationFormInterface>(
        undefined
    );

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ passwordHistoryEnabled, setPasswordHistoryEnabled ] = useState<
        boolean
    >(false);
    const [ passwordExpiryEnabled, setPasswordExpiryEnabled ] = useState<boolean>(false);
    const [ defaultPasswordExpiryTime, setDefaultPasswordExpiryTime ] = useState<number>(30);
    const [ passwordExpirySkipFallback, setPasswordExpirySkipFallback ] = useState<boolean>(false);
    const [ initialPasswordExpiryRules, setInitialPasswordExpiryRules ] = useState<PasswordExpiryRule[]>([]);
    const [ passwordExpiryRules, setPasswordExpiryRules ] = useState<PasswordExpiryRule[]>([]);
    const [ hasPasswordExpiryRuleErrors, setHasPasswordExpiryRuleErrors ] = useState<boolean>(false);
    const rolesListItemLimit: number = 100;

    // State variables required to support legacy password policies.
    const [ isLegacyPasswordPolicyEnabled, setIsLegacyPasswordPolicyEnabled ] = useState<boolean>(undefined);
    const [ legacyPasswordPolicies, setLegacyPasswordPolicies ] = useState<ConnectorPropertyInterface[]>([]);

    const isReadOnly: boolean = !useRequiredScopes(featureConfig?.governanceConnectors?.scopes?.update);
    const hasRuleBasedPasswordExpiryReadPermissions: boolean =
        useRequiredScopes(featureConfig?.ruleBasedPasswordExpiry?.scopes?.read);
    const isRuleBasedPasswordExpiryDisabled: boolean =
        disabledFeatures?.includes(ValidationConfigConstants.FEATURE_DICTIONARY.get("RULE_BASED_PASSWORD_EXPIRY"))
        || !hasRuleBasedPasswordExpiryReadPermissions;

    const {
        data: passwordHistoryCountData,
        error: passwordHistoryCountError,
        mutate: mutatePasswordHistoryCount
    } = serverConfigurationConfig.usePasswordHistory();

    const {
        data: passwordExpiryData,
        error: passwordExpiryError,
        mutate: mutatePasswordExpiry
    } = serverConfigurationConfig.usePasswordExpiry();

    const {
        data: validationData,
        error: ValidationConfigStatusFetchRequestError,
        mutate: mutateValidationConfigFetchRequest
    } = useValidationConfigData(isPasswordInputValidationEnabled);

    const {
        data: groupsList,
        error: groupsListError,
        isLoading: isGroupListLoading
    } = useGroupList(
        null,
        null,
        null,
        null,
        "members,roles",
        !isRuleBasedPasswordExpiryDisabled
    );

    const {
        data: fetchedRoleList,
        isLoading: isRolesListLoading,
        error: rolesListError
    } = useGetRolesList(
        rolesListItemLimit,
        null,
        null,
        "users,groups,permissions,associatedApplications",
        !isRuleBasedPasswordExpiryDisabled
    );

    useEffect(() => {
        if (!isPasswordInputValidationEnabled) {
            getLegacyPasswordPolicyProperties();
        }
    }, []);

    useEffect(() => {
        if (groupsListError) {
            dispatch(addAlert({
                description: groupsListError?.response?.data?.description ?? groupsListError?.response?.data?.detail
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: groupsListError?.response?.data?.message
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
            }));
        }
        if (rolesListError) {
            dispatch(addAlert({
                description: rolesListError?.response?.data?.description ?? rolesListError?.response?.data?.detail
                    ?? t("roles:notifications.fetchRoles.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("roles:notifications.fetchRoles.genericError.message")
            }));
        }
    }, [ groupsListError, rolesListError ]);

    // Handle rule based password expiry related data.
    useEffect(() => {
        if (!passwordExpiryData || isRuleBasedPasswordExpiryDisabled) {
            return;
        }

        const findProperty = (name: string) =>
            passwordExpiryData?.properties?.find((property: ConnectorPropertyInterface) => property.name === name);

        setPasswordExpiryEnabled(findProperty(ServerConfigurationsConstants.PASSWORD_EXPIRY_ENABLE)?.value === "true");
        setDefaultPasswordExpiryTime(
            parseInt(findProperty(ServerConfigurationsConstants.PASSWORD_EXPIRY_TIME)?.value, 10) || 30
        );
        setPasswordExpirySkipFallback(
            findProperty(ServerConfigurationsConstants.PASSWORD_EXPIRY_SKIP_IF_NO_APPLICABLE_RULES)?.value === "true"
        );

        const rules: PasswordExpiryRule[] = passwordExpiryData?.properties
            ?.filter((property: ConnectorPropertyInterface) =>
                property?.name?.startsWith(ServerConfigurationsConstants.PASSWORD_EXPIRY_RULES_PREFIX)
            )
            .reduce((validRules: PasswordExpiryRule[], property: ConnectorPropertyInterface) => {
                const rule: PasswordExpiryRule = validateAndParsePasswordExpiryRule(property);

                if (rule !== null) {
                    validRules.push(rule);
                }

                return validRules;
            }, [])
            .sort((a: PasswordExpiryRule, b: PasswordExpiryRule) => a.priority - b.priority);

        setPasswordExpiryRules(rules);
        setInitialPasswordExpiryRules(rules);

    }, [ passwordExpiryData ]);

    /**
     * Validate and parse password expiry rule.
     *
     * @param property - Connector property.
     * @returns Password expiry rule.
     */
    const validateAndParsePasswordExpiryRule = (property: ConnectorPropertyInterface): PasswordExpiryRule | null => {
        const [ priority, expiryDays, attribute, operator, ...valueArray ] = property?.value?.split(",");

        if (!priority || !expiryDays || !attribute || !operator || valueArray.length === 0) {
            return null;
        }

        const priorityNum: number = parseInt(priority, 10);
        const expiryDaysNum: number = parseInt(expiryDays, 10);

        if (isNaN(priorityNum) || isNaN(expiryDaysNum)) {
            return null;
        }
        if (!Object.values(PasswordExpiryRuleAttribute).includes(attribute as PasswordExpiryRuleAttribute) ||
            !Object.values(PasswordExpiryRuleOperator).includes(operator as PasswordExpiryRuleOperator)) {
            return null;
        }

        return {
            attribute: attribute as PasswordExpiryRuleAttribute,
            expiryDays: expiryDaysNum,
            id: property?.name,
            operator: operator as PasswordExpiryRuleOperator,
            priority: priorityNum,
            values: valueArray
        };
    };

    useEffect(() => {
        if (!passwordHistoryCountData || !passwordExpiryData ||
            (isPasswordInputValidationEnabled && !validationData) ||
            (!isPasswordInputValidationEnabled &&
            (!legacyPasswordPolicies && legacyPasswordPolicies?.length > 0))) {

            return;
        }

        initializeForm();
    }, [
        passwordHistoryCountData,
        validationData,
        passwordExpiryData,
        legacyPasswordPolicies
    ]);

    useEffect(() => {
        if (initialFormValues === undefined) {
            return;
        }
        setCurrentValues({ ...initialFormValues });
        if (initialFormValues?.uniqueCharacterValidatorEnabled) {
            setUniqueChrValidatorEnabled(true);
        }
        if (initialFormValues?.consecutiveCharacterValidatorEnabled) {
            setConsecutiveChrValidatorEnabled(true);
        }
        setIsLoading(false);
    }, [ initialFormValues ]);

    /**
     * Handles the validation configurations fetch error.
     */
    useEffect(() => {
        if (
            !ValidationConfigStatusFetchRequestError &&
            !passwordHistoryCountError &&
            !passwordExpiryError
        ) {
            return;
        }

        if (ValidationConfigStatusFetchRequestError?.response?.data?.description) {
            if (
                ValidationConfigStatusFetchRequestError?.response?.status === 404
            ) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "validation:fetchValidationConfigData.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        if (passwordHistoryCountError?.response?.data?.description) {
            if (passwordHistoryCountError?.response?.status === 404) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "validation:fetchValidationConfigData.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        if (passwordExpiryError?.response?.data?.description) {
            if (passwordExpiryError?.response?.status === 404) {
                return;
            }
            dispatch(
                addAlert({
                    description: passwordExpiryError.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "validation:fetchValidationConfigData" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "validation:fetchValidationConfigData" +
                    ".genericError.message"
                )
            })
        );
    }, [ ValidationConfigStatusFetchRequestError, passwordHistoryCountError, passwordExpiryError ]);

    /**
     * Initialize the initial form values.
     */
    const initializeForm = (): void => {
        let updatedInitialFormValues: any = serverConfigurationConfig?.processInitialValues(
            getConfiguration(validationData),
            passwordHistoryCountData,
            setPasswordHistoryEnabled
        );

        updatedInitialFormValues = serverConfigurationConfig.processPasswordExpiryInitialValues(
            updatedInitialFormValues,
            passwordExpiryData,
            setPasswordExpiryEnabled
        );

        if (!isPasswordInputValidationEnabled) {

            updatedInitialFormValues = legacyPasswordPolicies.reduce(
                (formValues: any, property: ConnectorPropertyInterface) => {
                    const encodedPropertyName: any = GovernanceConnectorUtils
                        .encodeConnectorPropertyName(property.name);

                    return {
                        ...formValues,
                        [ encodedPropertyName ]: property.value
                    };
                },
                updatedInitialFormValues
            );

            setIsLegacyPasswordPolicyEnabled(updatedInitialFormValues?.[
                GovernanceConnectorUtils.encodeConnectorPropertyName(
                    ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE) ] === "true"
            );
        }

        setInitialFormValues(
            updatedInitialFormValues
        );
    };

    const handleRevertValidationRules = async (): Promise<void> => {
        setSubmitting(true);
        let isError: boolean = false;

        if (isPasswordInputValidationEnabled) {
            try {
                await revertValidationConfigData([ ValidationConfigurationFields.PASSWORD ]);
                mutateValidationConfigFetchRequest();
            } catch (error) {
                setSubmitting(false);
                isError = true;
                dispatch(
                    addAlert({
                        description: t("validation:revertValidationConfigData.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("validation:revertValidationConfigData.error.message")
                    })
                );
            }
        } else {
            const revertRequest: RevertGovernanceConnectorConfigInterface = {
                properties: []
            };

            legacyPasswordPolicies.forEach((property: ConnectorPropertyInterface) => {
                revertRequest.properties.push(property.name);
            });

            try {
                await revertGovernanceConnectorProperties(
                    ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID,
                    ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID,
                    revertRequest
                );

                getLegacyPasswordPolicyProperties();
            } catch (error) {
                setSubmitting(false);
                isError = true;
                dispatch(
                    addAlert({
                        description: error?.response?.data?.detail ??
                            t("validation:revertValidationConfigData.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("validation:revertValidationConfigData.error.message")
                    })
                );
            }
        }

        try {
            const passwordHistoryRevertRequest: RevertGovernanceConnectorConfigInterface = {
                properties: []
            };
            const passwordExpiryRevertRequest: RevertGovernanceConnectorConfigInterface = {
                properties: []
            };

            passwordHistoryCountData.properties?.forEach((property: ConnectorPropertyInterface) => {
                passwordHistoryRevertRequest.properties.push(property.name);
            });
            passwordExpiryData.properties?.forEach((property: ConnectorPropertyInterface) => {
                passwordExpiryRevertRequest.properties.push(property.name);
            });

            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID,
                ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID,
                passwordHistoryRevertRequest
            );
            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID,
                ServerConfigurationsConstants.PASSWORD_EXPIRY_CONNECTOR_ID,
                passwordExpiryRevertRequest
            );

            mutatePasswordHistoryCount();
            mutatePasswordExpiry();
            setSubmitting(false);
            if (!isError) {
                dispatch(
                    addAlert({
                        description: t(
                            "validation:revertValidationConfigData.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "validation:revertValidationConfigData.success.message"
                        )
                    })
                );
            }
        } catch (error) {
            setSubmitting(false);
            dispatch(
                addAlert({
                    description: error?.response?.data?.detail ??
                        t("validation:revertValidationConfigData.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("validation:revertValidationConfigData.error.message")
                })
            );
        }
    };

    const getLegacyPasswordPolicyProperties = (): void => {
        getConnectorDetails(
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID,
            ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID
        )
            .then((response: GovernanceConnectorInterface) => {
                setLegacyPasswordPolicies(response?.properties);
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
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    const validateForm = (values: ValidationFormInterface): boolean => {
        let error: boolean = false;
        let description: string = "";

        if (isRuleType) {
            if (Number(values.minLength) <
                ValidationConfigConstants.VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS.PASSWORD_MIN_VALUE) {
                error = true;
                description = t(
                    "validation:validationError.minLimitError"
                );
            } else if (Number(values.maxLength) > maxPasswordLengthLimit) {
                error = true;
                description = t(
                    "validation:validationError.maxLimitError", { maxPasswordValue: maxPasswordLengthLimit }
                );
            } else if (Number(values.minLength) > Number(values.maxLength)) {
                error = true;
                description = t(
                    "validation:validationError.minMaxMismatch"
                );
            } else if (
                values.uniqueCharacterValidatorEnabled &&
                Number(values.minUniqueCharacters) > Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "validation:validationError.uniqueChrMismatch"
                );
            } else if (
                values.consecutiveCharacterValidatorEnabled &&
                Number(values.maxConsecutiveCharacters) >
                Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "validation:validationError.consecutiveChrMismatch"
                );
            } else if (
                Number(values.minLowerCaseCharacters) +
                Number(values.minUpperCaseCharacters) +
                Number(values.minSpecialCharacters) +
                Number(values.minNumbers) >
                Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "validation:validationError.invalidConfig"
                );
            }
        }

        if (error) {
            dispatch(
                addAlert({
                    description: description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:validationError.wrongCombination"
                    )
                })
            );

            return false;
        } else {
            return true;
        }
    };

    const processPasswordExpiryRules = (): Record<string, string> => {
        const processedRules: Record<string, string> = {};
        const currentRuleIds: Set<string> = new Set<string>();

        passwordExpiryRules?.forEach((rule: PasswordExpiryRule) => {
            if (!rule) return;
            const ruleKey: string = `${ServerConfigurationsConstants.PASSWORD_EXPIRY_RULES_PREFIX}${rule?.priority}`;

            processedRules[ruleKey] =
                `${rule.priority},${rule.expiryDays},${rule.attribute},${rule.operator},${rule.values?.join(",")}`;
            currentRuleIds.add(ruleKey);
        });
        // Handle deleted rules.
        initialPasswordExpiryRules?.forEach((rule: PasswordExpiryRule) => {
            if (!currentRuleIds.has(rule?.id)) {
                processedRules[rule?.id] = "";
            }
        });

        return processedRules;
    };

    /**
     * Update the My Account Portal Data.
     *
     * @param values - New data of the My Account portal.
     */
    const handleUpdateMyAccountData = (
        values: ValidationFormInterface
    ): void => {
        if (hasPasswordExpiryRuleErrors) return;

        const processedFormValues: ValidationFormInterface = {
            ...values,
            passwordExpiryEnabled: passwordExpiryEnabled
        };

        if (!isRuleBasedPasswordExpiryDisabled) {
            processedFormValues.passwordExpiryRules = processPasswordExpiryRules();
            processedFormValues.passwordExpirySkipFallback = passwordExpirySkipFallback;
            processedFormValues.passwordExpiryTime = defaultPasswordExpiryTime;
        }

        if (
            values.uniqueCharacterValidatorEnabled &&
            values.minUniqueCharacters === "0"
        ) {
            processedFormValues.minUniqueCharacters = "1";
        }

        if (
            values.consecutiveCharacterValidatorEnabled &&
            values.maxConsecutiveCharacters === "0"
        ) {
            processedFormValues.maxConsecutiveCharacters = "1";
        }

        if (!validateForm(processedFormValues)) {
            return;
        }

        setSubmitting(true);

        // Temporary workaround to address intermittent backend cache invalidation issues.
        serverConfigurationConfig
            .processPasswordPoliciesSubmitData(
                processedFormValues,
                !isPasswordInputValidationEnabled
            )
            .then(() => {
                if (isPasswordInputValidationEnabled) {
                    return updateValidationConfigData(
                        processedFormValues,
                        null,
                        validationData[0]
                    );
                }
            })
            .then(() => {
                mutatePasswordHistoryCount();
                mutatePasswordExpiry();

                if (!isPasswordInputValidationEnabled) {
                    getLegacyPasswordPolicyProperties();
                } else {
                    mutateValidationConfigFetchRequest();
                }

                dispatch(
                    addAlert({
                        description: t(
                            "validation:notifications.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "validation:notifications.success.message"
                        )
                    })
                );
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(
                        addAlert({
                            description:
                                error?.response?.data?.description ??
                                error?.response?.data?.detail ??
                                t(
                                    "validation:notifications.error.description"
                                ),
                            level: AlertLevels.ERROR,
                            message:
                                error?.response?.data?.message ??
                                t(
                                    "validation:notifications.error.message"
                                )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "validation:notifications.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "validation:notifications.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const resolveLegacyPasswordValidation: () => ReactElement = (): ReactElement => {
        return (
            <div className="validation-configurations-form">
                <Divider className="heading-divider" />
                <Heading as="h4">
                    { t("extensions:manage.serverConfigurations.passwordValidation.heading") }
                </Heading>
                <Field.Checkbox
                    className="toggle mb-4"
                    ariaLabel="passwordPolicy.enable"
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.enable") }
                    required={ false }
                    checked={ isLegacyPasswordPolicyEnabled }
                    label={ GovernanceConnectorUtils.resolveFieldLabel(
                        "Password Policies",
                        "passwordPolicy.enable",
                        "Validate passwords based on a policy pattern") }
                    width={ 16 }
                    data-componentid={ `${ componentId }-enable-password-policy` }
                    listen={ (data: boolean) => setIsLegacyPasswordPolicyEnabled(data) }
                    readOnly={ isReadOnly }
                />
                <div className="validation-configurations-form mt-3 mb-3">
                    <div className="criteria">
                        <label>Must be between</label>
                        <Field.Input
                            ariaLabel="Minimum length of the password"
                            inputType="number"
                            name={
                                GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.min.length")
                            }
                            validation={ (
                                value: string,
                                allValues: Record<string, unknown>
                            ): string | undefined => {
                                const numValue: number = parseInt(value);
                                const min: number = ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE;

                                if (numValue < min) {
                                    return t("common:minValidation", { min });
                                }
                                const max: number = allValues.maxLength
                                    ? parseInt(allValues.maxLength as string)
                                    : maxPasswordLengthLimit;

                                if (numValue > max) {
                                    return t("common:maxValidation", { max });
                                }
                            } }
                            min={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE
                            }
                            max={
                                currentValues.maxLength
                                    ? currentValues.maxLength
                                    : maxPasswordLengthLimit
                            }
                            listen={ (
                                value: string
                            ) => {
                                setCurrentValues(
                                    {
                                        ...currentValues,
                                        [ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                            "passwordPolicy.min.length") ]: value
                                    }
                                );
                            } }
                            width={ 2 }
                            required
                            hidden={ false }
                            placeholder={ "min" }
                            maxLength={ maxPasswordLengthLimitLength }
                            minLength={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_LENGTH
                            }
                            readOnly={ isReadOnly }
                            disabled={ !isLegacyPasswordPolicyEnabled }
                            data-testid={ `${ componentId }-min-length` }
                        />
                        <label>and</label>
                        <Field.Input
                            ariaLabel="Maximum length of the password"
                            inputType="number"
                            name={
                                GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.max.length")
                            }
                            validation={ (
                                value: string,
                                allValues: Record<string, unknown>
                            ): string | undefined => {
                                const numValue: number = parseInt(value);
                                const min: number = allValues.minLength
                                    ? parseInt(allValues.minLength as string)
                                    : ValidationConfigConstants
                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                        .PASSWORD_MIN_VALUE;

                                if (numValue < min) {
                                    return t("common:minValidation", { min });
                                }

                                if (numValue > maxPasswordLengthLimit) {
                                    return t("common:maxValidation", { max: maxPasswordLengthLimit });
                                }
                            } }
                            min={
                                currentValues.minLength
                                    ? currentValues.minLength
                                    : ValidationConfigConstants
                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                        .PASSWORD_MIN_VALUE
                            }
                            max={ maxPasswordLengthLimit }
                            width={ 2 }
                            required
                            hidden={ false }
                            placeholder={ "max" }
                            listen={ (
                                value: string
                            ) => {
                                setCurrentValues(
                                    {
                                        ...currentValues,
                                        [ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                            "passwordPolicy.max.length") ]: value
                                    }
                                );
                            } }
                            maxLength={ maxPasswordLengthLimitLength }
                            labelPosition="top"
                            minLength={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_LENGTH
                            }
                            readOnly={ isReadOnly }
                            disabled={ !isLegacyPasswordPolicyEnabled  }
                            data-testid={ `${ componentId }-max-length` }
                        />
                        <label>characters</label>
                    </div>
                </div>
                <Field.Input
                    ariaLabel="passwordPolicy.pattern"
                    inputType="text"
                    name={
                        GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.pattern")
                    }
                    type="text"
                    width={ 12 }
                    required
                    placeholder={ t(
                        "extensions:manage.serverConfigurations.passwordValidation.passwordValidationRegexPlaceholder"
                    ) }
                    labelPosition="top"
                    minLength={ 3 }
                    maxLength={ 255 }
                    readOnly={ isReadOnly }
                    listen={ (
                        value: string
                    ) => {
                        setCurrentValues(
                            {
                                ...currentValues,
                                [ GovernanceConnectorUtils
                                    .encodeConnectorPropertyName("passwordPolicy.pattern") ]: value
                            }
                        );
                    } }
                    data-componentid={ `${ componentId }-password-pattern-regex` }
                    label={
                        GovernanceConnectorUtils.resolveFieldLabel(
                            "Password Validation",
                            "passwordPolicy.pattern",
                            t("extensions:manage.serverConfigurations.passwordValidation.passwordValidationRegexLabel")
                        )
                    }
                    disabled={ !isLegacyPasswordPolicyEnabled }
                />
                <Hint className="mb-4">
                    {
                        GovernanceConnectorUtils.resolveFieldHint(
                            "Password Validation",
                            "passwordPolicy.pattern",
                            t("extensions:manage.serverConfigurations.passwordValidation.passwordValidationRegexHint")
                        )
                    }
                </Hint>
                <Field.Input
                    ariaLabel="passwordPolicy.errorMsg"
                    inputType="text"
                    name={
                        GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.errorMsg")
                    }
                    type="text"
                    width={ 12 }
                    required
                    placeholder={ t(
                        "extensions:manage.serverConfigurations.passwordValidation." +
                        "passwordValidationErrorPlaceholder"
                    ) }
                    labelPosition="top"
                    minLength={ 3 }
                    maxLength={ 255 }
                    readOnly={ isReadOnly }
                    listen={ (
                        value: string
                    ) => {
                        setCurrentValues(
                            {
                                ...currentValues,
                                [ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                    "passwordPolicy.errorMsg") ]: value
                            }
                        );
                    } }
                    data-componentid={ `${ componentId }-password-policy-error-msg` }
                    label={
                        GovernanceConnectorUtils.resolveFieldLabel(
                            "Password Validation",
                            "passwordPolicy.errorMsg",
                            t("extensions:manage.serverConfigurations.passwordValidation.passwordValidationErrorLabel"))
                    }
                    disabled={ !isLegacyPasswordPolicyEnabled }
                />
                <Hint>
                    {
                        GovernanceConnectorUtils.resolveFieldHint(
                            "Password Validation",
                            "passwordPolicy.errorMsg",
                            t("extensions:manage.serverConfigurations.passwordValidation.passwordValidationErrorHint")
                        )
                    }
                </Hint>
            </div>
        );
    };

    const resolvePasswordExpiration: () => ReactElement = (): ReactElement => {
        return (
            <>
                <Grid container spacing={ 2 } direction="row" alignContent="stretch">
                    <Grid alignContent="center">
                        <Heading as="h4">
                            { t("validation:passwordExpiry.heading") }
                        </Heading>
                    </Grid>
                    <Grid alignContent="center">
                        <Switch
                            checked={ passwordExpiryEnabled }
                            disabled={ isReadOnly }
                            data-componentid={ `${ componentId }-password-expiry-toggle` }
                            onChange={
                                () => setPasswordExpiryEnabled(!passwordExpiryEnabled)
                            }
                        />
                    </Grid>
                </Grid>
                <Divider hidden/>
                <PasswordExpiryRuleList
                    componentId={ `${componentId}-password-expiry-rules` }
                    isPasswordExpiryEnabled={ passwordExpiryEnabled }
                    isSkipFallbackEnabled={ passwordExpirySkipFallback }
                    defaultPasswordExpiryTime={ defaultPasswordExpiryTime }
                    ruleList={ passwordExpiryRules ?? [] }
                    rolesList={ fetchedRoleList?.Resources ?? [] }
                    groupsList={ groupsList?.Resources ?? [] }
                    isReadOnly={ isReadOnly }
                    onDefaultPasswordExpiryTimeChange={ (days: number) => setDefaultPasswordExpiryTime(days) }
                    onSkipFallbackChange={ (skip: boolean) => setPasswordExpirySkipFallback(skip) }
                    onRuleChange={ (newRuleList: PasswordExpiryRule[]) => setPasswordExpiryRules(newRuleList) }
                    onRuleError={ (hasErrors: boolean) => setHasPasswordExpiryRuleErrors(hasErrors) }
                />
            </>
        );
    };

    const resolvePasswordValidation: () => ReactElement = (): ReactElement => {
        return (
            <div className="validation-configurations-form">
                <Divider className="heading-divider" />
                <Heading as="h4">
                    { t("extensions:manage.serverConfigurations.passwordValidation.heading") }
                </Heading>
                <div className="criteria">
                    <label>
                                Must be between
                    </label>
                    <Field.Input
                        ariaLabel="minLength"
                        inputType="number"
                        name="minLength"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }
                            const max: number = allValues.maxLength
                                ? parseInt(allValues.maxLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_VALUE
                        }
                        max={
                            currentValues.maxLength
                                ? currentValues.maxLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        maxLength={ maxPasswordLengthLimitLength }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minLength: value
                                }
                            );
                        } }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-length` }
                    />
                    <label>and</label>
                    <Field.Input
                        ariaLabel="maxLength"
                        inputType="number"
                        name="maxLength"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            if (numValue > maxPasswordLengthLimit) {
                                return t("common:maxValidation", { max: maxPasswordLengthLimit });
                            }
                        } }
                        min={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE
                        }
                        max={ maxPasswordLengthLimit }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "max" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    maxLength: value
                                }
                            );
                        } }
                        maxLength={ maxPasswordLengthLimitLength }
                        labelPosition="top"
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-max-length` }
                    />
                    <label>
                                characters
                    </label>
                </div>
                <label
                    className={ "labelName" }
                >
                    Must contain at least
                </label>
                <div
                    className={
                        "criteria rule mt-3"
                    }
                >
                    <Field.Input
                        ariaLabel="minNumbers"
                        inputType="number"
                        name="minNumbers"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min ) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minNumbers: value
                                }
                            );
                        } }
                        maxLength={ maxPasswordLengthLimitLength }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-componentid={ `${ componentId }-min-numbers` }
                    ></Field.Input>
                    <label>
                        numbers (0-9).
                    </label>
                </div>
                <div className="criteria rule">
                    <Field.Input
                        ariaLabel="minUpperCaseCharacters"
                        inputType="number"
                        name="minUpperCaseCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minUpperCaseCharacters: value
                                }
                            );
                        } }
                        maxLength={ maxPasswordLengthLimitLength }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-upper-case-characters` }
                    />
                    <label>
                        upper-case
                        characters (A-Z).
                    </label>
                </div>
                <div className="criteria rule">
                    <Field.Input
                        ariaLabel="minLowerCaseCharacters"
                        inputType="number"
                        name="minLowerCaseCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minLowerCaseCharacters: value
                                }
                            );
                        } }
                        maxLength={ maxPasswordLengthLimitLength }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-lower-case-characters` }
                    />
                    <label>
                        lower-case
                        characters (a-z).
                    </label>
                </div>
                <div className="criteria rule">
                    <Field.Input
                        ariaLabel="minSpecialCharacters"
                        inputType="number"
                        name="minSpecialCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minSpecialCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-special-characters` }
                    />
                    <label>
                        special characters
                        (!@#$%^&*).
                    </label>
                </div>
                <div className="criteria">
                    <Field.Checkbox
                        ariaLabel="uniqueCharacterValidatorEnabled"
                        name="uniqueCharacterValidatorEnabled"
                        required={ false }
                        label={
                            "Must contain at least"
                        }
                        listen={ (
                            value: boolean
                        ) => {
                            setUniqueChrValidatorEnabled(
                                value
                            );
                        } }
                        width={ 16 }
                        data-testid={ `${ componentId }-unique-chr-enable` }
                        readOnly={ isReadOnly }
                    />
                    <Field.Input
                        ariaLabel="minUniqueCharacters"
                        inputType="number"
                        name="minUniqueCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);

                            if (numValue < 1) {
                                return t("common:minValidation", { min: 1 });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={ 1 }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        value={
                            Number(
                                initialFormValues.minUniqueCharacters
                            ) > 0
                                ? initialFormValues.minUniqueCharacters
                                : 1
                        }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minUniqueCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={
                            !isUniqueChrValidatorEnabled
                        }
                        data-testid={ `${ componentId }-min-unique-chr` }
                    />
                    <label>
                        unique characters.
                    </label>
                </div>
                <div className="criteria">
                    <Field.Checkbox
                        ariaLabel="consecutiveCharacterValidatorEnabled"
                        name="consecutiveCharacterValidatorEnabled"
                        label={
                            "Must not contain more than"
                        }
                        required={ false }
                        disabled={ false }
                        listen={ (
                            value: boolean
                        ) => {
                            setConsecutiveChrValidatorEnabled(
                                value
                            );
                        } }
                        width={ 16 }
                        data-testid={ `${ componentId }-consecutive-chr-enable` }
                        readOnly={ isReadOnly }
                    />
                    <Field.Input
                        ariaLabel="maxConsecutiveCharacters"
                        inputType="number"
                        name="maxConsecutiveCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);

                            if (numValue < 1) {
                                return t("common:minValidation", { min: 1 });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : maxPasswordLengthLimit;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={ 1 }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : maxPasswordLengthLimit
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "max" }
                        value={
                            Number(
                                initialFormValues.maxConsecutiveCharacters
                            ) > 0
                                ? initialFormValues.maxConsecutiveCharacters
                                : 1
                        }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    maxConsecutiveCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={
                            !isConsecutiveChrValidatorEnabled
                        }
                        data-testid={ `${ componentId }-max-consecutive-chr` }
                    />
                    <label>
                        repeated characters.
                    </label>
                </div>
            </div>
        );
    };

    return (
        <PageLayout
            pageTitle={ t("validation:pageTitle") }
            title={ (
                <>
                    { t("validation:pageTitle") }
                </>
            ) }
            description={ (
                <>
                    { t("validation:description") }
                    <DocumentationLink
                        link={ getLink("manage.validation.passwordValidation.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            className="password-validation-form"
        >
            <Ref innerRef={ pageContextRef }>
                <Grid container spacing={ 2 } direction="column">
                    <Grid xs={ 12 }>
                        <EmphasizedSegment
                            className="form-wrapper"
                            padded="very"
                        >
                            <div className="validation-configurations password-validation-configurations">
                                { !(isLoading
                                    || (!isRuleBasedPasswordExpiryDisabled
                                    && (isRolesListLoading || isGroupListLoading))) ? (
                                        <Form
                                            id={ FORM_ID }
                                            initialValues={ initialFormValues }
                                            uncontrolledForm={ true }
                                            validate={ null }
                                            onSubmit={ (
                                                values: ValidationFormInterface
                                            ) =>
                                                handleUpdateMyAccountData(
                                                    values
                                                )
                                            }
                                            enableReInitialize={ true }
                                        >
                                            { isRuleType && (
                                                <div className="validation-configurations-form">
                                                    { isRuleBasedPasswordExpiryDisabled
                                                        ? serverConfigurationConfig.passwordExpiryComponent(
                                                            componentId,
                                                            passwordExpiryEnabled,
                                                            setPasswordExpiryEnabled,
                                                            t,
                                                            isReadOnly )
                                                        : resolvePasswordExpiration() }
                                                    <Divider className="heading-divider" />
                                                    { serverConfigurationConfig.passwordHistoryCountComponent(
                                                        componentId,
                                                        passwordHistoryEnabled,
                                                        setPasswordHistoryEnabled,
                                                        t,
                                                        isReadOnly
                                                    ) }
                                                </div>
                                            ) }
                                            { isPasswordInputValidationEnabled
                                                ? resolvePasswordValidation()
                                                : resolveLegacyPasswordValidation()
                                            }
                                            <Field.Button
                                                form={ FORM_ID }
                                                size="small"
                                                buttonType="primary_btn"
                                                ariaLabel="Validation configuration update button"
                                                name="update-button"
                                                data-testid={ `${ componentId }-submit-button` }
                                                loading={ isSubmitting }
                                                label={ t("common:update") }
                                                hidden={ isReadOnly }
                                            />
                                        </Form>
                                    ) : (
                                        <ContentLoader />
                                    ) }
                            </div>
                        </EmphasizedSegment>
                    </Grid>
                    <Grid xs={ 12 }>
                        <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                            <DangerZone
                                actionTitle={ t("governanceConnectors:dangerZone.actionTitle") }
                                header= { t("governanceConnectors:dangerZone.heading") }
                                subheader= { t("governanceConnectors:dangerZone.subHeading") }
                                onActionClick={ () => handleRevertValidationRules() }
                                data-testid={ `${ componentId }-danger-zone` }
                            />
                        </DangerZoneGroup>
                    </Grid>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ValidationConfigEditPage.defaultProps = {
    "data-componentid": "validation-config-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ValidationConfigEditPage;
