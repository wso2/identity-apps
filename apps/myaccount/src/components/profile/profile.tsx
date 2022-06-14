/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 * under the License
 */

import { updateProfileImageURL } from "@wso2is/core/api";
import { ProfileConstants } from "@wso2is/core/constants";
import {
    getUserNameWithoutDomain,
    hasRequiredScopes,
    isFeatureEnabled,
    resolveUserDisplayName,
    resolveUserEmails
} from "@wso2is/core/helpers";
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { ProfileUtils, CommonUtils as ReusableCommonUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { EditAvatarModal, LinkButton, PrimaryButton, UserAvatar } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, Form, Grid, Icon, List, Placeholder, Popup, Responsive } from "semantic-ui-react";
import { updateProfileInfo } from "../../api";
import { AppConstants, CommonConstants } from "../../constants";
import * as UIConstants from "../../constants/ui-constants";
import { commonConfig, profileConfig } from "../../extensions";
import { AlertInterface, AlertLevels, AuthStateInterface, FeatureConfigInterface, ProfileSchema } from "../../models";
import { AppState } from "../../store";
import { getProfileInformation, setActiveForm } from "../../store/actions";
import { CommonUtils } from "../../utils";
import { EditSection, SettingsSection } from "../shared";
import { MobileUpdateWizard } from "../shared/mobile-update-wizard";

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
 * @param {ProfileProps} props - Props injected to the basic details component.
 * @return {ReactElement}
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): ReactElement => {
    const {
        isNonLocalCredentialUser,
        onAlertFired,
        featureConfig,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const isSCIMEnabled: boolean = useSelector((state: AppState) => state.profile.isSCIMEnabled);
    const profileSchemaLoader: boolean = useSelector((state: AppState) => state.loaders.isProfileSchemaLoading);
    const isReadOnlyUser = useSelector((state: AppState) => 
        state.authenticationInformation.profileInfo.isReadOnly);
    const config = useSelector((state: AppState) => state.config);

    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchema[]>();
    const [ isEmailPending, setEmailPending ] = useState<boolean>(false);
    const [ userId, setUserId ] = useState<string>(null);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ showMobileUpdateWizard, setShowMobileUpdateWizard ] = useState<boolean>(false);
    const [ countryList, setCountryList ] = useState<DropdownItemProps[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    // Removed User ID field from profile.
    // Uncomment if User ID needs to be added back.
    // /**
    //  * Set the userId.
    //  */
    // useEffect(() => {
    //
    //     setUserId(profileDetails.profileInfo.id);
    // }, [profileDetails]);

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
        if (profileDetails?.profileInfo?.pendingEmails && !isEmpty(profileDetails?.profileInfo?.pendingEmails)) {
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
     * Sort the elements of the profileSchema state according by the displayOrder attribute in the ascending order.
     */
    useEffect(() => {
        const sortedSchemas = ProfileUtils.flattenSchemas([ ...profileDetails.profileSchemas ])
            .sort((a: ProfileSchema, b: ProfileSchema) => {
                if (!a.displayOrder) {
                    return -1;
                } else if (!b.displayOrder) {
                    return 1;
                } else {
                    return parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10);
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

                let isCanonical = false;

                // this splits for the canonical types
                const schemaNamesCanonicalType: string[] = schemaNames[0].split("#");

                if(schemaNamesCanonicalType.length !== 1){
                    isCanonical = true;
                }

                if (schemaNames.length === 1) {
                    if (schemaNames[0] === "emails") {
                        if (profileDetails?.profileInfo?.pendingEmails?.length > 0) {
                            tempProfileInfo.set(schema.name,
                                profileDetails.profileInfo.pendingEmails[0].value as string);
                        } else {
                            const primaryEmail = profileDetails.profileInfo[schemaNames[0]] &&
                                profileDetails.profileInfo[schemaNames[0]]
                                    .find((subAttribute) => typeof subAttribute === "string");

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
                                    ? profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]
                                    : ""
                            );

                            return;
                        }

                        if (schema.extended
                            && profileDetails?.profileInfo[ProfileConstants.SCIM2_WSO2_CUSTOM_SCHEMA]
                            && profileDetails?.profileInfo[ProfileConstants.SCIM2_WSO2_CUSTOM_SCHEMA][schemaNames[0]]) {
                            tempProfileInfo.set(
                                schema.name,
                                profileDetails?.profileInfo[ProfileConstants.SCIM2_WSO2_CUSTOM_SCHEMA]
                                    ? profileDetails?.profileInfo[ProfileConstants.SCIM2_WSO2_CUSTOM_SCHEMA][schemaNames[0]]
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
                        let indexOfType = -1;

                        profileDetails?.profileInfo[schemaNamesCanonicalType[0]]?.forEach((canonical: CanonicalAttribute) => {
                            if(schemaNamesCanonicalType[1] === canonical?.type) {
                                indexOfType = profileDetails?.profileInfo[schemaNamesCanonicalType[0]].indexOf(canonical);
                            }
                        });

                        if (indexOfType > -1) {
                            const subValue = profileDetails?.profileInfo[schemaNamesCanonicalType[0]][indexOfType][schemaNames[1]];

                            if(schemaNamesCanonicalType [0] === "addresses") {
                                tempProfileInfo.set(schema.name, subValue);
                            }
                        }
                    } else {
                        if (schema.extended) {
                            tempProfileInfo.set(schema.name,
                                profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]]
                                    ? profileDetails
                                        ?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]][schemaNames[1]]
                                    : "");
                        } else {
                            const subValue = profileDetails.profileInfo[schemaNames[0]]
                                && profileDetails.profileInfo[schemaNames[0]]
                                    .find((subAttribute) => subAttribute.type === schemaNames[1]);

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
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values
     * @param formName
     * @param isExtended
     * @param schema {ProfileSchema}
     */
    const handleSubmit = (
        values: Map<string, string | string[]>,
        formName: string,
        isExtended: boolean,
        schema: ProfileSchema
    ): void => {
        const data = {
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

        let isCanonical = false;

        // this splits for the canonical types
        const schemaNamesCanonicalType: string[] = schemaNames[0].split("#");

        if(schemaNamesCanonicalType.length !== 1){
            isCanonical = true;
        }

        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
            schemaNames[0] === "phoneNumbers") {
            const attributeValues = [];

            if (schemaNames.length === 1) {
                // List of sub attributes.
                const subValue = profileDetails.profileInfo[schemaNames[0]]
                    && profileDetails.profileInfo[schemaNames[0]]
                        .filter((subAttribute) => typeof subAttribute === "object");

                if (subValue && subValue.length > 0) {
                    subValue.map((value) => {
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
                        [ProfileConstants.SCIM2_ENT_USER_SCHEMA]: {
                            "verifyEmail": true
                        }
                    };
                }
            } else {
                let primaryValue = "";

                // The primary value of the email attribute.
                if (schemaNames[0] === "emails" && profileDetails?.profileInfo[schemaNames[0]]) {
                    primaryValue = profileDetails.profileInfo[schemaNames[0]]
                        && profileDetails.profileInfo[schemaNames[0]]
                            .find((subAttribute) => typeof subAttribute === "string");
                }

                // List of sub attributes.
                const subValues = profileDetails.profileInfo[schemaNames[0]]
                    && profileDetails.profileInfo[schemaNames[0]]
                        .filter((subAttribute) => typeof subAttribute ===  "object");

                if (subValues && subValues.length > 0) {
                    subValues.map((value) => {
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
                        [ProfileConstants.SCIM2_ENT_USER_SCHEMA]: {
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
                                type: schemaNames[1],
                                formatted: values.get(formName)
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
        const attrKey = "userName";

        if (attrKey in value) {
            const oldValue = profileInfo?.get(schema?.name);

            if (oldValue?.indexOf("/") > -1) {
                const fragments = oldValue.split("/");

                if (fragments?.length > 1) {
                    value[attrKey] = `${ fragments[0] }/${ value[attrKey] }`;
                }
            }
        }

        data.Operations[0].value = value;
        updateProfileInfo(data).then((response) => {
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
        }).catch(error => {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        });

        // Hide corresponding edit view
        dispatch(setActiveForm(null));
    };

    /**
     * This takes the schema name and a type and sees if the schema is of the specified type
     * @param {string} schema The schema name eg: 'emails.workEmail'
     * @param {string}type The type to check for eg: 'emails'
     *
     * @returns {boolean} True/False
     */
    const checkSchemaType = (schema: string, type: string): boolean => {
        return schema.split(".").filter((name) => {
            return name === type;
        }).length > 0;
    };

    /**
     * Resolves the current schema value to the form value.
     * @return {string} schema form value
     */
    const resolveProfileInfoSchemaValue = (schema: ProfileSchema): string => {

        let schemaFormValue = profileInfo.get(schema.name);

        /**
         * Remove the user-store-name prefix from the userName
         * Match case applies only for secondary user-store.
         *
         * Transforms the value: -
         * USER-STORE/userNameString => userNameString
         */
        if (schema.name === "userName") {
            schemaFormValue = getUserNameWithoutDomain(schemaFormValue);
        }

        return schemaFormValue;

    };

    /**
     * This function generates the Edit Section based on the input Profile Schema
     * @param {Profile Schema} schema
     */
    const generateSchemaForm = (schema: ProfileSchema): JSX.Element => {

        /**
         * Makes the "Username" field a READ_ONLY field. By default the
         * server SCIM2 endpoint sends it as a "READ_WRITE" property.
         * We are able to enable/disable read-only mode for specific
         * claim dialects in user-store(s). However, it does not apply to
         * all the tenants.
         *
         * Since we only interested in checking `username` we check the
         * {@code isProfileUsernameReadonly} condition at top level. So,
         * if it is {@code false} by default then we won't check the `name`
         * unnecessarily.
         *
         * Match case explanation:-
         * Ideally it should be the exact attribute name {@code http://wso2.org/claims/username}
         * `username`. But we will transform the {@code schema.name}
         * and {@code schema.displayName} to a lowercase string and then check
         * the value matches.
         */
        const isProfileUsernameReadonly: boolean = config.ui.isProfileUsernameReadonly;
        const { displayName, name } = schema;

        if (isProfileUsernameReadonly) {
            const usernameClaim = "username";

            if (name?.toLowerCase() === usernameClaim || displayName?.toLowerCase() === usernameClaim) {
                schema.mutability = ProfileConstants.READONLY_SCHEMA;
            }
        }

        /**
         *  Makes the email field read-only for users without local credentials
         */
        if (isNonLocalCredentialUser) {
            if (name?.toLowerCase() === "emails" ) {
                schema.mutability = ProfileConstants.READONLY_SCHEMA;
            }
        }

        if (activeForm === CommonConstants.PERSONAL_INFO+schema.name) {
            const fieldName = t("myAccount:components.profile.fields." + schema.name.replace(".", "_"),
                { defaultValue: schema.displayName }
            );

            // Define the field placeholder for text fields.
            let innerPlaceholder = t("myAccount:components.profile.forms.generic." +
                "inputs.placeholder",
                {
                    fieldName: fieldName.toLowerCase()
                } );

            // Concatenate the date format for the birth date field.
            if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB")) {
                innerPlaceholder += " in the format YYYY-MM-DD";
            }

            return (
                isFeatureEnabled(
                    featureConfig?.personalInfo,
                    AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_MOBILE_VERIFICATION")
                ) && checkSchemaType(schema.name, "mobile")
                    ? (
                        <EditSection data-testid={ `${testId}-schema-mobile-editing-section` }>
                            <p>
                                { t("myAccount:components.profile.messages.mobileVerification.content") }
                            </p>
                            <Grid padded={ true }>
                                <Grid.Row columns={ 2 }>
                                    < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                                        <List.Content>{ fieldName }</List.Content>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                                        <List.Content>
                                            <List.Description>
                                                {
                                                    isProfileInfoLoading || profileSchemaLoader
                                                        ? (
                                                            <Placeholder><Placeholder.Line /></Placeholder>
                                                        )
                                                        : profileInfo.get(schema.name)
                                                    || (
                                                        <a
                                                            className="placeholder-text"
                                                            tabIndex={ 0 }
                                                            onClick={ () => {
                                                                setShowMobileUpdateWizard(true);
                                                            } }
                                                            onKeyPress={ (e) => {
                                                                if (e.key === "Enter") {
                                                                    setShowMobileUpdateWizard(true);
                                                                }
                                                            } }
                                                            data-testid={ `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-placeholder` }
                                                        >
                                                            { t("myAccount:components.profile.forms.generic.inputs." +
                                                                "placeholder", { fieldName: fieldName.toLowerCase() }) }
                                                        </a>
                                                    )
                                                }
                                            </List.Description>
                                        </List.Content>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                        <PrimaryButton
                                            floated="left"
                                            onClick={ () => {
                                                setShowMobileUpdateWizard(true);
                                            } }
                                        >
                                            { t("common:update").toString() }
                                        </PrimaryButton>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                        <LinkButton
                                            floated="left"
                                            onClick={ () => {
                                                dispatch(setActiveForm(null));
                                            } }
                                        >
                                            { t("common:cancel").toString() }
                                        </LinkButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid >
                        </EditSection>
                    )
                    : (
                        <EditSection data-testid={ `${testId}-schema-editing-section` }>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 4 }>{ fieldName }</Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <Forms
                                            onSubmit={ (values) => {
                                                handleSubmit(values, schema.name, schema.extended, schema);
                                            } }
                                        >
                                            { checkSchemaType(schema.name, "country") ? (
                                                <Field
                                                    autoFocus={ true }
                                                    label=""
                                                    name={ schema.name }
                                                    placeholder={ t("myAccount:components.profile.forms." +
                                                    "countryChangeForm.inputs.country.placeholder") }
                                                    required={ schema.required }
                                                    requiredErrorMessage={ t(
                                                        "myAccount:components.profile.forms.generic.inputs.validations.empty",
                                                        {
                                                            fieldName
                                                        }
                                                    ) }
                                                    type="dropdown"
                                                    children={ countryList ? countryList.map(list => {
                                                        return {
                                                            "data-testid": `${testId}-` + list.value as string,
                                                            key: list.key as string,
                                                            text: list.text as string,
                                                            value: list.value as string,
                                                            flag: list.flag
                                                        };
                                                    }) : [] }
                                                    value={ resolveProfileInfoSchemaValue(schema) }
                                                    disabled={ false }
                                                    clearable={ !schema.required }
                                                    search
                                                    selection
                                                    fluid
                                                />
                                            ) : (
                                                <Field
                                                    autoFocus={ true }
                                                    label=""
                                                    name={ schema.name }
                                                    placeholder={ innerPlaceholder }
                                                    required={ schema.required }
                                                    requiredErrorMessage={ t(
                                                        "myAccount:components.profile.forms.generic.inputs.validations.empty",
                                                        {
                                                            fieldName
                                                        }
                                                    ) }
                                                    type="text"
                                                    validation={ (value: string, validation: Validation) => {
                                                        if (!RegExp(schema.regEx).test(value)) {
                                                            validation.isValid = false;
                                                            if (checkSchemaType(schema.name, "emails")) {
                                                                validation.errorMessages.push(t(
                                                                    "myAccount:components.profile.forms.emailChangeForm." +
                                                                "inputs.email.validations.invalidFormat"
                                                                ));
                                                            } else if (checkSchemaType(schema.name, ProfileConstants.
                                                                SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS"))) {
                                                                validation.errorMessages.push(t(
                                                                    profileConfig?.attributes?.
                                                                        getRegExpValidationError(
                                                                            ProfileConstants.SCIM2_SCHEMA_DICTIONARY
                                                                                .get("PHONE_NUMBERS")
                                                                        ), 
                                                                    {
                                                                        fieldName
                                                                    }
                                                                )
                                                                );
                                                            } else if (checkSchemaType(schema.name,
                                                                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB"))) {
                                                                validation.errorMessages.push(t(
                                                                    "myAccount:components.profile.forms.dateChangeForm." +
                                                                "inputs.date.validations.invalidFormat", { fieldName }
                                                                ));
                                                            } else {
                                                                validation.errorMessages.push(
                                                                    t(
                                                                        "myAccount:components.profile.forms." +
                                                                    "generic.inputs.validations.invalidFormat",
                                                                        {
                                                                            fieldName
                                                                        }
                                                                    )
                                                                );
                                                            }
                                                        // Validate date format and the date is before the current date
                                                        } else if(checkSchemaType(schema.name,
                                                            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB"))){
                                                            if (!moment(value, "YYYY-MM-DD",true).isValid()) {
                                                                validation.isValid = false;
                                                                validation.errorMessages
                                                                    .push(t("myAccount:components.profile.forms."
                                                                    + "dateChangeForm.inputs.date.validations."
                                                                    + "invalidFormat", {
                                                                        field: fieldName
                                                                    }));
                                                            } else {
                                                                if (moment().isBefore(value)) {
                                                                    validation.isValid = false;
                                                                    validation.errorMessages
                                                                        .push(t("myAccount:components.profile.forms."
                                                                        + "dateChangeForm.inputs.date.validations."
                                                                        + "futureDateError", {
                                                                            field: fieldName
                                                                        }))
                                                                }
                                                            }
                                                        }
                                                    } }
                                                    value={ resolveProfileInfoSchemaValue(schema) }
                                                    maxLength={ schema.name === "emails" ? 50 : 30 }
                                                />
                                            )
                                            }
                                            <Field
                                                hidden={ true }
                                                type="divider"
                                            />
                                            <Form.Group>
                                                <Field
                                                    size="small"
                                                    type="submit"
                                                    value={ t("common:save").toString() }
                                                    data-testid={ `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-save-button` }
                                                />
                                                <Field
                                                    className="link-button"
                                                    onClick={ () => {
                                                        dispatch(setActiveForm(null));
                                                    } }
                                                    size="small"
                                                    type="button"
                                                    value={ t("common:cancel").toString() }
                                                    data-testid={ `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-cancel-button` }
                                                />
                                            </Form.Group>
                                        </ Forms>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </EditSection >
                    )
            );
        } else {
            const fieldName = t("myAccount:components.profile.fields." + schema.name.replace(".", "_"),
                { defaultValue: schema.displayName }
            );

            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 3 }>
                        < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                            <List.Content>
                                {
                                    !commonConfig.userProfilePage.showEmail &&  fieldName.toLowerCase() === "username"
                                        ? fieldName + "(Email)"
                                        : fieldName
                                }
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <List.Content>
                                <List.Description>
                                    {
                                        isProfileInfoLoading || profileSchemaLoader
                                            ? (
                                                <Placeholder><Placeholder.Line /></Placeholder>
                                            )
                                            : profileInfo.get(schema.name)
                                                ? (
                                                    schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY
                                                        .get("EMAILS") && isEmailPending
                                                        ? (
                                                            <>
                                                                <p>
                                                                    {
                                                                        profileInfo.get(schema.name)
                                                                    }
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
                                                                </p>
                                                            </>
                                                        )
                                                        : resolveProfileInfoSchemaValue(schema)
                                                )
                                                : (
                                                    !(CommonUtils.isProfileReadOnly(isReadOnlyUser)) &&
                                                schema.mutability !== ProfileConstants.READONLY_SCHEMA ?
                                                        (
                                                            <a
                                                                className="placeholder-text"
                                                                tabIndex={ 0 }
                                                                onKeyPress={ (e) => {
                                                                    if (e.key === "Enter") {
                                                                        dispatch(
                                                                            setActiveForm(
                                                                                CommonConstants.PERSONAL_INFO + schema.name
                                                                            )
                                                                        );
                                                                    }
                                                                } }
                                                                onClick={ () => {
                                                                    dispatch(
                                                                        setActiveForm(
                                                                            CommonConstants.PERSONAL_INFO + schema.name
                                                                        )
                                                                    );
                                                                } }
                                                                data-testid={ `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-placeholder` }
                                                            >
                                                                { t("myAccount:components.profile.forms.generic." +
                                                                "inputs.placeholder",
                                                                {
                                                                    fieldName: fieldName.toLowerCase()
                                                                } )
                                                                }
                                                            </a>
                                                        ) : null
                                                )
                                    }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column
                            mobile={ 2 }
                            tablet={ 2 }
                            computer={ 2 }
                            className={
                                window.innerWidth > Responsive.onlyTablet.minWidth ? "last-column" : ""
                            }
                        >
                            <List.Content floated="right">
                                { !CommonUtils.isProfileReadOnly(isReadOnlyUser)
                                && schema.mutability !== ProfileConstants.READONLY_SCHEMA
                                && schema.name !== ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME")
                                && !isEmpty(profileInfo.get(schema.name))
                                && hasRequiredScopes(featureConfig?.personalInfo,
                                    featureConfig?.personalInfo?.scopes?.update, allowedScopes)
                                    ? (
                                        < Popup
                                            trigger={
                                                (
                                                    <Icon
                                                        link={ true }
                                                        className="list-icon"
                                                        size="small"
                                                        color="grey"
                                                        tabIndex={ 0 }
                                                        onKeyPress={ (e) => {
                                                            if (e.key === "Enter") {
                                                                dispatch(
                                                                    setActiveForm(
                                                                        CommonConstants.PERSONAL_INFO + schema.name
                                                                    )
                                                                );
                                                            }
                                                        } }
                                                        onClick={
                                                            () => dispatch(
                                                                setActiveForm(
                                                                    CommonConstants.PERSONAL_INFO + schema.name
                                                                )
                                                            )
                                                        }
                                                        name={ !isEmpty(profileInfo.get(schema.name))
                                                            ? "pencil alternate"
                                                            : null }
                                                        data-testid={ `${testId}-schema-mobile-editing-section-${schema.name.replace(".", "-")}-edit-button` }
                                                    />
                                                )
                                            }
                                            position="top center"
                                            content={ !isEmpty(profileInfo.get(schema.name))
                                                ? t("common:edit")
                                                : "" }
                                            inverted={ true }
                                        />
                                    )
                                    : null }
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            );
        }
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param {<HTMLButtonElement>} e - Event.
     * @param {string} url - Selected image URL.
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
            .catch((error) => {
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
     * @return {any}
     */
    const renderAvatar = () => (
        <>
            <UserAvatar
                data-testid={ `${testId}-user-avatar` }
                editable={ !isProfileUrlReadOnly() }
                showGravatarLabel
                size="tiny"
                tabIndex={ 0 }
                onKeyPress={ (e) => {
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
                                        content: t("myAccount:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.content"),
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
     * Check whether the profile url is readonly.
     *
     * @return {boolean}
     */
    const isProfileUrlReadOnly = (): boolean => {
        return !(!CommonUtils.isProfileReadOnly(isReadOnlyUser)
            && hasRequiredScopes(featureConfig?.personalInfo,featureConfig?.personalInfo?.scopes?.update, allowedScopes)
            && profileSchema?.some((schema: ProfileSchema) => {
                return schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL")
                    && schema.mutability !== ProfileConstants.READONLY_SCHEMA;
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

    return (
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
            <List divided={ true } verticalAlign="middle"
                  className="main-content-inner"
                  data-testid={ `${testId}-schema-list` }>
                { /*Removed User ID field from profile.*/ }
                { /*Uncomment if User ID needs to be added back.*/ }
                { /*{*/ }
                { /*    isProfileInfoLoading || profileSchemaLoader*/ }
                { /*        ? null*/ }
                { /*        : (*/ }
                { /*        profileSchema && (*/ }
                { /*            <List.Item key={ profileSchema.length } className="inner-list-item"*/ }
                { /*                       data-testid={ `${testId}-schema-list-item` }>*/ }
                { /*                <Grid padded={ true }>*/ }
                { /*                    <Grid.Row columns={ 3 }>*/ }
                { /*                        < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">*/ }
                { /*                            <List.Content> User Id </List.Content>*/ }
                { /*                        </Grid.Column>*/ }
                { /*                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>*/ }
                { /*                            <List.Content>*/ }
                { /*                                <List.Description>*/ }
                { /*                                    { userId }*/ }
                { /*                                </List.Description>*/ }
                { /*                            </List.Content>*/ }
                { /*                        </Grid.Column>*/ }
                { /*                    </Grid.Row>*/ }
                { /*                </Grid>*/ }
                { /*            </List.Item>*/ }
                { /*        )*/ }
                { /*    )*/ }
                { /*}*/ }
                {
                    profileSchema && profileSchema.map((schema: ProfileSchema, index: number) => {
                        if (!(schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("GROUPS")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("USER_SOURCE_ID")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("IDP_TYPE")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("LOCAL_CREDENTIAL_EXISTS")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("RESROUCE_TYPE")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("EXTERNAL_ID")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_DATA")
                            || (!commonConfig.userProfilePage.showEmail &&
                                schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("EMAILS"))
                        )) {
                            return (
                                <>
                                    {
                                        showMobileUpdateWizard && checkSchemaType(schema.name, "mobile")
                                            ? (
                                                < MobileUpdateWizard
                                                    data-testid={ `${testId}-mobile-update-wizard` }
                                                    onAlertFired={ onAlertFired }
                                                    closeWizard={ () =>
                                                        handleCloseMobileUpdateWizard()
                                                    }
                                                    wizardOpen={ true }
                                                    currentMobileNumber={ profileInfo.get(schema.name) }
                                                    isMobileRequired={ schema.required }
                                                />
                                            )
                                            : null
                                    }
                                    {
                                        !isEmpty(profileInfo.get(schema.name)) ||
                                        (!CommonUtils.isProfileReadOnly(isReadOnlyUser) 
                                            && (schema.mutability !== ProfileConstants.READONLY_SCHEMA)
                                            && hasRequiredScopes(featureConfig?.personalInfo,
                                                featureConfig?.personalInfo?.scopes?.update, allowedScopes))
                                            ? (
                                                <List.Item key={ index } className="inner-list-item"
                                                           data-testid={ `${testId}-schema-list-item` }>
                                                    { generateSchemaForm(schema) }
                                                </List.Item>
                                            ) : null
                                    }
                                </>
                            );
                        }
                    })
                }
            </List>
        </SettingsSection>
    );
};

/**
 * Default properties for the {@link Profile} component.
 * See type definitions in {@link ProfileProps}
 */
Profile.defaultProps = {
    "data-testid": "profile"
};
