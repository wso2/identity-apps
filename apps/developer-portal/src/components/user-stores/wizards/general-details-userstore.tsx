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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Header, Icon } from "semantic-ui-react";
import { testConnection } from "../../../api";
import { JDBC } from "../../../constants";
import { TestConnection, TypeProperty, UserstoreType } from "../../../models";

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

    const { t } = useTranslation();

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
            return TestButtonIcon.TESTING
        } else if (connectionSuccessful) {
            return TestButtonIcon.SUCCESSFUL
        } else if (connectionFailed) {
            return TestButtonIcon.FAILED
        } else {
            return TestButtonIcon.INITIAL
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
            return TestButtonColor.TESTING
        } else if (connectionSuccessful) {
            return TestButtonColor.SUCCESSFUL
        } else if (connectionFailed) {
            return TestButtonColor.FAILED
        } else {
            return TestButtonColor.INITIAL
        }
    };

    return (
        <Grid data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            onSubmit(values);
                        } }
                        submitState={ submitState }
                        onChange={ (isPure, values) => {
                            setFormValue(values);
                        } }
                    >
                        <Field
                            label={ t("devPortal:components.userstores.forms.general.name.label") }
                            name="name"
                            type="text"
                            required={ true }
                            requiredErrorMessage={ t("devPortal:components.userstores.forms.general." +
                                "name.requiredErrorMessage") }
                            placeholder={ t("devPortal:components.userstores.forms.general.name.placeholder") }
                            value={ values?.get("name")?.toString() }
                            data-testid={ `${ testId }-form-name-input` }
                        />
                        <Field
                            label={ t("devPortal:components.userstores.forms.general.type.label") }
                            name="description"
                            type="text"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ t("devPortal:components.userstores.forms.general." +
                                "description.placeholder") }
                            value={ values?.get("description")?.toString() }
                            data-testid={ `${ testId }-form-description-textarea` }
                        />
                        {
                            basicProperties?.map(
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
                                                    type="password"
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("devPortal:components.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    placeholder={
                                                        t("devPortal:components.userstores.forms." +
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
                                                            t("devPortal:components.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("devPortal:components.userstores.forms." +
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
                                                        data-testid={ `${ testId }-form-basic-properties-toggle-${
                                                            selectedTypeDetail.name }` }
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
                                                            t("devPortal:components.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("devPortal:components.userstores.forms." +
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
                                                    type="password"
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("devPortal:components.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    placeholder={
                                                        t("devPortal:components.userstores.forms." +
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
                                                            t("devPortal:components.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("devPortal:components.userstores.forms." +
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
                                                            t("devPortal:components.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: name
                                                                })
                                                        }
                                                        placeholder={
                                                            t("devPortal:components.userstores.forms." +
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
                                        testConnection(testData).then(() => {
                                            setIsTesting(false);
                                            setConnectionFailed(false);
                                            setConnectionSuccessful(true);
                                        }).catch(() => {
                                            setIsTesting(false);
                                            setConnectionSuccessful(false);
                                            setConnectionFailed(true);
                                        })
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
                                { t("devPortal:components.userstores.forms.connection.testButton") }
                            </Button>
                        )
                    }
                    { connectionFailed
                        && (
                            <Header as="h6" color="red">
                                { t("devPortal:components.userstores.forms.connection.connectionErrorMessage") }
                            </Header>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

/**
 * Default props for the component.
 */
GeneralDetailsUserstore.defaultProps = {
    "data-testid": "userstore-general-details"
};
