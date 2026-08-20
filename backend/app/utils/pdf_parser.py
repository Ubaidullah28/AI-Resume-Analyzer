import pymupdf as fitz


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from every page of a PDF.

    Args:
        file_path: Path to the PDF file.

    Returns:
        Extracted text as a single string.
    """

    document = fitz.open(file_path)

    pages_text = []

    try:
        for page in document:
            text = page.get_text()

            if text:
                pages_text.append(text)

    finally:
        document.close()

    return "\n".join(pages_text)


def clean_text(text: str) -> str:
    """
    Clean extracted resume text.
    """

    lines = []

    for line in text.splitlines():

        line = line.strip()

        if line:
            lines.append(line)

    return "\n".join(lines)