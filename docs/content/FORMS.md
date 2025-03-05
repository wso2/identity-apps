# Forms

The @wso2is/form-fields library can cater to all the requirements that are identified when it comes to its use-cases. The fields of 
this module is compatible with the semantic UI elements that are customised in the `react-components` module and 
support their native behaviors.

All form elements should use the WSO2 styled to be aligned with the default WSO2 `theme` for consistent design, good 
user experience, and accessibility.

## Fields

This is the basic form field, it is a wrapper for any single input or select elements. It sets a few layout options by 
default margins and styles any optional UI elements within.

- [Text Inputs]()
- Buttons
- Checkboxes
- Radio Buttons

### Text Inputs

Text inputs are the basic building blocks of forms. They allow users to enter various types of data into web-based 
forms.

#### Best Practises

- All form inputs must have a corresponding label.
- Provide a hint whenever the details collected from the input field is not self-explanatory.
- The label should be visible without relying on placeholders as not every browser can see them, nor can all 
  screenreaders. A visible permanent label provides continuous context.
- Whenever a input field is mandatory make sure to mark it as `required`.
- For text inputs that are optional, add "(optional)" to the input label.

### Text Input Samples

<b>1. Basic Input Field</b>

![basic](assets/forms-field-basic.png)

<b>Sample Field Component</b>
```html
<FormField
    fieldType="name"
    data-testid="username-input"
    label="Username"
    name="username"
    placeholder="Enter the username"
    type="text"
    required={ true }
/>
```

<b>2. Input Field with Hint</b>

![with-hint](assets/forms-field-with-hint.png)

<b>Sample Field Component</b>
```html
<FormField
    fieldType="name"
    data-testid="back-channel-logout-url"
    label="Back channel logout URL"
    name="backChannelLogout"
    placeholder="https://myapp.io/logout"
    type="text"
    hint="WSO2 Identity Server will directly communicate the logout requests to this client URL..."
/>
```

<b>2. Input Field with a Message</b>

![with-message](assets/forms-field-with-info-message.png)

<b>Sample Field Component</b>
```html
<FormField
    fieldType="url"
    data-testid="redirect-url"
    label="Authorized redirect URL"
    name="backChannelLogout"
    placeholder="Enter the authorized redirect URL"
    type="text"
    required={ true }
    message={
      <Message
          info
          content="Don’t have an app? Try out a sample app using https://localhost:3000 as the authorized redirect URL. 
          (You can download and run a sample at a later step.)"
      />
    }
/>
```

### Text Input Validations 

The developer provided validation, or the default validations will be triggered by the `on-blur` event of the field. 
The developers can overwrite the default validation criteria by providing custom validations by passing them to the 
`validation` prop of the `FormField` component.

#### Default Validations

The default validations of the text input will rely on the `fieldType` you specify for the `FormField` component. The 
type of the input can be picked out of the following, and the default validations will be
applied to the field accordingly.

- `name`
- `email`
- `phoneNumber`
- `url`

If the input violates the validation criteria and error message will be displayed through
a `semantic-ui` label pointing to the relevant input field. Also, if the field is marked as `required` an error will be
shown whenever the input field looses `focus`.

![with-message](assets/froms-field-validation-email.png)

<b>Sample Field Component</b>
```html
<FormField
    fieldType="email"
    data-testid="user-email-input"
    label="Email"
    name="email"
    placeholder="Enter the email address"
    type="text"
/>
```
