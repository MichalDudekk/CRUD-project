import { Github } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t bg-background/95 py-6 mt-auto">
            <div className="container mx-auto flex items-center justify-center text-sm text-muted-foreground">
                <a
                    href="https://github.com/MichalDudekk"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                    <Github className="h-4 w-4" />
                    github.com/MichalDudekk
                </a>
            </div>
        </footer>
    );
};
