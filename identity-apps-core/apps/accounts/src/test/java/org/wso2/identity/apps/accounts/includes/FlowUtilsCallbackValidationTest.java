/*
 * Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.accounts.includes;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.mockito.ArgumentCaptor;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient;
import org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient;
import org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotEquals;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertNull;

/**
 * Open redirect (CWE-601) regression tests for the {@code callback} handling in
 * {@code src/main/webapp/includes/flow-utils.jsp}.
 * <p>
 * The JSP used to write the raw {@code callback} request parameter into
 * {@code application.callbackOrAccessUrl}, which the shipped self-registration flow template binds
 * straight into the {@code href} of the "Sign in" anchor. Any URL the attacker put in the query
 * string therefore became a link on a genuine, WSO2 branded Identity Server page. Output encoding
 * was applied but output encoding is not authorisation, and the browser normalises the
 * {@code \/} separators it produces straight back to {@code /}.
 * <p>
 * The fix validates the callback against the tenant's configured allow list - picked by flow type -
 * before it is reflected, and falls back to the application's registered access URL otherwise.
 * These tests execute the JSP's own source through {@link FlowUtilsScriptletHarness} and assert on
 * the sink itself.
 * <p>
 * The three allow lists are deliberately given disjoint values here. In a stock deployment all
 * three default to the same regex, which would make it impossible to tell which connector each flow
 * type actually consults.
 */
public class FlowUtilsCallbackValidationTest {

    private static final String TENANT_DOMAIN = "carbon.super";
    private static final String OTHER_TENANT_DOMAIN = "wso2.com";

    private static final String ACCESS_URL = "https://localhost:9443/myaccount";

    private static final String SELF_REGISTRATION_ALLOW_LIST = "https://localhost:9443/myaccount/.*";
    private static final String LITE_REGISTRATION_ALLOW_LIST = "https://localhost:9443/lite/.*";
    private static final String RECOVERY_ALLOW_LIST = "https://localhost:9443/recovery/.*";

    private static final String ALLOWED_SELF_REGISTRATION_CALLBACK = "https://localhost:9443/myaccount/overview";
    private static final String ALLOWED_LITE_REGISTRATION_CALLBACK = "https://localhost:9443/lite/welcome";
    private static final String ALLOWED_RECOVERY_CALLBACK = "https://localhost:9443/recovery/done";

    /**
     * The callback used by the reported proof of concept.
     */
    private static final String ATTACKER_CALLBACK = "https://evil.example.com/phish";

    private static final String REGISTRATION = "REGISTRATION";
    private static final String INVITED_USER_REGISTRATION = "INVITED_USER_REGISTRATION";
    private static final String PASSWORD_RECOVERY = "PASSWORD_RECOVERY";

    private static final String CALLBACK_SINK = "callbackOrAccessUrl";

    private String accessUrl;
    private PreferenceRetrievalClientException preferenceFailure;
    private final List<PreferenceRetrievalClient> preferenceClients = new ArrayList<>();

    private MockedConstruction<ApplicationDataRetrievalClient> applicationClientConstruction;
    private MockedConstruction<PreferenceRetrievalClient> preferenceClientConstruction;

    @BeforeMethod
    public void setUp() {

        accessUrl = ACCESS_URL;
        preferenceFailure = null;
        preferenceClients.clear();

        applicationClientConstruction = Mockito.mockConstruction(ApplicationDataRetrievalClient.class,
                (mock, context) -> when(mock.getApplicationAccessURL(any(), any()))
                        .thenAnswer(invocation -> accessUrl));

        preferenceClientConstruction = Mockito.mockConstruction(PreferenceRetrievalClient.class,
                (mock, context) -> {
                    preferenceClients.add(mock);
                    when(mock.checkIfSelfRegCallbackURLValid(any(), any()))
                            .thenAnswer(invocation -> allowed(SELF_REGISTRATION_ALLOW_LIST, invocation));
                    when(mock.checkIfLiteRegCallbackURLValid(any(), any()))
                            .thenAnswer(invocation -> allowed(LITE_REGISTRATION_ALLOW_LIST, invocation));
                    when(mock.checkIfRecoveryCallbackURLValid(any(), any()))
                            .thenAnswer(invocation -> allowed(RECOVERY_ALLOW_LIST, invocation));
                });
    }

    @AfterMethod
    public void tearDown() {

        if (preferenceClientConstruction != null) {
            preferenceClientConstruction.close();
        }
        if (applicationClientConstruction != null) {
            applicationClientConstruction.close();
        }
    }

