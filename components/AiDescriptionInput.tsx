// components/AIProductDescription.tsx
import { useState } from "react";
import { set, PatchEvent } from "sanity";
import { useFormValue } from "sanity";

interface AIProductDescriptionProps {
  value: string;
  onChange: (event: PatchEvent) => void;
  readOnly?: boolean;
}

export default function AIProductDescription({ 
  value, 
  onChange, 
  readOnly 
}: AIProductDescriptionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get parent document data directly using Sanity's useFormValue hook
  const name = useFormValue(['name']) as string;
  const paintingStyle = useFormValue(['paintingStyle']) as string;
  const dimensions = useFormValue(['dimensions']) as any;
  const materialRef = useFormValue(['material']) as { _ref: string } | null;
  const parsedDimensions = {
    length: {
      value: dimensions?.length?.value || null,
      unitRef: dimensions?.length?.unit?._ref || null,
    },
    width: {
      value: dimensions?.width?.value || null,
      unitRef: dimensions?.width?.unit?._ref || null,
    },
    height: {
      value: dimensions?.height?.value || null,
      unitRef: dimensions?.height?.unit?._ref || null,
    },
  };
  const generate = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/generate-description", {
        method: "POST",
        body: JSON.stringify({
          name: name || "",
          materialRef: materialRef?._ref || "",
          paintingStyle: paintingStyle || "",
          dimensions: parsedDimensions || {},
        }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`Error generating description: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.description) {
        onChange(PatchEvent.from(set(data.description)));
      } else {
        throw new Error("No description received from API");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error generating description:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <textarea 
        value={value || ""} 
        onChange={(e) => onChange(PatchEvent.from(set(e.target.value)))}
        className="p-3 border border-gray-300 rounded-md w-full min-h-[120px] resize-y"
        placeholder="Product description will appear here..."
        rows={4}
        readOnly={readOnly}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {!readOnly && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className={`
              px-4 py-2 rounded-md text-white font-medium
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
              transition-colors duration-200
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate with AI"
            )}
          </button>
        </div>
      )}
    </div>
  );
}