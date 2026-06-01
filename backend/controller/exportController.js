const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    UnderlineType,
    ImageRun,
}= require("docx");

const PDFDocument = require("pdfkit");
const MarkdownIt = require("markdown-it");
const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

const md = new MarkdownIt();

//Typography configuration matching the pdf export
const DOCX_STYLES ={
    fonts: {
        body:"Charter",
        heading:"Inter",
    },
    sizes: {
        title: 32,
        subtitle:20,
        author:18,
        chapterTitle:24,
        h1:20,
        h2:18,
        h3:16,
        body:12,
    },
    spacing:{
        paragraphBefore: 200,
        paragraphAfter: 200,
        chapterBefore: 400,
        chapterAfter: 300,
        headingBefore: 300,
        headingAfter: 150,
    },
};

const exportAsDocument = async (req,res) =>{
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({message: "Book not found"});
        }

        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized"});
        }

        const sections = [];

        // cover page with image if available
        const coverPage=[];

        if(book.coverImage && !book.coverImage.includes("pravatar")){
            const imagePath = book.coverImage.substring(1);
        
            try{
                if(fs.existsSync(imagePath)){
                    const imageBuffer = fs.readFileSync(imagePath);

                    //Add some top spacing
                    coverPage.push(
                        new Paragraph({
                            text:"",
                            spacing:{before: 1000},
                        })
                    );

                    //Add image centered on page
                    coverPage.push(
                        new Paragraph({
                            children:[
                                new ImageRun({
                                    data: imageBuffer,
                                    transformation:{
                                        width: 400,
                                        height:550,
                                    },
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: {before:200, after:400},
                        })
                    );

                    //page break after cover
                    coverPage.push(
                        new Paragraph({
                            text:"",
                            pageBreakBefore: true,
                        })
                    );
                }
            } catch(imgErr){
                console.error(`could not embed image: ${imagePath}`, imgErr);
            }
        }

        sections.push(...coverPage);

        //title page section
        const titlePage = [];

        //main title
        titlePage.push(
            new Paragraph({
                children:[
                    new TextRun({
                        text: book.title,
                        bold: true,
                        font: DOCX_STYLES.fonts.heading,
                        size: DOCX_STYLES.sizes.title * 2,
                        color: "1A202C",
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing:{before:2000, after:400},
            })
        );

        //Subtitle if exist
        if(book.subtitle && book.subtitle.trim()){
            titlePage.push(
                new Paragraph({
                    children:[
                        new TextRun({
                            text: book.subtitle,
                            font: DOCX_STYLES.fonts.heading,
                            size: DOCX_STYLES.sizes.subtitle * 2,
                            color: "4A5568",
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing:{ after:400},
                })
            );
        }

        //Author
        titlePage.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `by ${book.author}`,
                        font : DOCX_STYLES.fonts.heading,
                        size: DOCX_STYLES.sizes.author * 2,
                        color: "2D3748",
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: {after:200},
            })
        );

        // Decorative line
        titlePage.push(
            new Paragraph({
                text: "",
                border: {
                    bottom:{
                        color: "4F46E5",
                        space: 1,
                        style: "single",
                        size: 12, 
                    },
                },
                alignment: AlignmentType.CENTER,
                spacing:{before:400},
            })
        );

        sections.push(...titlePage);

        //process chapters
        book.chapters.forEach((chapter, index) =>{
            try{
                //page break before each chapter (except first)
                if(index > 0){
                    sections.push(
                        new Paragraph({
                            text : "" ,
                            pageBreakBefore: true,
                        })
                    );
                }

                //chapter title
                sections.push(
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: chapter.title,
                                bold: true,
                                font: DOCX_STYLES.fonts.heading,
                                size: DOCX_STYLES.sizes.chapterTitle * 2,
                                color: "1A202C",
                            }),
                        ],
                        spacing:{
                            before: DOCX_STYLES.spacing.chapterBefore,
                            after: DOCX_STYLES.spacing.chapterAfter,
                        },
                    })
                );

                //Chapter content
                const contentParagraphs = processMarkdownToDocx(chapter.content || "");
                sections.push(...contentParagraphs);
            }catch(chapterError){
                console.log(`Error processing chapter ${index}:`, chapterError);
            }
        });

        //Create the document
        const doc = new Document({
            sections:[
                {
                    properties:{
                        page:{
                            margin:{
                                top:1440,
                                right:1440,
                                bottom:1440,
                                left: 1440,
                            },
                        },
                    },
                    children: sections,
                },
            ],
        });

        //Generate the document buffer
        const buffer = await Packer.toBuffer(doc);

        //Send the document
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g,"_")}.docx"`
        );
        res.setHeader("Content-Length", buffer.length);

        res.send(buffer);
    } catch (error){
        console.log("Error exporting document:", error);
        if(!res.headersSent){
            res.status(500).json({
                message: "Server error during document export",
                error: error.message,
            });
        }
    }

};