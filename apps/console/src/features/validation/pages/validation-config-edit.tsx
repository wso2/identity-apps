/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    EmphasizedSegment,
    PageLayout
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Label, Ref } from "semantic-ui-react";
import { AppConstants, history } from "../../core";
import { ServerConfigurationsConstants } from "../../server-configurations";
import { updateValidationConfigData, useValidationConfigData } from "../api";
import {
    ValidationConfigConstants
} from "../constants/validation-config-constants";
import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "../models";

/**
 * Props for validation configuration page.
 */
type MyAccountSettingsEditPage = IdentifiableComponentInterface;

const FORM_ID: string = "validation-config-form";

/**
 * Validation configuration listing page.
 *
 * @param props - Props injected to the component.
 * @returns Validation configuration listing page component.
 */
export const ValidationConfigEditPage: FunctionComponent<MyAccountSettingsEditPage> = (
    props: MyAccountSettingsEditPage
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);
    const { t } = useTranslation();

    const [ isSubmitting, setSubmitting ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<ValidationFormInterface>(undefined);
    const [ isRuleType ] = useState<boolean>(true);
    const [ isUniqueChrValidatorEnabled, setUniqueChrValidatorEnabled ] = useState<boolean>(false);
    const [ isConsecutiveChrValidatorEnabled, setConsecutiveChrValidatorEnabled ] = useState<boolean>(false);
    const [ currentValues, setCurrentValues ] = useState<ValidationFormInterface>(undefined);
    const [ isLoading, setIsLoading ] =useState<boolean>(true);

    const {
        data: validationData,
        isLoading: isValidationLoading,
        error: ValidationConfigStatusFetchRequestError,
        mutate: mutateValidationConfigFetchRequest
    } = useValidationConfigData();

    useEffect(() => {

        initializeForm();
    }, [ validationData ]);

    useEffect(() => {

        if (initialFormValues === undefined) {
            return;
        }
        setCurrentValues({ ...initialFormValues } );
        if (initialFormValues?.uniqueCharacterValidatorEnabled) {
            setUniqueChrValidatorEnabled(true);
        }
        if (initialFormValues?.consecutiveCharacterValidatorEnabled) {
            setConsecutiveChrValidatorEnabled(true);
        }
        setIsLoading(false);
    }, [ initialFormValues ]);

    /**
     * Handles the validation configurations fetch error.
     */
    useEffect(() => {

        if (!ValidationConfigStatusFetchRequestError) {
            return;
        }

        if (ValidationConfigStatusFetchRequestError.response
            && ValidationConfigStatusFetchRequestError.response.data
            && ValidationConfigStatusFetchRequestError.response.data.description) {
            if (ValidationConfigStatusFetchRequestError.response.status === 404) {
                return;
            }
            dispatch(addAlert({
                description: ValidationConfigStatusFetchRequestError.response.data.description ??
                    t("console:manage.features.validation.fetchValidationConfigData.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.validation.fetchValidationConfigData.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.validation.fetchValidationConfigData" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.validation.fetchValidationConfigData" +
                ".genericError.message")
        }));
    }, [ ValidationConfigStatusFetchRequestError ]);


    /**
     * Initialize the initial form values.
     */
    const initializeForm = (): void => {

        const passwordConf: ValidationDataInterface[] =
            validationData?.filter((data: ValidationDataInterface) => data.field === "password");

        if (passwordConf === undefined || passwordConf.length < 1) {
            return;
        }

        const config: ValidationDataInterface = passwordConf[0];

        const rules: ValidationConfInterface[] = config.rules;

        setInitialFormValues({
            consecutiveCharacterValidatorEnabled:
                getValidationConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character") !== null,
            field: "password",
            maxConsecutiveCharacters: getValidationConfig(rules, "RepeatedValidator", "consecutiveLength") ?
                getValidationConfig(rules, "RepeatedValidator", "consecutiveLength"): "1",
            maxLength: getValidationConfig(rules, "LengthValidator", "max.length") ?
                getValidationConfig(rules, "LengthValidator", "max.length"): "30",
            minLength: getValidationConfig(rules, "LengthValidator", "min.length") ?
                getValidationConfig(rules, "LengthValidator", "min.length"): "8",
            minLowerCaseCharacters: getValidationConfig(rules, "LowerCaseValidator", "min.length") ?
                getValidationConfig(rules, "LowerCaseValidator", "min.length"): "1",
            minNumbers: getValidationConfig(rules, "NumeralValidator", "min.length") ?
                getValidationConfig(rules, "NumeralValidator", "min.length"): "1",
            minSpecialCharacters: getValidationConfig(rules, "SpecialCharacterValidator", "min.length") ?
                getValidationConfig(rules, "SpecialCharacterValidator", "min.length"): "1",
            minUniqueCharacters: getValidationConfig(rules, "UniqueCharacterValidator", "min.length") ?
                getValidationConfig(rules, "UniqueCharacterValidator", "min.length"): "1",
            minUpperCaseCharacters: getValidationConfig(rules, "UpperCaseValidator", "min.length") ?
                getValidationConfig(rules, "UpperCaseValidator", "min.length"): "1",
            type: "rules",
            uniqueCharacterValidatorEnabled:
                getValidationConfig(rules, "UniqueCharacterValidator", "min.unique.character") !== null
        });
    };

    /**
     * Return values of each validator.
     *
     * @param rules - set of configured rules.
     * @param validatorName - name of the validator.
     * @param attributeName - name of the attribute.
     *
     * @returns the value of the configuration.
     */
    const getValidationConfig = (rules: ValidationConfInterface[], validatorName: string,
        attributeName: string): string => {

        const config: ValidationConfInterface[] = rules?.filter((data: ValidationConfInterface) => {
            return data.validator === validatorName;
        });

        if (config.length > 0) {
            let properties: ValidationPropertyInterface[] = config[0].properties;

            properties = properties.filter((data: ValidationPropertyInterface) => data.key === attributeName);
            if (properties.length > 0) {
                return properties[0].value;
            }
        }

        return null;
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {

        history.push(AppConstants.getPaths()
            .get("GOVERNANCE_CONNECTOR")
            .replace(":id", ServerConfigurationsConstants.
                LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID));
    };

    const validateForm = (values: ValidationFormInterface): boolean => {

        let error: boolean = false;
        let description: string = "";

        if (isRuleType) {
            if (Number(values.minLength) < 8) {
                error = true;
                description = t("console:manage.features.validation.validationError.minMaxMismatch");
            }
            if (Number(values.maxLength) > 30) {
                error = true;
                description = t("console:manage.features.validation.validationError.minMaxMismatch");
            }
            if (Number(values.minLength) > Number(values.maxLength)) {
                error = true;
                description = t("console:manage.features.validation.validationError.minMaxMismatch");
            }
            if (values.uniqueCharacterValidatorEnabled &&
                Number(values.minUniqueCharacters) > Number(values.minLength)) {
                error = true;
                description = t("console:manage.features.validation.validationError.uniqueChrMismatch");
            }
            if (values.consecutiveCharacterValidatorEnabled &&
                Number(values.maxConsecutiveCharacters) > Number(values.minLength)) {
                error = true;
                description = t("console:manage.features.validation.validationError.consecutiveChrMismatch");
            }
            if ((Number(values.minLowerCaseCharacters) + Number(values.minUpperCaseCharacters) +
                Number(values.minSpecialCharacters) + Number(values.minNumbers)) > Number(values.minLength)) {
                error = true;
                description = t("console:manage.features.validation.validationError.invalidConfig");
            }
        }

        if (error) {
            dispatch(addAlert({
                description: description,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.validation.notifications.genericError.message")
            }));

            return false;
        } else {
            return true;
        }
    };

    /**
     * Update the My Account Portal Data.
     *
     * @param values - New data of the My Account portal.
     */
    const handleUpdateMyAccountData = (values: ValidationFormInterface): void => {

        if (!validateForm(values)) {
            return;
        }

        setSubmitting(true);
        updateValidationConfigData(values)
            .then(() => {
                mutateValidationConfigFetchRequest();
                dispatch(addAlert({
                    description: t("console:manage.features.validation.notifications.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.validation.notifications.success.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.validation.notifications.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.validation.notifications.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.validation.notifications.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.validation.notifications.genericError.message")
                }));
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <PageLayout
            pageTitle={ t("console:manage.features.validation.pageTitle") }
            title={ (
                <>
                    { t("console:manage.features.validation.pageTitle") }
                    <Label size="medium" className="preview-label ml-2">
                        { t("common:preview") }
                    </Label>
                </>
            ) }
            description={ (
                <>
                    { t("console:manage.features.validation.description") }
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:manage.features.validation.goBackToValidationConfig")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid
                    className="mt-3"
                >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                <div className="validation-configurations password-validation-configurations">
                                    { (!isValidationLoading && !isLoading)  ?
                                        (<Form
                                            id={ FORM_ID }
                                            initialValues={ initialFormValues }
                                            uncontrolledForm={ true }
                                            validate={ null }
                                            onSubmit={
                                                (values: ValidationFormInterface) => handleUpdateMyAccountData(values)
                                            }
                                            enableReInitialize={ true }
                                        >
                                            { isRuleType &&
                                                (<div className="validation-configurations-form">
                                                    <div className="criteria" >
                                                        <label>Must be between</label>
                                                        <Field.Input
                                                            ariaLabel="minLength"
                                                            inputType="number"
                                                            name="minLength"
                                                            min={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MIN_VALUE
                                                            }
                                                            max={
                                                                currentValues.maxLength ? currentValues.maxLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MAX_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MIN_LENGTH
                                                            }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    minLength: value
                                                                });
                                                            } }

                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${componentId}-min-length` }
                                                        />
                                                        <label>and</label>
                                                        <Field.Input
                                                            ariaLabel="maxLength"
                                                            inputType="number"
                                                            name="maxLength"
                                                            min={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MIN_VALUE
                                                            }
                                                            max={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    maxLength: value
                                                                });
                                                            } }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MAX_LENGTH
                                                            }
                                                            labelPosition="top"
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MIN_LENGTH
                                                            }
                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${componentId}-max-length` }
                                                        />
                                                        <label>characters</label>
                                                    </div>
                                                    <label className={ "labelName" }>
                                                        Must contain at least
                                                    </label>
                                                    <div className={ "criteria rule mt-3" }>
                                                        <Field.Input
                                                            ariaLabel="minNumbers"
                                                            inputType="number"
                                                            name="minNumbers"
                                                            min={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_VALUE
                                                            }
                                                            max={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    minNumbers: value
                                                                });
                                                            } }

                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MAX_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_LENGTH
                                                            }
                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${componentId}-min-numbers` }
                                                        >
                                                        </Field.Input>
                                                        <label>numbers.</label>
                                                    </div>
                                                    <div className="criteria rule">
                                                        <Field.Input
                                                            ariaLabel="minUpperCaseCharacters"
                                                            inputType="number"
                                                            name="minUpperCaseCharacters"
                                                            min={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_VALUE
                                                            }
                                                            max={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    minUpperCaseCharacters: value
                                                                });
                                                            } }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MAX_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_LENGTH
                                                            }
                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${componentId}-min-upper-case-characters` }
                                                        />
                                                        <label>upper-case characters.</label>
                                                    </div>
                                                    <div className="criteria rule">
                                                        <Field.Input
                                                            ariaLabel="minLowerCaseCharacters"
                                                            inputType="number"
                                                            name="minLowerCaseCharacters"
                                                            min={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_VALUE
                                                            }
                                                            max={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MAX_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_LENGTH
                                                            }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    minLowerCaseCharacters: value
                                                                });
                                                            } }
                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${componentId}-min-lower-case-characters` }
                                                        />
                                                        <label>lower-case characters.</label>
                                                    </div>
                                                    <div className="criteria rule">
                                                        <Field.Input
                                                            ariaLabel="minSpecialCharacters"
                                                            inputType="number"
                                                            name="minSpecialCharacters"
                                                            min={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_VALUE
                                                            }
                                                            max={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    minSpecialCharacters: value
                                                                });
                                                            } }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MIN_LENGTH
                                                            }
                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${componentId}-min-special-characters` }
                                                        />
                                                        <label>special characters.</label>
                                                    </div>
                                                    <div className="criteria">
                                                        <Field.Checkbox
                                                            ariaLabel="uniqueCharacterValidatorEnabled"
                                                            name="uniqueCharacterValidatorEnabled"
                                                            required={ false }
                                                            label={ "Must contain" }
                                                            listen={ (value: boolean) => {
                                                                setUniqueChrValidatorEnabled(value);
                                                            } }
                                                            width={ 16 }
                                                            data-testid={ `${ componentId }-unique-chr-enable` }
                                                        />
                                                        <Field.Input
                                                            ariaLabel="minUniqueCharacters"
                                                            inputType="number"
                                                            name="minUniqueCharacters"
                                                            min={ 1 }
                                                            max={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    minUniqueCharacters: value
                                                                });
                                                            } }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MIN_LENGTH
                                                            }
                                                            readOnly={ false }
                                                            disabled={ !isUniqueChrValidatorEnabled }
                                                            data-testid={ `${componentId}-min-unique-chr` }
                                                        />
                                                        <label>unique characters.</label>
                                                    </div>
                                                    <div className="criteria">
                                                        <Field.Checkbox
                                                            ariaLabel="consecutiveCharacterValidatorEnabled"
                                                            name="consecutiveCharacterValidatorEnabled"
                                                            label={ "Must not contain more than" }
                                                            required={ false }
                                                            disabled={ false }
                                                            listen={ (value: boolean) => {
                                                                setConsecutiveChrValidatorEnabled(value);
                                                            } }
                                                            width={ 16 }
                                                            data-testid={ `${ componentId }-consecutive-chr-enable` }
                                                        />
                                                        <Field.Input
                                                            ariaLabel="maxConsecutiveCharacters"
                                                            inputType="number"
                                                            name="maxConsecutiveCharacters"
                                                            min={ 1 }
                                                            max={
                                                                currentValues.minLength ? currentValues.minLength :
                                                                    ValidationConfigConstants
                                                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                        .PASSWORD_MAX_VALUE
                                                            }
                                                            width={ 2 }
                                                            required={ true }
                                                            hidden={ false }
                                                            placeholder={ "min" }
                                                            listen={ (value: string) => {
                                                                setCurrentValues({
                                                                    ...currentValues,
                                                                    maxConsecutiveCharacters: value
                                                                });
                                                            } }
                                                            maxLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .MIN_LENGTH
                                                            }
                                                            minLength={
                                                                ValidationConfigConstants
                                                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                                                    .PASSWORD_MIN_LENGTH
                                                            }
                                                            readOnly={ false }
                                                            disabled={ !isConsecutiveChrValidatorEnabled }
                                                            data-testid={ `${componentId}-max-consecutive-chr` }
                                                        />
                                                        <label>consecutive characters.</label>
                                                    </div>
                                                </div>)
                                            }
                                            <Field.Button
                                                form={ FORM_ID }
                                                size="small"
                                                buttonType="primary_btn"
                                                ariaLabel="Validation configuration update button"
                                                name="update-button"
                                                data-testid={ `${ componentId }-submit-button` }
                                                loading={ isSubmitting }
                                                label={ t("common:update") }
                                            >

                                            </Field.Button>
                                        </Form>)
                                        : <ContentLoader/>
                                    }
                                </div>
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ValidationConfigEditPage.defaultProps = {
    "data-componentid": "validation-config-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ValidationConfigEditPage;
