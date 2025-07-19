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
    AlertLevels,
    IdentifiableComponentInterface,
    PatchOperationRequest,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { updateUserInfo } from "../../../api/users";
import { PatchUserOperationValue } from "../../../models/user";

import "./multi-valued-field.scss";

/**
 * Interface for the sorted email address.
 */
interface SortedEmailAddress {
    value: string;
    isPrimary: boolean;
    isVerified?: boolean;
    isVerificationPending?: boolean;
}

/**
 * User profile multi-valued email field component props interface.
 */
interface MultiValuedEmailFieldPropsInterface extends IdentifiableComponentInterface {
    userId: string;
    schema: ProfileSchemaInterface;
    primaryEmailSchema: ProfileSchemaInterface;
    primaryEmailAddress: string;
    emailAddressesList: string[];
    verifiedEmailAddresses: string[];
    verificationPendingEmailAddresses: string[];
    isVerificationEnabled: boolean;
    isUpdating: boolean;
    isReadOnly: boolean;
    fieldLabel: string;
    maxValueLimit: number;
    setIsUpdating: (isUpdating: boolean) => void;
    onUserUpdated: (userId: string) => void;
}

/**
 * User profile multi-valued email field component.
 */
const MultiValuedEmailField: FunctionComponent<MultiValuedEmailFieldPropsInterface> = ({
    userId,
    schema,
    primaryEmailSchema,
    primaryEmailAddress,
    emailAddressesList,
    verifiedEmailAddresses,
    verificationPendingEmailAddresses,
    isVerificationEnabled,
    isUpdating,
    isReadOnly,
    fieldLabel,
    maxValueLimit,
    setIsUpdating,
    onUserUpdated,
    ["data-componentid"]: componentId = "email-field"
}: MultiValuedEmailFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const form: FormApi<Record<string, any>, Partial<Record<string, any>>> = useForm();
    const addFieldRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const emailAddressesFieldName: string = `${schema.schemaId}.${schema.name}`;
    const emailsFieldName: string = `${ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")}.primary`;
    const verifiedEmailAddressesFieldName: string = `${schema.schemaId}.${ProfileConstants.SCIM2_SCHEMA_DICTIONARY
        .get("VERIFIED_EMAIL_ADDRESSES")}`;
    const pendingEmailAddressesFieldName: string = `${schema.schemaId}.${ProfileConstants.SCIM2_SCHEMA_DICTIONARY
        .get("PENDING_EMAILS")}`;

    const {
        input: { value: emailAddressesFieldValue },
        meta: { error: fieldError, touched: fieldTouched }
    } = useField<string[]>(emailAddressesFieldName, { subscription: { error: true, touched: true, value: true } });
    const {
        input: { value: emailsFieldValue },
        meta: { error: primaryFieldError, touched: primaryFieldTouched }
    } = useField<string>(emailsFieldName, { subscription: { error: true, touched: true, value: true } });
    const {
        input: { value: verifiedEmailAddressesFieldValue }
    } = useField<string[]>(verifiedEmailAddressesFieldName, { subscription: { value: true } });
    const {
        input: { value: pendingEmailAddressesFieldValue }
    } = useField<string[]>(pendingEmailAddressesFieldName, { subscription: { value: true } });

    const resolvedPrimarySchemaRequiredValue: boolean =
        primaryEmailSchema?.profiles?.console?.required ?? primaryEmailSchema?.required;
    const resolvedSchemaRequiredValue: boolean = schema?.profiles?.console?.required ?? schema?.required;

    const [ validationError, setValidationError ] = useState<string>();

    const isVerificationPending = (emailAddress: string, verificationPendingEmailAddresses: string[]): boolean => {
        return verificationPendingEmailAddresses?.includes(emailAddress);
    };

    const isVerified = (emailAddress: string, verifiedEmailAddresses: string[]): boolean => {
        return verifiedEmailAddresses?.includes(emailAddress);
    };

    const isPrimary = (emailAddress: string, primaryEmailAddress: string): boolean => {
        return primaryEmailAddress === emailAddress;
    };

    useEffect(() => {
        form.batch(() => {
            form.change(emailAddressesFieldName, emailAddressesList);
            form.change(emailsFieldName, primaryEmailAddress);
            form.change(verifiedEmailAddressesFieldName, verifiedEmailAddresses);
            form.change(pendingEmailAddressesFieldName, verificationPendingEmailAddresses);

            form.initialize(form.getState().values);
        });
    }, []);

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
                isVerificationPending: false,
                isVerified: false,
                value: emailAddress
            };

            if (isVerificationEnabled) {
                _emailAddress.isVerified = isVerified(emailAddress, verifiedEmailAddressesFieldValue || []);
                _emailAddress.isVerificationPending = isVerificationPending(
                    emailAddress, pendingEmailAddressesFieldValue || []);
            }

            if (_emailAddress.isPrimary) {
                _sortedEmailAddressesList.unshift(_emailAddress);
            } else {
                _sortedEmailAddressesList.push(_emailAddress);
            }
        }

        if (isVerificationEnabled) {
            for (const pendingEmailAddress of pendingEmailAddressesFieldValue || []) {
                if (
                    !_sortedEmailAddressesList.some((emailAddress: SortedEmailAddress) => {
                        return emailAddress.value === pendingEmailAddress;
                    })
                ) {
                    _sortedEmailAddressesList.push({
                        isPrimary: false,
                        isVerificationPending: true,
                        isVerified: false,
                        value: pendingEmailAddress
                    });
                }
            }
        }

        return _sortedEmailAddressesList;
    }, [
        emailAddressesFieldValue,
        emailsFieldValue,
        verifiedEmailAddressesFieldValue,
        pendingEmailAddressesFieldValue
    ]);

    const validateEmail = (value: string): string => {
        if (!RegExp(primaryEmailSchema?.regEx).test(value)) {
            return t("users:forms.validation.formatError", { field: fieldLabel });
        }

        return undefined;
    };

    const validateInputFieldValue: DebouncedFunc<(value: string) => void> = useCallback(
        debounce((value: string) => {
            setValidationError(validateEmail(value));
        }, 500),
        []
    );

    const handleAddEmail = (): void => {
        const newEmailAddress: string = addFieldRef?.current?.value;

        if (isEmpty(newEmailAddress)) {
            return;
        }

        const validationError: string = validateEmail(newEmailAddress);

        if (!isEmpty(validationError)) {
            return;
        }

        const existingEmailAddresses: string[] = emailAddressesFieldValue ?? [];

        form.change(emailAddressesFieldName, [ ...existingEmailAddresses, newEmailAddress ]);
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
                            sortedEmailAddressesList.length >= maxValueLimit
                        }
                        onClick={ handleAddEmail }
                    >
                        <PlusIcon />
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );
    };

    const handleDelete = (emailAddress: string): void => {
        const updatedEmailAddresses: string[] = emailAddressesFieldValue?.filter(
            (item: string) => item !== emailAddress
        );
        const updatedVerifiedEmailAddresses: string[] = !isEmpty(verifiedEmailAddressesFieldValue) &&
            verifiedEmailAddressesFieldValue?.filter(
                (item: string) => item !== emailAddress
            );
        const updatedPendingEmailAddresses: string[] = !isEmpty(pendingEmailAddressesFieldValue) &&
            pendingEmailAddressesFieldValue?.filter(
                (item: string) => item !== emailAddress
            );

        form.batch(() => {
            form.change(emailAddressesFieldName, updatedEmailAddresses);

            if (emailAddress === emailsFieldValue) {
                form.change(emailsFieldName, "");
            }
            if (verifiedEmailAddressesFieldValue?.includes(emailAddress)) {
                form.change(verifiedEmailAddressesFieldName, updatedVerifiedEmailAddresses || []);
            }
            if (pendingEmailAddressesFieldValue?.includes(emailAddress)) {
                form.change(pendingEmailAddressesFieldName, updatedPendingEmailAddresses || []);
            }
        });
    };

    const handleMakePrimary = (emailAddress: string): void => {
        form.change(emailsFieldName, emailAddress);
    };

    const handleVerify = (emailAddress: string): void => {
        setIsUpdating(true);

        const data: PatchOperationRequest<PatchUserOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };
        const updatedVerifiedEmailAddresses: string[] = [
            ...(verifiedEmailAddressesFieldValue || []), emailAddress ];

        data.Operations.push({
            op: "replace",
            value: {
                [schema.schemaId]: {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY
                        .get("VERIFIED_EMAIL_ADDRESSES")]: updatedVerifiedEmailAddresses
                }
            }
        });

        updateUserInfo(userId, data)
            .then(() => {
                dispatch(addAlert({
                    description: t("user:profile.notifications.verifyEmail.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("user:profile.notifications.verifyEmail.success.message")
                }));

                onUserUpdated(userId);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("user:profile.notifications.verifyEmail.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:profile.notifications.verifyEmail.genericError.message")
                }));
            })
            .finally(() => {
                setIsUpdating(false);
            });
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
                <FinalFormField
                    name={ verifiedEmailAddressesFieldName }
                    component="input"
                    type="hidden"
                />
                <FinalFormField
                    name={ pendingEmailAddressesFieldName }
                    component="input"
                    type="hidden"
                />
            </Grid>
            <Grid xs={ 12 }>
                <TableContainer component={ Paper } elevation={ 0 }>
                    <Table className="multi-value-table" size="small" aria-label="multi-attribute value table">
                        <TableBody>
                            { sortedEmailAddressesList.map(
                                (
                                    { value, isPrimary, isVerified, isVerificationPending }: SortedEmailAddress,
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
                                                        data-testid={ `${componentId}-verified-icon-${index}` }
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
                                                            `${componentId}-pending-verification-icon-${index}`
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
                                                { isVerificationEnabled && !isVerified && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        className="text-btn"
                                                        onClick={ () => handleVerify(value) }
                                                        data-componentid={
                                                            `${componentId}-verify-button-${index}`
                                                        }
                                                        disabled={ isUpdating || isReadOnly }
                                                    >
                                                        { t("common:verify") }
                                                    </Button>
                                                ) }
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

export default MultiValuedEmailField;
