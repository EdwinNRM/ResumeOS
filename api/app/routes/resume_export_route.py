from fastapi import APIRouter, Response
from ..models.resume_pydantic_model import ResumeRequest
# We'll return HTML for the client to print/save as PDF, ensuring server-controlled template.

router = APIRouter()

@router.post("/pdf")
async def export_pdf(resume: ResumeRequest):
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Resume Export</title>
        <style>
            @page { margin: 0; }
            body { 
                font-family: 'Inter', sans-serif; 
                line-height: 1.5; 
                margin: 0; 
                padding: 40px; 
                width: 210mm; 
                min-height: 297mm;
                box-sizing: border-box;
                margin: 0 auto;
                background: white;
                color: black;
            }
            h1 { text-transform: uppercase; margin: 0; font-size: 24pt; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            h2 { text-transform: uppercase; font-size: 14pt; border-bottom: 1px solid #ccc; margin-top: 20px; margin-bottom: 10px; }
            h3 { margin: 0; font-size: 11pt; font-weight: bold; }
            p { margin: 5px 0; font-size: 10pt; text-align: justify; }
            .item { margin-bottom: 15px; }
            .meta { font-style: italic; font-size: 10pt; margin-bottom: 5px; }
            ul { margin: 5px 0; padding-left: 20px; font-size: 10pt; }
            .skills { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill-tag { background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 9pt; }
            
            /* Print-specific tweaks */
            @media print {
                body { width: auto; margin: 0; padding: 15mm; }
                h2 { break-after: avoid; }
                .item { break-inside: avoid; }
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
    """
    
    # Simple block rendering logic
    for block in resume.blocks:
        if block.type == "name":
            html_content += f"<h1>{block.content}</h1>"
        elif block.type == "headline":
            html_content += f"<p style='font-size: 12pt; color: #555; margin-top: -15px; margin-bottom: 20px;'>{block.content}</p>"
        elif block.type == "summary":
            html_content += f"<h2>Summary</h2><p>{block.content}</p>"
        elif block.type == "experience":
            html_content += "<h2>Experience</h2>"
            for item in block.items:
                html_content += f"""
                <div class="item">
                    <div style="display:flex; justify-content:space-between;">
                        <h3>{item.role}</h3>
                        <span>{item.company}</span>
                    </div>
                    <ul>
                        {''.join(f'<li>{b}</li>' for b in item.bullets)}
                    </ul>
                </div>
                """
        elif block.type == "project":
            html_content += "<h2>Projects</h2>"
            for item in block.items:
                html_content += f"""
                <div class="item">
                    <h3>{item.title}</h3>
                    <ul>
                        {''.join(f'<li>{b}</li>' for b in item.bullets)}
                    </ul>
                </div>
                """
        elif block.type == "education":
            html_content += "<h2>Education</h2>"
            for item in block.items:
                html_content += f"""
                <div class="item">
                    <h3>{item.institution}</h3>
                    <div class="meta">{item.degree}</div>
                </div>
                """
        elif block.type == "skills":
            html_content += "<h2>Skills</h2><div class='skills'>"
            html_content += ''.join(f"<span class='skill-tag'>{s}</span>" for s in block.list)
            html_content += "</div>"
            
    html_content += """
    <script>
        window.onload = function() { window.print(); }
    </script>
    </body></html>
    """
    
    return Response(content=html_content, media_type="text/html")
