import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function BackButton({
  path,
  style,
  useOnlyCustomStyle = false,
}: {
  path: string;
  style?: string;
  useOnlyCustomStyle?: boolean;
}) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className={
        !useOnlyCustomStyle
          ? `backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors ${style}`
          : style
      }
      onClick={() => router.push(path)}
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  );
}
