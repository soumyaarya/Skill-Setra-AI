"""
Resume Parser Service - Extract text from PDF resumes
Uses PyPDF2 for text extraction.
In production, would use PyTorch-based NER for entity extraction.
"""

from PyPDF2 import PdfReader
from io import BytesIO
from typing import Optional


async def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from a PDF resume file."""
    try:
        reader = PdfReader(BytesIO(file_content))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")


async def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from uploaded file based on extension."""
    if filename.lower().endswith(".pdf"):
        return await extract_text_from_pdf(file_content)
    elif filename.lower().endswith(".txt"):
        return file_content.decode("utf-8")
    else:
        raise ValueError("Unsupported file format. Please upload PDF or TXT files.")
