/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { GearIcon } from "@oxygen-ui/react-icons";
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Typography from "@oxygen-ui/react/Typography";
import SelectiveOrgSubscription from "@wso2is/common.ui.selective-org-subscription.v1/components/selective-org-subscription";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalFormField } from "@wso2is/forms";
import { ConfirmationModal, Hint } from "@wso2is/react-components";
import CheckboxAdapter from "@wso2is/forms/src/components/adapters/checkbox-field-adapter";
import { AxiosError, AxiosResponse } from "axios";
import { FormApi } from "final-form";
import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useForm, useFormState } from "react-final-form";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetChannelOrganizations from "../api/use-get-channel-organizations";
import { useHandleWebhookError } from "../utils/alert-utils";
import { WebhookChannelConfigInterface } from "../models/event-profile";
import { ChildOrgSubscriptionPolicy, PolicySwitchApproach } from "../models/shared-access";
import {
    OrganizationReferenceInterface,
    SubscribedOrganizationListInterface,
    WebhookChannelFormValueInterface,
    WebhookConfigFormPropertyInterface
} from "../models/webhooks";

/**
 * Ceiling the API puts on an explicit organization list (`maxItems: 100`).
 */
const MAX_SELECTABLE_ORGANIZATIONS: number = 100;

interface WebhookChannelAccordionItemPropsInterface extends IdentifiableComponentInterface {
    /**
     * The channel this row represents.
     */
    channel: WebhookChannelConfigInterface;
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Whether this row is the one currently expanded.
     *
     * Expansion is owned by the parent so that only one channel is open at a time.
     */
    isExpanded: boolean;
    /**
     * Called when the row is expanded or collapsed.
     */
    onExpandedChange: (expanded: boolean) => void;
    /**
     * ID of the webhook being edited. Absent while creating.
     */
    webhookId?: string;
    /**
     * Whether the organization has child organizations.
     *
     * The policy is always offered; without child organizations only the "selected
     * organizations" option is disabled, matching the application and user sharing forms.
     */
    isChildOrganizationsAvailable: boolean;
    /**
     * Subscription status indicator rendered beside the channel name.
     */
    statusIndicator?: ReactNode;
    /**
     * Validation message for this channel's organization selection, if any.
     */
    organizationsError?: string;
    /**
     * Whether child organization subscription is switched on for this deployment.
     *
     * Unlike {@link isChildOrganizationsAvailable}, which disables one radio, this removes the
     * policy altogether: the row keeps its checkbox but stops being expandable.
     */
    isChildOrgSubscriptionEnabled: boolean;
    /**
     * The policy the server currently has stored for this channel.
     *
     * Not the form value: the narrowing prompt keys off what is saved, so local flipping
     * does not keep re-asking.
     */
    storedSubscriptionPolicy?: ChildOrgSubscriptionPolicy;
}

/**
 * A single event channel, rendered as an accordion row.
 *
 * The checkbox subscribes the channel only; every other part of the row expands or collapses.
 */
