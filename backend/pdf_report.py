# ============================================
# PDF REPORT GENERATOR - BIG 5 DOERS REPORT
# "Spotify Wrapped" for Careers
# ============================================

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, HRFlowable
from reportlab.graphics.shapes import Drawing, Rect, String, Circle
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

# ============================================
# STYLE DEFINITIONS
# ============================================

def get_custom_styles():
    """Get custom paragraph styles for the report"""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='ReportTitle',
        parent=styles['Heading1'],
        fontSize=28,
        spaceAfter=20,
        textColor=colors.HexColor('#4F46E5'),
        alignment=TA_CENTER
    ))
    
    # Subtitle
    styles.add(ParagraphStyle(
        name='ReportSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=10,
        textColor=colors.HexColor('#6B7280'),
        alignment=TA_CENTER
    ))
    
    # Section header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading2'],
        fontSize=16,
        spaceBefore=20,
        spaceAfter=10,
        textColor=colors.HexColor('#7C3AED'),
        borderPadding=5
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='ReportBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=8,
        textColor=colors.HexColor('#374151'),
        leading=14
    ))
    
    # Score highlight
    styles.add(ParagraphStyle(
        name='ScoreHighlight',
        parent=styles['Normal'],
        fontSize=36,
        textColor=colors.HexColor('#10B981'),
        alignment=TA_CENTER,
        spaceBefore=10,
        spaceAfter=10
    ))
    
    # Caption
    styles.add(ParagraphStyle(
        name='Caption',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#9CA3AF'),
        alignment=TA_CENTER
    ))
    
    return styles

# ============================================
# CHART GENERATORS
# ============================================

def create_doers_score_chart(score: int) -> Drawing:
    """Create a visual representation of DoersScore"""
    d = Drawing(400, 150)
    
    # Background
    d.add(Rect(0, 0, 400, 150, fillColor=colors.HexColor('#F3F4F6'), strokeColor=None))
    
    # Score bar background
    d.add(Rect(50, 60, 300, 30, fillColor=colors.HexColor('#E5E7EB'), strokeColor=None, rx=15))
    
    # Score bar fill
    fill_width = (score / 900) * 300
    d.add(Rect(50, 60, fill_width, 30, fillColor=colors.HexColor('#10B981'), strokeColor=None, rx=15))
    
    # Score text
    d.add(String(200, 110, f"DoersScore™: {score}/900", fontSize=18, fillColor=colors.HexColor('#1F2937'), textAnchor='middle'))
    
    # Level markers
    levels = [(0, "PARA"), (180, "ASSOCIATE"), (360, "MANAGER"), (540, "PROFESSIONAL"), (720, "EXPERT")]
    for pos, label in levels:
        x = 50 + (pos / 900) * 300
        d.add(String(x, 45, label, fontSize=7, fillColor=colors.HexColor('#6B7280'), textAnchor='middle'))
    
    return d

def create_career_interests_chart(interests: Dict[str, int]) -> Drawing:
    """Create a pie chart for career interests (RIASEC)"""
    d = Drawing(300, 200)
    
    pie = Pie()
    pie.x = 100
    pie.y = 30
    pie.width = 100
    pie.height = 100
    
    # Sort interests by value
    sorted_interests = sorted(interests.items(), key=lambda x: x[1], reverse=True)
    
    pie.data = [v for _, v in sorted_interests]
    pie.labels = [f"{k}: {v}%" for k, v in sorted_interests]
    
    # Colors
    chart_colors = [
        colors.HexColor('#8B5CF6'),  # Purple
        colors.HexColor('#EC4899'),  # Pink
        colors.HexColor('#3B82F6'),  # Blue
        colors.HexColor('#10B981'),  # Green
        colors.HexColor('#F59E0B'),  # Amber
        colors.HexColor('#EF4444'),  # Red
    ]
    
    for i, color in enumerate(chart_colors[:len(pie.data)]):
        pie.slices[i].fillColor = color
        pie.slices[i].strokeColor = colors.white
        pie.slices[i].strokeWidth = 2
    
    pie.slices.strokeWidth = 1
    pie.sideLabels = True
    pie.simpleLabels = False
    
    d.add(pie)
    return d

