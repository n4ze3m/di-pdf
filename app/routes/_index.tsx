import {
  GithubIcon,
  BrainCircuitIcon,
  CodeIcon,
  LayoutTemplateIcon,
  MousePointerClickIcon,
} from "lucide-react";
import { Logo } from "~/components/common/Logo";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
export const meta: any = () => {
  return [
    { title: "DiPDF" },
    { name: "description", content: "DiPDF application " },
  ]
};
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center mt-2" to="/">
          <Logo gradientSize="size-8 mt-2" iconSize="size-5" />
          <span className="ml-2 text-2xl font-bold text-gray-900">DiPDF</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/login"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Logo gradientSize="w-24 h-24" iconSize="w-16 h-16" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                AI-Powered PDF Generation Made Easy
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                DiPDF simplifies PDF creation with AI-driven generation and
                custom templates. Open-source and powerful.
              </p>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">
                  <GithubIcon className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md">
                <BrainCircuitIcon className="h-12 w-12 mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">
                  AI-Powered Generation
                </h3>
                <p className="text-gray-600">
                  Create PDFs effortlessly using AI-driven content generation
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md">
                <CodeIcon className="h-12 w-12 mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">Custom Templates</h3>
                <p className="text-gray-600">
                  Design your own templates using Tailwind CSS and Handlebars
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md">
                <LayoutTemplateIcon className="h-12 w-12 mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">Flexible Platform</h3>
                <p className="text-gray-600">
                  Use our platform to generate PDFs without complex integrations
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <BrainCircuitIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold">1. Choose Your Method</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Opt for AI-generated content or create your own using
                    Tailwind/Handlebars
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <LayoutTemplateIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    2. Design or Select Template
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Use our platform to design custom templates or choose from
                    existing ones
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <MousePointerClickIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold">3. Generate PDF</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Click to generate your PDF directly on our platform - no API
                    integration required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to simplify PDF generation?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Join our open-source community and start creating beautiful PDFs
                with ease.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex justify-center">
                  <Button type="submit">Get Started</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 DiPDF. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
