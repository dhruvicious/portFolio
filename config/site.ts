import { FileText, FolderGit2, Linkedin, PenSquare } from "lucide-react";

export const siteConfig = {
  navLinks: [
    {
      href: "https://blog.bedhruvicious.co.in",
      iconType: "PenSquare",
      label: "Blog",
    },
    {
      href: "/resume.pdf",
      iconType: "FileText",
      label: "Resume",
      external: true,
    },
    {
      href: "https://github.com/dhruvicious",
      iconType: "FolderGit2",
      label: "Github",
    },
    {
      href: "https://www.linkedin.com/in/bedhruvicious/",
      iconType: "Linkedin",
      label: "LinkedIn",
    },
  ],
};
