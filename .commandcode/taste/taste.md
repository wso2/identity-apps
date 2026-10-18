# Taste

- Communicates in Vietnamese and expects replies in Vietnamese. Confidence: 0.7
- Prefers complete, thorough implementations over partial/skeleton shortcuts — when offered a lighter "recommended" option vs. a full one, consistently picks the full scope (e.g., translating all languages/namespaces rather than a subset). Confidence: 0.6
- Prefers keeping projects on their standard/default configuration (e.g., default dev-server ports) and will remove/stop conflicting processes rather than adopt a workaround like an alternative port. Confidence: 0.55
- Prefers the agent to act directly — when told "sửa đi và chạy lại", expects it to apply the agreed fix and restart/rerun the processes itself, after which it verifies the result (e.g., checks the new binding and makes a real request) rather than just reporting what to do. Confidence: 0.5
- Wants the agent to work autonomously through to full completion without stopping to report progress and ask for permission to continue at each step — when the agent repeatedly summarized progress and asked "tiếp?" (continue?), the user replied "tiếp tục đến khi hoàn tất" (keep going until it's finished); later, upon another progress summary, the user again pushed "Xong hết chưa làm nốt đi" (finish the rest). Confidence: 0.65
