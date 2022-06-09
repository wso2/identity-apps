# Ensuring a good UX

We follow certain development practices to ensure the applications provide a good user experience. Please make sure you adhere to the following guidelines.

## Disable submit buttons until the submission is complete

When the submit button in a form is clicked, usually an API call is sent to persist the changes. However, during the API call, if the submit button remains enabled, then the users will be able to click on it as many times as they want, which will result in multiple API calls.

To avoid this, disable the submit button until the API call is complete. While disabling the button, to provide a better UX, it is also advisable top show a loading indicator in the button.

```TypeScript
const SampleComponent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const apiCall = (): void {
        setIsSubmitting(true);

        callAPI().then((response) => {
            // handle response
        }).error((error)=>{
            // handle error
        }).finally(()=>{
            setIsSubmitting(false);
        });
    }

    return (
        <div>
            <PrimaryButton loading={ isSubmitting } disabled={ loading }> Submit </PrimaryButton>
        </div>
    )
```
