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
import { PlusIcon, StarIcon, TrashIcon } from "@oxygen-ui/react-icons";
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
    useMemo,
    useRef,
    useState
} from "react";
import { useField, useForm } from "react-final-form";
import { useTranslation } from "react-i18next";

import "./multi-valued-field.scss";

/**
 * Interface for the sorted email address.
 */
interface SortedEmailAddress {
    value: string;
    isPrimary: boolean;
}

/**
 * User add wizard multi-valued email field component props interface.
 */
interface MultiValuedEmailFieldPropsInterface extends IdentifiableComponentInterface {
    schema: ProfileSchemaInterface;
    primaryEmailSchema: ProfileSchemaInterface;
    primaryEmailAddress: string;
    emailAddressesList: string[];
    fieldLabel: string;
    maxValueLimit: number;
}

/**
 * User add wizard multi-valued email field component.
 */
const MultiValuedEmailField: FunctionComponent<MultiValuedEmailFieldPropsInterface> = ({
    schema,
    primaryEmailSchema,
    primaryEmailAddress,
    emailAddressesList,
    fieldLabel,
    maxValueLimit,
    ["data-componentid"]: componentId = "email-field"
}: MultiValuedEmailFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const form: FormApi<Record<string, any>, Partial<Record<string, any>>> = useForm();
    const addFieldRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const addFieldName: string = `${schema.name}-add-field`;

    const emailAddressesFieldName: string = `${schema.schemaId}.${schema.name}`;
    const emailsFieldName: string = `${ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")}.primary`;

    const {
        input: { value: emailAddressesFieldValue },
        meta: { error: fieldError, touched: fieldTouched }
    } = useField<string[]>(emailAddressesFieldName, { subscription: { error: true, touched: true, value: true } });
    const {
        input: { value: emailsFieldValue },
        meta: { error: primaryFieldError, touched: primaryFieldTouched }
    } = useField<string>(emailsFieldName, { subscription: { error: true, touched: true, value: true } });

    const resolvedPrimarySchemaRequiredValue: boolean =
        primaryEmailSchema?.profiles?.console?.required ?? primaryEmailSchema?.required;
    const resolvedSchemaRequiredValue: boolean = schema?.profiles?.console?.required ?? schema?.required;

    const [ validationError, setValidationError ] = useState<string>();

    const isPrimary = (emailAddress: string, primaryEmailAddress: string): boolean => {
        return primaryEmailAddress === emailAddress;
    };

    useEffect(() => {
        form.batch(() => {
            form.change(emailAddressesFieldName, emailAddressesList);
            form.change(emailsFieldName, primaryEmailAddress);

            form.initialize(form.getState().values);
        });
    }, [ ]);

    /**
     * Handles the form submission to add the value from the input field to the multi-valued field.
     * Adds a listener to the form's submit event. So, the value typed in the input field can be
     * picked up when the form is submitting.
     */
    useEffect(() => {
        const formElement: HTMLFormElement | undefined = addFieldRef.current?.form;

        if (!formElement) {
            return;
        }

        /**
         * Handles the form submission to add the value from the input field to the multi-valued field.
         */
        const onFormSubmitCapture = () => {
            const draftValue: string = addFieldRef?.current?.value;
            const newValue: string = (draftValue ?? "").trim();

            if (!newValue) {
                return;
            }

            const validationError: string = validateEmail(newValue);

            // If there is a validation error, value is not added.
            if (validationError) {
                return;
            }

            handleAddEmail(newValue);
        };

        formElement.addEventListener("submit", onFormSubmitCapture, true);

        return () => {
            formElement.removeEventListener("submit", onFormSubmitCapture, true);
        };
    }, [ emailsFieldValue, emailAddressesFieldValue, addFieldName, form ]);

    /**
     * Brings the primary email address to the top of the list.
     * Calculate the verification status for each email address.
     *
     * @returns A list of objects containing the email address and its verification status.
     */
    const sortedEmailAddressesList: SortedEmailAddress[] = useMemo(() => {
        const _sortedEmailAddressesList: SortedEmailAddress[] = [];
        const _emailAddressesList: string[] = [ ...(emailAddressesFieldValue || []) ];

        for (const emailAddress of _emailAddressesList) {
            const _emailAddress: SortedEmailAddress = {
                isPrimary: isPrimary(emailAddress, emailsFieldValue),
                value: emailAddress
            };

            if (_emailAddress.isPrimary) {
                _sortedEmailAddressesList.unshift(_emailAddress);
            } else {
                _sortedEmailAddressesList.push(_emailAddress);
            }
        }

        return _sortedEmailAddressesList;
    }, [
        emailAddressesFieldValue,
        emailsFieldValue
    ]);

    const validateEmail: (value: string) => string = useCallback((value: string) => {
        if (emailAddressesFieldValue?.includes(value)) {
            return t("users:forms.validation.duplicateError", { field: fieldLabel });;
        }

        if (!RegExp(primaryEmailSchema?.regEx).test(value)) {
            return t("users:forms.validation.formatError", { field: fieldLabel });
        }

        return undefined;
    }, [ emailAddressesFieldValue ]);

    const validateInputFieldValue: DebouncedFunc<(value: string) => void> = useCallback(
        debounce((value: string) => {
            setValidationError(validateEmail(value));
        }, 500),
        [ emailAddressesFieldValue ]
    );

    /**
     * Handles the addition of a new value to the multi-valued field.
     * If the value is provided, it will be added to the field. And it assumes the validation is already done.
     * If the value is not provided, it will use the value from the input field. And validates it.
     *
     * @param emailAddress - The value to be added.
     */
    const handleAddEmail = (emailAddress: string = ""): void => {
        let newEmailAddress: string = emailAddress;

        if (isEmpty(newEmailAddress)) {
            newEmailAddress = addFieldRef?.current?.value;

            if (isEmpty(newEmailAddress)) {
                return;
            }

            const validationError: string = validateEmail(newEmailAddress);

            if (!isEmpty(validationError)) {
                return;
            }
        }

        const existingEmailAddresses: string[] = emailAddressesFieldValue ?? [];

        form.batch(() => {
            form.change(emailAddressesFieldName, [ ...existingEmailAddresses, newEmailAddress ]);
            // If the email addresses list is empty, set the new email address as primary.
            if (existingEmailAddresses.length === 0) {
                form.change(emailsFieldName, newEmailAddress);
            }
        });
        addFieldRef.current.value = "";
    };

    const renderAddButton = (): ReactElement => {
        return (
            <InputAdornment position="end">
                <Popup
                    size="tiny"
                    trigger={
                        (<IconButton
                            data-componentid={ `${ componentId }-multivalue-add-icon` }
                            size="large"
                            disabled={
                                !isEmpty(validationError) ||
                                sortedEmailAddressesList.length >= maxValueLimit
                            }
                            onClick={ () => handleAddEmail() }
                        >
                            <PlusIcon />
                        </IconButton>)
                    }
                    header={
                        t("common:add")
                    }
                    inverted
                />
            </InputAdornment>
        );
    };

    const handleDelete = (emailAddress: string): void => {
        const updatedEmailAddresses: string[] = emailAddressesFieldValue?.filter(
            (item: string) => item !== emailAddress
        );

        form.batch(() => {
            form.change(emailAddressesFieldName, updatedEmailAddresses);

            if (emailAddress === emailsFieldValue) {
                form.change(emailsFieldName, "");
            }
        });
    };

    const handleMakePrimary = (emailAddress: string): void => {
        form.change(emailsFieldName, emailAddress);
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
                        t("user:forms.addUserForm.inputs.generic.placeholder", { label: fieldLabel })
                    }
                    InputProps={ {
                        endAdornment: renderAddButton()
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
                            handleAddEmail();
                        }
                    } }
                    data-componentid={ `${ componentId }-input` }
                    data-testid={ `${ componentId }-input` }
                    fullWidth
                />
                <FinalFormField
                    name={ emailAddressesFieldName }
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
                    name={ emailsFieldName }
                    component="input"
                    type="hidden"
                    validate={ (value: string) => {
                        if (resolvedPrimarySchemaRequiredValue && isEmpty(value)) {
                            return t("user:profile.forms.email.primaryEmail.validations.empty");
                        }
                    } }
                />
            </Grid>
            <Grid xs={ 12 }>
                <TableContainer component={ Paper } elevation={ 0 }>
                    <Table className="multi-value-table" size="small" aria-label="multi-attribute value table">
                        <TableBody>
                            { sortedEmailAddressesList.map(
                                (
                                    { value, isPrimary }: SortedEmailAddress,
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
                                                    className="multi-value-table-label truncate"
                                                >
                                                    { value }
                                                </label>
                                                { isPrimary && (
                                                    <div
                                                        data-componentid={ `${componentId}-primary-icon-${index}` }
                                                    >
                                                        <Chip label={ t("common:primary") } size="medium" />
                                                    </div>
                                                ) }
                                            </Grid>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Grid direction="row" gap={ 1 } justifyContent="flex-end" container>
                                                { !isPrimary && (
                                                    <Popup
                                                        size="tiny"
                                                        trigger={ (
                                                            <IconButton
                                                                size="small"
                                                                onClick={ () => handleMakePrimary(value) }
                                                                data-componentid={
                                                                    `${componentId}-make-primary-button-${index}`
                                                                }
                                                                disabled={ isPrimary &&
                                                                    resolvedPrimarySchemaRequiredValue }
                                                            >
                                                                <StarIcon />
                                                            </IconButton>
                                                        ) }
                                                        header={ t("common:makePrimary") }
                                                        inverted
                                                    />
                                                ) }
                                                <Popup
                                                    size="tiny"
                                                    trigger={ (
                                                        <IconButton
                                                            size="small"
                                                            onClick={ () => handleDelete(value) }
                                                            data-componentid={
                                                                `${componentId}-delete-button-${index}`
                                                            }
                                                            disabled={ isPrimary && resolvedPrimarySchemaRequiredValue }
                                                        >
                                                            <TrashIcon />
                                                        </IconButton>
                                                    ) }
                                                    header={
                                                        t("common:delete")
                                                    }
                                                    inverted
                                                />
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

export default MultiValuedEmailField;
