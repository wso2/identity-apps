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

import { amber, blue, deepOrange, green, indigo, orange, purple, teal } from "@mui/material/colors";
import { Theme, styled, useTheme } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Typography from "@oxygen-ui/react/Typography";
import useSubscription, { UseSubscriptionInterface } from "@wso2is/admin.subscription.v1/hooks/use-subscription";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { getMoesifDashboardInfo } from "../api/get-moesif-dashboard-info";
import { MoesifDashboardConstants } from "../constants/moesif-dashboard-constants";
import { MoesifDashboardInfoInterface } from "../models/moesif-analytics";

/**
 * PostMessage event type constants used by the Moesif Embedded Canvas portal.
 */
const EMBEDDED_POST_MESSAGE_TYPES: {
    CANVAS_INIT: string;
    CANVAS_READY: string;
    CANVAS_RESIZE: string;
    ORG_LOAD_FINISHED: string;
    REFRESH_TOKEN: string;
    SCHEMA_GEN_FINISHED: string;
    SET_TOKEN: string;
} = {
    CANVAS_INIT: "CANVAS_INIT",
    CANVAS_READY: "CANVAS_READY",
    CANVAS_RESIZE: "CANVAS_RESIZE",
    ORG_LOAD_FINISHED: "ORG_LOAD_FINISHED",
    REFRESH_TOKEN: "REFRESH_TOKEN",
    SCHEMA_GEN_FINISHED: "SCHEMA_GEN_FINISHED",
    SET_TOKEN: "SET_TOKEN"
};

/**
 * Interval (ms) between token refreshes. Moesif id_tokens expire in ~1 hour;
 * refresh every 50 minutes to keep the embedded canvas authenticated.
 */
const TOKEN_REFRESH_INTERVAL_MS: number = 50 * 60 * 1000;

/**
 * Minimum height of the embedded canvas area.
 */
const CANVAS_MIN_HEIGHT: string = "600px";

/**
 * Chart series colors for the embedded dashboards, from the standard
 * MUI color palette. Warm hues aligned with the primary (orange) brand
 * color come first; the remaining standard dashboard colors follow.
 */
const CHART_COLORS: string[] = [
    orange[500],
    deepOrange[500],
    amber[600],
    blue[500],
    teal[500],
    green[600],
    indigo[400],
    purple[400]
];

const ErrorContainer: typeof Box = styled(Box)(() => ({
    alignItems: "center",
    display: "flex",
    height: "60vh",
    justifyContent: "center",
    width: "100%"
}));

const CanvasContainer: typeof Box = styled(Box)(() => ({
    "& iframe": {
        border: "none",
        display: "block",
        width: "100%"
    },
    minHeight: CANVAS_MIN_HEIGHT,
    position: "relative",
    width: "100%"
}));

const LoaderOverlay: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10
}));

/**
 * Props for the MoesifCanvasIframe component.
 */
interface MoesifCanvasIframePropsInterface {
    /**
     * Unique identifier for the component (for testing).
     */
    "data-componentid"?: string;
    /**
     * Base URL of the Moesif Embedded Portal, e.g. `https://www.moesif.com`.
     * The iframe is loaded at `{embeddingDomain}/wrap/app/{orgId}-{appId}/canvas#auth=post`.
     */
    embeddingDomain: string;
}

/**
 * Renders the Moesif Canvas embedded dashboard inside an iframe.
 *
 * Handshake order (mirrors Canvas.jsx):
 *  1. Dashboard info (token, orgId, appId) fetched from tenant-mgt on mount.
 *  2. iframe.onLoad fires            → parent sends SET_TOKEN.
 *  3. iframe auths, loads orgs       → iframe sends ORG_LOAD_FINISHED (parent hides spinner).
 *  4. iframe Canvas component mounts → iframe sends CANVAS_READY.
 *  5. parent sends CANVAS_INIT with template → canvas renders.
 *
 * Steps 3 and 4 can arrive in either order. CANVAS_INIT is only sent after BOTH
 * ORG_LOAD_FINISHED AND CANVAS_READY are received, preventing dropped messages.
 */
