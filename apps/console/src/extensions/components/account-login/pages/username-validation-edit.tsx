/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    Hint,
    PageLayout,
    Text
} from "@wso2is/react-components";
import { updateValidationConfigData, useValidationConfigData } from "apps/console/src/features/validation/api";
import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "apps/console/src/features/validation/models";
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
import { Grid, Ref } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../../../features/applications/constants";
import { AppConstants, history } from "../../../../features/core";
import { UsernameValidationConstants } from "../constants/username-validation-constants";
import { UsernameTypes } from "../models";

/**
 * Props for username validation edit page.
 */
type UsernameValidationEditPage = IdentifiableComponentInterface;

const FORM_ID: string = "username-validation-form";

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const UsernameValidationEditPage: FunctionComponent<UsernameValidationEditPage> = (
    props: UsernameValidationEditPage
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);
    const { t } = useTranslation();
    const [ isSubmitting, setSubmitting ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<ValidationFormInterface>(undefined);
    const [ isApplicationRedirect, setApplicationRedirect ] = useState<boolean>(false);
    const [ currentValues, setCurrentValues ] = useState<ValidationFormInterface>(
        initialFormValues
    );

    const {
        data: validationData,
        isLoading: isValidationLoading,
        error: ValidationConfigStatusFetchRequestError,
        mutate: mutateValidationConfigFetchRequest
    } = useValidationConfigData();

    const defaultPasswordValues: ValidationDataInterface [] =
            validationData?.filter((data: ValidationDataInterface) => data.field === "password");

    /**
     * Load username validation data.
     */
    useEffect(() => {
        if (isValidationLoading) {
            return;
        }

        initializeForm();
    }, [
        validationData,
        isValidationLoading
    ]);

    useEffect(() => {
        if (initialFormValues !== undefined) {
            setCurrentValues({ ...initialFormValues });
        }

    }, [ initialFormValues ]);

    useEffect(() => {
        const locationState: unknown = history.location.state;

        if (locationState === ApplicationManagementConstants.APPLICATION_STATE) {
            setApplicationRedirect(true);
        }
    }, []);

    /**
     * Handles the validation configurations fetch error.
     */
    useEffect(() => {
        if (
            !ValidationConfigStatusFetchRequestError
        ) {
            return;
        }

        if (
            ValidationConfigStatusFetchRequestError.response &&
            ValidationConfigStatusFetchRequestError.response.data &&
            ValidationConfigStatusFetchRequestError.response.data.description
        ) {
            if (
                ValidationConfigStatusFetchRequestError.response.status === 404
            ) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "extensions:manage.accountLogin.notifications.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "extensions:manage.accountLogin.notifications.error.message"
                    )
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "extensions:manage.accountLogin.notifications" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:manage.accountLogin.notifications" +
                    ".genericError.message"
                )
            })
        );
    }, [ ValidationConfigStatusFetchRequestError ]);

    /**
     * Validate the form values.
     */
    const validateForm = (values: ValidationFormInterface): boolean => {
        let error: boolean = false;
        let description: string = "";

        if (Number(values.minLength) < 3) {
            error = true;
            description = t(
                "extensions:manage.accountLogin.validationError.minLimitError"
            );
        } else if (Number(values.maxLength) > 50) {
            error = true;
            description = t(
                "extensions:manage.accountLogin.validationError.maxLimitError"
            );
        } else if (Number(values.minLength) > Number(values.maxLength)) {
            error = true;
            description = t(
                "extensions:manage.accountLogin.validationError.minMaxMismatch"
            );
        }

        if (error) {
            dispatch(
                addAlert({
                    description: description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "extensions:manage.accountLogin.validationError.wrongCombination"
                    )
                })
            );

            return false;
        } else {
            return true;
        }
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        if (isApplicationRedirect) {
            history.push(AppConstants.getPaths().get("APPLICATIONS"));

            return;
        }

        history.push(AppConstants.getPaths().get("ACCOUNT_LOGIN"));
    };

    /**
     * Initialize the initial form values.
     */
    const initializeForm = (): void => {

        const usernameConf: ValidationDataInterface[] =
            validationData?.filter((data: ValidationDataInterface) => data.field === "username");

        if (usernameConf?.length < 1) {
            return;
        }

        const config: ValidationDataInterface = usernameConf[0];

        const rules: ValidationConfInterface[] = config.rules;

        setInitialFormValues({
            enableValidator:
                (getValidationConfig(rules, "AlphanumericValidator", "enable.validator")=="true"
                || !(getValidationConfig(rules, "EmailFormatValidator", "enable.validator")=="true"))
                    ? "true"
                    : "false",
            field: "username",
            maxLength:
                getValidationConfig(rules, "LengthValidator", "max.length")
                    ? getValidationConfig(rules, "LengthValidator", "max.length")
                    : UsernameValidationConstants.VALIDATION_DEFAULT_CONSTANTS.USERNAME_MAX,
            minLength:
                getValidationConfig(rules, "LengthValidator", "min.length")
                    ? getValidationConfig(rules, "LengthValidator", "min.length")
                    : UsernameValidationConstants.VALIDATION_DEFAULT_CONSTANTS.USERNAME_MIN,
            type: "rules"
        });
    };

    /**
     * Retrieve values of each validator.
     */
    const getValidationConfig = (rules: ValidationConfInterface[], validatorName: string,

        attributeName: string): string => {

        const config: ValidationConfInterface[] = rules?.filter((data: ValidationConfInterface) => {
            return data.validator === validatorName;
        });

        if (config?.length > 0) {
            let properties: ValidationPropertyInterface[] = config[0].properties;

            properties = properties.filter((data: ValidationPropertyInterface) => data.key === attributeName);
            if (properties?.length > 0) {
                return properties[0].value;
            }
        }

        return null;
    };

    const handleUpdateUserameValidationData = (values: ValidationFormInterface): void => {

        if (!validateForm(values)) {
            return;
        }

        setSubmitting(true);
        updateValidationConfigData(values, defaultPasswordValues[0], null)
            .then(() => {
                mutateValidationConfigFetchRequest();
                dispatch(addAlert({
                    description: t("extensions:manage.accountLogin.notifications.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.validation.notifications.success.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("extensions:manage.accountLogin.notifications.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("extensions:manage.accountLogin.notifications.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t(
                        "extensions:manage.accountLogin.notifications.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.accountLogin.notifications.genericError.message")
                }));
            })
            .finally(() => {
                setSubmitting(false);
            });
    };


    return (
        <PageLayout
            pageTitle={ t("extensions:manage.accountLogin.editPage.pageTitle") }
            title={ (
                <>
                    { t("extensions:manage.accountLogin.editPage.pageTitle") }
                </>
            ) }
            description={ (
                <>
                    { t("extensions:manage.accountLogin.editPage.description") }
                </>
            ) }
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                "data-testid": `${componentId}-page-back-button`,
                onClick: handleBackButtonClick,
                text: isApplicationRedirect ?
                    t("extensions:manage.accountLogin.goBackToApplication")
                    : t("extensions:manage.accountLogin.goBackToAccountLogin")
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
                                { !isValidationLoading
                                    ? ( 
                                        <div className="validation-configurations password-validation-configurations">
                                            <Form
                                                id={ FORM_ID }
                                                initialValues={ initialFormValues }
                                                uncontrolledForm={ true }
                                                validate={ null }
                                                onSubmit={
                                                    (values: ValidationFormInterface) =>
                                                        handleUpdateUserameValidationData(values)
                                                }
                                            >
                                                <div>
                                                    <Text>
                                                        {
                                                            t("extensions:manage.accountLogin.editPage.usernameType")
                                                        }
                                                    </Text>
                                                    <Hint compact>
                                                        {
                                                            t("extensions:manage.accountLogin.editPage." +
                                                            "usernameTypeHint")
                                                        }
                                                    </Hint>
                                                </div>
                                                <div>
                                                    {
                                                        Object.keys(UsernameTypes)
                                                            .map((usernameKey: UsernameTypes, index: number) => {
                                                                const usernameType: UsernameTypes
                                                                    = UsernameTypes[usernameKey];

                                                                return (
                                                                    <Field.Radio
                                                                        key={ index }
                                                                        ariaLabel={ `${usernameType} layout swatch` }
                                                                        name="enableValidator"
                                                                        label={
                                                                            t(
                                                                                "extensions:manage.accountLogin." +
                                                                                "editPage." + usernameType
                                                                            )
                                                                        }
                                                                        required={ false }
                                                                        value={
                                                                            usernameType=="alphanumericType"
                                                                                ? "true"
                                                                                : "false" }
                                                                        data-componentid=
                                                                            { `${componentId}-${usernameType}-radio` }
                                                                        listen={ () => {
                                                                            setCurrentValues({
                                                                                ...currentValues,
                                                                                enableValidator:
                                                                                    usernameType=="alphanumericType"
                                                                                        ? "true"
                                                                                        : "false"
                                                                            });
                                                                        } }
                                                                    />
                                                                );
                                                            })
                                                    }
                                                </div>
                                                { currentValues?.enableValidator=="true" && (
                                                    <div className="ml-6">
                                                        <Text>
                                                            {
                                                                t("extensions:manage.accountLogin.editPage." +
                                                                    "usernameLength")
                                                            }
                                                        </Text>
                                                        <div className="criteria-username">
                                                            <label>
                                                                { t("extensions:manage.accountLogin.editPage." +
                                                                "usernameLengthMin") }
                                                            </label>
                                                            <Field.Input
                                                                ariaLabel="minLength"
                                                                inputType="number"
                                                                name="minLength"
                                                                min={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MIN_VALUE
                                                                }
                                                                max={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MAX_VALUE
                                                                }
                                                                width={ 2 }
                                                                required={ true }
                                                                hidden={ false }
                                                                placeholder={ "min" }
                                                                maxLength={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MAX_LENGTH
                                                                }
                                                                minLength={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MIN_LENGTH
                                                                }
                                                                validation={ (
                                                                    value: string,
                                                                    allValues: Record<string, unknown>
                                                                ): string | undefined => {
                                                                    const numValue: number = parseInt(value);
                                                                    const min: number = UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MIN_VALUE;

                                                                    if (numValue < min) {
                                                                        return t("common:minValidation", { min });
                                                                    }
                                                                    const max: number = allValues.maxLength
                                                                        ? parseInt(allValues.maxLength as string)
                                                                        : UsernameValidationConstants
                                                                            .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                            .USERNAME_MAX_VALUE;

                                                                    if (numValue > max) {
                                                                        return t("common:maxValidation", { max });
                                                                    }
                                                                } }
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
                                                            <label>
                                                                { t("extensions:manage.accountLogin.editPage." +
                                                                "usernameLengthMax") }
                                                            </label>
                                                            <Field.Input
                                                                ariaLabel="maxLength"
                                                                inputType="number"
                                                                name="maxLength"
                                                                min={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MIN_VALUE
                                                                }
                                                                max={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MAX_VALUE
                                                                }
                                                                width={ 2 }
                                                                required={ true }
                                                                hidden={ false }
                                                                placeholder={ "max" }
                                                                maxLength={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MAX_LENGTH
                                                                }
                                                                labelPosition="top"
                                                                minLength={
                                                                    UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MIN_LENGTH
                                                                }
                                                                validation={ (
                                                                    value: string,
                                                                    allValues: Record<string, unknown>
                                                                ): string | undefined => {
                                                                    const numValue: number = parseInt(value);
                                                                    const min: number = allValues.minLength
                                                                        ? parseInt(allValues.minLength as string)
                                                                        : UsernameValidationConstants
                                                                            .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                            .USERNAME_MIN_VALUE;

                                                                    if (numValue < min) {
                                                                        return t("common:minValidation", { min });
                                                                    }

                                                                    const max: number = UsernameValidationConstants
                                                                        .VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS
                                                                        .USERNAME_MAX_VALUE;

                                                                    if (numValue > max) {
                                                                        return t("common:maxValidation", { max });
                                                                    }
                                                                } }
                                                                listen={ (
                                                                    value: string
                                                                ) => {
                                                                    setCurrentValues(
                                                                        {
                                                                            ...currentValues,
                                                                            maxLength: value
                                                                        }
                                                                    );
                                                                } }
                                                                readOnly={ false }
                                                                disabled={ false }
                                                                data-testid={ `${componentId}-max-length` }
                                                            />
                                                        </div>
                                                    </div>
                                                ) }
                                                <Field.Button
                                                    form={ FORM_ID }
                                                    size="small"
                                                    buttonType="primary_btn"
                                                    ariaLabel="Self registration update button"
                                                    name="update-button"
                                                    data-testid={ `${componentId}-submit-button` }
                                                    disabled={ null }
                                                    loading={ isSubmitting }
                                                    label={ t("common:update") }
                                                    hidden={ null }
                                                />
                                            </Form>
                                        </div> )
                                    : <ContentLoader />
                                }
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
UsernameValidationEditPage.defaultProps = {
    "data-componentid": "username-validation-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UsernameValidationEditPage;
