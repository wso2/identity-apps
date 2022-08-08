/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid, Header, Icon } from "semantic-ui-react";
import { getUserStores, testConnection } from "../../api";
import { DISABLED, JDBC } from "../../constants";
import { TestConnection, TypeProperty, UserStoreListItem, UserstoreType } from "../../models";

/**
 * Prop types of the `GeneralDetails` component
 */
interface GeneralDetailsUserstorePropsInterface extends TestableComponentInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Submits values
     */
    onSubmit: (values: Map<string, FormValue>) => void;
    /**
     * The saved values
     */
    values: Map<string, FormValue>;
    /**
     * The type of the userstore chosen by the user
     */
    type: UserstoreType;
    /**
     * Connection properties.
     */
    connectionProperties: TypeProperty[];
    /**
     * Basic properties.
     */
    basicProperties: TypeProperty[];
}

/**
 * This component renders the General Details step of the wizard.
 *
 * @param {GeneralDetailsUserstorePropsInterface} props - Props injected to the component.
 *
 * @returns {React.ReactElement}
 */
export const GeneralDetailsUserstore: FunctionComponent<GeneralDetailsUserstorePropsInterface> = (
    props: GeneralDetailsUserstorePropsInterface
): ReactElement => {

    const {
        submitState,
        onSubmit,
        values,
        type,
        connectionProperties,
        basicProperties,
        [ "data-testid" ]: testId
    } = props;

    const [ connectionFailed, setConnectionFailed ] = useState(false);
    const [ connectionSuccessful, setConnectionSuccessful ] = useState(false);
    const [ formValue, setFormValue ] = useState<Map<string, FormValue>>(null);
    const [ isTesting, setIsTesting ] = useState(false);
    const [ enabled, setEnabled ] = useState<boolean>(undefined);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    /**
     * Enum containing the icons a test connection button can have
     */
    enum TestButtonIcon {
        TESTING = "spinner",
        FAILED = "remove",
        SUCCESSFUL = "check",
        INITIAL = "bolt"
    }

    /**
     * This returns of the icon for the test button.
     *
     * @returns {TestButtonIcon} The icon of the test button.
     */
    const findTestButtonIcon = (): TestButtonIcon => {
        if (isTesting) {
            return TestButtonIcon.TESTING;
        } else if (connectionSuccessful) {
            return TestButtonIcon.SUCCESSFUL;
        } else if (connectionFailed) {
            return TestButtonIcon.FAILED;
        } else {
            return TestButtonIcon.INITIAL;
        }
    };

    /**
     * Enum containing the colors the test button can have
     */
    enum TestButtonColor {
        TESTING,
        INITIAL,
        SUCCESSFUL,
        FAILED
    }

    /**
     * This finds the right color for the test button
     *
     * @return {TestButtonColor} The color of the test button.
     */
    const findTestButtonColor = (): TestButtonColor => {
        if (isTesting) {
            return TestButtonColor.TESTING;
        } else if (connectionSuccessful) {
            return TestButtonColor.SUCCESSFUL;
        } else if (connectionFailed) {
            return TestButtonColor.FAILED;
        } else {
            return TestButtonColor.INITIAL;
        }
    };

    return (
        <Grid data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            //reverse the value of disabled
                            values.get(DISABLED) && values
                                .set(DISABLED, values.get(DISABLED) === "false" ? "true" : "false");

                            onSubmit(values);
                        } }
                        submitState={ submitState }
                        onChange={ (isPure, values) => {
                            setFormValue(values);
                        } }
                    >
                        <Field
                            label={ t("console:manage.features.userstores.forms.general.name.label") }
                            name="name"
                            type="text"
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.userstores.forms.general." +
                                "name.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.userstores.forms.general.name.placeholder") }
                            value={ values?.get("name")?.toString() }
                            data-testid={ `${ testId }-form-name-input` }
                            validation={ async (value: FormValue, validation: Validation) => {
                                let userStores: UserStoreListItem[] = null;
                                try {
                                    userStores = await getUserStores(null);
                                } catch (error) {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description
                                                || t("console:manage.features.userstores.notifications." +
                                                    "fetchUserstores.genericError" +
                                                    ".description"),
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                                || t("console:manage.features.userstores.notifications." +
                                                    "fetchUserstores.genericError.message")
                                        }
                                    ));
                                }

                                if (userStores.find((userstore: UserStoreListItem) => userstore.name === value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("console:manage.features.userstores.forms.general." +
                                            "name.validationErrorMessages.alreadyExistsErrorMessage")
                                    );
                                }
                            }
                            }
                        />
                        <Field
                            label={ t("console:manage.features.userstores.forms.general.description.label") }
                            name="description"
                            type="text"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ t("console:manage.features.userstores.forms.general." +
                                "description.placeholder") }
                            value={ values?.get("description")?.toString() }
                            data-testid={ `${ testId }-form-description-textarea` }
                        />
                        {
                            basicProperties?.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const isDisabledField = selectedTypeDetail.description.split("#")[ 0 ] === DISABLED;
                                    const name = isDisabledField
                                        ? enabled !== undefined
                                            ? enabled ? "Enabled" : "Disabled"
                                            : values?.get(selectedTypeDetail?.name)
                                                ? values?.get(selectedTypeDetail?.name) === "false"
                                                    ? "Enabled"
                                                    : "Disabled"
                                                : selectedTypeDetail.defaultValue === "false"
                                                    ? "Enabled"
                                                    : "Disabled"
                                        : selectedTypeDetail.description.split("#")[ 0 ];

                                    const isPassword = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type").value === "password";
                                    const toggle = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
                                    return (
                                        isPassword
                                            ? (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    type="password"
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    placeholder={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    showPassword={ t("common:showPassword") }
                                                    hidePassword={ t("common:hidePassword") }
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                    data-testid={ `${ testId }-form-basic-properties-password-input-${
                                                        selectedTypeDetail.name }` }
                                                />
                                            )
                                            : toggle
                                                ? (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="toggle"
                                                        required={ false }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        value={
                                                            isDisabledField
                                                                ?
                                                                values?.get(selectedTypeDetail?.name)
                                                                    ? values
                                                                        ?.get(selectedTypeDetail?.name)
                                                                        ?.toString() === "false"
                                                                        ? "true"
                                                                        : "false"
                                                                    : selectedTypeDetail.defaultValue === "false"
                                                                        ? "true"
                                                                        : "false"
                                                                : values?.get(selectedTypeDetail?.name)?.toString()
                                                                ?? selectedTypeDetail.defaultValue
                                                        }
                                                        toggle
                                                        data-testid={ `${ testId }-form-basic-properties-toggle-${
                                                            selectedTypeDetail.name }` }
                                                        listen={ (values: Map<string, FormValue>) => {
                                                            const value = values
                                                                .get(selectedTypeDetail.name).toString();
                                                            
                                                            if (selectedTypeDetail.name === "Disabled") {
                                                                setEnabled(value !== "false");
                                                            }
                                                        } }
                                                    />
                                                ) :
                                                (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="text"
                                                        required={ true }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        data-testid={ `${ testId }-form-basic-properties-text-input-${
                                                            selectedTypeDetail.name }` }
                                                    />
                                                )
                                    );
                                })
                        }
                        <Divider hidden />
                        {
                            connectionProperties?.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const name = selectedTypeDetail.description.split("#")[ 0 ];
                                    const isPassword = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type").value === "password";
                                    const toggle = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
                                    return (
                                        isPassword
                                            ? (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    className="addon-field-wrapper"
                                                    type="password"
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    placeholder={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    showPassword={ t("common:showPassword") }
                                                    hidePassword={ t("common:hidePassword") }
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                    data-testid={
                                                        `${ testId }-form-connection-properties-password-input-${
                                                            selectedTypeDetail.name }`
                                                    }
                                                />
                                            )
                                            : toggle
                                                ? (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="toggle"
                                                        required={ false }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        toggle
                                                        data-testid={
                                                            `${ testId }-form-connection-properties-toggle-${
                                                                selectedTypeDetail.name }`
                                                        }
                                                    />
                                                ) :
                                                (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="text"
                                                        required={ true }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        data-testid={
                                                            `${ testId }-form-connection-properties-text-input-${
                                                                selectedTypeDetail.name }`
                                                        }
                                                    />

                                                )
                                    );
                                })
                        }
                    </Forms>
                    <Divider hidden />
                    {
                        type?.typeName.includes(JDBC) && (
                            <Button
                                className="test-button"
                                basic
                                onClick={
                                    () => {
                                        setIsTesting(true);
                                        const testData: TestConnection = {
                                            connectionPassword: formValue?.get("password").toString(),
                                            connectionURL: formValue?.get("url").toString(),
                                            driverName: formValue?.get("driverName").toString(),
                                            username: formValue?.get("userName").toString()
                                        };
                                        testConnection(testData).then((response) => {
                                            setIsTesting(false);
                                            if (response?.connection) {
                                                setConnectionFailed(false);
                                                setConnectionSuccessful(true);
                                            } else {
                                                setConnectionSuccessful(false);
                                                setConnectionFailed(true);
                                            }

                                        }).catch(() => {
                                            setIsTesting(false);
                                            setConnectionSuccessful(false);
                                            setConnectionFailed(true);
                                        });
                                    }
                                }
                                color={
                                    findTestButtonColor() === TestButtonColor.SUCCESSFUL
                                        ? "green"
                                        : findTestButtonColor() === TestButtonColor.FAILED
                                            ? "red"
                                            : null
                                }
                                data-testid={ `${ testId }-test-connection-button` }
                            >
                                <Icon
                                    size="small"
                                    loading={ isTesting }
                                    name={ findTestButtonIcon() }
                                    color={
                                        findTestButtonColor() === TestButtonColor.SUCCESSFUL
                                            ? "green"
                                            : findTestButtonColor() === TestButtonColor.FAILED
                                                ? "red"
                                                : null
                                    }
                                />
                                { t("console:manage.features.userstores.forms.connection.testButton") }
                            </Button>
                        )
                    }
                    { connectionFailed
                        && (
                            <Header as="h6" color="red">
                                { t("console:manage.features.userstores.forms.connection.connectionErrorMessage") }
                            </Header>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
GeneralDetailsUserstore.defaultProps = {
    "data-testid": "userstore-general-details"
};
