import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Layers } from "lucide-react";

export default function FoundationStatusPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
      <Card className="w-full shadow-sm border-stone-200 bg-white">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-teal-600 text-teal-700 bg-teal-50">
              P13 Foundation Phase 1B
            </Badge>
            <span className="text-xs text-stone-500 font-mono">fincraft-lab-web</span>
          </div>
          <CardTitle className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-teal-600" />
            FinCraft Lab — Frontend Foundation Ready
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-stone-50 border-stone-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-stone-900 font-medium">Foundation Stack Verified</AlertTitle>
            <AlertDescription className="text-stone-600 text-sm mt-1">
              Next.js 16 App Router, TypeScript strict, Tailwind v4, ESLint, pnpm 11.15.1,
              shadcn radix base primitives, TanStack Query, and Sonner Toaster are operational.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border border-stone-200 p-4 bg-stone-50/50 space-y-2">
            <p className="text-sm font-semibold text-stone-800">Next Recommended Step:</p>
            <p className="text-sm text-stone-600">
              <span className="font-mono text-teal-700">
                P13_FRONTEND_FOUNDATION_1C_TASTESKILL_AND_DESIGN_SYSTEM_LAB_001
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
