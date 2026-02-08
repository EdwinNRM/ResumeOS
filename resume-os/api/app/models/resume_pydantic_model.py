from typing import List, Optional, Union, Literal
from pydantic import BaseModel, Field, UUID4

class ResumeBlockBase(BaseModel):
    id: str
    type: str

class NameBlock(ResumeBlockBase):
    type: Literal["name"]
    content: str = Field(..., max_length=100)

class HeadlineBlock(ResumeBlockBase):
    type: Literal["headline"]
    content: str = Field(..., max_length=200)

class SummaryBlock(ResumeBlockBase):
    type: Literal["summary"]
    content: str = Field(..., max_length=2000)

class ExperienceItem(BaseModel):
    role: str
    company: str
    bullets: List[str]

class ExperienceBlock(ResumeBlockBase):
    type: Literal["experience"]
    items: List[ExperienceItem]

class ProjectItem(BaseModel):
    title: str
    bullets: List[str]

class ProjectBlock(ResumeBlockBase):
    type: Literal["project"]
    items: List[ProjectItem]

class EducationItem(BaseModel):
    degree: str
    institution: str

class EducationBlock(ResumeBlockBase):
    type: Literal["education"]
    items: List[EducationItem]

class SkillsBlock(ResumeBlockBase):
    type: Literal["skills"]
    list: List[str]

ResumeBlock = Union[
    NameBlock, 
    HeadlineBlock, 
    SummaryBlock, 
    ExperienceBlock, 
    ProjectBlock, 
    EducationBlock, 
    SkillsBlock
]

class ResumeRequest(BaseModel):
    blocks: List[ResumeBlock]
