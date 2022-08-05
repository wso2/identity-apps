/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import { Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector} from "react-redux";
import { Button, Grid, Icon, Modal, Divider } from "semantic-ui-react";
import { sendFeedback } from "./feedback-api";
import { AlertLevels } from "@wso2is/core/models";
import { AppState, store } from "../../../features/core";
import { addAlert } from "@wso2is/core/store";
import { ReactComponent as FeedBackIcon } from "../../assets/images/icons/feedback-outline.svg";

export default (): ReactElement => {

    const [ showFeedback, setShowFeedback ] = useState<boolean>(false);
    const [ isContactAllowed, setContactAllowed ] = useState<boolean>(false);
    const [ feedbackOption, setFeedbackOption ] = useState("suggestion");
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const userId: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const userEmail: any = useSelector((state: AppState) => state.profile.profileInfo.emails[0]);
    const tenantName = store.getState().config.deployment.tenant;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [submit, setSubmit] = useTrigger();

    const feedbackOptions = [
        { label: "Suggestion", value: "suggestion" },
        { label: "Complement", value: "complement" },
        { label: "Report a Bug", value: "bugReport" },
        { label: "Need Help", value: "helpRequest" },
        { label: "Contact Us", value: "contactUs" },
        { label: "Other", value: "other" }
    ];

    const closeWizard = () => {
        setShowFeedback(false);
        setCurrentWizardStep(0);
        setContactAllowed(false);
        setFeedbackOption("suggestion");
    }

    /**
     * Handles form value change.
     *
     * @param {boolean} isPure - Is the form pure.
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleFormValuesOnChange = (isPure: boolean, values: Map<string, FormValue>) => {
        if (feedbackOption === "suggestion" || feedbackOption === "complement" || feedbackOption === "bugReport") {
            if (values.get("allowToContact").includes("contactAllowed") !== isContactAllowed) {
                setContactAllowed(!!values.get("allowToContact").includes("contactAllowed"));
            }
        }
    };

    const handleFeedbackOptions = () => {
        if (feedbackOption &&
            (feedbackOption === "helpRequest" || feedbackOption === "contactUs" || feedbackOption === "other")) {
            return (
                <Grid columns={ 2 } >
                    <Grid.Row>
                        <Grid.Column>
                            <Field
                                label="Email Address"
                                name="email"
                                placeholder="Enter your email address"
                                required={ true }
                                disabled
                                requiredErrorMessage="Email cannot be empty if you want us to contact you regarding this feedback"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.email(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            "Please enter a valid email address"
                                        );
                                    }
                                }
                                }
                                value={ userEmail }
                                type="email"
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Field
                                label="Contact Number (Optional)"
                                name="contactNo"
                                placeholder="Enter your contact number"
                                required={ false }
                                requiredErrorMessage={ t(
                                    ""
                                ) }
                                type="number"
                                min="1"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.mobileNumber(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push("Please enter a valid contact number");
                                    }
                                }
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Hint>
                        Your contact details will not be used for any purpose other than this.
                        Please see our <a href={ "../privacy" }>Privacy Policy</a> for more information.
                    </Hint>
                </Grid>
            );
        } else if (feedbackOption &&
            (feedbackOption === "suggestion" || feedbackOption === "complement" || feedbackOption === "bugReport")) {
            return (
                <>
                    <Field
                        name="allowToContact"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: "Asgardeo may contact me regarding this feedback",
                                value: "contactAllowed"
                            }
                        ] }
                        value={ isContactAllowed ? [ "contactAllowed" ] : [] }
                    />
                    { isContactAllowed && (
                        <Field
                            label="Email Address"
                            name="email"
                            placeholder="Enter your email address"
                            required={ isContactAllowed }
                            disabled={ isContactAllowed }
                            requiredErrorMessage= "Email cannot be empty if you are okay with us contacting you regarding this feedback"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.email(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("Please enter a valid email address");
                                }
                            }
                            }
                            value={ isContactAllowed ? userEmail : null }
                            type="email"
                        />
                    ) }
                    { isContactAllowed && (
                        <Field
                            label="Contact No (Optional)"
                            name="contactNo"
                            placeholder="Enter your contact number"
                            required={ false }
                            disabled={ !isContactAllowed }
                            requiredErrorMessage={ t(
                                ""
                            ) }
                            type="number"
                            min="1"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.mobileNumber(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("Please enter a valid contact number");
                                }
                            }
                            }
                        />
                    ) }
                    <Hint disabled={ !isContactAllowed }>
                        Your contact details will not be used for any purpose other than this.
                        Please see our <a href={ "../privacy" }>Privacy Policy</a> for more information.
                    </Hint>
                </>
            );
        } else {
            return "";
        }
    };

    const handleDisplayMessage = () => {
        if (feedbackOption &&
            (isContactAllowed || feedbackOption === "helpRequest" || feedbackOption === "contactUs" ||
                feedbackOption === "other")) {
            return (
                <>
                    <Heading size="medium"> Thank you for submitting your feedback. </Heading>
                    <Heading subHeading compact size="small"> We need some time to review your request.</Heading>
                    <Heading subHeading size="small"> When we are done, we will be in touch.</Heading>
                </>
            );
        } else if (feedbackOption &&
            (feedbackOption === "suggestion" || feedbackOption === "complement" || feedbackOption === "bugReport")) {
            return (
                <>
                    <Heading size="medium"> Thank you for submitting your feedback. </Heading>
                </>
            );
        } else {
            return "";
        }
    };

    const STEPS = [
        {
            content: (
                <>
                    <Forms
                        onSubmit={
                            (formValue) => submitFeedback(formValue)
                        }
                        submitState={ submit }
                        onChange={ handleFormValuesOnChange }
                    >
                        <Grid columns={ 3 } className="feedback-category">
                            <label>Please select your feedback category below</label>
                            <Grid.Row>
                                <Grid.Column>
                                    <input type='radio' value='suggestion' name='feedbackOption' id='suggestion' onChange={
                                        (values) => {
                                            setFeedbackOption(
                                                values.currentTarget.value.toString());
                                        }
                                    }/>
                                    <label htmlFor='suggestion'>
                                        <Icon name="lightbulb"/> Suggestion
                                    </label>
                                </Grid.Column>
                                <Grid.Column>
                                    <input type='radio' value='complement' name='feedbackOption' id='complement' onChange={
                                        (values) => {
                                            setFeedbackOption(
                                                values.currentTarget.value.toString());
                                        }
                                    }/>
                                    <label htmlFor='complement'>
                                        <Icon name="thumbs up"/> Complement
                                    </label>
                                </Grid.Column>
                                <Grid.Column>
                                    <input type='radio' value='bugReport' name='feedbackOption' id='bugReport' onChange={
                                        (values) => {
                                            setFeedbackOption(
                                                values.currentTarget.value.toString());
                                        }
                                    }/>
                                    <label htmlFor='bugReport'>
                                        <Icon name="bug"/> Report a Bug
                                    </label>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <input type='radio' value='helpRequest' name='feedbackOption' id='helpRequest' onChange={
                                        (values) => {
                                            setFeedbackOption(
                                                values.currentTarget.value.toString());
                                        }
                                    }/>
                                    <label htmlFor='helpRequest'>
                                        <Icon name="question circle"/> Need Help
                                    </label>
                                </Grid.Column>
                                <Grid.Column>
                                    <input type='radio' value='contactUs' name='feedbackOption' id='contactUs' onChange={
                                        (values) => {
                                            setFeedbackOption(
                                                values.currentTarget.value.toString());
                                        }
                                    }/>
                                    <label htmlFor='contactUs'>
                                        <Icon name="comments"/> Contact Us
                                    </label>
                                </Grid.Column>
                                <Grid.Column>
                                    <input type='radio' value='other' name='feedbackOption' id='other' onChange={
                                        (values) => {
                                            setFeedbackOption(
                                                values.currentTarget.value.toString());
                                        }
                                    }/>
                                    <label htmlFor='other'>
                                        <Icon name="comment alternate"/> Other
                                    </label>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Field
                            label="Please leave your feedback below (maximum 2000 characters)"
                            name="message"
                            placeholder="Enter your suggestion/problem/complaint here"
                            required={ true }
                            requiredErrorMessage="Feedback message cannot be empty."
                            type="textarea"
                            maxLength="2000"
                        />
                        { handleFeedbackOptions() }
                    </Forms>
                </>
            )
        },
        {
            content: <>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                            <div style={ { padding: "1rem" } }>
                                <div style={ { marginBottom: "1rem", marginTop: "2rem" } }>
                                    <Icon color="orange" name="check circle" size="massive"/>
                                </div>
                                { handleDisplayMessage() }
                                <Divider hidden />
                                <PrimaryButton size="medium" onClick={ (): void => closeWizard() }>Close</PrimaryButton>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        }
    ];

    /**
     * This function handles storing the feedback.
     */
    const submitFeedback = (data: Map<string, FormValue>) => {

        const tags = [];
        tags.push(feedbackOption);
        const feedbackData = {
            "contactNo": data.get("contactNo"),
            "email": data.get("email"),
            "message": data.get("message"),
            "tags": tags,
            "tenantDomain": tenantName,
            "userId": userId
        };

        setIsSubmitting(true);

        sendFeedback(feedbackData).then(() => {
            setCurrentWizardStep(currentWizardStep + 1);
            dispatch(addAlert(
                {
                    description: "Your feedback was submitted successfully",
                    level: AlertLevels.SUCCESS,
                    message: "Feedback submitted successfully"
                }
            ));
        }).catch(error => {
            closeWizard();
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while submitting the feedback",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error submitting the feedback"
                }
            ));
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <>
            <Button className="feedback" onClick={ () => setShowFeedback(true) }>
                <FeedBackIcon className="feedback-icon" /> Feedback
            </Button>
            {
                showFeedback &&
                <Modal
                    open={ true }
                    dimmer="inverted"
                    size="small"
                    onClose={ (): void => closeWizard()  }
                    closeOnDimmerClick
                    closeOnEscape
                >
                    { currentWizardStep == 0 && (
                        <Modal.Header className="wizard-header">
                            Let us Discuss Your Feedback
                        </Modal.Header>
                    ) }
                    <Modal.Content className="content-container" scrolling>
                        { STEPS[ currentWizardStep ].content }
                    </Modal.Content>
                    { currentWizardStep == 0 && (
                        <Modal.Actions>
                            <Grid>
                                <Grid.Row column={ 1 }>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                        <LinkButton floated="left" onClick={ (): void => closeWizard() }>
                                            Cancel
                                        </LinkButton>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                        <PrimaryButton
                                            type="submit"
                                            floated="right"
                                            onClick={ () => { setSubmit(); } }
                                            loading={ isSubmitting }
                                            disabled={ isSubmitting }
                                        >
                                            Submit</PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Actions>
                    ) }
                </Modal>
            }
        </>
    );
};
