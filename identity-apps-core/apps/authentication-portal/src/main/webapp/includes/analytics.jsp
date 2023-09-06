<script>
/*
 * @param eventName - name of the event fired
 * @param metadataObj - associated metadata in form of JS object
 */
function trackEvent (eventName, metadataObj) {
    // add any custom event tracking functionality here
    console.info("Event \"" + eventName + "\" triggered with metadata " + JSON.stringify(metadataObj))
}
</script>
