/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { 
    ContentLoader, 
    GenericIcon, 
    Heading, 
    Hint, 
    LinkButton, 
    PageLayout, 
    PrimaryButton, 
    Text, 
    useWizardAlert 
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import debounce from "lodash-es/debounce";
import delay from "lodash-es/delay";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Card, Grid, Icon } from "semantic-ui-react";
import { history } from "../../../../features/core/helpers";
import { EventPublisher } from "../../../../features/core/utils";
import { addNewTenant, checkDuplicateTenants } from "../api";
import { TenantCreationIcons } from "../configs";
import { TenantManagementConstants } from "../constants";
import { handleTenantSwitch } from "../utils";

/**
 * Interface to capture add tenant form error messages.
 */
export interface AddTenantFormErrorValidationsInterface {
    tenantName: string;
}

/**
 * Interface to capture add tenant form values.
 */
export interface AddTenantFormValuesInterface {
    tenantName: string;
}

/**
 * Tenant creation page.
 *
 * @return {React.ReactElement}
 */
const TenantCreationPage: FunctionComponent<TestableComponentInterface> = (
    props: TestableComponentInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    
    const { t } = useTranslation();

    const [ tenantDuplicate, setTenantDuplicate ] = useState<boolean>(false);
    const [ isTenantValid, setIsTenantValid ] = useState<boolean>(false);
    const [ isNewTenantLoading, setIsNewTenantLoading ] = useState<boolean>(false);
    const [ isCheckingTenantExistence, setCheckingTenantExistence ] = useState<boolean>(false);
    const [ isFocused, setIsFocused ] = useState<boolean>(false);
    const [ finishSubmit, setFinishSubmit ] = useState<boolean>(false);
    const [ tenantLoaderText, setTenantLoaderText ] = useState<string>();
    const [ newTenantName, setNewTenantName ] = useState<string>(TenantManagementConstants.TENANT_URI_PLACEHOLDER);
    const [ submissionValue, setSubmissionValue ] = useState<AddTenantFormValuesInterface>();


    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (submissionValue && finishSubmit && isTenantValid && !tenantDuplicate) {  
            setFinishSubmit(false);
            handleFormSubmit();
        }
    }, [ submissionValue, finishSubmit ]);

    /**
     * Function to update the tenant URL as the user types a tenant name.
     */
    const updateTenantUrl = (tenantName: any): void => {
        setTenantDuplicate(false);
        if (isEmpty(tenantName)) {
            setNewTenantName(TenantManagementConstants.TENANT_URI_PLACEHOLDER);
            setIsTenantValid(false);
        } else {
            setNewTenantName(tenantName);
            setIsTenantValid(checkTenantValidity(tenantName));
        }
    };

    /**
     * Function to check the validity of the tenant name entered by the user.
     */
    const checkTenantValidity = (tenantName: string): boolean => {
        const isValidTenantName =
            tenantName && !!tenantName.match(TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_PATTERN);

        if (!isValidTenantName) {
            setCheckingTenantExistence(false);
            isDuplicateTenant.cancel();
        }

        return isValidTenantName;
    };

    /**
     * Function to check if the tenant name user entered is already taken. A debounced version of the function is used
     * to trigger the API call only after user stops typing for 1000ms.
     */
    const isDuplicateTenant = useCallback(debounce((data: string) => {
        checkDuplicateTenants(data)
            .then((response: AxiosResponse) => {
                if (response.status == 200) {
                    setTenantDuplicate(true);
                }
                setCheckingTenantExistence(false);
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    // Proceed if tenant does not exist.
                    setTenantDuplicate(false);
                }
                setCheckingTenantExistence(false);
            });
    }, 1000), []);

    /**
     * Function which handles the operation when the user submits the form by clicking create button.
     */
    const handleFormSubmit = (): void => {
        setIsNewTenantLoading(true);
        setTenantLoaderText(t("extensions:manage.features.tenant.wizards.addTenant.forms" +
            ".loaderMessages.duplicateCheck"));
        checkDuplicateTenants(submissionValue?.tenantName)
            .then((response: AxiosResponse) => {
                setIsNewTenantLoading(false);
                if (response.status == 200) {
                    setTenantDuplicate(true);
                    setAlert({
                        description: t("extensions:manage.features.tenant.wizards.addTenant.forms" +
                            ".fields.tenantName.validations.duplicate",
                        { tenantName: submissionValue.tenantName }),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    // Proceed to tenant creation if tenant does not exist.
                    addTenant(submissionValue.tenantName);                    
                } else {
                    setIsNewTenantLoading(false);
                    setAlert({
                        description: t("extensions:manage.features.tenant.notifications.addTenant" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                }
            });
    };

    /**
     * Function which contains the logic to add a new tenant by calling APIs.
     */
    const addTenant = (tenantName: string): void => {
        setIsNewTenantLoading(true);
        setTenantLoaderText(t("extensions:manage.features.tenant.wizards.addTenant.forms.loaderMessages.tenantCreate"));
        addNewTenant(tenantName)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    eventPublisher.publish("create-new-organization");

                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:manage.features.tenant.notifications.addTenant.success.description",
                            tenantName),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.success.message")
                    }));

                    setTenantLoaderText(t("extensions:manage.features.tenant.wizards.addTenant." +
                        "forms.loaderMessages.tenantSwitch"));

                    // Delay 5s to give the user ample time to read the redirection message.
                    delay(() => {
                        setIsNewTenantLoading(false);
                        // onCloseHandler();
                        handleTenantSwitch(tenantName);
                    }, 5000);
                }
            })
            .catch(error => {
                setIsNewTenantLoading(false);
                // This section gives error context on a former error scenario where the tenant creation would fail
                // if the first name, last name or primary email of the user is absent in their personal info
                // claims. This dependency was removed but the error catch has been left to handle the scenario if
                // it occurs under a different circumstance.
                if (error.response.data?.code &&
                    [ "TM-10011", "TM-10004", "TM-10008", "TM-10005" ].includes(error.response.data.code)) {
                    setAlert({
                        description: t("extensions:manage.features.tenant.notifications.missingClaims.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.missingClaims.message")
                    });
                } else if (error.response.data?.code && [ "TM-10013" ].includes(error.response.data.code)) {
                    setAlert({
                        description: t("extensions:manage.features.tenant.notifications.addTenant." +
                            "limitReachError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.limitReachError.message")
                    });
                } else {
                    setAlert({
                        description: t("extensions:manage.features.tenant.notifications.addTenant." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                }
            });
    };

    /**
     * Function which will update the tenant name variable as the user types in the input field.
     */
    const updateValues = () => {     
        submitAdvanceForm();
        setFinishSubmit(true);
    };

    /**
     * submit form function.
     */
    let submitAdvanceForm: () => void;

    /**
     * Function to render the validation status of first letter of tenant name being in alphabet.
     * @return {React.ReactElement}
     */
    const renderTenantAlphabetValidation = (): ReactElement => {
        if (newTenantName === TenantManagementConstants.TENANT_URI_PLACEHOLDER) {
            return <Icon name="circle" color="grey"/>;
        } 
        
        if (newTenantName.match(TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_FIRST_ALPHABET)) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey"/>;      
        } else {
            return <Icon name="remove circle" color="red"/>;   
        }        
    };
    
    /**
     * Function to render the validation status of the length of tenant name.
     * @return {React.ReactElement}
     */
    const renderTenantLengthValidation = (): ReactElement => {
        if (newTenantName === TenantManagementConstants.TENANT_URI_PLACEHOLDER) {
            return <Icon name="circle" color="grey"/>;
        } 
        
        if (newTenantName.length >= TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_MIN_LENGTH &&
            newTenantName.length < TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey"/>;      
        } else {
            return <Icon name="remove circle" color="red"/>;   
        }
    };

    /**
     * Function to render the validation status of the tenant being alphanumeric.
     * @return {React.ReactElement}
     */
    const renderTenantAlphanumericValidation = (): ReactElement => {
        if (newTenantName === TenantManagementConstants.TENANT_URI_PLACEHOLDER) {
            return <Icon name="circle" color="grey"/>;
        } 
        
        if (newTenantName.match(TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_ALPHANUMERIC)) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey"/>;      
        } else {
            return <Icon name="remove circle" color="red"/>;   
        }        
    };

    /**
     * Function to render the validation status of the tenant being unique.
     * @return {React.ReactElement}
     */
    const renderTenantUniqueValidation = (): ReactElement => {        
        if (newTenantName === TenantManagementConstants.TENANT_URI_PLACEHOLDER) {
            return <Icon name="circle" color="grey"/>;
        } 
        
        if (isTenantValid && !isCheckingTenantExistence && !tenantDuplicate) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey"/>;      
        } else {
            return <Icon name="remove circle" color="red"/>;   
        }      
    };

    return (
        <PageLayout
            padded={ false }
            contentTopMargin={ false }
            className="tenant-creation-page pt-5"
        >
            <Grid centered> 
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 6 } largeScreen={ 6 } widescreen={ 6 }>
                    <GenericIcon
                        transparent
                        className="onboard-apps-animated-illustration"
                        size="tiny"
                        width={ 50 }
                        colored
                        icon={ TenantCreationIcons().asgardeoLogo }
                    />
                    <Card
                        fluid
                        centered
                        className="basic-card no-hover"
                    >
                        <Card.Content className="p-5">
                            { alert && alertComponent }
                            <Grid centered>
                                <Grid.Row>
                                    <div className="card-heading">
                                        <Heading as="h2">
                                            { t("extensions:manage.features.tenant." +
                                                "tenantCreationPrompt.heading") } 
                                        </Heading>
                                    </div>
                                </Grid.Row>
                                <Grid.Row>
                                    <Text muted>
                                        { t("extensions:manage.features.tenant." +
                                            "tenantCreationPrompt.subHeading1") } <br/>
                                        { t("extensions:manage.features.tenant." +
                                            "tenantCreationPrompt.subHeading2") }
                                    </Text>
                                </Grid.Row>
                            </Grid>
                            <Form
                                onSubmit={ (values) => {                                   
                                    setSubmissionValue(values as AddTenantFormValuesInterface);
                                } }
                                triggerSubmit={ (submitFunction: () => void) => {                                  
                                    submitAdvanceForm = submitFunction;
                                } }
                                uncontrolledForm={ false }
                            >
                                <Field.Input
                                    className={ 
                                        !isFocused && 
                                        newTenantName !== TenantManagementConstants.TENANT_URI_PLACEHOLDER && 
                                        (!isTenantValid || tenantDuplicate)
                                            ? "error"
                                            : ""
                                    }
                                    ariaLabel="Tenant Name"
                                    inputType="resource_name"
                                    name="tenantName"
                                    label={
                                        t("extensions:manage.features.tenant.wizards.addTenant" +
                                            ".forms.fields.tenantName.label")
                                    }
                                    placeholder={
                                        t("extensions:manage.features.tenant.wizards.addTenant" +
                                            ".forms.fields.tenantName.placeholder")
                                    }
                                    required={ true }
                                    listen={ (value) => updateTenantUrl(value) }
                                    maxLength={ TenantManagementConstants.FORM_FIELD_CONSTRAINTS.
                                        TENANT_NAME_MAX_LENGTH }
                                    minLength={ TenantManagementConstants.FORM_FIELD_CONSTRAINTS.
                                        TENANT_NAME_MIN_LENGTH }
                                    validation={ (value: string) => {
                                        if (checkTenantValidity(value.toString())) {
                                            setCheckingTenantExistence(true);
                                            isDuplicateTenant(value.toString());
                                        }
                                    } }
                                    width={ 16 }
                                    onBlur={ () => setIsFocused(false) }
                                    onFocus={ () => setIsFocused(true) }
                                    data-testid={ `${ testId }-type-input` }
                                />
                            </Form>  
                            { isCheckingTenantExistence
                                ? (
                                    <Text className="tenant-uri-prefix">
                                        https://console.asgardeo.io/t/
                                        <Icon name="circle notched" color="grey" loading/>
                                    </Text>
                                ) : (
                                    <span>
                                        https://console.asgardeo.io/t/
                                        <span 
                                            className={ `${
                                                newTenantName !== TenantManagementConstants.TENANT_URI_PLACEHOLDER
                                                    ? isTenantValid && !tenantDuplicate
                                                        ? "valid-tenant placeholder-uri-bold"
                                                        : "invalid-tenant placeholder-uri-bold"
                                                    : newTenantName == TenantManagementConstants.TENANT_URI_PLACEHOLDER
                                                        ? isTenantValid && !tenantDuplicate
                                                            ? "valid-tenant placeholder-uri-bold"
                                                            : "placeholder-uri"
                                                        : void 0
                                            }` }>
                                            { newTenantName }
                                            <Hint icon="info circle" popup>
                                                { t("extensions:manage.features.tenant.wizards.addTenant" +
                                                    ".tooltips.message") }
                                            </Hint>
                                        </span>
                                    </span>
                                )
                            }
                            <Grid className="m-0 pt-2">
                                <Grid.Row className="p-0">
                                    { renderTenantAlphabetValidation() }
                                    <Text muted>
                                        Must begin with an alphabet character
                                    </Text>
                                </Grid.Row>
                                <Grid.Row className="p-0">
                                    { renderTenantLengthValidation() }
                                    <Text muted>
                                        More than 4 characters, Less than 30 characters
                                    </Text>
                                </Grid.Row>
                                <Grid.Row className="p-0">
                                    { renderTenantAlphanumericValidation() }
                                    <Text muted>
                                        Only consist of lowercase alphanumerics
                                    </Text>
                                </Grid.Row>
                                <Grid.Row className="p-0">
                                    { renderTenantUniqueValidation() }
                                    <Text muted>
                                        Must be unique
                                    </Text>
                                </Grid.Row>
                            </Grid>
                            {
                                isNewTenantLoading && (
                                    <ContentLoader text={ tenantLoaderText }/>
                                ) 
                            }                         
                        </Card.Content>
                        <Card.Content>
                            <Grid className="pr-5 pl-5">
                                <Grid.Row column={ 1 }>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                        <LinkButton
                                            floated="left"
                                            onClick={ () => {
                                                eventPublisher.publish("console-click-logout");
                                                history.push(window[ "AppUtils" ].getConfig().routes.logout);
                                            } }
                                            disabled={ isNewTenantLoading }
                                            data-testid={ `${ testId }-cancel-button` }
                                        >
                                            { t("common:logout") }
                                        </LinkButton>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                        <PrimaryButton
                                            floated="right"
                                            onClick={ updateValues }
                                            loading={ isNewTenantLoading }
                                            data-testid={ `${ testId }-create-button` }
                                            disabled={ isNewTenantLoading || isCheckingTenantExistence }
                                        >
                                            { t("common:create") }
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>

        </PageLayout>
    );
};

/**
 * Default props for the component
 */
TenantCreationPage.defaultProps = {
    "data-testid": "create-tenant-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TenantCreationPage;
