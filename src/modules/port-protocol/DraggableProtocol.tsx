
import { useDraggable } from "@dnd-kit/core";

// Creates a protocol box that can be dragged or selected.
export default function DraggableProtocol({
  protocol,
  isMatched,
  isSelected = false,
  onSelect,
}: {
  protocol: string;
  isMatched: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: protocol,
      disabled: isMatched,
    });

  // Moves the entire box while dragging.
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    padding: "10px",
    margin: "5px",
    border: isSelected
      ? "2px solid #2563eb"
      : "2px solid gray",
    borderRadius: "8px",
    backgroundColor: isSelected ? "#bfdbfe" : "#e3f2fd",
    color: "#222",
    cursor: "grab",
    touchAction: "none" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    position: "relative" as const,
    zIndex: transform ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {/* The protocol name and surrounding box remain draggable. */}
      <strong>{protocol}</strong>

      {/* Dark button for tap-to-match. */}
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.();
        }}
        disabled={isMatched}
        aria-pressed={isSelected}
        style={{
          padding: "6px 14px",
          backgroundColor: isSelected ? "#1b4332" : "#334155",
          color: "#ffffff",
          border: "1px solid #334155",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "bold",
        }}
      >
        {isSelected ? "Selected ✓" : "Select"}
      </button>
    </div>
  );
}