    /**
     * The reported vulnerability: an attacker supplied callback must never reach the page.
     */
    @Test
    public void shouldNotReflectAnAttackerControlledCallback() {

        JsonObject context = resolve(ATTACKER_CALLBACK, REGISTRATION);

        assertNotEquals(callbackSink(context), ATTACKER_CALLBACK,
                "The raw attacker callback was reflected into the page - open redirect.");
        assertEquals(callbackSink(context), ACCESS_URL,
                "A rejected callback must fall back to the application's registered access URL.");
    }

    /**
     * Guards against an over broad fix: a callback the tenant actually allow listed must survive.
     * The {@code \/} separators are what {@code Encode.forJavaScript} produces; the value is emitted
     * into a JavaScript string literal in the page.
     */
    @Test
    public void shouldPreserveAnAllowListedCallback() {

        JsonObject context = resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, REGISTRATION);

        assertEquals(callbackSink(context), "https:\\/\\/localhost:9443\\/myaccount\\/overview",
                "An allow listed callback must still be honoured.");
    }

    /**
     * The allow list must be consulted even when the application resolves a genuine access URL.
     * {@code recovery.jsp} skips validation in that case; copying it here would have left the
     * reported exploit fully working, because the proof of concept's {@code sp} does resolve one.
     */
    @Test
    public void shouldValidateEvenWhenTheApplicationHasAnAccessUrl() throws PreferenceRetrievalClientException {

        resolve(ATTACKER_CALLBACK, REGISTRATION);

        verify(preferenceClient()).checkIfSelfRegCallbackURLValid(TENANT_DOMAIN, ATTACKER_CALLBACK);
    }

    /**
     * The allow lists are full string matches maintained against raw URLs, so the value handed to
     * them must be the untouched request parameter, not an encoded or escaped rendering of it.
     */
    @Test
    public void shouldValidateTheRawCallbackValue() throws PreferenceRetrievalClientException {

        resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, REGISTRATION);

        ArgumentCaptor<String> callback = ArgumentCaptor.forClass(String.class);
        verify(preferenceClient()).checkIfSelfRegCallbackURLValid(any(), callback.capture());
        assertEquals(callback.getValue(), ALLOWED_SELF_REGISTRATION_CALLBACK,
                "The allow list must see the raw callback, not an encoded rendering of it.");
    }

    @Test(dataProvider = "absentCallbacks")
    public void shouldFallBackToAccessUrlWhenNoCallbackIsSupplied(String callback, String description) {

        JsonObject context = resolve(callback, REGISTRATION);

        assertEquals(callbackSink(context), ACCESS_URL, description);
        assertEquals(preferenceClients.size(), 0,
                "The allow list must not be queried at all when there is no callback to validate.");
    }

    @DataProvider(name = "absentCallbacks")
    public Object[][] absentCallbacks() {

        return new Object[][] {
                { null, "A missing callback must fall back to the access URL." },
                { "", "An empty callback must fall back to the access URL." },
                { "   ", "A blank callback must fall back to the access URL." },
                { "null", "The literal string 'null' is what the portal sends when there is no "
                        + "callback; the pre-existing fallback must be preserved." },
                { "NULL", "The literal 'null' check is case insensitive and must stay that way." }
        };
    }

    @Test(dataProvider = "rejectedCallbacks")
    public void shouldRejectCallbacksOutsideTheAllowList(String callback, String description) {

        JsonObject context = resolve(callback, REGISTRATION);

        assertEquals(callbackSink(context), ACCESS_URL, description);
    }

    @DataProvider(name = "rejectedCallbacks")
    public Object[][] rejectedCallbacks() {

        return new Object[][] {
                { ATTACKER_CALLBACK, "A plain off-site callback must be rejected." },
                { "//evil.example.com", "A scheme relative callback must be rejected." },
                { "https://localhost:9443@evil.example.com",
                        "Userinfo confusion must not pass as the allow listed host." },
                { "https://localhost:9443.evil.example.com/x",
                        "A host that merely starts with the allow listed host must be rejected." },
                { "https:\\/\\/evil.example.com",
                        "The escaped form the page emits must not slip through; browsers normalise "
                                + "the separators straight back." },
                { "HTTPS://LOCALHOST:9443/MYACCOUNT/OVERVIEW",
                        "Allow list matching is case sensitive; a case variant is not allow listed." },
                { "https://evil.example.com/phish?next=https://localhost:9443/myaccount/overview",
                        "An allow listed URL embedded in the query string must not make the callback "
                                + "allow listed." },
                { "https://localhost:9443/myaccount/x\r\nSet-Cookie: injected=1",
                        "A CRLF bearing callback must be rejected." }
        };
    }

    /**
     * Documented, intended behaviour change. Before the fix an unparseable scheme reached
     * {@code IdentityManagementEndpointUtil.encodeURL(...)} and blew the page up. Now the allow list
     * rejects it first, so the page renders normally with the access URL.
     */
    @Test
    public void shouldRenderNormallyForAnUnparseableCallbackScheme() {

        JsonObject context = resolve("javascript:alert(1)", REGISTRATION);

        assertEquals(callbackSink(context), ACCESS_URL,
                "An unparseable scheme must degrade to the access URL rather than fail the page.");
    }

    @Test
    public void shouldUseTheSelfRegistrationAllowListForRegistration() throws PreferenceRetrievalClientException {

        JsonObject context = resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, REGISTRATION);

        assertEquals(callbackSink(context), "https:\\/\\/localhost:9443\\/myaccount\\/overview");
        verify(preferenceClient()).checkIfSelfRegCallbackURLValid(TENANT_DOMAIN,
                ALLOWED_SELF_REGISTRATION_CALLBACK);
        verify(preferenceClient(), never()).checkIfLiteRegCallbackURLValid(any(), any());
        verify(preferenceClient(), never()).checkIfRecoveryCallbackURLValid(any(), any());
    }

    /**
     * Invited user registration is governed by the lite user sign up connector, which keeps its own
     * allow list. A callback allow listed only for self registration must not be honoured here.
     */
    @Test
    public void shouldUseTheLiteRegistrationAllowListForInvitedUserRegistration()
            throws PreferenceRetrievalClientException {

        JsonObject allowed = resolve(ALLOWED_LITE_REGISTRATION_CALLBACK, INVITED_USER_REGISTRATION);
        assertEquals(callbackSink(allowed), "https:\\/\\/localhost:9443\\/lite\\/welcome");
        verify(preferenceClient()).checkIfLiteRegCallbackURLValid(TENANT_DOMAIN,
                ALLOWED_LITE_REGISTRATION_CALLBACK);
        verify(preferenceClient(), never()).checkIfSelfRegCallbackURLValid(any(), any());
        verify(preferenceClient(), never()).checkIfRecoveryCallbackURLValid(any(), any());

        JsonObject wrongList = resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, INVITED_USER_REGISTRATION);
        assertEquals(callbackSink(wrongList), ACCESS_URL,
                "A callback allow listed only for self registration must not pass here.");
    }

    @Test
    public void shouldUseTheRecoveryAllowListForPasswordRecovery() throws PreferenceRetrievalClientException {

        JsonObject allowed = resolve(ALLOWED_RECOVERY_CALLBACK, PASSWORD_RECOVERY);
        assertEquals(callbackSink(allowed), "https:\\/\\/localhost:9443\\/recovery\\/done");
        verify(preferenceClient()).checkIfRecoveryCallbackURLValid(TENANT_DOMAIN,
                ALLOWED_RECOVERY_CALLBACK);
        verify(preferenceClient(), never()).checkIfSelfRegCallbackURLValid(any(), any());
        verify(preferenceClient(), never()).checkIfLiteRegCallbackURLValid(any(), any());

        JsonObject wrongList = resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, PASSWORD_RECOVERY);
        assertEquals(callbackSink(wrongList), ACCESS_URL,
                "A callback allow listed only for self registration must not pass here.");
    }

    /**
     * {@code execution-flow.jsp} treats a missing or unrecognised flow type as registration, so the
     * callback check has to degrade the same way rather than skipping validation.
     */
    @Test(dataProvider = "defaultingFlowTypes")
    public void shouldDefaultToTheSelfRegistrationAllowList(String flowType) throws PreferenceRetrievalClientException {

        JsonObject rejected = resolve(ATTACKER_CALLBACK, flowType);
        assertEquals(callbackSink(rejected), ACCESS_URL,
                "An unrecognised flow type must not skip validation.");
        verify(preferenceClient()).checkIfSelfRegCallbackURLValid(TENANT_DOMAIN, ATTACKER_CALLBACK);
        verify(preferenceClient(), never()).checkIfLiteRegCallbackURLValid(any(), any());
        verify(preferenceClient(), never()).checkIfRecoveryCallbackURLValid(any(), any());
    }

    @DataProvider(name = "defaultingFlowTypes")
    public Object[][] defaultingFlowTypes() {

        return new Object[][] { { null }, { "" }, { "bogus_unknown_flow" } };
    }

    @Test(dataProvider = "flowTypeCasing")
    public void shouldMatchTheFlowTypeCaseInsensitively(String flowType) throws PreferenceRetrievalClientException {

        JsonObject context = resolve(ALLOWED_RECOVERY_CALLBACK, flowType);

        assertEquals(callbackSink(context), "https:\\/\\/localhost:9443\\/recovery\\/done");
        verify(preferenceClient()).checkIfRecoveryCallbackURLValid(TENANT_DOMAIN, ALLOWED_RECOVERY_CALLBACK);
    }

    @DataProvider(name = "flowTypeCasing")
    public Object[][] flowTypeCasing() {

        return new Object[][] { { PASSWORD_RECOVERY }, { "password_recovery" }, { "Password_Recovery" } };
    }

    /**
     * If the allow list cannot be read the callback must be dropped, not trusted.
     */
    @Test
    public void shouldFailClosedWhenTheAllowListCannotBeRead() {

        preferenceFailure = new PreferenceRetrievalClientException("Preference retrieval failed.");

        JsonObject context = resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, REGISTRATION);

        assertEquals(callbackSink(context), ACCESS_URL,
                "A failure to evaluate the allow list must fail closed.");
    }

    /**
     * Allow lists are per tenant. A URL allow listed by one tenant must not be honoured for another.
     */
    @Test
    public void shouldNotHonourAnotherTenantsAllowListedCallback() throws PreferenceRetrievalClientException {

        JsonObject context = resolve(ALLOWED_SELF_REGISTRATION_CALLBACK, REGISTRATION, OTHER_TENANT_DOMAIN);

        assertEquals(callbackSink(context), ACCESS_URL,
                "Another tenant's allow listed callback must not be honoured.");
        verify(preferenceClient()).checkIfSelfRegCallbackURLValid(OTHER_TENANT_DOMAIN,
                ALLOWED_SELF_REGISTRATION_CALLBACK);
    }

    /**
     * With no access URL to fall back to there must still be no reflection - the sink goes empty
     * rather than attacker controlled.
     */
    @Test
    public void shouldNotReflectAnAttackerCallbackWhenThereIsNoAccessUrl() {

        accessUrl = null;

        JsonObject context = resolve(ATTACKER_CALLBACK, REGISTRATION);

        assertNull(callbackSink(context),
                "Without an access URL the sink must be empty, never the rejected callback.");
    }

    /**
     * The genuine, application resolved access URL is unrelated to the callback and must keep being
     * published as it was before the fix.
     */
    @Test
    public void shouldStillPublishTheApplicationAccessUrl() {

        JsonObject context = resolve(ATTACKER_CALLBACK, REGISTRATION);

        JsonObject application = context.getAsJsonObject("application");
        assertNotNull(application);
        assertEquals(application.get("accessUrl").getAsString(), ACCESS_URL);
    }

    private JsonObject resolve(String callback, String flowType) {

        return resolve(callback, flowType, TENANT_DOMAIN);
    }

    private JsonObject resolve(String callback, String flowType, String tenantDomain) {

        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getParameter("callback")).thenReturn(callback);
        when(request.getParameter("flowType")).thenReturn(flowType);
        when(request.getParameter("sp")).thenReturn("My Account");

        return FlowUtilsScriptletHarness.resolve(request, tenantDomain);
    }

    private static String callbackSink(JsonObject reactGlobalContext) {

        JsonObject application = reactGlobalContext.getAsJsonObject("application");
        assertNotNull(application, "The scriptlet did not publish an 'application' object.");
        JsonElement value = application.get(CALLBACK_SINK);
        return value == null || value.isJsonNull() ? null : value.getAsString();
    }

    /**
     * @return The single {@link PreferenceRetrievalClient} the scriptlet constructed. More than one
     *         would mean the callback was evaluated twice, which is itself worth failing on.
     */
    private PreferenceRetrievalClient preferenceClient() {

        assertEquals(preferenceClients.size(), 1,
                "Expected the scriptlet to construct exactly one PreferenceRetrievalClient.");
        return preferenceClients.get(0);
    }

    private Boolean allowed(String allowList, InvocationOnMock invocation)
            throws PreferenceRetrievalClientException {

        if (preferenceFailure != null) {
            throw preferenceFailure;
        }
        String tenantDomain = invocation.getArgument(0);
        String callback = invocation.getArgument(1);
        if (!TENANT_DOMAIN.equals(tenantDomain)) {
            // Allow lists are configured per tenant.
            return false;
        }
        return callback != null && Pattern.matches(allowList, callback);
    }
}
