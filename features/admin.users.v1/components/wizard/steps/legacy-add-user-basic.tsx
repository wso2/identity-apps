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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Chip from "@oxygen-ui/react/Chip";
import OxygenGrid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs";
import { userConfig } from "@wso2is/admin.extensions.v1/configs/user";
import { OperationValueInterface } from "@wso2is/admin.roles.v2/models/roles";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import { useGetUserStore } from "@wso2is/admin.userstores.v1/api/use-get-user-store";
import { USERSTORE_REGEX_PROPERTIES } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem, UserStoreProperty } from "@wso2is/admin.userstores.v1/models";
import { ValidationDataInterface, ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { ProfileConstants } from "@wso2is/core/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    Claim,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils, ProfileUtils } from "@wso2is/core/utils";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { Button, Hint, Link, PasswordValidation, Popup } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    MutableRefObject,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Form, Grid, Icon, Menu, Message, Radio } from "semantic-ui-react";
import { getUsersList } from "../../../api/users";
import {
    AskPasswordOptionTypes,
    AttributeDataType,
    HiddenFieldNames,
    LocaleJoiningSymbol,
    PasswordOptionTypes,
    UserManagementConstants
} from "../../../constants";
import {
    BasicUserDetailsInterface,
    SchemaAttributeValueInterface,
    SubValueInterface,
    UserListInterface
} from "../../../models/user";
import {
    constructPatchOpValueForMultiValuedAttribute,
    generatePassword,
    getConfiguration,
    getDisplayOrder,
    getUsernameConfiguration,
    isFieldDisplayableInUserCreationWizard,
    normalizeLocaleFormat
} from "../../../utils";
import "./add-user-basic.scss";

/**
 * Proptypes for the add user component.
 */
export interface AddUserProps extends IdentifiableComponentInterface {
    initialValues: any;
    triggerSubmit: boolean;
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
    setSelectedUserStore?: (selectedUserStore: string) => void;
    isBasicDetailsLoading?: boolean;
    setBasicDetailsLoading?: (toggle: boolean) => void;
    selectedUserStoreId: string;
}

/**
 * Add user basic component.
 *
 * @returns ReactElement
 */
export const AddUserUpdated: React.FunctionComponent<AddUserProps> = (
    props: AddUserProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
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
        isBasicDetailsLoading,
        setBasicDetailsLoading,
        validationConfig,
        selectedUserStoreId,
        [ "data-componentid" ]: componentId = "add-user-basic"
    } = props;

    const { t } = useTranslation();

    const { UIConfig } = useUIConfig();

    const { isUserStoreReadOnly, userStoresList } = useUserStores();

    const dispatch: Dispatch = useDispatch();

    const profileSchemas: ProfileSchemaInterface[] = useSelector(
        (state: AppState) => state.profile.profileSchemas);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);
    const systemReservedUserStores: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.systemReservedUserStores);

    const [ askPasswordOption, setAskPasswordOption ] = useState<string>(userConfig.defautlAskPasswordOption);
    const [ password, setPassword ] = useState<string>(initialValues?.newPassword ?? "");
    const [ passwordConfig, setPasswordConfig ] = useState<ValidationFormInterface>(undefined);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ isValidPassword, setIsValidPassword ] = useState<boolean>(true);
    const [ randomPassword, setRandomPassword ] = useState<string>(undefined);
    const [ userStore, setUserStore ] = useState<string>(selectedUserStoreId);
    const [ isValidEmail, setIsValidEmail ] = useState<boolean>(false);
    const [ isEmailFilled, setIsEmailFilled ] = useState<boolean>(false);
    const [ hiddenFields, setHiddenFields ] = useState<(HiddenFieldNames)[]>([]);
    const [ isFirstNameRequired, setFirstNameRequired ] = useState<boolean>(true);
    const [ isLastNameRequired, setLastNameRequired ] = useState<boolean>(true);
    const [ isEmailRequired, setEmailRequired ] = useState<boolean>(false);
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchemaInterface[]>();
    const [ multiValuedInputFieldValue, setMultiValuedInputFieldValue ] = useState<Record<string, string>>({});
    const [ multiValuedAttributeValues, setMultiValuedAttributeValues ] =
        useState<Record<string, string[]>>({});
    const [ primaryValues, setPrimaryValues ] = useState<Record<string, string>>({});
    const [ isMultiValuedItemInvalid, setIsMultiValuedItemInvalid ] =  useState<Record<string, boolean>>({});
    const [ simpleMultiValuedExtendedProfileSchema, setSimpleMultiValuedExtendedProfileSchema ]
        = useState<ProfileSchemaInterface[]>();
    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());

    const formBottomRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();
    const emailRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();

    /**
     * This will add role attribute to countries search input to prevent autofill suggestions.
     */
    const onCountryRefChange: any = useCallback((node: any) => {
        if (node !== null) {
            node.children[0].children[1].children[0].role = "presentation";
        }
    }, []);

    const isDistinctAttributeProfilesDisabled: boolean = featureConfig?.attributeDialects?.disabledFeatures?.includes(
        ClaimManagementConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG
    );
    const isAttributeProfileForUserCreationEnabled: boolean = isFeatureEnabled(
        featureConfig?.users,
        UserManagementConstants.ATTRIBUTE_PROFILES_FOR_USER_CREATION_FEATURE_FLAG
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
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("FIRST_NAME"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("LAST_NAME")
    ];

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("users:consumerUsers.fields." +
        "username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("users:consumerUsers.fields." +
        "username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t("users:consumerUsers.fields." +
        "username.validations.invalidCharacters");
    const USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE: string =
    t("extensions:manage.features.user.addUser.validation." +
        "usernameSymbols");
    const USERNAME_HAS_INVALID_SPECIAL_SYMBOLS_ERROR_MESSAGE: string = t("extensions:manage.features.user.addUser." +
    "validation.usernameSpecialCharSymbols");
    const USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE: string =
        t("extensions:manage.features.user.addUser.validation.usernameLength", {
            maxLength: usernameConfig?.maxLength,
            minLength: usernameConfig?.minLength
        });

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    // Hook to get the userstore details of the selected userstore.
    const {
        data: originalUserStore
    } = useGetUserStore(
        userStore
    );

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

    const countryList: DropdownItemProps[] = useMemo(() => CommonUtils.getCountryList(), []);

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

    /**
     *
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
        setSimpleMultiValuedExtendedProfileSchema(simpleMultiValuedExtendedSchemas);
    }, [ profileSchemas ]);

    /*
    * This map the user data to schema using initial values of the wizard.
    * This is used to persist wizard data when the user clicks on the back button.
    */
    useEffect(() => {
        if (!isAttributeProfileForUserCreationEnabled) {
            return;
        }

        mapUserToSchema(profileSchema, initialValues);
    }, [ profileSchema, initialValues ]);

    /**
     * This will map multi-valued attributes to the schema and form values.
     */
    useEffect(() => {
        if (!isAttributeProfileForUserCreationEnabled) {
            return;
        }

        mapMultiValuedAttributeValues(profileInfo);
    }, [ profileInfo ]);

    /**
     * This will set the ask password option as OFFLINE if email verification is not enabled or email is not required.
     */
    useEffect(() => {
        if (!emailVerificationEnabled || !isEmailRequired) {
            setAskPasswordOption(AskPasswordOptionTypes.OFFLINE);
        } else {
            setAskPasswordOption(userConfig.defautlAskPasswordOption);
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

    /**
     * Callback function to validate password.
     *
     * @param valid - validation status.
     * @param validationStatus - detailed validation status.
     */
    const onPasswordValidate = (valid: boolean): void => {
        setIsValidPassword(valid);
    };

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
     * The following function handles the change of the password.
     *
     * @param values - Map of form values.
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();

        setPassword(password);
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

    /**
     * Handles updating the primary email and mobile values when multiple emails and mobile numbers are enabled.
     *
     * @param values - The Map of form values.
     */
    const handlePrimaryEmailAndMobile = (values: Map<string, string | string[]>): void => {
        const tempPrimaryMobile: string = primaryValues[MOBILE_ATTRIBUTE];
        const mobileNumbersInputFieldValue: string = multiValuedInputFieldValue[MOBILE_NUMBERS_ATTRIBUTE];

        if (tempPrimaryMobile !== undefined && tempPrimaryMobile !== null) {
            values.set(MOBILE_ATTRIBUTE, tempPrimaryMobile);
        }

        if (isEmpty(tempPrimaryMobile) && !isEmpty(mobileNumbersInputFieldValue)) {
            values.set(MOBILE_ATTRIBUTE, mobileNumbersInputFieldValue);
        }

        const tempPrimaryEmail: string = primaryValues[EMAIL_ATTRIBUTE] ?? "";
        const emailsInputFieldValue: string = multiValuedInputFieldValue[EMAIL_ADDRESSES_ATTRIBUTE];

        if (tempPrimaryEmail !== undefined && tempPrimaryEmail !== null) {
            values.set(EMAIL_ATTRIBUTE, tempPrimaryEmail);
        }
        if (isEmpty(tempPrimaryEmail) && !isEmpty(emailsInputFieldValue)) {
            values.set(EMAIL_ATTRIBUTE, emailsInputFieldValue);
        }
    };

    const getFormValues = (values: Map<string, FormValue>): BasicUserDetailsInterface => {
        eventPublisher.publish("manage-users-customer-password-option", {
            type: passwordOption
        });

        let formValues: BasicUserDetailsInterface = {
            domain: selectedUserStore,
            email: values.get("email")?.toString(),
            firstName: values.get("firstName")?.toString(),
            lastName: values.get("lastName")?.toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined
                ? values.get("newPassword").toString()
                : "",
            passwordOption: passwordOption,
            userName: UIConfig?.enableEmailDomain
                ? values.get("email")?.toString()
                : values.get("username")?.toString()
        };

        // Include dynamic form values based on attribute profiles.
        if (isAttributeProfileForUserCreationEnabled) {
            formValues = {
                ...formValues,
                ...getDynamicFormValues(values)
            };
        }

        return formValues;
    };

    /**
     * Handles the form submission with dynamic form values based on attribute profiles.
     *
     * @param values - Map of form values.
     */
    const getDynamicFormValues = (values: Map<string, FormValue>): Record<string, unknown> => {
        const groupedOpValue: Record<string, unknown> = {};

        if (isMultipleEmailAndMobileNumberEnabled) {
            handlePrimaryEmailAndMobile(values);
        }

        profileSchema.forEach((schema: ProfileSchemaInterface) => {
            // const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;

            let opValue: OperationValueInterface = {};

            const schemaNames: string[] = schema.name.split(".");

            if (schema.name !== "roles.default") {
                if (values.get(schema.name) !== undefined && values.get(schema.name).toString() !== undefined) {

                    if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
                        schemaNames[0] === "phoneNumbers") {

                        const attributeValues: (string | string[] | SchemaAttributeValueInterface)[] = [];
                        const attValues: Map<string, string | string []> = new Map();

                        if (schemaNames.length === 1 || schemaNames.length === 2) {
                            if (schema.extended) {
                                opValue = {
                                    [schema.schemaId]: constructPatchOpValueForMultiValuedAttribute(
                                        schema.name,
                                        multiValuedAttributeValues[schema.name],
                                        multiValuedInputFieldValue[schema.name]
                                    )
                                };
                            } else {
                                // Handle emails and phoneNumbers and their sub attributes.
                                // Extract the sub attributes from the form values.
                                for (const value of values.keys()) {
                                    const subAttribute: string[] = value.split(".");

                                    if (subAttribute[0] === schemaNames[0]) {
                                        attValues.set(value, values.get(value));
                                    }
                                }

                                for (const [ key, value ] of attValues) {
                                    const attribute: string[] = key.split(".");

                                    if (value && value !== "") {
                                        if (attribute.length === 1) {
                                            attributeValues.push(value);
                                        } else {
                                            attributeValues.push({
                                                type: attribute[1],
                                                value: value
                                            });
                                        }
                                    }
                                }
                                opValue = {
                                    [schemaNames[0]]: attributeValues
                                };
                            }
                        }
                    } else {
                        if (schemaNames.length === 1) {
                            if (schema.extended) {
                                const schemaId: string = schema?.schemaId
                                    ? schema.schemaId
                                    : userConfig.userProfileSchema;

                                if (schema.name === "externalId") {
                                    opValue = {
                                        [schemaNames[0]]: values.get(schemaNames[0])
                                    };
                                } else {
                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: schema.type.toUpperCase() === "BOOLEAN"
                                                ? !!values.get(schema.name)?.includes(schema.name)
                                                : values.get(schemaNames[0])
                                        }
                                    };
                                }
                            } else {
                                opValue = schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                    .get("EMAILS")
                                    ? { emails: [ values.get(schema.name) ] }
                                    : schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                        .get("LOCALE")
                                        ? { [schemaNames[0]]: normalizeLocaleFormat(
                                            values.get(schemaNames[0]) as string,
                                            LocaleJoiningSymbol.UNDERSCORE,
                                            false,
                                            supportedI18nLanguages
                                        ) }
                                        : { [schemaNames[0]]: values.get(schemaNames[0]) };
                            }
                        } else {
                            if (schema.extended && schema.multiValued) {
                                opValue = {
                                    [schema.schemaId]: {
                                        [schemaNames[0]]: constructPatchOpValueForMultiValuedAttribute(
                                            schemaNames[1],
                                            multiValuedAttributeValues[schema.name],
                                            multiValuedInputFieldValue[schema.name]
                                        )
                                    }
                                };
                            } else if (schema.extended) {
                                const schemaId: string = schema?.schemaId ?? userConfig.userProfileSchema;

                                opValue = {
                                    [schemaId]: {
                                        [schemaNames[0]]: {
                                            [schemaNames[1]]: schema.type.toUpperCase() === "BOOLEAN"
                                                ? !!values.get(schema.name)?.includes(schema.name)
                                                : values.get(schema.name)
                                        }
                                    }
                                };
                            } else if (schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                .get("NAME")) {

                                if (!isEmpty(values.get(schema.name))) {
                                    opValue = {
                                        name: { [schemaNames[1]]: values.get(schema.name) }
                                    };
                                }
                            } else {
                                if (schemaNames[0].includes("addresses")) {
                                    if (schemaNames[0].split("#").length > 1) {
                                        // Ex: addresses#home
                                        const addressSchema: string = schemaNames[0]?.split("#")[0];
                                        const addressType: string = schemaNames[0]?.split("#")[1];

                                        opValue = {
                                            [addressSchema]: [
                                                {
                                                    type: addressType,
                                                    [schemaNames[1]]: values.get(schema.name)
                                                }
                                            ]
                                        };
                                    } else {
                                        opValue = {
                                            [schemaNames[0]]: [
                                                {
                                                    formatted: values.get(schema.name),
                                                    type: schemaNames[1]
                                                }
                                            ]
                                        };
                                    }
                                } else if (schemaNames[0] !== "emails" && schemaNames[0] !== "phoneNumbers") {
                                    opValue = {
                                        [schemaNames[0]]: [
                                            {
                                                type: schemaNames[1],
                                                value: schema.type.toUpperCase() === "BOOLEAN"
                                                    ? !!values.get(schema.name)?.includes(schema.name)
                                                    : values.get(schema.name)
                                            }
                                        ]
                                    };
                                }
                            }
                        }
                    }
                }
            }

            if (isEmpty(opValue)) {
                return;
            }

            const isPlainObject = (value: unknown): value is Record<string, any> => {
                return typeof value === "object" && value !== null && !Array.isArray(value);
            };

            for (const key in opValue) {
                if (!groupedOpValue[key]) {
                    groupedOpValue[key] = opValue[key];
                } else {
                    // Merge logic
                    const existing: Record<string, any> = groupedOpValue[key];
                    const incoming: unknown = opValue[key];

                    if (Array.isArray(existing) && Array.isArray(incoming)) {
                        groupedOpValue[key] = [ ...existing, ...incoming ];
                    } else if (isPlainObject(existing) && isPlainObject(incoming)) {
                        groupedOpValue[key] = {
                            ...existing,
                            ...incoming
                        };
                    } else {
                        // If the existing value is not an array or object, we can just overwrite it.
                        groupedOpValue[key] = incoming;
                    }
                }
            }
        });

        return groupedOpValue;
    };

    /**
     * Scrolls to the first field that throws an error.
     *
     * @param field - field The name of the field.
     */
    const scrollToInValidField = (field: string): void => {
        const options: ScrollIntoViewOptions = {
            behavior: "smooth",
            block: "center"
        };

        switch (field) {
            case "email":
                emailRef.current.scrollIntoView(options);

                break;
            case "formBottom":
                formBottomRef.current.scrollIntoView(options);

                break;
        }
    };

    /**
     * Verify whether the provided password is valid.
     *
     * @param password - The password to validate.
     */
    const isNewPasswordValid = async (password: string) => {
        if (passwordConfig) {
            return isValidPassword;
        }

        return SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex);
    };

    /**
     * Validate password and display an error message when the password is invalid.
     *
     * @param value - The value of the password field.
     * @param validation - The validation object.
     */
    const validateNewPassword = async (value: string, validation: Validation) => {
        if (!await isNewPasswordValid(value)) {
            validation.isValid = false;
            validation.errorMessages.push(passwordConfig ?
                t(
                    "extensions:manage.features.user.addUser.validation.error.passwordValidation"
                ) : t(
                    "extensions:manage.features.user.addUser.validation.password"
                ));
        }
        scrollToInValidField("formBottom");
    };

    const resolveAskPasswordOptionPopupContent = (): ReactElement => {
        if (!emailVerificationEnabled) {
            return (
                <Trans
                    i18nKey="user:modals.addUserWizard.askPassword.emailVerificationDisabled"
                >
                    To invite users to set the password, enable email invitations for user password setup from <Link
                        onClick={ () => history.push(AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                            .replace(":connectorId", ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID)) }
                        external={ false }
                    >Login & Registration settings</Link>.
                </Trans>
            );
        }

        if (!isEmailFilled || !isValidEmail) {
            return t(
                "user:modals.addUserWizard.askPassword.emailInvalid"
            );
        }

        return null;
    };

    const renderAskPasswordOption = (): ReactElement => {
        return (
            <div className="mt-4 mb-4 ml-4">
                <Menu
                    compact={ true }
                    size="small"
                    className="mb-4"
                >
                    {
                        (!emailVerificationEnabled || (!isEmailRequired && !isValidEmail)) ? (
                            <Popup
                                basic
                                inverted
                                position="top center"
                                content={ resolveAskPasswordOptionPopupContent() }
                                hoverable
                                trigger={
                                    (
                                        <Menu.Item
                                            name={ t("user:modals.addUserWizard" +
                                                ".askPassword.inviteViaEmail") }
                                            disabled
                                        />
                                    )
                                }
                            />
                        ) : (
                            <Menu.Item
                                name={ t("user:modals.addUserWizard" +
                                    ".askPassword.inviteViaEmail") }
                                active={ askPasswordOption === AskPasswordOptionTypes.EMAIL }
                                onClick={ () => setAskPasswordOption(AskPasswordOptionTypes.EMAIL) }
                            />
                        )
                    }
                    <Menu.Item
                        name={ t("user:modals.addUserWizard" +
                            ".askPassword.inviteOffline") }
                        active={ askPasswordOption === AskPasswordOptionTypes.OFFLINE }
                        onClick={ () => setAskPasswordOption(AskPasswordOptionTypes.OFFLINE) }
                    />
                </Menu>
                {
                    resolveAskPasswordOption()
                }
            </div>
        );
    };

    const resolveAskPasswordOption = (): ReactElement => {
        if (askPasswordOption === AskPasswordOptionTypes.EMAIL) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Message
                            icon="mail"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        if (askPasswordOption === AskPasswordOptionTypes.OFFLINE) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Message
                            icon="copy"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserOfflineTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        return null;
    };

    const renderCreatePasswordOption = (): ReactElement => {
        return (
            <>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <div className={ "generate-password" }>
                            <Field
                                data-testid="user-mgt-add-user-form-newPassword-input"
                                className="addon-field-wrapper full-width"
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "user:forms.addUserForm.inputs.newPassword.label"
                                ) }
                                name="newPassword"
                                placeholder={ t(
                                    "user:forms.addUserForm.inputs." +
                                    "newPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "user:forms.addUserForm." +
                                    "inputs.newPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value={ randomPassword ? randomPassword : initialValues?.newPassword }
                                validation={ validateNewPassword }
                                tabIndex={ 5 }
                                enableReinitialize={ true }
                                listen={ handlePasswordChange }
                                maxWidth={ 60 }
                            />
                            { passwordConfig && (
                                <Button
                                    basic
                                    primary
                                    size="tiny"
                                    data-testid="user-mgt-password-generate-button"
                                    type="button"
                                    className="info add-user-step-button"
                                    onClick={ () => {
                                        const randomPass: string = generatePassword(Number(passwordConfig.minLength),
                                            Number(passwordConfig.minLowerCaseCharacters) > 0,
                                            Number(passwordConfig.minUpperCaseCharacters) > 0,
                                            Number(passwordConfig.minNumbers) > 0,
                                            Number(passwordConfig.minSpecialCharacters) > 0,
                                            Number(passwordConfig.minLowerCaseCharacters),
                                            Number(passwordConfig.minUpperCaseCharacters),
                                            Number(passwordConfig.minNumbers),
                                            Number(passwordConfig.minSpecialCharacters),
                                            Number(passwordConfig.minUniqueCharacters));

                                        setRandomPassword(randomPass);
                                        setPassword(randomPass);
                                    } }
                                >
                                    Generate
                                </Button>
                            ) }
                        </div>
                        { passwordConfig && (
                            <PasswordValidation
                                password={ password }
                                minLength={ Number(passwordConfig.minLength) }
                                maxLength={ Number(passwordConfig.maxLength) }
                                minNumbers={ Number(passwordConfig.minNumbers) }
                                minUpperCase={ Number(passwordConfig.minUpperCaseCharacters) }
                                minLowerCase={ Number(passwordConfig.minLowerCaseCharacters) }
                                minSpecialChr={ Number(passwordConfig.minSpecialCharacters) }
                                minUniqueChr={ Number(passwordConfig.minUniqueCharacters) }
                                maxConsecutiveChr={ Number(passwordConfig.maxConsecutiveCharacters) }
                                onPasswordValidate={ onPasswordValidate }
                                translations={ {
                                    case: (Number(passwordConfig?.minUpperCaseCharacters) > 0 &&
                                        Number(passwordConfig?.minLowerCaseCharacters) > 0) ?
                                        t("extensions:manage.features.user.addUser.validation.passwordCase", {
                                            minLowerCase: passwordConfig.minLowerCaseCharacters,
                                            minUpperCase: passwordConfig.minUpperCaseCharacters
                                        }) : (
                                            Number(passwordConfig?.minUpperCaseCharacters) > 0 ?
                                                t("extensions:manage.features.user.addUser.validation.upperCase", {
                                                    minUpperCase: passwordConfig.minUpperCaseCharacters
                                                }) : t("extensions:manage.features.user.addUser.validation" +
                                                    ".lowerCase", {
                                                    minLowerCase: passwordConfig.minLowerCaseCharacters
                                                })
                                        ),
                                    consecutiveChr:
                                        t("extensions:manage.features.user.addUser.validation.consecutiveCharacters", {
                                            repeatedChr: passwordConfig.maxConsecutiveCharacters
                                        }),
                                    length: t("extensions:manage.features.user.addUser.validation.passwordLength", {
                                        max: passwordConfig.maxLength, min: passwordConfig.minLength
                                    }),
                                    numbers:
                                        t("extensions:manage.features.user.addUser.validation.passwordNumeric", {
                                            min: passwordConfig.minNumbers
                                        }),
                                    specialChr:
                                        t("extensions:manage.features.user.addUser.validation.specialCharacter", {
                                            specialChr: passwordConfig.minSpecialCharacters
                                        }),
                                    uniqueChr:
                                        t("extensions:manage.features.user.addUser.validation.uniqueCharacters", {
                                            uniqueChr: passwordConfig.minUniqueCharacters
                                        })
                                } }
                            />
                        ) }
                    </Grid.Column>
                </Grid.Row>
                <div ref={ formBottomRef } />
            </>
        );
    };

    const resolveUsernamePasswordFields = (): ReactElement => {
        // Email as username enabled.
        if (UIConfig?.enableEmailDomain) {
            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <div ref={ emailRef } />
                        <Field
                            loading={ isBasicDetailsLoading && isAttributesRequestLoading }
                            data-testid="user-mgt-add-user-form-email-input"
                            label={ t("extensions:manage.features.user.addUser.inputLabel" +
                                ".emailUsername") }
                            name="email"
                            placeholder={ t(
                                "user:forms.addUserForm.inputs." +
                            "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "user:forms.addUserForm.inputs.email." +
                                    "validations.empty"
                            ) }
                            validation={ async (value: string, validation: Validation) => {
                                setBasicDetailsLoading(true);

                                // Check username validity against userstore regex.
                                if (value && (
                                    !SharedUserStoreUtils.validateInputAgainstRegEx(
                                        value, userStoreUsernameRegEx) ||
                                        !SharedUserStoreUtils.validateInputAgainstRegEx(value, emailClaimRegex))) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                    setBasicDetailsLoading(false);
                                }

                                try {
                                    // Check for the existence of users in the userstore by the username.
                                    // Some characters disallowed by username
                                    // -regex cause failure in below request.
                                    // Therefore, existence of duplicates is
                                    // -checked only post regex validation success.
                                    if (value && validation.isValid === true) {
                                        const usersList: UserListInterface
                                        = await getUsersList(null, null,
                                            "userName eq " + value, null,
                                            selectedUserStore);

                                        if (usersList?.totalResults > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                            scrollToInValidField("email");
                                        }

                                        setBasicDetailsLoading(false);
                                    }
                                } catch (error) {
                                    // Some non ascii characters are not accepted by DBs
                                    // with certain charsets.
                                    // Hence, the API sends a `500` status code.
                                    // see below issue for more context.
                                    // https://github.com/wso2/product-is/issues/
                                    // 10190#issuecomment-719760318
                                    if (error?.response?.status === 500) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                        scrollToInValidField("email");
                                    }

                                    setBasicDetailsLoading(false);
                                }
                            } }
                            type="email"
                            value={ initialValues && initialValues.email }
                            tabIndex={ 1 }
                            maxLength={ 60 }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        if (!hiddenFields.includes(HiddenFieldNames.USERNAME)
            && !isAlphanumericUsernameEnabled()) {
            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <div ref={ emailRef } />
                        <Field
                            loading={ isBasicDetailsLoading }
                            data-testid="user-mgt-add-user-form-email-input"
                            label={ t("extensions:manage.features.user.addUser.inputLabel" +
                                ".emailUsername") }
                            name="email"
                            placeholder={ t(
                                "user:forms.addUserForm.inputs." +
                            "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "user:forms.addUserForm.inputs.email." +
                                    "validations.empty"
                            ) }
                            validation={ async (value: string, validation: Validation) => {
                                setBasicDetailsLoading(true);

                                // Check username validity against userstore regex.
                                if (value && (
                                    !SharedUserStoreUtils.validateInputAgainstRegEx(
                                        value, userStoreUsernameRegEx) ||
                                        !SharedUserStoreUtils.validateInputAgainstRegEx(value, emailClaimRegex))) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                    setBasicDetailsLoading(false);
                                }

                                try {
                                    // Check for the existence of users in the userstore by the username.
                                    // Some characters disallowed by username
                                    // -regex cause failure in below request.
                                    // Therefore, existence of duplicates is
                                    // -checked only post regex validation success.
                                    if (value && validation.isValid === true) {
                                        const usersList: UserListInterface
                                        = await getUsersList(null, null,
                                            "userName eq " + value, null,
                                            selectedUserStore);

                                        if (usersList?.totalResults > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                            scrollToInValidField("email");
                                        }

                                        setBasicDetailsLoading(false);
                                    }
                                } catch (error) {
                                    // Some non ascii characters are not accepted by DBs
                                    // with certain charsets.
                                    // Hence, the API sends a `500` status code.
                                    // see below issue for more context.
                                    // https://github.com/wso2/product-is/issues/
                                    // 10190#issuecomment-719760318
                                    if (error?.response?.status === 500) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                        scrollToInValidField("email");
                                    }

                                    setBasicDetailsLoading(false);
                                }
                            } }
                            type="email"
                            value={ initialValues && initialValues.email }
                            tabIndex={ 1 }
                            maxLength={ 60 }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        const resolveUsernameFieldHint = () => {
            if (
                !userConfig?.userNameValidation?.validateViaAPI &&
                userStoreUsernameRegEx === userConfig?.userNameValidation?.defaultRegex
            ) {
                return t("user:forms.addUserForm.inputs.username.hint.defaultRegex");
            }

            if (usernameConfig?.isAlphanumericOnly) {
                return t("extensions:manage.features.user.addUser.validation.usernameHint", {
                    maxLength: usernameConfig?.maxLength,
                    minLength: usernameConfig?.minLength
                });
            }

            return t("extensions:manage.features.user.addUser.validation.usernameSpecialCharHint", {
                maxLength: usernameConfig?.maxLength,
                minLength: usernameConfig?.minLength
            });
        };

        return (
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <div ref={ emailRef } />
                    <Field
                        loading={ isBasicDetailsLoading }
                        data-testid="user-mgt-add-user-form-username-input"
                        label={ t("extensions:manage.features.user.addUser.inputLabel" +
                            ".alphanumericUsername") }
                        name="username"
                        placeholder={ t("extensions:manage.features.user.addUser.inputLabel" +
                            ".alphanumericUsernamePlaceholder") }
                        required={ true }
                        requiredErrorMessage={ t("extensions:manage.features.user.addUser.validation" +
                            ".usernameEmpty") }
                        validation={ async (value: string, validation: Validation) => {
                            if (userConfig?.userNameValidation?.validateViaAPI) {
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
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                // Check username validity against userstore regex.
                                } else if (!regExpInvalidUsername.test(value)) {
                                    validation.isValid = false;
                                    if (usernameConfig?.isAlphanumericOnly) {
                                        validation.errorMessages.push(
                                            USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE);
                                    } else {
                                        validation.errorMessages.push(
                                            USERNAME_HAS_INVALID_SPECIAL_SYMBOLS_ERROR_MESSAGE);
                                    }
                                    scrollToInValidField("email");
                                }
                            } else if (!isEmpty(userStoreUsernameRegEx)) {
                                // Check username validity against userstore regex.
                                const _userStoreUsernameRegEx: RegExp = new RegExp(userStoreUsernameRegEx);

                                if (!_userStoreUsernameRegEx.test(value)) {
                                    validation.isValid = false;

                                    if (userStoreUsernameRegEx === userConfig?.userNameValidation?.defaultRegex) {
                                        validation.errorMessages
                                            .push(t("user:forms.addUserForm.inputs.username.validations.defaultRegex"));
                                    } else {
                                        validation.errorMessages
                                            .push(t("user:forms.addUserForm.inputs.username.validations.customRegex", {
                                                regex: userStoreUsernameRegEx
                                            }));
                                    }
                                    scrollToInValidField("email");
                                }
                            }

                            try {
                                setBasicDetailsLoading(true);
                                // Check for the existence of users in the userstore by the username.
                                // Some characters disallowed by username
                                // -regex cause failure in below request.
                                // Therefore, existence of duplicates is
                                // -checked only post regex validation success.
                                if (value && validation.isValid === true) {
                                    const usersList: UserListInterface
                                    = await getUsersList(null, null,
                                        "userName eq " + value, null,
                                        selectedUserStore);

                                    if (usersList?.totalResults > 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                        scrollToInValidField("email");
                                    }
                                }

                                setBasicDetailsLoading(false);
                            } catch (error) {
                                // Some non ascii characters are not accepted by DBs
                                // with certain charsets.
                                // Hence, the API sends a `500` status code.
                                // see below issue for more context.
                                // https://github.com/wso2/product-is/issues/
                                // 10190#issuecomment-719760318
                                if (error?.response?.status === 500) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                }

                                setBasicDetailsLoading(false);
                            }
                        } }
                        type="text"
                        value={ initialValues && initialValues.userName }
                        tabIndex={ 1 }
                        maxLength={ 60 }
                    />
                    { (userConfig?.userNameValidation?.validateViaAPI ||
                        userStoreUsernameRegEx === userConfig?.userNameValidation?.defaultRegex) && (
                        <Hint>{ resolveUsernameFieldHint() }</Hint>
                    ) }
                    { resolveEmailField() }
                </Grid.Column>
            </Grid.Row>
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

            const fieldName: string = t("user:profile.fields." +
                emailAddressesSchema.name.replace(".", "_"), { defaultValue: emailAddressesSchema.displayName }
            );

            return resolveMultiValuedAttributesFormField(
                emailAddressesSchema,
                fieldName,
                getDisplayOrder(emailAddressesSchema),
                emailFieldComponentId
            );
        }

        return (
            <Field
                data-testid={ emailFieldComponentId }
                data-componentid={ emailFieldComponentId }
                loading={ isAttributesRequestLoading }
                label={ "Email" }
                name="email"
                placeholder={ t(
                    "user:forms.addUserForm.inputs." +
                    "email.placeholder"
                ) }
                required={ isEmailRequired }
                requiredErrorMessage={ t(
                    "user:forms.addUserForm.inputs.email." +
                    "validations.empty"
                ) }
                validation={ async (value: string, validation: Validation) => {
                    setBasicDetailsLoading(true);

                    if (value && !SharedUserStoreUtils.validateInputAgainstRegEx(value, emailClaimRegex)) {
                        validation.isValid = false;
                        validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                        scrollToInValidField("email");
                        setIsValidEmail(false);
                    } else {
                        setIsValidEmail(true);
                    }
                    setBasicDetailsLoading(false);
                } }
                type="email"
                value={ initialValues && initialValues.email }
                tabIndex={ 1 }
                maxLength={ 60 }
                listen={ handleEmailEmpty }
            />
        );
    };

    const resolveMobileField = (): ReactNode => {
        // Return multiple mobile input field if the mobile numbers is displayed.
        const mobileNumbersSchema: ProfileSchemaInterface = profileSchema?.find(
            (schema: ProfileSchemaInterface) => schema.name === MOBILE_NUMBERS_ATTRIBUTE);

        const mobileSchema: ProfileSchemaInterface = profileSchema?.find(
            (schema: ProfileSchemaInterface) => schema.name === MOBILE_ATTRIBUTE);

        if (isMultipleEmailAndMobileNumberEnabled && mobileNumbersSchema &&
            isFieldDisplayableInUserCreationWizard(mobileNumbersSchema, isDistinctAttributeProfilesDisabled)) {
            const fieldName: string = t("user:profile.fields." +
                mobileNumbersSchema.name.replace(".", "_"), { defaultValue: mobileNumbersSchema.displayName }
            );

            return (
                <Grid.Row columns={ 1 } key={ getDisplayOrder(mobileNumbersSchema) }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        {
                            resolveMultiValuedAttributesFormField(
                                mobileNumbersSchema,
                                fieldName,
                                getDisplayOrder(mobileNumbersSchema)
                            )
                        }
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
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            data-componentid={ resolvedComponentId }
                            name={ mobileSchema.name }
                            label={ fieldName }
                            required={ true }
                            requiredErrorMessage={ fieldName + " is required" }
                            placeholder={ "Enter your " + fieldName }
                            type="text"
                            value={ profileInfo.get(mobileSchema?.name) }
                            key={ getDisplayOrder(mobileSchema) }
                            validation={ (value: string, validation: Validation) => {
                                if (!RegExp(mobileSchema.regEx).test(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages
                                        .push(t("users:forms.validation.formatError", {
                                            field: fieldName
                                        }));
                                }
                            } }
                            maxLength={
                                mobileSchema.maxLength
                                    ? mobileSchema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        // If the mobile number is not displayed, return null.
        return null;
    };

    const resolveDynamicForm = (schema: ProfileSchemaInterface, index: number): ReactElement => {
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
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    { resolveDynamicFormField(schema, index) }
                </Grid.Column>
            </Grid.Row>
        );
    };

    const resolveDynamicFormField = (schema: ProfileSchemaInterface, key: number): ReactElement => {
        const resolvedComponentId: string = `${ componentId }-${ schema.name }-input`;
        const fieldName: string = t("user:profile.fields." +
            schema.name.replace(".", "_"), { defaultValue: schema.displayName }
        );

        if (schema?.extended && schema?.multiValued) {
            return resolveMultiValuedAttributesFormField(schema, fieldName, key);
        };

        if (schema.type.toUpperCase() === "BOOLEAN") {
            return (
                <Field
                    data-componentid={ resolvedComponentId }
                    name={ schema.name }
                    required={ true }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    type="checkbox"
                    value={ profileInfo.get(schema.name) ? [ schema.name ] : [] }
                    children={ [
                        {
                            label: fieldName,
                            value: schema.name
                        }
                    ] }
                    key={ key }
                />
            );
        } else if (schema.name === "country") {
            return (
                <Field
                    ref={ onCountryRefChange }
                    data-componentid={ resolvedComponentId }
                    name={ schema.name }
                    label={ fieldName }
                    required={ true }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    placeholder={ "Select your" + " " + fieldName }
                    type="dropdown"
                    value={ profileInfo.get(schema.name) }
                    children={ [ {
                        "data-componentid": `${ componentId }-country-dropdown-empty` as string,
                        key: "empty-country" as string,
                        text: "Select your country" as string,
                        value: "" as string
                    } ].concat(
                        countryList
                            ? countryList.map((list: DropdownItemProps) => {
                                return {
                                    "data-componentid": `${ componentId }-country-dropdown-` +  list.value as string,
                                    flag: list.flag,
                                    key: list.key as string,
                                    text: list.text as string,
                                    value: list.value as string
                                };
                            })
                            : []
                    ) }
                    key={ key }
                    clearable={ false }
                    search
                    selection
                    fluid
                />
            );
        } else if (schema?.name === "locale") {
            return (
                <Field
                    data-componentid={ resolvedComponentId }
                    name={ schema?.name }
                    label={ fieldName }
                    required={ true }
                    requiredErrorMessage={
                        t("user:profile.forms.generic.inputs.validations.empty", { fieldName })
                    }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    type="dropdown"
                    value={ normalizeLocaleFormat(
                        profileInfo.get(schema?.name),
                        LocaleJoiningSymbol.HYPHEN,
                        true, supportedI18nLanguages
                    ) }
                    children={ [ {
                        "data-componentid": `${ componentId }-locale-dropdown-empty` as string,
                        key: "empty-locale" as string,
                        text: t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName }) as string,
                        value: "" as string
                    } ].concat(
                        supportedI18nLanguages
                            ? Object.keys(supportedI18nLanguages).map((key: string) => {
                                return {
                                    "data-componentid": `${ componentId }-locale-dropdown-`
                                        +  supportedI18nLanguages[key].code as string,
                                    flag: supportedI18nLanguages[key].flag ?? UserManagementConstants.GLOBE,
                                    key: supportedI18nLanguages[key].code as string,
                                    text: supportedI18nLanguages[key].name === UserManagementConstants.GLOBE
                                        ? supportedI18nLanguages[key].code
                                        : `${supportedI18nLanguages[key].name as string},
                                            ${supportedI18nLanguages[key].code as string}`,
                                    value: supportedI18nLanguages[key].code as string
                                };
                            })
                            : []
                    ) }
                    key={ key }
                    clearable={ false }
                    search
                    selection
                    fluid
                />
            );
        } else if (schema?.name === "dateOfBirth") {
            return (
                <Field
                    data-componentid={ resolvedComponentId }
                    name={ schema.name }
                    label={ fieldName }
                    required={ true }
                    requiredErrorMessage={ fieldName + " is required" }
                    placeholder="YYYY-MM-DD"
                    type="text"
                    value={ profileInfo.get(schema.name) }
                    key={ key }
                    validation={ (value: string, validation: Validation) => {
                        if (!RegExp(schema.regEx).test(value)) {
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.dateFormatError", {
                                    field: fieldName
                                }));
                        }
                    } }
                    maxLength={ schema.maxLength
                        ? schema.maxLength
                        : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                    }
                />
            );
        } else {
            return (
                <Field
                    data-componentid={ resolvedComponentId }
                    name={ schema.name }
                    label={ schema.name === "profileUrl" ? "Profile Image URL" : fieldName }
                    required={ true }
                    requiredErrorMessage={ fieldName + " is required" }
                    placeholder={ "Enter your " + fieldName }
                    type="text"
                    value={ profileInfo.get(schema.name) }
                    key={ key }
                    validation={ (value: string, validation: Validation) => {
                        if (!RegExp(schema.regEx).test(value)) {
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.formatError", {
                                    field: fieldName
                                }));
                        }
                    } }
                    maxLength={
                        fieldName.toLowerCase().includes("uri") || fieldName.toLowerCase().includes("url")
                            ? ProfileConstants.URI_CLAIM_VALUE_MAX_LENGTH
                            : (
                                schema.maxLength
                                    ? schema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            )
                    }
                />
            );
        }
    };

    /**
     * Handle the add multi-valued attribute item.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleAddMultiValuedItem = (schema: ProfileSchemaInterface, attributeValue: string) => {

        if (isEmpty(attributeValue)) return;

        setMultiValuedAttributeValues((prevValues: Record<string, string[]>) => ({
            ...prevValues,
            [schema.name]: [ ...(prevValues[schema.name] || []), attributeValue ]
        }));

        const updatePrimaryValue = (primaryKey: string) => {
            if (isEmpty(primaryValues[primaryKey])) {
                setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
                    ...prevPrimaryValues,
                    [primaryKey]: attributeValue
                }));
            }
        };

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            updatePrimaryValue(EMAIL_ATTRIBUTE);
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            updatePrimaryValue(MOBILE_ATTRIBUTE);
        }
    };

    /**
     * Delete a multi-valued item.
     *
     * @param schema - schema of the attribute
     * @param attributeValue - value of the attribute
     */
    const handleMultiValuedItemDelete = (schema: ProfileSchemaInterface, attributeValue: string) => {

        const filteredValues: string[] =
            multiValuedAttributeValues[schema?.name]?.filter((value: string) => value !== attributeValue) || [];

        setMultiValuedAttributeValues((prevValues: Record<string, string[]>) => ({
            ...prevValues,
            [schema.name]: filteredValues
        }));

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            if (primaryValues[EMAIL_ATTRIBUTE] === attributeValue) {
                setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
                    ...prevPrimaryValues,
                    [EMAIL_ATTRIBUTE]: ""
                }));
            }
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            if (primaryValues[MOBILE_ATTRIBUTE] === attributeValue) {
                setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
                    ...prevPrimaryValues,
                    [MOBILE_ATTRIBUTE]: ""
                }));
            }
        }
    };

    /**
     * Assign primary email address or mobile number the multi-valued attribute.
     *
     * @param schemaName - Name of the primary attribute schema.
     * @param attributeValue - Value of the attribute
     */
    const handleMakePrimary = (schemaName: string, attributeValue: string) => {
        setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
            ...prevPrimaryValues,
            [schemaName]: attributeValue
        }));
    };

    /**
     * The following function maps profile details to the SCIM schemas.
     *
     * @param proSchema - ProfileSchema
     * @param userInfo - BasicProfileInterface
     */
    const mapUserToSchema = (proSchema: ProfileSchemaInterface[], userInfo: ProfileInfoInterface): void => {
        if (!isEmpty(proSchema) && !isEmpty(userInfo)) {
            const tempProfileInfo: Map<string, string> = new Map<string, string>();

            proSchema.forEach((schema: ProfileSchemaInterface) => {
                const schemaNames: string[] = schema.name.split(".");

                if (schemaNames.length === 1) {
                    if (schemaNames[0] === "emails") {
                        const emailSchema: string = schemaNames[0];

                        if(ProfileUtils.isStringArray(userInfo[emailSchema])) {
                            const emails: any[] = userInfo[emailSchema];
                            const primaryEmail: string = emails.find((subAttribute: any) =>
                                typeof subAttribute === "string");

                            // Set the primary email value.
                            tempProfileInfo.set(schema.name, primaryEmail);
                        }
                    } else {
                        const schemaName:string = schemaNames[0];

                        // System Schema
                        if (schema.extended
                            && userInfo[userConfig.userProfileSchema]?.[schemaNames[0]]
                        ) {
                            if (UserManagementConstants.MULTI_VALUED_ATTRIBUTES.includes(schemaNames[0])) {
                                const attributeValue: string | string[] =
                                    userInfo[userConfig.userProfileSchema]?.[schemaNames[0]];
                                const formattedValue: string = Array.isArray(attributeValue)
                                    ? attributeValue.join(",")
                                    : "";

                                tempProfileInfo.set(schema.name, formattedValue);

                                return;
                            }
                            tempProfileInfo.set(
                                schema.name, userInfo[userConfig.userProfileSchema][schemaNames[0]]
                            );

                            return;
                        }

                        // Enterprise Schema
                        if (schema.extended
                            && userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]]
                        ) {
                            if (schema.multiValued) {
                                const attributeValue: string | string[] =
                                    userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]];
                                const formattedValue: string = Array.isArray(attributeValue)
                                    ? attributeValue.join(",")
                                    : "";

                                tempProfileInfo.set(schema.name, formattedValue);

                                return;
                            }
                            tempProfileInfo.set(
                                schema.name, userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]
                            );

                            return;
                        }

                        // Custom Schema
                        if (
                            schema.extended
                            && userInfo?.[userSchemaURI]?.[schemaNames[0]]
                        ) {
                            if (schema.multiValued) {
                                const attributeValue: string | string[] = userInfo[userSchemaURI]?.[schemaNames[0]];
                                const formattedValue: string = Array.isArray(attributeValue)
                                    ? attributeValue.join(",")
                                    : "";

                                tempProfileInfo.set(schema.name, formattedValue);

                                return;
                            }
                            tempProfileInfo.set(
                                schema.name, userInfo[userSchemaURI][schemaNames[0]]
                            );

                            return;
                        }
                        tempProfileInfo.set(schema.name, userInfo[schemaName]);
                    }
                } else {
                    if (schemaNames[0] === "name") {
                        const nameSchema: string = schemaNames[0];
                        const givenNameSchema: string = schemaNames[1];

                        givenNameSchema && userInfo[nameSchema] &&
                            userInfo[nameSchema][givenNameSchema] && (
                            tempProfileInfo.set(schema.name, userInfo[nameSchema][givenNameSchema])
                        );
                    } else {
                        const schemaName: string = schemaNames[0];
                        const schemaSecondaryProperty: string = schemaNames[1];

                        const userProfileSchema: string = userInfo
                            ?.[userConfig.userProfileSchema]?.[schemaName]
                            ?.[schemaSecondaryProperty];

                        const enterpriseSchema: string = userInfo
                            ?.[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaName]
                            ?.[schemaSecondaryProperty];

                        const customSchema: string = userInfo
                            ?.[userSchemaURI]?.[schemaName]
                            ?.[schemaSecondaryProperty];

                        if (schema.extended && (userProfileSchema || enterpriseSchema || customSchema)) {
                            if (userProfileSchema) {
                                tempProfileInfo.set(schema.name, userProfileSchema);
                            } else if (enterpriseSchema && schema.multiValued) {
                                tempProfileInfo.set(schema.name,
                                    Array.isArray(enterpriseSchema) ? enterpriseSchema.join(",") : "");
                            } else if (enterpriseSchema) {
                                tempProfileInfo.set(schema.name, enterpriseSchema);
                            } else if (customSchema && schema.multiValued) {
                                tempProfileInfo.set(schema.name,
                                    Array.isArray(customSchema) ? customSchema.join(",") : "");
                            } else if (customSchema) {
                                tempProfileInfo.set(schema.name, customSchema);
                            }
                        } else {
                            const subValue: SubValueInterface = userInfo[schemaName] &&
                                Array.isArray(userInfo[schemaName]) &&
                                userInfo[schemaName]
                                    .find((subAttribute: MultiValueAttributeInterface) =>
                                        subAttribute.type === schemaSecondaryProperty);

                            if (schemaName.includes("addresses")) {
                                // Ex: addresses#home.streetAddress
                                const addressSubSchema: string = schema?.name?.split(".")[1];
                                const addressSchemaArray: string[] = schemaName?.split("#");

                                if (addressSchemaArray.length > 1) {
                                    // Ex: addresses#home
                                    const addressSchema: string = addressSchemaArray[0];
                                    const addressType: string = addressSchemaArray[1];

                                    const subValue: SubValueInterface = userInfo[addressSchema] &&
                                        Array.isArray(userInfo[addressSchema]) &&
                                        userInfo[addressSchema]
                                            .find((subAttribute: MultiValueAttributeInterface) =>
                                                subAttribute.type === addressType);

                                    tempProfileInfo.set(
                                        schema.name,
                                        (subValue && subValue[addressSubSchema]) ? subValue[addressSubSchema] : ""
                                    );
                                } else {
                                    tempProfileInfo.set(
                                        schema.name,
                                        subValue ? subValue.formatted : ""
                                    );
                                }
                            } else {
                                tempProfileInfo.set(
                                    schema.name,
                                    subValue ? subValue.value : ""
                                );
                            }
                        }
                    }
                }
            });

            setProfileInfo(tempProfileInfo);
        }
    };

    /**
     * The following function map multi-valued attribute values and their primary values from profile data.
     *
     * @param profileData - Profile data.
     */
    const mapMultiValuedAttributeValues = (profileData: Map<string, string>): void => {

        const tempMultiValuedAttributeValues: Record<string, string[]> = {};
        const tempPrimaryValues: Record<string, string> = {};

        simpleMultiValuedExtendedProfileSchema?.forEach((schema: ProfileSchemaInterface) => {
            const attributeValue: string = profileData?.get(schema.name);

            tempMultiValuedAttributeValues[schema.name] = attributeValue ? attributeValue.split(",") : [];
        });

        if (isMultipleEmailAndMobileNumberEnabled) {
            const primaryEmail: string = profileData?.get(EMAIL_ATTRIBUTE);
            const primaryMobile: string = profileData?.get(MOBILE_ATTRIBUTE);

            if (!isEmpty(primaryEmail)) {
                const emailAddresses: string[] = tempMultiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE]
                    ?.filter((value: string) => !isEmpty(value) && value !== primaryEmail) ?? [];

                emailAddresses.unshift(primaryEmail);
                tempMultiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE] = emailAddresses;
            }
            if (!isEmpty(primaryMobile)) {
                const mobileNumbers: string[] = tempMultiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE]
                    ?.filter((value: string) => !isEmpty(value) && value !== primaryMobile) ?? [];

                mobileNumbers.unshift(primaryMobile);
                tempMultiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE] = mobileNumbers;
            }
            tempPrimaryValues[EMAIL_ATTRIBUTE] = primaryEmail;
            tempPrimaryValues[MOBILE_ATTRIBUTE] = primaryMobile;
        }

        setMultiValuedAttributeValues(tempMultiValuedAttributeValues);
        setPrimaryValues(tempPrimaryValues);
    };

    const resolveMultiValuedAttributesFormField = (
        schema: ProfileSchemaInterface,
        fieldName: string,
        key: number,
        customComponentId?: string
    ): ReactElement => {
        let primaryAttributeValue: string = "";
        let primaryAttributeSchema: ProfileSchemaInterface;
        let maxAllowedLimit: number = 0;

        const resolvedComponentId: string =  customComponentId ?? `${ componentId }-${ schema.name }-input`;
        const resolvedLabel: string = schema.name === "profileUrl" ? "Profile Image URL" : fieldName;

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            primaryAttributeValue = primaryValues[EMAIL_ATTRIBUTE];
            primaryAttributeSchema = profileSchema.find((schema: ProfileSchemaInterface) =>
                schema.name === EMAIL_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED;
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            primaryAttributeValue = primaryValues[MOBILE_ATTRIBUTE];
            primaryAttributeSchema = profileSchema.find((schema: ProfileSchemaInterface) =>
                schema.name === MOBILE_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_MOBILE_NUMBERS_ALLOWED;
        } else {
            primaryAttributeSchema = profileSchema.find(
                (schemaAttribute: ProfileSchemaInterface) => schemaAttribute.name === schema.name);
            maxAllowedLimit = ProfileConstants.MAX_MULTI_VALUES_ALLOWED;
        }

        const showMakePrimaryButton = (value: string): boolean => {
            if (isEmpty(primaryAttributeValue)) {
                return false;
            }

            return value !== primaryAttributeValue;
        };

        const showPrimaryPopup = (value: string): boolean => {
            if (isEmpty(primaryAttributeValue)) {
                return false;
            }

            return value === primaryAttributeValue;
        };

        return (
            <div key={ key }>
                <div className="multi-attribute-label required field" >
                    <label>
                        { resolvedLabel }
                    </label>
                </div>
                <Field
                    className="multi-attribute-field"
                    action={ {
                        icon: "plus",
                        onClick: (event: React.MouseEvent) => {
                            event.preventDefault();
                            const value: string = multiValuedInputFieldValue[schema.name];

                            if (isMultiValuedItemInvalid[schema.name] || isEmpty(value)
                                || multiValuedAttributeValues[schema.name]?.includes(value)
                            ) return;
                            handleAddMultiValuedItem(schema, value);
                            setMultiValuedInputFieldValue({
                                ...multiValuedInputFieldValue,
                                [schema.name]: ""
                            });
                        }
                    } }
                    disabled={ multiValuedAttributeValues[schema?.name]?.length >= maxAllowedLimit }
                    data-componentid={ resolvedComponentId }
                    name={ schema.name }
                    placeholder={ "Enter your" + " " + fieldName }
                    type="text"
                    value={ multiValuedInputFieldValue[schema.name] }
                    required={ isEmpty(multiValuedAttributeValues[schema?.name]) }
                    requiredErrorMessage={ t("user:profile.forms.generic.inputs.validations.empty", { fieldName }) }
                    validation={ (value: string, validation: Validation) => {
                        if (isEmpty(value) && isEmpty(multiValuedAttributeValues[schema?.name])) {
                            setIsMultiValuedItemInvalid({
                                ...isMultiValuedItemInvalid,
                                [schema.name]: true
                            });
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("user:profile.forms.generic.inputs.validations.empty", { fieldName }));
                        }

                        if (!RegExp(primaryAttributeSchema?.regEx).test(value)) {
                            setIsMultiValuedItemInvalid({
                                ...isMultiValuedItemInvalid,
                                [schema.name]: true
                            });
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.formatError", {
                                    field: fieldName
                                }));
                        } else {
                            setIsMultiValuedItemInvalid({
                                ...isMultiValuedItemInvalid,
                                [schema.name]: false
                            });
                        }
                    } }
                    displayErrorOn="blur"
                    listen={ (values: ProfileInfoInterface) => {
                        setMultiValuedInputFieldValue({
                            ...multiValuedInputFieldValue,
                            [schema.name]: values.get(schema.name)
                        });
                    } }
                    maxLength={
                        fieldName.toLowerCase().includes("uri") || fieldName.toLowerCase().includes("url")
                            ? ProfileConstants.URI_CLAIM_VALUE_MAX_LENGTH
                            : (
                                schema.maxLength
                                    ? schema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            )
                    }
                    controlled
                />
                <div hidden={ multiValuedAttributeValues[schema?.name]?.length === 0 }>
                    <TableContainer
                        component={ Paper }
                        elevation={ 0 }
                        data-componentid={ `${ componentId }-${ schema.name }-accordion` }
                    >
                        <Table
                            className="multi-value-table"
                            size="small"
                            aria-label="multi-attribute value table"
                        >
                            <TableBody>
                                { multiValuedAttributeValues[schema?.name]?.map(
                                    (value: string, index: number) => (
                                        <TableRow key={ index } className="multi-value-table-data-row">
                                            <TableCell align="left" padding="none">
                                                <OxygenGrid
                                                    container
                                                    flexDirection="row"
                                                    justifyContent="flex-start"
                                                    spacing={ 1 }
                                                >
                                                    <OxygenGrid>
                                                        <label
                                                            data-componentid={
                                                                `${ componentId }-${ schema.name }` +
                                                                        `-value-${index}`
                                                            }
                                                            className="truncate"
                                                        >
                                                            { value }
                                                        </label>
                                                    </OxygenGrid>
                                                    <OxygenGrid>
                                                        {
                                                            showPrimaryPopup(value)
                                                                    && (
                                                                        <div
                                                                            data-componentid={
                                                                                `${ componentId }-${ schema.name }` +
                                                                                `-primary-icon-${ index }`
                                                                            }
                                                                        >
                                                                            <Chip
                                                                                label={ t("common:primary") }
                                                                                size="medium"
                                                                            />
                                                                        </div>
                                                                    )
                                                        }
                                                    </OxygenGrid>
                                                </OxygenGrid>
                                            </TableCell>
                                            <TableCell align="right">
                                                <OxygenGrid
                                                    container
                                                    flexDirection="row"
                                                    justifyContent="flex-end"
                                                    wrap="nowrap"
                                                >
                                                    <OxygenGrid>
                                                        { showMakePrimaryButton(value) && (
                                                            <IconButton
                                                                size="small"
                                                                onClick={ () =>
                                                                    handleMakePrimary(
                                                                        primaryAttributeSchema?.name,
                                                                        value
                                                                    )
                                                                }
                                                                data-componentid={
                                                                    `${ componentId }-${ schema.name }` +
                                                                    `-make-primary-button-${ index }`
                                                                }
                                                            >
                                                                <Popup
                                                                    trigger={ (
                                                                        <Icon name="star" />
                                                                    ) }
                                                                    header={ t("common:makePrimary") }
                                                                    size="tiny"
                                                                    inverted
                                                                />
                                                            </IconButton>
                                                        ) }
                                                    </OxygenGrid>
                                                    <OxygenGrid>
                                                        <IconButton
                                                            size="small"
                                                            onClick={ () => {
                                                                handleMultiValuedItemDelete(schema, value);
                                                            } }
                                                            data-componentid={
                                                                `${ componentId }-${schema.name}-delete-button-${index}`
                                                            }
                                                        >
                                                            <Popup
                                                                trigger={ (
                                                                    <Icon name="trash alternate" />
                                                                ) }
                                                                header={ t("common:delete") }
                                                                size="tiny"
                                                                inverted
                                                            />
                                                        </IconButton>
                                                    </OxygenGrid>
                                                </OxygenGrid>
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    };

    return (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ async (values: Map<string, FormValue>) => {
                if (passwordOption === PasswordOptionTypes.CREATE_PASSWORD) {
                    // Check whether the new password is valid
                    if (await isNewPasswordValid(values.get("newPassword")
                        ? values.get("newPassword").toString()
                        : "")) {
                        onSubmit(getFormValues(values));
                    }
                }
                else {
                    onSubmit(getFormValues(values));
                }
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    !hiddenFields.includes(HiddenFieldNames.USERSTORE) &&
                    (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <div ref={ emailRef }/>
                                <Form.Field required={ isUserstoreRequired }>
                                    <label>
                                        { t("user:forms.addUserForm.inputs."+
                                        "domain.placeholder") }
                                    </label>
                                    <Dropdown
                                        fluid
                                        selection
                                        labeled
                                        options={ readWriteUserStoresList }
                                        data-testid="user-mgt-add-user-form-userstore-dropdown"
                                        name="userstore"
                                        disabled={ false }
                                        value={ userStore }
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>, data: DropdownProps) => {
                                                setUserStore(data.value.toString());
                                                setSelectedUserStore(readWriteUserStoresList?.find(
                                                    (userStore: DropdownItemProps) =>
                                                        userStore.value === data.value)?.text?.toString());
                                            }
                                        }
                                        tabIndex={ 1 }
                                        maxLength={ 60 }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    resolveUsernamePasswordFields()
                }
                {
                    !hiddenFields.includes(HiddenFieldNames.FIRSTNAME) && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-testid="user-mgt-add-user-form-firstName-input"
                                    label={ t(
                                        "user:forms.addUserForm.inputs.firstName.label"
                                    ) }
                                    name="firstName"
                                    placeholder={ t(
                                        "user:forms.addUserForm.inputs." +
                                        "firstName.placeholder"
                                    ) }
                                    required={ isFirstNameRequired }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm." +
                                        "inputs.firstName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.firstName }
                                    tabIndex={ 2 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("First Name cannot contain" +
                                                " the forward slash (/) character.");
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    !hiddenFields.includes(HiddenFieldNames.LASTNAME) && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-testid="user-mgt-add-user-form-lastName-input"
                                    label={ t(
                                        "user:forms.addUserForm.inputs.lastName.label"
                                    ) }
                                    name="lastName"
                                    placeholder={ t(
                                        "user:forms.addUserForm.inputs." +
                                        "lastName.placeholder"
                                    ) }
                                    required={ isLastNameRequired }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm." +
                                        "inputs.lastName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.lastName }
                                    tabIndex={ 3 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("Last Name cannot contain" +
                                                " the forward slash (/) character.");
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    isAttributeProfileForUserCreationEnabled && profileSchema && resolveMobileField()
                }
                {
                    isAttributeProfileForUserCreationEnabled && profileSchema &&
                    profileSchema.map((schema: ProfileSchemaInterface, index: number) =>
                        resolveDynamicForm(schema, index)
                    )
                }
                {
                    !hiddenFields.includes(HiddenFieldNames.PASSWORD)
                        ? (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Form.Field
                                    >
                                        <label className="mb-3">
                                            { t("user:forms.addUserForm" +
                                                ".buttons.radioButton.label") }
                                        </label>
                                        <Radio
                                            label={ askPasswordOptionData.label }
                                            data-testId={ askPasswordOptionData["data-testid"] }
                                            name="handlePasswordGroup"
                                            value={ askPasswordOptionData.value }
                                            checked={ passwordOption === askPasswordOptionData.value }
                                            onChange={
                                                (e: React.ChangeEvent<HTMLInputElement>, item: any) =>
                                                    setPasswordOption(item?.value)
                                            }
                                        />
                                    </Form.Field>
                                    {
                                        passwordOption === askPasswordOptionData.value
                                            ? renderAskPasswordOption()
                                            : null
                                    }
                                    <Form.Field>
                                        <Radio
                                            label={ createPasswordOptionData.label }
                                            data-testId={ createPasswordOptionData["data-testid"] }
                                            name="handlePasswordGroup"
                                            value={ createPasswordOptionData.value }
                                            checked={ passwordOption === createPasswordOptionData.value }
                                            onChange={
                                                (e: React.ChangeEvent<HTMLInputElement>, item: any) =>
                                                    setPasswordOption(item?.value)
                                            }
                                        />
                                    </Form.Field>
                                    {
                                        passwordOption === createPasswordOptionData.value
                                            ? renderCreatePasswordOption()
                                            : null
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        ) : null
                }
            </Grid>
        </Forms>
    );
};
