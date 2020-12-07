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

import { getProfileSchemas } from "@wso2is/core/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertInterface,
    AlertLevels,
    Claim,
    ProfileSchemaInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert, setProfileSchemaRequestLoadingStatus, setSCIMSchemas } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import {
    ConfirmationModal,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Form, Grid, Popup } from "semantic-ui-react";
import { AppConstants, history } from "../../../../core";
import { deleteAClaim, updateAClaim } from "../../../api";

/**
 * Prop types for `EditBasicDetailsLocalClaims` component
 */
interface EditBasicDetailsLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The claim to be edited
     */
    claim: Claim;
    /**
     * The function to be called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the Basic Details pane of the edit local claim screen
 *
 * @param {EditBasicDetailsLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditBasicDetailsLocalClaims: FunctionComponent<EditBasicDetailsLocalClaimsPropsInterface> = (
    props: EditBasicDetailsLocalClaimsPropsInterface
): ReactElement => {

    const {
        claim,
        update,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ isShowNameHint, setIsShowNameHint ] = useState(false);
    const [ isShowRegExHint, setIsShowRegExHint ] = useState(false);
    const [ isShowDisplayOrderHint, setIsShowDisplayOrderHint ] = useState(false);
    const [ isShowDisplayOrder, setIsShowDisplayOrder ] = useState(false);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    const nameField = useRef<HTMLElement>(null);
    const regExField = useRef<HTMLElement>(null);
    const displayOrderField = useRef<HTMLElement>(null);

    const nameTimer = useRef(null);
    const regExTimer = useRef(null);
    const displayTimer = useRef(null);

    const { t } = useTranslation();

    useEffect(() => {
        if (claim?.supportedByDefault) {
            setIsShowDisplayOrder(true);
        }
    }, [ claim ]);

    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setConfirmDelete(false) }
            type="warning"
            open={ confirmDelete }
            assertion={ claim.displayName }
            assertionHint={
                <p>
                    <Trans i18nKey="console:manage.features.claims.local.confirmation.hint">
                        Please type <strong>{ { name: claim.displayName } }</strong> to confirm.
                    </Trans>
                </p>
            }
            assertionType="input"
            primaryAction={ t("console:manage.features.claims.local.confirmation.primaryAction") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setConfirmDelete(false) }
            onPrimaryActionClick={ (): void => deleteLocalClaim(claim.id) }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header>
                { t("console:manage.features.claims.local.confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message attached warning>
                { t("console:manage.features.claims.local.confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content>
                { t("console:manage.features.claims.local.confirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * This deletes a local claim
     * @param {string} id
     */
    const deleteLocalClaim = (id: string) => {
        deleteAClaim(id).then(() => {
            history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
            dispatch(addAlert(
                {
                    description: t("console:manage.features.claims.local.notifications.deleteClaim.success." + 
                        "description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.claims.local.notifications.deleteClaim.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("console:manage.features.claims.local.notifications.deleteClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.claims.local.notifications.deleteClaim.genericError.message")
                }
            ));
        });
    };

    /**
     * This shows a popup with a delay of 500 ms.
     *
     * @param {React.Dispatch<React.SetStateAction<boolean>>} callback The state dispatch method.
     * @param {React.MutableRefObject<any>} ref The ref object carrying the `setTimeout` ID.
     */
    const delayPopup = (
        callback: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.MutableRefObject<any>
    ): void => {
        ref.current = setTimeout(() => callback(true), 500);
    };

    /**
     * This closes the popup.
     *
     * @param {React.Dispatch<React.SetStateAction<boolean>>} callback The state dispatch method.
     * @param {React.MutableRefObject<any>} ref The ref object carrying the `setTimeout` ID.
     */
    const closePopup = (
        callback: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.MutableRefObject<any>
    ): void => {
        clearTimeout(ref.current);
        callback(false);
    };

    /**
     * Fetch the updated SCIM2 schema list.
     */
    const fetchUpdatedSchemaList = (): void => {
        dispatch(setProfileSchemaRequestLoadingStatus(true));

        getProfileSchemas()
            .then((response: ProfileSchemaInterface[]) => {
                dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("console:manage.notifications.getProfileSchema.error.message")
                        })
                    );
                }

                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.notifications.getProfileSchema.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.notifications.getProfileSchema.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                dispatch(setProfileSchemaRequestLoadingStatus(false));
            });
    };

    return (
        <>
            { confirmDelete && deleteConfirmation() }
            <EmphasizedSegment>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                            <Form>
                                <Form.Field
                                    data-testid={ `${ testId }-form-attribute-uri-readonly-input` }
                                >
                                    <label>{ t("console:manage.features.claims.local.attributes.attributeURI") }</label>
                                    <CopyInputField value={ claim ? claim.claimURI : "" } />
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Forms
                    onSubmit={ (values) => {
                        const data: Claim = {
                            attributeMapping: claim.attributeMapping,
                            claimURI: claim.claimURI,
                            description: values.get("description").toString(),
                            displayName: values.get("name").toString(),
                            displayOrder: values.get("displayOrder") ?
                                parseInt(values.get("displayOrder").toString()) : claim.displayOrder,
                            properties: claim.properties,
                            readOnly: values.get("readOnly").length > 0,
                            regEx: values.get("regularExpression").toString(),
                            required: values.get("required").length > 0,
                            supportedByDefault: values.get("supportedByDefault").length > 0

                        };
                        updateAClaim(claim.id, data).then(() => {
                            dispatch(addAlert(
                                {
                                    description: t("console:manage.features.claims.local.notifications." +
                                        "updateClaim.success.description"),
                                    level: AlertLevels.SUCCESS,
                                    message: t("console:manage.features.claims.local.notifications." +
                                        "updateClaim.success.message")
                                }
                            ));
                            update();
                            fetchUpdatedSchemaList();
                        }).catch(error => {
                            dispatch(addAlert(
                                {
                                    description: error?.description
                                        || t("console:manage.features.claims.local.notifications.updateClaim." +
                                            "genericError.description"),
                                    level: AlertLevels.ERROR,
                                    message: error?.message
                                        || t("console:manage.features.claims.local.notifications." +
                                            "updateClaim.genericError.description")
                                }
                            ));
                        });
                    } }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                                <Field
                                    onMouseOver={ () => {
                                        delayPopup(setIsShowNameHint, nameTimer);
                                    } }
                                    onMouseOut={ () => {
                                        closePopup(setIsShowNameHint, nameTimer);
                                    } }
                                    type="text"
                                    name="name"
                                    label={ t("console:manage.features.claims.local.forms.name.label") }
                                    required={ true }
                                    requiredErrorMessage={ t("console:manage.features.claims.local.forms." +
                                        "name.requiredErrorMessage") }
                                    placeholder={ t("console:manage.features.claims.local.forms.name.placeholder") }
                                    value={ claim?.displayName }
                                    ref={ nameField }
                                    data-testid={ `${ testId }-form-name-input` }
                                />
                                <Popup
                                    content={ t("console:manage.features.claims.local.forms.nameHint") }
                                    inverted
                                    open={ isShowNameHint }
                                    trigger={ <span></span> }
                                    onClose={ () => {
                                        closePopup(setIsShowNameHint, nameTimer);
                                    } }
                                    position="bottom left"
                                    context={ nameField }
                                />
                                <Divider hidden />
                                <Field
                                    type="textarea"
                                    name="description"
                                    label={ t("console:manage.features.claims.local.forms.description.label") }
                                    required={ true }
                                    requiredErrorMessage={ t("console:manage.features.claims.local.forms.description." +
                                        "requiredErrorMessage") }
                                    placeholder={
                                        t("console:manage.features.claims.local.forms.description.placeholder")
                                    }
                                    value={ claim?.description }
                                    data-testid={ `${ testId }-form-description-input` }
                                />
                                <Divider hidden />
                                <Field
                                    type="text"
                                    name="regularExpression"
                                    label={ t("console:manage.features.claims.local.forms.regEx.label") }
                                    required={ false }
                                    requiredErrorMessage=""
                                    placeholder={ t("console:manage.features.claims.local.forms.regEx.placeholder") }
                                    value={ claim?.regEx }
                                    onMouseOver={ () => {
                                        delayPopup(setIsShowRegExHint, regExTimer);
                                    } }
                                    onMouseOut={ () => {
                                        closePopup(setIsShowRegExHint, regExTimer);
                                    } }
                                    ref={ regExField }
                                    data-testid={ `${ testId }-form-regex-input` }
                                />
                                <Popup
                                    content={ t("console:manage.features.claims.local.forms.regExHint") }
                                    inverted
                                    open={ isShowRegExHint }
                                    trigger={ <span></span> }
                                    onClose={ () => {
                                        closePopup(setIsShowRegExHint, regExTimer);
                                    } }
                                    position="bottom left"
                                    context={ regExField }
                                />
                                <Divider hidden />
                                <Field
                                    type="checkbox"
                                    name="supportedByDefault"
                                    required={ false }
                                    requiredErrorMessage=""
                                    children={ [ {
                                        label: t("console:manage.features.claims.local.forms.supportedByDefault.label"),
                                        value: "Support"
                                    } ] }
                                    value={ claim?.supportedByDefault ? [ "Support" ] : [] }
                                    listen={ (values: Map<string, FormValue>) => {
                                        setIsShowDisplayOrder(values?.get("supportedByDefault")?.length > 0);
                                    } }
                                    data-testid={ `${ testId }-form-supported-by-default-input` }
                                />
                                {
                                    isShowDisplayOrder
                                    && (
                                        <>
                                            <Field
                                                type="number"
                                                min="0"
                                                name="displayOrder"
                                                label={ t("console:manage.features.claims.local.forms.displayOrder" +
                                                    ".label") }
                                                required={ false }
                                                requiredErrorMessage=""
                                                placeholder={ t("console:manage.features.claims.local.forms." +
                                                    "displayOrder.placeholder") }
                                                value={ claim?.displayOrder.toString() }
                                                onMouseOver={ () => {
                                                    delayPopup(setIsShowDisplayOrderHint, displayTimer);
                                                } }
                                                onMouseOut={ () => {
                                                    closePopup(setIsShowDisplayOrderHint, displayTimer);
                                                } }
                                                ref={ displayOrderField }
                                                data-testid={ `${ testId }-form-display-order-input` }
                                            />
                                            <Popup
                                                content={
                                                    t("console:manage.features.claims.local.forms.displayOrderHint")
                                                }
                                                inverted
                                                open={ isShowDisplayOrderHint }
                                                trigger={ <span></span> }
                                                onClose={ () => {
                                                    closePopup(setIsShowDisplayOrderHint, displayTimer);
                                                } }
                                                position="bottom left"
                                                context={ displayOrderField }
                                            />
                                        </>
                                    )
                                }
                                <Divider hidden />
                                <Field
                                    type="checkbox"
                                    name="required"
                                    required={ false }
                                    requiredErrorMessage=""
                                    children={ [ {
                                        label: t("console:manage.features.claims.local.forms.required.label"),
                                        value: "Required"
                                    } ] }
                                    value={ claim?.required ? [ "Required" ] : [] }
                                    data-testid={ `${ testId }-form-required-checkbox` }
                                />
                                <Divider hidden />
                                <Field
                                    type="checkbox"
                                    name="readOnly"
                                    required={ false }
                                    requiredErrorMessage=""
                                    children={ [ {
                                        label: t("console:manage.features.claims.local.forms.readOnly.label"),
                                        value: "ReadOnly"
                                    } ] }
                                    value={ claim?.readOnly ? [ "ReadOnly" ] : [] }
                                    data-testid={ `${ testId }-form-readonly-checkbox` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 6 }>
                                <Field
                                    type="submit"
                                    value={ t("common:update") }
                                    data-testid={ `${ testId }-form-submit-button` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            </EmphasizedSegment>
            <Divider hidden />
            <DangerZoneGroup
                sectionHeader={ t("common:dangerZone") }
                data-testid={ `${ testId }-danger-zone-group` }
            >
                <DangerZone
                    actionTitle={ t("console:manage.features.claims.local.dangerZone.actionTitle") }
                    header={ t("console:manage.features.claims.local.dangerZone.header") }
                    subheader={ t("console:manage.features.claims.local.dangerZone.subheader") }
                    onActionClick={ () => setConfirmDelete(true) }
                    data-testid={ `${ testId }-local-claim-delete-danger-zone` }
                />
            </DangerZoneGroup>
        </>
    );
};

/**
 * Default props for the component.
 */
EditBasicDetailsLocalClaims.defaultProps = {
    "data-testid": "local-claims-basic-details-edit"
};