const WebhookChannelAccordionItem: FunctionComponent<WebhookChannelAccordionItemPropsInterface> = ({
    channel,
    isReadOnly,
    isExpanded,
    onExpandedChange,
    webhookId,
    isChildOrganizationsAvailable,
    isChildOrgSubscriptionEnabled,
    statusIndicator,
    organizationsError,
    storedSubscriptionPolicy,
    ["data-componentid"]: componentId = "webhook-channel-accordion-item"
}: WebhookChannelAccordionItemPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const handleError: (error: AxiosError<HttpErrorResponseDataInterface>, operation: string) => void =
        useHandleWebhookError();
    const form: FormApi<WebhookConfigFormPropertyInterface> = useForm();
    const { values } = useFormState<WebhookConfigFormPropertyInterface>();

    const channelValue: WebhookChannelFormValueInterface | undefined = values?.channels?.[channel.key];
    const isSubscribed: boolean = Boolean(channelValue?.subscribed);
    const subscriptionPolicy: ChildOrgSubscriptionPolicy =
        channelValue?.subscriptionPolicy ?? ChildOrgSubscriptionPolicy.NONE;
    const isSelectedOrgsPolicy: boolean = subscriptionPolicy === ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY;
    // The saved policy, not the one currently picked in the form. Only a channel saved under
    // SELECTED_ORGS_ONLY has a stored selection to restore.
    const isStoredSelectedOrgsPolicy: boolean =
        storedSubscriptionPolicy === ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY;

    const organizationsFieldName: string = `channels.${ channel.key }.organizations`;

    const [ isPolicySwitchModalOpen, setIsPolicySwitchModalOpen ] = useState<boolean>(false);
    const [ policySwitchApproach, setPolicySwitchApproach ] = useState<PolicySwitchApproach>(null);
    // Non-zero while a "preserve" switch is waiting on the organizations it should carry over.
    const [ preserveRequestCount, setPreserveRequestCount ] = useState<number>(0);

    // Read from the channel sub-resource, which is the only place the list appears. Loaded on
    // policy rather than on expand: saving needs the full list, omitting it no longer preserves it.
    const shouldLoadOrganizations: boolean =
        (isSelectedOrgsPolicy || preserveRequestCount > 0) && Boolean(channelValue?.channelId);

    const {
        data: subscribedOrganizations,
        error: subscribedOrganizationsError,
        mutate: revalidateSubscribedOrganizations
    } = useGetChannelOrganizations<SubscribedOrganizationListInterface, HttpErrorResponseDataInterface>(
        webhookId,
        channelValue?.channelId,
        shouldLoadOrganizations
    );

    /**
     * Seed the form with the stored selection, tracked against the identity of `initialValues`
     * so a save, which reinitialises the form and empties this field, re-seeds it.
     */
    // Parents of the stored selection, so the tree opens straight to what is ticked.
    const [ selectionAncestorOrgIds, setSelectionAncestorOrgIds ] = useState<string[]>([]);

    const seededForInitialValuesRef: MutableRefObject<unknown> = useRef<unknown>(null);

    useEffect(() => {
        // Gated on the stored policy: the sub-resource reports the current fanout whatever the
        // policy is, so seeding after a local switch would undo the prompt's "start from scratch".
        if (!shouldLoadOrganizations || !isStoredSelectedOrgsPolicy) {
            return;
        }

        const currentInitialValues: unknown = form.getState().initialValues;

        if (seededForInitialValuesRef.current === currentInitialValues) {
            return;
        }
        if (channelValue?.organizations?.length > 0) {
            seededForInitialValuesRef.current = currentInitialValues;

            return;
        }

        // Claimed before the request resolves so an in-flight re-render does not start a second.
        // Released if it yields nothing: the hook does not retry, and a save would persist empty.
        seededForInitialValuesRef.current = currentInitialValues;

        let isStale: boolean = false;

        revalidateSubscribedOrganizations()
            .then((response: AxiosResponse<SubscribedOrganizationListInterface>) => {
                if (isStale) {
                    return;
                }

                if (!response?.data?.organizations) {
                    seededForInitialValuesRef.current = null;

                    return;
                }

                form.change(
                    organizationsFieldName as never,
                    response.data.organizations.map(
                        (organization: OrganizationReferenceInterface) => organization.orgId
                    ) as never
                );

                setSelectionAncestorOrgIds(
                    response.data.organizations
                        .map((organization: OrganizationReferenceInterface) => organization.parentOrgId)
                        .filter((parentOrgId: string, index: number, all: string[]) =>
                            parentOrgId && all.indexOf(parentOrgId) === index)
                );
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                if (isStale) {
                    return;
                }

                // Reported rather than swallowed: the saved selection is not on screen, and the
                // only other signal is the validation error hit on save.
                seededForInitialValuesRef.current = null;
                handleError(error, "fetchOrganizations");
            });

        return () => {
            isStale = true;
        };
    }, [ shouldLoadOrganizations, isStoredSelectedOrgsPolicy, channelValue?.organizations ]);

    const handleOrganizationsChange = (orgIds: string[]): void => {
        form.change(`channels.${ channel.key }.organizations` as never, orgIds as never);
    };

    const applyPolicy = (policy: ChildOrgSubscriptionPolicy, orgIds: string[]): void => {
        form.change(`channels.${ channel.key }.subscriptionPolicy` as never, policy as never);
        form.change(organizationsFieldName as never, orgIds as never);
    };

    const closePolicySwitchModal = (): void => {
        setIsPolicySwitchModalOpen(false);
        setPolicySwitchApproach(null);
    };

    /**
     * Narrowing from every child organization to an explicit few is the one transition that can
     * silently drop state, so it is the one that asks first.
     */
    const handlePolicyChange = (policy: ChildOrgSubscriptionPolicy): void => {
        const isNarrowing: boolean =
            storedSubscriptionPolicy === ChildOrgSubscriptionPolicy.ALL_EXISTING_AND_FUTURE_ORGS
            && policy === ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY;

        if (isNarrowing) {
            setIsPolicySwitchModalOpen(true);

            return;
        }

        // Carried across a policy change rather than cleared: it is only sent under
        // SELECTED_ORGS_ONLY, and clearing it would let a round trip empty a saved selection.
        applyPolicy(policy, channelValue?.organizations ?? []);
    };

    const handlePolicySwitchConfirm = (): void => {
        if (policySwitchApproach === PolicySwitchApproach.RESET) {
            applyPolicy(ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY, []);
            closePolicySwitchModal();

            return;
        }

        // Preserve: the organizations receiving events are not on the webhook, so they must be
        // fetched before becoming the starting selection.
        setPreserveRequestCount((previous: number) => previous + 1);
        setIsPolicySwitchModalOpen(false);
    };

    /**
     * Complete a "preserve" switch once the organizations are in hand. A fanout wider than the
     * 100 the request caps at is abandoned rather than silently truncated.
     */
    useEffect(() => {
        if (preserveRequestCount === 0) {
            return;
        }

        // The hook does not retry, so a failed fetch would leave the switch pending all session
        // and a later read would apply the policy long after the user moved on.
        if (subscribedOrganizationsError) {
            setPreserveRequestCount(0);
            closePolicySwitchModal();
            handleError(subscribedOrganizationsError, "fetchOrganizations");

            return;
        }

        if (!subscribedOrganizations?.organizations) {
            return;
        }

        setPreserveRequestCount(0);

        const orgIds: string[] = subscribedOrganizations.organizations.map(
            (organization: OrganizationReferenceInterface) => organization.orgId
        );

        if (subscribedOrganizations.totalResults > MAX_SELECTABLE_ORGANIZATIONS) {
            dispatch(addAlert({
                description: t("webhooks:configForm.channels.subscriptionPolicy.switchModal." +
                    "tooManyOrganizations", { count: MAX_SELECTABLE_ORGANIZATIONS }),
                level: AlertLevels.WARNING,
                message: t("webhooks:configForm.channels.subscriptionPolicy.switchModal." +
                    "tooManyOrganizationsHeading")
            }));
            closePolicySwitchModal();

            return;
        }

        applyPolicy(ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY, orgIds);
        closePolicySwitchModal();
    }, [ subscribedOrganizations, subscribedOrganizationsError, preserveRequestCount ]);

    const renderSubscriptionPolicy = (): ReactElement => (
        <>
            <Typography variant="h6" className="subscription-policy-heading">
                { t("webhooks:configForm.channels.subscriptionPolicy.heading") }
            </Typography>
            <Typography variant="body2" color="text.secondary" className="subscription-policy-description">
                { t("webhooks:configForm.channels.subscriptionPolicy.subHeading") }
            </Typography>
            <RadioGroup
                aria-label={ t("webhooks:configForm.channels.subscriptionPolicy.heading") }
                data-componentid={ `${ componentId }-policy-radio-group` }
                value={ subscriptionPolicy }
                onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                    handlePolicyChange(event.target.value as ChildOrgSubscriptionPolicy) }
            >
                <FormControlLabel
                    value={ ChildOrgSubscriptionPolicy.NONE }
                    control={ <Radio /> }
                    disabled={ isReadOnly || !isSubscribed }
                    label={ t("webhooks:configForm.channels.subscriptionPolicy.none") }
                    data-componentid={ `${ componentId }-policy-none` }
                />
                <FormControlLabel
                    value={ ChildOrgSubscriptionPolicy.ALL_EXISTING_AND_FUTURE_ORGS }
                    control={ <Radio /> }
                    disabled={ isReadOnly || !isSubscribed }
                    label={ t("webhooks:configForm.channels.subscriptionPolicy.allOrganizations") }
                    data-componentid={ `${ componentId }-policy-all-orgs` }
                />
                <FormControlLabel
                    value={ ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY }
                    control={ <Radio /> }
                    disabled={ isReadOnly || !isSubscribed || !isChildOrganizationsAvailable }
                    label={ isChildOrganizationsAvailable
                        ? t("webhooks:configForm.channels.subscriptionPolicy.selectedOrganizations")
                        : (
                            <>
                                { t("webhooks:configForm.channels.subscriptionPolicy.selectedOrganizations") }
                                <Hint inline popup>
                                    { t("organizations:placeholders.emptyList.subtitles.0") }
                                </Hint>
                            </>
                        ) }
                    data-componentid={ `${ componentId }-policy-selected-orgs` }
                />
            </RadioGroup>
            { isSelectedOrgsPolicy && (
                <Box className="subscription-policy-org-tree">
                    <SelectiveOrgSubscription
                        data-componentid={ `${ componentId }-org-tree` }
                        selectedOrgIds={ channelValue?.organizations ?? [] }
                        onChange={ handleOrganizationsChange }
                        disabled={ isReadOnly || !isSubscribed }
                        autoExpandFirstLevel
                        autoExpandOrgIds={ selectionAncestorOrgIds }
                        expandAllLabel={ t("webhooks:configForm.channels.subscriptionPolicy.expandAll") }
                        collapseAllLabel={ t("webhooks:configForm.channels.subscriptionPolicy.collapseAll") }
                        fetchErrorMessage={ t("webhooks:notifications.fetchOrganizations.error.message") }
                        fetchErrorDescription={ t("webhooks:notifications.fetchOrganizations.error.description") }
                        emptyPlaceholderText={ t("webhooks:configForm.channels.subscriptionPolicy.noOrganizations") }
                    />
                    { organizationsError && (
                        <FormHelperText error data-componentid={ `${ componentId }-org-error` }>
                            { organizationsError }
                        </FormHelperText>
                    ) }
                </Box>
            ) }
        </>
    );

    return (
        <Accordion
            disableGutters
            elevation={ 0 }
            expanded={ isChildOrgSubscriptionEnabled && isExpanded }
            onChange={ isChildOrgSubscriptionEnabled
                ? (_event: SyntheticEvent, expanded: boolean) => onExpandedChange(expanded)
                : undefined }
            data-componentid={ `${ componentId }-${ channel.key }` }
            className={ `webhook-channel-accordion${ isChildOrgSubscriptionEnabled ? "" : " static" }` }
        >
            <AccordionSummary
                expandIcon={ isChildOrgSubscriptionEnabled ? <GearIcon /> : null }
                className="channel-summary"
            >
                { /* Stopped here so that ticking a channel never also expands it. */ }
                <Box
                    className="channel-checkbox-control"
                    onClick={ (event: MouseEvent<HTMLDivElement>) => event.stopPropagation() }
                >
                    <FinalFormField
                        ariaLabel={ channel.name }
                        data-componentid={ `${ componentId }-${ channel.key }-checkbox` }
                        name={ `channels.${ channel.key }.subscribed` }
                        component={ CheckboxAdapter }
                        disabled={ isReadOnly }
                    />
                </Box>
                <Box className="channel-label">
                    <Box className="channel-name-container">
                        <Typography variant="body1" component="span" className="channel-name">
                            { channel.name }
                        </Typography>
                        { statusIndicator }
                    </Box>
                    <Typography variant="caption" component="div" className="channel-description">
                        { channel.description }
                    </Typography>
                </Box>
            </AccordionSummary>
            { isChildOrgSubscriptionEnabled && (
            <AccordionDetails>
                { renderSubscriptionPolicy() }
                <ConfirmationModal
                    onClose={ closePolicySwitchModal }
                    type="warning"
                    open={ isPolicySwitchModalOpen }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onPrimaryActionClick={ handlePolicySwitchConfirm }
                    onSecondaryActionClick={ closePolicySwitchModal }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${ componentId }-policy-switch-modal` }
                >
                    <ConfirmationModal.Header>
                        { t("webhooks:configForm.channels.subscriptionPolicy.switchModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("webhooks:configForm.channels.subscriptionPolicy.switchModal.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("webhooks:configForm.channels.subscriptionPolicy.switchModal.description") }
                        <RadioGroup
                            value={ policySwitchApproach }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                setPolicySwitchApproach(event.target.value as PolicySwitchApproach) }
                            data-componentid={ `${ componentId }-policy-switch-group` }
                            className="mt-3"
                        >
                            <FormControlLabel
                                value={ PolicySwitchApproach.PRESERVE }
                                control={ <Radio /> }
                                className="mb-3"
                                data-componentid={ `${ componentId }-policy-switch-preserve` }
                                label={ (
                                    <Typography variant="body1">
                                        <b>{ t("webhooks:configForm.channels.subscriptionPolicy.switchModal.preserveLabel") }: </b>
                                        { t("webhooks:configForm.channels.subscriptionPolicy.switchModal.preserveDescription") }
                                    </Typography>
                                ) }
                            />
                            <FormControlLabel
                                value={ PolicySwitchApproach.RESET }
                                control={ <Radio /> }
                                data-componentid={ `${ componentId }-policy-switch-reset` }
                                label={ (
                                    <Typography variant="body1">
                                        <b>{ t("webhooks:configForm.channels.subscriptionPolicy.switchModal.resetLabel") }: </b>
                                        { t("webhooks:configForm.channels.subscriptionPolicy.switchModal.resetDescription") }
                                    </Typography>
                                ) }
                            />
                        </RadioGroup>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </AccordionDetails>
            ) }
        </Accordion>
    );
};

export default WebhookChannelAccordionItem;
