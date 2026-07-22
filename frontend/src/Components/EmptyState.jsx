import { SearchX } from "lucide-react";

export default function EmptyState({ 
  title = "No data found", 
  description = "We couldn't find any information at the moment. Please check back later or try a different filter.",
  icon: Icon = SearchX,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/50 animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
        <div className="relative bg-surface-container-low p-5 rounded-2xl shadow-sm border border-outline-variant/30">
          <Icon className="w-12 h-12 text-primary/60" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-on-surface mb-2">
        {title}
      </h3>
      <p className="text-on-surface-variant max-w-sm mx-auto mb-8 font-body-md leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label-md hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
