import re

def sanitize_extracted_text(text: str) -> str:
    """
    Strips the recurring AISSMS college header from OCR-extracted text.
    Uses regex to clean up pages before processing.
    """
    if not text:
        return text
    
    # Match the full college header block, including optional AICTE/NAAC sub-lines
    pattern = re.compile(
        r'AISSMS\s+INSTITUTE\s+OF[\s\S]*?(Approved\s+by\s+AICTE,\s*New\s+Delhi\s+and\s+Recognised\s+by\s+Govt\.\s+of\s+Maharashtra)?[\s\S]*?(Accredited\s+by\s+NAAC\s+with\s+"A\+"\s+Grade\s*\|\s*NBA-S\s+UG\s+Programmes)?[\s\S]*?Pune\s+University\s*\d*',
        re.IGNORECASE
    )
    return pattern.sub('', text).strip()
base_header_regex = sanitize_extracted_text
