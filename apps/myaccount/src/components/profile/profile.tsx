/**
 * Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Paper from "@oxygen-ui/react/Paper";
import Select from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";

/**
 * `useRequiredScopes` is not supported for myaccount.
 */
/* eslint-disable no-restricted-imports */
import { getUserNameWithoutDomain, hasRequiredScopes,
    isFeatureEnabled,
    resolveUserDisplayName,
    resolveUserEmails,
    resolveUserstore
} from "@wso2is/core/helpers";
/* eslint-enable */
import {
    PatchOperationRequest,
    ProfileSchemaInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { ProfileUtils, CommonUtils as ReusableCommonUtils } from "@wso2is/core/utils";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    ConfirmationModal,
    EditAvatarModal,
    LinkButton,
    Message,
    Popup,
    PrimaryButton,
    UserAvatar,
    useMediaContext
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, MouseEvent, ReactElement, useCallback, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Container, DropdownItemProps, Form, Grid, Icon, List, Placeholder } from "semantic-ui-react";
import {
    fetchPasswordValidationConfig,
    getPreference,
    getUsernameConfiguration,
    updateProfileImageURL,
    updateProfileInfo
} from "../../api";
import {
    AppConstants,
    CommonConstants,
    LocaleJoiningSymbol,
    ProfileConstants as MyAccountProfileConstants,
    UIConstants
} from "../../constants";
import { commonConfig, profileConfig } from "../../extensions";
import {
    AlertInterface,
    AlertLevels,
    AuthStateInterface, BasicProfileInterface, ConfigReducerStateInterface,
    FeatureConfigInterface,
    PreferenceConnectorResponse,
    PreferenceProperty,
    PreferenceRequest,
    ProfilePatchOperationValue,
    ProfileSchema,
    ValidationFormInterface
} from "../../models";
import { AppState } from "../../store";
import { getProfileInformation, setActiveForm } from "../../store/actions";
import { CommonUtils } from "../../utils";
import { EditSection, SettingsSection } from "../shared";
import { MobileUpdateWizard } from "../shared/mobile-update-wizard";
import "./profile.scss";

const EMAIL_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
const MOBILE_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
const EMAIL_ADDRESSES_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
const MOBILE_NUMBERS_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");
const VERIFIED_MOBILE_NUMBERS_ATTRIBUTE: string =
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS");
const VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE: string =
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES");
const EMAIL_MAX_LENGTH: number = 50;

/**
 * Prop types for the basic details component.
 * Also see {@link Profile.defaultProps}
 */
interface ProfileProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    isNonLocalCredentialUser?: boolean;
}

