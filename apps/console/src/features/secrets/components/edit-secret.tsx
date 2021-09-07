/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { Code, EmphasizedSegment } from "@wso2is/react-components";
import React, { FC, Fragment, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Divider, Grid, Message } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../core";
import { SecretModel } from "../models/secret";
import {
    SECRET_DESCRIPTION_LENGTH,
    SECRET_VALUE_LENGTH,
    secretValueValidator
} from "../utils/secrets.validation.utils";

const LOCAL_STORAGE_KEY = "showInfoMessage";

type EditSecretLocalStorage = {
    hideInfoMessage: boolean;
}

/**
 * Props type interface of {@link EditSecret}
 */
export type EditSecretProps = {
    editingSecret: SecretModel
} & IdentifiableComponentInterface;


/**
 * Don't get confused with the component {@link SecretEdit}. This component
 * is basically the inner component that actually does the editing.
 *
 * TODO: https://github.com/wso2/product-is/issues/12447
 * @param props {EditSecretProps}
 * @constructor
 */
const EditSecret: FC<EditSecretProps> = (props: EditSecretProps): ReactElement => {

    const {
        editingSecret,
        ["data-componentid"]: testId
    } = props;

    const [ showInfoMessage, setShowInfoMessage ] = useState<boolean>(false);
    const [ secretValueInvalid, setSecretValueInvalid ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<Record<string, any>>({});
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    useEffect(() => {
        if (editingSecret) {
            setInitialFormValues({
                secret_description: editingSecret.description
            });
        }
        checkAndRenderInfoMessage();
    }, []);

    const checkAndRenderInfoMessage = (): void => {
        try {
            // If message dismissed already shown don't show it again.
            const local = JSON.parse(
                LocalStorageUtils.getValueFromLocalStorage(LOCAL_STORAGE_KEY) ?? "{}"
            ) as EditSecretLocalStorage;
            if (local && local.hideInfoMessage === true) {
                setShowInfoMessage(false);
            } else {
                setShowInfoMessage(true);
            }
        } catch (e) {
            setShowInfoMessage(true);
        }
    };

    const InfoMessage: ReactElement = (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 10 }>
                    <Message
                        data-componentid={ `${ testId }-page-message` }
                        info
                        onDismiss={ () => {
                            LocalStorageUtils.setValueInLocalStorage(
                                LOCAL_STORAGE_KEY,
                                JSON.stringify({ hideInfoMessage: true } as EditSecretLocalStorage)
                            );
                            setShowInfoMessage(false);
                        } }>
                        <Message.Header>
                            <strong>Why can&apos;t I see the secret?</strong>
                        </Message.Header>
                        <Message.Content className="mt-2">
                            When you are creating a secret, you need to make sure you copy your
                            secret somewhere secure. Because { config.ui.productName }&nbsp;
                            will securely encrypt these information and
                            you won’t be able to see it again!
                        </Message.Content>
                    </Message>
                    <Divider hidden/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    return (
        <EmphasizedSegment padded="very">

            { showInfoMessage && InfoMessage }

            <Form
                uncontrolledForm={ false }
                onSubmit={ () => ({}) }
                initialValues={ initialFormValues }>
                <Field.Input
                    required
                    label="Secret Value"
                    name="secret_value"
                    ariaLabel="Secret value"
                    placeholder="Enter a Secret Value"
                    minLength={ SECRET_VALUE_LENGTH.min }
                    maxLength={ SECRET_VALUE_LENGTH.max }
                    type="password"
                    inputType="password"
                    hint={
                        <Fragment>
                            This is the value of the secret. You can enter a value between length&nbsp;
                            <Code>{ SECRET_VALUE_LENGTH.min }</Code> to <Code>{ SECRET_VALUE_LENGTH.max }</Code>.
                        </Fragment>
                    }
                    validate={ (value): string | undefined => {
                        const error = secretValueValidator(value);
                        setSecretValueInvalid(Boolean(error));
                        return error;
                    } }
                />
                <Field.Textarea
                    label="Secret Description"
                    ariaLabel="Secret's description"
                    placeholder="Enter a Secret Description"
                    name="secret_description"
                    minLength={ SECRET_DESCRIPTION_LENGTH.min }
                    maxLength={ SECRET_DESCRIPTION_LENGTH.max }
                    hint={
                        <Fragment>
                            Give a description for this secret (i.e., When to use this secret).
                            Note that you <strong>can update</strong> this description anytime.
                        </Fragment>
                    }
                />
                <Field.Button
                    disabled={ secretValueInvalid }
                    type="submit"
                    buttonType="primary_btn"
                    ariaLabel="Submit Secret Update Form"
                    label="Update"
                    name="submit"/>
            </Form>

        </EmphasizedSegment>
    );

};

/**
 * Default props of {@link EditSecret}
 */
EditSecret.defaultProps = {
    "data-componentid": "edit-secret"
};

export default EditSecret;
