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
import { FinalFormField, FormApi } from "@wso2is/form";
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
import { MultiValuedTextFieldPropsInterface } from "../../../models/ui";

import "./multi-valued-field.scss";

/**
 * User profile multi-valued text field component.
 */
const MultiValuedTextField: FunctionComponent<MultiValuedTextFieldPropsInterface> = ({
    schema,
    fieldName,
    initialValue,
    isUpdating,
    isReadOnly,
    isRequired,
    fieldLabel,
    maxValueLimit,
    type = "text",
    ["data-componentid"]: componentId = "multi-valued-text-field"
}: MultiValuedTextFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const form: FormApi<Record<string, any>, Partial<Record<string, any>>> = useForm();
    const addFieldRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const {
        input: { value: fieldValue },
        meta: { error: fieldError, touched: fieldTouched }
    } = useField<string[]>(fieldName, { subscription: { error: true, touched: true, value: true } });

    const [ validationError, setValidationError ] = useState<string>();

    useEffect(() => {
        form.batch(() => {
            form.change(fieldName, initialValue);

            form.initialize(form.getState().values);
        });
    }, []);

    const valueList: string[] = useMemo(() => {
        return Array.isArray(fieldValue) ? fieldValue : [];
    }, [ fieldValue ]);

    const validateValue = (value: string): string => {
        if (!RegExp(schema?.regEx).test(value)) {
            return t("users:forms.validation.formatError", { field: fieldLabel });
        }

        return undefined;
    };

    const validateInputFieldValue: DebouncedFunc<(value: string) => void> = useCallback(
        debounce((value: string) => {
            setValidationError(validateValue(value));
        }, 500),
        []
    );

    const handleAddValue = (): void => {
        const newValue: string = addFieldRef?.current?.value;

        if (isEmpty(newValue)) {
            return;
        }

        const validationError: string = validateValue(newValue);

        if (!isEmpty(validationError)) {
            return;
        }

        const existingValues: string[] = fieldValue ?? [];

        form.change(fieldName, [ ...existingValues, newValue ]);
        addFieldRef.current.value = "";
    };

    const renderAddButton = (): ReactElement => {
        return (
            <InputAdornment position="end">
                <Tooltip title="Add">
                    <IconButton
                        data-componentid={ `${componentId}-multivalue-add-icon` }
                        size="large"
                        disabled={ isUpdating || !isEmpty(validationError) || valueList.length >= maxValueLimit }
                        onClick={ handleAddValue }
                    >
                        <PlusIcon />
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );
    };

    const handleDelete = (value: string): void => {
        const updatedValues: string[] = fieldValue?.filter((item: string) => item !== value);

        form.change(fieldName, updatedValues);
    };

    return (
        <Grid container>
            <Grid xs={ 12 }>
                <TextField
                    inputRef={ addFieldRef }
                    name={ `${schema.name}-add-field` }
                    type={ type }
                    label={ fieldLabel }
                    margin="dense"
                    placeholder={
                        t("user:profile.forms.generic.inputs.placeholder", { fieldName: fieldLabel }) }
                    InputProps={ {
                        endAdornment: renderAddButton(),
                        readOnly: isReadOnly || isUpdating
                    } }
                    InputLabelProps={ {
                        required: isRequired
                    } }
                    error={ !isEmpty(validationError) || (fieldTouched && !isEmpty(fieldError)) }
                    helperText={ validationError ?? (fieldTouched && fieldError) }
                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                        validateInputFieldValue(event.target.value);
                    } }
                    onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddValue();
                        }
                    } }
                    data-componentid={ `${ componentId }-input` }
                    data-testid={ `${ componentId }-input` }
                    fullWidth
                />
                <FinalFormField
                    name={ fieldName }
                    component="input"
                    type="hidden"
                    validate={ (value: string[]) => {
                        if (isEmpty(value) && isRequired) {
                            return t("user:profile.forms.generic.inputs.validations.required", {
                                fieldName: fieldLabel });
                        }
                    } }
                />
            </Grid>
            <Grid xs={ 12 }>
                <TableContainer component={ Paper } elevation={ 0 }>
                    <Table className="multi-value-table" size="small" aria-label="multi-attribute value table">
                        <TableBody>
                            { valueList.map((value: string, index: number) => (
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
                                                data-testid={ `${componentId}-value-${index}` }
                                                className="multi-value-table-label"
                                            >
                                                { value }
                                            </label>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Grid direction="row" gap={ 1 } justifyContent="flex-end" container>
                                            <Tooltip title={ t("common:delete") }>
                                                <IconButton
                                                    size="small"
                                                    onClick={ () => handleDelete(value) }
                                                    data-componentid={
                                                        `${componentId}-delete-button-${index}`
                                                    }
                                                    disabled={ isUpdating || isReadOnly }
                                                >
                                                    <TrashIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default MultiValuedTextField;
