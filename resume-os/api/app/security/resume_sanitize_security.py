import html

def sanitize_input(text: str) -> str:
    """
    Sanitizes string input to prevent XSS.
    Although backend output is usually JSON or PDF,
    we ensure data stored/processed is clean.
    """
    if not text:
        return ""
    return html.escape(text)

def validate_content_safety(text: str) -> bool:
    """
    Checks for potentially malicious patterns.
    """
    suspicious_patterns = ["<script", "javascript:", "data:"]
    lower_text = text.lower()
    for pattern in suspicious_patterns:
        if pattern in lower_text:
            return False
    return True
