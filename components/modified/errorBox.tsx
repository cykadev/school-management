import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ErrorBoxProps {
  errorMessage: string;
}

export default function ErrorBox({ errorMessage }: ErrorBoxProps) {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4 text-destructive" />
        <AlertTitle>Oops!</AlertTitle>
        <AlertDescription>
          <p>{errorMessage}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
