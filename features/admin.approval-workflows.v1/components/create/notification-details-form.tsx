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

import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, Hint } from "@wso2is/react-components";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    ReactElement,
    RefAttributes,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import "./notification-details-form.scss";
import { NotificationDetailsFormValuesInterface } from "../../models/ui";

/**
 * Props for the notification details form component.
 */
export interface NotificationDetailsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the form is in read-only mode.
     */
    isReadOnly?: boolean;
    /**
     * Callback to be called on form submit.
     * @param values - Form values.
     * @returns void
     */
    onSubmit?: (values: NotificationDetailsFormValuesInterface) => void;
    /**
     * Initial values for the form.
     */
    initialValues?: Partial<NotificationDetailsFormValuesInterface>;
}

export interface NotificationDetailsFormRef {
    /**
     * Triggers the form submission programmatically.
     */
    triggerSubmit: () => void;
}

const NOTIFICATION_CHANNELS: string[] = [ "email", "sms" ];

const NotificationDetailsForm: ForwardRefExoticComponent<RefAttributes<NotificationDetailsFormRef> &
    NotificationDetailsPropsInterface> = forwardRef(
        (
            {
                isReadOnly,
                onSubmit,
                initialValues,
                ["data-componentid"]: componentId = "workflow-notification-details"
            }: NotificationDetailsPropsInterface,
            ref: ForwardedRef<NotificationDetailsFormRef>
        ): ReactElement => {

            const { t } = useTranslation();

            const [ notificationsForInitiator, setNotificationsForInitiator ] = useState<string[]>([]);
            const [ notificationsForApprovers, setNotificationsForApprovers ] = useState<string[]>([]);

            const initiatorRef: React.MutableRefObject<string[]> = useRef<string[]>([]);
            const approverRef: React.MutableRefObject<string[]> = useRef<string[]>([]);

            useEffect(() => {
                const initiatorChannels: string[] = initialValues?.notificationsForInitiator?.channels ?? [];
                const approverChannels: string[] = initialValues?.notificationsForApprovers?.channels ?? [];

                setNotificationsForInitiator(initiatorChannels);
                setNotificationsForApprovers(approverChannels);
                initiatorRef.current = initiatorChannels;
                approverRef.current = approverChannels;
            }, [ initialValues ]);

            useImperativeHandle(ref, () => ({
                triggerSubmit: () => {
                    onSubmit?.({
                        notificationsForApprovers: approverRef.current.length > 0
                            ? { channels: approverRef.current }
                            : undefined,
                        notificationsForInitiator: initiatorRef.current.length > 0
                            ? { channels: initiatorRef.current }
                            : undefined
                    });
                }
            }));

            const handleInitiatorChannelChange = (channel: string): void => {
                setNotificationsForInitiator((prev: string[]) => {
                    const updated: string[] = prev.includes(channel)
                        ? prev.filter((c: string) => c !== channel)
                        : [ ...prev, channel ];

                    initiatorRef.current = updated;

                    return updated;
                });
            };

            const handleApproverChannelChange = (channel: string): void => {
                setNotificationsForApprovers((prev: string[]) => {
                    const updated: string[] = prev.includes(channel)
                        ? prev.filter((c: string) => c !== channel)
                        : [ ...prev, channel ];

                    approverRef.current = updated;

                    return updated;
                });
            };

            return (
                <div
                    className="notification-details-form"
                    data-componentid={ componentId }
                >
                    <div className="notification-channels">
                        { /* Approver Notifications */ }
                        <div className="notification-config">
                            <Heading as="h6" className="sub-heading">
                                { t("approvalWorkflows:forms.notifications.approver.label") }
                            </Heading>
                            <FormGroup className="fields">
                                { NOTIFICATION_CHANNELS.map((channel: string) => (
                                    <FormControlLabel
                                        key={ channel }
                                        control={ (
                                            <Checkbox
                                                checked={ notificationsForApprovers.includes(channel) }
                                                onChange={ () => handleApproverChannelChange(channel) }
                                                disabled={ isReadOnly }
                                                data-componentid={ `${componentId}-approver-channel-${channel}` }
                                            />
                                        ) }
                                        label={ t(
                                            `approvalWorkflows:forms.notifications.channels.${channel}`
                                        ) }
                                    />
                                )) }
                            </FormGroup>
                            <Hint compact>
                                { t("approvalWorkflows:forms.notifications.approver.hint") }
                            </Hint>
                        </div>
                        { /* Initiator Notifications */ }
                        <div className="notification-config">
                            <Heading as="h6" className="sub-heading">
                                { t("approvalWorkflows:forms.notifications.initiator.label") }
                            </Heading>
                            <FormGroup className="fields">
                                { NOTIFICATION_CHANNELS.map((channel: string) => (
                                    <FormControlLabel
                                        key={ channel }
                                        control={ (
                                            <Checkbox
                                                checked={ notificationsForInitiator.includes(channel) }
                                                onChange={ () => handleInitiatorChannelChange(channel) }
                                                disabled={ isReadOnly }
                                                data-componentid={ `${componentId}-initiator-channel-${channel}` }
                                            />
                                        ) }
                                        label={ t(
                                            `approvalWorkflows:forms.notifications.channels.${channel}`
                                        ) }
                                    />
                                )) }
                            </FormGroup>
                            <Hint compact>
                                { t("approvalWorkflows:forms.notifications.initiator.hint") }
                            </Hint>
                        </div>
                    </div>
                </div>
            );
        }
    );

export default NotificationDetailsForm;
