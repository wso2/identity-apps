/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { EmphasizedSegment, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Grid, Icon } from "semantic-ui-react";
import { SqlEditor } from "..";
import { patchUserStore, testConnection } from "../../api";
import { JDBC } from "../../constants";
import {
    PatchData,
    PropertyAttribute,
    RequiredBinary,
    TestConnection,
    TypeProperty,
    UserstoreType
} from "../../models";

/**
 * Prop types of `EditConnectionDetails` component
 */
interface EditConnectionDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
    /**
     * The type meta data
     */
    type: UserstoreType;
    /**
     * The connection properties.
     */
    properties: RequiredBinary;
    /**
     * Readonly attribute for the component.
     */
    readOnly?: boolean;
}

/**
 * This renders the edit connection details pane.
 *
 * @param props - Props injected to the component.
 *
 * @returns Connection detail edit component.
 */
export const EditConnectionDetails: FunctionComponent<EditConnectionDetailsPropsInterface> = (
    props: EditConnectionDetailsPropsInterface
): ReactElement => {

    const {
        id,
        properties,
        readOnly,
        type,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ formValue, setFormValue ] = useState<Map<string, FormValue>>(null);
    const [ showMore, setShowMore ] = useState(false);
    const [ connectionFailed, setConnectionFailed ] = useState(false);
    const [ connectionSuccessful, setConnectionSuccessful ] = useState(false);
    const [ isTesting, setIsTesting ] = useState(false);
    const [ sql, setSql ] = useState<Map<string, string>>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isPasswordEditing, setIsPasswordEditing ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

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
     * @returns The icon of the test button.
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
     * @returns The color of the test button.
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

    useEffect(() => {
        if (properties) {
            const tempSql: Map<string,string> = new Map<string, string>();

            properties.optional.sql.delete.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.insert.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.select.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.update.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            setSql(tempSql);
        }
    }, [ properties ]);

    const onSubmitHandler = (values: Map<string, FormValue>): void => {
        const requiredData: PatchData[] = properties?.required.reduce(
            (result: PatchData[], property: TypeProperty) => {
                const value: FormValue = values.get(property.name);

                // Skip the property if
                // its name is "ConnectionPassword" and isPasswordEditing is false.
                if (property.name === "ConnectionPassword" && !isPasswordEditing) {
                    return result;
                }
                if (value) {
                    result.push({
                        operation: "REPLACE",
                        path: `/properties/${property.name}`,
                        value: value.toString()
                    });
                }

                return result;
            }, [] as PatchData[]
        );

        const optionalNonSqlData: PatchData[] = showMore
            ? properties?.optional.nonSql.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: values.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlInsertData: PatchData[] = showMore
            ? properties?.optional.sql.insert.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlUpdateData: PatchData[] = showMore
            ? properties?.optional.sql.update.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlDeleteData: PatchData[] = showMore
            ? properties?.optional.sql.delete.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlSelectData: PatchData[] = showMore
            ? properties?.optional.sql.select.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const data: PatchData[] = showMore
            ? [
                ...requiredData,
                ...optionalNonSqlData,
                ...optionalSqlDeleteData,
                ...optionalSqlInsertData,
                ...optionalSqlUpdateData,
                ...optionalSqlSelectData
            ]
            : requiredData;

        setIsSubmitting(true);

        patchUserStore(id, data)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userstores:notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("userstores:notifications.updateDelay.message")
                }));

                // Re-fetch the userstore details
                update();
            })
            .catch((error: any) => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("userstores:notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("userstores:notifications." +
                        "updateUserstore.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <EmphasizedSegment padded="very">
            <Forms
                onChange={ (isPure: boolean, values: Map<string, FormValue>) => {
                    setFormValue(values);
                } }
                onSubmit={ onSubmitHandler }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 8 }>
                            {
                                properties?.required?.map((property: TypeProperty, index: number) => {
                                    const name: string = property.description.split("#")[ 0 ];
                                    const isPassword: boolean = property.attributes
                                        .find(
                                            (attribute: PropertyAttribute) => attribute.name === "type"
                                        ).value === "password";
                                    const toggle: boolean = property.attributes
                                        .find((attribute: PropertyAttribute) => attribute.name === "type"
                                        )?.value === "boolean";

                                    return (
                                        isPassword
                                            ? (
                                                <>
                                                    <Box display="flex" flexDirection="row">
                                                        <Checkbox
                                                            sx={ { pb: 1.4, pl: 0,pr: 1, pt: 0 } }
                                                            onChange={ (_e: React.SyntheticEvent) => {
                                                                setIsPasswordEditing(!isPasswordEditing);
                                                            } }
                                                            disabled={ readOnly }
                                                        />
                                                        <p>{ t("userstores:forms." +
                                                                "connection.updatePassword") }</p>
                                                    </Box>
                                                    <Field
                                                        name={ property.name }
                                                        className="addon-field-wrapper"
                                                        type="password"
                                                        key={ index }
                                                        required={ isPasswordEditing }
                                                        label={ name }
                                                        requiredErrorMessage={
                                                            `${property.description.split("#")[ 0 ]} is  required`
                                                        }
                                                        showPassword={ t("common:showPassword") }
                                                        hidePassword={ t("common:hidePassword") }
                                                        placeholder={
                                                            t("userstores:forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        data-testid={
                                                            `${ testId }-form-password-input-${ property.name }`
                                                        }
                                                        disabled={ readOnly || !isPasswordEditing }
                                                    />
                                                </>
                                            )
                                            : toggle
                                                ? (
                                                    <Field
                                                        name={ property.name }
                                                        value={ property.value ?? property.defaultValue }
                                                        type="toggle"
                                                        key={ index }
                                                        required={ false }
                                                        label={ property.description.split("#")[ 0 ] }
                                                        requiredErrorMessage={
                                                            t("userstores:forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        placeholder={
                                                            t("userstores:forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        toggle
                                                        data-testid={ `${ testId }-form-toggle-${ property.name }` }
                                                        disabled={ readOnly }
                                                    />
                                                ) :
                                                (
                                                    <Field
                                                        name={ property.name }
                                                        value={ property.value ?? property.defaultValue }
                                                        type="text"
                                                        key={ index }
                                                        required={ true }
                                                        label={ property.description.split("#")[ 0 ] }
                                                        requiredErrorMessage={
                                                            t("userstores:forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        placeholder={
                                                            t("userstores:forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        data-testid={ `${ testId }-form-text-input-${ property.name }` }
                                                        disabled={ readOnly }
                                                    />
                                                )
                                    );
                                })
                            }

                        </Grid.Column>
                    </Grid.Row>
                    { type?.typeName.includes(JDBC) && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                <Button
                                    className="test-button"
                                    basic
                                    type="button"
                                    color={
                                        findTestButtonColor() === TestButtonColor.SUCCESSFUL
                                            ? "green"
                                            : findTestButtonColor() === TestButtonColor.FAILED
                                                ? "red"
                                                : null
                                    }
                                    onClick={
                                        () => {
                                            setIsTesting(true);
                                            if (type.typeName.includes(JDBC)) {
                                                const testData: TestConnection = {
                                                    connectionPassword: formValue?.get("password").toString()
                                                        ?? properties?.required
                                                            .find(
                                                                (property: TypeProperty) => property.name === "password"
                                                            )?.value,
                                                    connectionURL: formValue?.get("url").toString()
                                                        ?? properties?.required
                                                            .find(
                                                                (property: TypeProperty) => property.name === "url"
                                                            )?.value,
                                                    driverName: formValue?.get("driverName").toString()
                                                        ?? properties?.required
                                                            .find((property: TypeProperty) =>
                                                                property.name === "driverName"
                                                            )?.value,
                                                    username: formValue?.get("userName").toString()
                                                        ?? properties?.required
                                                            .find(
                                                                (property: TypeProperty) => property.name === "userName"
                                                            )?.value
                                                };

                                                testConnection(testData).then((response: any) => {
                                                    setIsTesting(false);
                                                    if (response?.connection) {
                                                        dispatch(addAlert({
                                                            description: t("userstores:" +
                                                                "notifications.testConnection.success.description"),
                                                            level: AlertLevels.SUCCESS,
                                                            message: t("userstores:" +
                                                                "notifications.testConnection.success.message")
                                                        }));
                                                        setConnectionFailed(false);
                                                        setConnectionSuccessful(true);
                                                    } else {
                                                        dispatch(addAlert({
                                                            description: t("userstores:" +
                                                                "notifications.testConnection.genericError" +
                                                                ".description"),
                                                            level: AlertLevels.ERROR,
                                                            message: t(
                                                                "userstores:notifications.testConnection.genericError" +
                                                                ".message")
                                                        }));
                                                        setConnectionSuccessful(false);
                                                        setConnectionFailed(true);
                                                    }
                                                }).catch((error: any) => {
                                                    dispatch(addAlert({
                                                        description: error?.description
                                                            || t("userstores:notifications." +
                                                                "testConnection.genericError.description"),
                                                        level: AlertLevels.ERROR,
                                                        message: error?.message || t(
                                                            "userstores:notifications.testConnection.genericError" +
                                                            ".message")
                                                    }));
                                                    setIsTesting(false);
                                                    setConnectionSuccessful(false);
                                                    setConnectionFailed(true);
                                                });
                                            }
                                        }
                                    }
                                    data-testid={ `${ testId }-test-connection-button` }
                                    disabled={ readOnly }
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
                                    { t("userstores:forms.connection.testButton") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                </Grid>

                {
                    (properties?.optional.nonSql.length > 0
                        || properties?.optional.sql.delete.length > 0
                        || properties?.optional.sql.insert.length > 0
                        || properties?.optional.sql.select.length > 0
                        || properties?.optional.sql.update.length > 0)
                    && (
                        <Grid columns={ 1 }>
                            <Grid.Column width={ 8 } textAlign="center">
                                <LinkButton
                                    type="button"
                                    onClick={ () => { setShowMore(!showMore); } }
                                    data-testid={ `${ testId }-show-more-button` }
                                >
                                    <Icon name={ showMore ? "chevron up" : "chevron down" } />
                                    { showMore ? t("common:showLess") : t("common:showMore") }
                                </LinkButton>
                            </Grid.Column>
                        </Grid>

                    )
                }

                { showMore && properties?.optional.nonSql.length > 0 && (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                {
                                    properties?.optional.nonSql?.map((property: TypeProperty, index: number) => {
                                        const name: string = property.description.split("#")[ 0 ];
                                        const isPassword: boolean = property.attributes
                                            .find(
                                                (attribute: PropertyAttribute) => attribute.name === "type"
                                            ).value === "password";
                                        const toggle: boolean = property.attributes
                                            .find(
                                                (attribute: PropertyAttribute) => attribute.name === "type"
                                            )?.value === "boolean";

                                        return (
                                            isPassword
                                                ? (
                                                    <Field
                                                        name={ property.name }
                                                        type={ isPasswordEditing ? "password" : "text" }
                                                        key={ index }
                                                        required={ isPasswordEditing }
                                                        label={ name }
                                                        requiredErrorMessage={
                                                            `${property.description.split("#")[ 0 ]} is  required`
                                                        }
                                                        icon={
                                                            (<Icon
                                                                name={ "eye" }
                                                                link
                                                                onClick={ () => {
                                                                    setIsPasswordEditing(!isPasswordEditing);
                                                                } }
                                                            />)
                                                        }
                                                        iconPosition="right"
                                                        showPassword={ t("common:showPassword") }
                                                        hidePassword={ t("common:hidePassword") }
                                                        placeholder={
                                                            t("userstores:forms." +
                                                                "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        data-testid={ `${ testId }-form--non-sql-password-input-${
                                                            property.name }` }
                                                        disabled={ readOnly }
                                                    />
                                                )
                                                : toggle
                                                    ? (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="toggle"
                                                            key={ index }
                                                            required={ false }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                t("userstores:forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            placeholder={
                                                                t("userstores:forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            toggle
                                                            data-testid={ `${ testId }-form--non-sql-toggle-${
                                                                property.name }` }
                                                            disabled={ readOnly }
                                                        />
                                                    ) :
                                                    (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="text"
                                                            key={ index }
                                                            required={ false }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                t("userstores:forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            placeholder={
                                                                t("userstores:forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            data-testid={ `${ testId }-form--non-sql-text-input-${
                                                                property.name }` }
                                                            disabled={ readOnly }
                                                        />
                                                    )
                                        );
                                    })
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) }
                { showMore
                && (properties?.optional.sql.delete.length > 0
                    || properties?.optional.sql.insert.length > 0
                    || properties?.optional.sql.select.length > 0
                    || properties?.optional.sql.update.length > 0)
                && (
                    <Grid columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <SqlEditor
                                onChange={ (name: string, value: string) => {
                                    const tempSql: Map<string,string> = new Map(sql);

                                    tempSql.set(name, value);
                                    setSql(tempSql);
                                } }
                                properties={ properties?.optional.sql }
                                values={ sql }
                                data-testid={ `${ testId }-sql-editor` }
                                readOnly={ readOnly }
                            />
                        </Grid.Column>
                    </Grid>
                )
                }
                <Grid columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        {
                            !readOnly && (
                                <PrimaryButton
                                    type="submit"
                                    data-testid={ `${ testId }-form-submit-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            )
                        }
                    </Grid.Column>
                </Grid>
            </Forms>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditConnectionDetails.defaultProps = {
    "data-testid": "userstore-connection-details-edit"
};
