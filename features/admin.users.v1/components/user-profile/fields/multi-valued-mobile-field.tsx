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

import TableContainer from "@mui/material/TableContainer";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Paper from "@oxygen-ui/react/Paper";
import Table from "@oxygen-ui/react/Table";
import TableBody from "@oxygen-ui/react/TableBody";
import TableCell from "@oxygen-ui/react/TableCell";
import TableRow from "@oxygen-ui/react/TableRow";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { ProfileConstants } from "@wso2is/core/constants";
import {
    IdentifiableComponentInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { FinalFormField, FormApi } from "@wso2is/form";
import { Popup } from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { useField, useForm } from "react-final-form";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";

import "./multi-valued-field.scss";

/**
 * Sorted mobile number interface.
 */
interface SortedMobileNumber {
    value: string;
    isPrimary: boolean;
    isVerified?: boolean;
    isVerificationPending?: boolean;
}

/**
 * User profile multi-valued mobile field component props interface.
 */
interface MultiValuedMobileFieldPropsInterface extends IdentifiableComponentInterface {
    schema: ProfileSchemaInterface;
    primarySchema: ProfileSchemaInterface;
    primaryMobileNumber: string;
    mobileNumbersList: string[];
    verifiedMobileNumbers: string[];
    verificationPendingMobileNumber: string;
    isVerificationEnabled: boolean;
    isUpdating: boolean;
    isReadOnly: boolean;
    fieldLabel: string;
    maxValueLimit: number;
}

/**
 * User profile multi-valued mobile field component.
 */
const MultiValuedMobileField: FunctionComponent<MultiValuedMobileFieldPropsInterface> = ({
    schema,
    primarySchema: primarySchema,
    primaryMobileNumber,
    mobileNumbersList,
    verifiedMobileNumbers,
    verificationPendingMobileNumber,
    isVerificationEnabled,
    isUpdating,
    isReadOnly,
    fieldLabel,
    maxValueLimit,
    ["data-componentid"]: componentId = "mobile-numbers-field"
}: MultiValuedMobileFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const form: FormApi<Record<string, any>, Partial<Record<string, any>>> = useForm();
    const addFieldRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const mobileNumbersFieldName: string = `${schema.schemaId}.${schema.name}`;
    const mobileFieldName: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
    const verifiedMobileNumbersFieldName: string = `${schema.schemaId}.${ProfileConstants.SCIM2_SCHEMA_DICTIONARY
        .get("VERIFIED_MOBILE_NUMBERS")}`;
    const pendingMobileNumberFieldName: string = `${schema.schemaId}.${ProfileConstants.SCIM2_SCHEMA_DICTIONARY
        .get("PENDING_MOBILE")}`;

    const {
        input: { value: mobileNumbersFieldValue },
        meta: { error: fieldError, touched: fieldTouched }
    } = useField(mobileNumbersFieldName, { subscription: { error: true, touched: true, value: true } });
    const {
        input: { value: mobileFieldValue },
        meta: { error: primaryFieldError, touched: primaryFieldTouched }
    } = useField(mobileFieldName, { subscription: { error: true, touched: true, value: true } });
    const {
        input: { value: verifiedMobileNumbersFieldValue }
    } = useField(verifiedMobileNumbersFieldName, { subscription: { value: true } });
    const {
        input: { value: pendingMobileFieldValue }
    } = useField(pendingMobileNumberFieldName, { subscription: { value: true } });

    const resolvedPrimarySchemaRequiredValue: boolean =
        primarySchema?.profiles?.console?.required ?? primarySchema?.required;
    const resolvedSchemaRequiredValue: boolean = schema?.profiles?.console?.required ?? schema?.required;

    const [ sortedMobileNumbersList, setSortedMobileNumbersList ] = useState<SortedMobileNumber[]>([]);
    const [ validationError, setValidationError ] = useState<string>();

    const isVerificationPending = (mobileNumber: string, verificationPendingMobile: string): boolean => {
        return mobileNumber === verificationPendingMobile;
    };

    const isVerified = (mobileNumber: string, verifiedMobileNumbers: string[]): boolean => {
        return verifiedMobileNumbers?.includes(mobileNumber);
    };

    const isPrimary = (mobileNumber: string, primaryMobileNumber: string): boolean => {
        return primaryMobileNumber === mobileNumber;
    };

    useEffect(() => {
        form.batch(() => {
            form.change(mobileNumbersFieldName, mobileNumbersList);
            form.change(mobileFieldName, primaryMobileNumber);
            form.change(verifiedMobileNumbersFieldName, verifiedMobileNumbers);
            form.change(pendingMobileNumberFieldName, verificationPendingMobileNumber);

            form.initialize(form.getState().values);
        });
    }, []);

    /**
     * Brings the primary mobile number to the top of the list.
     * Calculate the verification status for each mobile number.
     *
     * @returns A list of objects containing the mobile number and its verification status.
     */
    useEffect(() => {
        const _sortedMobileNumbersList: SortedMobileNumber[] = [];
        const _mobileNumbersList: string[] = [ ...(mobileNumbersFieldValue || []) ];

        for (const mobileNumber of _mobileNumbersList) {
            const _mobileNumber: SortedMobileNumber = {
                isPrimary: isPrimary(mobileNumber, mobileFieldValue),
                isVerificationPending: false,
                isVerified: false,
                value: mobileNumber
            };

            if (isVerificationEnabled) {
                _mobileNumber.isVerified = isVerified(mobileNumber, verifiedMobileNumbersFieldValue || []);
                _mobileNumber.isVerificationPending = isVerificationPending(
                    mobileNumber, pendingMobileFieldValue);
            }

            if (_mobileNumber.isPrimary) {
                _sortedMobileNumbersList.unshift(_mobileNumber);
            } else {
                _sortedMobileNumbersList.push(_mobileNumber);
            }
        }

        if (isVerificationEnabled && !isEmpty(pendingMobileFieldValue)) {
            if (!_sortedMobileNumbersList.some((mobileNumber: SortedMobileNumber) => {
                return mobileNumber.value === pendingMobileFieldValue;
            })) {
                _sortedMobileNumbersList.push({
                    isPrimary: false,
                    isVerificationPending: true,
                    isVerified: false,
                    value: pendingMobileFieldValue
                });
            }
        }

        setSortedMobileNumbersList(_sortedMobileNumbersList);
    }, [
        mobileNumbersFieldValue,
        mobileFieldValue,
        verifiedMobileNumbersFieldValue,
        pendingMobileFieldValue
    ]);

    const validateMobileNumber = (value: string): string => {
        if (!RegExp(primarySchema?.regEx).test(value)) {
            return t("users:forms.validation.formatError", { field: primarySchema.displayName });
        }

        return undefined;
    };

    const validateInputFieldValue: DebouncedFunc<(value: string) => void> = useCallback(
        debounce((value: string) => {
            setValidationError(validateMobileNumber(value));
        }, 500),
        []
    );

    const handleAddMobileNumber = (): void => {
        const newMobileNumber: string = addFieldRef?.current?.value;

        if (isEmpty(newMobileNumber)) {
            return;
        }

        const validationError: string = validateMobileNumber(newMobileNumber);

        if (!isEmpty(validationError)) {
            return;
        }

        form.change(mobileNumbersFieldName, [ ...(mobileNumbersFieldValue ?? []), newMobileNumber ]);
        addFieldRef.current.value = "";
    };

    const renderAddButton = (): ReactElement => {
        return (
            <InputAdornment position="end">
                <Tooltip title="Add">
                    <IconButton
                        data-componentid={ `${ componentId }-multivalue-add-icon` }
                        size="large"
                        disabled={
                            isUpdating ||
                            !isEmpty(validationError) ||
                            sortedMobileNumbersList.length >= maxValueLimit
                        }
                        onClick={ handleAddMobileNumber }
                    >
                        <PlusIcon />
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );
    };

    const handleDelete = (mobileNumber: string): void => {
        const updatedMobileNumbers: string[] = mobileNumbersFieldValue?.filter(
            (item: string) => item !== mobileNumber
        );

        form.batch(() => {
            form.change(mobileNumbersFieldName, updatedMobileNumbers);

            if (mobileNumber === mobileFieldValue) {
                form.change(mobileFieldName, "");
            }

            if (mobileNumber === pendingMobileFieldValue) {
                form.change(pendingMobileNumberFieldName, "");
            }
        });
    };

    const handleMakePrimary = (mobileNumber: string): void => {
        form.change(mobileFieldName, mobileNumber);
    };

    return (
        <Grid container>
            <Grid xs={ 12 }>
                <TextField
                    inputRef={ addFieldRef }
                    name={ `${schema.name}-add-field` }
                    type="text"
                    label={ fieldLabel }
                    margin="dense"
                    placeholder={
                        t("user:profile.forms.generic.inputs.placeholder", { fieldName: fieldLabel })
                    }
                    InputProps={ {
                        endAdornment: renderAddButton(),
                        readOnly: isReadOnly || isUpdating
                    } }
                    InputLabelProps={ {
                        required: resolvedPrimarySchemaRequiredValue || resolvedSchemaRequiredValue
                    } }
                    error={ !isEmpty(validationError) ||
                        (fieldTouched && fieldError) ||
                        (primaryFieldTouched && primaryFieldError) }
                    helperText={ validationError ||
                        (fieldTouched && fieldError) ||
                        (primaryFieldTouched && primaryFieldError) }
                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                        validateInputFieldValue(event.target.value);
                    } }
                    onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddMobileNumber();
                        }
                    } }
                    data-componentid={ `${ componentId }-input` }
                    data-testid={ `${ componentId }-input` }
                    fullWidth
                />
                <FinalFormField
                    name={ mobileNumbersFieldName }
                    component="input"
                    type="hidden"
                    validate={ (value: string[]) => {
                        if (resolvedSchemaRequiredValue && isEmpty(value)) {
                            return t("user:profile.forms.generic.inputs.validations.required", {
                                fieldName: fieldLabel });
                        }
                    } }
                />
                <FinalFormField
                    name={ mobileFieldName }
                    component="input"
                    type="hidden"
                    validate={ (value: string) => {
                        if (resolvedSchemaRequiredValue && isEmpty(value)) {
                            return t("user:profile.forms.mobile.primaryMobile.validations.empty");
                        }
                    } }
                />
                <FinalFormField
                    name={ verifiedMobileNumbersFieldName }
                    component="input"
                    type="hidden"
                />
                <FinalFormField
                    name={ pendingMobileNumberFieldName }
                    component="input"
                    type="hidden"
                />
            </Grid>
            <Grid xs={ 12 }>
                <TableContainer component={ Paper } elevation={ 0 }>
                    <Table className="multi-value-table" size="small" aria-label="multi-attribute value table">
                        <TableBody>
                            { sortedMobileNumbersList.map(
                                (
                                    { value, isPrimary, isVerified, isVerificationPending }: SortedMobileNumber,
                                    index: number
                                ) => (
                                    <TableRow key={ index } className="multi-value-table-data-row">
                                        <TableCell align="left">
                                            <Grid
                                                direction="row"
                                                gap={ 1 }
                                                container
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <label
                                                    data-componentid={ `${componentId}-value-${index}` }
                                                    className="multi-value-table-label"
                                                >
                                                    { value }
                                                </label>
                                                { isVerified && (
                                                    <div
                                                        className="verified-icon"
                                                        data-componentid={ `${componentId}-verified-icon-${index}` }
                                                    >
                                                        <Popup
                                                            name="verified-popup"
                                                            size="tiny"
                                                            trigger={ <Icon name="check" color="green" /> }
                                                            header={ t("common:verified") }
                                                            inverted
                                                        />
                                                    </div>
                                                ) }
                                                { isPrimary && (
                                                    <div
                                                        data-componentid={ `${componentId}-primary-icon-${index}` }
                                                    >
                                                        <Chip label={ t("common:primary") } size="medium" />
                                                    </div>
                                                ) }
                                                { isVerificationPending && (
                                                    <div
                                                        className="verified-icon"
                                                        data-componentid={
                                                            `${componentId}-profile-form-${
                                                                schema.name}-pending-verification` +
                                                            `-icon-${index}`
                                                        }
                                                    >
                                                        <Popup
                                                            name="pending-verification-popup"
                                                            size="tiny"
                                                            trigger={ <Icon name="info circle" color="yellow" /> }
                                                            header={ t("user:profile.tooltips.confirmationPending") }
                                                            inverted
                                                        />
                                                    </div>
                                                ) }
                                            </Grid>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Grid direction="row" gap={ 1 } justifyContent="flex-end" container>
                                                { !isPrimary && (!isVerificationEnabled || isVerified) && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        className="text-btn"
                                                        onClick={ () => handleMakePrimary(value) }
                                                        data-componentid={
                                                            `${componentId}-make-primary-button-${index}` }
                                                        disabled={ isUpdating || isReadOnly }
                                                    >
                                                        { t("common:makePrimary") }
                                                    </Button>
                                                ) }
                                                <Tooltip title={ t("common:delete") }>
                                                    <IconButton
                                                        size="small"
                                                        onClick={ () => handleDelete(value) }
                                                        data-componentid={
                                                            `${componentId}-delete-button-${index}`
                                                        }
                                                        disabled={ (isPrimary &&
                                                            resolvedPrimarySchemaRequiredValue) ||
                                                            isUpdating ||
                                                            isReadOnly
                                                        }
                                                    >
                                                        <TrashIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default MultiValuedMobileField;