/**
 * Basic details component.
 *
 * @param props - Props injected to the basic details component.
 * @returns Profile component.
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): ReactElement => {
    const {
        isNonLocalCredentialUser,
        onAlertFired,
        featureConfig,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { isMobileViewport } = useMediaContext();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const isSCIMEnabled: boolean = useSelector((state: AppState) => state.profile.isSCIMEnabled);
    const profileSchemaLoader: boolean = useSelector((state: AppState) => state.loaders.isProfileSchemaLoading);
    const isReadOnlyUser: string = useSelector((state: AppState) =>
        state.authenticationInformation.profileInfo.isReadOnly);
    const hasLocalAccount: boolean = useSelector((state: AppState) => state.authenticationInformation.hasLocalAccount);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);

    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchema[]>();
    const [ isEmailPending, setEmailPending ] = useState<boolean>(false);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ showMobileUpdateWizard, setShowMobileUpdateWizard ] = useState<boolean>(false);
    const [ countryList, setCountryList ] = useState<DropdownItemProps[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ showEmail, setShowEmail ] = useState<boolean>(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isMultipleEmailsAndMobileConfigEnabled: boolean = config?.ui?.isMultipleEmailsAndMobileNumbersEnabled;
    const primaryUserStoreDomainName: string = config?.ui?.primaryUserStoreDomainName;

    const [ isMobileVerificationEnabled, setIsMobileVerificationEnabled ] = useState<boolean>(false);
    const [ isEmailVerificationEnabled, setIsEmailVerificationEnabled ] = useState<boolean>(false);
    const [ isMultipleEmailAndMobileNumberEnabled, setIsMultipleEmailAndMobileNumberEnabled ] =
        useState<boolean>(false);

    // Multi-valued attribute delete confirmation modal related states.
    const [ selectedAttributeInfo, setSelectedAttributeInfo ] =
        useState<{ value: string; schema?: ProfileSchema }>({ value: "" });
    const [ showMultiValuedFieldDeleteConfirmationModal, setShowMultiValuedFieldDeleteConfirmationModal ]
        = useState<boolean>(false);
    const handleMultiValuedFieldDeleteModalClose: () => void = useCallback(() => {
        setShowMultiValuedFieldDeleteConfirmationModal(false);
        setSelectedAttributeInfo({ value: "" });
    }, []);
    const handleMultiValuedFieldDeleteConfirmClick: ()=> void = useCallback(() => {
        handleMultiValuedItemDelete(selectedAttributeInfo.schema, selectedAttributeInfo.value);
        handleMultiValuedFieldDeleteModalClose();
    }, [ selectedAttributeInfo, handleMultiValuedFieldDeleteModalClose ]);

    /**
     * The following method gets the preference for verification on mobile and email update.
     */
    const getPreferences = (): void => {

        const userClaimUpdateConnector: PreferenceRequest[] = [
            {
                "connector-name": ProfileConstants.USER_CLAIM_UPDATE_CONNECTOR,
                properties: [
                    ProfileConstants.ENABLE_EMAIL_VERIFICATION,
                    ProfileConstants.ENABLE_MOBILE_VERIFICATION
                ]
            }
        ];

        getPreference(userClaimUpdateConnector)
            .then((response: PreferenceConnectorResponse[]) => {
                if (response) {
                    const userClaimUpdateOptions: PreferenceConnectorResponse[] = response;
                    const responseProperties: PreferenceProperty[] = userClaimUpdateOptions[0].properties;

                    responseProperties.forEach((prop: PreferenceProperty) => {
                        if (prop.name === ProfileConstants.ENABLE_EMAIL_VERIFICATION) {
                            setIsEmailVerificationEnabled(prop.value.toLowerCase() == "true");
                        }
                        if (prop.name === ProfileConstants.ENABLE_MOBILE_VERIFICATION) {
                            setIsMobileVerificationEnabled(prop.value.toLowerCase() == "true");
                        }
                    });
                } else {
                    onAlertFired({
                        description: t(
                            "myAccount:sections.verificationOnUpdate.preference.notifications.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:sections.verificationOnUpdate.preference.notifications.genericError.message"
                        )
                    });
                }
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:sections.verificationOnUpdate.preference.notifications.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:sections.verificationOnUpdate.preference.notifications..error.message")
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:sections.verificationOnUpdate.preference.notifications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:sections.verificationOnUpdate.preference.notifications.genericError.message")
                });
            });
    };

    /**
     * Load verification on update preferences.
     */
    useEffect(() => {
        getPreferences();
    }, []);

    /**
     * Interface for the canonical attributes.
     */
    interface CanonicalAttribute {
        [key: string]: string;
    }

    /**
     * Set the if the email verification is pending.
     */
    useEffect(() => {
        if (
            isEmailVerificationEnabled
            && profileDetails?.profileInfo?.pendingEmails
            && !isEmpty(profileDetails?.profileInfo?.pendingEmails)
        ) {
            setEmailPending(true);
        }
    }, [ profileDetails?.profileInfo?.pendingEmails ]);

    /**
     * dispatch getProfileInformation action if the profileDetails object is empty
     */
    useEffect(() => {
        if (isEmpty(profileDetails.profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    /**
     * Check if email address is displayed as a separated attribute.
     */
    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            if ((commonConfig.userProfilePage.showEmail && usernameConfig?.enableValidator === "true")
                    || getUserNameWithoutDomain(profileInfo.get("userName")) !== profileInfo.get("emails")) {
                setShowEmail(true);
            } else {
                setShowEmail(false);
            }
        }
    }, [ profileInfo, usernameConfig ]);

    /**
     * Check if multiple emails and mobile numbers feature is enabled.
     */
    const isMultipleEmailsAndMobileNumbersEnabled = (): void => {

        if (isEmpty(profileDetails) || isEmpty(profileSchema)) return;
        if (!isMultipleEmailsAndMobileConfigEnabled) {
            setIsMultipleEmailAndMobileNumberEnabled(false);

            return;
        }

        const multipleEmailsAndMobileFeatureRelatedAttributes: string[] = [
            MOBILE_ATTRIBUTE,
            EMAIL_ATTRIBUTE,
            EMAIL_ADDRESSES_ATTRIBUTE,
            MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
            VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
        ];

        const username: string = profileDetails?.profileInfo["userName"];

        if (!username) return;
        const userStoreDomain: string = resolveUserstore(username, primaryUserStoreDomainName)?.toUpperCase();
        // Check each required attribute exists and domain is not excluded in the excluded user store list.
        const attributeCheck: boolean = multipleEmailsAndMobileFeatureRelatedAttributes.every(
            (attribute: string) => {
                const schema: ProfileSchema = profileSchema?.find(
                    (schema: ProfileSchema) => schema?.name === attribute);

                if (!schema) {
                    return false;
                }

                const excludedUserStores: string[] =
                    schema?.excludedUserStores?.split(",")?.map((store: string) => store?.trim().toUpperCase()) || [];

                return !excludedUserStores.includes(userStoreDomain);
            });

        setIsMultipleEmailAndMobileNumberEnabled(attributeCheck);
    };

    useEffect(() => {
        isMultipleEmailsAndMobileNumbersEnabled();
    }, [ profileSchema, profileDetails ]);

    /**
     * Get the configurations.
     */
    useEffect(() => {
        getConfigurations();
    }, [ profileSchema ]);

    /**
     * Sort the elements of the profileSchema state according to the displayOrder attribute in the ascending order.
     */
    useEffect(() => {

        const getDisplayOrder = (schema: ProfileSchema): number => {
            if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE && !schema.displayOrder) return 6;
            if (schema.name === MOBILE_NUMBERS_ATTRIBUTE && !schema.displayOrder) return 7;

            return schema.displayOrder ? parseInt(schema.displayOrder, 10) : -1;
        };

        const sortedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas(
            [ ...profileDetails.profileSchemas ]
        ).filter((item: ProfileSchemaInterface) =>
            item.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION")
        ).sort((a: ProfileSchema, b: ProfileSchema) => {
            const orderA: number = getDisplayOrder(a);
            const orderB: number = getDisplayOrder(b);

            if (orderA === -1) {
                return -1;
            } else if (orderB === -1) {
                return 1;
            } else {
                return orderA - orderB;
            }
        });

        setProfileSchema(sortedSchemas);

    }, [ profileDetails.profileSchemas ]);

    /**
     * This also maps profile info to the schema.
     */
    useEffect(() => {
        if (!isEmpty(profileSchema) && !isEmpty(profileDetails) && !isEmpty(profileDetails.profileInfo)) {
            const tempProfileInfo: Map<string, string> = new Map<string, string>();

            profileSchema.forEach((schema: ProfileSchema) => {

                // this splits for the sub-attributes
                const schemaNames: string[] = schema.name.split(".");

                let isCanonical: boolean = false;

                // this splits for the canonical types
                const schemaNamesCanonicalType: string[] = schemaNames[0].split("#");

                if(schemaNamesCanonicalType.length !== 1){
                    isCanonical = true;
                }

                if (schemaNames.length === 1) {
                    if (schemaNames[0] === "emails") {
                        if (isEmailVerificationEnabled &&
                            profileDetails?.profileInfo?.pendingEmails?.length > 0) {
                            tempProfileInfo.set(schema.name,
                                profileDetails.profileInfo.pendingEmails[0].value as string);
                        } else {
                            const primaryEmail: string = profileDetails.profileInfo[schemaNames[0]] &&
                                profileDetails.profileInfo[schemaNames[0]]
                                    .find((subAttribute: string) => typeof subAttribute === "string");

                            // Set the primary email value.
                            tempProfileInfo.set(schema.name, primaryEmail);
                        }
                    } else {
                        if (schema.extended
                            && profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                            && profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]) {
                            tempProfileInfo.set(
                                schema.name,
                                profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                                    ? profileDetails?.profileInfo[
                                        ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]
                                    ]
                                    : ""
                            );

                            return;
                        }

                        if (schema.extended
                            && profileDetails?.profileInfo[userSchemaURI]
                            && profileDetails?.profileInfo[userSchemaURI][schemaNames[0]]) {

                            const multiValuedAttributes: string[] = [
                                EMAIL_ADDRESSES_ATTRIBUTE,
                                MOBILE_NUMBERS_ATTRIBUTE,
                                VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
                                VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
                            ];

                            if (multiValuedAttributes.includes(schemaNames[0])) {

                                const attributeValue: string | string[] =
                                    profileDetails?.profileInfo[userSchemaURI]?.[schemaNames[0]];

                                const formattedValue: string = Array.isArray(attributeValue)
                                    ? attributeValue.join(",")
                                    : "";

                                tempProfileInfo.set(schema.name, formattedValue);

                                return;
                            }
                            tempProfileInfo.set(
                                schema.name,
                                profileDetails?.profileInfo[userSchemaURI]
                                    ? profileDetails?.profileInfo[userSchemaURI][schemaNames[0]]
                                    : ""
                            );

                            return;
                        }

                        tempProfileInfo.set(schema.name, profileDetails.profileInfo[schemaNames[0]]);
                    }
                } else {
                    if (schemaNames[0] === "name") {
                        tempProfileInfo.set(schema.name, profileDetails.profileInfo[schemaNames[0]][schemaNames[1]]);

                    } else if (isCanonical) {
                        let indexOfType: number = -1;

                        profileDetails?.profileInfo[
                            schemaNamesCanonicalType[0]
                        ]?.forEach((canonical: CanonicalAttribute) => {
                            if(schemaNamesCanonicalType[1] === canonical?.type) {
                                indexOfType = profileDetails?.profileInfo[
                                    schemaNamesCanonicalType[0]
                                ].indexOf(canonical);
                            }
                        });

                        if (indexOfType > -1) {
                            const subValue: string = profileDetails?.profileInfo[
                                schemaNamesCanonicalType[0]
                            ][indexOfType][schemaNames[1]];

                            if(schemaNamesCanonicalType [0] === "addresses") {
                                tempProfileInfo.set(schema.name, subValue);
                            }
                        }
                    } else {
                        if (schema.extended) {
                            tempProfileInfo.set(schema.name,
                                profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]]
                                    ? profileDetails
                                        ?.profileInfo[
                                            ProfileConstants.SCIM2_ENT_USER_SCHEMA
                                        ][schemaNames[0]][schemaNames[1]]
                                    : "");
                        } else {
                            const subValue: BasicProfileInterface = profileDetails.profileInfo[schemaNames[0]]
                                && profileDetails.profileInfo[schemaNames[0]].find(
                                    (subAttribute: BasicProfileInterface) => subAttribute.type === schemaNames[1]
                                );

                            if (schemaNames[0] === "addresses") {
                                tempProfileInfo.set(
                                    schema.name,
                                    subValue ? subValue.formatted : ""
                                );
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
    }, [ profileSchema, profileDetails.profileInfo ]);

    /**
     * This will load the countries to the dropdown.
     */
    useEffect(() => {
        setCountryList(ReusableCommonUtils.getCountryList());
    }, []);

    /**
     * API call to get validation configurations.
     */
    const getConfigurations = (): void => {

        fetchPasswordValidationConfig()
            .then((response: ValidationFormInterface[]) => {
                setUsernameConfig(getUsernameConfiguration(response));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.detail) {
                    onAlertFired({
                        description:
                            t("myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "validationConfig.error.description",
                            { description: error?.response?.data?.detail }),
                        level: AlertLevels.ERROR,
                        message:
                            t("myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "validationConfig.error.message")
                    });

                    return;
                }

                onAlertFired({
                    description:
                        t("myAccount:components.changePassword.forms.passwordResetForm.validations." +
                        "validationConfig.genericError.description"),
                    level: AlertLevels.ERROR,
                    message:
                        t("myAccount:components.changePassword.forms.passwordResetForm.validations." +
                        "validationConfig.genericError.message")
                });
            });
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values - Form values.
     * @param formName - Name of the form.
     * @param isExtended - Is the form extended.
     * @param schema - Profile schemas.
     */
    const handleSubmit = (
        values: Map<string, string | string[]>,
        formName: string,
        isExtended: boolean,
        schema: ProfileSchema
    ): void => {
        setIsSubmitting(true);
        const data: { Operations: Array<{ op: string, value: Record<string, string> }>, schemas: Array<string> } = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        let value: any = {};

        // this splits for the sub-attributes
        const schemaNames: string[] = formName.split(".");

        let isCanonical: boolean = false;

        // this splits for the canonical types
        const schemaNamesCanonicalType: string[] = schemaNames[0].split("#");

        if(schemaNamesCanonicalType.length !== 1){
            isCanonical = true;
        }

        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0])
            || schemaNames[0] === "phoneNumbers") {
            const attributeValues: string[] = [];

            if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                if (isEmpty(values.get(formName))) {
                    setIsSubmitting(false);

                    return;
                }

                const currentValues: string[] = resolveProfileInfoSchemaValue(schema)?.split(",") || [];
                let primaryValue: string | null;

                if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
                    primaryValue = profileDetails?.profileInfo?.emails?.length > 0
                        ? profileDetails?.profileInfo?.emails[0]
                        : null;
                } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                    primaryValue = profileInfo.get(MOBILE_ATTRIBUTE);
                }
                if (primaryValue && !currentValues.includes(primaryValue)) {
                    currentValues.push(primaryValue);
                }

                currentValues.push(values.get(formName) as string);
                values.set(formName, currentValues);

                value = {
                    [schema.schemaId]: {
                        [schemaNames[0]]: currentValues
                    }
                };
                // If no primary value is set, set the first value as the primary value.
                if (isEmpty(primaryValue) && !isEmpty(currentValues)) {
                    if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
                        value = {
                            ...value,
                            [EMAIL_ATTRIBUTE]: [ currentValues[0] ]
                        };
                    } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                        value = {
                            ...value,
                            [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [
                                {
                                    type: "mobile",
                                    value: currentValues[0]
                                }
                            ]
                        };
                    }
                }
            } else if (schemaNames.length === 1) {
                // List of sub attributes.
                const subValue: string[] = profileDetails.profileInfo[schemaNames[0]]
                    && profileDetails.profileInfo[schemaNames[0]]
                        .filter((subAttribute: string) => typeof subAttribute === "object");

                if (subValue && subValue.length > 0) {
                    subValue.map((value: string) => {
                        attributeValues.push(value);
                    });
                }

                // This is required as the api doesn't support
                // patching the attribute at the sub attribute level.
                value = {
                    [schemaNames[0]]: [
                        ...attributeValues,
                        values?.get(formName)
                    ]
                };

                if (values.get(formName)) {
                    value = {
                        ...value,
                        [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]: {
                            "verifyEmail": true
                        }
                    };
                }
            } else {
                let primaryValue: string = "";

                // The primary value of the email attribute.
                if (schemaNames[0] === "emails" && profileDetails?.profileInfo[schemaNames[0]]) {
                    primaryValue = profileDetails.profileInfo[schemaNames[0]]
                        && profileDetails.profileInfo[schemaNames[0]]
                            .find((subAttribute: string) => typeof subAttribute === "string");
                }

                // List of sub attributes.
                const subValues: BasicProfileInterface = profileDetails.profileInfo[schemaNames[0]]
                    && profileDetails.profileInfo[schemaNames[0]]
                        .filter((subAttribute: string) => typeof subAttribute ===  "object");

                if (subValues && subValues.length > 0) {
                    subValues.map((value: string) => {
                        attributeValues.push(value);
                    });
                }

                // This is required as the api doesn't support
                // patching the attribute at the sub attribute level.
                value = {
                    [schemaNames[0]]: [
                        ...attributeValues,
                        primaryValue,
                        {
                            type: schemaNames[1],
                            value: values.get(formName)
                        }
                    ]
                };

                if (primaryValue) {
                    value = {
                        ...value,
                        [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]: {
                            "verifyEmail": true
                        }
                    };
                }
            }
        } else {
            if (schemaNames.length === 1) {
                if (isExtended) {
                    value = {
                        [schema.schemaId]: {
                            [schemaNames[0]]: values.get(formName)
                        }
                    };
                } else {
                    value = { [schemaNames[0]]: values.get(formName) };
                }
            } else {
                if (isExtended) {
                    value = {
                        [schema.schemaId]: {
                            [schemaNames[0]]: {
                                [schemaNames[1]]: values.get(formName)
                            }
                        }
                    };
                } else if (schemaNames[0] === "name") {
                    value = {
                        name: { [schemaNames[1]]: values.get(formName) }
                    };

                } else if (isCanonical && schemaNamesCanonicalType[0] === "addresses") {
                    value = {
                        [schemaNamesCanonicalType[0]]: [
                            {
                                [schemaNames[1]]: values.get(schema.name),
                                type: schemaNamesCanonicalType[1]
                            }
                        ]
                    };
                    data.Operations[0].op = "add";

                } else if (schemaNames[0] === "addresses") {
                    value = {
                        [schemaNames[0]]: [
                            {
                                formatted: values.get(formName),
                                type: schemaNames[1]
                            }
                        ]
                    };
                    // This is required as the api doesn't support patching the address attributes at the
                    // sub attribute level using 'replace' operation.
                    data.Operations[0].op = "add";
                } else {
                    value = {
                        [schemaNames[0]]: [
                            {
                                type: schemaNames[1],
                                value: values.get(formName)
                            }
                        ]
                    };
                }
            }
        }

        /**
         * If the user belongs to a user-store other than the
         * primary user-store, the value must be in format i.e.,
         * `USER-STORE/username`. Since we bind only the username
         * to the form field value, user does not see the -
         * `USER-STORE/` segment. This block will re append the
         * value to the expected format.
         */
        const attrKey: string = "userName";

        if (attrKey in value) {
            const oldValue: string = profileInfo?.get(schema?.name);

            if (oldValue?.indexOf("/") > -1) {
                const fragments: string[] = oldValue.split("/");

                if (fragments?.length > 1) {
                    value[attrKey] = `${ fragments[0] }/${ value[attrKey] }`;
                }
            }
        }

        data.Operations[0].value = value;
        updateProfileInfo(data).then((response: AxiosResponse) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.message"
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            }
        }).catch((error: any) => {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        }).finally(() => {
            setIsSubmitting(false);
        });

        // Hide corresponding edit view
        dispatch(setActiveForm(null));
    };

    /**
     * Verify an email address or mobile number.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleVerify = (schema: ProfileSchema, attributeValue: string) => {
        setIsSubmitting(true);
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        let translationKey: string = "";

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            translationKey = "myAccount:components.profile.notifications.verifyEmail.";
            const verifiedEmailList: string[] = profileInfo?.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") || [];

            verifiedEmailList.push(attributeValue);
            data.Operations[0].value = {
                [schema.schemaId]: {
                    [VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE]: verifiedEmailList
                }
            };
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            translationKey = "myAccount:components.profile.notifications.verifyMobile.";
            setSelectedAttributeInfo({ schema, value: attributeValue });
            const verifiedMobileList: string[] = profileInfo?.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") || [];

            verifiedMobileList.push(attributeValue);
            data.Operations[0].value = {
                [schema.schemaId]: {
                    [VERIFIED_MOBILE_NUMBERS_ATTRIBUTE]: verifiedMobileList
                }
            };
        }

        updateProfileInfo(data as unknown as Record<string, unknown>).then((response: AxiosResponse) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        `${ translationKey }success.description`
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        `${ translationKey }success.message`
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
                schema.name === MOBILE_NUMBERS_ATTRIBUTE && setShowMobileUpdateWizard(true);
            }
        }).catch((error: any) => {
            onAlertFired({
                description: error?.detail ?? t(
                    `${ translationKey }genericError.description`
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    `${ translationKey }genericError.message`
                )
            });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    /**
     * Assign primary email address or mobile number the multi-valued attribute.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleMakePrimary = (schema: ProfileSchema, attributeValue: string) => {

        setIsSubmitting(true);
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {

            data.Operations[0].value = {
                [EMAIL_ATTRIBUTE]: [ attributeValue ]
            };

            const existingPrimaryEmail: string = profileDetails?.profileInfo?.emails?.length > 0
                ? profileDetails?.profileInfo?.emails[0]
                : null;
            const existingEmailList: string[] = profileInfo?.get(EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") || [];

            if (existingPrimaryEmail && !existingEmailList.includes(existingPrimaryEmail)) {
                existingEmailList.push(existingPrimaryEmail);
                data.Operations.push({
                    op: "replace",
                    value: {
                        [schema.schemaId] : {
                            [EMAIL_ADDRESSES_ATTRIBUTE]: existingEmailList
                        }
                    }
                });
            }
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {

            data.Operations[0].value = {
                [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [
                    {
                        type: "mobile",
                        value: attributeValue
                    }
                ]
            };

            const existingPrimaryMobile: string = profileInfo.get(MOBILE_ATTRIBUTE);
            const existingMobileList: string[] = profileInfo?.get(MOBILE_NUMBERS_ATTRIBUTE)?.split(",") || [];

            if (existingPrimaryMobile && !existingMobileList.includes(existingPrimaryMobile)) {
                existingMobileList.push(existingPrimaryMobile);
                data.Operations.push({
                    op: "replace",
                    value: {
                        [schema.schemaId] : {
                            [MOBILE_NUMBERS_ATTRIBUTE]: existingMobileList
                        }
                    }
                });
            }
        }
        updateProfileInfo(data as unknown as Record<string, unknown>).then((response: AxiosResponse) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.message"
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            }
        }).catch((error: any) => {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    /**
     * Delete a multi-valued attribute value.
     *
     * @param schema - schema of the attribute
     * @param attributeValue - value of the attribute
     */
    const handleMultiValuedItemDelete = (schema: ProfileSchema, attributeValue: string) => {

        setIsSubmitting(true);
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            const emailList: string[] = profileInfo?.get(EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") || [];
            const updatedEmailList: string[] = emailList.filter((email: string) => email !== attributeValue);
            const primaryEmail: string = profileDetails?.profileInfo?.emails?.length > 0
                ? profileDetails?.profileInfo?.emails[0]
                : null;

            data.Operations[0].value = {
                [schema.schemaId] : {
                    [EMAIL_ADDRESSES_ATTRIBUTE]: updatedEmailList
                }
            };

            if (attributeValue === primaryEmail) {
                data.Operations.push({
                    op: "replace",
                    value: {
                        [EMAIL_ATTRIBUTE]: []
                    }
                });
            }
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            const mobileList: string[] = profileInfo?.get(MOBILE_NUMBERS_ATTRIBUTE)?.split(",") || [];
            const updatedMobileList: string[] = mobileList.filter((mobile: string) => mobile !== attributeValue);
            const primaryMobile: string = profileInfo.get(MOBILE_ATTRIBUTE);

            if (attributeValue === primaryMobile) {
                data.Operations.push({
                    op: "replace",
                    value: {
                        [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [ {
                            type: "mobile",
                            value: ""
                        } ]
                    }
                });
            }

            data.Operations[0].value = {
                [schema.schemaId]: {
                    [MOBILE_NUMBERS_ATTRIBUTE]: updatedMobileList
                }
            };
        }
        updateProfileInfo(data as unknown as Record<string, unknown>).then((response: AxiosResponse) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.message"
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            }
        }).catch((error: any) => {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    /**
     * This takes the schema name and a type and sees if the schema is of the specified type
     * @param schema - The schema name eg: 'emails.workEmail'
     * @param type - The type to check for eg: 'emails'
     *
     * @returns True/False
     */
    const checkSchemaType = (schema: string, type: string): boolean => {
        return schema.split(".").filter((name: string) => {
            return name === type;
        }).length > 0;
    };

    /**
     * Resolves the current schema value to the form value.
     * @returns schema form value
     */
    const resolveProfileInfoSchemaValue = (schema: ProfileSchema): string => {

        let schemaFormValue: string = profileInfo.get(schema.name);

        /**
         * Remove the user-store-name prefix from the userName
         * Match case applies only for secondary user-store.
         *
         * Transforms the value: -
         * USER-STORE/userNameString to userNameString
         */
        if (schema.name === "userName") {
            schemaFormValue = getUserNameWithoutDomain(schemaFormValue);
        }

        return schemaFormValue;

    };

    /**
     * The function returns the normalized format of locale.
     * Refer https://github.com/wso2/identity-apps/pull/5980 for more details.
     *
     * @param locale - locale value.
     * @param localeJoiningSymbol - symbol used to join language and region parts of locale.
     * @param updateSupportedLanguage - If supported languages needs to be updated with the given localString or not.
     */
    const normalizeLocaleFormat = (
        locale: string,
        localeJoiningSymbol: LocaleJoiningSymbol,
        updateSupportedLanguage: boolean
    ): string => {
        if (!locale) {
            return locale;
        }

        const separatorIndex: number = locale.search(/[-_]/);

        let normalizedLocale: string = locale;

        if (separatorIndex !== -1) {
            const language: string = locale.substring(0, separatorIndex).toLowerCase();
            const region: string = locale.substring(separatorIndex + 1).toUpperCase();

            normalizedLocale = `${language}${localeJoiningSymbol}${region}`;
        }

        if (updateSupportedLanguage && !supportedI18nLanguages[normalizedLocale]) {
            supportedI18nLanguages[normalizedLocale] = {
                code: normalizedLocale,
                name: MyAccountProfileConstants.GLOBE,
                namespaces: []
            };
        }

        return normalizedLocale;
    };

    /**
     * This function generates the Edit Section based on the input Profile Schema.
     *
     * @param schema - Profile schemas.
     * @returns Schema form.
     */
    const generateSchemaForm = (schema: ProfileSchema, index: number): JSX.Element => {

        // Define schemas to hide.
        const attributesToHide: string[] = isMultipleEmailAndMobileNumberEnabled === true
            ? [ EMAIL_ATTRIBUTE, MOBILE_ATTRIBUTE, VERIFIED_MOBILE_NUMBERS_ATTRIBUTE,
                VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE ]
            : [ EMAIL_ADDRESSES_ATTRIBUTE, MOBILE_NUMBERS_ATTRIBUTE,
                VERIFIED_MOBILE_NUMBERS_ATTRIBUTE, VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE ];

        // Hide the field if any of the relevant attributes match the schema name.
        if (attributesToHide.some((name: string) => schema.name === name)) {
            return;
        }

        if (!showEmail && schema?.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            return;
        }

        /*
         * Makes the "Username" field a READ_ONLY field. By default the
         * server SCIM2 endpoint sends it as a "READ_WRITE" property.
         * We are able to enable/disable read-only mode for specific
         * claim dialects in user-store(s). However, it does not apply to
         * all the tenants.
         *
         * Since we only interested in checking `username` we check the
         * `isProfileUsernameReadonly` condition at top level. So,
         * if it is `false` by default then we won't check the `name`
         * unnecessarily.
         *
         * Match case explanation:-
         * Ideally it should be the exact attribute name @see {@link http://wso2.org/claims/username}
         * `username`. But we will transform the `schema.name`.
         * and `schema.displayName` to a lowercase string and then check
         * the value matches.
         */
        const isProfileUsernameReadonly: boolean = config?.ui?.isProfileUsernameReadonly;
        const { displayName, name } = schema;

        if (isProfileUsernameReadonly) {
            const usernameClaim: string = "username";

            if (name?.toLowerCase() === usernameClaim || displayName?.toLowerCase() === usernameClaim) {
                schema.mutability = ProfileConstants.READONLY_SCHEMA;
            }
        }

        // Makes the email field read-only for users without local credentials
        if (isNonLocalCredentialUser) {
            if (name?.toLowerCase() === EMAIL_ATTRIBUTE) {
                schema.mutability = ProfileConstants.READONLY_SCHEMA;
            }
        }

        const fieldName: string = getFieldName(schema);

        if (activeForm === CommonConstants.PERSONAL_INFO + schema.name) {
            return (
                <List.Item
                    key={ index }
                    className="inner-list-item"
                    data-testid={ `${testId}-schema-list-item` }>
                    { generateSingleMobileVerificationSection(schema, fieldName)
                        || generateEditableForm(schema, fieldName) }
                </List.Item>
            );
        } else {
            return (
                <List.Item
                    key={ index }
                    className="inner-list-item"
                    data-testid={ `${testId}-schema-list-item` }>
                    { generateReadOnlyForm(schema, fieldName) }
                </List.Item>
            );
        }
    };

    /**
     * This function generates mobile verification section for mobile schema.
     *
     * @param schema - The schema to generate the form for.
     * @param fieldName - The field name to get the placeholder text for.
     * @returns Mobile verification section.
     */
    const generateSingleMobileVerificationSection = (schema: ProfileSchema, fieldName: string) => {

        if (!isFeatureEnabled(
            featureConfig?.personalInfo,
            AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_MOBILE_VERIFICATION")
        ) || schema.name !== MOBILE_ATTRIBUTE || !isMobileVerificationEnabled) {
            return null;
        }

        return (
            <EditSection data-testid={ `${testId}-schema-mobile-editing-section` }>
                <p>{ t("myAccount:components.profile.messages.mobileVerification.content") }</p>
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                            <List.Content>{ fieldName }</List.Content>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <List.Content>
                                <List.Description className="with-max-length">
                                    { isProfileInfoLoading || profileSchemaLoader
                                        ? <Placeholder><Placeholder.Line /></Placeholder>
                                        : profileInfo.get(schema.name)
                                        || (
                                            <a
                                                className="placeholder-text"
                                                tabIndex={ 0 }
                                                onClick={ () => {
                                                    setShowMobileUpdateWizard(true);
                                                } }
                                                onKeyPress={ (
                                                    { key }: React.KeyboardEvent<HTMLAnchorElement>
                                                ) =>
                                                {
                                                    if (key === "Enter") {
                                                        setShowMobileUpdateWizard(true);
                                                    }
                                                }
                                                }
                                                data-testid={
                                                    `${testId}-schema-mobile-editing-section-${
                                                        schema.name.replace(".", "-")
                                                    }-placeholder`
                                                }
                                            >
                                                { t("myAccount:components.profile.forms.generic." +
                                                                    "inputs.placeholder", {
                                                    fieldName: fieldName.toLowerCase() })
                                                }
                                            </a>
                                        )

                                    }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                            <PrimaryButton floated="left" onClick={ () => setShowMobileUpdateWizard(true) }>
                                { t("common:update").toString() }
                            </PrimaryButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                            <LinkButton floated="left" onClick={ () => dispatch(setActiveForm(null)) }>
                                { t("common:cancel").toString() }
                            </LinkButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    };

    /**
     * This function generates the editable form for the schema.
     *
     * @param schema - The schema to generate the form for.
     * @returns The editable form.
     */
    const generateEditableForm = (schema: ProfileSchema, fieldName: string): JSX.Element => {

        return (
            <EditSection data-testid={ `${testId}-schema-editing-section` }>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 4 }>{ fieldName }</Grid.Column>
                        <Grid.Column width={ 12 }>
                            <Forms
                                onSubmit={ (values: Map<string, FormValue>) =>
                                    handleSubmit(values, schema.name, schema.extended, schema) }>
                                { generateFormFields(schema, fieldName) }
                            </Forms>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    };

    /**
     * This function generates the read-only form for the schema.
     *
     * @param schema - The schema to generate the form for.
     * @returns The read-only form.
     */
    const generateReadOnlyForm = (schema: ProfileSchema, fieldName: string): JSX.Element => {

        return (
            <Grid padded={ true }>
                <Grid.Row columns={ 3 }>
                    <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                        <List.Content className="vertical-align-center">{
                            !showEmail && fieldName.toLowerCase() === "username"
                                ? fieldName + " (Email)"
                                : fieldName }
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <List.Content>
                            <List.Description className="with-max-length">
                                { generateReadOnlyFieldContent(schema, fieldName) }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column
                        mobile={ 2 }
                        tablet={ 2 }
                        computer={ 2 }
                        className={ `${!isMobileViewport ? "last-column" : ""}` }
                    >
                        <List.Content floated="right" className="vertical-align-center">
                            { generateEditIcon(schema) }
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    /**
     * This function generates the form fields for the schema.
     *
     * @param schema - The schema to generate the form fields for.
     * @param fieldName - The field name to generate the form fields for.
     * @returns The form fields.
     */
    const generateFormFields = (schema: ProfileSchema, fieldName: string): JSX.Element => {

        if (checkSchemaType(schema.name, "country")) {
            return generateCountryDropdown(schema, fieldName);
        } else if (checkSchemaType(schema.name, "locale")) {
            return generateEditableLocaleField(schema, fieldName);
        } else if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE
            || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            return generateMultiValuedField(schema, fieldName);
        } else {
            return generateTextField(schema, fieldName);
        }
    };

    const generateMultiValuedField = (schema: ProfileSchema, fieldName: string): JSX.Element => {

        let primaryAttributeSchema: ProfileSchema;
        let attributeValueList: string[] = [];
        let verifiedAttributeValueList: string[] = [];
        let primaryAttributeValue: string = "";
        let verificationEnabled: boolean = false;
        let pendingEmailAddress: string = "";
        let maxAllowedLimit: number = 0;

        const resolvedRequiredValue: boolean = schema?.profiles?.endUser?.required ?? schema.required;

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            attributeValueList = profileInfo?.get(EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            verifiedAttributeValueList = profileInfo?.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            pendingEmailAddress = profileDetails?.profileInfo?.pendingEmails?.length > 0
                ? profileDetails?.profileInfo?.pendingEmails[0]?.value
                : null;
            primaryAttributeValue = profileDetails?.profileInfo?.emails?.length > 0
                ? profileDetails?.profileInfo?.emails[0]
                : null;
            primaryAttributeValue = profileDetails?.profileInfo?.emails[0];
            verificationEnabled = isEmailVerificationEnabled;
            primaryAttributeSchema = getSchemaFromName(EMAIL_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED;

        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            attributeValueList = profileInfo?.get(MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            verifiedAttributeValueList = profileInfo?.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = profileInfo?.get(ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE"));
            verificationEnabled = isMobileVerificationEnabled;
            primaryAttributeSchema = getSchemaFromName(MOBILE_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_MOBILE_NUMBERS_ALLOWED;
        }

        // Move the primary attribute value to the top of the list.
        if (!isEmpty(primaryAttributeValue)) {
            attributeValueList = attributeValueList.filter((value: string) =>
                !isEmpty(value)
                && value !== primaryAttributeValue);
            attributeValueList.unshift(primaryAttributeValue);
        }
        const showAccordion: boolean = attributeValueList.length >= 1;

        const showPendingEmailPopup = (value: string): boolean => {
            return verificationEnabled
                && schema.name === EMAIL_ADDRESSES_ATTRIBUTE
                && pendingEmailAddress
                && value === pendingEmailAddress;
        };

        const showVerifiedPopup = (value: string): boolean => {
            return verificationEnabled &&
                (verifiedAttributeValueList.includes(value) || value === primaryAttributeValue);
        };

        const showPrimaryChip = (value: string): boolean => {
            return value === primaryAttributeValue;
        };

        const showMakePrimaryButton = (value: string): boolean => {
            if (verificationEnabled) {
                return verifiedAttributeValueList.includes(value) && value !== primaryAttributeValue;
            } else {
                return value !== primaryAttributeValue;
            }
        };

        const showVerifyButton = (value: string): boolean =>
            verificationEnabled && !verifiedAttributeValueList.includes(value) && value !== primaryAttributeValue;

        const showDeleteButton = (value: string): boolean => {
            return !(primaryAttributeSchema?.required && value === primaryAttributeValue);
        };

        return (
            <>
                <Field
                    action={ { icon: "plus", type: "submit" } }
                    disabled={ isSubmitting || attributeValueList?.length >= maxAllowedLimit }
                    className="multi-input-box"
                    autoFocus={ true }
                    label=""
                    name={ schema.name }
                    placeholder={ getPlaceholderText(schema, fieldName) }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={
                        t("myAccount:components.profile.forms.generic.inputs.validations.empty",
                            { fieldName }) }
                    type="text"
                    validation={
                        (value: string, validation: Validation) => validateField(value, validation, schema, fieldName)
                    }
                    maxLength={
                        schema.name === EMAIL_ADDRESSES_ATTRIBUTE
                            ? EMAIL_MAX_LENGTH
                            : primaryAttributeSchema.maxLength ?? ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                    }
                    data-componentid={
                        `${testId}-editing-section-${
                            schema.name.replace(".", "-")
                        }-field`
                    }
                />
                <div hidden={ !showAccordion }>
                    <TableContainer
                        component={ Paper }
                        elevation={ 0 }
                        data-componentid={
                            `${testId}-editing-section-${schema.name.replace(".", "-")}-accordion`
                        }
                    >
                        <Table
                            className="multi-value-table"
                            size="small"
                            aria-label="multi-attribute value table"
                        >
                            <TableBody>
                                { attributeValueList?.map(
                                    (value: string, index: number) => (
                                        <TableRow key={ index } className="multi-value-table-data-row">
                                            <TableCell align="left">
                                                <div className="table-c1">
                                                    <Typography
                                                        className={ `c1-value ${
                                                            schema.name === MOBILE_NUMBERS_ATTRIBUTE
                                                                ? "mobile-label"
                                                                : null}`
                                                        }
                                                        data-componentid={
                                                            `${testId}-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-value-${index}`
                                                        }
                                                    >
                                                        { value }
                                                    </Typography>
                                                    {
                                                        showPendingEmailPopup(value)
                                                            && (
                                                                <div
                                                                    className="verified-icon"
                                                                    data-componentid={
                                                                        `${testId}-editing-section-${
                                                                            schema.name.replace(".", "-")
                                                                        }-pending-email-${index}`
                                                                    }
                                                                >
                                                                    { generatePendingEmailPopup() }
                                                                </div>
                                                            )
                                                    }
                                                    {
                                                        showVerifiedPopup(value)
                                                            && (
                                                                <div
                                                                    className="verified-icon"
                                                                    data-componentid={
                                                                        `${testId}-editing-section-${
                                                                            schema.name.replace(".", "-")
                                                                        }-verified-icon-${index}`
                                                                    }
                                                                >
                                                                    { generateVerifiedPopup() }
                                                                </div>
                                                            )
                                                    }
                                                    {
                                                        showPrimaryChip(value)
                                                            && (
                                                                <div
                                                                    className="verified-icon"
                                                                    data-componentid={
                                                                        `${testId}-editing-section-${
                                                                            schema.name.replace(".", "-")
                                                                        }-primary-icon-${index}`
                                                                    }
                                                                >
                                                                    <Chip
                                                                        label={ t("common:primary") }
                                                                        size="small"
                                                                    />
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                <div className="table-c2">
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        className="text-btn"
                                                        hidden={ !showVerifyButton(value) }
                                                        onClick={ () => handleVerify(schema, value) }
                                                        disabled={ isSubmitting }
                                                        data-componentid={
                                                            `${testId}-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-verify-button-${index}`
                                                        }
                                                    >
                                                        { t("common:verify") }
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        className="text-btn"
                                                        hidden={ !showMakePrimaryButton(value) }
                                                        onClick={ () => handleMakePrimary(schema, value) }
                                                        disabled={ isSubmitting }
                                                        data-componentid={
                                                            `${testId}-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-make-primary-button-${index}`
                                                        }
                                                    >
                                                        { t("common:makePrimary") }
                                                    </Button>
                                                    <IconButton
                                                        size="small"
                                                        hidden={ !showDeleteButton(value) }
                                                        onClick={ () => {
                                                            setSelectedAttributeInfo({ schema, value });
                                                            setShowMultiValuedFieldDeleteConfirmationModal(
                                                                true
                                                            );
                                                        } }
                                                        disabled={ isSubmitting }
                                                        data-componentid={
                                                            `${testId}-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-delete-button-${index}`
                                                        }
                                                    >
                                                        <Popup
                                                            size="tiny"
                                                            trigger={
                                                                (
                                                                    <Icon name="trash alternate" />
                                                                )
                                                            }
                                                            header={ t("common:delete") }
                                                            inverted
                                                        />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <Field
                    className="link-button mv-cancel-btn"
                    onClick={ () => {
                        dispatch(setActiveForm(null));
                    } }
                    size="small"
                    type="button"
                    value={ t("common:cancel").toString() }
                    data-testid={
                        `${testId}-schema-mobile-editing-section-${
                            schema.name.replace(".", "-")
                        }-cancel-button`
                    }
                />
            </>
        );
    };

    const generateCountryDropdown = (schema: ProfileSchema, fieldName: string): JSX.Element => {
        const resolvedRequiredValue: boolean = schema?.profiles?.endUser?.required ?? schema.required;

        return (
            <>
                <Field
                    autoFocus={ true }
                    label=""
                    name={ schema.name }
                    placeholder={ getPlaceholderText(schema, fieldName) }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={
                        t("myAccount:components.profile.forms.generic.inputs.validations.empty", { fieldName }) }
                    type="dropdown"
                    children={ countryList ? countryList.map((list: DropdownItemProps) => ({
                        "data-testid": `${testId}-${list.value as string}`,
                        flag: list.flag,
                        key: list.key as string,
                        text: list.text as string,
                        value: list.value as string
                    })) : [] }
                    value={ resolveProfileInfoSchemaValue(schema) }
                    disabled={ false }
                    clearable={ !resolvedRequiredValue }
                    search
                    selection
                    fluid
                />
                <Field hidden={ true } type="divider" />
                <Form.Group>
                    <Field
                        size="small"
                        type="submit"
                        value={ t("common:save").toString() }
                        data-testid={
                            `${testId}-schema-mobile-editing-section-${
                                schema.name.replace(".", "-")
                            }-save-button`
                        }
                    />
                    <Field
                        className="link-button"
                        onClick={ () => {
                            dispatch(setActiveForm(null));
                        } }
                        size="small"
                        type="button"
                        value={ t("common:cancel").toString() }
                        data-testid={
                            `${testId}-schema-mobile-editing-section-${
                                schema.name.replace(".", "-")
                            }-cancel-button`
                        }
                    />
                </Form.Group>
            </>
        );
    };

    const generateEditableLocaleField = (schema: ProfileSchema, fieldName: string): JSX.Element => {
        const resolvedRequiredValue: boolean = schema?.profiles?.endUser?.required ?? schema.required;

        return (
            <>
                <Field
                    autofocus={ true }
                    name={ schema.name }
                    placeholder={ getPlaceholderText(schema, fieldName) }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={
                        t("myAccount:components.profile.forms.generic." +
                            "inputs.validations.empty", { fieldName })
                    }
                    type="dropdown"
                    value={ normalizeLocaleFormat(profileInfo.get(schema?.name), LocaleJoiningSymbol.HYPHEN, true) }
                    children={
                        supportedI18nLanguages
                            ? Object.keys(supportedI18nLanguages).map((key: string) => {
                                return {
                                    "data-testid": `${ testId }-locale-dropdown-`
                                        +  supportedI18nLanguages[key].code as string,
                                    flag: supportedI18nLanguages[key].flag ?? MyAccountProfileConstants.GLOBE,
                                    key: supportedI18nLanguages[key].code as string,
                                    text: supportedI18nLanguages[key].name === MyAccountProfileConstants.GLOBE
                                        ? supportedI18nLanguages[key].code
                                        : `${supportedI18nLanguages[key].name as string},
                                            ${supportedI18nLanguages[key].code as string}`,
                                    value: supportedI18nLanguages[key].code as string
                                };
                            }) : []
                    }
                    disabled={ false }
                    clearable={ !resolvedRequiredValue }
                    search
                    selection
                    fluid
                />
                <Field hidden={ true } type="divider" />
                <Form.Group>
                    <Field
                        size="small"
                        type="submit"
                        value={ t("common:save").toString() }
                        data-testid={
                            `${testId}-schema-mobile-editing-section-${
                                schema.name.replace(".", "-")
                            }-save-button`
                        }
                    />
                    <Field
                        className="link-button"
                        onClick={ () => {
                            dispatch(setActiveForm(null));
                        } }
                        size="small"
                        type="button"
                        value={ t("common:cancel").toString() }
                        data-testid={
                            `${testId}-schema-mobile-editing-section-${
                                schema.name.replace(".", "-")
                            }-cancel-button`
                        }
                    />
                </Form.Group>
            </>
        );
    };

    const generateTextField = (schema: ProfileSchema, fieldName: string): JSX.Element => {
        const resolvedRequiredValue: boolean = schema?.profiles?.endUser?.required ?? schema.required;

        return (
            <>
                <Field
                    autoFocus={ true }
                    label=""
                    name={ schema.name }
                    data-testid= { `${testId}-${schema.name.replace(".", "-")}-text-field` }
                    data-componentid= { `${testId}-${schema.name.replace(".", "-")}-text-field` }
                    placeholder={ getPlaceholderText(schema, fieldName) }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={
                        t("myAccount:components.profile.forms.generic.inputs.validations.empty", { fieldName }) }
                    type="text"
                    validation={
                        (value: string, validation: Validation) => validateField(value, validation, schema, fieldName) }
                    value={ resolveProfileInfoSchemaValue(schema) }
                    maxLength={
                        schema.name === EMAIL_ATTRIBUTE
                            ? EMAIL_MAX_LENGTH
                            : (fieldName.toLowerCase().includes("uri") || fieldName.toLowerCase().includes("url"))
                                ? ProfileConstants.URI_CLAIM_VALUE_MAX_LENGTH
                                : (schema.maxLength
                                    ? schema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH)
                    }
                />
                <Field hidden={ true } type="divider" />
                <Form.Group>
                    <Field
                        size="small"
                        type="submit"
                        value={ t("common:save").toString() }
                        data-testid={
                            `${testId}-schema-mobile-editing-section-${
                                schema.name.replace(".", "-")
                            }-save-button`
                        }
                    />
                    <Field
                        className="link-button"
                        onClick={ () => {
                            dispatch(setActiveForm(null));
                        } }
                        size="small"
                        type="button"
                        value={ t("common:cancel").toString() }
                        data-testid={
                            `${testId}-schema-mobile-editing-section-${
                                schema.name.replace(".", "-")
                            }-cancel-button`
                        }
                    />
                </Form.Group>
            </>

        );
    };

    /**
     * This function generates the read-only field content for the schema.
     * @param schema - The schema to generate the read-only field content for.
     * @param fieldName - The field name to generate the read-only field content for.
     * @returns The read-only field content.
     */
    const generateReadOnlyFieldContent = (schema: ProfileSchema, fieldName: string): JSX.Element => {

        if (isProfileInfoLoading || profileSchemaLoader) {
            return <Placeholder><Placeholder.Line /></Placeholder>;
        } else if (profileInfo.get(schema.name)
            && schema.name === EMAIL_ATTRIBUTE
            && isEmailPending
            && isEmailVerificationEnabled) {
            return (
                <>
                    { profileInfo.get(schema.name) }
                    <Popup
                        size="tiny"
                        trigger={
                            (<Icon
                                name="info circle"
                                color="yellow"
                            />)
                        }
                        content={
                            t("myAccount:components.profile.messages." +
                                    "emailConfirmation.content")
                        }
                        header={
                            t("myAccount:components.profile.messages." +
                                    "emailConfirmation.header")
                        }
                        inverted
                    />
                </>
            );
        } else if ( schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            return generateReadOnlyMultiValuedField(schema, fieldName);
        } else if (profileInfo.get(schema.name)) {
            return <>{ resolveProfileInfoSchemaValue(schema) }</>;
        } else {
            return generatePlaceholderLink(schema, fieldName);
        }
    };

    const generateReadOnlyMultiValuedField = (schema: ProfileSchema, fieldName: string): JSX.Element => {

        let attributeValueList: string[] = [];
        let verifiedAttributeValueList: string[] = [];
        let primaryAttributeValue: string = "";
        let pendingEmailAddress: string = "";
        let verificationEnabled: boolean = false;

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            verificationEnabled = isEmailVerificationEnabled;
            attributeValueList = profileInfo.get(EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            verifiedAttributeValueList = profileInfo.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            pendingEmailAddress = profileDetails?.profileInfo?.pendingEmails?.length > 0
                ? profileDetails?.profileInfo?.pendingEmails[0]?.value
                : null;
            primaryAttributeValue = profileDetails?.profileInfo?.emails?.length > 0
                ? profileDetails?.profileInfo?.emails[0]
                : null;

        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            verificationEnabled = isMobileVerificationEnabled;
            attributeValueList = profileInfo.get(MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            verifiedAttributeValueList = profileInfo.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = profileInfo.get(MOBILE_ATTRIBUTE);
        }

        // Ensure primaryAttributeValue is defined and attributeValueList is an array.
        if (!isEmpty(primaryAttributeValue) && Array.isArray(attributeValueList)) {
            attributeValueList = attributeValueList.filter((value: string) =>
                value !== primaryAttributeValue
                && !isEmpty(value)
            );
            attributeValueList.unshift(primaryAttributeValue);
        }

        const showPendingEmailPopup = (value: string): boolean => {
            return verificationEnabled
                && schema.name === EMAIL_ADDRESSES_ATTRIBUTE
                && pendingEmailAddress
                && value === pendingEmailAddress;
        };

        const showVerifiedPopup = (value: string): boolean => {
            return verificationEnabled &&
                (verifiedAttributeValueList.includes(value) || value === primaryAttributeValue);
        };

        const showPrimaryChip = (value: string): boolean => {
            return value === primaryAttributeValue;
        };

        const renderSingleMenuItem = (value: string, index: number): JSX.Element => {
            return (
                <div className="dropdown-row">
                    <Typography
                        className={ `dropdown-label ${schema.name === MOBILE_NUMBERS_ATTRIBUTE
                            ? "mobile-label"
                            : null}`
                        }
                        data-componentid={ `${testId}-readonly-section-${schema.name.replace(".", "-")}-value-${index}`
                        }
                    >
                        { value }
                    </Typography>
                    {
                        showPendingEmailPopup(value)
                        && (
                            <div
                                className="verified-icon"
                                data-componentid={ `${testId}-readonly-section-${schema.name.replace(".", "-")}` +
                                    `-pending-email-icon-${index}` }
                            >
                                { generatePendingEmailPopup() }
                            </div>
                        )
                    }
                    {
                        showVerifiedPopup(value)
                        && (
                            <div
                                className="verified-icon"
                                data-componentid={ `${testId}-readonly-section-${schema.name.replace(".", "-")}` +
                                    `-verified-icon-${index}` }
                            >
                                { generateVerifiedPopup() }
                            </div>
                        )
                    }
                    {
                        showPrimaryChip(value)
                        && (
                            <div
                                className="verified-icon"
                                data-componentid={ `${testId}-readonly-section-${schema.name.replace(".", "-")}` +
                                    `-primary-icon-${index}` }
                            >
                                <Chip
                                    label={ t("common:primary") }
                                    size="small"
                                />
                            </div>
                        )
                    }
                </div>
            );
        };

        if (attributeValueList.length < 1) {
            return generatePlaceholderLink(schema, fieldName);
        }

        if (attributeValueList.length > 1) {
            return (
                <Select
                    className="multi-attribute-dropdown"
                    value={ attributeValueList[0] }
                    disableUnderline
                    variant="standard"
                    data-componentid={ `${testId}-${schema.name.replace(".", "-")}-readonly-dropdown` }
                >
                    { attributeValueList?.map(
                        (value: string, index: number) => (
                            <MenuItem key={ index } value={ value } className="read-only-menu-item">
                                { renderSingleMenuItem(value, index) }
                            </MenuItem>
                        )
                    ) }
                </Select>
            );
        }

        return renderSingleMenuItem(attributeValueList[0], 0);
    };

    const generatePlaceholderLink = (schema: ProfileSchema, fieldName: string): JSX.Element => {
        const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability ?? schema.mutability;

        if (!CommonUtils.isProfileReadOnly(isReadOnlyUser) &&
            resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA) {
            return (
                <a
                    className="placeholder-text"
                    tabIndex={ 0 }
                    onKeyPress={ (e: React.KeyboardEvent<HTMLAnchorElement>) => {
                        if (e.key === "Enter") {
                            dispatch(setActiveForm(CommonConstants.PERSONAL_INFO + schema.name));
                        }
                    } }
                    onClick={ () => {
                        dispatch(setActiveForm(CommonConstants.PERSONAL_INFO + schema.name));
                    } }
                    data-testid={
                        `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-placeholder` }
                >
                    { t("myAccount:components.profile.forms.generic.inputs.placeholder", {
                        fieldName: fieldName.toLowerCase()
                    }) }
                </a>
            );
        }

        return null;
    };

    const generateEditIcon = (schema: ProfileSchema): JSX.Element | null => {

        let attributeValueList: string[] = [];
        let primaryAttributeValue: string = "";
        const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability ?? schema.mutability;

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            attributeValueList = profileInfo.get(EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = profileDetails?.profileInfo?.emails?.length > 0
                ? profileDetails?.profileInfo?.emails[0]
                : null;

        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            attributeValueList = profileInfo.get(MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = profileInfo.get(MOBILE_ATTRIBUTE);
        }

        const isFieldEmpty = (): boolean => {
            if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                return  attributeValueList.length < 1 && isEmpty(primaryAttributeValue);
            } else {
                return isEmpty(profileInfo.get(schema.name));
            }
        };

        if (!CommonUtils.isProfileReadOnly(isReadOnlyUser)
            && resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA
            && schema.name !== ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME")
            && !isFieldEmpty()
            && hasRequiredScopes(
                featureConfig?.personalInfo, featureConfig?.personalInfo?.scopes?.update, allowedScopes)
        ) {
            return (
                <Popup
                    trigger={
                        (<Icon
                            link={ true }
                            className="list-icon"
                            size="small"
                            color="grey"
                            tabIndex={ 0 }
                            onKeyPress={ (e: React.KeyboardEvent<HTMLElement>) => {
                                if (e.key === "Enter") {
                                    dispatch(setActiveForm(CommonConstants.PERSONAL_INFO + schema.name));
                                }
                            } }
                            onClick={ () => dispatch(setActiveForm(CommonConstants.PERSONAL_INFO + schema.name)) }
                            name={ !isFieldEmpty() ? "pencil alternate" : null }
                            data-testid={
                                `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-edit-button` }
                        />)
                    }
                    position="top center"
                    content={ !isFieldEmpty() ? t("common:edit") : "" }
                    inverted={ true }
                />
            );
        }

        return null;
    };

    /**
     * This function validates the field.
     *
     * @param value - The value to validate.
     * @param validation - The validation to validate the value with.
     * @param schema - The schema to validate the value with.
     * @param fieldName - The field name to validate the value with.
     */
    const validateField = (value: string, validation: Validation, schema: ProfileSchema, fieldName: string) => {

        // Validate multi-valued fields like email addresses and mobile numbers
        // using the schema of the primary attribute for individual value validation.
        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            return validateField(value, validation, getSchemaFromName(EMAIL_ATTRIBUTE), fieldName);
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            return validateField(value, validation, getSchemaFromName(MOBILE_ATTRIBUTE), fieldName);
        }

        if (!RegExp(schema.regEx).test(value)) {
            validation.isValid = false;
            if (checkSchemaType(schema.name, "emails")) {
                validation.errorMessages.push(
                    t("myAccount:components.profile.forms.emailChangeForm.inputs.email.validations.invalidFormat")
                );
            } else if (checkSchemaType(schema.name, ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS"))) {
                validation.errorMessages.push(
                    t(profileConfig?.attributes?.getRegExpValidationError(
                        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")
                    ),{ fieldName } )
                );
            } else if (checkSchemaType(schema.name, ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB"))) {
                validation.errorMessages.push(
                    t("myAccount:components.profile.forms." +
                    "dateChangeForm.inputs.date.validations." +
                    "invalidFormat", { fieldName })
                );
            } else {
                validation.errorMessages.push(
                    t("myAccount:components.profile.forms.generic.inputs.validations.invalidFormat",
                        {
                            fieldName
                        }
                    )
                );
            }
        // Validate date format and the date is before the current date
        } else if(checkSchemaType(schema.name, ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB"))){
            if (!moment(value, "YYYY-MM-DD",true).isValid()) {
                validation.isValid = false;
                validation.errorMessages
                    .push(t("myAccount:components.profile.forms.dateChangeForm.inputs.date.validations.invalidFormat",
                        {
                            field: fieldName
                        }));
            } else {
                if (moment().isBefore(value)) {
                    validation.isValid = false;
                    validation.errorMessages
                        .push(t("myAccount:components.profile.forms.dateChangeForm.inputs.date.validations."
                        + "futureDateError", {
                            field: fieldName
                        }));
                }
            }
        }
    };

    const generatePendingEmailPopup= (): JSX.Element => {

        return (
            <Popup
                name="pending-email-popup"
                size="tiny"
                trigger={
                    (<Icon
                        name="info circle"
                        color="yellow"
                    />)
                }
                header={
                    t("myAccount:components.profile.messages." +
                            "emailConfirmation.header")
                }
                inverted
            />
        );
    };

    const generateVerifiedPopup= (): JSX.Element => {

        return (
            <Popup
                name="verified-popup"
                size="tiny"
                trigger={
                    (
                        <Icon
                            name="check"
                            color="green"
                        />
                    )
                }
                header= { t("common:verified") }
                inverted
            />
        );
    };

    /**
     * This function gets the field name for the schema.
     *
     * @param schema - The schema to get the field name for.
     * @returns The field name.
     */
    const getFieldName = (schema: ProfileSchema): string => {

        return t("myAccount:components.profile.fields." + schema.displayName, { defaultValue: schema.displayName });
    };

    /**
     * This function gets the placeholder text for the schema.
     *
     * @param schema - The schema to get the placeholder text for.
     * @param fieldName - The field name to get the placeholder text for.
     * @returns The placeholder text.
     */
    const getPlaceholderText = (schema: ProfileSchema, fieldName: string): string => {

        if (checkSchemaType(schema.name, "country")) {
            return t("myAccount:components.profile.forms.countryChangeForm.inputs.country.placeholder");
        }

        let placeholder: string = t("myAccount:components.profile.forms.generic.inputs.placeholder",
            { fieldName: fieldName.toLowerCase() });

        if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB")) {
            placeholder += " in the format YYYY-MM-DD";
        }

        return placeholder;
    };

    /**
     * This function returns the schema for a given schema name.
     *
     * @param schemaName - Schema name
     * @returns Profile schema
     */
    const getSchemaFromName = (schemaName: string): ProfileSchema => {

        return profileSchema.find((schema: ProfileSchema) => schema.name === schemaName);
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param e - Event.
     * @param url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        setIsSubmitting(true);

        updateProfileImageURL(url)
            .then(() => {
                onAlertFired({
                    description: t("myAccount:components.profile.notifications.updateProfileInfo.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.success.message")
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t("myAccount:components.profile.notifications.updateProfileInfo.error" +
                            ".description",
                        { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.profile.notifications.updateProfileInfo.error.message")
                    });
                }

                onAlertFired({
                    description: t("myAccount:components.profile.notifications.updateProfileInfo.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
                });
            })
            .finally(() => {
                setShowEditAvatarModal(false);
                setIsSubmitting(false);
            });
    };

    /**
     * Renders the user avatar.
     *
     * @returns Avatar.
     */
    const renderAvatar = () => (
        <>
            <UserAvatar
                data-testid={ `${testId}-user-avatar` }
                editable={ !isProfileUrlReadOnly() }
                showGravatarLabel
                size="tiny"
                tabIndex={ 0 }
                onKeyPress={ (e: React.KeyboardEvent<HTMLElement>) => {
                    if (e.key === "Enter" && !isProfileUrlReadOnly()) {
                        handleAvatarOnClick();
                    }
                } }
                onClick={ !isProfileUrlReadOnly() ? handleAvatarOnClick : undefined }
                profileInfo={ profileDetails?.profileInfo as any }
                gravatarInfoPopoverText={ (
                    <Trans i18nKey="myAccount:components.userAvatar.infoPopover">
                        This image has been retrieved from
                        <a href={ UIConstants.GRAVATAR_URL } target="_blank" rel="noopener noreferrer">
                            Gravatar
                        </a> service.
                    </Trans>
                ) }
            />
            {
                showEditAvatarModal && (
                    <EditAvatarModal
                        data-testid={ `${testId}-edit-avatar-modal` }
                        open={ showEditAvatarModal }
                        name={ resolveUserDisplayName(profileDetails?.profileInfo as any) }
                        emails={ resolveUserEmails(profileDetails?.profileInfo?.emails) }
                        onClose={ () => setShowEditAvatarModal(false) }
                        onCancel={ () => setShowEditAvatarModal(false) }
                        onSubmit={ handleAvatarEditModalSubmit }
                        imageUrl={ profileDetails?.profileInfo?.profileUrl }
                        heading={ t("myAccount:modals.editAvatarModal.heading") }
                        submitButtonText={ t("myAccount:modals.editAvatarModal.primaryButton") }
                        isSubmitting={ isSubmitting }
                        cancelButtonText={ t("myAccount:modals.editAvatarModal.secondaryButton") }
                        translations={ {
                            gravatar: {
                                errors: {
                                    noAssociation: {
                                        content: (
                                            <Trans
                                                i18nKey={
                                                    "myAccount:modals.editAvatarModal.content.gravatar.errors." +
                                                    "noAssociation.content"
                                                }
                                            >
                                                It seems like the selected email is not registered on Gravatar.
                                                Sign up for a Gravatar account by visiting
                                                <a href="https://www.gravatar.com"> Gravatar Official Website</a>
                                                or use one of the following.
                                            </Trans>
                                        ),
                                        header: t("myAccount:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("myAccount:modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("myAccount:modals.editAvatarModal.content.hostedAvatar.heading"),
                                input: {
                                    errors: {
                                        http: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.content"),
                                            header: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.header")
                                        },
                                        invalid: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.content"),
                                            pointing: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.pointing")
                                        }
                                    },
                                    hint: t("myAccount:modals.editAvatarModal.content.hostedAvatar.input.hint"),
                                    placeholder: t("myAccount:modals.editAvatarModal.content.hostedAvatar.input" +
                                        ".placeholder"),
                                    warnings: {
                                        dataURL: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.content"),
                                            header: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.header")
                                        }
                                    }
                                }
                            },
                            systemGenAvatars: {
                                heading: t("myAccount:modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("myAccount:modals.editAvatarModal.content.systemGenAvatars." +
                                        "types.initials")
                                }
                            }
                        } }
                    />
                )
            }
        </>
    );


    /**
     * This methods generates and returns the delete confirmation modal.
     *
     * @returns ReactElement Generates the delete confirmation modal.
     */
    const generateDeleteConfirmationModal = (): JSX.Element => {

        if (isEmpty(selectedAttributeInfo?.value)) {
            return null;
        }

        let translationKey: string = "";

        if (selectedAttributeInfo?.schema?.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            translationKey = "myAccount:components.profile.modals.emailAddressDeleteConfirmation.";
        } else {
            translationKey = "myAccount:components.profile.modals.mobileNumberDeleteConfirmation.";
        }

        return (
            <ConfirmationModal
                data-testid={ `${ testId }-delete-confirmation-modal` }
                data-componentid={ `${ testId }-delete-confirmation-modal` }
                onClose={ handleMultiValuedFieldDeleteModalClose }
                type="negative"
                open={ Boolean(selectedAttributeInfo?.value) }
                assertionHint={ t(`${translationKey}assertionHint`) }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleMultiValuedFieldDeleteModalClose }
                onPrimaryActionClick={ handleMultiValuedFieldDeleteConfirmClick }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                    { t(`${translationKey}heading`) }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message data-testid={ `${ testId }-confirmation-modal-message` } attached negative>
                    { t(`${translationKey}description`) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                    { t(`${translationKey}content`) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Check whether the profile url is readonly.
     *
     * @returns If the profile URL is readonly or not.
     */
    const isProfileUrlReadOnly = (): boolean => {
        return !(!CommonUtils.isProfileReadOnly(isReadOnlyUser)
            && hasRequiredScopes(featureConfig?.personalInfo,featureConfig?.personalInfo?.scopes?.update, allowedScopes)
            && profileSchema?.some((schema: ProfileSchema) => {
                const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability ?? schema.mutability;

                return schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL")
                    && resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA;
            }));
    };

    /**
     * Handles the onclick action of the avatar.
     */
    const handleAvatarOnClick = () => {
        setShowEditAvatarModal(true);
    };

    /**
     * Handles the close action of the mobile update wizard.
     */
    const handleCloseMobileUpdateWizard = () => {
        setShowMobileUpdateWizard(false);
        dispatch(setActiveForm(null));
    };

    /**
     * Whether to show the mobile verification wizard or not.
     * @param schema - Profile schema
     * @returns boolean - Whether to show the mobile verification wizard or not
     */
    const showMobileVerification = (schema: ProfileSchema): boolean =>
        showMobileUpdateWizard && (
            isMultipleEmailAndMobileNumberEnabled === true
                ? schema.name === MOBILE_NUMBERS_ATTRIBUTE
                : schema.name === MOBILE_ATTRIBUTE
        );

    return (
        <>
            <SettingsSection
                data-testid={ `${testId}-settings-section` }
                description={ t("myAccount:sections.profile.description") }
                header={ t("myAccount:sections.profile.heading") }
                icon={ renderAvatar() }
                iconMini={ renderAvatar() }
                placeholder={
                    !isSCIMEnabled
                        ? t("myAccount:components.profile.placeholders.SCIMDisabled.heading")
                        : null
                }
            >
                {
                    hasLocalAccount
                        ? (
                            <List
                                divided={ true }
                                verticalAlign="middle"
                                className="main-content-inner profile-form"
                                data-testid={ `${testId}-schema-list` }
                            >
                                {
                                    profileSchema && profileSchema.map((schema: ProfileSchema, index: number) => {
                                        const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability
                                            ?? schema.mutability;
                                        const resolvedRequiredValue: boolean = schema?.profiles?.endUser?.required
                                            ?? schema.required;

                                        if (!(schema.name ===
                                            ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("GROUPS")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("USER_SOURCE_ID")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("IDP_TYPE")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY
                                        .get("LOCAL_CREDENTIAL_EXISTS")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("RESROUCE_TYPE")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("EXTERNAL_ID")
                                    || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_DATA")
                                    || (!showEmail && schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY
                                        .get("EMAILS"))
                                        )) {
                                            return (
                                                <>
                                                    {
                                                        showMobileVerification(schema)
                                                            ? (
                                                                < MobileUpdateWizard
                                                                    data-testid=
                                                                        { `${testId}-mobile-verification-wizard` }
                                                                    onAlertFired={ onAlertFired }
                                                                    closeWizard={ () =>
                                                                        handleCloseMobileUpdateWizard()
                                                                    }
                                                                    wizardOpen={ true }
                                                                    currentMobileNumber={
                                                                        schema.name === MOBILE_NUMBERS_ATTRIBUTE
                                                                            ? selectedAttributeInfo?.schema?.name
                                                                            === MOBILE_NUMBERS_ATTRIBUTE
                                                                                ? selectedAttributeInfo?.value
                                                                                : null
                                                                            : profileInfo.get(schema.name)
                                                                    }
                                                                    isMobileRequired={ resolvedRequiredValue }
                                                                    isMultipleEmailAndMobileNumberEnabled =
                                                                        {
                                                                            isMultipleEmailAndMobileNumberEnabled
                                                                        === true
                                                                        }
                                                                />
                                                            )
                                                            : null
                                                    }
                                                    {
                                                        !isEmpty(profileInfo.get(schema.name)) ||
                                        (!CommonUtils.isProfileReadOnly(isReadOnlyUser)
                                            && (resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA)
                                            && hasRequiredScopes(featureConfig?.personalInfo,
                                                featureConfig?.personalInfo?.scopes?.update, allowedScopes))
                                                            ? generateSchemaForm(schema, index)
                                                            : null
                                                    }
                                                </>
                                            );
                                        }
                                    })
                                }
                            </List>
                        ) : (
                            <Container className="pl-5 pr-5 pb-4">
                                <Message
                                    type="info"
                                    content={ "Your profile cannot be managed from this portal." +
                                        " Please contact your administrator for more details." }
                                    data-testid={ `${testId}-read-only-profile-banner` }
                                    data-componentid={ `${testId}-read-only-profile-banner` }
                                />
                            </Container>
                        )
                }
            </SettingsSection>
            { showMultiValuedFieldDeleteConfirmationModal && generateDeleteConfirmationModal() }
        </>
    );
};

/**
 * Default properties for the {@link Profile} component.
 * See type definitions in {@link ProfileProps}
 */
Profile.defaultProps = {
    "data-testid": "profile"
};
