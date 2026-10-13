import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Field({ label, hint, className, children, htmlFor }) {
  return (
    <div className={cn('grid gap-2', className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
}