def create_skills_bar_chart(skills: Dict[str, int]) -> Drawing:
    """Create a horizontal bar chart for skills"""
    d = Drawing(400, 200)
    
    # Sort and take top 6
    sorted_skills = sorted(skills.items(), key=lambda x: x[1], reverse=True)[:6]
    
    bc = VerticalBarChart()
    bc.x = 50
    bc.y = 30
    bc.height = 130
    bc.width = 300
    
    bc.data = [[v for _, v in sorted_skills]]
    bc.categoryAxis.categoryNames = [k[:15] for k, _ in sorted_skills]
    bc.categoryAxis.labels.angle = 30
    bc.categoryAxis.labels.fontSize = 8
    
    bc.valueAxis.valueMin = 0
    bc.valueAxis.valueMax = 100
    bc.valueAxis.valueStep = 20
    
    bc.bars[0].fillColor = colors.HexColor('#8B5CF6')
    
    d.add(bc)
    return d

# ============================================
# PDF GENERATOR CLASS
# ============================================

class DoersReportGenerator:
    """
    Generate the BIG 5 DOERS REPORT PDF
    "Spotify Wrapped" for Careers
    """
    
    def __init__(self):
        self.styles = get_custom_styles()
    
    def generate_report(self, profile_data: Dict[str, Any]) -> bytes:
        """
        Generate complete PDF report from profile data
        
        Returns:
            PDF file as bytes
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )
        
        story = []
        
        # ============================================
        # PAGE 1: COVER
        # ============================================
        story.extend(self._create_cover_page(profile_data))
        story.append(PageBreak())
        
        # ============================================
        # PAGE 2: DOERS SCORE OVERVIEW
        # ============================================
        story.extend(self._create_score_page(profile_data))
        story.append(PageBreak())
        
        # ============================================
        # PAGE 3: BIG 5 - CAREER INTERESTS (RIASEC)
        # ============================================
        story.extend(self._create_interests_page(profile_data))
        story.append(PageBreak())
        
        # ============================================
        # PAGE 4: BIG 5 - SKILLS & ABILITIES
        # ============================================
        story.extend(self._create_skills_page(profile_data))
        story.append(PageBreak())
        
        # ============================================
        # PAGE 5: BIG 5 - CAREER RECOMMENDATIONS
        # ============================================
        story.extend(self._create_recommendations_page(profile_data))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.read()
    
    def _create_cover_page(self, data: Dict) -> List:
        """Create the cover page"""
        elements = []
        
        # Spacer for top
        elements.append(Spacer(1, 80))
        
        # Logo placeholder
        elements.append(Paragraph("🎯", ParagraphStyle('Logo', fontSize=60, alignment=TA_CENTER)))
        elements.append(Spacer(1, 20))
        
        # Title
        elements.append(Paragraph("BIG 5 DOERS REPORT", self.styles['ReportTitle']))
        elements.append(Paragraph("Your Career Potential Unwrapped", self.styles['ReportSubtitle']))
        
        elements.append(Spacer(1, 40))
        
        # User info
        name = data.get('name', 'Doer')
        elements.append(Paragraph(f"<b>{name}</b>", ParagraphStyle('Name', fontSize=24, alignment=TA_CENTER, textColor=colors.HexColor('#1F2937'))))
        
        elements.append(Spacer(1, 20))
        
        # Report date
        report_date = datetime.now().strftime("%B %d, %Y")
        elements.append(Paragraph(f"Generated on {report_date}", self.styles['Caption']))
        
        elements.append(Spacer(1, 60))
        
        # DoersScore preview
        doers_score = data.get('doers_score', 650)
        elements.append(Paragraph(f"{doers_score}", self.styles['ScoreHighlight']))
        elements.append(Paragraph("DoersScore™ out of 900", self.styles['Caption']))
        
        elements.append(Spacer(1, 80))
        
        # Footer
        elements.append(HRFlowable(width="80%", thickness=1, color=colors.HexColor('#E5E7EB')))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("Powered by Right Doers™ | HI AI-APP.COM", self.styles['Caption']))
        elements.append(Paragraph("Your Career Transformation Partner", self.styles['Caption']))
        
        return elements
    
    def _create_score_page(self, data: Dict) -> List:
        """Create the DoersScore breakdown page"""
        elements = []
        
        elements.append(Paragraph("📊 Your DoersScore™ Breakdown", self.styles['SectionHeader']))
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#8B5CF6')))
        elements.append(Spacer(1, 20))
        
        # DoersScore chart
        score_chart = create_doers_score_chart(data.get('doers_score', 650))
        elements.append(score_chart)
        elements.append(Spacer(1, 30))
        
        # Score breakdown table
        breakdown_data = [
            ['Component', 'Score', 'Level'],
            ['Natural Fit', f"{data.get('natural_fit', 70)}%", self._get_level(data.get('natural_fit', 70))],
            ['Developed Skills', f"{data.get('developed_skills', 75)}%", self._get_level(data.get('developed_skills', 75))],
            ['Learning Agility', f"{data.get('learning_agility', 80)}%", self._get_level(data.get('learning_agility', 80))],
            ['Efficiency Value', f"{data.get('efficiency_value', 78)}%", self._get_level(data.get('efficiency_value', 78))],
        ]
        
        breakdown_table = Table(breakdown_data, colWidths=[200, 100, 100])
        breakdown_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F9FAFB')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
            ('FONTSIZE', (0, 1), (-1, -1), 11),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        
        elements.append(breakdown_table)
        elements.append(Spacer(1, 30))
        
        # Adaptive Level
        adaptive_level = data.get('adaptive_level', 'ASSOCIATE')
        elements.append(Paragraph(f"<b>Your Adaptive Level:</b> {adaptive_level}", self.styles['ReportBody']))
        
        level_descriptions = {
            'PARA': 'Entry level - Building foundational skills',
            'ASSOCIATE': 'Growing professional - Developing expertise',
            'MANAGER': 'Skilled practitioner - Leading small teams',
            'PROFESSIONAL': 'Expert contributor - Strategic thinker',
            'EXPERT': 'Industry leader - Transformational impact'
        }
        
        elements.append(Paragraph(level_descriptions.get(adaptive_level, ''), self.styles['ReportBody']))
        
        return elements
    
    def _create_interests_page(self, data: Dict) -> List:
        """Create the Career Interests (RIASEC) page"""
        elements = []
        
        elements.append(Paragraph("🎯 BIG 5 #1: Career Interests (RIASEC)", self.styles['SectionHeader']))
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#EC4899')))
        elements.append(Spacer(1, 20))
        
        # Default interests if not provided
        interests = data.get('career_interests', {
            'Artistic': 65,
            'Enterprising': 60,
            'Social': 55,
            'Investigative': 50,
            'Realistic': 45,
            'Conventional': 40
        })
        
        # Chart
        interests_chart = create_career_interests_chart(interests)
        elements.append(interests_chart)
        elements.append(Spacer(1, 20))
        
        # Interest descriptions
        interest_descriptions = {
            'Realistic': 'Hands-on work, practical tasks, tools & machinery',
            'Investigative': 'Research, analysis, problem-solving, science',
            'Artistic': 'Creative expression, design, innovation',
            'Social': 'Helping others, teaching, counseling',
            'Enterprising': 'Leadership, business, persuasion',
            'Conventional': 'Organization, data management, structure'
        }
        
        # Top 3 interests
        sorted_interests = sorted(interests.items(), key=lambda x: x[1], reverse=True)[:3]
        
        elements.append(Paragraph("<b>Your Top 3 Career Interests:</b>", self.styles['ReportBody']))
        elements.append(Spacer(1, 10))
        
        for i, (interest, score) in enumerate(sorted_interests, 1):
            desc = interest_descriptions.get(interest, '')
            elements.append(Paragraph(f"<b>{i}. {interest} ({score}%)</b>: {desc}", self.styles['ReportBody']))
        
        return elements
    
    def _create_skills_page(self, data: Dict) -> List:
        """Create the Skills & Abilities page"""
        elements = []
        
        elements.append(Paragraph("💪 BIG 5 #2: Skills & Abilities", self.styles['SectionHeader']))
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#3B82F6')))
        elements.append(Spacer(1, 20))
        
        # Default skills if not provided
        skills = data.get('skills_abilities', {
            'Communication': 85,
            'Problem Solving': 80,
            'Leadership': 70,
            'Technical Skills': 75,
            'Creativity': 78,
            'Teamwork': 82
        })
        
        # Chart
        skills_chart = create_skills_bar_chart(skills)
        elements.append(skills_chart)
        elements.append(Spacer(1, 20))
        
        # Skills table
        skills_data = [['Skill', 'Score', 'Proficiency']]
        sorted_skills = sorted(skills.items(), key=lambda x: x[1], reverse=True)
        
        for skill, score in sorted_skills:
            proficiency = 'Expert' if score >= 85 else 'Advanced' if score >= 70 else 'Intermediate' if score >= 50 else 'Developing'
            skills_data.append([skill, f"{score}%", proficiency])
        
        skills_table = Table(skills_data, colWidths=[180, 80, 100])
        skills_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F9FAFB')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ]))
        
        elements.append(skills_table)
        
        return elements
    
    def _create_recommendations_page(self, data: Dict) -> List:
        """Create the Career Recommendations page"""
        elements = []
        
        elements.append(Paragraph("🚀 BIG 5 #3-5: Career Recommendations", self.styles['SectionHeader']))
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#10B981')))
        elements.append(Spacer(1, 20))
        
        # Career clusters
        clusters = data.get('career_clusters', [
            {'name': 'Technology & IT', 'match': 85},
            {'name': 'Business & Management', 'match': 78},
            {'name': 'Creative & Design', 'match': 72},
            {'name': 'Healthcare', 'match': 65},
            {'name': 'Education', 'match': 60}
        ])
        
        elements.append(Paragraph("<b>#3 Recommended Career Clusters:</b>", self.styles['ReportBody']))
        elements.append(Spacer(1, 10))
        
        cluster_data = [['Career Cluster', 'Match %', 'Fit']]
        for cluster in clusters[:5]:
            match = cluster.get('match', 0)
            fit = '⭐⭐⭐' if match >= 80 else '⭐⭐' if match >= 60 else '⭐'
            cluster_data.append([cluster.get('name', ''), f"{match}%", fit])
        
        cluster_table = Table(cluster_data, colWidths=[200, 80, 80])
        cluster_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10B981')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F9FAFB')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
        ]))
        
        elements.append(cluster_table)
        elements.append(Spacer(1, 30))
        
        # Action plan
        elements.append(Paragraph("<b>#4 Your 5E Journey Recommendations:</b>", self.styles['ReportBody']))
        elements.append(Spacer(1, 10))
        
        journey_steps = [
            ('🔍 EXPLORE', 'Research industries aligned with your interests'),
            ('📚 EDUCATE', 'Build skills through courses and certifications'),
            ('💼 EMPLOY', 'Gain experience through internships and projects'),
            ('🚀 ENTERPRISE', 'Create impact through leadership and innovation'),
            ('⭐ EXCEL', 'Transform your industry as a thought leader')
        ]
        
        for step, desc in journey_steps:
            elements.append(Paragraph(f"<b>{step}</b>: {desc}", self.styles['ReportBody']))
        
        elements.append(Spacer(1, 30))
        
        # Next steps
        elements.append(Paragraph("<b>#5 Immediate Next Steps:</b>", self.styles['ReportBody']))
        elements.append(Spacer(1, 10))
        
        next_steps = data.get('next_steps', [
            'Complete remaining assessments for a comprehensive profile',
            'Explore Jobs4Me for matched opportunities',
            'Connect with mentors in your recommended clusters',
            'Start building your portfolio with projects',
            'Track your daily progress with Streak System'
        ])
        
        for i, step in enumerate(next_steps, 1):
            elements.append(Paragraph(f"{i}. {step}", self.styles['ReportBody']))
        
        elements.append(Spacer(1, 40))
        
        # Footer
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB')))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("🎯 This report is your roadmap to career success!", ParagraphStyle('Footer', fontSize=12, alignment=TA_CENTER, textColor=colors.HexColor('#7C3AED'))))
        elements.append(Paragraph("Share it, discuss it, and let it guide your journey.", self.styles['Caption']))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("© Right Doers LLP | HI AI-APP.COM | All Rights Reserved", self.styles['Caption']))
        
        return elements
    
    def _get_level(self, score: int) -> str:
        """Get proficiency level from score"""
        if score >= 85:
            return 'Excellent'
        elif score >= 70:
            return 'Good'
        elif score >= 50:
            return 'Average'
        else:
            return 'Developing'

# Singleton instance
report_generator = DoersReportGenerator()
