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
     * Distinct from {@link isChildOrganizationsAvailable}, which only reflects whether the
     * organization happens to have children: that disables one radio, whereas this removes the
     * policy altogether. With it off the row keeps its checkbox and stops being expandable, so
     * there is no affordance leading to an empty panel.
     */
    isChildOrgSubscriptionEnabled: boolean;
    /**
     * The policy the server currently has stored for this channel.
     *
     * Distinct from the form value: the narrowing prompt keys off what is actually saved, so that
     * flipping between options locally before saving does not keep re-asking.
     */
    storedSubscriptionPolicy?: ChildOrgSubscriptionPolicy;
}

/**
 * A single event channel, rendered as an accordion row.
 *
 * The checkbox subscribes the channel and nothing else — its clicks are stopped before they
 * reach the summary. Every other part of the row, the name included, expands or collapses.
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

    // The organization list is never returned on the webhook representation, so it is read from the
    // channel sub-resource. It is loaded as soon as the channel is known to use SELECTED_ORGS_ONLY,
    // rather than on expanding the accordion: the selection has to be visible in the collapsed
    // summary, and saving requires the full list because the server no longer preserves an omitted
    // one. The request stays active rather than stopping after the first load, so the value is
    // still available to seed the form again after a save reinitialises it.
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
     * Seed the form with the stored selection, so the collapsed summary shows it and a save that
     * does not change it still sends it back.
     *
     * Seeding is tracked against the identity of the form's `initialValues` rather than a
     * "loaded once" flag. Saving refetches the webhook, which gives `initialValues` a new identity
     * and reinitialises the form; because the webhook representation carries no organizations, that
     * resets this field to empty. Re-seeding on a new identity restores it, while an empty value
     * under an unchanged identity is the user having cleared the selection and is left alone.
     *
     * The field's own dirty state cannot serve here: it is written through `form.change` rather
     * than registered as a field, so it never appears in `dirtyFields`.
     *
     * The seed comes from an explicit revalidation rather than from the hook's cached `data`.
     * Saving revalidates the webhook but not this sub-resource, so the cached list is still the
     * one from before the save — seeding from it paints the pre-save selection back over what the
     * user just saved, which reads as the edit having been silently discarded.
     */
    // Parents of the stored selection, so the tree can open straight to what is ticked instead
    // of showing a collapsed root. The organizations sub-resource is the only place this is
    // available — the webhook representation carries no organizations at all.
    const [ selectionAncestorOrgIds, setSelectionAncestorOrgIds ] = useState<string[]>([]);

    const seededForInitialValuesRef: MutableRefObject<unknown> = useRef<unknown>(null);

    useEffect(() => {
        // Gated on the stored policy, not the form's. The sub-resource reports the organizations
        // currently receiving events whatever the policy is, so seeding from it after a local
        // switch to SELECTED_ORGS_ONLY would write back a selection that was never saved as one --
        // and under a stored ALL policy that is the entire fanout, which silently undoes the
        // "start from scratch" option of the narrowing prompt.
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

        // Claimed before the request resolves, so a re-render while it is in flight does not
        // start a second one. Released again if it does not produce a selection, because the
        // hook does not retry on error: holding the claim would leave the channel showing an
        // empty selection for the rest of the session, which a save would then persist.
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

                // Reported rather than swallowed: the selection the user has saved is not on
                // screen, and the only other signal would be the validation error they hit on
                // trying to save.
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
     * silently drop state, so it is the one that asks first. Every other transition applies
     * straight away.
     */
    const handlePolicyChange = (policy: ChildOrgSubscriptionPolicy): void => {
        const isNarrowing: boolean =
            storedSubscriptionPolicy === ChildOrgSubscriptionPolicy.ALL_EXISTING_AND_FUTURE_ORGS
            && policy === ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY;

        if (isNarrowing) {
            setIsPolicySwitchModalOpen(true);

            return;
        }

        // The selection is deliberately carried across a policy change rather than cleared. It is
        // only ever sent under SELECTED_ORGS_ONLY, so holding it costs nothing — and clearing it
        // means a round trip through another option silently empties a saved selection, which the
        // next save would then persist.
        applyPolicy(policy, channelValue?.organizations ?? []);
    };

    const handlePolicySwitchConfirm = (): void => {
        if (policySwitchApproach === PolicySwitchApproach.RESET) {
            applyPolicy(ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY, []);
            closePolicySwitchModal();

            return;
        }

        // Preserve: the organizations currently receiving events are not on the webhook, so they
        // have to be fetched before they can become the starting selection.
        setPreserveRequestCount((previous: number) => previous + 1);
        setIsPolicySwitchModalOpen(false);
    };

    /**
     * Complete a "preserve" switch once the organizations are in hand.
     *
     * The request caps at 100 organizations, so a fanout wider than that cannot be carried over
     * wholesale. Rather than silently truncating it, the switch is abandoned and the channel is
     * left on its stored policy.
     */
    useEffect(() => {
        if (preserveRequestCount === 0) {
            return;
        }

        // The hook does not retry, so a failed fetch would otherwise leave the switch pending
        // for the rest of the session: the modal is already closed, nothing changes on screen,
        // and a later successful read would apply the policy long after the user moved on.
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