const MoesifCanvasIframe: FunctionComponent<MoesifCanvasIframePropsInterface> = (
    props: MoesifCanvasIframePropsInterface
): ReactElement => {
    const { "data-componentid": componentId = "moesif-canvas-iframe", embeddingDomain } = props;

    const { t } = useTranslation();
    const theme: Theme = useTheme();
    const { tierName }: UseSubscriptionInterface = useSubscription();

    const [ dashboardInfo, setDashboardInfo ] = useState<MoesifDashboardInfoInterface | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ errorMessageKey, setErrorMessageKey ] = useState<string>("");
    const [ isIframeDomLoaded, setIsIframeDomLoaded ] = useState<boolean>(false);
    const [ hasAuthCompleted, setHasAuthCompleted ] = useState<boolean>(false);
    const [ isChildReady, setIsChildReady ] = useState<boolean>(false);
    const [ iframeHeight, setIframeHeight ] = useState<number | null>(null);

    const iframeRef: React.MutableRefObject<HTMLIFrameElement | null> = useRef<HTMLIFrameElement | null>(null);
    const isMounted: React.MutableRefObject<boolean> = useRef<boolean>(true);

    // Derive the allowed origin from embeddingDomain for postMessage security.
    const embeddedOrigin: string = embeddingDomain ? new URL(embeddingDomain).origin : "";

    // Tier-specific canvas template. Re-resolves when the subscription tier
    // resolves/changes (e.g. Free → Essentials), which re-fires CANVAS_INIT
    // and swaps the dashboards live.
    const template: Record<string, unknown> = useMemo(
        () => MoesifDashboardConstants.getTemplate(tierName),
        [ tierName ]
    );

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * Fetches fresh dashboard info (token, orgId, appId) from the tenant-mgt service.
     */
    const fetchDashboardInfo: () => Promise<void> = useCallback(async (): Promise<void> => {
        try {
            const info: MoesifDashboardInfoInterface = await getMoesifDashboardInfo();

            if (!isMounted.current) {
                return;
            }

            setDashboardInfo(info);
        } catch (_err: unknown) {
            if (!isMounted.current) {
                return;
            }
            setErrorMessageKey("extensions:develop.moesifAnalytics.dashboard.errors.loadFailure");
        }
    }, []);

    /**
     * Sends SET_TOKEN to the Moesif iframe via postMessage.
     */
    const sendTokenToIframe: () => void = useCallback((): void => {
        if (iframeRef.current && dashboardInfo?.token && embeddedOrigin) {
            iframeRef.current.contentWindow?.postMessage(
                { token: dashboardInfo.token, type: EMBEDDED_POST_MESSAGE_TYPES.SET_TOKEN },
                embeddedOrigin
            );
        }
    }, [ dashboardInfo?.token, embeddedOrigin ]);

    /**
     * Sends CANVAS_INIT with the static canvas template to the iframe.
     */
    const sendCanvasInit: () => void = useCallback((): void => {
        if (iframeRef.current && template && embeddedOrigin) {
            iframeRef.current.contentWindow?.postMessage(
                {
                    template,
                    theme: {
                        // Makes the canvas report its content height via
                        // CANVAS_RESIZE, which drives the iframe height below.
                        autoHeight: true,
                        brandColor: theme.palette.primary.main,
                        brandTextColor: theme.palette.primary.main,
                        chartColors: CHART_COLORS,
                        navigation: { showIcons: false, type: "tabs" }
                    },
                    type: EMBEDDED_POST_MESSAGE_TYPES.CANVAS_INIT
                },
                embeddedOrigin
            );
        }
    }, [ template, embeddedOrigin, theme ]);

    // Fetch dashboard info on mount and refresh periodically.
    useEffect(() => {
        if (!embeddingDomain) {
            setErrorMessageKey("extensions:develop.moesifAnalytics.dashboard.errors.portalUrlNotConfigured");
            setIsLoading(false);

            return;
        }

        fetchDashboardInfo();

        const intervalId: ReturnType<typeof setInterval> = setInterval(fetchDashboardInfo, TOKEN_REFRESH_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [ fetchDashboardInfo, embeddingDomain ]);

    // 1. Send SET_TOKEN when the iframe DOM is ready or when the token refreshes.
    useEffect(() => {
        if (isIframeDomLoaded && dashboardInfo?.token) {
            sendTokenToIframe();
        }
    }, [ dashboardInfo?.token, isIframeDomLoaded, sendTokenToIframe ]);

    // 2. Send CANVAS_INIT only when BOTH auth has completed AND child Canvas is mounted.
    //    Re-fires when the template changes so dashboards can be swapped live.
    useEffect(() => {
        if (hasAuthCompleted && isChildReady && template) {
            sendCanvasInit();
        }
    }, [ hasAuthCompleted, isChildReady, template, sendCanvasInit ]);

    // 3. Listen for postMessages from the Moesif Canvas iframe.
    useEffect(() => {
        if (!embeddedOrigin) {
            return;
        }

        const handleMessage = (event: MessageEvent): void => {
            if (event.origin !== embeddedOrigin) {
                return;
            }
            switch (event.data?.type) {
                case EMBEDDED_POST_MESSAGE_TYPES.ORG_LOAD_FINISHED:
                    // Auth + org load done — reveal the iframe.
                    setHasAuthCompleted(true);

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.CANVAS_READY:
                    // Child Canvas component has mounted and its postMessage listener
                    // is attached — safe to send CANVAS_INIT without losing it to a
                    // mount race.
                    setIsChildReady(true);
                    setIsLoading(false);

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.CANVAS_RESIZE:
                    // Canvas reports its content height on render and tab changes.
                    // Size the iframe to it so the page scrolls (no inner scrollbar),
                    // matching how the rest of the console pages scroll.
                    if (typeof event.data?.height === "number" && event.data.height > 0) {
                        // Round up so a fractional reported height can never leave
                        // the iframe a sub-pixel short of its content (which would
                        // clip the bottom edge, since inner scrolling is disabled).
                        setIframeHeight(Math.ceil(event.data.height));
                    }

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.REFRESH_TOKEN:
                    // Iframe requested a token refresh.
                    fetchDashboardInfo();

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.SCHEMA_GEN_FINISHED:
                case EMBEDDED_POST_MESSAGE_TYPES.SET_TOKEN:
                    // Not applicable / shouldn't be sent by Canvas — ignore.
                    break;

                default:
                    break;
            }
        };

        window.addEventListener("message", handleMessage);

        return () => window.removeEventListener("message", handleMessage);
    }, [ embeddedOrigin, fetchDashboardInfo ]);

    if (errorMessageKey) {
        return (
            <ErrorContainer data-componentid={ `${ componentId }-error` }>
                <Typography color="error" variant="body1">
                    { t(errorMessageKey) }
                </Typography>
            </ErrorContainer>
        );
    }

    const iframeSrc: string = dashboardInfo
        ? `${ embeddingDomain }/wrap/app/${ dashboardInfo.moesifOrgId }-${ dashboardInfo.moesifAppId }/canvas#auth=post`
        : "";

    return (
        <CanvasContainer data-componentid={ componentId }>
            { (isLoading || !dashboardInfo) && (
                <LoaderOverlay data-componentid={ `${ componentId }-loader` }>
                    <CircularProgress size={ 40 } />
                </LoaderOverlay>
            ) }
            { dashboardInfo && (
                <iframe
                    ref={ iframeRef }
                    data-componentid={ `${ componentId }-frame` }
                    src={ iframeSrc }
                    title={ t("extensions:develop.moesifAnalytics.dashboard.iframeTitle") }
                    // The canvas reports its content height via CANVAS_RESIZE and the
                    // iframe is sized to it, rendering the full content. The iframe
                    // never scrolls itself — the console page scroller is the only
                    // scroller, same as the rest of the console pages.
                    scrolling="no"
                    style={ {
                        height: iframeHeight !== null ? `${ iframeHeight }px` : CANVAS_MIN_HEIGHT
                    } }
                    onLoad={ () => {
                        setIsIframeDomLoaded(true);
                    } }
                />
            ) }
        </CanvasContainer>
    );
};

export default MoesifCanvasIframe;
