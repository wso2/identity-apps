/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.identity.apps.common.util;

import org.mockito.ArgumentCaptor;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.wso2.carbon.base.CarbonBaseConstants;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.application.mgt.ApplicationMgtUtil;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.OAuthAdminServiceImpl;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.nio.file.Paths;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertEquals;
import static org.wso2.identity.apps.common.util.AppPortalConstants.CONSOLE_APP;
import static org.wso2.identity.apps.common.util.AppPortalConstants.MYACCOUNT_APP;
import static org.wso2.identity.apps.common.util.AppPortalConstants.USER_SESSION_IMPERSONATION;

/**
 * Unit test class for AppPortalUtils.
 */
public class AppPortalUtilsTest {

    private static final Logger log = LoggerFactory.getLogger(AppPortalUtilsTest.class);
    private MockedStatic<PrivilegedCarbonContext> mockedPrivilegedCarbonContext;
    private MockedStatic<IdentityUtil> mockedIdentityUtil;
    private MockedStatic<AppsCommonDataHolder> mockedAppsCommonDataHolder;
    private MockedStatic<ApplicationMgtUtil> mockedApplicationMgtUtil;

    @BeforeMethod
    public void setUp() {
        System.setProperty(CarbonBaseConstants.CARBON_HOME,
            Paths.get(System.getProperty("user.dir"), "src", "test", "resources").toString());
        mockedPrivilegedCarbonContext = Mockito.mockStatic(PrivilegedCarbonContext.class);
        mockedIdentityUtil = Mockito.mockStatic(IdentityUtil.class);
        mockedAppsCommonDataHolder = Mockito.mockStatic(AppsCommonDataHolder.class);
        mockedApplicationMgtUtil = Mockito.mockStatic(ApplicationMgtUtil.class);
    }

    @AfterMethod
    public void tearDown() {
        mockedPrivilegedCarbonContext.close();
        mockedIdentityUtil.close();
        mockedAppsCommonDataHolder.close();
        mockedApplicationMgtUtil.close();
    }

    @DataProvider(name = "testAppNames")
    public Object[][] testAppNames() {
        return new Object[][]{
                {MYACCOUNT_APP, true},
                {CONSOLE_APP, false},
                {"TestApp", false}
        };
    }

    @Test(dataProvider = "testAppNames")
    public void testCreateOAuth2ApplicationCallBackURLs(String appName, boolean expected)
        throws IdentityOAuthAdminException {

        String dummyURL = "https://localhost:9443/portalPath";

        // Mock PrivilegedCarbonContext
        PrivilegedCarbonContext privilegedCarbonContext = mock(PrivilegedCarbonContext.class);
        mockedPrivilegedCarbonContext.when(PrivilegedCarbonContext::getThreadLocalCarbonContext)
                .thenReturn(privilegedCarbonContext);

        // Mock IdentityUtil
        mockedIdentityUtil.when(() -> IdentityUtil.getServerURL(anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(dummyURL);
        mockedIdentityUtil.when(() -> IdentityUtil.getProperty(USER_SESSION_IMPERSONATION))
                .thenReturn("true");
        mockedApplicationMgtUtil.when(() -> ApplicationMgtUtil.replaceUrlOriginWithPlaceholders(anyString()))
                .thenReturn(dummyURL);
        mockedApplicationMgtUtil.when(() -> ApplicationMgtUtil
                .resolveOriginUrlFromPlaceholders(anyString(), anyString()))
            .thenReturn(dummyURL);

        ArgumentCaptor<OAuthConsumerAppDTO> captor = ArgumentCaptor.forClass(OAuthConsumerAppDTO.class);

        // Mock AppsCommonDataHolder
        AppsCommonDataHolder appsCommonDataHolder = mock(AppsCommonDataHolder.class);
        mockedAppsCommonDataHolder.when(AppsCommonDataHolder::getInstance).thenReturn(appsCommonDataHolder);

        // Mock OAuthAdminService
        OAuthAdminServiceImpl oAuthAdminService = mock(OAuthAdminServiceImpl.class);
        when(appsCommonDataHolder.getOAuthAdminService()).thenReturn(oAuthAdminService);

        // Call the method
        AppPortalUtils.createOAuth2Application(
            appName,
                "/portalPath",
                "consumerKey",
                "consumerSecret",
                "admin",
                1,
                "carbon.super",
                "cookie",
                Arrays.asList("authorization_code", "refresh_token")
        );

        // Verify interactions and capture the argument.
        verify(oAuthAdminService, times(1)).registerOAuthApplicationData(captor.capture());

        // Get the captured value.
        OAuthConsumerAppDTO capturedDTO = captor.getValue();

        // Assert that the callback URL contains init-impersonate.html.
        assertEquals(capturedDTO.getCallbackUrl().contains("/resources/users/init-impersonate.html"), expected,
                "Callback URL does not contain the expected value.");

        // Verify interactions.
        verify(appsCommonDataHolder.getOAuthAdminService(), times(1))
                .registerOAuthApplicationData(any(OAuthConsumerAppDTO.class));
    }
}
