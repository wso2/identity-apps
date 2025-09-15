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
import { AlertLevels, PatchOperationRequest } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { Popup, Button as SemanticButton, useMediaContext } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { Dispatch, FunctionComponent, ReactElement, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import MultiValueDeleteConfirmationModal from "./multi-value-delete-confirmation-modal";
import { updateProfileInfo } from "../../../api/profile";
import { profileConfig as profileExtensionConfig } from "../../../extensions/configs/profile";
import { SCIMConfigs as SCIMExtensionConfigs } from "../../../extensions/configs/scim";
import { AuthStateInterface } from "../../../models/auth";
import { MultiValue, ProfilePatchOperationValue, ProfileSchema } from "../../../models/profile";
import { MultiMobileFieldFormPropsInterface } from "../../../models/profile-ui";
import { AppState } from "../../../store";
import { getProfileInformation } from "../../../store/actions/authenticate";
import { addAlert, setActiveForm } from "../../../store/actions/global";
import { EditSection } from "../../shared/edit-section";
import MobileUpdateWizardV2 from "../../shared/mobile-update-wizard-v2/mobile-update-wizard-v2";

import "./field-form.scss";

interface SortedMobileNumber {
    value: string;
    isPrimary: boolean;
    isVerified?: boolean;
}

const MultiMobileFieldForm: FunctionComponent<MultiMobileFieldFormPropsInterface> = ({
    fieldSchema: schema,
    flattenedProfileSchema,
    fieldLabel,
    initialValue,
    primaryMobileNumber,
    verifiedMobileNumbers,
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
    ["data-componentid"]: testId = "mobile-field-form"
}: MultiMobileFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();
    const dispatch: Dispatch<any> = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);

    const mobileNumbersList: string[] = initialValue ?? [];

    const [ selectedMobileNumber, setSelectedMobileNumber ] = useState<SortedMobileNumber>();
    const [ isMobileUpdateModalOpen, setIsMobileUpdateModalOpen ] = useState<boolean>(false);

    const primaryMobileSchema: ProfileSchema = useMemo(
        () =>
            flattenedProfileSchema?.find(
                (schema: ProfileSchema) =>
                    schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE")
            ),
        [ flattenedProfileSchema ]
    );

    // There can be situations where the primary mobile number is verified
    // but not added to the verified list.
    // In that scenario, the "urn:scim:wso2:schema:phoneVerified" needs to be checked.
    const isPrimaryMobileVerified: boolean = String(profileDetails?.profileInfo
        ?.[SCIMExtensionConfigs?.scim?.systemSchema]
        ?.[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_VERIFIED")]) === "true";

    // Merge the verified primary mobile number with the verified list.
    const mergedVerifiedMobileNumbers: string[] = useMemo(() => {
        if (
            !isEmpty(primaryMobileNumber) &&
            !verifiedMobileNumbers?.includes(primaryMobileNumber) &&
            isPrimaryMobileVerified
        ) {
            return [ ...(verifiedMobileNumbers ?? []), primaryMobileNumber ];
        } else {
            return verifiedMobileNumbers;
        }
    }, [ primaryMobileNumber, verifiedMobileNumbers, isPrimaryMobileVerified ]);

    const isVerified = (mobileNumber: string): boolean => {
        return mergedVerifiedMobileNumbers?.includes(mobileNumber);
    };

    const isPrimary = (mobileNumber: string): boolean => {
        return primaryMobileNumber === mobileNumber;
    };

    /**
     * Brings the primary mobile number to the top of the list.
     * Calculate the verification status for each mobile number.
     *
     * @returns A list of objects containing the mobile number and its verification status.
     */
    const sortedMobileNumbersList: SortedMobileNumber[] = useMemo(() => {
        const _sortedMobileNumbersList: SortedMobileNumber[] = [];
        const _mobileNumbersList: string[] = [ ...mobileNumbersList ];

        // Handles the case where switching from single mobile number to multiple mobile numbers.
        if (!isEmpty(primaryMobileNumber) && !_mobileNumbersList.includes(primaryMobileNumber)) {
            _mobileNumbersList.push(primaryMobileNumber);
        }

        for (const mobileNumber of _mobileNumbersList) {
            const _mobileNumber: SortedMobileNumber = {
                isPrimary: isPrimary(mobileNumber),
                isVerified: false,
                value: mobileNumber
            };

            if (isVerificationEnabled) {
                _mobileNumber.isVerified = isVerified(mobileNumber);
            }

            if (_mobileNumber.isPrimary) {
                _sortedMobileNumbersList.unshift(_mobileNumber);
            } else {
                _sortedMobileNumbersList.push(_mobileNumber);
            }
        }

        return _sortedMobileNumbersList;
    }, [ mobileNumbersList ]);

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

    const getMultiMobileMenuItems = (): ReactElement[] => {
        const menuItems: ReactElement[] = [];

        for (const [ index, mobileNumber ] of sortedMobileNumbersList.entries()) {
            menuItems.push(
                <MenuItem key={ mobileNumber.value } value={ mobileNumber.value } className="read-only-menu-item">
                    <div className="dropdown-row">
                        <Typography
                            className="dropdown-label"
                            data-componentid={ `${testId}-readonly-section-${schema.name.replace(
                                ".",
                                "-"
                            )}-value-${index}` }
                        >
                            { mobileNumber.value }
                        </Typography>
                        { isVerificationEnabled && mobileNumber.isVerified && (
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
                        { mobileNumber.isPrimary && (
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
                    value={ sortedMobileNumbersList[0]?.value }
                    disableUnderline
                    variant="standard"
                    data-componentid={ `${testId}-${schema.name.replace(".", "-")}-readonly-dropdown` }
                >
                    { getMultiMobileMenuItems() }
                </Select>
            );
        }

        return (
            <List.Content>
                <List.Description className="with-max-length">
                    { initialValue }
                </List.Description>
            </List.Content>
        );
    };

    const validateField: (value: string) => string | undefined = useCallback((value: string) => {
        // Check for duplicate mobile numbers.
        if (sortedMobileNumbersList?.some((mobileNumber: SortedMobileNumber) => mobileNumber.value === value)) {
            return t("myAccount:components.profile.forms.generic.inputs.validations.duplicate", {
                fieldName: fieldLabel
            });
        }

        let regEx: string = schema.regEx;

        // Validate multi-valued mobile numbers
        // using the schema of the primary attribute for individual value validation.
        if (schema.extended && schema.multiValued) {
            regEx = primaryMobileSchema?.regEx;
        }

        if (!isEmpty(regEx) && !RegExp(regEx).test(value)) {
            return t(profileExtensionConfig?.attributes?.getRegExpValidationError(
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")
            ),{ fieldName: fieldLabel } );
        }

        return undefined;
    }, [ sortedMobileNumbersList ]);

    const handleVerifyMobile = (mobileNumber: string): void => {
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
                        "VERIFIED_MOBILE_NUMBERS"
                    )]: [ ...mergedVerifiedMobileNumbers, mobileNumber ]
                }
            }
        });

        updateProfileInfo(data as unknown as Record<string, unknown>)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    dispatch(addAlert({
                        description: t(
                            "myAccount:components.profile.notifications.verifyMobile.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "myAccount:components.profile.notifications.verifyMobile.success.message"
                        )
                    }));

                    setIsMobileUpdateModalOpen(true);
                }
            })
            .catch((error: any) => {
                dispatch(addAlert({
                    description: error?.detail ?? t(
                        "myAccount:components.profile.notifications.verifyMobile.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: error?.message ?? t(
                        "myAccount:components.profile.notifications.verifyMobile.genericError.message"
                    )
                }));
            });
    };

    const handleMakeMobilePrimary = (mobileNumber: string): void => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        data.Operations.push({
            op: "add",
            value: {
                [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [
                    { type: "mobile", value: mobileNumber }
                ]
            }
        });

        if (schema.extended && schema.multiValued) {
            // In case of switching from single-valued to multi-valued
            // `sortedMobileNumbersList` will contain the single valued mobile number as well.
            // This also needs to be added to the multi-valued attribute.
            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [schema.name] : [
                            ...sortedMobileNumbersList.map(
                                (mobileNumber: SortedMobileNumber) => mobileNumber.value)
                        ]
                    }
                }
            });
        }

        if (isVerificationEnabled) {
            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                            "VERIFIED_MOBILE_NUMBERS"
                        )]: mergedVerifiedMobileNumbers
                    }
                }
            });
        }

        triggerUpdate(data);
    };

    const handleAddMobileNumber = (values: Record<string, string>): void => {
        setIsProfileUpdating(true);

        const mobileNumber: string = values["mobileNumbers"];
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        // Set the first mobile number as primary.
        if (sortedMobileNumbersList.length === 0) {
            data.Operations.push({
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [
                        { type: "mobile", value: mobileNumber }
                    ]
                }
            });
        }

        if (schema.extended && schema.multiValued) {
            // In case of switching from single-valued to multi-valued
            // `sortedMobileNumbersList` will contain the single valued mobile number as well.
            // This also needs to be added to the multi-valued attribute.
            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [schema.name] : [
                            ...sortedMobileNumbersList.map((mobileNumber: SortedMobileNumber) => mobileNumber.value),
                            mobileNumber
                        ]
                    }
                }
            });
        }

        if (isVerificationEnabled && !isEmpty(mergedVerifiedMobileNumbers)) {
            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                            "VERIFIED_MOBILE_NUMBERS"
                        )]: mergedVerifiedMobileNumbers
                    }
                }
            });
        }

        triggerUpdate(data);
    };

    /**
     * Handles the deletion of a mobile number.
     */
    const handleMobileNumberDelete = () => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        const updatedMobileNumbersList: string[] = sortedMobileNumbersList
            .filter((mobileNumber: SortedMobileNumber) => mobileNumber.value !== selectedMobileNumber.value)
            .map((mobileNumber: SortedMobileNumber) => mobileNumber.value);

        data.Operations.push({
            op: "replace",
            value: {
                [schema.schemaId] : {
                    [schema.name] : updatedMobileNumbersList
                }
            }
        });

        if (selectedMobileNumber.isPrimary) {
            const updatedPhoneNumbersList: MultiValue[] = [];

            for (const phoneNumber of profileDetails?.profileInfo?.phoneNumbers) {
                if (phoneNumber.value === selectedMobileNumber.value) {
                    updatedPhoneNumbersList.push({ ...phoneNumber, value: "" });
                } else {
                    updatedPhoneNumbersList.push(phoneNumber);
                }
            }

            data.Operations.push({
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: updatedPhoneNumbersList
                }
            });
        }

        if (isVerificationEnabled && selectedMobileNumber.isVerified) {
            const updatedVerifiedMobileNumbersList: string[] = mergedVerifiedMobileNumbers.filter(
                (mobileNumber: string) => mobileNumber !== selectedMobileNumber.value
            );

            data.Operations.push({
                op: "replace",
                value: {
                    [schema.schemaId] : {
                        [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
                            "VERIFIED_MOBILE_NUMBERS"
                        )] : updatedVerifiedMobileNumbersList
                    }
                }
            });
        }

        triggerUpdate(data, false);
    };

    const handleMobileUpdateModalClose = (isRevalidate: boolean = false) => {
        setIsMobileUpdateModalOpen(false);
        setIsProfileUpdating(false);

        if (isRevalidate) {
            // Re-fetch the profile information.
            dispatch(getProfileInformation(true));
            dispatch(setActiveForm(null));
        }
    };

    const renderMobileNumbersTable = (): ReactElement => {
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
                    aria-label="multi-attribute value table"
                >
                    <TableBody>
                        { sortedMobileNumbersList?.map(
                            (mobileNumber: SortedMobileNumber, index: number) => (
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
                                                { mobileNumber.value }
                                            </Typography>
                                            {
                                                isVerificationEnabled &&
                                                mobileNumber.isVerified && (
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
                                                mobileNumber.isPrimary && (
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
                                                    mobileNumber.isVerified }
                                                onClick={
                                                    () => handleVerifyMobile(mobileNumber.value) }
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
                                                hidden={ mobileNumber.isPrimary ||
                                                    (isVerificationEnabled &&
                                                        !mobileNumber.isVerified)
                                                }
                                                onClick={
                                                    () => handleMakeMobilePrimary(
                                                        mobileNumber.value)
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
                                                    setSelectedMobileNumber(mobileNumber);
                                                } }
                                                disabled={ isLoading ||
                                                    (mobileNumber.isPrimary &&
                                                        primaryMobileSchema?.required) ||
                                                    (isRequired &&
                                                        sortedMobileNumbersList.length === 1) }
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
                                onSubmit={ handleAddMobileNumber }
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
                                                name="mobileNumbers"
                                                type="text"
                                                placeholder={
                                                    t("myAccount:components.profile.forms.generic.inputs.placeholder",
                                                        { fieldName: fieldLabel.toLowerCase() }) }
                                                validate={ validateField }
                                                maxLength={ primaryMobileSchema?.maxLength
                                                    ?? ProfileConstants.CLAIM_VALUE_MAX_LENGTH }
                                                readOnly={
                                                    !isEditable ||
                                                    isUpdating ||
                                                    sortedMobileNumbersList?.length === ProfileConstants
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
                                                                    sortedMobileNumbersList.length >= ProfileConstants
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

                                            { renderMobileNumbersTable() }

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

                <MobileUpdateWizardV2
                    isOpen={ isMobileUpdateModalOpen }
                    onClose={ handleMobileUpdateModalClose }
                    onCancel={ (isRevalidate: boolean = false) => {
                        setIsMobileUpdateModalOpen(false);
                        setIsProfileUpdating(false);
                        onEditCancelClicked();

                        if (isRevalidate) {
                            // Re-fetch the profile information.
                            dispatch(getProfileInformation(true));
                        }
                    } }
                    data-testid={ `${testId}-mobile-verification-wizard` }
                    initialStep={ 1 }
                    isMobileRequired={ isRequired }
                    isMultiValued
                />

                { selectedMobileNumber && (
                    <MultiValueDeleteConfirmationModal
                        selectedAttributeInfo={ { schema, value: selectedMobileNumber.value } }
                        onClose={ () => setSelectedMobileNumber(undefined) }
                        onConfirm={ handleMobileNumberDelete }
                        data-componentid={ testId }
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
                            { isEmpty(sortedMobileNumbersList) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                    onEditClicked={ onEditClicked }
                                />
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

export default MultiMobileFieldForm;
