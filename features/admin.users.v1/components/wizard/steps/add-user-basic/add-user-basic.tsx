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

import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import OxygenGrid from "@oxygen-ui/react/Grid";
import InputLabel from "@oxygen-ui/react/InputLabel";
import MuiRadio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Skeleton from "@oxygen-ui/react/Skeleton";
import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs";
import { userConfig } from "@wso2is/admin.extensions.v1/configs/user";
import { ConnectorPropertyInterface } from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { useGetUserStore } from "@wso2is/admin.userstores.v1/api/use-get-user-store";
import { USERSTORE_REGEX_PROPERTIES } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem, UserStoreProperty } from "@wso2is/admin.userstores.v1/models";
import { ValidationDataInterface, ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { getFlattenedInitialValues } from "@wso2is/common.users.v1/utils/profile-utils";
import { ProfileConstants } from "@wso2is/core/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    Claim,
    IdentifiableComponentInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ProfileUtils } from "@wso2is/core/utils";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    SelectFieldAdapter,
    TextFieldAdapter
} from "@wso2is/form";
import { FormApi, FormSpy } from "@wso2is/form/src";
import { FormValue } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, {
    MutableRefObject,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { FormSpyRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, Grid } from "semantic-ui-react";
import AskPasswordOption from "./ask-password-option";
import CreatePasswordOption from "./create-password-option";
import DynamicFieldRenderer from "./dynamic-field-renderer";
import MultiValuedEmailField from "./multi-valued-email-field";
import MultiValuedMobileField from "./multi-valued-mobile-field";
import { getUsersList } from "../../../../api/users";
import {
    AskPasswordOptionTypes,
    AttributeDataType,
    HiddenFieldNames,
    PasswordOptionTypes,
    UserFeatureDictionaryKeys,
    UserManagementConstants
} from "../../../../constants";
import {
    BasicUserDetailsInterface,
    UserListInterface
} from "../../../../models/user";
import {
    getConfiguration,
    getDisplayOrder,
    getUsernameConfiguration,
    isFieldDisplayableInUserCreationWizard
} from "../../../../utils";
import "./add-user-basic.scss";

/**
 * Proptypes for the add user basic details component.
 */
interface AddUserBasicProps extends IdentifiableComponentInterface {
    initialValues: any;
    triggerSubmit: boolean;
    setTriggerSubmit: () => void;
    emailVerificationEnabled: boolean;
    onSubmit: (values: BasicUserDetailsInterface) => void;
    requestedPasswordOption?: PasswordOptionTypes;
    isUserstoreRequired?: boolean;
    validationConfig?: ValidationDataInterface[];
    passwordOption: PasswordOptionTypes;
    setPasswordOption: (option: PasswordOptionTypes) => void;
    setUserSummaryEnabled: (toggle: boolean) => void;
    setAskPasswordFromUser?: (toggle: boolean) => void;
    setOfflineUser?: (toggle: boolean) => void;
    selectedUserStore?: string;
    setSelectedUserStore: (selectedUserStore: string) => void;
    isBasicDetailsLoading?: boolean;
    setBasicDetailsLoading?: (toggle: boolean) => void;
    selectedUserStoreId: string;
    connectorProperties: ConnectorPropertyInterface[];
    hasWorkflowAssociations?: boolean;
    askPasswordOption: string;
    setAskPasswordOption: (option: string) => void;
}

/**
 * Basic user details form component used in the add user wizard.
 */
export const AddUserBasic: React.FunctionComponent<AddUserBasicProps> = ({
    initialValues,
    triggerSubmit,
    setTriggerSubmit,
    emailVerificationEnabled,
    onSubmit,
    isUserstoreRequired,
    passwordOption,
    setUserSummaryEnabled,
    setAskPasswordFromUser,
    selectedUserStore,
    setPasswordOption,
    setSelectedUserStore,
    setOfflineUser,
    setBasicDetailsLoading,
    validationConfig,
    selectedUserStoreId,
    isBasicDetailsLoading,
    connectorProperties,
    hasWorkflowAssociations = false,
    askPasswordOption,
    setAskPasswordOption,
    [ "data-componentid" ]: componentId = "add-user-basic"
}: AddUserBasicProps): ReactElement => {
    const { t } = useTranslation();

    const { UIConfig } = useUIConfig();

    const { isUserStoreReadOnly, userStoresList } = useUserStores();

    const dispatch: Dispatch = useDispatch();

    const submitButtonRef: MutableRefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

    const profileSchemas: ProfileSchemaInterface[] = useSelector(
        (state: AppState) => state.profile.profileSchemas);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const systemReservedUserStores: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.systemReservedUserStores);
    const [ passwordConfig, setPasswordConfig ] = useState<ValidationFormInterface>(undefined);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ userStore, setUserStore ] = useState<string>(selectedUserStoreId);
    const [ isValidEmail, setIsValidEmail ] = useState<boolean>(false);
    const [ isEmailFilled, setIsEmailFilled ] = useState<boolean>(false);
    const [ hiddenFields, setHiddenFields ] = useState<(HiddenFieldNames)[]>([]);
    const [ isFirstNameRequired, setFirstNameRequired ] = useState<boolean>(true);
    const [ isLastNameRequired, setLastNameRequired ] = useState<boolean>(true);
    const [ isEmailRequired, setEmailRequired ] = useState<boolean>(false);
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchemaInterface[]>();

    const triggerSubmitRef: MutableRefObject<boolean> = useRef<boolean>(triggerSubmit);

    const isDistinctAttributeProfilesDisabled: boolean = featureConfig?.attributeDialects?.disabledFeatures?.includes(
        ClaimManagementConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG
    );
    const isAttributeProfileForUserCreationEnabled: boolean = isFeatureEnabled(
        featureConfig?.users,
        UserManagementConstants.ATTRIBUTE_PROFILES_FOR_USER_CREATION_FEATURE_FLAG
    );
    const useDefaultLabelsAndOrder: boolean = isFeatureEnabled(
        featureConfig?.users,
        UserManagementConstants.FEATURE_DICTIONARY.get(UserFeatureDictionaryKeys.UseDefaultLabelsAndOrder)
    );
    const isMultipleEmailAndMobileNumberEnabled: boolean = UIConfig?.isMultipleEmailsAndMobileNumbersEnabled;
    const EMAIL_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
    const MOBILE_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
    const EMAIL_ADDRESSES_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
    const MOBILE_NUMBERS_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");
    const VERIFIED_MOBILE_NUMBERS_ATTRIBUTE: string =
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS");
    const VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE: string =
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES");

    // List of SCIM2 schemas that should not be displayed in the user creation wizard.
    // These schemas are either not required or hard-coded in the wizard UI.
    const hiddenSchemas: string[] = [
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("GROUPS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD"),
        // Following two fields are hardcoded.
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("FIRST_NAME"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("LAST_NAME")
    ];

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("users:consumerUsers.fields.username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t(
        "users:consumerUsers.fields.username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t(
        "users:consumerUsers.fields.username.validations.invalidCharacters");
    const USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE: string = t(
        "extensions:manage.features.user.addUser.validation.usernameSymbols");
    const USERNAME_HAS_INVALID_SPECIAL_SYMBOLS_ERROR_MESSAGE: string = t(
        "extensions:manage.features.user.addUser.validation.usernameSpecialCharSymbols");
    const USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE: string =
        t("extensions:manage.features.user.addUser.validation.usernameLength", {
            maxLength: usernameConfig?.maxLength,
            minLength: usernameConfig?.minLength
        });

    /**
     * Fetch the details of the selected user store.
     * The user store details will be used to derive validation regex for the username/password.
     */
    const {
        data: originalUserStore,
        isLoading: isUserStoreRequestLoading,
        isValidating: isUserStoreRequestValidating
    } = useGetUserStore(userStore);

    /**
     * Fetch all the local claims.
     */
    const {
        data: fetchedAttributes,
        error: attributesRequestError,
        isLoading: isAttributesRequestLoading
    } = useGetAllLocalClaims({
        "exclude-identity-claims": true,
        filter: null,
        limit: null,
        offset: null,
        sort: null
    });

    /**
     * Handle the attributes fetch request error.
     */
    useEffect(() => {
        if (attributesRequestError) {
            dispatch(addAlert(
                {
                    description: t("claims:local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:local.notifications.getClaims.genericError.message")
                }
            ));
        }
    }, [ attributesRequestError ]);

    const userStoreUsernameRegEx: string = useMemo(() => {
        if (originalUserStore) {
            return originalUserStore?.properties?.find(
                (property: UserStoreProperty) => property.name === USERSTORE_REGEX_PROPERTIES.UsernameRegEx)?.value;
        }
    }, [ originalUserStore ]);

    const passwordRegex: string = useMemo(() => {
        if (originalUserStore) {
            return originalUserStore?.properties?.find(
                (property: UserStoreProperty) => property.name === USERSTORE_REGEX_PROPERTIES.PasswordRegEx)?.value;
        }
    }, [ originalUserStore ]);

    const emailClaimRegex: string = useMemo(() => {
        if (fetchedAttributes && !isAttributesRequestLoading) {
            const emailAttribute: Claim = fetchedAttributes?.find(
                (attribute: Claim) =>
                    attribute?.[ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY] ===
                    ClaimManagementConstants.EMAIL_CLAIM_URI
            );

            return emailAttribute?.regEx;
        }
    }, [ fetchedAttributes ]);

    const usernameLabel: string = useMemo(() => {
        return fetchedAttributes?.find(
            (attribute: Claim) =>
                attribute?.[ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY] ===
                ClaimManagementConstants.USER_NAME_CLAIM_URI
        )?.displayName;
    }, [ fetchedAttributes ]);

    const firstNameLabel: string = useMemo(() => {
        return fetchedAttributes?.find(
            (attribute: Claim) =>
                attribute?.[ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY] ===
                ClaimManagementConstants.FIRST_NAME_CLAIM_URI
        )?.displayName;
    }, [ fetchedAttributes ]);

    const lastNameLabel: string = useMemo(() => {
        return fetchedAttributes?.find(
            (attribute: Claim) =>
                attribute?.[ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY] ===
                ClaimManagementConstants.LAST_NAME_CLAIM_URI
        )?.displayName;
    }, [ fetchedAttributes ]);

    const readWriteUserStoresList: DropdownItemProps[] = useMemo(() => {
        const storeOptions: DropdownItemProps[] = [
            {
                key: -1,
                text: userstoresConfig.primaryUserstoreName,
                value: userstoresConfig.primaryUserstoreId
            }
        ];

        if (userStoresList?.length > 0) {
            userStoresList.forEach((store: UserStoreListItem, index: number) => {
                const isReadOnly: boolean = isUserStoreReadOnly(store.name);
                const isEnabled: boolean = store.enabled;

                if (
                    store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName &&
                    !isReadOnly &&
                    isEnabled &&
                    !systemReservedUserStores?.includes(store.name.toUpperCase())
                ) {
                    const storeOption: DropdownItemProps = {
                        key: index,
                        text: store.name,
                        value: store.id
                    };

                    storeOptions.push(storeOption);
                }
            });
        }

        return storeOptions;
    }, [ userStoresList ]);

    useEffect(() => {
        resolveNamefieldAttributes();
    }, []);

    useEffect(() => {
        if (!triggerSubmitRef.current && triggerSubmit) {
            // Trigger the form submission.
            submitButtonRef.current?.click();
        }

        triggerSubmitRef.current = triggerSubmit;
    }, [ triggerSubmit ]);

    /**
     * It toggles user summary, password creation prompt, offline status according to password options.
     */
    useEffect(() => {
        if (passwordOption === PasswordOptionTypes.CREATE_PASSWORD) {
            setUserSummaryEnabled(true);
            setAskPasswordFromUser(true);
            setOfflineUser(false);
        } else {
            if (askPasswordOption === "offline") {
                setUserSummaryEnabled(true);
                setAskPasswordFromUser(false);
                setOfflineUser(true);

                return;
            }
            setUserSummaryEnabled(false);
            setAskPasswordFromUser(false);
            setOfflineUser(false);
        }
    }, [ passwordOption, askPasswordOption ]);

    /**
     * This sets the username and password validation rules.
     */
    useEffect(() => {
        if (validationConfig) {
            setPasswordConfig(getConfiguration(validationConfig));
            setUsernameConfig(getUsernameConfiguration(validationConfig));
        }
    }, [ validationConfig ]);

    useEffect(() => {
        if (!isAlphanumericUsernameEnabled()) {
            setIsValidEmail(true);
        } else {
            setIsValidEmail(false);
        }
    }, [ usernameConfig ]);


    useEffect(() => {
        if (!isAttributeProfileForUserCreationEnabled) {
            return;
        }

        const filteredSchemas: ProfileSchemaInterface[] = [];
        const simpleMultiValuedExtendedSchemas: ProfileSchemaInterface[] = [];
        const flattenedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas([ ...profileSchemas ]);

        if (isMultipleEmailAndMobileNumberEnabled) {
            // If this feature is enabled, we need to show the email and mobile number attributes
            // as multi-valued input fields.
            const emailSchema: ProfileSchemaInterface = flattenedSchemas
                .find((schema: ProfileSchemaInterface) => schema.name === EMAIL_ATTRIBUTE);
            const mobileSchema: ProfileSchemaInterface = flattenedSchemas
                .find((schema: ProfileSchemaInterface) => schema.name === MOBILE_ATTRIBUTE);
            const emailAddressesSchema: ProfileSchemaInterface = flattenedSchemas
                .find((schema: ProfileSchemaInterface) => schema.name === EMAIL_ADDRESSES_ATTRIBUTE);
            const mobileNumbersSchema: ProfileSchemaInterface = flattenedSchemas
                .find((schema: ProfileSchemaInterface) => schema.name === MOBILE_NUMBERS_ATTRIBUTE);

            // If emailaddresses and mobilenumbers are displayed in the wizard AND isMultipleEmailAndMobileNumberEnabled
            // We need the email and mobile attributes regardless whether they are displayed or not.
            // These attributes will be used to set the primary email and mobile number.
            if (isFieldDisplayableInUserCreationWizard(emailAddressesSchema, isDistinctAttributeProfilesDisabled) &&
                !isFieldDisplayableInUserCreationWizard(emailSchema, isDistinctAttributeProfilesDisabled)) {
                filteredSchemas.push(emailSchema);
            }

            if (isFieldDisplayableInUserCreationWizard(mobileNumbersSchema, isDistinctAttributeProfilesDisabled) &&
                !isFieldDisplayableInUserCreationWizard(mobileSchema, isDistinctAttributeProfilesDisabled)) {
                filteredSchemas.push(mobileSchema);
            }
        }

        for (const schema of flattenedSchemas) {
            if (isEmpty(schema) ||
                !isFieldDisplayableInUserCreationWizard(schema, isDistinctAttributeProfilesDisabled)) {
                continue;
            }

            // If multiple email and mobile number feature is disabled,
            // we need to hide the email addresses and mobile numbers attributes.
            if (!isMultipleEmailAndMobileNumberEnabled) {
                if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                    continue;
                }
            }

            // Only simple multi-valued attributes in extended schemas are supported generally.
            if (schema.extended && schema.multiValued && schema.type !== AttributeDataType.COMPLEX) {
                simpleMultiValuedExtendedSchemas.push(schema);
            }

            filteredSchemas.push(schema);

        }

        filteredSchemas.sort((a: ProfileSchemaInterface, b: ProfileSchemaInterface) =>
            getDisplayOrder(a) - getDisplayOrder(b));

        setProfileSchema(filteredSchemas);
    }, [ profileSchemas ]);

    /*
    * This map the user data to schema using initial values of the wizard.
    * This is used to persist wizard data when the user clicks on the back button.
    */
    const flattenedInitialValues: Record<string, unknown> = useMemo(() => {
        if (isAttributeProfileForUserCreationEnabled && profileSchema) {
            return getFlattenedInitialValues(
                initialValues ?? {}, profileSchema, isMultipleEmailAndMobileNumberEnabled, false, false);
        }
    }, [ profileSchema, initialValues, isMultipleEmailAndMobileNumberEnabled ]);

    /**
     * This will set the ask password option as OFFLINE if email verification is not enabled or email is not required.
     */
    useEffect(() => {
        if (!hasWorkflowAssociations) {
            if (userConfig.defautlAskPasswordOption === AskPasswordOptionTypes.OFFLINE
                || !emailVerificationEnabled || !isEmailRequired) {
                setAskPasswordOption(AskPasswordOptionTypes.OFFLINE);
            }
        } else if (emailVerificationEnabled && isEmailRequired) {
            setAskPasswordOption(AskPasswordOptionTypes.EMAIL);
        } else {
            setAskPasswordOption(userConfig?.defautlAskPasswordOption !== AskPasswordOptionTypes.OFFLINE
                ? userConfig?.defautlAskPasswordOption
                : null
            );
        }
    }, [ isEmailRequired ]);

    const resolveNamefieldAttributes = () => {
        const hiddenAttributes: (HiddenFieldNames)[] = [];
        const nameSchema: ProfileSchemaInterface = profileSchemas
            .find((schema: ProfileSchemaInterface) => schema.name === "name");
        const emailSchema: ProfileSchemaInterface = profileSchemas
            .find((schema: ProfileSchemaInterface) => (schema.name === "emails"));

        if (emailSchema) {
            hiddenAttributes.push(HiddenFieldNames.EMAIL);
            setEmailRequired(emailSchema.required);
        }

        if (nameSchema?.subAttributes?.length > 0) {
            // Check for presence of firstName, lastName attributes.
            const firstNameAttribute: ProfileSchemaInterface = nameSchema.subAttributes
                .find((attribute: ProfileSchemaInterface) => attribute.name === "givenName");
            const lastNameAttribute: ProfileSchemaInterface = nameSchema.subAttributes
                .find((attribute: ProfileSchemaInterface) => attribute.name === "familyName");

            if (firstNameAttribute && lastNameAttribute) {
                setFirstNameRequired(firstNameAttribute.required);
                setLastNameRequired(lastNameAttribute.required);

            } else {
                if (firstNameAttribute) {
                    // First Name attribute is available.
                    // But Last Name attribute is not available
                    hiddenAttributes.push(HiddenFieldNames.LASTNAME);
                    setFirstNameRequired(firstNameAttribute.required);
                }

                if (lastNameAttribute) {
                    // Last Name attribute is available.
                    // But First Name attribute is not available
                    hiddenAttributes.push(HiddenFieldNames.FIRSTNAME);
                    setLastNameRequired(lastNameAttribute.required);
                }
            }
        } else {
            // If nameSchema is not present, firstName and lastName is set
            // to be not visible on the attributes.
            // Therefore it is hidden from the add user wizard.
            hiddenAttributes.push(HiddenFieldNames.FIRSTNAME, HiddenFieldNames.LASTNAME);
        }
        setHiddenFields(hiddenAttributes);
    };

    /**
     * Check whether the alphanumeric usernames are enabled.
     *
     * @returns isAlphanumericUsernameEnabled - validation status.
     */
    const isAlphanumericUsernameEnabled = (): boolean => usernameConfig?.enableValidator === "true";

    const askPasswordOptionData: any = {
        "data-testid": "user-mgt-add-user-form-ask-password-option-radio-button",
        label: t("user:forms.addUserForm.buttons.radioButton.options.askPassword"),
        value: PasswordOptionTypes.ASK_PASSWORD
    };

    const createPasswordOptionData: any = {
        "data-testid": "user-mgt-add-user-form-create-password-option-radio-button",
        label: t("user:forms.addUserForm.buttons.radioButton.options.createPassword"),
        value: PasswordOptionTypes.CREATE_PASSWORD
    };

    /**
     * The following function handles email empty validation.
     *
     * @param values - Map of form values.
     */
    const handleEmailEmpty = (values: Map<string, FormValue>): void => {
        if (values.get("email")?.toString() === "") {
            setIsEmailFilled(false);
        } else {
            setIsEmailFilled(true);
        }
    };

    const resolveUsernamePasswordFields = (): ReactElement => {
        // Email as username enabled.
        if (UIConfig?.enableEmailDomain) {
            const validate = async (value: string): Promise<string> => {
                setBasicDetailsLoading(true);

                if (isEmpty(value)) {
                    setBasicDetailsLoading(false);

                    return t("user:forms.addUserForm.inputs.email.validations.empty");
                }

                // Check username validity against userstore regex.
                if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, userStoreUsernameRegEx) ||
                        !SharedUserStoreUtils.validateInputAgainstRegEx(value, emailClaimRegex)) {
                    setBasicDetailsLoading(false);

                    return USERNAME_REGEX_VIOLATION_ERROR_MESSAGE;
                }

                try {
                    // Check for the existence of users in the userstore by the username.
                    // Some characters disallowed by username
                    // -regex cause failure in below request.
                    // Therefore, existence of duplicates is
                    // -checked only post regex validation success.
                    const usersList: UserListInterface
                        = await getUsersList(null, null, "userName eq " + value, null, selectedUserStore);

                    if (usersList?.totalResults > 0) {
                        setBasicDetailsLoading(false);

                        return USER_ALREADY_EXIST_ERROR_MESSAGE;
                    }

                    setBasicDetailsLoading(false);
                } catch (error) {
                    // Some non ascii characters are not accepted by DBs
                    // with certain charsets.
                    // Hence, the API sends a `500` status code.
                    // see below issue for more context.
                    // https://github.com/wso2/product-is/issues/10190#issuecomment-719760318
                    if (error?.response?.status === 500) {
                        setBasicDetailsLoading(false);

                        return USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE;
                    }
                }

                return undefined;
            };

            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <FinalFormField
                            component={ TextFieldAdapter }
                            initialValue={ initialValues?.email }
                            name="email"
                            label={ t("extensions:manage.features.user.addUser.inputLabel.emailUsername") }
                            placeholder={ t("user:forms.addUserForm.inputs.email.placeholder") }
                            validate={ validate }
                            maxLength={ 60 }
                            data-testid="user-mgt-add-user-form-email-input"
                            data-componentid="user-mgt-add-user-form-email-input"
                            required
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        if (!hiddenFields.includes(HiddenFieldNames.USERNAME)
            && !isAlphanumericUsernameEnabled()) {
            const validate = async (value: string): Promise<string> => {
                setBasicDetailsLoading(true);

                if (isEmpty(value)) {
                    setBasicDetailsLoading(false);

                    return t("user:forms.addUserForm.inputs.email.validations.empty");
                }

                // Check username validity against userstore regex.
                if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, userStoreUsernameRegEx) ||
                        !SharedUserStoreUtils.validateInputAgainstRegEx(value, emailClaimRegex)) {
                    setBasicDetailsLoading(false);

                    return USERNAME_REGEX_VIOLATION_ERROR_MESSAGE;
                }

                try {
                    // Check for the existence of users in the userstore by the username.
                    // Some characters disallowed by username
                    // -regex cause failure in below request.
                    // Therefore, existence of duplicates is
                    // -checked only post regex validation success.
                    const usersList: UserListInterface
                        = await getUsersList(null, null, "userName eq " + value, null, selectedUserStore);

                    if (usersList?.totalResults > 0) {
                        setBasicDetailsLoading(false);

                        return USER_ALREADY_EXIST_ERROR_MESSAGE;
                    }

                    setBasicDetailsLoading(false);
                } catch (error) {
                    // Some non ascii characters are not accepted by DBs
                    // with certain charsets.
                    // Hence, the API sends a `500` status code.
                    // see below issue for more context.
                    // https://github.com/wso2/product-is/issues/10190#issuecomment-719760318
                    if (error?.response?.status === 500) {
                        setBasicDetailsLoading(false);

                        return USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE;
                    }

                    setBasicDetailsLoading(false);
                }

                return undefined;
            };

            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <FinalFormField
                            component={ TextFieldAdapter }
                            initialValue={ initialValues?.email }
                            name="email"
                            label={ t("extensions:manage.features.user.addUser.inputLabel.emailUsername") }
                            placeholder={ t("user:forms.addUserForm.inputs.email.placeholder") }
                            validate={ validate }
                            maxLength={ 60 }
                            data-testid="user-mgt-add-user-form-email-input"
                            data-componentid="user-mgt-add-user-form-email-input"
                            required
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        let usernameFieldHint: string = undefined;

        if (!userConfig?.userNameValidation?.validateViaAPI &&
            userStoreUsernameRegEx === userConfig?.userNameValidation?.defaultRegex) {
            usernameFieldHint = t("user:forms.addUserForm.inputs.username.hint.defaultRegex");

        } else if (usernameConfig?.isAlphanumericOnly) {
            usernameFieldHint = t("extensions:manage.features.user.addUser.validation.usernameHint", {
                maxLength: usernameConfig?.maxLength,
                minLength: usernameConfig?.minLength
            });

        } else {
            usernameFieldHint = t("extensions:manage.features.user.addUser.validation.usernameSpecialCharHint", {
                maxLength: usernameConfig?.maxLength,
                minLength: usernameConfig?.minLength
            });
        }

        const validate = async (value: string): Promise<string> => {
            let errorMessage: string = undefined;

            if (isEmpty(value)) {
                errorMessage = t("extensions:manage.features.user.addUser.validation.usernameEmpty");

            } else if (userConfig?.userNameValidation?.validateViaAPI) {
                let regExpInvalidUsername: RegExp = new RegExp(
                    UserManagementConstants.USERNAME_VALIDATION_REGEX);

                // Check if special characters enabled for username.
                if (!usernameConfig?.isAlphanumericOnly) {
                    regExpInvalidUsername = new RegExp(
                        UserManagementConstants.USERNAME_VALIDATION_REGEX_WITH_SPECIAL_CHARS);
                }

                // Check username length validations.
                if (value.length < Number(usernameConfig.minLength)
                    || value.length > Number(usernameConfig.maxLength)) {
                    errorMessage = USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE;

                // Check username validity against userstore regex.
                } else if (!regExpInvalidUsername.test(value)) {
                    if (usernameConfig?.isAlphanumericOnly) {
                        errorMessage = USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE;
                    } else {
                        errorMessage = USERNAME_HAS_INVALID_SPECIAL_SYMBOLS_ERROR_MESSAGE;
                    }
                }
            } else if (!isEmpty(userStoreUsernameRegEx)) {
                // Check username validity against userstore regex.
                const _userStoreUsernameRegEx: RegExp = new RegExp(userStoreUsernameRegEx);

                if (!_userStoreUsernameRegEx.test(value)) {

                    if (userStoreUsernameRegEx === userConfig?.userNameValidation?.defaultRegex) {
                        errorMessage = t("user:forms.addUserForm.inputs.username.validations.defaultRegex");
                    } else {
                        errorMessage = t("user:forms.addUserForm.inputs.username.validations.customRegex", {
                            regex: userStoreUsernameRegEx
                        });
                    }
                }
            }

            if (isEmpty(errorMessage)) {
                try {
                    setBasicDetailsLoading(true);
                    // Check for the existence of users in the userstore by the username.
                    // Some characters disallowed by username
                    // -regex cause failure in below request.
                    // Therefore, existence of duplicates is
                    // -checked only post regex validation success.
                    const usersList: UserListInterface
                        = await getUsersList(null, null, "userName eq " + value, null, selectedUserStore);

                    if (usersList?.totalResults > 0) {
                        errorMessage = USER_ALREADY_EXIST_ERROR_MESSAGE;
                    }
                } catch (error) {
                    // Some non ascii characters are not accepted by DBs
                    // with certain charsets.
                    // Hence, the API sends a `500` status code.
                    // see below issue for more context.
                    // https://github.com/wso2/product-is/issues/
                    // 10190#issuecomment-719760318
                    if (error?.response?.status === 500) {
                        errorMessage = USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE;
                    }
                }
            }
            setBasicDetailsLoading(false);

            return errorMessage;
        };

        return (
            <>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <FinalFormField
                            component={ TextFieldAdapter }
                            label={ useDefaultLabelsAndOrder ?
                                t("extensions:manage.features.user.addUser.inputLabel.alphanumericUsername") :
                                usernameLabel
                            }
                            name="username"
                            initialValue={ initialValues?.userName }
                            placeholder={ t("extensions:manage.features.user.addUser.inputLabel" +
                                ".alphanumericUsernamePlaceholder") }
                            validate={ validate }
                            validateFields={ [] }
                            maxLength={ 60 }
                            helperText={ usernameFieldHint }
                            data-testid="user-mgt-add-user-form-username-input"
                            data-componentid="user-mgt-add-user-form-username-input"
                            required
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        { resolveEmailField() }
                    </Grid.Column>
                </Grid.Row>
            </>
        );
    };

    const resolveEmailField = (): ReactNode => {
        const emailFieldComponentId: string = "user-mgt-add-user-form-alphanumeric-email-input";
        // Return multiple email input field if the emailAddress is displayed.
        const emailAddressesSchema: ProfileSchemaInterface = !isEmpty(profileSchema) && profileSchema.find(
            (schema: ProfileSchemaInterface) => schema.name === EMAIL_ADDRESSES_ATTRIBUTE);

        if (isAttributeProfileForUserCreationEnabled &&
            isMultipleEmailAndMobileNumberEnabled &&
            emailAddressesSchema &&
            isFieldDisplayableInUserCreationWizard(emailAddressesSchema, isDistinctAttributeProfilesDisabled)) {

            const primaryEmailSchema: ProfileSchemaInterface = !isEmpty(profileSchema) && profileSchema.find(
                (schema: ProfileSchemaInterface) => schema.name === EMAIL_ATTRIBUTE);

            return (
                <MultiValuedEmailField
                    schema={ emailAddressesSchema }
                    primaryEmailSchema={ primaryEmailSchema }
                    primaryEmailAddress={ flattenedInitialValues[EMAIL_ATTRIBUTE] as string }
                    fieldLabel={ t("user:profile.fields." +
                        emailAddressesSchema.name.replace(".", "_"), { defaultValue: emailAddressesSchema.displayName }
                    ) }
                    emailAddressesList={ flattenedInitialValues[
                        ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.[EMAIL_ADDRESSES_ATTRIBUTE] ?? [] }
                    maxValueLimit={ ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED }
                    data-componentid={ emailFieldComponentId }
                    data-testid={ emailFieldComponentId }
                />
            );
        }

        const validate = (value: string): string => {
            setBasicDetailsLoading(true);

            let errorMessage: string = undefined;

            if (isEmailRequired && isEmpty(value)) {
                errorMessage = t("user:forms.addUserForm.inputs.email.validations.empty");

            } else if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, emailClaimRegex)) {
                errorMessage = USERNAME_REGEX_VIOLATION_ERROR_MESSAGE;
            }

            setIsValidEmail(isEmpty(errorMessage));
            setBasicDetailsLoading(false);

            return errorMessage;
        };

        return (
            <FinalFormField
                component={ TextFieldAdapter }
                label={ t("extensions:manage.features.user.addUser.inputLabel.email") }
                name="email"
                initialValue={ initialValues?.email }
                placeholder={ t("user:forms.addUserForm.inputs.email.placeholder") }
                required={ isEmailRequired }
                validate={ validate }
                validateFields={ [] }
                maxLength={ 60 }
                listen={ handleEmailEmpty }
                data-testid={ emailFieldComponentId }
                data-componentid={ emailFieldComponentId }
            />
        );
    };

    const resolveMobileField = (): ReactNode => {
        // Multiple mobile numbers schema.
        const mobileNumbersSchema: ProfileSchemaInterface = profileSchema?.find(
            (schema: ProfileSchemaInterface) => schema.name === MOBILE_NUMBERS_ATTRIBUTE);
        // Single mobile number schema.
        const mobileSchema: ProfileSchemaInterface = profileSchema?.find(
            (schema: ProfileSchemaInterface) => schema.name === MOBILE_ATTRIBUTE);

        // Return multiple mobile input field if multiple mobile numbers are displayed.
        if (isMultipleEmailAndMobileNumberEnabled && mobileNumbersSchema &&
            isFieldDisplayableInUserCreationWizard(mobileNumbersSchema, isDistinctAttributeProfilesDisabled)) {

            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <MultiValuedMobileField
                            schema={ mobileNumbersSchema }
                            primarySchema={ mobileSchema }
                            fieldLabel={ t("user:profile.fields." +
                                mobileNumbersSchema.name.replace(".", "_"), {
                                defaultValue: mobileNumbersSchema.displayName }
                            ) }
                            primaryMobileNumber={ flattenedInitialValues[MOBILE_ATTRIBUTE] as string }
                            mobileNumbersList={ flattenedInitialValues[
                                ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.[MOBILE_NUMBERS_ATTRIBUTE] ?? [] }
                            maxValueLimit={ ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED }
                            isUpdating={ isBasicDetailsLoading }
                            data-componentid={ `${ componentId }-${ mobileNumbersSchema.name }-input` }
                            data-testid={ `${ componentId }-${ mobileNumbersSchema.name }-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        // Return single mobile input field if the mobile number is displayed.
        if (isFieldDisplayableInUserCreationWizard(mobileSchema, isDistinctAttributeProfilesDisabled)) {
            const resolvedComponentId: string = `${ componentId }-${ mobileSchema.name }-input`;
            const fieldName: string = t("user:profile.fields." +
                mobileSchema.name.replace(".", "_"), { defaultValue: mobileSchema.displayName }
            );

            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <FinalFormField
                            component={ TextFieldAdapter }
                            name={ mobileSchema.name }
                            label={ fieldName }
                            placeholder={ t("user:forms.addUserForm.inputs.generic.placeholder", { label: fieldName }) }
                            initialValue={ flattenedInitialValues?.[mobileSchema.name] as string }
                            validate={ (value: string) => {
                                if (isEmpty(value)) {
                                    return t("user:forms.addUserForm.inputs.generic.validations.empty", {
                                        label: fieldName });
                                }
                                if (!RegExp(mobileSchema.regEx).test(value)) {
                                    return t("users:forms.validation.formatError", { field: fieldName });
                                }
                            } }
                            maxLength={
                                mobileSchema.maxLength
                                    ? mobileSchema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            }
                            validateFields={ [] }
                            data-componentid={ resolvedComponentId }
                            required
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        // If the mobile number is not displayed, return null.
        return null;
    };

    const resolveDynamicField = (schema: ProfileSchemaInterface, index: number): ReactElement => {
        // Email and mobile fields are separately handled, therefore they don't need to be rendered here.
        const fieldsToHide: string[] = [
            EMAIL_ATTRIBUTE,
            EMAIL_ADDRESSES_ATTRIBUTE,
            MOBILE_ATTRIBUTE,
            MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE
        ];

        if (isEmpty(schema) || fieldsToHide.includes(schema.name) || hiddenSchemas.includes(schema.name)) {
            return;
        }

        return (
            <Grid.Row columns={ 1 } key={ index }>
                <Grid.Column mobile={ 16 } computer={ 10 }>
                    <DynamicFieldRenderer
                        schema={ schema }
                        initialValues={ flattenedInitialValues }
                        isUpdating={ false }
                        data-componentid={ `${componentId}-profile-form` }
                    />
                </Grid.Column>
            </Grid.Row>
        );
    };

    const handleFormSubmit = (values: Record<string, unknown>): void => {
        const decodedFormValues: Record<string, unknown> = {};

        for (const key in values) {
            const decodedKey: string = key.replace(/__DOT__/g, ".");

            decodedFormValues[decodedKey] = values[key];
        }

        for (const key in decodedFormValues) {
            if (key === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")) {
                const values: Record<string, string> = decodedFormValues[key] as Record<string, string>;
                const convertedValues: (string | Record<string, string>)[] = [];

                for (const emailType in values) {
                    if (emailType === "primary") {
                        convertedValues.push(values[emailType]);
                    } else {
                        convertedValues.push({
                            type: emailType,
                            value: values[emailType]
                        });
                    }
                }

                decodedFormValues[key] = convertedValues;
            } else if (key === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")) {
                const values: Record<string, string> = decodedFormValues[key] as Record<string, string>;
                const convertedValues: Record<string, string>[] = [];

                for (const phoneType in values) {
                    convertedValues.push({
                        type: phoneType,
                        value: values[phoneType]
                    });
                }

                decodedFormValues[key] = convertedValues;
            } else if (key === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")) {
                const values: Record<string, string> = decodedFormValues[key] as Record<string, string>;
                const convertedValues: Record<string, string>[] = [];

                for (const addressType in values) {
                    convertedValues.push({
                        formatted: values[addressType],
                        type: addressType
                    });
                }

                decodedFormValues[key] = convertedValues;
            }
        }

        decodedFormValues.domain = readWriteUserStoresList.find(
            (store: DropdownItemProps) => store.value === values.userstore
        )?.text;
        // User Store will be submitted as `domain`.
        delete decodedFormValues.userstore;
        // Delete the value of hidden field, which is used to keep track of password validity.
        delete decodedFormValues.newPasswordValidity;

        decodedFormValues["userName"] = UIConfig?.enableEmailDomain
            ? values["email"]?.toString()
            : values["username"]?.toString();
        delete decodedFormValues["username"];

        onSubmit(decodedFormValues);
    };

    /**
     * Handles the submit button click.
     * Responsible for resetting the submit state in the parent component if there are validation errors. And also
     * submitting the form if there are no validation errors.
     *
     * @param form - The form API.
     * @param hasValidationErrors - Whether the form has validation errors.
     */
    const onSubmitClick = (form: FormApi, hasValidationErrors: boolean): void => {
        if (hasValidationErrors) {
            // If there are validation errors, do not submit the form.
            // Reset the trigger submit state in the parent component.
            setTriggerSubmit();

            return;
        }

        form.submit();
    };

    if (isUserStoreRequestLoading || isUserStoreRequestValidating || isAttributesRequestLoading) {
        return (
            <OxygenGrid container spacing={ 3 }>
                { Array.from({ length: 3 }).map((_: unknown, idx: number) => (
                    <OxygenGrid key={ idx } xs={ 12 }>
                        <Skeleton width={ 200 } />
                        <Skeleton width={ 300 } />
                    </OxygenGrid>
                )) }
            </OxygenGrid>
        );
    }

    /**
     * Note: This form is submitted programmatically using a hidden button.
     * This is required to ensure that the submit listener is triggered correctly. So, the multi-value fields
     * are properly submitted by picking up the add field value as well.
     */
    return (
        <FinalForm
            onSubmit={ handleFormSubmit }
            data-testid="user-mgt-add-user-form"
            data-componentid="user-mgt-add-user-form"
            render={ ({ handleSubmit, form, hasValidationErrors }: FormRenderProps) => {
                return (
                    <form onSubmit={ handleSubmit }>
                        <Grid>
                            { !hiddenFields.includes(HiddenFieldNames.USERSTORE) && (
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } computer={ 10 }>
                                        <FinalFormField
                                            component={ SelectFieldAdapter }
                                            label={ t("user:forms.addUserForm.inputs.domain.placeholder") }
                                            name="userstore"
                                            initialValue={ selectedUserStoreId as string | string[] }
                                            options={ readWriteUserStoresList?.map(
                                                ({ text, value }: DropdownItemProps) => {
                                                    return {
                                                        text,
                                                        value
                                                    };
                                                }) }
                                            required={ isUserstoreRequired }
                                            data-testid="user-mgt-add-user-form-userstore-dropdown"
                                            data-componentid="user-mgt-add-user-form-userstore-dropdown"
                                        />
                                        <FormSpy
                                            subscription={ { values: true } }
                                            onChange={ ({ values }: FormSpyRenderProps) => {
                                                setUserStore(values?.userstore?.toString());

                                                const selectedUserStoreName: string = readWriteUserStoresList?.find(
                                                    (userStore: DropdownItemProps) =>
                                                        userStore.value === values?.userstore)?.text?.toString() || "";

                                                setSelectedUserStore(selectedUserStoreName);
                                            } }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { resolveUsernamePasswordFields() }

                            { !hiddenFields.includes(HiddenFieldNames.FIRSTNAME) && (
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } computer={ 10 }>
                                        <FinalFormField
                                            component={ TextFieldAdapter }
                                            label={
                                                useDefaultLabelsAndOrder ?
                                                    t("user:forms.addUserForm.inputs.firstName.label") :
                                                    firstNameLabel
                                            }
                                            name="firstName"
                                            initialValue={ initialValues?.firstName }
                                            placeholder={ t(
                                                "user:forms.addUserForm.inputs." +
                                                "firstName.placeholder"
                                            ) }
                                            required={ isFirstNameRequired }
                                            maxLength={ 30 }
                                            validate={ (value: string) => {
                                                if (isFirstNameRequired && isEmpty(value)) {
                                                    return t("user:forms.addUserForm.inputs.firstName." +
                                                        "validations.empty");
                                                }

                                                if (value?.includes("/")) {
                                                    return "First Name cannot contain the forward slash (/) character.";
                                                }
                                            } }
                                            validateFields={ [] }
                                            data-testid="user-mgt-add-user-form-firstName-input"
                                            data-componentid="user-mgt-add-user-form-firstName-input"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { !hiddenFields.includes(HiddenFieldNames.LASTNAME) && (
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } computer={ 10 }>
                                        <FinalFormField
                                            component={ TextFieldAdapter }
                                            label={
                                                useDefaultLabelsAndOrder ?
                                                    t("user:forms.addUserForm.inputs.lastName.label") :
                                                    lastNameLabel
                                            }
                                            name="lastName"
                                            initialValue={ initialValues?.lastName }
                                            placeholder={ t("user:forms.addUserForm.inputs." +
                                                "lastName.placeholder") }
                                            required={ isLastNameRequired }
                                            maxLength={ 30 }
                                            validate={ (value: string) => {
                                                if (isLastNameRequired && isEmpty(value)) {
                                                    return t(
                                                        "user:forms.addUserForm.inputs.lastName.validations.empty");
                                                }

                                                if (value?.includes("/")) {
                                                    return "Last Name cannot contain the forward slash (/) character.";
                                                }
                                            } }
                                            validateFields={ [] }
                                            data-testid="user-mgt-add-user-form-lastName-input"
                                            data-componentid="user-mgt-add-user-form-lastName-input"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            {
                                isAttributeProfileForUserCreationEnabled && profileSchema && resolveMobileField()
                            }

                            {
                                isAttributeProfileForUserCreationEnabled && profileSchema &&
                                profileSchema.map((schema: ProfileSchemaInterface, index: number) =>
                                    resolveDynamicField(schema, index)
                                )
                            }

                            { !hiddenFields.includes(HiddenFieldNames.PASSWORD) && (
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } computer={ 10 }>
                                        <InputLabel
                                            id="pw-options-radio-buttons-group-label"
                                            htmlFor="pw-options-radio-buttons-group"
                                            data-componentid={
                                                "user-mgt-add-user-form-pw-options-radio-buttons-group-label"
                                            }
                                        >
                                            { t("user:forms.addUserForm.buttons.radioButton.label") }
                                        </InputLabel>
                                        <FormControl>
                                            <RadioGroup
                                                id="pw-options-radio-buttons-group"
                                                aria-labelledby="pw-options-radio-buttons-group-label"
                                                name="handlePasswordGroup"
                                                defaultValue={ passwordOption }
                                                onChange={ (event: React.ChangeEvent, value: string) => {
                                                    setPasswordOption(value as PasswordOptionTypes);
                                                    // Update the hidden field tracking the password option.
                                                    form.change("passwordOption", value);
                                                } }
                                            >
                                                <FormControlLabel
                                                    label={ askPasswordOptionData.label }
                                                    value={ askPasswordOptionData.value }
                                                    control={ <MuiRadio /> }
                                                    data-testid={ askPasswordOptionData["data-testid"] }
                                                />

                                                { passwordOption === askPasswordOptionData.value && (
                                                    <AskPasswordOption
                                                        profileSchema={ profileSchema }
                                                        isInviteUserToSetPasswordEnabled={ emailVerificationEnabled }
                                                        isEmailFilled={ isEmailFilled }
                                                        isEmailRequired={ isEmailRequired }
                                                        isValidEmail={ isValidEmail }
                                                        selectedAskPasswordOption={
                                                            askPasswordOption as AskPasswordOptionTypes }
                                                        onAskPasswordOptionChange={ (value: AskPasswordOptionTypes) => {
                                                            setAskPasswordOption(value);
                                                        } }
                                                        connectorProperties={ connectorProperties }
                                                        localClaims={ fetchedAttributes }
                                                        isAttributeProfileForUserCreationEnabled={
                                                            isAttributeProfileForUserCreationEnabled }
                                                        isMultipleEmailAndMobileNumberEnabled={
                                                            isMultipleEmailAndMobileNumberEnabled }
                                                        isDistinctAttributeProfilesDisabled={
                                                            isDistinctAttributeProfilesDisabled }
                                                        hasWorkflowAssociations = { hasWorkflowAssociations }
                                                    />
                                                ) }

                                                <FormControlLabel
                                                    label={ createPasswordOptionData.label }
                                                    value={ createPasswordOptionData.value }
                                                    control={ <MuiRadio /> }
                                                    data-testid={ createPasswordOptionData["data-testid"] }
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        <FinalFormField
                                            component="input"
                                            type="hidden"
                                            name="passwordOption"
                                            initialValue={ passwordOption }
                                            validateFields={ [] }
                                        />

                                        { passwordOption === createPasswordOptionData.value && (
                                            <CreatePasswordOption
                                                initialValue={ initialValues?.newPassword }
                                                passwordConfig={ passwordConfig }
                                                passwordRegex={ passwordRegex }
                                                data-componentid="user-mgt-add-user-form-create-password-option"
                                            />
                                        ) }
                                    </Grid.Column>
                                </Grid.Row>
                            ) }
                        </Grid>
                        { /** This hidden button is used to submit the form programmatically */ }
                        <button
                            ref={ submitButtonRef }
                            onClick={ () => onSubmitClick(form, hasValidationErrors) }
                            hidden
                        />
                    </form>
                );
            } }
        />
    );
};
