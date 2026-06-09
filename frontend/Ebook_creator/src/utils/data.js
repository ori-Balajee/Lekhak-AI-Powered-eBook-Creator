import { Lightbulb, BookOpen, Download, Library } from "lucide-react";

export const FEATURES = [
    {
        title: "AI-Powered Writing",

        description:
          "Overcome writer's block with our smart assistant that helps you generate ideas, outlines, and content.",
        icon: Lightbulb,
        gradient: "from-violet-500 to-purple-600",

    },
    {
        title: "Immersive Reading",

        description:
            "Preview your ebook in a clean, read-only format. Adjust font sizes for a comfortable reading experience.",
        icon: BookOpen,
        gradient: "from-blue-500 to-cyan-600",

    },
    {
        title: "One-Click Export",
        description:
            "Export your ebook to PDF, and DOCX formats instantly, ready for publishing",
        icon: Download,
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        title: "eBook Management",
        description:
            "Organize all your ebook projects in a personal dashboard. Easily track progress, edit drafts, and manage your work.",
        icon: Library,
        gradient: "from-rose-500 to-pink-600",
    }
];