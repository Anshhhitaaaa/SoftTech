import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  PageBreak,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * Converts rich document data into a formatted Word .docx file and triggers a browser download.
 * Validates formatting fidelity (Headings H1-H3, styled data tables, callout boxes, page breaks, fonts).
 */
export async function generateAndDownloadDocx({ title, category, authorName, reviewerName, approverName, status, contentHtml }) {
  // Parse standard elements from contentHtml or build structured sections
  const doc = new Document({
    creator: authorName || "SoftTech Enterprise System",
    title: title || "Enterprise Document Report",
    description: "Generated via SoftTech Word Document Automation System",
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 22, // 11pt
            color: "334155" // slate-700
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 160 // 8pt spacing after
            }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `SoftTech Enterprise System  |  ${category || 'Report'}`,
                    size: 18,
                    color: "94A3B8",
                    italics: true
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Confidential & Proprietary  •  Status: ${status || 'Approved'}  •  Page 1 of 1`,
                    size: 18,
                    color: "94A3B8"
                  })
                ]
              })
            ]
          })
        },
        children: buildDocumentBody({ title, category, authorName, reviewerName, approverName, status, contentHtml })
      }
    ]
  });

  // Pack binary Blob and download using file-saver
  const blob = await Packer.toBlob(doc);
  const cleanFileName = (title || 'document').toLowerCase().replace(/[^a-z0-9]/g, '_') + '.docx';
  saveAs(blob, cleanFileName);
  return true;
}

/**
 * Builds the Word Document body elements (Headings, Metadata Card, Tables, Callout Boxes, Sign-off Block).
 */
function buildDocumentBody({ title, category, authorName, reviewerName, approverName, status, contentHtml }) {
  const elements = [];

  // Title Banner
  elements.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: title || "Enterprise Access & Security Audit Report",
          bold: true,
          size: 40, // 20pt
          color: "1E1B4B" // indigo-950
        })
      ]
    })
  );

  // Subtitle / Category Pill
  elements.push(
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `CATEGORY: `,
          bold: true,
          size: 18,
          color: "4F46E5"
        }),
        new TextRun({
          text: `${category || 'Audit & Compliance Report'}   |   STATUS: `,
          size: 18,
          color: "64748B"
        }),
        new TextRun({
          text: `${status || 'Approved'}`,
          bold: true,
          size: 18,
          color: status === 'Approved' ? '059669' : 'D97706'
        })
      ]
    })
  );

  // Metadata Table Block
  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createTableCell("Author (Normal User):", true, "F8FAFC", "64748B"),
            createTableCell(authorName || "Rahul Sharma (Senior Architect)", false, "F8FAFC", "1E293B"),
            createTableCell("Generated Date:", true, "F8FAFC", "64748B"),
            createTableCell(new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }), false, "F8FAFC", "1E293B")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Reviewed By:", true, "F8FAFC", "64748B"),
            createTableCell(reviewerName || "Priya Patel (General Manager)", false, "F8FAFC", "1E293B"),
            createTableCell("Final Approver:", true, "F8FAFC", "64748B"),
            createTableCell(approverName || "Kavita Singh (General Manager)", false, "F8FAFC", "1E293B")
          ]
        })
      ]
    })
  );

  // Horizontal Divider Spacing
  elements.push(new Paragraph({ spacing: { after: 240 } }));

  // Executive Summary Heading (H1)
  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 140 },
      children: [
        new TextRun({
          text: "1. Executive Summary",
          bold: true,
          size: 28, // 14pt
          color: "312E81"
        })
      ]
    })
  );

  // Summary Paragraph
  elements.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "This document contains formal security policy audits and access configuration verification for organizational units. It validates user group roles, DMS document rights (full_control vs read_only), and workflow reviewer/approver assignments."
        })
      ]
    })
  );

  // Callout Box
  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "EEF2FF" }, // indigo-50
              borders: {
                left: { style: BorderStyle.SINGLE, size: 24, color: "4F46E5" },
                top: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE }
              },
              children: [
                new Paragraph({
                  spacing: { before: 120, after: 120, left: 180, right: 180 },
                  children: [
                    new TextRun({ text: "AUDIT NOTE: ", bold: true, color: "4F46E5", size: 20 }),
                    new TextRun({ text: "All access privilege overrides have been verified against zero-trust policy guidelines and signed off by authorized department heads.", size: 20, color: "334155" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  );

  elements.push(new Paragraph({ spacing: { after: 240 } }));

  // Section 2: Formatted Data Table (H2)
  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 140 },
      children: [
        new TextRun({
          text: "2. System Access & Policy Compliance Matrix",
          bold: true,
          size: 24, // 12pt
          color: "312E81"
        })
      ]
    })
  );

  // Sample Data Table
  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createTableCell("User Group / Role", true, "312E81", "FFFFFF"),
            createTableCell("Office Scope", true, "312E81", "FFFFFF"),
            createTableCell("DMS Rights", true, "312E81", "FFFFFF"),
            createTableCell("Workflow Role", true, "312E81", "FFFFFF"),
            createTableCell("Compliance", true, "312E81", "FFFFFF")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Security Lead Policy", false, "FFFFFF", "1E293B"),
            createTableCell("Headquarters - New Delhi", false, "FFFFFF", "475569"),
            createTableCell("full_control", false, "FFFFFF", "059669"),
            createTableCell("Approver", false, "FFFFFF", "6D28D9"),
            createTableCell("VERIFIED", true, "FFFFFF", "059669")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Regional IT Reviewers", false, "F8FAFC", "1E293B"),
            createTableCell("Zone East & West Offices", false, "F8FAFC", "475569"),
            createTableCell("read_only", false, "F8FAFC", "0284C7"),
            createTableCell("Reviewer", false, "F8FAFC", "4F46E5"),
            createTableCell("VERIFIED", true, "F8FAFC", "059669")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Individual Privilege Overrides", false, "FFFFFF", "1E293B"),
            createTableCell("Branch & Site Offices", false, "FFFFFF", "475569"),
            createTableCell("full_control", false, "FFFFFF", "059669"),
            createTableCell("Reviewer", false, "FFFFFF", "4F46E5"),
            createTableCell("VERIFIED", true, "FFFFFF", "059669")
          ]
        })
      ]
    })
  );

  elements.push(new Paragraph({ spacing: { after: 240 } }));

  // Custom User Rich Text Content Section (H2)
  if (contentHtml && contentHtml.trim()) {
    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 140 },
        children: [
          new TextRun({
            text: "3. User Custom Editor Notes & Addendum",
            bold: true,
            size: 24,
            color: "312E81"
          })
        ]
      })
    );

    // Strip HTML tags for clean text insertion in Word paragraph
    const cleanText = contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    elements.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: cleanText || "Custom report notes submitted by normal user." })
        ]
      })
    );
  }

  // Page Break Demonstration
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // Section 4: Sign-off & Workflow Approval Signatures (H2)
  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 140 },
      children: [
        new TextRun({
          text: "4. Workflow Sign-off & Audit Authorization",
          bold: true,
          size: 24,
          color: "312E81"
        })
      ]
    })
  );

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createTableCell("Stage 1: Normal User Submission", true, "F1F5F9", "334155"),
            createTableCell("Stage 2: Reviewer Endorsement", true, "F1F5F9", "334155"),
            createTableCell("Stage 3: Approver Finalization", true, "F1F5F9", "334155")
          ]
        }),
        new TableRow({
          children: [
            createTableCell(`Prepared by:\n${authorName || 'Rahul Sharma'}\nStatus: Completed`, false, "FFFFFF", "475569"),
            createTableCell(`Reviewed by:\n${reviewerName || 'Priya Patel'}\nStatus: Endorsed`, false, "FFFFFF", "475569"),
            createTableCell(`Approved by:\n${approverName || 'Kavita Singh'}\nStatus: Finalized & Published`, false, "FFFFFF", "059669")
          ]
        })
      ]
    })
  );

  return elements;
}

/**
 * Helper to create a styled TableCell in docx
 */
function createTableCell(text, isHeader = false, bgColor = "FFFFFF", textColor = "000000") {
  return new TableCell({
    shading: { fill: bgColor },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" }
    },
    children: [
      new Paragraph({
        alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            size: isHeader ? 20 : 18,
            color: textColor
          })
        ]
      })
    ]
  });
}
