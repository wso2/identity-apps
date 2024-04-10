# How to add text customization to new interfaces

Here are the steps to add text customization in the interfaces:

1. **List Interfaces and Corresponding JSP Files:**

2. **Access and List Relevant i18n Tags:**
   - For each string that you plan to change, identify the corresponding i18n tag in the `Resources.properties` file.
        - Authentication Portal:
            - Language File: `identity-apps-core/apps/authentication-portal/src/main/resources/org/wso2/carbon/identity/application/authentication/endpoint/i18n/Resources.properties`
        - Recovery Portal:
            - Language File: `identity-apps-core/apps/recovery-portal/src/main/resources/org/wso2/carbon/identity/mgt/recovery/endpoint/i18n/Resources.properties`


3. **Move Strings to Top of File and Add Metadata:**
   - Move the identified strings to the top of the file.
   - Add metadata to each string:
     ```
     # <!-- Start of Sign Up Screen Translations -->
     # EDITABLE=true, SCREEN="sign-up", MULTI_LINE=true
     sign.up.heading=Sign Up
     # EDITABLE=true, SCREEN="sign-up", MULTI_LINE=true
     sign.up.button=Sign Up
     # <!-- End of Sign Up Screen Translations -->
     ```
        - The `EDITABLE` metadata is used to identify the strings that can be customized.
        - The `SCREEN` metadata is used to identify the screen where the string is used.
        - The `MULTI_LINE` metadata is used to identify the strings that support multi-line text.
   - Change the key to the following format: `screen-name.field-name` (e.g., `password.reset.heading`).

4. **Update Resource Language Files:**
   - Add the updated strings to other resource language files as well.

5. **Update i18n in Namespaces File:**
   - Update the `modules/i18n/src/models/namespaces/console-ns.ts` file with the relevant i18n keys for the screens and form fields.
        - It should be in the following format:
          ```
          export const consoleNS = {
              // ...
              brandingCustomText: {
                  // ...
                  form: {
                      // ...
                      fields: {
                          // ...
                          passwordReset.heading: {
                            hint: String;
                          },
                          // ...
                      },
                      // ...
                  },
                  // ...
              },
              // ...
          };
          ```

6. **Create Fragment Component:**
   - Create a fragment component in `apps/console/src/features/branding/components/preview/sign-in-box/fragments`.
   - Name the fragment component based on the screen (e.g., `password-reset-fragment.tsx`).

7. **Add Fragment Component to SignInBox:**
   - Add the created fragment component to the `apps/console/src/features/branding/components/preview/sign-in-box/sign-in-box.tsx` file.

8. **Update Preview Fragment Component:**
   - Update the preview fragment component with the necessary i18n keys.

9. **Add New File to Branding Preferences JSP:**
   - Add the new file required for text customization to the `includes/branding-preferences.jsp` file in both the recovery portal and authentication portal.

10. **Add Localization in JSP Files:**
    - Add localization in JSP files using `<%=i18n(recoveryResourceBundle, customText, "password.reset.heading")%>`.
    - Ensure to add multi-line support if necessary by setting the `MULTI_LINE` metadata to `true` and adding the `new-line-support` helper class to the component.
    
10. **A sample PR:**   
    - https://github.com/wso2/identity-apps/pull/5394

By following these steps, you can effectively add text customization to the new interfaces.

