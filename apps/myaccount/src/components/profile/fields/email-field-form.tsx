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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Paper from "@oxygen-ui/react/Paper";
import Select from "@oxygen-ui/react/Select";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { ProfileConstants } from "@wso2is/core/constants";
import { PatchOperationRequest } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { Popup, Button as SemanticButton, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import MultiValueDeleteConfirmationModal from "./multi-value-delete-confirmation-modal";
import TextFieldForm from "./text-field-form";
import { SCIMConfigs as SCIMExtensionConfigs } from "../../../extensions/configs/scim";
import { AuthStateInterface } from "../../../models/auth";
import { MultiValue, ProfilePatchOperationValue, ProfileSchema } from "../../../models/profile";
import { EmailFieldFormPropsInterface } from "../../../models/profile-ui";
import { AppState } from "../../../store";
import { EditSection } from "../../shared/edit-section";

import "./field-form.scss";

interface SortedEmailAddress {
    value: string;
    isPrimary: boolean;
    isVerified?: boolean;
    isVerificationPending?: boolean;
}

const EmailFieldForm: FunctionComponent<EmailFieldFormPropsInterface> = ({
    fieldSchema: schema,
    fieldLabel,
    initialValue,
    profileInfo,
    isEditable,
    isActive,
    isRequired,
    isLoading,
    isUpdating,
    onEditClicked,
    onEditCancelClicked,
    isVerificationEnabled,
    triggerUpdate,
    setIsProfileUpdating,
    ["data-componentid"]: testId = "email-field-form"
}: EmailFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);

    const verifiedEmailAddresses: string[] = profileInfo.get(ProfileConstants
        .SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES"))?.split(",") ?? [];
    const primaryEmailAddress: string = profileInfo.get(ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS"));
    const emailAddressesList: string[] = isEmpty(initialValue) ? [] : initialValue?.split(",");

    const [ selectedEmailAddress, setSelectedEmailAddress ] = useState<SortedEmailAddress>();

    const primaryEmailSchema: ProfileSchema = useMemo(
        () =>
            profileDetails?.profileSchemas?.find(
                (schema: ProfileSchema) =>
                    schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")
            ),
        [ profileDetails?.profileSchemas ]
    );

    // There can be situations where the primary email address is verified
    // but not added to the verifiedEmailAddresses list.
    // In that scenario, the "urn:scim:wso2:schema:emailVerified" needs to be checked.
    const isPrimaryEmailVerified: boolean = String(profileDetails?.profileInfo
        ?.[SCIMExtensionConfigs?.scim?.systemSchema]
        ?.[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_VERIFIED")]) === "true";
    // Merge the verified primary email address.
    const mergedVerifiedEmailAddresses: string[] = useMemo(() => {
        if (
            !isEmpty(primaryEmailAddress) &&
            !verifiedEmailAddresses?.includes(primaryEmailAddress) &&
            isPrimaryEmailVerified
        ) {
            return [ ...verifiedEmailAddresses, primaryEmailAddress ];
        } else {
            return verifiedEmailAddresses;
        }
    }, [ primaryEmailAddress, verifiedEmailAddresses, isPrimaryEmailVerified ]);

    const isVerificationPending = (emailAddress: string): boolean => {
        return profileInfo.get("pendingEmails.value") === emailAddress;
    };

    const isVerified = (emailAddress: string): boolean => {
        return mergedVerifiedEmailAddresses?.includes(emailAddress);
    };

    const isPrimary = (emailAddress: string): boolean => {
        return primaryEmailAddress === emailAddress;
    };

    /**
     * Brings the primary email address to the top of the list.
     * Calculate the verification status for each email address.
     *
     * @returns A list of objects containing the email address and its verification status.
     */
    const sortedEmailAddressesList: SortedEmailAddress[] = useMemo(() => {
        const _sortedEmailAddressesList: SortedEmailAddress[] = [];
        const _emailAddressesList: string[] = [ ...emailAddressesList ];

        // Handles the case where switching from single email to multiple emails.
        if (!isEmpty(primaryEmailAddress) && !_emailAddressesList.includes(primaryEmailAddress)) {
            _emailAddressesList.push(primaryEmailAddress);
        }

        for (const emailAddress of _emailAddressesList) {
            const _emailAddress: SortedEmailAddress = {
                isPrimary: isPrimary(emailAddress),
                isVerificationPending: false,
                isVerified: false,
                value: emailAddress
            };

            if (isVerificationEnabled) {
                _emailAddress.isVerified = isVerified(emailAddress);
                _emailAddress.isVerificationPending = isVerificationPending(emailAddress);
            }

            if (_emailAddress.isPrimary) {
                _sortedEmailAddressesList.unshift(_emailAddress);
            } else {
                _sortedEmailAddressesList.push(_emailAddress);
            }
        }

        return _sortedEmailAddressesList;
    }, [ emailAddressesList ]);

    const renderPendingVerificationIcon= (): ReactElement => {

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

    const renderVerifiedIcon= (): ReactElement => {

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

    const getMultiEmailMenuItems = (): ReactElement[] => {
        const menuItems: ReactElement[] = [];

        for (const [ index, emailAddress ] of sortedEmailAddressesList.entries()) {
            menuItems.push(
                <MenuItem key={ emailAddress.value } value={ emailAddress.value } className="read-only-menu-item">
                    <div className="dropdown-row">
                        <Typography
                            className="dropdown-label"
                            data-componentid={ `${testId}-readonly-section-${schema.name.replace(
                                ".",
                                "-"
                            )}-value-${index}` }
                        >
                            { emailAddress.value }
                        </Typography>
                        { isVerificationEnabled && emailAddress.isVerificationPending && (
                            <div
                                className="verified-icon"
                                data-componentid={
                                    `${testId}-readonly-section-${schema.name.replace(".", "-")}` +
                                    `-pending-email-icon-${index}`
                                }
                            >
                                { renderPendingVerificationIcon() }
                            </div>
                        ) }
                        { isVerificationEnabled && emailAddress.isVerified && (
                            <div
                                className="verified-icon"
                                data-componentid={
                                    `${testId}-readonly-section-${schema.name.replace(".", "-")}` +
                                    `-verified-icon-${index}`
                                }
                            >
                                { renderVerifiedIcon() }
                            </div>
                        ) }
                        { emailAddress.isPrimary && (
                            <div
                                className="verified-icon"
                                data-componentid={
                                    `${testId}-readonly-section-${schema.name.replace(".", "-")}` +
                                    `-primary-icon-${index}`
                                }
                            >
                                <Chip label={ t("common:primary") } size="small" />
                            </div>
                        ) }
                    </div>
                </MenuItem>
            );
        }

        return menuItems;
    };

    const renderFieldContent = (): ReactElement => {
        if (schema.extended && schema.multiValued) {
            return (
                <Select
                    className="multi-attribute-dropdown"
                    value={ sortedEmailAddressesList[0]?.value }
                    disableUnderline
                    variant="standard"
                    data-componentid={ `${testId}-${schema.name.replace(".", "-")}-readonly-dropdown` }
                >
                    { getMultiEmailMenuItems() }
                </Select>
            );
        }

        return (
            <List.Content>
                <List.Description className="with-max-length">
                    { initialValue }
                    { isVerificationPending(initialValue) && renderPendingVerificationIcon() }
                </List.Description>
            </List.Content>
        );
    };

    const validateField = (value: string): string | undefined => {
        let regEx: string = schema.regEx;

        // Validate multi-valued email addresses
        // using the schema of the primary attribute for individual value validation.
        if (schema.extended && schema.multiValued) {
            regEx = primaryEmailSchema?.regEx;
        }

        if (!isEmpty(regEx) && !RegExp(regEx).test(value)) {
            return t("myAccount:components.profile.forms.emailChangeForm.inputs.email.validations.invalidFormat");
        }

        return undefined;
    };

    const handleVerifyEmail = (emailAddress: string): void => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        data.Operations.push({
            op: "replace",
            value: {
                [schema.schemaId] : {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                        "VERIFIED_EMAIL_ADDRESSES"
                    )]: [ ...mergedVerifiedEmailAddresses, emailAddress ]
                }
            }
        });

        triggerUpdate(data);
    };

    const handleMakeEmailPrimary = (emailAddress: string): void => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        const updatedEmailsList: (string | MultiValue)[] = [];

        for (const emailAddress of profileDetails?.profileInfo?.emails) {
            if (typeof emailAddress === "object") {
                updatedEmailsList.push(emailAddress);
            }
        }
        updatedEmailsList.push(emailAddress);

        data.Operations.push({
            op: "replace",
            value: {
                [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")]: updatedEmailsList
            }
        });

        if (isVerificationEnabled) {
            data.Operations.push({
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                        "VERIFIED_EMAIL_ADDRESSES"
                    )]: mergedVerifiedEmailAddresses
                }
            });
        }

        triggerUpdate(data);
    };

    const handleAddEmailAddress = (values: Record<string, string>): void => {
        setIsProfileUpdating(true);

        const emailAddress: string = values["emails"];
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (schema.extended && schema.multiValued) {
            // In case of switching from single-valued to multi-valued
            // `sortedEmailAddressesList` will contain the single valued email address as well.
            // This also needs to be added to the multi-valued attribute.
            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [schema.name] : [
                            ...sortedEmailAddressesList.map((emailAddress: SortedEmailAddress) => emailAddress.value),
                            emailAddress
                        ]
                    }
                }
            });
        }

        // In case of switching from single-valued to multi-valued
        // `mergedVerifiedEmailAddresses` will contain the verified primary email address.
        if (isVerificationEnabled && !isEmpty(mergedVerifiedEmailAddresses)) {
            data.Operations.push({
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                        "VERIFIED_EMAIL_ADDRESSES"
                    )]: mergedVerifiedEmailAddresses
                }
            });
        }

        triggerUpdate(data);
    };

    /**
     * Handles the deletion of an email address.
     */
    const handleEmailAddressDelete = () => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        const updatedEmailAddressesList: string[] = sortedEmailAddressesList
            .filter((emailAddress: SortedEmailAddress) => emailAddress.value !== selectedEmailAddress.value)
            .map((emailAddress: SortedEmailAddress) => emailAddress.value);

        data.Operations.push({
            op: "replace",
            value: {
                [schema.schemaId] : {
                    [schema.name] : updatedEmailAddressesList
                }
            }
        });

        if (selectedEmailAddress.isPrimary) {
            const updatedEmailsList: (string | MultiValue)[] = [];

            for (const emailAddress of profileDetails?.profileInfo?.emails) {
                if (typeof emailAddress === "string") {
                    updatedEmailsList.push("");
                } else {
                    updatedEmailsList.push(emailAddress);
                }
            }

            data.Operations.push({
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")]: updatedEmailsList
                }
            });
        }

        if (isVerificationEnabled && selectedEmailAddress.isVerified) {
            const updatedVerifiedEmailAddressesList: string[] = mergedVerifiedEmailAddresses.filter(
                (emailAddress: string) => emailAddress !== selectedEmailAddress.value
            );

            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                            "VERIFIED_EMAIL_ADDRESSES"
                        )] : updatedVerifiedEmailAddressesList
                    }
                }
            });
        }

        triggerUpdate(data);
    };

    const handleSingleEmailUpdate = (_: string, value: string): void => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        const updatedEmailsList: (string | MultiValue)[] = [];

        for (const emailAddress of profileDetails?.profileInfo?.emails) {
            if (typeof emailAddress === "object") {
                updatedEmailsList.push(emailAddress);
            }
        }
        updatedEmailsList.push(value);

        data.Operations.push({
            op: "replace",
            value: {
                [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")]: updatedEmailsList
            }
        });

        data.Operations.push({
            op: "replace",
            value: {
                [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA] : {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFY_EMAIL")] : true
                }
            }
        });

        triggerUpdate(data);
    };

    if (isActive && schema.schemaUri !== SCIMExtensionConfigs.scimSystemSchema.emailAddresses) {
        return (
            <TextFieldForm
                fieldSchema={ schema }
                initialValue={ initialValue }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ testId }
                handleSubmit={ handleSingleEmailUpdate }
            />
        );
    }

    const renderEmailAddressesTable = (): ReactElement => {
        return (
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
                    aria-label="multi-attribute-value-table"
                >
                    <TableBody>
                        { sortedEmailAddressesList?.map(
                            (emailAddress: SortedEmailAddress, index: number) => (
                                <TableRow key={ index } className="multi-value-table-data-row">
                                    <TableCell align="left">
                                        <div className="table-c1">
                                            <Typography
                                                className="c1-value"
                                                data-componentid={
                                                    `${testId}-editing-section-${
                                                        schema.name.replace(".", "-")
                                                    }-value-${index}`
                                                }
                                            >
                                                { emailAddress.value }
                                            </Typography>
                                            {
                                                isVerificationEnabled &&
                                                emailAddress.isVerificationPending && (
                                                    <div
                                                        className="verified-icon"
                                                        data-componentid={
                                                            `${testId}-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-pending-email-${index}`
                                                        }
                                                    >
                                                        { renderPendingVerificationIcon() }
                                                    </div>
                                                )
                                            }
                                            {
                                                isVerificationEnabled &&
                                                emailAddress.isVerified && (
                                                    <div
                                                        className="verified-icon"
                                                        data-componentid={
                                                            `${testId}-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-verified-icon-${index}`
                                                        }
                                                    >
                                                        { renderVerifiedIcon() }
                                                    </div>
                                                )
                                            }
                                            {
                                                emailAddress.isPrimary && (
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
                                                hidden={ !isVerificationEnabled ||
                                                    emailAddress.isVerified }
                                                onClick={
                                                    () => handleVerifyEmail(emailAddress.value) }
                                                disabled={ isLoading }
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
                                                hidden={ emailAddress.isPrimary ||
                                                    (isVerificationEnabled &&
                                                        !emailAddress.isVerified)
                                                }
                                                onClick={
                                                    () => handleMakeEmailPrimary(emailAddress.value)
                                                }
                                                disabled={ isLoading }
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
                                                onClick={ () => {
                                                    setSelectedEmailAddress(emailAddress);
                                                } }
                                                disabled={ isLoading ||
                                                    (emailAddress.isPrimary &&
                                                        primaryEmailSchema?.required) ||
                                                    (isRequired &&
                                                        sortedEmailAddressesList?.length === 1) }
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
        );
    };

    if (isActive) {
        return (
            <EditSection data-testid={ "profile-schema-editing-section" }>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
                        <Grid.Column width={ 12 }>
                            <FinalForm
                                onSubmit={ handleAddEmailAddress }
                                render={ ({ handleSubmit, hasValidationErrors }: FormRenderProps) => {
                                    return (
                                        <form
                                            onSubmit={ handleSubmit }
                                            className="multi-valued-field-form"
                                            data-componentid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                        >
                                            <FinalFormField
                                                component={ TextFieldAdapter }
                                                ariaLabel={ fieldLabel }
                                                name="emails"
                                                type="text"
                                                placeholder={
                                                    t("myAccount:components.profile.forms.generic.inputs.placeholder",
                                                        { fieldName: fieldLabel.toLowerCase() }) }
                                                validate={ validateField }
                                                maxLength={ primaryEmailSchema?.maxLength
                                                    ?? ProfileConstants.CLAIM_VALUE_MAX_LENGTH }
                                                readOnly={
                                                    !isEditable ||
                                                    isUpdating ||
                                                    sortedEmailAddressesList?.length === ProfileConstants
                                                        .MAX_EMAIL_ADDRESSES_ALLOWED
                                                }
                                                required={ isRequired }
                                                endAdornment={ (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="Add">
                                                            <IconButton
                                                                data-componentid={ `${ testId }-multivalue-add-icon` }
                                                                size="large"
                                                                disabled={
                                                                    isUpdating ||
                                                                    hasValidationErrors ||
                                                                    sortedEmailAddressesList.length >= ProfileConstants
                                                                        .MAX_EMAIL_ADDRESSES_ALLOWED
                                                                }
                                                                onClick={ handleSubmit }
                                                            >
                                                                <PlusIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ) }
                                                data-componentid={
                                                    `${testId}-editing-section-${ schema.name.replace(".", "-") }-field`
                                                }
                                                data-testid={
                                                    `${testId}-editing-section-${ schema.name.replace(".", "-") }-field`
                                                }
                                            />

                                            { renderEmailAddressesTable() }

                                            <SemanticButton
                                                type="button"
                                                onClick={ onEditCancelClicked }
                                                data-testid={
                                                    `${testId}-schema-mobile-editing-section-${
                                                        schema.name.replace(".", "-")
                                                    }-cancel-button`
                                                }
                                            >
                                                { t("common:cancel") }
                                            </SemanticButton>

                                        </form>
                                    );
                                } }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                { selectedEmailAddress && (
                    <MultiValueDeleteConfirmationModal
                        selectedAttributeInfo={ { schema, value: selectedEmailAddress.value } }
                        onClose={ () => setSelectedEmailAddress(undefined) }
                        onConfirm={ handleEmailAddressDelete }
                    />
                ) }
            </EditSection>
        );
    }

    return (
        <Grid padded={ true }>
            <Grid.Row columns={ 3 }>
                <Grid.Column mobile={ 6 } computer={ 4 } className="first-column">
                    <List.Content className="vertical-align-center">{ fieldLabel }</List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 8 } computer={ 10 }>
                    <List.Content>
                        <List.Description className="with-max-length">
                            { isEmpty(sortedEmailAddressesList) ? (
                                <EmptyValueField schema={ schema } fieldLabel={ fieldLabel } />
                            ) : (
                                renderFieldContent()
                            ) }
                        </List.Description>
                    </List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 2 } className={ `${!isMobileViewport ? "last-column" : ""}` }>
                    <List.Content floated="right" className="vertical-align-center">
                        { isEditable && (
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
                                                onEditClicked();
                                            }
                                        } }
                                        onClick={ onEditClicked }
                                        name="pencil alternate"
                                        data-testid={ `profile-schema-mobile-editing-section-${schema.name.replace(
                                            ".",
                                            "-"
                                        )}-edit-button` }
                                    />)
                                }
                                position="top center"
                                content={ t("common:edit") }
                                inverted={ true }
                            />
                        ) }
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default EmailFieldForm;
